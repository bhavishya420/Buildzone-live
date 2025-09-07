import React, { useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../contexts/AuthContext';
import { supabaseService } from '../../../services/supabaseService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BNPLApplicationForm = ({ onApplicationSubmitted }) => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.name || '',
    shopName: profile?.shop_name || '',
    panNumber: '',
    gstFile: null,
    requestedLimit: ''
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files?.[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!user?.id) {
      alert('Please log in to apply for credit');
      return;
    }

    if (!formData?.fullName || !formData?.panNumber || !formData?.requestedLimit) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      let gstNumber = null;
      let documentsUploaded = false;

      // If GST file is uploaded, handle it (simplified for demo)
      if (formData?.gstFile) {
        documentsUploaded = true;
        // In a real implementation, you would upload the file to Supabase storage
        // For demo, we'll just generate a mock GST number
        gstNumber = `GST${Date.now()}`;
      }

      const applicationData = {
        user_id: user?.id,
        pan_number: formData?.panNumber,
        gst_number: gstNumber,
        requested_limit: parseFloat(formData?.requestedLimit),
        documents_uploaded: documentsUploaded
      };

      const createdApplication = await supabaseService?.createCreditApplication(applicationData);
      
      if (createdApplication) {
        onApplicationSubmitted?.(createdApplication);
        alert(t('applicationSubmitted'));
        
        // Reset form
        setFormData({
          fullName: profile?.name || '',
          shopName: profile?.shop_name || '',
          panNumber: '',
          gstFile: null,
          requestedLimit: ''
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(`${t('error')}: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {t('bnplApplication')}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
            {t('fullName')} *
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData?.fullName}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="shopName" className="block text-sm font-medium text-foreground mb-2">
            {t('shopName')}
          </label>
          <Input
            id="shopName"
            name="shopName"
            type="text"
            value={formData?.shopName}
            onChange={handleInputChange}
            placeholder="Enter your shop name"
          />
        </div>

        <div>
          <label htmlFor="panNumber" className="block text-sm font-medium text-foreground mb-2">
            {t('panNumber')} *
          </label>
          <Input
            id="panNumber"
            name="panNumber"
            type="text"
            value={formData?.panNumber}
            onChange={handleInputChange}
            required
            placeholder="AAAPZ1234C"
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            title="Please enter a valid PAN number (e.g., AAAPZ1234C)"
          />
        </div>

        <div>
          <label htmlFor="gstFile" className="block text-sm font-medium text-foreground mb-2">
            {t('gstDocument')}
          </label>
          <input
            id="gstFile"
            name="gstFile"
            type="file"
            onChange={handleInputChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Upload GST certificate (PDF, JPG, PNG - Max 5MB)
          </p>
        </div>

        <div>
          <label htmlFor="requestedLimit" className="block text-sm font-medium text-foreground mb-2">
            {t('requestedLimit')} * (₹)
          </label>
          <Input
            id="requestedLimit"
            name="requestedLimit"
            type="number"
            value={formData?.requestedLimit}
            onChange={handleInputChange}
            required
            placeholder="50000"
            min="10000"
            max="5000000"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum: ₹10,000 | Maximum: ₹50,00,000
          </p>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            variant="default"
          >
            {isLoading ? t('loading') : t('submitApplication')}
          </Button>
        </div>
      </form>
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold text-sm mb-2">Application Process:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Submit your application with required documents</li>
          <li>• Our team will review within 2-3 business days</li>
          <li>• You'll receive approval notification via email/SMS</li>
          <li>• Start shopping with your approved credit limit</li>
        </ul>
      </div>
    </div>
  );
};

export default BNPLApplicationForm;