import React, { useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../contexts/AuthContext';
import { supabaseService } from '../../../services/supabaseService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BrandHeroSlotForm = ({ onBannerPublished, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUrl: '',
    bannerFile: null,
    discountPercentage: '',
    validTill: ''
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
      alert('Please log in to publish banners');
      return;
    }

    if (!formData?.title || !formData?.targetUrl || !formData?.bannerFile) {
      alert('Please fill in all required fields and upload a banner image');
      return;
    }

    setIsLoading(true);
    try {
      let bannerImageUrl = '';

      // Upload banner image to Supabase storage
      if (formData?.bannerFile) {
        const fileName = `hero-banners/${user?.id}/${Date.now()}`;
        bannerImageUrl = await supabaseService?.uploadFile(
          formData?.bannerFile, 
          'offer-banners', 
          fileName
        );
      }

      const offerData = {
        title: formData?.title,
        description: formData?.description || `${formData?.title} - Visit: ${formData?.targetUrl}`,
        image_url: bannerImageUrl,
        discount_percentage: formData?.discountPercentage ? parseFloat(formData?.discountPercentage) : null,
        valid_till: formData?.validTill || null
      };

      const createdOffer = await supabaseService?.createOffer(offerData);
      
      if (createdOffer) {
        onBannerPublished?.(createdOffer);
        alert(t('bannerPublished'));
        onClose?.();
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          targetUrl: '',
          bannerFile: null,
          discountPercentage: '',
          validTill: ''
        });
      }
    } catch (error) {
      console.error('Error publishing banner:', error);
      alert(`${t('error')}: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {t('uploadBanner')}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Banner Title *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData?.title}
              onChange={handleInputChange}
              required
              placeholder="Enter banner title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData?.description}
              onChange={handleInputChange}
              placeholder="Banner description (optional)"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="targetUrl" className="block text-sm font-medium text-foreground mb-2">
              {t('targetUrl')} *
            </label>
            <Input
              id="targetUrl"
              name="targetUrl"
              type="url"
              value={formData?.targetUrl}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/product"
            />
          </div>

          <div>
            <label htmlFor="bannerFile" className="block text-sm font-medium text-foreground mb-2">
              {t('bannerImage')} *
            </label>
            <input
              id="bannerFile"
              name="bannerFile"
              type="file"
              onChange={handleInputChange}
              accept="image/*"
              required
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload banner image (JPG, PNG, WebP - Max 5MB, Recommended: 1200x400px)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountPercentage" className="block text-sm font-medium text-foreground mb-2">
                Discount Percentage (%)
              </label>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                value={formData?.discountPercentage}
                onChange={handleInputChange}
                placeholder="25"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="validTill" className="block text-sm font-medium text-foreground mb-2">
                Valid Till
              </label>
              <Input
                id="validTill"
                name="validTill"
                type="date"
                value={formData?.validTill}
                onChange={handleInputChange}
                min={new Date()?.toISOString()?.split('T')?.[0]}
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
              variant="default"
            >
              {isLoading ? t('loading') : t('publishBanner')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandHeroSlotForm;