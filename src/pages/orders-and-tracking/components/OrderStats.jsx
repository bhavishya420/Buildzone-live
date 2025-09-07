import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderStats = ({ stats }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const statItems = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Total Spent',
      value: formatAmount(stats?.totalSpent),
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'This Month',
      value: stats?.thisMonth,
      icon: 'Calendar',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Avg Order',
      value: formatAmount(stats?.avgOrderValue),
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems?.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 ${item?.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <p className="text-lg font-semibold text-foreground font-mono">
              {item?.value}
            </p>
            <p className="text-sm text-muted-foreground">
              {item?.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStats;