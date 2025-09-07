import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import FloatingVoiceButton from '../../components/ui/FloatingVoiceButton';
import ProfileHeader from './components/ProfileHeader';
import AccountDetailsSection from './components/AccountDetailsSection';
import PreferencesSection from './components/PreferencesSection';
import SupportSection from './components/SupportSection';
import LegalSection from './components/LegalSection';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProfileAndSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('english');

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    businessName: "Sharma Building Materials",
    businessType: "Retail Store",
    ownerName: "Rajesh Sharma",
    phone: "+91 98765-43210",
    email: "rajesh@sharmabuildmat.com",
    gstNumber: "27ABCDE1234F1Z5",
    address: "Shop No. 15, Building Materials Market",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
    verificationStatus: "pending", // verified, pending, incomplete
    joinedDate: "March 2024",
    totalOrders: 156,
    creditLimit: 500000
  });

  const [preferences, setPreferences] = useState({
    language: 'english',
    notifications: {
      orderUpdates: true,
      offerAlerts: true,
      paymentReminders: true,
      priceDrops: false,
      newProducts: true,
      marketInsights: false
    },
    currency: 'INR'
  });

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('buildzone_language') || 'english';
    setCurrentLanguage(savedLanguage);
    
    // Listen for language changes
    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleProfileUpdate = (updatedData) => {
    setIsLoading(true);
    setTimeout(() => {
      setUserProfile(prev => ({ ...prev, ...updatedData }));
      setIsLoading(false);
      console.log('Profile updated:', updatedData);
    }, 1000);
  };

  const handlePreferencesUpdate = (updatedPreferences) => {
    setPreferences(prev => ({ ...prev, ...updatedPreferences }));
    console.log('Preferences updated:', updatedPreferences);
  };

  const handleLogout = () => {
    localStorage.removeItem('buildzone_auth');
    localStorage.removeItem('buildzone_language');
    navigate('/login-register');
  };

  const getLanguageText = (key) => {
    const texts = {
      english: {
        title: 'Profile & Settings',
        subtitle: 'Manage your account and preferences',
        accountStats: 'Account Statistics',
        totalOrders: 'Total Orders',
        creditLimit: 'Credit Limit',
        memberSince: 'Member Since',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?'
      },
      hindi: {
        title: 'प्रोफाइल और सेटिंग्स',
        subtitle: 'अपना खाता और प्राथमिकताएं प्रबंधित करें',
        accountStats: 'खाता आंकड़े',
        totalOrders: 'कुल ऑर्डर',
        creditLimit: 'क्रेडिट सीमा',
        memberSince: 'सदस्य बने',
        logout: 'लॉगआउट',
        logoutConfirm: 'क्या आप वाकई लॉगआउट करना चाहते हैं?'
      }
    };
    return texts?.[currentLanguage]?.[key] || texts?.english?.[key];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{getLanguageText('title')}</h1>
                <p className="text-muted-foreground mt-2">{getLanguageText('subtitle')}</p>
              </div>
              <Button
                variant="outline"
                iconName="LogOut"
                iconPosition="left"
                onClick={handleLogout}
                className="hidden md:flex"
              >
                {getLanguageText('logout')}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <ProfileHeader 
                userProfile={userProfile} 
                onEdit={() => console.log('Edit profile')}
              />

              {/* Account Details */}
              <AccountDetailsSection 
                userProfile={userProfile}
                onUpdate={handleProfileUpdate}
              />

              {/* Preferences */}
              <PreferencesSection 
                preferences={preferences}
                onUpdate={handlePreferencesUpdate}
              />

              {/* Support */}
              <SupportSection />

              {/* Legal */}
              <LegalSection />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Statistics */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Icon name="BarChart3" size={20} className="text-primary" />
                  <span>{getLanguageText('accountStats')}</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Package" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">{getLanguageText('totalOrders')}</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{userProfile?.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="CreditCard" size={16} className="text-success" />
                      <span className="text-sm font-medium text-foreground">{getLanguageText('creditLimit')}</span>
                    </div>
                    <span className="text-lg font-bold text-success font-mono">₹{userProfile?.creditLimit?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Calendar" size={16} className="text-warning" />
                      <span className="text-sm font-medium text-foreground">{getLanguageText('memberSince')}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{userProfile?.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="CreditCard"
                    iconPosition="left"
                    onClick={() => navigate('/bnpl-credit-management')}
                  >
                    Manage Credit
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Package"
                    iconPosition="left"
                    onClick={() => navigate('/orders-and-tracking')}
                  >
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Tag"
                    iconPosition="left"
                    onClick={() => navigate('/offers-and-schemes')}
                  >
                    Browse Offers
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Bell"
                    iconPosition="left"
                    onClick={() => navigate('/notifications-and-vibecode')}
                  >
                    Notifications & Vibecode
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Brain"
                    iconPosition="left"
                    onClick={() => navigate('/ai-lab-beta')}
                  >
                    AI Lab (Beta)
                  </Button>
                </div>
              </div>

              {/* Mobile Logout */}
              <div className="lg:hidden">
                <Button
                  variant="destructive"
                  fullWidth
                  iconName="LogOut"
                  iconPosition="left"
                  onClick={handleLogout}
                >
                  {getLanguageText('logout')}
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="bg-gradient-to-br from-success/5 to-primary/5 border border-success/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Shield" size={24} className="text-success" />
                  <h3 className="text-lg font-semibold text-foreground">Secure & Trusted</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-muted-foreground">256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-muted-foreground">ISO 27001 Certified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-muted-foreground">RBI Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Check" size={14} className="text-success" />
                    <span className="text-muted-foreground">GDPR Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
      <FloatingVoiceButton />
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-300 flex items-center justify-center">
          <div className="bg-card border border-border rounded-xl p-6 shadow-elevated">
            <div className="flex items-center space-x-3">
              <Icon name="Loader2" size={20} className="text-primary animate-spin" />
              <span className="text-foreground font-medium">Updating profile...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAndSettings;