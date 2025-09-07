import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickAccessShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts = [
    {
      id: 'taps',
      name: 'Taps',
      icon: 'Droplets',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      count: '500+ Products'
    },
    {
      id: 'pipes',
      name: 'Pipes',
      icon: 'Zap',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: '300+ Products'
    },
    {
      id: 'tanks',
      name: 'Tanks',
      icon: 'Container',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      count: '150+ Products'
    },
    {
      id: 'valves',
      name: 'Valves',
      icon: 'Settings',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      count: '200+ Products'
    }
  ];

  const handleShortcutClick = (shortcut) => {
    navigate('/category-detail-with-products', { 
      state: { 
        category: shortcut?.name,
        categoryId: shortcut?.id 
      } 
    });
  };

  return (
    <div className="bg-background">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
          <p className="text-sm text-muted-foreground">Popular categories</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shortcuts?.map((shortcut) => (
          <button
            key={shortcut?.id}
            onClick={() => handleShortcutClick(shortcut)}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-elevated transition-all duration-300 text-left group"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 ${shortcut?.bgColor} rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <Icon 
                name={shortcut?.icon} 
                size={24} 
                className={shortcut?.color}
              />
            </div>
            
            <h3 className="font-semibold text-foreground text-sm mb-1">
              {shortcut?.name}
            </h3>
            
            <p className="text-xs text-muted-foreground">
              {shortcut?.count}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessShortcuts;