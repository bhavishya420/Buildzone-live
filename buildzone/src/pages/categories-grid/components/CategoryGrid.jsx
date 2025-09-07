import React from 'react';
import CategoryCard from './CategoryCard';
import CategorySkeleton from './CategorySkeleton';

const CategoryGrid = ({ categories, loading, language }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 })?.map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (categories?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {language === 'hindi' ? 'कोई श्रेणी नहीं मिली' : 'No Categories Found'}
        </h3>
        <p className="text-muted-foreground">
          {language === 'hindi' ?'अपनी खोज को समायोजित करने या फिल्टर साफ़ करने का प्रयास करें' :'Try adjusting your search or clearing filters'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories?.map((category) => (
        <CategoryCard
          key={category?.id}
          category={category}
          language={language}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;