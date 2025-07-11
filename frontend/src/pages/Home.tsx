import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Rocket, Globe, Zap, Search, ChevronRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: 'Astronomy Picture of the Day',
      description: 'Discover breathtaking images from space with detailed explanations',
      path: '/apod',
      color: 'cosmic-blue'
    },
    {
      icon: Rocket,
      title: 'Mars Exploration',
      description: 'Explore the Red Planet through rover photographs and missions',
      path: '/mars',
      color: 'cosmic-orange'
    },
    {
      icon: Zap,
      title: 'Asteroid Tracker',
      description: 'Track Near Earth Objects and their orbital characteristics',
      path: '/neo',
      color: 'cosmic-purple'
    },
    {
      icon: Globe,
      title: 'Earth View',
      description: 'See our planet from space through EPIC satellite imagery',
      path: '/earth',
      color: 'cosmic-blue'
    },
    {
      icon: Search,
      title: 'Media Library',
      description: 'Search through NASA\'s vast collection of space imagery',
      path: '/search',
      color: 'cosmic-pink'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-space font-bold mb-6">
              <span className="bg-gradient-to-r from-cosmic-blue via-cosmic-purple to-cosmic-pink bg-clip-text text-transparent">
                SPACE EXPLORER
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Journey through the cosmos with NASA's Open APIs. Discover the beauty of space through stunning imagery, data, and interactive experiences.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/apod"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cosmic-blue to-cosmic-purple text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cosmic-blue/25 transition-all duration-300 transform hover:scale-105"
              >
                Start Exploring
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center px-8 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                Search Gallery
                <Search className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cosmic-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cosmic-pink/10 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-space font-bold mb-4">
              Explore the Universe
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your cosmic adventure and dive into the wonders of space through NASA's comprehensive data and imagery.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass-card p-6 group cursor-pointer transition-all duration-300 hover:border-white/20"
                >
                  <Link to={feature.path}>
                    <div className={`w-12 h-12 rounded-lg bg-${feature.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 text-${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-400 group-hover:text-white transition-colors">
                      Explore now
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-space-800/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-space font-bold mb-6">
              Powered by NASA's Open APIs
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              This application leverages NASA's comprehensive APIs to bring you the latest space imagery, data, and discoveries. From daily astronomy photos to Mars rover images, explore the cosmos like never before.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="px-3 py-1 bg-white/10 rounded-full">APOD API</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">Mars Rovers API</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">Near Earth Objects API</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">EPIC API</span>
              <span className="px-3 py-1 bg-white/10 rounded-full">Image Library API</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 