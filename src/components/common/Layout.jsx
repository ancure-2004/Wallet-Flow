import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { name: 'Transactions', path: '/transactions', icon: 'ListOrdered' },
    { name: 'Budget', path: '/budget', icon: 'PieChart' },
    { name: 'Settings', path: '/settings', icon: 'Settings' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <div className="bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="./public/walletIcon.png"
              alt="Wallet Flow"
            />
            <span className="ml-2 text-xl font-bold text-primary-600">Wallet Flow</span>
          </div>
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
        
        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="px-2 py-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 rounded-md text-base font-medium
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name={item.icon} className="mr-3 flex-shrink-0" size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
      
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <img
              className="h-8 w-auto"
              src="/walletIcon.png"
              alt="Wallet Flow"
            />
            <span className="ml-2 text-xl font-bold text-primary-600">Wallet Flow</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 rounded-md text-sm font-medium
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <Icon name={item.icon} className="mr-3 flex-shrink-0" size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;