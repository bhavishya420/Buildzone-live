import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductTabs = ({ product = {} }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    specifications = {},
    description = "Product description not available.",
    reviews = []
  } = product;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Specifications</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(specifications)?.map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
              <span className="text-sm text-muted-foreground capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.trim()}
              </span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Product Description</h3>
      <div className="prose prose-sm max-w-none">
        <p className="text-foreground leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Customer Reviews</h3>
        <span className="text-sm text-muted-foreground">
          {reviews?.length} review{reviews?.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {reviews?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reviews yet</p>
          <p className="text-sm text-muted-foreground mt-1">Be the first to review this product</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {review?.userName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review?.userName}</p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={12}
                          className={i < review?.rating ? "text-warning fill-current" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{review?.date}</span>
              </div>
              <p className="text-sm text-foreground">{review?.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'description':
        return renderDescription();
      case 'reviews':
        return renderReviews();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-surface rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-smooth ${
              activeTab === tab?.id
                ? 'bg-background text-primary shadow-soft'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;