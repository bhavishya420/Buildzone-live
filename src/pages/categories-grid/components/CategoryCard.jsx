import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const CategoryCard = ({ category, language }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate('/category-detail-with-products', { 
      state: { 
        categoryId: category?.id,
        categoryName: category?.name,
        categoryNameHindi: category?.nameHindi
      } 
    });
  };

  return (
    <div 
      onClick={handleCategoryClick}
      className="bg-card border border-border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-elevated hover:border-primary/20 active:scale-95 active:bg-surface"
    >
      <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-surface">
        <Image
          src={category?.image}
          alt={language === 'hindi' ? category?.nameHindi : category?.name}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight">
          {language === 'hindi' ? category?.nameHindi : category?.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {category?.productCount?.toLocaleString('en-IN')} {language === 'hindi' ? 'उत्पाद' : 'Products'}
          </span>
          
          <div className="flex items-center space-x-1">
            <Icon 
              name="TrendingUp" 
              size={12} 
              className="text-success" 
            />
            <span className="text-xs text-success font-medium">
              {category?.trending ? (language === 'hindi' ? 'ट्रेंडिंग' : 'Trending') : ''}
            </span>
          </div>
        </div>
        
        {category?.discount && (
          <div className="bg-error/10 text-error px-2 py-1 rounded-md text-xs font-medium">
            {language === 'hindi' ? `${category?.discount}% छूट` : `${category?.discount}% Off`}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;