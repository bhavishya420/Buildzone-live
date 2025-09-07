import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OrderFilters = ({ 
  activeFilter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  orderCounts 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = [
    { key: 'all', label: 'All Orders', count: orderCounts?.all || 0, icon: 'Package' },
    { key: 'draft', label: 'Draft', count: orderCounts?.draft || 0, icon: 'Edit' },
    { key: 'active', label: 'Active', count: orderCounts?.active || 0, icon: 'Clock' },
    { key: 'completed', label: 'Completed', count: orderCounts?.completed || 0, icon: 'CheckCircle' },
    { key: 'cancelled', label: 'Cancelled', count: orderCounts?.cancelled || 0, icon: 'XCircle' }
  ];

  const getFilterColor = (key) => {
    switch (key) {
      case 'draft':
        return activeFilter === key ? 'bg-orange text-white' : 'text-orange border-orange/20 hover:bg-orange/10';
      case 'active':
        return activeFilter === key ? 'bg-primary text-white' : 'text-primary border-primary/20 hover:bg-primary/10';
      case 'completed':
        return activeFilter === key ? 'bg-success text-white' : 'text-success border-success/20 hover:bg-success/10';
      case 'cancelled':
        return activeFilter === key ? 'bg-error text-white' : 'text-error border-error/20 hover:bg-error/10';
      default:
        return activeFilter === key ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/10';
    }
  };

  return (
    <div className="bg-card border-b border-border sticky top-16 z-50">
      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search orders or products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-10"
          />
          <Icon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="px-4 pb-4">
        <div className="flex space-x-1 bg-muted/10 p-1 rounded-lg">
          {filterOptions?.map((filter) => (
            <Button
              key={filter?.key}
              variant={activeFilter === filter?.key ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(filter?.key)}
              className={`flex-1 relative ${
                activeFilter === filter?.key 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="truncate">{filter?.label}</span>
              {filter?.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                  activeFilter === filter?.key
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {filter?.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
      {/* Advanced Filters - Desktop */}
      <div className="hidden lg:block px-4 pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Date Range:</span>
            <Button variant="outline" size="sm">
              Last 30 days
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Amount:</span>
            <Button variant="outline" size="sm">
              All amounts
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </Button>
          </div>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;