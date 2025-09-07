import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const ProfileHeader = ({ userProfile, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'incomplete': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'incomplete': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Building2" size={32} className="text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center">
              <Icon 
                name={getVerificationIcon(userProfile?.verificationStatus)} 
                size={12} 
                className={getVerificationColor(userProfile?.verificationStatus)?.split(' ')?.[0]}
              />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{userProfile?.businessName}</h2>
            <p className="text-sm text-muted-foreground">{userProfile?.businessType}</p>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getVerificationColor(userProfile?.verificationStatus)}`}>
              <Icon name={getVerificationIcon(userProfile?.verificationStatus)} size={12} />
              <span className="capitalize">{userProfile?.verificationStatus}</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={() => {
            setIsEditing(!isEditing);
            onEdit && onEdit();
          }}
        >
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{userProfile?.ownerName}</p>
              <p className="text-xs text-muted-foreground">Business Owner</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{userProfile?.phone}</p>
              <p className="text-xs text-muted-foreground">Primary Contact</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="Mail" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{userProfile?.email}</p>
              <p className="text-xs text-muted-foreground">Email Address</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground font-mono">{userProfile?.gstNumber}</p>
              <p className="text-xs text-muted-foreground">GST Number</p>
            </div>
          </div>
        </div>
      </div>
      {userProfile?.verificationStatus !== 'verified' && (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-warning">Account Verification Required</h4>
              <p className="text-xs text-warning/80 mt-1">
                Complete your profile verification to unlock full features and higher credit limits.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                iconName="Upload"
                iconPosition="left"
              >
                Upload Documents
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;