import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingVoiceButton from '../../components/ui/FloatingVoiceButton';
import CategoryGrid from './components/CategoryGrid';
import SearchFilter from './components/SearchFilter';
import CategoryStats from './components/CategoryStats';

const CategoriesGrid = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    trending: false,
    discount: false,
    newArrivals: false
  });
  const [language, setLanguage] = useState('english');

  // Mock categories data
  const categoriesData = [
    {
      id: 'taps',
      name: 'Taps & Faucets',
      nameHindi: 'नल और फॉसेट',
      image: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400',
      productCount: 2847,
      trending: true,
      discount: 15,
      newArrivals: true
    },
    {
      id: 'pipes',
      name: 'Pipes & Fittings',
      nameHindi: 'पाइप और फिटिंग',
      image: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=400',
      productCount: 4521,
      trending: true,
      discount: 0,
      newArrivals: false
    },
    {
      id: 'tanks',
      name: 'Water Tanks',
      nameHindi: 'पानी की टंकी',
      image: 'https://images.pixabay.com/photo/2020/05/18/16/17/water-tank-5187636_960_720.jpg',
      productCount: 1234,
      trending: false,
      discount: 20,
      newArrivals: true
    },
    {
      id: 'valves',
      name: 'Valves & Controls',
      nameHindi: 'वाल्व और नियंत्रण',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80',
      productCount: 987,
      trending: false,
      discount: 0,
      newArrivals: false
    },
    {
      id: 'tiles',
      name: 'Tiles & Flooring',
      nameHindi: 'टाइल्स और फ्लोरिंग',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      productCount: 6789,
      trending: true,
      discount: 25,
      newArrivals: true
    },
    {
      id: 'adhesives',
      name: 'Adhesives & Sealants',
      nameHindi: 'चिपकने वाले और सीलेंट',
      image: 'https://images.pixabay.com/photo/2017/09/07/08/54/money-2724241_960_720.jpg',
      productCount: 1567,
      trending: false,
      discount: 10,
      newArrivals: false
    },
    {
      id: 'sanitaryware',
      name: 'Sanitaryware',
      nameHindi: 'सैनिटरीवेयर',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      productCount: 3456,
      trending: true,
      discount: 0,
      newArrivals: true
    },
    {
      id: 'electrical',
      name: 'Electrical Supplies',
      nameHindi: 'इलेक्ट्रिकल सप्लाई',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
      productCount: 2890,
      trending: false,
      discount: 12,
      newArrivals: false
    }
  ];

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('buildzone_language') || 'english';
    setLanguage(savedLanguage);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter categories based on search and filters
  const filteredCategories = useMemo(() => {
    let filtered = categoriesData;

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(category => {
        const searchTerm = searchQuery?.toLowerCase();
        return (category?.name?.toLowerCase()?.includes(searchTerm) || category?.nameHindi?.includes(searchTerm));
      });
    }

    // Apply other filters
    if (filters?.trending) {
      filtered = filtered?.filter(category => category?.trending);
    }

    if (filters?.discount) {
      filtered = filtered?.filter(category => category?.discount > 0);
    }

    if (filters?.newArrivals) {
      filtered = filtered?.filter(category => category?.newArrivals);
    }

    return filtered;
  }, [searchQuery, filters]);

  const totalProducts = categoriesData?.reduce((sum, category) => sum + category?.productCount, 0);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Categories - Buildzone | B2B Building Materials</title>
        <meta name="description" content="Browse building materials categories including taps, pipes, tanks, valves, tiles, and adhesives for B2B procurement." />
      </Helmet>
      <Header />
      <main className="pb-20 pt-4">
        <div className="px-4 space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'hindi' ? 'उत्पाद श्रेणियां' : 'Product Categories'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'hindi' ?'अपनी आवश्यकताओं के लिए सही श्रेणी खोजें' :'Find the right category for your needs'
              }
            </p>
          </div>

          {/* Category Stats */}
          <CategoryStats
            totalCategories={categoriesData?.length}
            totalProducts={totalProducts}
            language={language}
          />

          {/* Search and Filters */}
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            language={language}
          />

          {/* Results Summary */}
          {(searchQuery || Object.values(filters)?.some(Boolean)) && (
            <div className="bg-surface border border-border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                {language === 'hindi' 
                  ? `${filteredCategories?.length} श्रेणियां मिलीं`
                  : `${filteredCategories?.length} categories found`
                }
                {searchQuery && (
                  <span className="font-medium text-foreground">
                    {language === 'hindi' ? ` "${searchQuery}" के लिए` : ` for "${searchQuery}"`}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Categories Grid */}
          <CategoryGrid
            categories={filteredCategories}
            loading={loading}
            language={language}
          />
        </div>
      </main>
      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
};

export default CategoriesGrid;