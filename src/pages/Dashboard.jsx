import React, { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Icon from '../components/common/Icon';
import TransactionList from '../components/transactions/TransactionList';

const Dashboard = () => {
  const { transactions, categories, currency, calculateTotals, getTransactionsByCategory } = useApp();
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year'
  
  const totals = calculateTotals();
  const categoryTotals = getTransactionsByCategory();
  
  // Filter transactions for current period
  const getFilteredTransactions = () => {
    const now = new Date();
    let cutoffDate;
    
    if (period === 'week') {
      cutoffDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'month') {
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (period === 'year') {
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Prepare data for charts
  const prepareChartData = () => {
    const expenseCategories = categories.filter(category => category.type === 'expense');
    
    return expenseCategories.map(category => ({
      name: category.name,
      amount: filteredTransactions
        .filter(t => t.category === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    })).filter(item => item.amount > 0);
  };
  
  const chartData = prepareChartData();
  
  // Prepare recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <Icon name="Wallet" size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Current Balance</p>
              <h3 className="text-2xl font-bold">{currency}{totals.balance.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-success text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <Icon name="ArrowDownRight" size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Income</p>
              <h3 className="text-2xl font-bold">{currency}{totals.income.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-danger text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <Icon name="ArrowUpRight" size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Expenses</p>
              <h3 className="text-2xl font-bold">{currency}{totals.expense.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </Card>
      </div> */}
      
      {/* Time Period Filter */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              period === 'week' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setPeriod('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-t border-b ${
              period === 'month' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setPeriod('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
              period === 'year' 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Expense by Category Chart */}
        <Card title="Expenses by Category">
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No expense data available for this period
              </div>
            )}
          </div>
        </Card>
        
        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          {recentTransactions.length > 0 ? (
            <div className="overflow-y-auto max-h-64">
              <ul className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => {
                  const category = categories.find(c => c.id === transaction.category);
                  return (
                    <li key={transaction.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`rounded-full p-2 mr-3 ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <Icon 
                              name={category?.icon || 'HelpCircle'} 
                              size={16} 
                              className={
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                              } 
                            />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(transaction.date), 'dd MMM yyyy')}
                            </p>
                          </div>
                        </div>
                        <span className={`font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{currency}{transaction.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No transactions yet
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;