import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  const defaultItems = [
    { label: 'Home', path: '/home-dashboard' },
    { label: 'Categories', path: '/categories-grid' },
    { label: 'Taps & Faucets', path: '/category-detail-with-products' },
    { label: 'Premium Basin Mixer Tap', path: null }
  ];

  const breadcrumbItems = items?.length ? items : defaultItems;

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm overflow-x-auto pb-2">
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground flex-shrink-0" />
          )}
          <button
            onClick={() => handleNavigation(item?.path)}
            disabled={!item?.path}
            className={`whitespace-nowrap transition-smooth ${
              item?.path
                ? 'text-primary hover:text-primary/80 cursor-pointer' :'text-foreground font-medium cursor-default'
            }`}
          >
            {item?.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;