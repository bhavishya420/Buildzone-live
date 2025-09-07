import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange, isMobile = false }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([filters?.minPrice || 0, filters?.maxPrice || 100000]);

  const brands = [
    "Hindware", "Parryware", "Cera", "Kohler", "Jaquar", "Marc", "Somany", "Kajaria", "Johnson", "Asian Paints"
  ];

  const sizes = [
    "15mm", "20mm", "25mm", "32mm", "40mm", "50mm", "75mm", "100mm", "150mm", "200mm"
  ];

  const ratings = [
    { value: 4, label: "4★ & above" },
    { value: 3, label: "3★ & above" },
    { value: 2, label: "2★ & above" },
    { value: 1, label: "1★ & above" }
  ];

  const handleBrandChange = (brand, checked) => {
    const updatedBrands = checked 
      ? [...localFilters?.brands, brand]
      : localFilters?.brands?.filter(b => b !== brand);
    
    setLocalFilters(prev => ({ ...prev, brands: updatedBrands }));
  };

  const handleSizeChange = (size, checked) => {
    const updatedSizes = checked 
      ? [...localFilters?.sizes, size]
      : localFilters?.sizes?.filter(s => s !== size);
    
    setLocalFilters(prev => ({ ...prev, sizes: updatedSizes }));
  };

  const handleRatingChange = (rating) => {
    setLocalFilters(prev => ({ ...prev, minRating: rating }));
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
    setLocalFilters(prev => ({ 
      ...prev, 
      minPrice: newRange?.[0], 
      maxPrice: newRange?.[1] 
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile) onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      brands: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 100000,
      minRating: 0
    };
    setLocalFilters(clearedFilters);
    setPriceRange([0, 100000]);
    onFiltersChange(clearedFilters);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Min</label>
              <input
                type="number"
                value={priceRange?.[0]}
                onChange={(e) => handlePriceChange(0, e?.target?.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Max</label>
              <input
                type="number"
                value={priceRange?.[1]}
                onChange={(e) => handlePriceChange(1, e?.target?.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                placeholder="100000"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            ₹{priceRange?.[0]?.toLocaleString('en-IN')} - ₹{priceRange?.[1]?.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands?.map(brand => (
            <Checkbox
              key={brand}
              label={brand}
              checked={localFilters?.brands?.includes(brand)}
              onChange={(e) => handleBrandChange(brand, e?.target?.checked)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes?.map(size => (
            <Checkbox
              key={size}
              label={size}
              checked={localFilters?.sizes?.includes(size)}
              onChange={(e) => handleSizeChange(size, e?.target?.checked)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-medium text-foreground mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {ratings?.map(rating => (
            <label key={rating?.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating?.value}
                checked={localFilters?.minRating === rating?.value}
                onChange={() => handleRatingChange(rating?.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm text-foreground">{rating?.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="flex-1"
        >
          Clear All
        </Button>
        <Button
          variant="default"
          onClick={handleApplyFilters}
          className="flex-1"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-300 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-x-0 bottom-0 bg-card border-t border-border rounded-t-xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="w-80 bg-card border border-border rounded-lg p-6 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear All
        </Button>
      </div>
      <FilterContent />
    </div>
  );
};

export default FilterPanel;