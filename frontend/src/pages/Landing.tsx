import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, Shield, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

const Landing: React.FC = () => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">
                {t('welcome')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Powerful subscription management with AI insights, multilingual support, and beautiful analytics
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <div className="text-lg text-foreground/80 mb-8">
              {t('chooseRole')}
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="card-glow p-8 text-center group cursor-pointer"
              >
                <Link to="/register?role=user" className="block">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('userRole')}</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage your subscriptions, track usage, and get AI recommendations
                  </p>
                  <div className="flex items-center justify-center text-primary font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                <div className="mt-4 text-sm text-muted-foreground">
                  Have an account?{' '}
                  <Link to="/login?role=user" className="text-primary hover:underline font-medium">
                    Login as User
                  </Link>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="card-glow p-8 text-center group cursor-pointer"
              >
                <Link to="/register?role=admin" className="block">
                  <div className="w-16 h-16 mx-auto mb-4 bg-special/20 rounded-2xl flex items-center justify-center group-hover:bg-special/30 transition-colors">
                    <Shield className="w-8 h-8 text-special" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('adminRole')}</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage plans, users, analytics, and system configuration
                  </p>
                  <div className="flex items-center justify-center text-special font-medium">
                    Admin Access
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                <div className="mt-4 text-sm text-muted-foreground">
                  Have an account?{' '}
                  <Link to="/login?role=admin" className="text-special hover:underline font-medium">
                    Login as Admin
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="mt-8 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-6">
                <Link to="/login?role=user" className="text-primary hover:underline font-medium">
                  Login as User
                </Link>
                <span>•</span>
                <Link to="/login?role=admin" className="text-special hover:underline font-medium">
                  Login as Admin
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Landing;