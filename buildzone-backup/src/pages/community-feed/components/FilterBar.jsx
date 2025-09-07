import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterBar = ({ activeFilter, onFilterChange, sortBy, onSortChange }) => {
  const filters = [
    { id: 'all', label: 'All Posts', icon: 'Grid3X3' },
    { id: 'market-rates', label: 'Market Rates', icon: 'TrendingUp' },
    { id: 'tips', label: 'Tips & Tricks', icon: 'Lightbulb' },
    { id: 'product-spotlight', label: 'Products', icon: 'Star' },
    { id: 'industry-news', label: 'News', icon: 'Newspaper' }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Most Recent', icon: 'Clock' },
    { id: 'helpful', label: 'Most Helpful', icon: 'ThumbsUp' },
    { id: 'views', label: 'Most Viewed', icon: 'Eye' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
        {filters?.map((filter) => (
          <Button
            key={filter?.id}
            variant={activeFilter === filter?.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter?.id)}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <Icon name={filter?.icon} size={16} />
            <span className="hidden sm:inline">{filter?.label}</span>
          </Button>
        ))}
      </div>
      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Sort by:</span>
        <div className="flex items-center space-x-2">
          {sortOptions?.map((option) => (
            <Button
              key={option?.id}
              variant={sortBy === option?.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onSortChange(option?.id)}
              className="flex items-center space-x-1"
            >
              <Icon name={option?.icon} size={14} />
              <span className="text-xs">{option?.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;