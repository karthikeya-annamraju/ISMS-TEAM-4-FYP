import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../hooks/use-toast';
import { 
  CreditCard, 
  TrendingUp, 
  Award, 
  Bell, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  X,
  Check
} from 'lucide-react';
import Layout from '../components/Layout';

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface Subscription {
  id?: number;
  planId: number;
  planName: string;
  status: string;
  nextBilling: string;
  usage: number;
  price: number;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  const [achievements] = useState([
    { id: 1, name: 'Early Adopter', icon: '🚀', unlocked: true },
    { id: 2, name: 'Power User', icon: '⚡', unlocked: true },
    { id: 3, name: 'Eco Warrior', icon: '🌱', unlocked: false },
    { id: 4, name: 'Loyal Customer', icon: '💎', unlocked: false },
  ]);

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      // Mock API call - replace with actual endpoint
      const mockPlans: Plan[] = [
        {
          id: 1,
          name: 'Basic',
          price: 9.99,
          duration: 'month',
          features: ['5 GB Storage', 'Email Support', 'Basic Analytics']
        },
        {
          id: 2,
          name: 'Gold',
          price: 29.99,
          duration: 'month',
          features: ['50 GB Storage', 'Priority Support', 'Advanced Analytics', 'API Access']
        },
        {
          id: 3,
          name: 'Platinum',
          price: 59.99,
          duration: 'month',
          features: ['Unlimited Storage', '24/7 Support', 'AI Insights', 'Custom Integrations']
        }
      ];
      setPlans(mockPlans);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load plans'
      });
    }
  };

  const fetchSubscription = async () => {
    try {
      // Mock API call - replace with actual endpoint
      const mockSubscription: Subscription = {
        id: 1,
        planId: 2,
        planName: 'Gold',
        status: 'active',
        nextBilling: '2024-02-15',
        usage: 75,
        price: 29.99
      };
      setSubscription(mockSubscription);
    } catch (error) {
      setSubscription(null);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setLoading(true);
    try {
      // POST /api/subscriptions
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: 'Subscription created successfully!'
      });
      fetchSubscription();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create subscription'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: number) => {
    if (!subscription) return;
    setLoading(true);
    try {
      // PUT /api/subscriptions/{id}
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: 'Plan upgraded successfully!'
      });
      fetchSubscription();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upgrade plan'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async (planId: number) => {
    if (!subscription) return;
    setLoading(true);
    try {
      // PUT /api/subscriptions/{id}
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: 'Plan downgraded successfully!'
      });
      fetchSubscription();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to downgrade plan'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    setLoading(true);
    try {
      // DELETE /api/subscriptions/{id}
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: 'Subscription cancelled successfully!'
      });
      fetchSubscription();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to cancel subscription'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanTier = (planName: string): number => {
    const tiers: { [key: string]: number } = { 'Basic': 1, 'Gold': 2, 'Platinum': 3 };
    return tiers[planName] || 0;
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
          {/* Welcome Section */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your subscription
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {subscription ? t('activeSubscription') : 'No Active Subscription'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {subscription ? (
                    <>
                      <div className="text-2xl font-bold">{subscription.planName}</div>
                      <p className="text-xs text-muted-foreground">
                        Next billing: {subscription.nextBilling}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        ${subscription.price}/month
                      </Badge>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-medium">No active plan</div>
                      <p className="text-xs text-muted-foreground">
                        Subscribe to a plan to get started
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Usage This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {subscription ? (
                    <>
                      <div className="text-2xl font-bold">{subscription.usage}%</div>
                      <Progress value={subscription.usage} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {subscription.usage < 80 ? 'Great usage!' : 'Consider upgrading'}
                      </p>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">No usage data</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {achievements.filter(a => a.unlocked).length}/
                    {achievements.length}
                  </div>
                  <div className="flex space-x-1 mt-2">
                    {achievements.slice(0, 3).map(achievement => (
                      <span 
                        key={achievement.id}
                        className={`text-lg ${achievement.unlocked ? '' : 'opacity-30'}`}
                      >
                        {achievement.icon}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Plans */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Available Plans</CardTitle>
                  <CardDescription>
                    {subscription ? 'Upgrade or downgrade your current plan' : 'Choose a plan to get started'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plans.map((plan) => {
                    const isCurrentPlan = subscription && subscription.planName === plan.name;
                    const currentTier = subscription ? getPlanTier(subscription.planName) : 0;
                    const planTier = getPlanTier(plan.name);
                    const canUpgrade = !subscription || planTier > currentTier;
                    const canDowngrade = subscription && planTier < currentTier;
                    
                    return (
                      <div 
                        key={plan.id}
                        className={`p-4 border rounded-lg ${isCurrentPlan ? 'border-primary bg-primary/5' : 'border-border'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold">{plan.name}</h3>
                              {isCurrentPlan && (
                                <Badge variant="default">Current Plan</Badge>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-primary mb-3">
                              ${plan.price}
                              <span className="text-sm font-normal text-muted-foreground">/{plan.duration}</span>
                            </p>
                            <ul className="space-y-1">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="text-sm flex items-center gap-2">
                                  <Check className="w-4 h-4 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-col gap-2">
                            {!subscription && (
                              <Button 
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={loading}
                                className="btn-primary"
                              >
                                Subscribe
                              </Button>
                            )}
                            {canUpgrade && subscription && (
                              <Button 
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={loading}
                                className="btn-success"
                              >
                                <ArrowUp className="w-4 h-4 mr-1" />
                                Upgrade
                              </Button>
                            )}
                            {canDowngrade && (
                              <Button 
                                onClick={() => handleDowngrade(plan.id)}
                                disabled={loading}
                                variant="outline"
                              >
                                <ArrowDown className="w-4 h-4 mr-1" />
                                Downgrade
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {subscription && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={handleCancel}
                        disabled={loading}
                        variant="destructive"
                        className="w-full"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Recommendations & Notifications */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm">
                        📈 Based on your usage, consider upgrading to Platinum for better value
                      </p>
                    </div>
                    <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                      <p className="text-sm">
                        🎯 You're using 75% of your quota. Perfect utilization!
                      </p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 btn-primary">
                    Get More Insights
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Payment Successful</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Usage at 75%</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Gamification Section */}
          <motion.div variants={itemVariants}>
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Unlock badges and rewards by using our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-4 border rounded-xl text-center transition-all ${
                        achievement.unlocked
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-border/50 opacity-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <div className="text-sm font-medium">{achievement.name}</div>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="mt-2">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default UserDashboard;