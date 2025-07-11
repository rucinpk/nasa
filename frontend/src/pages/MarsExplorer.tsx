import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Camera, Calendar, Filter, Image, Download, ExternalLink, Loader } from 'lucide-react';
import { nasaApi } from '../services/api';
import { MarsRoverPhoto, MarsRoverResponse } from '../types/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

type RoverKey = 'curiosity' | 'opportunity' | 'spirit';

interface RoverInfo {
  name: string;
  landing_date: string;
  max_sol: number;
  cameras: string[];
}

const MarsExplorer = () => {
  const [selectedRover, setSelectedRover] = useState<RoverKey>('curiosity');
  const [sol, setSol] = useState('1000');
  const [camera, setCamera] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<MarsRoverPhoto | null>(null);

  const rovers: Record<RoverKey, RoverInfo> = {
    curiosity: {
      name: 'Curiosity',
      landing_date: '2012-08-05',
      max_sol: 3000,
      cameras: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM']
    },
    opportunity: {
      name: 'Opportunity',
      landing_date: '2004-01-25',
      max_sol: 5111,
      cameras: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES']
    },
    spirit: {
      name: 'Spirit',
      landing_date: '2004-01-04',
      max_sol: 2208,
      cameras: ['FHAZ', 'RHAZ', 'NAVCAM', 'PANCAM', 'MINITES']
    }
  };

  const { data, isLoading, error } = useQuery<MarsRoverResponse>(
    ['mars-photos', selectedRover, sol, camera],
    () => nasaApi.getMarsPhotos({ 
      rover: selectedRover, 
      sol: sol, 
      camera: camera || undefined 
    }),
    {
      enabled: Boolean(sol),
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to fetch Mars photos');
      }
    }
  );

  const handleSolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSol = event.target.value;
    const maxSol = rovers[selectedRover].max_sol;
    
    if (parseInt(newSol) > maxSol) {
      toast.error(`Sol cannot exceed ${maxSol} for ${rovers[selectedRover].name}`);
      return;
    }
    
    setSol(newSol);
  };

  const handleDownload = (photo: MarsRoverPhoto) => {
    const link = document.createElement('a');
    link.href = photo.img_src;
    link.download = `mars-${selectedRover}-sol${sol}-${photo.id}.jpg`;
    link.click();
  };

  const PhotoModal = ({ photo, onClose }: { photo: MarsRoverPhoto; onClose: () => void }) => (
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
            <h3 className="text-xl font-bold">{photo.camera.full_name}</h3>
            <p className="text-gray-400">Sol {photo.sol} • {photo.earth_date}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload(photo)}
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
        <img
          src={photo.img_src}
          alt={`Mars photo from ${photo.camera.full_name}`}
          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
        />
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
            <span className="bg-gradient-to-r from-cosmic-orange to-cosmic-pink bg-clip-text text-transparent">
              Mars Explorer
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Journey to the Red Planet through the eyes of NASA's Mars rovers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-gray-300 mb-2">
                <Camera className="h-4 w-4" />
                <span>Select Rover</span>
              </label>
              <select
                value={selectedRover}
                onChange={(e) => setSelectedRover(e.target.value as RoverKey)}
                className="w-full bg-space-800 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
              >
                {Object.entries(rovers).map(([key, rover]) => (
                  <option key={key} value={key}>
                    {rover.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-300 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Sol (Mars Day)</span>
              </label>
              <input
                type="number"
                value={sol}
                onChange={handleSolChange}
                min="1"
                max={rovers[selectedRover].max_sol}
                className="w-full bg-space-800 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-300 mb-2">
                <Filter className="h-4 w-4" />
                <span>Camera Filter</span>
              </label>
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="w-full bg-space-800 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
              >
                <option value="">All Cameras</option>
                {rovers[selectedRover].cameras.map((cam: string) => (
                  <option key={cam} value={cam}>
                    {cam}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 p-4 bg-cosmic-orange/10 rounded-lg border border-cosmic-orange/20">
            <h3 className="font-semibold text-cosmic-orange mb-2">
              {rovers[selectedRover].name} Information
            </h3>
            <p className="text-gray-300 text-sm">
              Landing Date: {rovers[selectedRover].landing_date} • 
              Max Sol: {rovers[selectedRover].max_sol} • 
              Available Cameras: {rovers[selectedRover].cameras.length}
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-4">
                <Skeleton height={200} className="mb-4" />
                <Skeleton height={20} width="80%" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-4">No photos available</h3>
              <p className="text-gray-300">
                Try adjusting the sol number or camera filter. Some sols may not have any photos.
              </p>
            </div>
          </div>
        ) : data?.photos && data.photos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {data.photos.length} Photos Found
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Image className="h-4 w-4" />
                <span>Sol {sol}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative">
                    <img
                      src={photo.img_src}
                      alt={`Mars photo from ${photo.camera.full_name}`}
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
                    <h3 className="font-semibold mb-2">{photo.camera.full_name}</h3>
                    <p className="text-sm text-gray-400">
                      Sol {photo.sol} • {photo.earth_date}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4">No photos found</h3>
              <p className="text-gray-300">
                No photos were taken on Sol {sol}. Try a different sol number or remove the camera filter.
              </p>
            </div>
          </div>
        )}

        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MarsExplorer; 