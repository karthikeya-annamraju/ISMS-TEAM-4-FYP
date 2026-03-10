import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User, 
  Mail, 
  Shield, 
  Download, 
  Upload,
  Save
} from 'lucide-react';
import Layout from '../components/Layout';
import { useToast } from '../hooks/use-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    toast({
      title: t('success'),
      description: 'Profile updated successfully!',
    });
  };

  const handleExportData = (format: 'pdf' | 'csv') => {
    toast({
      title: 'Export Started',
      description: `Exporting your data as ${format.toUpperCase()}...`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-2">{t('profile')}</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG up to 2MB
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSave} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    {t('save')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Actions */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={profile.confirmPassword}
                      onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>

                  <Button className="w-full btn-secondary">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>
                    Download your account data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExportData('pdf')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleExportData('csv')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Password Change */}
          <motion.div variants={itemVariants}>
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>
                  Your subscription and usage summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border border-border/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">Gold</div>
                    <div className="text-sm text-muted-foreground">Current Plan</div>
                  </div>
                  <div className="text-center p-4 border border-border/50 rounded-lg">
                    <div className="text-2xl font-bold text-success">$29.99</div>
                    <div className="text-sm text-muted-foreground">Monthly Cost</div>
                  </div>
                  <div className="text-center p-4 border border-border/50 rounded-lg">
                    <div className="text-2xl font-bold text-special">2 years</div>
                    <div className="text-sm text-muted-foreground">Member Since</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;