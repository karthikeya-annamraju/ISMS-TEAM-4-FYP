import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  // Mock data - Admin Analytics
  const stats = {
    totalUsers: 1234,
    activeSubscriptions: 856,
    monthlyRevenue: 45678,
    churnRate: 2.3
  };

  const chartData = [
    { month: 'Jan', users: 100, revenue: 12000 },
    { month: 'Feb', users: 180, revenue: 18500 },
    { month: 'Mar', users: 250, revenue: 24000 },
    { month: 'Apr', users: 320, revenue: 31000 },
    { month: 'May', users: 450, revenue: 42000 },
    { month: 'Jun', users: 600, revenue: 58000 },
  ];

  const planDistribution = [
    { plan: 'Basic', users: 320, percentage: 37 },
    { plan: 'Gold', users: 456, percentage: 53 },
    { plan: 'Platinum', users: 80, percentage: 10 },
  ];

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
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your subscription platform
              </p>
            </div>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-success" />
                    Active Subscriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSubscriptions.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-special" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                    Churn Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.churnRate}%</div>
                  <p className="text-xs text-red-600">+0.5% from last month</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Growth Trends
                  </CardTitle>
                  <CardDescription>User acquisition and revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="month" 
                          className="text-xs" 
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                  <CardDescription>Current subscription breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {planDistribution.map((plan, index) => (
                      <div key={plan.plan} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary' : 
                            index === 1 ? 'bg-success' : 'bg-special'
                          }`}></div>
                          <span className="font-medium">{plan.plan}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{plan.users}</div>
                          <div className="text-xs text-muted-foreground">{plan.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={planDistribution}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="plan" 
                          className="text-xs"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip />
                        <Bar 
                          dataKey="users" 
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* AI Insights Widget */}
          <motion.div variants={itemVariants}>
            <Card className="card-glow border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-3"></div>
                  AI Insights
                </CardTitle>
                <CardDescription>Automated recommendations based on your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="font-medium mb-1"> Optimization Opportunity</div>
                    <p className="text-sm text-muted-foreground">
                      Consider introducing a mid-tier plan between Gold and Platinum. 
                      23% of Gold users show usage patterns suggesting they'd upgrade.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="font-medium mb-1"> Churn Alert</div>
                    <p className="text-sm text-muted-foreground">
                      Churn rate increased by 0.5%. Consider running retention campaigns 
                      for users with low engagement scores.
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="font-medium mb-1"> Growth Trend</div>
                    <p className="text-sm text-muted-foreground">
                      Premium plan adoption is 15% higher than projected. 
                      Consider expanding premium features.
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
};

export default AdminDashboard;
