import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Calendar, Info, ExternalLink, Download, Share2, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { nasaApi } from '../services/api';
import { APODResponse } from '../types/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

const APOD = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [favorites, setFavorites] = useState(new Set<string>());

  const { data: rawData, isLoading, error } = useQuery(
    ['apod', selectedDate],
    () => nasaApi.getAPOD({ date: selectedDate }),
    {
      onError: (error: any) => {
        toast.error(error.message);
      }
    }
  );

  // Handle the union type - ensure we get a single APOD response
  const data: APODResponse | null = rawData 
    ? Array.isArray(rawData) 
      ? rawData[0] || null 
      : rawData
    : null;

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (newDate > today) {
      toast.error('Cannot select future dates');
      return;
    }
    
    setSelectedDate(newDate);
  };

  const handleShare = async () => {
    if (navigator.share && data) {
      try {
        await navigator.share({
          title: data.title,
          text: data.explanation,
          url: window.location.href
        });
      } catch (error) {
        toast.error('Share failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (data && data.url) {
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `apod-${selectedDate}.jpg`;
      link.click();
    }
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favorites);
    if (favorites.has(selectedDate)) {
      newFavorites.delete(selectedDate);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(selectedDate);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error loading APOD</h2>
          <p className="text-gray-300">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-space font-bold mb-4">
            <span className="bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
              Astronomy Picture of the Day
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover the cosmos through NASA's daily featured astronomy images
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-cosmic-blue" />
              <label htmlFor="date" className="text-gray-300">Select Date:</label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="bg-space-800 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="glass-card p-6">
              <Skeleton height={400} className="mb-4" />
              <Skeleton height={30} width="70%" className="mb-4" />
              <Skeleton count={3} />
            </div>
          </div>
        ) : data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="relative">
              {data.media_type === 'image' ? (
                <img
                  src={data.url}
                  alt={data.title}
                  className="w-full h-64 sm:h-96 lg:h-[500px] object-cover"
                />
              ) : (
                <iframe
                  src={data.url}
                  title={data.title}
                  className="w-full h-64 sm:h-96 lg:h-[500px]"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
              
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full glass-card hover:bg-white/20 transition-colors ${
                    favorites.has(selectedDate) ? 'text-red-500' : 'text-white'
                  }`}
                >
                  <Heart className="h-5 w-5" fill={favorites.has(selectedDate) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full glass-card hover:bg-white/20 transition-colors text-white"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                {data.media_type === 'image' && (
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-full glass-card hover:bg-white/20 transition-colors text-white"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">
                  {data.title}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(selectedDate), 'MMMM d, yyyy')}</span>
                </div>
              </div>

              {data.copyright && (
                <p className="text-sm text-gray-400 mb-4">
                  © {data.copyright}
                </p>
              )}

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-cosmic-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Explanation</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {data.explanation}
                    </p>
                  </div>
                </div>

                {data.hdurl && (
                  <div className="pt-4 border-t border-white/10">
                    <a
                      href={data.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-cosmic-blue hover:text-cosmic-purple transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View High Resolution Image</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default APOD; 