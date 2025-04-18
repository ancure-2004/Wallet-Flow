import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Budget = () => {
  const { budget, setBudget, calculateTotals, currency } = useApp();
  const [formData, setFormData] = useState({
    income: budget.income,
    expense: budget.expense
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const totals = calculateTotals();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setBudget(formData);
    setIsEditing(false);
  };
  
  // Calculate percentages for progress bars
  const incomePercentage = budget.income > 0 
    ? Math.min(Math.round((totals.income / budget.income) * 100), 100) 
    : 0;
    
  const expensePercentage = budget.expense > 0 
    ? Math.min(Math.round((totals.expense / budget.expense) * 100), 100) 
    : 0;
  
  // Prepare data for pie chart
  const pieData = [
    { name: 'Remaining Budget', value: Math.max(budget.expense - totals.expense, 0) },
    { name: 'Spent', value: totals.expense }
  ];
  
  const COLORS = ['#0ea5e9', '#ef4444'];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget Management</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Budget
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <Card className="mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Monthly Income Budget"
                type="number"
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="100"
                fullWidth
              />
              
              <Input
                label="Monthly Expense Budget"
                type="number"
                id="expense"
                name="expense"
                value={formData.expense}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="100"
                fullWidth
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Budget</Button>
            </div>
          </form>
        </Card>
      ) : (
        <>
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Monthly Income">
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-gray-500">Budget</span>
                <span className="font-medium">{currency}{budget.income.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-gray-500">Actual</span>
                <span className="font-medium text-green-600">{currency}{totals.income.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{incomePercentage}% of budget</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${incomePercentage}%` }}
                  ></div>
                </div>
              </div>
            </Card>
            
            <Card title="Monthly Expenses">
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-gray-500">Budget</span>
                <span className="font-medium">{currency}{budget.expense.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-gray-500">Actual</span>
                <span className="font-medium text-red-600">{currency}{totals.expense.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{expensePercentage}% of budget</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      expensePercentage > 90 ? 'bg-red-600' : 'bg-blue-600'
                    }`} 
                    style={{ width: `${expensePercentage}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Pie Chart */}
          <Card title="Expense Budget Utilization">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${currency}${value.toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Budget;