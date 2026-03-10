import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Layout from '../components/Layout';
import { useToast } from '../hooks/use-toast';

const Auth: React.FC = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    // Determine if login or register based on URL path
    const path = location.pathname;
    if (path.includes('login')) {
      setIsLogin(true);
    } else if (path.includes('register')) {
      setIsLogin(false);
    } else if (searchParams.get('mode') === 'login') {
      setIsLogin(true);
    } else if (searchParams.get('mode') === 'register') {
      setIsLogin(false);
    }
  }, [location.pathname, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!isLogin) {
        // Registration flow - redirect to login with role preserved
        toast({
          title: t('success'),
          description: 'Account created successfully! Please login.',
        });
        setLoading(false);
        navigate(`/login?role=${role}`);
        return;
      }

      // Login flow - create user and redirect to dashboard
      const userData = {
        id: Date.now().toString(),
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        role: role as 'user' | 'admin',
      };

      login(userData);
      
      toast({
        title: t('success'),
        description: 'Successfully logged in!',
      });

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showNavbar={false}>
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="card-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? t('login') : t('register')}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Welcome back! Sign in to your account'
                  : `Create your ${role} account to get started`
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                >
                  {loading ? t('loading') : (isLogin ? t('login') : t('register'))}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <Link 
                      to={`/register?role=${role}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Link 
                      to={`/login?role=${role}`}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>

              {role === 'admin' && (
                <div className="mt-4 p-3 bg-special/10 border border-special/20 rounded-lg text-center text-sm">
                  <strong>Admin Demo:</strong> Use any email/password combination
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Auth;