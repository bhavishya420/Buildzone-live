import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchFilter = ({ onSearch, onFilterChange, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    trending: false,
    discount: false,
    newArrivals: false
  });

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterToggle = (filterKey) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: !selectedFilters?.[filterKey]
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({
      trending: false,
      discount: false,
      newArrivals: false
    });
    onFilterChange({
      trending: false,
      discount: false,
      newArrivals: false
    });
  };

  const activeFiltersCount = Object.values(selectedFilters)?.filter(Boolean)?.length;

  const filterOptions = [
    { key: 'trending', label: language === 'hindi' ? 'ट्रेंडिंग' : 'Trending', icon: 'TrendingUp' },
    { key: 'discount', label: language === 'hindi' ? 'छूट' : 'Discount', icon: 'Tag' },
    { key: 'newArrivals', label: language === 'hindi' ? 'नए उत्पाद' : 'New Arrivals', icon: 'Sparkles' }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Input
          type="search"
          placeholder={language === 'hindi' ? 'श्रेणियां खोजें...' : 'Search categories...'}
          value={searchQuery}
          onChange={(e) => handleSearch(e?.target?.value)}
          className="pl-10"
        />
        <Icon
          name="Search"
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
      </div>
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          iconName="Filter"
          iconPosition="left"
          className="relative"
        >
          {language === 'hindi' ? 'फिल्टर' : 'Filters'}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            {language === 'hindi' ? 'साफ़ करें' : 'Clear'}
          </Button>
        )}
      </div>
      {/* Filter Options */}
      {showFilters && (
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-foreground text-sm">
            {language === 'hindi' ? 'फिल्टर विकल्प' : 'Filter Options'}
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {filterOptions?.map((filter) => (
              <button
                key={filter?.key}
                onClick={() => handleFilterToggle(filter?.key)}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  selectedFilters?.[filter?.key]
                    ? 'bg-primary/10 border-primary text-primary' :'bg-background border-border text-foreground hover:bg-surface'
                }`}
              >
                <Icon
                  name={filter?.icon}
                  size={16}
                  className={selectedFilters?.[filter?.key] ? 'text-primary' : 'text-muted-foreground'}
                />
                <span className="text-sm font-medium">{filter?.label}</span>
                {selectedFilters?.[filter?.key] && (
                  <Icon
                    name="Check"
                    size={14}
                    className="text-primary ml-auto"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;