import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrderCard = ({ order, onReorder, onDownloadInvoice, onConfirmDraftOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-orange/10 text-orange border-orange/20';
      case 'processing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'shipped':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'Edit';
      case 'processing':
        return 'Clock';
      case 'shipped':
        return 'Truck';
      case 'delivered':
        return 'CheckCircle';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Package';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const handleProductClick = (productId) => {
    navigate('/product-detail', { state: { productId } });
  };

  const isDraftOrder = order?.status?.toLowerCase() === 'draft';

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft overflow-hidden">
      {/* Draft Order Banner */}
      {isDraftOrder && (
        <div className="bg-orange/10 border-b border-orange/20 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Icon name="Edit" size={16} className="text-orange" />
            <span className="text-sm font-medium text-orange">
              Draft Order - Awaiting Confirmation
            </span>
          </div>
        </div>
      )}

      {/* Order Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-muted/5 transition-smooth"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">#{order?.id?.slice(-8)}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(order?.created_at)}</p>
            </div>
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-muted-foreground" 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-foreground font-mono">
              {formatAmount(order?.total_amount)}
            </span>
            <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getStatusColor(order?.status)}`}>
              <Icon name={getStatusIcon(order?.status)} size={14} />
              <span>{order?.status}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {order?.items?.length} item{order?.items?.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Expanded Order Details */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Order Items */}
          <div className="p-4 space-y-3">
            <h4 className="font-medium text-foreground mb-3">Order Items</h4>
            {order?.items?.map((item, index) => (
              <div 
                key={item?.id || index} 
                className="flex items-center space-x-3 p-3 bg-muted/5 rounded-lg cursor-pointer hover:bg-muted/10 transition-smooth"
                onClick={() => handleProductClick(item?.productId)}
              >
                <div className="w-12 h-12 bg-background rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item?.image || 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg'}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-foreground truncate">{item?.name}</h5>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item?.qty || item?.quantity} × {formatAmount(item?.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground font-mono">
                    {formatAmount((item?.qty || item?.quantity) * item?.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Information */}
          {order?.delivery_address && (
            <div className="px-4 pb-4">
              <h4 className="font-medium text-foreground mb-3">Delivery Information</h4>
              <div className="bg-muted/5 rounded-lg p-3 space-y-2">
                <div className="flex items-start space-x-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      {order?.delivery_address}
                    </p>
                  </div>
                </div>
                {order?.contact_number && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={16} className="text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">{order?.contact_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            {isDraftOrder ? (
              <Button
                variant="default"
                size="sm"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={() => onConfirmDraftOrder?.(order)}
                className="flex-1 min-w-0"
              >
                Confirm Order
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                iconName="RotateCcw"
                iconPosition="left"
                onClick={() => onReorder(order)}
                className="flex-1 min-w-0"
              >
                Reorder
              </Button>
            )}
            
            {!isDraftOrder && (
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => onDownloadInvoice(order)}
                className="flex-1 min-w-0"
              >
                Invoice
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;