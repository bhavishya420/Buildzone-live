import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count })?.map((_, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-32 mb-1"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
            <div className="w-6 h-6 bg-muted rounded"></div>
          </div>

          {/* Badge Skeleton */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-6 bg-muted rounded-full w-20"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>

          {/* Content Skeleton */}
          <div className="mb-4">
            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>

          {/* Image Skeleton */}
          {index % 2 === 0 && (
            <div className="h-48 bg-muted rounded-lg mb-4"></div>
          )}

          {/* Footer Skeleton */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-muted rounded w-12"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded"></div>
              <div className="w-6 h-6 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;