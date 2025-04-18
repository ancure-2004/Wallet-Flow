import React, { useState } from 'react';
import { format } from 'date-fns';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const TransactionForm = ({ initialData, onClose }) => {
  const { addTransaction, updateTransaction, categories } = useApp();
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    type: initialData?.type || 'expense',
    category: initialData?.category || '',
    date: initialData?.date 
      ? format(new Date(initialData.date), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd')
  });
  const [errors, setErrors] = useState({});
  
  const filteredCategories = categories.filter(category => category.type === formData.type);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear category if type changes
    if (name === 'type' && formData.category) {
      const categoryExists = categories.find(
        c => c.id === formData.category && c.type === value
      );
      
      if (!categoryExists) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          category: ''
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    if (initialData) {
      updateTransaction({ ...transactionData, id: initialData.id });
    } else {
      addTransaction(transactionData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`w-full py-2 px-4 text-sm font-medium rounded-l-md border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  formData.type === 'income'
                    ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary-500'
                }`}
                onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
              >
                Income
              </button>
              <button
                type="button"
                className={`w-full py-2 px-4 text-sm font-medium rounded-r-md border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  formData.type === 'expense'
                    ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary-500'
                }`}
                onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
              >
                Expense
              </button>
            </div>
          </div>
        </div>
        
        <Input
          label="Description"
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          error={errors.description}
          fullWidth
        />
        
        <Input
          label="Amount (₹)"
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          error={errors.amount}
          fullWidth
        />
        
        <Select
          label="Category"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={filteredCategories.map(category => ({
            value: category.id,
            label: category.name
          }))}
          placeholder="Select category"
          error={errors.category}
          fullWidth
        />
        
        <Input
          label="Date"
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          fullWidth
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button 
          variant="secondary" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;