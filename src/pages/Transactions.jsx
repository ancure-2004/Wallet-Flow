import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Icon from '../components/common/Icon';

const Transactions = () => {
  const { transactions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter transactions based on type and search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => setShowForm(true)}>
          <Icon name="Plus" size={18} className="mr-2" />
          Add Transaction
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                  filterType === 'all' 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${
                  filterType === 'income' 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setFilterType('income')}
              >
                Income
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
                  filterType === 'expense' 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setFilterType('expense')}
              >
                Expense
              </button>
            </div>
          </div>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </Card>
      
      {/* Transaction List */}
      <Card>
        <TransactionList 
          transactions={sortedTransactions} 
          onEdit={handleEdit} 
        />
      </Card>
      
      {/* Transaction Form (Modal) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h3>
            </div>
            <TransactionForm 
              initialData={editingTransaction}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;