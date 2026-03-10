import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingDown, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

/**
 * Churn Risk Dashboard Component
 * Displays AI insights: high-risk users and churn predictions
 */
const ChurnRiskDashboard = () => {
  const [highRiskUsers, setHighRiskUsers] = useState([]);
  const [mediumRiskUsers, setMediumRiskUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChurnData();
  }, []);

  const fetchChurnData = async () => {
    try {
      setLoading(true);
      
      // Fetch high-risk users
      const highRiskRes = await fetch('http://localhost:8080/api/ai/high-risk-users');
      if (highRiskRes.ok) {
        setHighRiskUsers(await highRiskRes.json());
      }

      // Fetch medium-risk users
      const mediumRiskRes = await fetch('http://localhost:8080/api/ai/medium-risk-users');
      if (mediumRiskRes.ok) {
        setMediumRiskUsers(await mediumRiskRes.json());
      }
    } catch (err) {
      setError('Failed to load churn data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading churn analytics...</div>;
  }

  return (
    <div className="space-y-6 w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk Users</p>
                <p className="text-2xl font-bold text-red-600">{highRiskUsers.length}</p>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medium Risk Users</p>
                <p className="text-2xl font-bold text-yellow-600">{mediumRiskUsers.length}</p>
              </div>
              <TrendingDown className="text-yellow-600" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total At-Risk</p>
                <p className="text-2xl font-bold text-orange-600">
                  {highRiskUsers.length + mediumRiskUsers.length}
                </p>
              </div>
              <Target className="text-orange-600" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Users Table */}
      {highRiskUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🚨 High Risk Users (70% Churn Probability)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User ID</th>
                    <th className="text-left py-2">Churn Probability</th>
                    <th className="text-left py-2">Risk Level</th>
                    <th className="text-left py-2">Recommendation</th>
                    <th className="text-left py-2">Prediction Date</th>
                  </tr>
                </thead>
                <tbody>
                  {highRiskUsers.map((user) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-semibold">#{user.userId}</td>
                      <td className="py-2">
                        <span className="font-bold">{(user.churnProbability * 100).toFixed(1)}%</span>
                      </td>
                      <td className="py-2">
                        <Badge variant={getRiskBadgeVariant(user.riskLevel)}>
                          {user.riskLevel}
                        </Badge>
                      </td>
                      <td className="py-2 text-xs text-gray-600">{user.recommendedPlan}</td>
                      <td className="py-2 text-xs text-gray-500">
                        {new Date(user.predictionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medium Risk Users Table */}
      {mediumRiskUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>⚠️ Medium Risk Users (40-70% Churn Probability)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">User ID</th>
                    <th className="text-left py-2">Churn Probability</th>
                    <th className="text-left py-2">Risk Level</th>
                    <th className="text-left py-2">Recommendation</th>
                    <th className="text-left py-2">Prediction Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mediumRiskUsers.map((user) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-semibold">#{user.userId}</td>
                      <td className="py-2">
                        <span className="font-bold text-yellow-600">
                          {(user.churnProbability * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2">
                        <Badge variant={getRiskBadgeVariant(user.riskLevel)}>
                          {user.riskLevel}
                        </Badge>
                      </td>
                      <td className="py-2 text-xs text-gray-600">{user.recommendedPlan}</td>
                      <td className="py-2 text-xs text-gray-500">
                        {new Date(user.predictionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {highRiskUsers.length === 0 && mediumRiskUsers.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No churn data available. Train a model first using the Training Panel.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChurnRiskDashboard;
