import React from 'react';

const OrderSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-soft p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-lg"></div>
          <div>
            <div className="h-4 bg-muted rounded w-24 mb-1"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="w-5 h-5 bg-muted rounded"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="h-6 bg-muted rounded-full w-24"></div>
        </div>
        <div className="h-4 bg-muted rounded w-16"></div>
      </div>
    </div>
  );
};

const OrderSkeletonList = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count })?.map((_, index) => (
        <OrderSkeleton key={index} />
      ))}
    </div>
  );
};

export { OrderSkeleton, OrderSkeletonList };