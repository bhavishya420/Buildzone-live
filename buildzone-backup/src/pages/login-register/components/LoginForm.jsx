import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for testing
  const mockCredentials = {
    email: 'retailer@buildzone.com',
    mobile: '9876543210',
    password: 'BuildZone123'
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.emailOrMobile?.trim()) {
      newErrors.emailOrMobile = 'Email or mobile number is required';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check mock credentials
      const isValidCredentials = 
        (formData?.emailOrMobile === mockCredentials?.email || 
         formData?.emailOrMobile === mockCredentials?.mobile) &&
        formData?.password === mockCredentials?.password;

      if (isValidCredentials) {
        // Store user session
        localStorage.setItem('buildzone_user', JSON.stringify({
          id: 'user_001',
          name: 'Rajesh Kumar',
          email: 'retailer@buildzone.com',
          mobile: '9876543210',
          businessName: 'Kumar Building Materials',
          gstNumber: '27ABCDE1234F1Z5',
          loginTime: new Date()?.toISOString()
        }));

        navigate('/home-dashboard');
      } else {
        setErrors({
          general: `Invalid credentials. Use email: ${mockCredentials?.email} or mobile: ${mockCredentials?.mobile} with password: ${mockCredentials?.password}`
        });
      }
    } catch (error) {
      setErrors({
        general: 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your registered email/mobile');
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login integration coming soon`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground">Sign in to your business account</p>
      </div>
      {errors?.general && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Email or Mobile Number"
          type="text"
          name="emailOrMobile"
          placeholder="Enter email or mobile number"
          value={formData?.emailOrMobile}
          onChange={handleInputChange}
          error={errors?.emailOrMobile}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-sm text-muted-foreground">Remember me</span>
        </label>
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Forgot Password?
        </button>
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        Sign In
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('Google')}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Mail" size={18} />
          <span>Google</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('WhatsApp')}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="MessageCircle" size={18} />
          <span>WhatsApp</span>
        </Button>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Register now
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;