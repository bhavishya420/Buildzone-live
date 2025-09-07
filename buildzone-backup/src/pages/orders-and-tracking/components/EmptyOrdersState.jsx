import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyOrdersState = ({ filterType = 'all' }) => {
  const navigate = useNavigate();

  const getEmptyStateContent = () => {
    switch (filterType) {
      case 'active':
        return {
          icon: 'Clock',
          title: 'No Active Orders',
          description: 'You don\'t have any orders in progress at the moment.',
          actionText: 'Browse Products',
          actionIcon: 'ShoppingBag'
        };
      case 'completed':
        return {
          icon: 'CheckCircle',
          title: 'No Completed Orders',
          description: 'Your completed orders will appear here once delivered.',
          actionText: 'Start Shopping',
          actionIcon: 'ShoppingBag'
        };
      case 'cancelled':
        return {
          icon: 'XCircle',
          title: 'No Cancelled Orders',
          description: 'You haven\'t cancelled any orders recently.',
          actionText: 'Browse Categories',
          actionIcon: 'Grid3X3'
        };
      default:
        return {
          icon: 'Package',
          title: 'No Orders Yet',
          description: 'Start your first order to see your purchase history here.',
          actionText: 'Explore Categories',
          actionIcon: 'Grid3X3'
        };
    }
  };

  const content = getEmptyStateContent();

  const handleAction = () => {
    if (content?.actionIcon === 'Grid3X3') {
      navigate('/categories-grid');
    } else {
      navigate('/home-dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
        <Icon name={content?.icon} size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {content?.title}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-sm">
        {content?.description}
      </p>
      <Button
        variant="default"
        size="lg"
        iconName={content?.actionIcon}
        iconPosition="left"
        onClick={handleAction}
      >
        {content?.actionText}
      </Button>
      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button
          variant="outline"
          size="sm"
          iconName="Zap"
          iconPosition="left"
          onClick={() => navigate('/offers-and-schemes')}
        >
          View Offers
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Users"
          iconPosition="left"
          onClick={() => navigate('/community-feed')}
        >
          Community Tips
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="CreditCard"
          iconPosition="left"
          onClick={() => navigate('/bnpl-credit-management')}
        >
          BNPL Credit
        </Button>
      </div>
    </div>
  );
};

export default EmptyOrdersState;