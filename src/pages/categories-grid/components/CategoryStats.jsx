import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryStats = ({ totalCategories, totalProducts, language }) => {
  const stats = [
    {
      icon: 'Grid3X3',
      value: totalCategories,
      label: language === 'hindi' ? 'श्रेणियां' : 'Categories',
      color: 'text-primary'
    },
    {
      icon: 'Package',
      value: totalProducts?.toLocaleString('en-IN'),
      label: language === 'hindi' ? 'उत्पाद' : 'Products',
      color: 'text-success'
    },
    {
      icon: 'TrendingUp',
      value: '24/7',
      label: language === 'hindi' ? 'सहायता' : 'Support',
      color: 'text-warning'
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-4 mb-6">
      <div className="grid grid-cols-3 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center mx-auto mb-2 ${stat?.color}`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{stat?.value}</div>
            <div className="text-xs text-muted-foreground">{stat?.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryStats;