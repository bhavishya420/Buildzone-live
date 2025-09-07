import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ImageCarousel = ({ images = [], productName = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  if (!images?.length) {
    return (
      <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
        <Icon name="ImageOff" size={48} className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative w-full h-80 bg-muted rounded-lg overflow-hidden">
        <Image
          src={images?.[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:bg-background transition-smooth"
            >
              <Icon name="ChevronLeft" size={20} className="text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:bg-background transition-smooth"
            >
              <Icon name="ChevronRight" size={20} className="text-foreground" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images?.length > 1 && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-foreground">
              {currentIndex + 1} / {images?.length}
            </span>
          </div>
        )}
      </div>
      {/* Thumbnail Navigation */}
      {images?.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {images?.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth ${
                index === currentIndex
                  ? 'border-primary' :'border-border hover:border-muted-foreground'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;