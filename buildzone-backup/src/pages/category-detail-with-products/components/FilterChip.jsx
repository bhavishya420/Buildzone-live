import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChip = ({ label, onRemove, className = '' }) => {
  return (
    <div className={`inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary/20 transition-colors"
      >
        <Icon name="X" size={12} />
      </button>
    </div>
  );
};

export default FilterChip;