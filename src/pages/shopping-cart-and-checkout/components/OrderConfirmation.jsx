import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderConfirmation = ({ orderData }) => {
  const navigate = useNavigate();

  const {
    orderNumber,
    total,
    paymentMethod,
    deliveryDate,
    deliveryAddress,
    estimatedDelivery
  } = orderData;

  return (
    <div className="text-center py-8">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="CheckCircle" size={40} className="text-success" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Order Placed Successfully!
      </h2>
      <p className="text-muted-foreground mb-6">
        Thank you for your order. We'll process it shortly.
      </p>
      {/* Order Details Card */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Order Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order Number</span>
            <span className="text-sm font-medium text-foreground font-mono">
              #{orderNumber}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-sm font-semibold text-foreground">
              ₹{total?.toLocaleString('en-IN')}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Payment Method</span>
            <span className="text-sm font-medium text-foreground">
              {paymentMethod === 'bnpl' ? 'BNPL Credit' : 
               paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
            </span>
          </div>
          
          <div className="border-t border-border pt-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Delivery Address</span>
              <span className="text-sm font-medium text-foreground text-right max-w-[200px]">
                {deliveryAddress}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estimated Delivery</span>
            <span className="text-sm font-medium text-success">
              {estimatedDelivery}
            </span>
          </div>
        </div>
      </div>
      {/* Next Steps */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <h4 className="text-sm font-semibold text-foreground mb-2">What's Next?</h4>
        <div className="space-y-2 text-left">
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Order confirmation will be sent to your registered mobile number
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Truck" size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              You'll receive tracking details once the order is dispatched
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="FileText" size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              GST invoice will be available in your orders section
            </span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="default"
          onClick={() => navigate('/orders-and-tracking')}
          className="min-w-[140px]"
        >
          <Icon name="Package" size={16} className="mr-2" />
          Track Order
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/home-dashboard')}
          className="min-w-[140px]"
        >
          <Icon name="Home" size={16} className="mr-2" />
          Continue Shopping
        </Button>
      </div>
      {/* Support Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground mb-2">
          Need help with your order?
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Phone" size={12} />
            <span>1800-123-4567</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Mail" size={12} />
            <span>support@buildzone.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;