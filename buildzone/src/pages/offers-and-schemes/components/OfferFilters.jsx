import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const OfferFilters = ({ onFiltersChange, appliedFilters = {} }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(appliedFilters);

  const offerTypeOptions = [
    { value: 'all', label: 'All Offers' },
    { value: 'flash', label: 'Flash Deals' },
    { value: 'brand', label: 'Brand Promotions' },
    { value: 'bulk', label: 'Bulk Discounts' },
    { value: 'seasonal', label: 'Seasonal Offers' }
  ];

  const brandOptions = [
    { value: 'all', label: 'All Brands' },
    { value: 'hindware', label: 'Hindware' },
    { value: 'cera', label: 'Cera' },
    { value: 'parryware', label: 'Parryware' },
    { value: 'jaquar', label: 'Jaquar' },
    { value: 'kohler', label: 'Kohler' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'taps', label: 'Taps & Faucets' },
    { value: 'pipes', label: 'Pipes & Fittings' },
    { value: 'tanks', label: 'Water Tanks' },
    { value: 'tiles', label: 'Tiles' },
    { value: 'adhesives', label: 'Adhesives' }
  ];

  const discountRangeOptions = [
    { value: 'all', label: 'Any Discount' },
    { value: '0-10', label: 'Up to 10%' },
    { value: '10-25', label: '10% - 25%' },
    { value: '25-40', label: '25% - 40%' },
    { value: '40+', label: '40% & Above' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      offerType: 'all',
      brand: 'all',
      category: 'all',
      discountRange: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters)?.filter(value => value && value !== 'all')?.length;
  };

  const removeFilter = (key) => {
    handleFilterChange(key, 'all');
  };

  return (
    <div className="bg-background border-b border-border">
      {/* Filter Toggle Button - Mobile */}
      <div className="md:hidden px-4 py-3">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          iconName="Filter"
          iconPosition="left"
          className="w-full justify-center"
        >
          Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
        </Button>
      </div>
      {/* Filter Panel */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block px-4 py-4 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4`}>
        {/* Offer Type Filter */}
        <div className="flex-1 min-w-0">
          <Select
            options={offerTypeOptions}
            value={filters?.offerType || 'all'}
            onChange={(value) => handleFilterChange('offerType', value)}
            placeholder="Offer Type"
            className="w-full"
          />
        </div>

        {/* Brand Filter */}
        <div className="flex-1 min-w-0">
          <Select
            options={brandOptions}
            value={filters?.brand || 'all'}
            onChange={(value) => handleFilterChange('brand', value)}
            placeholder="Brand"
            searchable
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="flex-1 min-w-0">
          <Select
            options={categoryOptions}
            value={filters?.category || 'all'}
            onChange={(value) => handleFilterChange('category', value)}
            placeholder="Category"
            className="w-full"
          />
        </div>

        {/* Discount Range Filter */}
        <div className="flex-1 min-w-0">
          <Select
            options={discountRangeOptions}
            value={filters?.discountRange || 'all'}
            onChange={(value) => handleFilterChange('discountRange', value)}
            placeholder="Discount Range"
            className="w-full"
          />
        </div>

        {/* Clear Filters */}
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            iconName="X"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            Clear All
          </Button>
        )}
      </div>
      {/* Applied Filters Chips */}
      {getActiveFiltersCount() > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {filters?.offerType && filters?.offerType !== 'all' && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span className="mr-2">
                  {offerTypeOptions?.find(opt => opt?.value === filters?.offerType)?.label}
                </span>
                <button
                  onClick={() => removeFilter('offerType')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
            
            {filters?.brand && filters?.brand !== 'all' && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span className="mr-2">
                  {brandOptions?.find(opt => opt?.value === filters?.brand)?.label}
                </span>
                <button
                  onClick={() => removeFilter('brand')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
            
            {filters?.category && filters?.category !== 'all' && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span className="mr-2">
                  {categoryOptions?.find(opt => opt?.value === filters?.category)?.label}
                </span>
                <button
                  onClick={() => removeFilter('category')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
            
            {filters?.discountRange && filters?.discountRange !== 'all' && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span className="mr-2">
                  {discountRangeOptions?.find(opt => opt?.value === filters?.discountRange)?.label}
                </span>
                <button
                  onClick={() => removeFilter('discountRange')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferFilters;