import React from 'react';
import * as LucideIcons from 'lucide-react';

const Icon = ({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  className = '',
  ...props 
}) => {
  const LucideIcon = LucideIcons[name] || LucideIcons.HelpCircle;
  
  return (
    <LucideIcon 
      size={size} 
      color={color} 
      className={className}
      {...props}
    />
  );
};

export default Icon;