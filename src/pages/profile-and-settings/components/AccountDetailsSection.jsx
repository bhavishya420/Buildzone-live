import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AccountDetailsSection = ({ userProfile, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: userProfile?.businessName,
    ownerName: userProfile?.ownerName,
    phone: userProfile?.phone,
    email: userProfile?.email,
    gstNumber: userProfile?.gstNumber,
    address: userProfile?.address,
    city: userProfile?.city,
    state: userProfile?.state,
    pincode: userProfile?.pincode
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdate && onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      businessName: userProfile?.businessName,
      ownerName: userProfile?.ownerName,
      phone: userProfile?.phone,
      email: userProfile?.email,
      gstNumber: userProfile?.gstNumber,
      address: userProfile?.address,
      city: userProfile?.city,
      state: userProfile?.state,
      pincode: userProfile?.pincode
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-soft">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-smooth rounded-xl"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">Account Details</h3>
            <p className="text-sm text-muted-foreground">Business information and contact details</p>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={20} 
          className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="flex items-center justify-between mb-6 pt-6">
            <h4 className="text-md font-medium text-foreground">Business Information</h4>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                onClick={() => setIsEditing(true)}
              >
                Edit Details
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Save"
                  iconPosition="left"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Business Name"
                type="text"
                value={formData?.businessName}
                onChange={(e) => handleInputChange('businessName', e?.target?.value)}
                disabled={!isEditing}
                required
              />
              <Input
                label="Owner Name"
                type="text"
                value={formData?.ownerName}
                onChange={(e) => handleInputChange('ownerName', e?.target?.value)}
                disabled={!isEditing}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                disabled={!isEditing}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="space-y-4">
              <Input
                label="GST Number"
                type="text"
                value={formData?.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e?.target?.value)}
                disabled={!isEditing}
                description="15-digit GST identification number"
              />
              <Input
                label="Business Address"
                type="text"
                value={formData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                disabled={!isEditing}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  value={formData?.city}
                  onChange={(e) => handleInputChange('city', e?.target?.value)}
                  disabled={!isEditing}
                  required
                />
                <Input
                  label="Pincode"
                  type="text"
                  value={formData?.pincode}
                  onChange={(e) => handleInputChange('pincode', e?.target?.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
              <Input
                label="State"
                type="text"
                value={formData?.state}
                onChange={(e) => handleInputChange('state', e?.target?.value)}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={20} className="text-primary mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-foreground">Data Security</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Your business information is encrypted and stored securely. We never share your data with third parties without consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetailsSection;