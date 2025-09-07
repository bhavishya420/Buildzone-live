import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/ui/AuthContainer';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TrustSignals from './components/TrustSignals';
import Button from '../../components/ui/Button';

const LoginRegisterPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('buildzone_user');
    if (user) {
      navigate('/home-dashboard');
    }
  }, [navigate]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <AuthContainer>
      <div className="space-y-8">
        {/* Tab Navigation */}
        <div className="flex bg-surface rounded-lg p-1">
          <Button
            variant={activeTab === 'login' ? 'default' : 'ghost'}
            size="sm"
            fullWidth
            onClick={() => handleTabSwitch('login')}
            className="rounded-md"
          >
            Sign In
          </Button>
          <Button
            variant={activeTab === 'register' ? 'default' : 'ghost'}
            size="sm"
            fullWidth
            onClick={() => handleTabSwitch('register')}
            className="rounded-md"
          >
            Register
          </Button>
        </div>

        {/* Form Content */}
        <div className="min-h-[400px]">
          {activeTab === 'login' ? (
            <LoginForm onSwitchToRegister={() => handleTabSwitch('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => handleTabSwitch('login')} />
          )}
        </div>

        {/* Trust Signals - Only show on login tab */}
        {activeTab === 'login' && (
          <div className="border-t border-border pt-8">
            <TrustSignals />
          </div>
        )}
      </div>
    </AuthContainer>
  );
};

export default LoginRegisterPage;