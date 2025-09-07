import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreditApplicationTab = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    businessType: '',
    yearEstablished: '',
    monthlyTurnover: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    gstCertificate: null,
    bankStatements: null,
    panCard: null,
    aadharCard: null,
    businessProof: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    { value: 'proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'private_limited', label: 'Private Limited' },
    { value: 'public_limited', label: 'Public Limited' },
    { value: 'llp', label: 'Limited Liability Partnership' }
  ];

  const states = [
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamil_nadu', label: 'Tamil Nadu' },
    { value: 'uttar_pradesh', label: 'Uttar Pradesh' }
  ];

  const requiredDocuments = [
    {
      key: 'gstCertificate',
      title: 'GST Certificate',
      description: 'Valid GST registration certificate',
      required: true,
      formats: 'PDF, JPG, PNG (Max 5MB)'
    },
    {
      key: 'bankStatements',
      title: 'Bank Statements',
      description: 'Last 6 months bank statements',
      required: true,
      formats: 'PDF (Max 10MB)'
    },
    {
      key: 'panCard',
      title: 'PAN Card',
      description: 'Business PAN card copy',
      required: true,
      formats: 'PDF, JPG, PNG (Max 2MB)'
    },
    {
      key: 'aadharCard',
      title: 'Aadhar Card',
      description: 'Owner/Director Aadhar card',
      required: true,
      formats: 'PDF, JPG, PNG (Max 2MB)'
    },
    {
      key: 'businessProof',
      title: 'Business Proof',
      description: 'Shop license or business registration',
      required: false,
      formats: 'PDF, JPG, PNG (Max 5MB)'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (docKey, file) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: {
        file,
        name: file?.name,
        size: file?.size,
        uploadedAt: new Date()
      }
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
    }, 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business Information */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Icon name="Building2" size={20} className="text-primary mr-2" />
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Business Name"
              type="text"
              placeholder="Enter business name"
              value={formData?.businessName}
              onChange={(e) => handleInputChange('businessName', e?.target?.value)}
              required
            />
            
            <Input
              label="GST Number"
              type="text"
              placeholder="Enter GST number"
              value={formData?.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e?.target?.value)}
              required
            />
            
            <Select
              label="Business Type"
              options={businessTypes}
              value={formData?.businessType}
              onChange={(value) => handleInputChange('businessType', value)}
              placeholder="Select business type"
              required
            />
            
            <Input
              label="Year Established"
              type="number"
              placeholder="Enter year"
              value={formData?.yearEstablished}
              onChange={(e) => handleInputChange('yearEstablished', e?.target?.value)}
              required
            />
            
            <Input
              label="Monthly Turnover (₹)"
              type="number"
              placeholder="Enter monthly turnover"
              value={formData?.monthlyTurnover}
              onChange={(e) => handleInputChange('monthlyTurnover', e?.target?.value)}
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Icon name="User" size={20} className="text-primary mr-2" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Contact Person"
              type="text"
              placeholder="Enter contact person name"
              value={formData?.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              required
            />
            
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              required
            />
            
            <Input
              label="Business Address"
              type="text"
              placeholder="Enter complete address"
              value={formData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              required
            />
            
            <Input
              label="City"
              type="text"
              placeholder="Enter city"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              required
            />
            
            <Select
              label="State"
              options={states}
              value={formData?.state}
              onChange={(value) => handleInputChange('state', value)}
              placeholder="Select state"
              required
            />
            
            <Input
              label="PIN Code"
              type="text"
              placeholder="Enter PIN code"
              value={formData?.pincode}
              onChange={(e) => handleInputChange('pincode', e?.target?.value)}
              required
            />
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Icon name="Upload" size={20} className="text-primary mr-2" />
            Document Upload
          </h3>
          
          <div className="space-y-6">
            {requiredDocuments?.map((doc) => (
              <div key={doc?.key} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{doc?.title}</h4>
                      {doc?.required && (
                        <span className="text-xs text-error bg-error/10 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{doc?.description}</p>
                    <p className="text-xs text-muted-foreground">{doc?.formats}</p>
                  </div>
                </div>
                
                {uploadedDocs?.[doc?.key] ? (
                  <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {uploadedDocs?.[doc?.key]?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(uploadedDocs?.[doc?.key]?.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedDocs(prev => ({ ...prev, [doc?.key]: null }))}
                        iconName="X"
                        iconSize={16}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Icon name="Upload" size={24} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      id={`file-${doc?.key}`}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e?.target?.files?.[0];
                        if (file) handleFileUpload(doc?.key, file);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-${doc?.key}`)?.click()}
                      iconName="Upload"
                      iconPosition="left"
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isSubmitting}
            iconName="Send"
            iconPosition="right"
            className="px-12"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreditApplicationTab;