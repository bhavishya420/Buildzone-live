import React, { useState } from 'react';

import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CheckoutForm = ({ onPlaceOrder, isProcessing, bnplApplied }) => {
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryDate: '',
    paymentMethod: bnplApplied ? 'bnpl' : '',
    orderNotes: ''
  });
  const [errors, setErrors] = useState({});

  const savedAddresses = [
    { value: 'address1', label: 'Shop Address - 123 Main Street, Sector 15, Gurgaon, Haryana 122001' },
    { value: 'address2', label: 'Warehouse - Plot 45, Industrial Area, Phase 2, Gurgaon, Haryana 122016' },
    { value: 'new', label: '+ Add New Address' }
  ];

  const deliverySlots = [
    { value: '2024-08-31', label: 'Tomorrow (31 Aug) - Morning (9 AM - 1 PM)' },
    { value: '2024-09-01', label: 'Sunday (1 Sep) - Afternoon (2 PM - 6 PM)' },
    { value: '2024-09-02', label: 'Monday (2 Sep) - Morning (9 AM - 1 PM)' },
    { value: '2024-09-02-eve', label: 'Monday (2 Sep) - Evening (4 PM - 8 PM)' }
  ];

  const paymentMethods = [
    { value: 'bnpl', label: 'BNPL Credit (45 days interest-free)', disabled: !bnplApplied },
    { value: 'bank_transfer', label: 'Bank Transfer / NEFT' },
    { value: 'cod', label: 'Cash on Delivery' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.deliveryAddress) {
      newErrors.deliveryAddress = 'Please select delivery address';
    }
    if (!formData?.deliveryDate) {
      newErrors.deliveryDate = 'Please select delivery date';
    }
    if (!formData?.paymentMethod) {
      newErrors.paymentMethod = 'Please select payment method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onPlaceOrder(formData);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Checkout Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              1
            </div>
            <span className="text-xs font-medium text-primary">Cart</span>
          </div>
          <div className="flex-1 h-px bg-primary"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              2
            </div>
            <span className="text-xs font-medium text-primary">Checkout</span>
          </div>
          <div className="flex-1 h-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
              3
            </div>
            <span className="text-xs font-medium text-muted-foreground">Confirm</span>
          </div>
        </div>

        {/* Delivery Address */}
        <Select
          label="Delivery Address"
          placeholder="Select delivery address"
          options={savedAddresses}
          value={formData?.deliveryAddress}
          onChange={(value) => handleInputChange('deliveryAddress', value)}
          error={errors?.deliveryAddress}
          required
        />

        {/* Delivery Date */}
        <Select
          label="Delivery Date & Time"
          placeholder="Select delivery slot"
          options={deliverySlots}
          value={formData?.deliveryDate}
          onChange={(value) => handleInputChange('deliveryDate', value)}
          error={errors?.deliveryDate}
          required
        />

        {/* Payment Method */}
        <Select
          label="Payment Method"
          placeholder="Select payment method"
          options={paymentMethods}
          value={formData?.paymentMethod}
          onChange={(value) => handleInputChange('paymentMethod', value)}
          error={errors?.paymentMethod}
          required
        />

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Order Notes (Optional)
          </label>
          <textarea
            value={formData?.orderNotes}
            onChange={(e) => handleInputChange('orderNotes', e?.target?.value)}
            placeholder="Special delivery instructions, floor number, etc."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>

        {/* Place Order Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isProcessing}
          className="w-full mt-6"
          disabled={isProcessing}
        >
          {isProcessing ? (
            'Processing Order...'
          ) : (
            <>
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              Place Order
            </>
          )}
        </Button>

        {/* Additional Info */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            By placing this order, you agree to our Terms & Conditions
          </p>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;