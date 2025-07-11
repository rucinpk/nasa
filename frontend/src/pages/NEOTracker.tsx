import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Calendar, Zap, AlertTriangle, Info, ExternalLink, Filter } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { nasaApi } from '../services/api';
import { NEOResponse, NearEarthObject } from '../types/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

interface ProcessedNEOData {
  objects: NearEarthObject[];
  stats: {
    total: number;
    hazardous: number;
    safe: number;
    largest: NearEarthObject | null;
    fastest: (NearEarthObject & { speed: number }) | null;
  };
  chartData: {
    date: string;
    hazardous: number;
    safe: number;
    total: number;
  }[];
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

type DangerLevel = 'high' | 'medium' | 'low';

const NEOTracker = () => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 7).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedNEO, setSelectedNEO] = useState<NearEarthObject | null>(null);

  const { data, isLoading, error } = useQuery(
    ['neo', startDate, endDate],
    () => nasaApi.getNearEarthObjects({ start_date: startDate, end_date: endDate }),
    {
      onError: (error: any) => {
        toast.error(error.message);
      }
    }
  );

  const processNEOData = (neoData: NEOResponse): ProcessedNEOData => {
    if (!neoData?.near_earth_objects) return { objects: [], stats: { total: 0, hazardous: 0, safe: 0, largest: null, fastest: null }, chartData: [] };
    
    const objects: NearEarthObject[] = [];
    const dailyData: { date: string; hazardous: number; safe: number; total: number }[] = [];
    
    Object.entries(neoData.near_earth_objects).forEach(([date, neos]) => {
      const neoArray = neos as NearEarthObject[];
      const hazardous = neoArray.filter((neo: NearEarthObject) => neo.is_potentially_hazardous_asteroid).length;
      const safe = neoArray.length - hazardous;
      
      dailyData.push({
        date: format(new Date(date), 'MMM dd'),
        hazardous,
        safe,
        total: neoArray.length
      });
      
      objects.push(...neoArray);
    });
    
    const stats = {
      total: objects.length,
      hazardous: objects.filter((neo: NearEarthObject) => neo.is_potentially_hazardous_asteroid).length,
      safe: objects.filter((neo: NearEarthObject) => !neo.is_potentially_hazardous_asteroid).length,
      largest: objects.reduce((max: NearEarthObject | null, neo: NearEarthObject) => {
        const size = neo.estimated_diameter.meters.estimated_diameter_max;
        return size > (max?.estimated_diameter?.meters?.estimated_diameter_max || 0) ? neo : max;
      }, null),
      fastest: objects.reduce((max: (NearEarthObject & { speed: number }) | null, neo: NearEarthObject) => {
        const speed = parseFloat(neo.close_approach_data[0]?.relative_velocity?.kilometers_per_second || '0');
        return speed > (max?.speed || 0) ? { ...neo, speed } : max;
      }, null)
    };
    
    return { objects, stats, chartData: dailyData };
  };

  const { objects, stats, chartData } = data ? processNEOData(data) : { objects: [], stats: { total: 0, hazardous: 0, safe: 0, largest: null, fastest: null }, chartData: [] };

  const pieData: PieDataItem[] = [
    { name: 'Safe', value: stats.safe || 0, color: '#10B981' },
    { name: 'Potentially Hazardous', value: stats.hazardous || 0, color: '#F59E0B' }
  ];

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const getDangerLevel = (neo: NearEarthObject): DangerLevel => {
    const isHazardous = neo.is_potentially_hazardous_asteroid;
    const size = neo.estimated_diameter.meters.estimated_diameter_max;
    const distance = parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers || '0');
    
    if (isHazardous && size > 1000) return 'high';
    if (isHazardous || size > 500) return 'medium';
    return 'low';
  };

  const DangerBadge = ({ level }: { level: DangerLevel }) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${colors[level]}`}>
        {level.toUpperCase()}
      </span>
    );
  };

  const NEOModal = ({ neo, onClose }: { neo: NearEarthObject; onClose: () => void }) => (
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
        className="max-w-2xl w-full glass-card p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{neo.name}</h3>
            <DangerBadge level={getDangerLevel(neo)} />
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2">Size Estimate</h4>
              <p className="text-sm text-gray-300">
                {neo.estimated_diameter.meters.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} meters
              </p>
            </div>
            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2">Close Approach</h4>
              <p className="text-sm text-gray-300">
                {format(new Date(neo.close_approach_data[0]?.close_approach_date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div className="glass-card p-4">
            <h4 className="font-semibold mb-2">Velocity & Distance</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Velocity</p>
                <p className="font-mono">
                  {parseFloat(neo.close_approach_data[0]?.relative_velocity?.kilometers_per_second || '0').toFixed(2)} km/s
                </p>
              </div>
              <div>
                <p className="text-gray-400">Miss Distance</p>
                <p className="font-mono">
                  {parseFloat(neo.close_approach_data[0]?.miss_distance?.kilometers || '0').toLocaleString()} km
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h4 className="font-semibold mb-2">Classification</h4>
            <div className="flex items-center space-x-2 text-sm">
              {neo.is_potentially_hazardous_asteroid ? (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              ) : (
                <Info className="h-4 w-4 text-green-500" />
              )}
              <span>
                {neo.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Safe'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <a
              href={neo.nasa_jpl_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-cosmic-blue hover:text-cosmic-purple transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View NASA JPL Data</span>
            </a>
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
            <span className="bg-gradient-to-r from-cosmic-purple to-cosmic-pink bg-clip-text text-transparent">
              NEO Tracker
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Track Near Earth Objects and assess their potential impact risk
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-cosmic-blue" />
              <label className="text-gray-300">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="bg-space-800 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-cosmic-blue" />
              <label className="text-gray-300">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="bg-space-800 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cosmic-blue focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-6">
                  <Skeleton height={60} />
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <Skeleton height={300} />
            </div>
          </div>
        ) : data ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="glass-card p-6 text-center">
                <Zap className="h-8 w-8 text-cosmic-blue mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{stats.total}</h3>
                <p className="text-gray-300">Total NEOs</p>
              </div>
              <div className="glass-card p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{stats.hazardous}</h3>
                <p className="text-gray-300">Potentially Hazardous</p>
              </div>
              <div className="glass-card p-6 text-center">
                <Info className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{stats.safe}</h3>
                <p className="text-gray-300">Safe</p>
              </div>
              <div className="glass-card p-6 text-center">
                <Filter className="h-8 w-8 text-cosmic-purple mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{chartData.length}</h3>
                <p className="text-gray-300">Days Analyzed</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold mb-4">Daily NEO Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="safe" stackId="a" fill="#10B981" />
                    <Bar dataKey="hazardous" stackId="a" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold mb-4">Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold mb-4">NEO List</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {objects.map((neo) => (
                  <div
                    key={neo.id}
                    className="flex items-center justify-between p-4 bg-space-800/50 rounded-lg hover:bg-space-700/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedNEO(neo)}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{neo.name}</h4>
                      <p className="text-sm text-gray-400">
                        {neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}m • 
                        {parseFloat(neo.close_approach_data[0]?.relative_velocity?.kilometers_per_second || '0').toFixed(2)} km/s
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DangerBadge level={getDangerLevel(neo)} />
                      {neo.is_potentially_hazardous_asteroid && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        ) : null}

        {selectedNEO && (
          <NEOModal
            neo={selectedNEO}
            onClose={() => setSelectedNEO(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NEOTracker; 