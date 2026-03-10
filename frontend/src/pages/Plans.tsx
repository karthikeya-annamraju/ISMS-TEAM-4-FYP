import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Check, 
  Star, 
  Leaf, 
  Zap, 
  Crown,
  Sparkles,
  Activity
} from 'lucide-react';
import Layout from '../components/Layout';
import { useToast } from '../hooks/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Plans: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string, percentage: number} | null>(null);

  const plans = [
    {
      id: 'basic',
      name: t('basic'),
      price: 9.99,
      originalPrice: 9.99,
      description: 'Perfect for getting started',
      features: [
        'Up to 5 projects',
        'Basic analytics',
        'Email support',
        'Mobile app access',
        '1GB storage'
      ],
      icon: Zap,
      popular: false,
      eco: false
    },
    {
      id: 'gold',
      name: t('gold'),
      price: 29.99,
      originalPrice: 29.99,
      description: 'Best for growing teams',
      features: [
        'Up to 25 projects',
        'Advanced analytics',
        'Priority support',
        'Mobile + Desktop apps',
        '10GB storage',
        'Team collaboration',
        'Custom integrations'
      ],
      icon: Star,
      popular: true,
      eco: true
    },
    {
      id: 'platinum',
      name: t('platinum'),
      price: 99.99,
      originalPrice: 99.99,
      description: 'For enterprises and power users',
      features: [
        'Unlimited projects',
        'Real-time analytics',
        '24/7 phone support',
        'All platform access',
        '100GB storage',
        'Advanced team features',
        'Custom integrations',
        'White-label options',
        'Dedicated account manager'
      ],
      icon: Crown,
      popular: false,
      eco: true
    }
  ];

  const [currentPlans, setCurrentPlans] = useState(plans);

  // Unsubscription Analytics Data (for admin)
  const unsubscriptionData = [
    { month: 'Jan', Basic: 12, Gold: 8, Platinum: 3 },
    { month: 'Feb', Basic: 15, Gold: 10, Platinum: 5 },
    { month: 'Mar', Basic: 10, Gold: 6, Platinum: 2 },
    { month: 'Apr', Basic: 18, Gold: 12, Platinum: 4 },
    { month: 'May', Basic: 14, Gold: 9, Platinum: 6 },
    { month: 'Jun', Basic: 20, Gold: 15, Platinum: 8 },
  ];

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;

    // Simulate API call to validate discount
    const validCodes = {
      'SAVE20': 20,
      'WELCOME10': 10,
      'PREMIUM25': 25
    };

    const discount = validCodes[discountCode.toUpperCase() as keyof typeof validCodes];
    
    if (discount) {
      setAppliedDiscount({ code: discountCode.toUpperCase(), percentage: discount });
      
      // Update plan prices
      const updatedPlans = plans.map(plan => ({
        ...plan,
        price: plan.originalPrice * (1 - discount / 100)
      }));
      setCurrentPlans(updatedPlans);
      
      toast({
        title: 'Discount Applied!',
        description: `${discount}% discount applied to all plans`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Code',
        description: 'Please check your discount code and try again',
      });
    }
  };

  const handleSubscribe = (planId: string) => {
    toast({
      title: 'Subscription Initiated',
      description: `Subscribing to ${planId} plan...`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // Admin View - Show Unsubscription Analytics
  if (isAdmin) {
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
            <motion.div variants={itemVariants} className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Unsubscription Analytics</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track and analyze user unsubscription patterns across all subscription plans
              </p>
            </motion.div>

            {/* Unsubscription Analytics Chart */}
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Unsubscription Trends
                  </CardTitle>
                  <CardDescription>Monthly unsubscription data across all subscription plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={unsubscriptionData}>
                        <defs>
                          <linearGradient id="colorBasic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPlatinum" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--special))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--special))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="month" 
                          className="text-xs"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          label={{ value: 'Unsubscriptions', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="Basic" 
                          stroke="hsl(var(--primary))" 
                          fillOpacity={1} 
                          fill="url(#colorBasic)"
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Gold" 
                          stroke="hsl(var(--success))" 
                          fillOpacity={1} 
                          fill="url(#colorGold)"
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Platinum" 
                          stroke="hsl(var(--special))" 
                          fillOpacity={1} 
                          fill="url(#colorPlatinum)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-primary/10 rounded-lg">
                      <div className="text-3xl font-bold text-primary">89</div>
                      <div className="text-sm text-muted-foreground mt-2">Basic Unsubscriptions</div>
                      <div className="text-xs text-muted-foreground mt-1">Last 6 months</div>
                    </div>
                    <div className="text-center p-6 bg-success/10 rounded-lg">
                      <div className="text-3xl font-bold text-success">60</div>
                      <div className="text-sm text-muted-foreground mt-2">Gold Unsubscriptions</div>
                      <div className="text-xs text-muted-foreground mt-1">Last 6 months</div>
                    </div>
                    <div className="text-center p-6 bg-special/10 rounded-lg">
                      <div className="text-3xl font-bold text-special">28</div>
                      <div className="text-sm text-muted-foreground mt-2">Platinum Unsubscriptions</div>
                      <div className="text-xs text-muted-foreground mt-1">Last 6 months</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Insights */}
            <motion.div variants={itemVariants}>
              <Card className="card-glow border-yellow-500/30">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>Analysis of unsubscription patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="font-medium mb-2">📈 Trend Alert</div>
                      <p className="text-sm text-muted-foreground">
                        Basic plan unsubscriptions increased by 25% in June. Consider reviewing pricing or features.
                      </p>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="font-medium mb-2">✅ Positive Signal</div>
                      <p className="text-sm text-muted-foreground">
                        Platinum plan shows lowest churn rate at 2.1%, indicating high customer satisfaction.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="font-medium mb-2">💡 Recommendation</div>
                      <p className="text-sm text-muted-foreground">
                        Gold plan unsubscriptions peaked in June. Implement retention campaigns for mid-tier users.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="font-medium mb-2">📊 Overall Stats</div>
                      <p className="text-sm text-muted-foreground">
                        Total churn rate: 2.3% | Average monthly unsubscriptions: 29.5 users
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // User View - Show Plan Cards with Pricing
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
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your <span className="gradient-text">Perfect Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing that grows with your needs. All plans include our core features.
            </p>
          </motion.div>

          {/* Discount Code Section */}
          <motion.div variants={itemVariants}>
            <Card className="max-w-md mx-auto card-glow">
              <CardContent className="pt-6">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={applyDiscount} className="btn-discount">
                    Apply
                  </Button>
                </div>
                {appliedDiscount && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center"
                  >
                    <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                      {appliedDiscount.percentage}% discount applied!
                    </Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentPlans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full card-glow relative overflow-hidden ${
                    plan.popular ? 'ring-2 ring-primary/50' : ''
                  }`}>
                    {plan.eco && (
                      <div className="absolute top-4 right-4">
                        <Leaf className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        plan.popular ? 'bg-primary/20' : 'bg-muted/50'
                      }`}>
                        <IconComponent className={`w-8 h-8 ${
                          plan.popular ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription className="text-base">
                        {plan.description}
                      </CardDescription>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-center space-x-2">
                          {appliedDiscount && (
                            <span className="text-lg text-muted-foreground line-through">
                              ${plan.originalPrice}
                            </span>
                          )}
                          <span className="text-4xl font-bold">
                            ${plan.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-muted-foreground">per month</div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        className={`w-full ${
                          plan.popular ? 'btn-primary' : 'btn-secondary'
                        }`}
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        {plan.popular && <Sparkles className="w-4 h-4 mr-2" />}
                        {t('subscribe')}
                      </Button>
                      
                      {plan.eco && (
                        <div className="text-center">
                          <Badge variant="outline" className="text-green-600 border-green-600/30">
                            🌱 Eco-Friendly
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Information */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All plans include 30-day money-back guarantee
            </p>
            <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
              <span>✓ Cancel anytime</span>
              <span>✓ Instant upgrades</span>
              <span>✓ 24/7 support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Plans;