import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import localforage from 'localforage';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const { currency } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [exportData, setExportData] = useState('');
  
  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      const transactions = await localforage.getItem('transactions') || [];
      const budget = await localforage.getItem('budget') || { income: 0, expense: 0 };
      
      const dataToExport = {
        transactions,
        budget,
        exportDate: new Date().toISOString()
      };
      
      const jsonData = JSON.stringify(dataToExport, null, 2);
      setExportData(jsonData);
      
    } catch (error) {
      console.error('Export error:', error);
    }
  };
  
  const handleImportData = async () => {
    try {
      setImportError('');
      
      if (!importData.trim()) {
        setImportError('Please paste exported data');
        return;
      }
      
      const parsedData = JSON.parse(importData);
      
      if (!parsedData.transactions || !parsedData.budget) {
        setImportError('Invalid data format');
        return;
      }
      
      await localforage.setItem('transactions', parsedData.transactions);
      await localforage.setItem('budget', parsedData.budget);
      
      // Refresh the page to load the new data
      window.location.reload();
      
    } catch (error) {
      console.error('Import error:', error);
      setImportError('Failed to import data. Make sure the format is correct.');
    }
  };
  
  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      await localforage.clear();
      window.location.reload();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* App Info */}
        <Card title="App Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">App Name</p>
              <p className="font-medium">Wallet Flow</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Currency</p>
              <p className="font-medium">{currency} (Indian Rupee)</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
          </div>
        </Card>
        
        {/* Data Management */}
        <Card title="Data Management">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Export Data</h3>
              <p className="text-sm text-gray-500 mb-3">
                Export all your transactions and budget data as JSON
              </p>
              
              <Button onClick={handleExportData}>
                Export Data
              </Button>
              
              {isExporting && exportData && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Copy this data and save it somewhere safe:</p>
                  <textarea
                    className="w-full h-32 p-2 border border-gray-300 rounded-md font-mono text-xs"
                    value={exportData}
                    readOnly
                  ></textarea>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(exportData);
                      alert('Copied to clipboard!');
                    }}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    Copy to clipboard
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Import Data</h3>
              <p className="text-sm text-gray-500 mb-3">
                Import previously exported data
              </p>
              
              <Button onClick={() => setIsImporting(!isImporting)}>
                Import Data
              </Button>
              
              {isImporting && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Paste your exported data:</p>
                  <textarea
                    className="w-full h-32 p-2 border border-gray-300 rounded-md font-mono text-xs"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                  ></textarea>
                  
                  {importError && (
                    <p className="text-sm text-red-600 mt-1">{importError}</p>
                  )}
                  
                  <Button 
                    onClick={handleImportData}
                    className="mt-2"
                  >
                    Confirm Import
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Reset App Data</h3>
              <p className="text-sm text-gray-500 mb-3">
                Delete all your data and start fresh. This action cannot be undone.
              </p>
              
              <Button 
                variant="danger"
                onClick={handleClearData}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;