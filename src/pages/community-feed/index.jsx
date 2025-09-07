import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingVoiceButton from '../../components/ui/FloatingVoiceButton';
import PostCard from './components/PostCard';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import TrendingSidebar from './components/TrendingSidebar';
import PostDetailModal from './components/PostDetailModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CommunityFeed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Mock data for community posts
  const mockPosts = [
    {
      id: 1,
      type: 'market-rates',
      typeLabel: 'Market Rates',
      title: 'Latest PVC Pipe Rates in Mumbai Market',
      content: `Current market rates for PVC pipes in Mumbai wholesale market. Prices have increased by 3-5% due to raw material cost surge.\n\nBest deals available at Lamington Road and Crawford Market. Bulk orders above 1000 pieces get additional 2% discount.`,
      fullContent: `Current market rates for PVC pipes in Mumbai wholesale market. Prices have increased by 3-5% due to raw material cost surge.\n\nBest deals available at Lamington Road and Crawford Market. Bulk orders above 1000 pieces get additional 2% discount.\n\nKey factors affecting prices:\n• Raw material cost increase\n• Transportation charges\n• Seasonal demand fluctuation\n• GST impact on wholesale rates\n\nRecommended suppliers:\n1. Ashirwad Pipes - Competitive rates\n2. Supreme Industries - Quality assured\n3. Finolex - Premium range available`,
      author: {
        name: 'Rajesh Kumar',
        role: 'Wholesale Dealer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        verified: true
      },
      timestamp: new Date(Date.now() - 1800000),
      views: 1247,
      helpfulCount: 89,
      isBookmarked: false,
      isHelpfulByUser: false,
      location: 'Mumbai',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
      marketData: [
        { product: '4" PVC Pipe', price: '245', change: 3.2, unit: 'per meter' },
        { product: '6" PVC Pipe', price: '385', change: 2.8, unit: 'per meter' },
        { product: '2" PVC Pipe', price: '125', change: 4.1, unit: 'per meter' },
        { product: '1" PVC Pipe', price: '85', change: 2.5, unit: 'per meter' }
      ],
      tags: ['pvc-pipes', 'mumbai', 'wholesale', 'rates']
    },
    {
      id: 2,
      type: 'tips',
      typeLabel: 'Tips & Tricks',
      title: 'How to Negotiate Better Rates with Tile Suppliers',
      content: `Proven strategies to get better wholesale rates from tile manufacturers. These tips have helped me save 15-20% on bulk orders.\n\nKey negotiation points: Volume commitment, payment terms, seasonal timing, and relationship building.`,
      fullContent: `Proven strategies to get better wholesale rates from tile manufacturers. These tips have helped me save 15-20% on bulk orders.\n\nKey negotiation points:\n\n1. Volume Commitment\n• Commit to minimum quarterly volumes\n• Show past purchase history\n• Negotiate annual contracts\n\n2. Payment Terms\n• Offer advance payments for better rates\n• Negotiate extended credit periods\n• Use RTGS/NEFT for instant settlements\n\n3. Seasonal Timing\n• Buy during off-season months\n• Stock up before festival seasons\n• Monitor market trends\n\n4. Relationship Building\n• Maintain long-term partnerships\n• Refer other dealers\n• Provide market feedback\n\nAdditional Tips:\n• Always compare 3-4 suppliers\n• Check quality certifications\n• Negotiate transportation costs\n• Ask for marketing support`,
      author: {
        name: 'Priya Sharma',
        role: 'Retail Store Owner',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        verified: true
      },
      timestamp: new Date(Date.now() - 3600000),
      views: 892,
      helpfulCount: 156,
      isBookmarked: true,
      isHelpfulByUser: true,
      location: 'Delhi',
      image: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg',
      tags: ['negotiation', 'tiles', 'wholesale', 'tips']
    },
    {
      id: 3,
      type: 'product-spotlight',
      typeLabel: 'Product Spotlight',
      title: 'New Waterproof Adhesive Range by Pidilite',
      content: `Pidilite has launched a new range of waterproof tile adhesives. Initial feedback from contractors is very positive.\n\nKey features: 24-hour water resistance, suitable for wet areas, competitive pricing at ₹28/kg.`,
      fullContent: `Pidilite has launched a new range of waterproof tile adhesives. Initial feedback from contractors is very positive.\n\nKey Features:\n• 24-hour water resistance\n• Suitable for wet areas like bathrooms\n• Competitive pricing at ₹28/kg\n• Easy application with standard tools\n• Available in 20kg and 40kg bags\n\nTechnical Specifications:\n• Coverage: 4-5 sq.ft per kg\n• Setting time: 20-30 minutes\n• Full cure: 24 hours\n• Temperature range: 5°C to 45°C\n\nMarket Response:\n• High demand from contractors\n• Better than imported alternatives\n• Good profit margins for retailers\n• Strong brand support from Pidilite\n\nAvailability:\n• Pan-India distribution\n• Dealer margins: 12-15%\n• Bulk order discounts available\n• Marketing support provided`,
      author: {
        name: 'Amit Patel',
        role: 'Product Specialist',
        avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
        verified: true
      },
      timestamp: new Date(Date.now() - 7200000),
      views: 654,
      helpfulCount: 78,
      isBookmarked: false,
      isHelpfulByUser: false,
      location: 'Ahmedabad',
      image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg',
      tags: ['adhesive', 'pidilite', 'waterproof', 'new-product']
    },
    {
      id: 4,
      type: 'industry-news',
      typeLabel: 'Industry News',
      title: 'GST Rate Changes for Building Materials - What You Need to Know',
      content: `Important GST updates affecting building materials trade. New rates effective from next month.\n\nKey changes: Cement 28% to 18%, Steel bars remain at 18%, Tiles 28% to 18% for certain categories.`,
      fullContent: `Important GST updates affecting building materials trade. New rates effective from next month.\n\nKey Changes:\n\n1. Cement\n• Previous: 28%\n• New: 18%\n• Impact: Significant cost reduction\n\n2. Steel Bars\n• Rate: Remains at 18%\n• No change in current structure\n\n3. Tiles\n• Ceramic tiles: 28% to 18%\n• Vitrified tiles: Remains 28%\n• Mosaic tiles: 18% (no change)\n\n4. Paints\n• Water-based: 18% (no change)\n• Oil-based: 28% (no change)\n\n5. Sanitaryware\n• Basic items: 18%\n• Premium items: 28%\n\nAction Items for Dealers:\n• Update billing software\n• Inform customers about changes\n• Adjust pricing strategies\n• Review supplier agreements\n• Update inventory valuation\n\nEffective Date: 1st of next month\nCompliance deadline: 15 days from effective date`,
      author: {
        name: 'CA Suresh Gupta',
        role: 'Tax Consultant',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        verified: true
      },
      timestamp: new Date(Date.now() - 10800000),
      views: 2156,
      helpfulCount: 234,
      isBookmarked: true,
      isHelpfulByUser: false,
      location: 'Pan India',
      tags: ['gst', 'tax', 'government', 'policy']
    },
    {
      id: 5,
      type: 'market-rates',
      typeLabel: 'Market Rates',
      title: 'Steel Bar Prices - Weekly Update',
      content: `Weekly steel bar price update from major markets across India. Prices showing upward trend due to increased demand.\n\nTMT bars 8mm to 32mm rates updated. Regional variations noted.`,
      fullContent: `Weekly steel bar price update from major markets across India. Prices showing upward trend due to increased demand.\n\nMarket Analysis:\n• Demand increased by 12% this week\n• Raw material costs rising\n• Monsoon season affecting transportation\n• Government infrastructure projects driving demand\n\nRegional Variations:\n• North India: Higher due to transportation\n• South India: Competitive rates\n• West India: Stable pricing\n• East India: Slight increase\n\nBrand Comparison:\n• TATA Steel: Premium pricing\n• JSW: Competitive rates\n• SAIL: Government rates\n• Jindal: Market competitive\n\nForecast:\n• Prices may increase 2-3% next week\n• Monsoon impact on supply chain\n• Festival season demand expected`,
      author: {
        name: 'Vikram Singh',
        role: 'Steel Trader',
        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
        verified: true
      },
      timestamp: new Date(Date.now() - 14400000),
      views: 1789,
      helpfulCount: 145,
      isBookmarked: false,
      isHelpfulByUser: true,
      location: 'Delhi',
      image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
      marketData: [
        { product: '8mm TMT', price: '52,500', change: 2.1, unit: 'per ton' },
        { product: '12mm TMT', price: '51,800', change: 1.8, unit: 'per ton' },
        { product: '16mm TMT', price: '51,200', change: 2.3, unit: 'per ton' },
        { product: '20mm TMT', price: '50,900', change: 1.9, unit: 'per ton' }
      ],
      tags: ['steel', 'tmt-bars', 'weekly-rates', 'construction']
    },
    {
      id: 6,
      type: 'tips',
      typeLabel: 'Tips & Tricks',
      title: 'Inventory Management for Small Retailers',
      content: `Effective inventory management strategies for small building materials retailers. Reduce wastage and improve cash flow.\n\nKey areas: Stock rotation, seasonal planning, supplier relationships, and digital tracking.`,
      fullContent: `Effective inventory management strategies for small building materials retailers. Reduce wastage and improve cash flow.\n\nStock Rotation Strategies:\n• FIFO method for perishable items\n• Regular stock audits\n• Identify slow-moving items\n• Seasonal clearance sales\n\nSeasonal Planning:\n• Monsoon: Waterproofing materials\n• Summer: Cooling solutions\n• Festival: Decorative items\n• Winter: Heating solutions\n\nSupplier Relationships:\n• Negotiate return policies\n• Flexible payment terms\n• Consignment arrangements\n• Joint promotional activities\n\nDigital Tracking:\n• Use inventory management software\n• Barcode scanning systems\n• Real-time stock updates\n• Automated reorder points\n\nCash Flow Optimization:\n• Just-in-time ordering\n• Bulk purchase discounts\n• Credit term negotiations\n• Fast-moving item focus\n\nPractical Tips:\n• Maintain 15-day safety stock\n• Review inventory weekly\n• Track supplier performance\n• Monitor market trends`,
      author: {
        name: 'Meera Joshi',
        role: 'Business Consultant',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        verified: true
      },
      timestamp: new Date(Date.now() - 18000000),
      views: 567,
      helpfulCount: 89,
      isBookmarked: false,
      isHelpfulByUser: false,
      location: 'Pune',
      tags: ['inventory', 'management', 'retail', 'cash-flow']
    }
  ];

  // Mock trending topics
  const trendingTopics = [
    { id: 1, tag: 'gst-updates', posts: 45 },
    { id: 2, tag: 'monsoon-materials', posts: 32 },
    { id: 3, tag: 'price-trends', posts: 28 },
    { id: 4, tag: 'new-products', posts: 24 },
    { id: 5, tag: 'supplier-tips', posts: 19 }
  ];

  // Mock popular posts
  const popularPosts = mockPosts?.slice(0, 4)?.map(post => ({
    ...post,
    helpfulCount: post?.helpfulCount + Math.floor(Math.random() * 50)
  }));

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, activeFilter, sortBy, searchQuery]);

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(post =>
        post?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        post?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        post?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered?.filter(post => post?.type === activeFilter);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'helpful':
          return b?.helpfulCount - a?.helpfulCount;
        case 'views':
          return b?.views - a?.views;
        case 'recent':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    setFilteredPosts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleBookmark = (postId, isBookmarked) => {
    setPosts(prevPosts =>
      prevPosts?.map(post =>
        post?.id === postId ? { ...post, isBookmarked } : post
      )
    );
  };

  const handleHelpful = (postId, isHelpful) => {
    setPosts(prevPosts =>
      prevPosts?.map(post =>
        post?.id === postId
          ? {
              ...post,
              isHelpfulByUser: isHelpful,
              helpfulCount: isHelpful ? post?.helpfulCount + 1 : post?.helpfulCount - 1
            }
          : post
      )
    );
  };

  const handleTopicClick = (topic) => {
    setSearchQuery(topic?.tag);
  };

  const loadMorePosts = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // Simulate loading more posts
    setTimeout(() => {
      setLoadingMore(false);
      setHasMore(false); // No more posts to load in this demo
    }, 1000);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e?.target;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !loadingMore) {
      loadMorePosts();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Users" size={24} className="text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Community Feed</h1>
            </div>
            <p className="text-muted-foreground">
              Stay updated with market insights, tips, and industry trends from fellow retailers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <SearchBar onSearch={handleSearch} />
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />

              {/* Posts Feed */}
              <div 
                className="space-y-6"
                onScroll={handleScroll}
                style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
              >
                {loading ? (
                  <LoadingSkeleton count={5} />
                ) : filteredPosts?.length > 0 ? (
                  <>
                    {filteredPosts?.map((post) => (
                      <PostCard
                        key={post?.id}
                        post={post}
                        onPostClick={handlePostClick}
                        onBookmark={handleBookmark}
                        onHelpful={handleHelpful}
                      />
                    ))}
                    
                    {loadingMore && (
                      <div className="flex justify-center py-4">
                        <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                      </div>
                    )}
                    
                    {!hasMore && filteredPosts?.length > 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You've reached the end of the feed</p>
                        <Button
                          variant="outline"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="mt-2"
                        >
                          <Icon name="ArrowUp" size={16} className="mr-2" />
                          Back to Top
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? `No posts match "${searchQuery}". Try different keywords.`
                        : 'No posts available for the selected filter.'}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block">
              <TrendingSidebar
                trendingTopics={trendingTopics}
                popularPosts={popularPosts}
                onTopicClick={handleTopicClick}
                onPostClick={handlePostClick}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookmark={handleBookmark}
        onHelpful={handleHelpful}
      />
      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
};

export default CommunityFeed;