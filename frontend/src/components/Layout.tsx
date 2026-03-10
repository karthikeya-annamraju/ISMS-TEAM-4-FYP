import React from 'react';
import { motion } from 'framer-motion';
import NetworkBackground from './NetworkBackground';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <NetworkBackground />
      
      {showNavbar && isAuthenticated && <Navbar />}
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 ${showNavbar && isAuthenticated ? 'pt-20' : ''}`}
      >
        {children}
      </motion.main>
      
      {/* Chatbot - only show when authenticated */}
      {isAuthenticated && <Chatbot />}
    </div>
  );
};

export default Layout;