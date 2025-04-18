import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '', 
  bodyClassName = '',
  padding = true,
  ...props 
}) => {
  const paddingClass = padding ? 'p-4' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`${paddingClass} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;