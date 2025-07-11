import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Search as SearchIcon, Filter, Image, Video, Play, Download, ExternalLink } from 'lucide-react';
import { nasaApi } from '../services/api';
import { MediaSearchItem, MediaSearchResponse } from '../types/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

const Search = () => {
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaSearchItem | null>(null);

  const { data, isLoading, error } = useQuery<MediaSearchResponse>(
    ['search', submittedQuery, mediaType],
    () => nasaApi.searchMedia(submittedQuery, { media_type: mediaType }),
    {
      enabled: Boolean(submittedQuery),
      onError: (error: any) => {
        toast.error(error?.message || 'Search failed. Please try again.');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSubmittedQuery(query.trim());
    }
  };

  const handleDownload = (media: MediaSearchItem) => {
    const imageUrl = media.links?.[0]?.href;
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `nasa-${media.data[0].nasa_id}.jpg`;
      link.click();
    }
  };

  const MediaModal = ({ media, onClose }: { media: MediaSearchItem; onClose: () => void }) => {
    const mediaData = media.data[0];
    const mediaLinks = media.links || [];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="max-w-4xl w-full glass-card p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{mediaData.title}</h3>
              <p className="text-gray-400">{mediaData.center} • {mediaData.date_created?.split('T')[0]}</p>
            </div>
            <div className="flex gap-2">
              {mediaLinks[0] && (
                <button
                  onClick={() => handleDownload(media)}
                  className="p-2 bg-cosmic-blue/20 text-cosmic-blue rounded-lg hover:bg-cosmic-blue/30 transition-colors"
                >
                  <Download className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          <div className="mb-4">
            {mediaData.media_type === 'image' ? (
              <img
                src={mediaLinks[0]?.href}
                alt={mediaData.title}
                className="w-full h-auto max-h-[50vh] object-contain rounded-lg"
              />
            ) : (
              <div className="relative">
                <video
                  src={mediaLinks[0]?.href}
                  poster={mediaLinks[1]?.href}
                  controls
                  className="w-full h-auto max-h-[50vh] object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {mediaData.description || 'No description available.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400">NASA ID:</span> {mediaData.nasa_id}</p>
                  <p><span className="text-gray-400">Media Type:</span> {mediaData.media_type}</p>
                  <p><span className="text-gray-400">Center:</span> {mediaData.center}</p>
                  <p><span className="text-gray-400">Date:</span> {mediaData.date_created?.split('T')[0]}</p>
                </div>
              </div>
              {mediaData.keywords && mediaData.keywords.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {mediaData.keywords.slice(0, 10).map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cosmic-blue/20 text-cosmic-blue rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-space font-bold mb-4">
            <span className="bg-gradient-to-r from-cosmic-pink to-cosmic-purple bg-clip-text text-transparent">
              Media Search
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Explore NASA's vast collection of images and videos from space missions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for space images, missions, planets..."
                    className="w-full pl-10 pr-4 py-3 bg-space-800 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="bg-space-800 text-white px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
                  >
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cosmic-pink to-cosmic-purple text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cosmic-pink/25 transition-all duration-300 transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {submittedQuery && (
            <div className="mt-4 p-4 bg-cosmic-pink/10 rounded-lg border border-cosmic-pink/20">
              <p className="text-cosmic-pink">
                Searching for: <span className="font-semibold">"{submittedQuery}"</span> in {mediaType}s
              </p>
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="glass-card p-4">
                <Skeleton height={200} className="mb-4" />
                <Skeleton height={20} width="80%" className="mb-2" />
                <Skeleton height={16} width="60%" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Search Error</h3>
              <p className="text-gray-300">
                {(error as any)?.message || 'Failed to search media. Please try again.'}
              </p>
            </div>
          </div>
        ) : data?.collection?.items && data.collection.items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {data.collection.metadata.total_hits} Results Found
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                {mediaType === 'image' ? <Image className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                <span>{mediaType}s</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.collection.items.map((item, index) => {
                const mediaData = item.data[0];
                const mediaLinks = item.links || [];
                
                return (
                  <motion.div
                    key={mediaData.nasa_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <div className="relative">
                      {mediaData.media_type === 'image' ? (
                        <img
                          src={mediaLinks[0]?.href}
                          alt={mediaData.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="relative">
                          <img
                            src={mediaLinks[1]?.href || '/placeholder-video.jpg'}
                            alt={mediaData.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">View Details</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {mediaData.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {mediaData.center} • {mediaData.date_created?.split('T')[0]}
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-3">
                        {mediaData.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : submittedQuery ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">No Results Found</h3>
              <p className="text-gray-300">
                No {mediaType}s found for "{submittedQuery}". Try different keywords or search terms.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">Start Your Search</h3>
              <p className="text-gray-300">
                Enter keywords to explore NASA's media collection. Try searching for missions, planets, or spacecraft.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {['Mars', 'ISS', 'Hubble', 'Saturn', 'Apollo', 'Nebula'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      setSubmittedQuery(suggestion);
                    }}
                    className="px-3 py-1 bg-cosmic-blue/20 text-cosmic-blue rounded-full text-sm hover:bg-cosmic-blue/30 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMedia && (
          <MediaModal
            media={selectedMedia}
            onClose={() => setSelectedMedia(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Search; 