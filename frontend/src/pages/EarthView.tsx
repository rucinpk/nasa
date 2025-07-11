import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Globe, Calendar, Download, ExternalLink, Info, Satellite } from 'lucide-react';
import { format } from 'date-fns';
import { nasaApi } from '../services/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { EPICImage } from '../types/api';

const EarthView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedImage, setSelectedImage] = useState<EPICImage | null>(null);

  const { data, isLoading, error } = useQuery(
    ['epic', selectedDate],
    () => nasaApi.getEarthImages({ date: selectedDate }),
    {
      onError: (error: any) => {
        toast.error(error.message);
      }
    }
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (newDate > today) {
      toast.error('Cannot select future dates');
      return;
    }
    
    setSelectedDate(newDate);
  };

  const getImageUrl = (image: EPICImage) => {
    const date = selectedDate.replace(/-/g, '/');
    return `https://api.nasa.gov/EPIC/archive/natural/${date}/png/${image.image}.png?api_key=DEMO_KEY`;
  };

  const handleDownload = (image: EPICImage) => {
    const link = document.createElement('a');
    link.href = getImageUrl(image);
    link.download = `earth-${selectedDate}-${image.image}.png`;
    link.click();
  };

  const ImageModal = ({ image, onClose }: { image: EPICImage, onClose: () => void }) => (
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
        className="max-w-4xl w-full glass-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Earth from EPIC</h3>
            <p className="text-gray-400">
              {format(new Date(image.date), 'MMM dd, yyyy HH:mm')} UTC
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload(image)}
              className="p-2 bg-cosmic-blue/20 text-cosmic-blue rounded-lg hover:bg-cosmic-blue/30 transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <img
            src={getImageUrl(image)}
            alt={`Earth on ${format(new Date(image.date), 'MMM dd, yyyy')}`}
            className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Coordinates</h4>
            <p className="text-gray-300">
              Latitude: {image.centroid_coordinates?.lat?.toFixed(4)}°<br/>
              Longitude: {image.centroid_coordinates?.lon?.toFixed(4)}°
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Sun Position</h4>
            <p className="text-gray-300">
              J2000: {image.dscovr_j2000_position?.x?.toFixed(0)}, {image.dscovr_j2000_position?.y?.toFixed(0)}, {image.dscovr_j2000_position?.z?.toFixed(0)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

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
            <span className="bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
              Earth View
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            See our planet from space through NASA's EPIC camera
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
              <Skeleton height={300} className="mb-4" />
              <Skeleton height={20} width="50%" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card p-4">
                  <Skeleton height={200} className="mb-4" />
                  <Skeleton height={20} width="80%" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">No images available</h3>
              <p className="text-gray-300">
                No EPIC images were captured on {format(new Date(selectedDate), 'MMM dd, yyyy')}. 
                Try selecting a different date.
              </p>
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured Image</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Satellite className="h-4 w-4" />
                  <span>EPIC Camera</span>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src={getImageUrl(data[0])}
                  alt={`Earth on ${format(new Date(data[0].date), 'MMM dd, yyyy')}`}
                  className="w-full h-64 sm:h-96 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedImage(data[0])}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-white font-semibold">
                    {format(new Date(data[0].date), 'MMMM dd, yyyy HH:mm')} UTC
                  </p>
                  <p className="text-gray-300 text-sm">
                    Click to view full resolution image
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  All Images ({data.length})
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Info className="h-4 w-4" />
                  <span>Captured every 2 hours</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((image, index) => (
                  <motion.div
                    key={image.identifier}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(image)}
                        alt={`Earth on ${format(new Date(image.date), 'MMM dd, yyyy')}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">View Full Size</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">
                        {format(new Date(image.date), 'HH:mm')} UTC
                      </h4>
                      <p className="text-sm text-gray-400">
                        Lat: {image.centroid_coordinates?.lat?.toFixed(2)}°, 
                        Lon: {image.centroid_coordinates?.lon?.toFixed(2)}°
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold mb-4">About EPIC</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Mission Overview</h4>
                  <p className="text-gray-300 text-sm">
                    The Earth Polychromatic Imaging Camera (EPIC) is a 10-channel spectroradiometer 
                    aboard the NOAA DSCOVR satellite. It provides daily full-disk color images of Earth 
                    from the first Lagrange point (L1), approximately 1.5 million km from Earth.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Image Details</h4>
                  <p className="text-gray-300 text-sm">
                    Images are captured approximately every 2 hours, showing Earth's rotation and 
                    weather patterns. The camera uses multiple wavelengths to create enhanced color 
                    images that reveal atmospheric and surface features.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">No images available</h3>
              <p className="text-gray-300">
                No EPIC images were captured on this date. Try selecting a different date.
              </p>
            </div>
          </div>
        )}

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EarthView; 