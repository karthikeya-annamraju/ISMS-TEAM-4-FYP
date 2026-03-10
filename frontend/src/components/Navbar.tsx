import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Home, 
  CreditCard, 
  User, 
  HelpCircle, 
  LogOut,
  Globe
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard') },
    { path: '/plans', icon: CreditCard, label: t('plans') },
    { path: '/profile', icon: User, label: t('profile') },
    { path: '/support', icon: HelpCircle, label: t('support') },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'te', label: 'తెలుగు' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/30"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-4"
          >
            <div className="text-2xl font-bold gradient-text">
              SubsManager
            </div>
            <span className="text-sm text-muted-foreground">
              {user?.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}
            </span>
          </motion.div>

          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>{languages.find(l => l.code === language)?.label}</span>
              </Button>
              
              <div className="absolute top-full right-0 mt-2 py-2 w-32 glass-effect border border-border/30 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors ${
                      language === lang.code ? 'bg-primary/20 text-primary' : ''
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;