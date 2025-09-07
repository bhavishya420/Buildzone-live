import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductInfo = ({ product = {} }) => {
  const {
    name = "Product Name",
    brand = "Brand Name",
    price = 0,
    originalPrice = 0,
    rating = 0,
    reviewCount = 0,
    sku = "SKU123",
    availability = "In Stock",
    gstRate = 18
  } = product;

  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning fill-current" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-4">
      {/* Brand */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded">
          {brand}
        </span>
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={14} className="text-success" />
          <span className="text-xs text-success">Verified</span>
        </div>
      </div>
      {/* Product Name */}
      <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
        {name}
      </h1>
      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {renderStars(rating)}
          <span className="text-sm font-medium text-foreground ml-1">
            {rating?.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          ({reviewCount?.toLocaleString()} reviews)
        </span>
      </div>
      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-3">
          <span className="text-2xl md:text-3xl font-bold text-foreground">
            ₹{price?.toLocaleString()}
          </span>
          {originalPrice > price && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ₹{originalPrice?.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>+ ₹{Math.round(price * gstRate / 100)?.toLocaleString()} GST</span>
          <span>•</span>
          <span>Free delivery above ₹5,000</span>
        </div>
      </div>
      {/* Availability and SKU */}
      <div className="flex items-center justify-between py-3 px-4 bg-surface rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon 
            name={availability === "In Stock" ? "CheckCircle" : "XCircle"} 
            size={16} 
            className={availability === "In Stock" ? "text-success" : "text-error"} 
          />
          <span className={`text-sm font-medium ${
            availability === "In Stock" ? "text-success" : "text-error"
          }`}>
            {availability}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">SKU: {sku}</span>
      </div>
      {/* Trust Signals */}
      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="flex items-center space-x-2">
          <Icon name="Truck" size={16} className="text-primary" />
          <span className="text-sm text-foreground">Fast Delivery</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="RotateCcw" size={16} className="text-primary" />
          <span className="text-sm text-foreground">Easy Returns</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <span className="text-sm text-foreground">Warranty</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CreditCard" size={16} className="text-primary" />
          <span className="text-sm text-foreground">BNPL Available</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;