import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (offer?.type === 'flash' && offer?.endTime) {
      const timer = setInterval(() => {
        const now = new Date()?.getTime();
        const endTime = new Date(offer.endTime)?.getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setIsExpired(true);
          setTimeLeft('Expired');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [offer?.endTime, offer?.type]);

  const handleOfferClick = () => {
    if (!isExpired) {
      navigate('/categories-grid', { state: { offerId: offer?.id } });
    }
  };

  const handleShareOffer = (e) => {
    e?.stopPropagation();
    const shareText = `Check out this amazing offer: ${offer?.title} - ${offer?.discount}% OFF! Valid till ${offer?.validUntil}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getOfferTypeColor = (type) => {
    switch (type) {
      case 'flash': return 'bg-red-500 text-white';
      case 'brand': return 'bg-blue-500 text-white';
      case 'bulk': return 'bg-green-500 text-white';
      case 'seasonal': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getOfferTypeLabel = (type) => {
    switch (type) {
      case 'flash': return 'Flash Deal';
      case 'brand': return 'Brand Promo';
      case 'bulk': return 'Bulk Discount';
      case 'seasonal': return 'Seasonal';
      default: return 'Special Offer';
    }
  };

  return (
    <div 
      className={`bg-card border border-border rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer ${
        isExpired ? 'opacity-60' : 'hover:scale-[1.02]'
      }`}
      onClick={handleOfferClick}
    >
      {/* Offer Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={offer?.image}
          alt={offer?.title}
          className="w-full h-full object-cover"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-error text-error-foreground px-3 py-1 rounded-full font-bold text-lg">
          {offer?.discount}% OFF
        </div>
        
        {/* Offer Type Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getOfferTypeColor(offer?.type)}`}>
          {getOfferTypeLabel(offer?.type)}
        </div>
        
        {/* Flash Deal Timer */}
        {offer?.type === 'flash' && !isExpired && timeLeft && (
          <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
            <Icon name="Clock" size={14} className="inline mr-1" />
            {timeLeft}
          </div>
        )}
        
        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-bold">
              EXPIRED
            </div>
          </div>
        )}
      </div>
      {/* Offer Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
            {offer?.title}
          </h3>
          <button
            onClick={handleShareOffer}
            className="ml-2 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <Icon name="Share2" size={16} className="text-muted-foreground" />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {offer?.description}
        </p>

        {/* Price Information */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-success">
            ₹{offer?.salePrice?.toLocaleString('en-IN')}
          </span>
          {offer?.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{offer?.originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
          {offer?.savings && (
            <span className="text-sm text-success font-medium">
              Save ₹{offer?.savings?.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Offer Details */}
        <div className="space-y-2 mb-4">
          {offer?.minOrder && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="ShoppingCart" size={14} className="mr-1" />
              Min order: ₹{offer?.minOrder?.toLocaleString('en-IN')}
            </div>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Calendar" size={14} className="mr-1" />
            Valid till {offer?.validUntil}
          </div>
          
          {offer?.stockLeft && (
            <div className="flex items-center text-xs text-warning">
              <Icon name="Package" size={14} className="mr-1" />
              Only {offer?.stockLeft} left in stock
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant={isExpired ? "outline" : "default"}
          disabled={isExpired}
          className="w-full"
          iconName={isExpired ? "Clock" : "ShoppingBag"}
          iconPosition="left"
        >
          {isExpired ? 'Offer Expired' : 'Shop Now'}
        </Button>
      </div>
    </div>
  );
};

export default OfferCard;