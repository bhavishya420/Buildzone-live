import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FilterChip from './components/FilterChip';

import FilterPanel from './components/FilterPanel';
import SortDropdown from './components/SortDropdown';
import QuickViewModal from './components/QuickViewModal';
import ProductGrid from './components/ProductGrid';

const CategoryDetailWithProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Get category from navigation state or default
  const categoryData = location?.state?.category || {
    id: 'pipes',
    name: 'Pipes & Fittings',
    icon: 'Pipe',
    description: 'High-quality pipes and fittings for all your plumbing needs'
  };

  const [filters, setFilters] = useState({
    brands: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0
  });

  // Mock products data
  const allProducts = [
    {
      id: 1,
      name: "CPVC Pipe 20mm x 3m",
      brand: "Astral",
      price: 245,
      originalPrice: 280,
      discount: 12,
      rating: 4.5,
      reviewCount: 128,
      image: "https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg",
      sizes: ["15mm", "20mm", "25mm"],
      features: ["ISI Marked", "Lead Free", "Corrosion Resistant"],
      isNew: false,
      category: "pipes"
    },
    {
      id: 2,
      name: "PVC Elbow 90° 25mm",
      brand: "Supreme",
      price: 35,
      originalPrice: null,
      discount: null,
      rating: 4.2,
      reviewCount: 89,
      image: "https://images.pexels.com/photos/5974062/pexels-photo-5974062.jpeg",
      sizes: ["20mm", "25mm", "32mm"],
      features: ["High Strength", "Easy Installation", "Leak Proof"],
      isNew: true,
      category: "pipes"
    },
    {
      id: 3,
      name: "Copper Pipe 15mm x 6m",
      brand: "Hindustan Copper",
      price: 1250,
      originalPrice: 1400,
      discount: 11,
      rating: 4.7,
      reviewCount: 67,
      image: "https://images.pexels.com/photos/5974064/pexels-photo-5974064.jpeg",
      sizes: ["12mm", "15mm", "18mm"],
      features: ["Pure Copper", "Anti-bacterial", "Long Lasting"],
      isNew: false,
      category: "pipes"
    },
    {
      id: 4,
      name: "HDPE Pipe 32mm x 100m",
      brand: "Jain Irrigation",
      price: 3200,
      originalPrice: 3600,
      discount: 11,
      rating: 4.3,
      reviewCount: 45,
      image: "https://images.pexels.com/photos/8961344/pexels-photo-8961344.jpeg",
      sizes: ["25mm", "32mm", "40mm"],
      features: ["UV Stabilized", "Flexible", "Chemical Resistant"],
      isNew: false,
      category: "pipes"
    },
    {
      id: 5,
      name: "PVC Tee Joint 20mm",
      brand: "Finolex",
      price: 28,
      originalPrice: null,
      discount: null,
      rating: 4.1,
      reviewCount: 156,
      image: "https://images.pexels.com/photos/5974063/pexels-photo-5974063.jpeg",
      sizes: ["15mm", "20mm", "25mm"],
      features: ["Precision Molded", "Smooth Finish", "Easy Fitting"],
      isNew: false,
      category: "pipes"
    },
    {
      id: 6,
      name: "Flexible Hose 1/2 inch x 1m",
      brand: "Marc",
      price: 185,
      originalPrice: 220,
      discount: 16,
      rating: 4.4,
      reviewCount: 92,
      image: "https://images.pexels.com/photos/8961345/pexels-photo-8961345.jpeg",
      sizes: ["1/2 inch", "3/4 inch", "1 inch"],
      features: ["Stainless Steel", "Flexible", "High Pressure"],
      isNew: true,
      category: "pipes"
    },
    {
      id: 7,
      name: "PVC Reducer 25mm to 20mm",
      brand: "Prince Pipes",
      price: 22,
      originalPrice: null,
      discount: null,
      rating: 4.0,
      reviewCount: 73,
      image: "https://images.pexels.com/photos/5974065/pexels-photo-5974065.jpeg",
      sizes: ["25-20mm", "32-25mm", "40-32mm"],
      features: ["Perfect Fit", "Durable", "Easy Installation"],
      isNew: false,
      category: "pipes"
    },
    {
      id: 8,
      name: "Ball Valve 20mm Brass",
      brand: "Kitz",
      price: 145,
      originalPrice: 165,
      discount: 12,
      rating: 4.6,
      reviewCount: 134,
      image: "https://images.pexels.com/photos/8961346/pexels-photo-8961346.jpeg",
      sizes: ["15mm", "20mm", "25mm"],
      features: ["Brass Body", "Full Port", "Lever Handle"],
      isNew: false,
      category: "pipes"
    }
  ];

  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('buildzone_language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply brand filter
    if (filters?.brands?.length > 0) {
      filtered = filtered?.filter(product => 
        filters?.brands?.includes(product?.brand)
      );
    }

    // Apply size filter
    if (filters?.sizes?.length > 0) {
      filtered = filtered?.filter(product => 
        product?.sizes && product?.sizes?.some(size => filters?.sizes?.includes(size))
      );
    }

    // Apply price filter
    filtered = filtered?.filter(product => 
      product?.price >= filters?.minPrice && product?.price <= filters?.maxPrice
    );

    // Apply rating filter
    if (filters?.minRating > 0) {
      filtered = filtered?.filter(product => 
        product?.rating >= filters?.minRating
      );
    }

    // Apply sorting
    switch (currentSort) {
      case 'price-low-high':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high-low':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.isNew - a?.isNew);
        break;
      case 'popularity':
        filtered?.sort((a, b) => b?.reviewCount - a?.reviewCount);
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [filters, currentSort]);

  const handleAddToCart = async (product) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCartItems(prev => [...prev, { ...product, addedAt: Date.now() }]);
        resolve();
      }, 500);
    });
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterType, value) => {
    if (filterType === 'brands') {
      setFilters(prev => ({
        ...prev,
        brands: prev?.brands?.filter(brand => brand !== value)
      }));
    } else if (filterType === 'sizes') {
      setFilters(prev => ({
        ...prev,
        sizes: prev?.sizes?.filter(size => size !== value)
      }));
    } else if (filterType === 'rating') {
      setFilters(prev => ({ ...prev, minRating: 0 }));
    }
  };

  const getActiveFilters = () => {
    const active = [];
    
    filters?.brands?.forEach(brand => {
      active?.push({ type: 'brands', value: brand, label: brand });
    });
    
    filters?.sizes?.forEach(size => {
      active?.push({ type: 'sizes', value: size, label: `Size: ${size}` });
    });
    
    if (filters?.minRating > 0) {
      active?.push({ 
        type: 'rating', 
        value: filters?.minRating, 
        label: `${filters?.minRating}★ & above` 
      });
    }
    
    return active;
  };

  const activeFilters = getActiveFilters();

  const content = {
    en: {
      backToCategories: "Back to Categories",
      filter: "Filter",
      results: "results",
      clearAll: "Clear All Filters",
      noProducts: "No products found",
      tryAdjusting: "Try adjusting your filters or search terms"
    },
    hi: {
      backToCategories: "श्रेणियों पर वापस जाएं",
      filter: "फ़िल्टर",
      results: "परिणाम",
      clearAll: "सभी फ़िल्टर साफ़ करें",
      noProducts: "कोई उत्पाद नहीं मिला",
      tryAdjusting: "अपने फ़िल्टर या खोज शब्दों को समायोजित करने का प्रयास करें"
    }
  };

  const t = content?.[currentLanguage];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        {/* Breadcrumb & Category Header */}
        <div className="bg-surface border-b border-border">
          <div className="px-4 py-4">
            <button
              onClick={() => navigate('/categories-grid')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <Icon name="ChevronLeft" size={16} />
              <span className="text-sm">{t?.backToCategories}</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={categoryData?.icon} size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{categoryData?.name}</h1>
                <p className="text-sm text-muted-foreground">{categoryData?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 p-4">
            <FilterPanel
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={handleFilterChange}
              isMobile={false}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden"
                  iconName="Filter"
                  iconPosition="left"
                >
                  {t?.filter}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredProducts?.length} {t?.results}
                </span>
              </div>
              
              <SortDropdown
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                className="w-48"
              />
            </div>

            {/* Active Filters */}
            {activeFilters?.length > 0 && (
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-border">
                <div className="flex flex-wrap gap-2">
                  {activeFilters?.map((filter, index) => (
                    <FilterChip
                      key={`${filter?.type}-${filter?.value}-${index}`}
                      label={filter?.label}
                      onRemove={() => handleRemoveFilter(filter?.type, filter?.value)}
                    />
                  ))}
                </div>
                {activeFilters?.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      brands: [],
                      sizes: [],
                      minPrice: 0,
                      maxPrice: 100000,
                      minRating: 0
                    })}
                    className="text-xs"
                  >
                    {t?.clearAll}
                  </Button>
                )}
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              isLoading={isLoading}
            />

            {/* Load More Button */}
            {filteredProducts?.length > 0 && filteredProducts?.length % 8 === 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                  loading={isLoading}
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
        isMobile={true}
      />
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <BottomNavigation />
    </div>
  );
};

export default CategoryDetailWithProducts;