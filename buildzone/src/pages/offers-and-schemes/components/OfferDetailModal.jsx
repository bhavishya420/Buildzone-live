import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const OfferDetailModal = ({ offer, isOpen, onClose }) => {
  if (!isOpen || !offer) return null;

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-500 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Offer Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Offer Image */}
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src={offer?.image}
              alt={offer?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-error text-error-foreground px-3 py-1 rounded-full font-bold text-lg">
              {offer?.discount}% OFF
            </div>
          </div>

          {/* Offer Title & Description */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{offer?.title}</h3>
            <p className="text-muted-foreground">{offer?.description}</p>
          </div>

          {/* Price Information */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-foreground">Special Price:</span>
              <span className="text-2xl font-bold text-success">
                ₹{offer?.salePrice?.toLocaleString('en-IN')}
              </span>
            </div>
            {offer?.originalPrice && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Original Price:</span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{offer?.originalPrice?.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            {offer?.savings && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-success">You Save:</span>
                <span className="text-lg font-bold text-success">
                  ₹{offer?.savings?.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Icon name="FileText" size={20} className="mr-2" />
              Terms & Conditions
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Valid till {offer?.validUntil}</span>
              </div>
              {offer?.minOrder && (
                <div className="flex items-start space-x-2">
                  <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Minimum order value: ₹{offer?.minOrder?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Applicable on selected products only</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Cannot be combined with other offers</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Subject to stock availability</span>
              </div>
              {offer?.stockLeft && (
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                  <span>Limited stock: Only {offer?.stockLeft} items remaining</span>
                </div>
              )}
            </div>
          </div>

          {/* Eligible Products */}
          {offer?.eligibleProducts && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Package" size={20} className="mr-2" />
                Eligible Products
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {offer?.eligibleProducts?.map((product, index) => (
                  <div key={index} className="bg-muted rounded-lg p-3 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon name="Package" size={20} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{product}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="default"
              className="flex-1"
              iconName="ShoppingBag"
              iconPosition="left"
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              iconName="Share2"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailModal;