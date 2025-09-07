import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Building, AlertCircle, CheckCircle } from 'lucide-react';

const EnhancedAuthentication = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const { signIn, signUp, user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form data  
  const [registerData, setRegisterData] = useState({
    shopName: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopSize: 'small'
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/home-dashboard');
    }
  }, [user, loading, navigate]);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e?.target?.name]: e?.target?.value
    });
    setMessage(''); // Clear messages on input
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e?.target?.name]: e?.target?.value
    });
    setMessage(''); // Clear messages on input
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!loginData?.email || !loginData?.password) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(loginData?.email, loginData?.password);
      
      if (error) {
        setMessage(error?.message || 'Login failed');
        setMessageType('error');
      } else {
        setMessage('Login successful!');
        setMessageType('success');
        setTimeout(() => navigate('/home-dashboard'), 1500);
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    
    // Validation
    if (!registerData?.shopName || !registerData?.email || !registerData?.password || !registerData?.confirmPassword) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    if (registerData?.password !== registerData?.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    if (registerData?.password?.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUp(registerData?.email, registerData?.password, {
        shop_name: registerData?.shopName,
        shop_size: registerData?.shopSize,
        name: registerData?.shopName // For display purposes
      });
      
      if (error) {
        setMessage(error?.message || 'Registration failed');
        setMessageType('error');
      } else {
        setMessage('Registration successful! Please check your email for confirmation.');
        setMessageType('success');
        // Switch to login tab after successful registration
        setTimeout(() => {
          setActiveTab('login');
          setLoginData({ email: registerData?.email, password: '' });
        }, 2000);
      }
    } catch (err) {
      setMessage('An unexpected error occurred during registration');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setMessage(`Demo login failed: ${error?.message}`);
        setMessageType('error');
      } else {
        setMessage('Demo login successful!');
        setMessageType('success');
        setTimeout(() => navigate('/home-dashboard'), 1500);
      }
    } catch (err) {
      setMessage('Demo login failed');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Buildzone</h1>
          <p className="text-gray-600 mt-2">Your B2B Construction Marketplace</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'login' ?'text-blue-600 border-b-2 border-blue-600 bg-blue-50' :'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'register' ?'text-blue-600 border-b-2 border-blue-600 bg-blue-50' :'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2 ${
              messageType === 'success' ?'bg-green-50 border border-green-200 text-green-700' :'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={loginData?.email}
                    onChange={handleLoginChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData?.password}
                    onChange={handleLoginChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => alert('Password reset functionality coming soon!')}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Demo Login Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Login:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('sharma@demo.com', 'demo123')}
                    disabled={isLoading}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Demo: Sharma Hardware (Small Shop)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('gupta@demo.com', 'demo123')}
                    disabled={isLoading}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Demo: Gupta Sanitary Mart (Large Shop)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="shopName"
                    value={registerData?.shopName}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., ABC Hardware Store"
                    required
                  />
                  <Building className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={registerData?.email}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your business email"
                    required
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Size *
                </label>
                <select
                  name="shopSize"
                  value={registerData?.shopSize}
                  onChange={handleRegisterChange}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="small">Small (1-10 employees)</option>
                  <option value="medium">Medium (11-50 employees)</option>
                  <option value="large">Large (50+ employees)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={registerData?.password}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Create a password (min. 6 chars)"
                    required
                    minLength={6}
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={registerData?.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Trust Signals */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Secure SSL
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              B2B Verified
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              GDPR Compliant
            </span>
          </div>
          <p className="text-xs text-gray-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthentication;