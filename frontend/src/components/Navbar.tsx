import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Rocket, Camera, Globe, Zap, Search, Home, LucideIcon } from 'lucide-react';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/apod', icon: Camera, label: 'APOD' },
    { path: '/mars', icon: Rocket, label: 'Mars' },
    { path: '/neo', icon: Zap, label: 'Asteroids' },
    { path: '/earth', icon: Globe, label: 'Earth' },
    { path: '/search', icon: Search, label: 'Search' },
  ];

  const toggleMenu = (): void => setIsOpen(!isOpen);

  return (
    <motion.nav 
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Rocket className="h-8 w-8 text-cosmic-blue" />
            </motion.div>
            <span className="font-space font-bold text-xl bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
              SPACE EXPLORER
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? 'bg-cosmic-blue/20 text-cosmic-blue border border-cosmic-blue/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cosmic-blue"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-space-800/90 backdrop-blur-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-cosmic-blue/20 text-cosmic-blue border border-cosmic-blue/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar; 