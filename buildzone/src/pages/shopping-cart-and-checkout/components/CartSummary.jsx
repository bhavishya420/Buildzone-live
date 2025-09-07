import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CartSummary = ({ cartData, onApplyBNPL, bnplApplied }) => {
  const { subtotal, gst, deliveryCharges, total, availableCredit } = cartData;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
      {/* Price Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-medium text-foreground">
            ₹{subtotal?.toLocaleString('en-IN')}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">GST (18%)</span>
          <span className="text-sm font-medium text-foreground">
            ₹{gst?.toLocaleString('en-IN')}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Delivery Charges</span>
          <span className="text-sm font-medium text-foreground">
            {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges?.toLocaleString('en-IN')}`}
          </span>
        </div>
        
        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-foreground">Total Amount</span>
            <span className="text-lg font-bold text-foreground">
              ₹{total?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
      {/* BNPL Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="CreditCard" size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Buy Now, Pay Later
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              45 days interest-free credit • Available: ₹{availableCredit?.toLocaleString('en-IN')}
            </p>
            
            {!bnplApplied ? (
              <Button
                variant="default"
                size="sm"
                onClick={onApplyBNPL}
                disabled={total > availableCredit}
                className="w-full"
              >
                <Icon name="Zap" size={14} className="mr-2" />
                Apply BNPL Credit
              </Button>
            ) : (
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={14} />
                <span className="text-xs font-medium">BNPL Credit Applied</span>
              </div>
            )}
            
            {total > availableCredit && (
              <p className="text-xs text-destructive mt-2">
                Order amount exceeds available credit limit
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Trust Signals */}
      <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="FileText" size={12} />
          <span>GST Compliant</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Truck" size={12} />
          <span>Fast Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;