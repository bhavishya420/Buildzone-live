import React from 'react';

const CategorySkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
      <div className="aspect-square mb-3 rounded-lg bg-muted"></div>
      
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        
        <div className="flex items-center justify-between">
          <div className="h-3 bg-muted rounded w-16"></div>
          <div className="h-3 bg-muted rounded w-12"></div>
        </div>
        
        <div className="h-6 bg-muted rounded w-20"></div>
      </div>
    </div>
  );
};

export default CategorySkeleton;