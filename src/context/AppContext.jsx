import { createContext, useContext, useReducer, useEffect } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Initialize the context
const AppContext = createContext();

// Initial state
const initialState = {
  transactions: [],
  categories: [
    { id: 'salary', name: 'Salary', type: 'income', icon: 'Briefcase' },
    { id: 'investment', name: 'Investment', type: 'income', icon: 'TrendingUp' },
    { id: 'gift', name: 'Gift', type: 'income', icon: 'Gift' },
    { id: 'food', name: 'Food & Dining', type: 'expense', icon: 'UtensilsCrossed' },
    { id: 'transport', name: 'Transportation', type: 'expense', icon: 'Car' },
    { id: 'shopping', name: 'Shopping', type: 'expense', icon: 'ShoppingBag' },
    { id: 'housing', name: 'Housing', type: 'expense', icon: 'Home' },
    { id: 'utilities', name: 'Utilities', type: 'expense', icon: 'Plug' },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'Film' },
    { id: 'health', name: 'Healthcare', type: 'expense', icon: 'Heart' },
    { id: 'education', name: 'Education', type: 'expense', icon: 'GraduationCap' },
    { id: 'other', name: 'Other', type: 'expense', icon: 'MoreHorizontal' },
  ],
  budget: {
    income: 0,
    expense: 0
  },
  currency: '₹', // Indian Rupee symbol
  loading: true
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => 
          transaction.id !== action.payload
        )
      };
    case 'SET_BUDGET':
      return { ...state, budget: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        const transactions = await localforage.getItem('transactions');
        const budget = await localforage.getItem('budget');
        
        if (transactions) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
        }
        
        if (budget) {
          dispatch({ type: 'SET_BUDGET', payload: budget });
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error loading data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadData();
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      localforage.setItem('transactions', state.transactions);
      localforage.setItem('budget', state.budget);
    }
  }, [state.transactions, state.budget, state.loading]);

  // Helper functions
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: uuidv4(),
      date: new Date().toISOString(),
      ...transaction
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const updateTransaction = (transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const setBudget = (budget) => {
    dispatch({ type: 'SET_BUDGET', payload: budget });
  };

  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      income: 0,
      expense: 0,
      balance: 0
    };

    state.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totals.income += transaction.amount;
      } else {
        totals.expense += transaction.amount;
      }
    });

    totals.balance = totals.income - totals.expense;
    return totals;
  };

  // Get transactions by category
  const getTransactionsByCategory = () => {
    const categoryTotals = {};
    
    state.categories.forEach(category => {
      categoryTotals[category.id] = 0;
    });

    state.transactions.forEach(transaction => {
      if (categoryTotals[transaction.category] !== undefined) {
        categoryTotals[transaction.category] += transaction.amount;
      }
    });

    return categoryTotals;
  };

  const value = {
    ...state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
    calculateTotals,
    getTransactionsByCategory
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}