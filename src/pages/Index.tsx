import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Plus, TrendingUp, AlertTriangle, Target, DollarSign, BookOpen, Coffee, Home, Car, Gamepad2, Heart } from 'lucide-react';

const StudentFinanceManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 45.50, description: 'Textbooks for calculus class', date: '2025-09-10', category: 'Education', automated: true },
    { id: 2, amount: 12.99, description: 'Coffee at campus cafe', date: '2025-09-11', category: 'Food', automated: true },
    { id: 3, amount: 850.00, description: 'Monthly rent payment', date: '2025-09-01', category: 'Housing', automated: true },
    { id: 4, amount: 25.00, description: 'Uber to downtown', date: '2025-09-12', category: 'Transportation', automated: true },
    { id: 5, amount: 89.99, description: 'New gaming headset', date: '2025-09-09', category: 'Entertainment', automated: true }
  ]);
  
  const [budget] = useState({
    monthly: 1200,
    categories: {
      Housing: 850,
      Food: 200,
      Education: 100,
      Transportation: 50,
      Entertainment: 100,
      Health: 50
    }
  });

  const [goals] = useState([
    { id: 1, title: 'Emergency Fund', target: 1000, current: 350, deadline: '2025-12-31' },
    { id: 2, title: 'Spring Break Trip', target: 800, current: 120, deadline: '2025-03-15' },
    { id: 3, title: 'New Laptop', target: 1200, current: 480, deadline: '2025-11-30' }
  ]);

  const [newExpense, setNewExpense] = useState({ amount: '', description: '' });
  const [alerts, setAlerts] = useState<Array<{
    id: number;
    type: string;
    message: string;
    icon: any;
  }>>([]);

  const categorizeExpense = (description) => {
    const keywords = {
      Education: ['book', 'textbook', 'tuition', 'class', 'course', 'study'],
      Food: ['coffee', 'lunch', 'dinner', 'restaurant', 'grocery', 'food', 'cafe'],
      Housing: ['rent', 'utilities', 'electric', 'internet', 'apartment'],
      Transportation: ['uber', 'lyft', 'gas', 'parking', 'bus', 'metro'],
      Entertainment: ['movie', 'game', 'concert', 'party', 'streaming'],
      Health: ['pharmacy', 'doctor', 'medicine', 'gym', 'fitness']
    };

    const desc = description.toLowerCase();
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => desc.includes(word))) {
        return category;
      }
    }
    return 'Other';
  };

  const generateSpendingPrediction = () => {
    const currentMonth = expenses.filter(exp => exp.date.startsWith('2025-09'));
    const totalSpent = currentMonth.reduce((sum, exp) => sum + exp.amount, 0);
    const projectedMonthly = (totalSpent / 13) * 30;
    
    return {
      current: totalSpent,
      projected: projectedMonthly,
      variance: projectedMonthly - budget.monthly
    };
  };

  const getBudgetOptimizations = () => {
    const categorySpending: { [key: string]: number } = {};
    expenses.forEach(exp => {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });

    const suggestions: Array<{
      category: string;
      message: string;
      severity: string;
    }> = [];
    Object.entries(categorySpending).forEach(([category, spent]) => {
      const budgetAmount = budget.categories[category as keyof typeof budget.categories] || 0;
      if (spent > budgetAmount * 0.8) {
        suggestions.push({
          category,
          message: `You are at ${Math.round((spent/budgetAmount)*100)}% of your ${category} budget`,
          severity: spent > budgetAmount ? 'high' : 'medium'
        });
      }
    });

    return suggestions;
  };

  useEffect(() => {
    const newAlerts = [];
    const optimizations = getBudgetOptimizations();
    const prediction = generateSpendingPrediction();

    optimizations.forEach(opt => {
      newAlerts.push({
        id: Math.random(),
        type: opt.severity,
        message: opt.message,
        icon: AlertTriangle
      });
    });

    if (prediction.variance > 0) {
      newAlerts.push({
        id: Math.random(),
        type: 'high',
        message: `Projected to overspend by $${prediction.variance.toFixed(2)} this month`,
        icon: TrendingUp
      });
    }

    setAlerts(newAlerts);
  }, [expenses, budget]);

  const addExpense = () => {
    if (newExpense.amount && newExpense.description) {
      const expense = {
        id: Date.now(),
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: new Date().toISOString().split('T')[0],
        category: categorizeExpense(newExpense.description),
        automated: true
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ amount: '', description: '' });
    }
  };

  const spendingTrend = [
    { month: 'Jun', amount: 1150 },
    { month: 'Jul', amount: 1280 },
    { month: 'Aug', amount: 1090 },
    { month: 'Sep', amount: generateSpendingPrediction().current }
  ];

  const categoryData = Object.entries(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  const categoryIcons = {
    Education: BookOpen,
    Food: Coffee,
    Housing: Home,
    Transportation: Car,
    Entertainment: Gamepad2,
    Health: Heart
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Student Finance Manager</h1>
          <p className="text-gray-600">AI-powered budgeting and expense tracking designed for students</p>
        </div>

        <div className="flex space-x-4 mb-8">
          {['dashboard', 'expenses', 'budget', 'goals', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Monthly Budget</p>
                      <p className="text-2xl font-bold text-gray-800">${budget.monthly}</p>
                    </div>
                    <DollarSign className="text-green-500" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Spent This Month</p>
                      <p className="text-2xl font-bold text-gray-800">${generateSpendingPrediction().current.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="text-blue-500" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Remaining Budget</p>
                      <p className="text-2xl font-bold text-gray-800">
                        ${(budget.monthly - generateSpendingPrediction().current).toFixed(2)}
                      </p>
                    </div>
                    <Target className="text-purple-500" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Spending Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={spendingTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="mr-2 text-orange-500" size={20} />
                  Smart Alerts
                </h3>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg flex items-start space-x-3 ${
                        alert.type === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                        alert.type === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                        'bg-blue-50 border-l-4 border-blue-500'
                      }`}
                    >
                      <alert.icon size={16} className={
                        alert.type === 'high' ? 'text-red-500 mt-1' :
                        alert.type === 'medium' ? 'text-yellow-500 mt-1' :
                        'text-blue-500 mt-1'
                      } />
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-gray-500 text-sm">No alerts at the moment. Great job managing your budget!</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Financial Goals</h3>
                <div className="space-y-4">
                  {goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-gray-600">${goal.current}/${goal.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addExpense}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={16} />
                    Add Expense
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 AI will automatically categorize your expense based on the description
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
                <div className="space-y-3">
                  {expenses.slice(-10).reverse().map((expense) => {
                    const IconComponent = categoryIcons[expense.category] || DollarSign;
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <IconComponent size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-gray-600 flex items-center">
                              {expense.category} • {expense.date}
                              {expense.automated && (
                                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  AI Categorized
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-lg">${expense.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Budget Categories</h3>
              <div className="space-y-4">
                {Object.entries(budget.categories).map(([category, amount]) => {
                  const spent = expenses
                    .filter(exp => exp.category === category)
                    .reduce((sum, exp) => sum + exp.amount, 0);
                  const percentage = (spent / amount) * 100;
                  const IconComponent = categoryIcons[category] || DollarSign;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent size={20} className="text-gray-600" />
                          <span className="font-medium">{category}</span>
                        </div>
                        <span className="text-sm text-gray-600">${spent.toFixed(2)} / ${amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            percentage > 100 ? 'bg-red-500' :
                            percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Budget vs Actual</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={Object.entries(budget.categories).map(([category, budgetAmount]) => ({
                  category,
                  budget: budgetAmount,
                  actual: expenses
                    .filter(exp => exp.category === category)
                    .reduce((sum, exp) => sum + exp.amount, 0)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, '']} />
                  <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Financial Goals</h3>
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <span className="text-sm text-gray-600">Due: {goal.deadline}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>${goal.current}</span>
                        <span>${goal.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {Math.round((goal.current / goal.target) * 100)}% complete • 
                        ${(goal.target - goal.current).toFixed(2)} remaining
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Goal Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Smart Recommendation</h4>
                  <p className="text-sm text-blue-700">
                    Based on your spending patterns, consider setting aside $45/week to reach your Emergency Fund goal by the deadline.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 On Track</h4>
                  <p className="text-sm text-green-700">
                    Your laptop savings goal is progressing well. You are 40% of the way there with 2.5 months remaining.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Needs Attention</h4>
                  <p className="text-sm text-yellow-700">
                    Spring Break Trip goal needs $113/month to stay on track. Consider reducing entertainment spending.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Predictive Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Monthly Projection</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    ${generateSpendingPrediction().projected.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-700">Based on current spending patterns</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Savings Potential</h4>
                  <p className="text-2xl font-bold text-green-900">$127.50</p>
                  <p className="text-sm text-green-700">If you reduce dining out by 30%</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Budget Health</h4>
                  <p className="text-2xl font-bold text-purple-900">Good</p>
                  <p className="text-sm text-purple-700">On track with minor alerts</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">AI-Powered Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">💰 Budget Optimizations</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <p className="text-sm font-medium">Reduce Coffee Spending</p>
                      <p className="text-xs text-gray-600">Save $25/month by making coffee at home 3 days a week</p>
                    </div>
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm font-medium">Transportation Optimization</p>
                      <p className="text-xs text-gray-600">Consider a monthly bus pass to save $15/month</p>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <p className="text-sm font-medium">Bulk Textbook Purchases</p>
                      <p className="text-xs text-gray-600">Buy/rent textbooks in bulk to save 20%</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">📈 Income Opportunities</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                      <p className="text-sm font-medium">Tutoring Services</p>
                      <p className="text-xs text-gray-600">Earn $150/month tutoring calculus</p>
                    </div>
                    <div className="p-3 bg-pink-50 border-l-4 border-pink-500 rounded">
                      <p className="text-sm font-medium">Campus Work-Study</p>
                      <p className="text-xs text-gray-600">10 hours/week = $400/month additional income</p>
                    </div>
                    <div className="p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded">
                      <p className="text-sm font-medium">Sell Unused Items</p>
                      <p className="text-xs text-gray-600">One-time boost of ~$200 from old electronics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFinanceManager;