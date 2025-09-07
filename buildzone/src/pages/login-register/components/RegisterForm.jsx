import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RegisterForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    mobile: '',
    email: '',
    gstNumber: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Mock OTP for testing
  const mockOtp = '123456';

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

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData?.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData?.ownerName?.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData?.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/?.test(formData?.mobile)) {
      newErrors.mobile = 'Enter valid 10-digit mobile number';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Enter valid email address';
    }

    if (formData?.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/?.test(formData?.gstNumber)) {
      newErrors.gstNumber = 'Enter valid GST number (optional)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData?.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData?.otp?.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData?.otp !== mockOtp) {
      newErrors.otp = `Invalid OTP. Use: ${mockOtp}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleStep1Submit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep1()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(2);
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep2()) return;

    setIsLoading(true);
    
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setCurrentStep(3);
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep3()) return;

    setIsLoading(true);
    
    try {
      // Simulate registration completion
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user session
      localStorage.setItem('buildzone_user', JSON.stringify({
        id: 'user_002',
        name: formData?.ownerName,
        email: formData?.email,
        mobile: formData?.mobile,
        businessName: formData?.businessName,
        gstNumber: formData?.gstNumber,
        registrationTime: new Date()?.toISOString()
      }));

      navigate('/home-dashboard');
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`OTP resent to ${formData?.mobile}. Use: ${mockOtp}`);
    } catch (error) {
      alert('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form onSubmit={handleStep1Submit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
        <p className="text-muted-foreground">Register your business with Buildzone</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Business Name"
          type="text"
          name="businessName"
          placeholder="Enter your business name"
          value={formData?.businessName}
          onChange={handleInputChange}
          error={errors?.businessName}
          required
        />

        <Input
          label="Owner Name"
          type="text"
          name="ownerName"
          placeholder="Enter owner's full name"
          value={formData?.ownerName}
          onChange={handleInputChange}
          error={errors?.ownerName}
          required
        />

        <Input
          label="Mobile Number"
          type="tel"
          name="mobile"
          placeholder="Enter 10-digit mobile number"
          value={formData?.mobile}
          onChange={handleInputChange}
          error={errors?.mobile}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter business email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />

        <Input
          label="GST Number (Optional)"
          type="text"
          name="gstNumber"
          placeholder="Enter GST number if available"
          value={formData?.gstNumber}
          onChange={handleInputChange}
          error={errors?.gstNumber}
          description="GST registration helps with better credit limits"
        />
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        Continue
      </Button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleStep2Submit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Set Password</h2>
        <p className="text-muted-foreground">Create a secure password for your account</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter password (min 8 characters)"
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

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => setCurrentStep(1)}
        >
          Back
        </Button>
        
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Send OTP
        </Button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleStep3Submit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Verify Mobile</h2>
        <p className="text-muted-foreground">
          Enter the 6-digit OTP sent to {formData?.mobile}
        </p>
      </div>

      {errors?.general && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        </div>
      )}

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-primary">
            For testing, use OTP: <span className="font-mono font-bold">{mockOtp}</span>
          </p>
        </div>
      </div>

      <Input
        label="Enter OTP"
        type="text"
        name="otp"
        placeholder="Enter 6-digit OTP"
        value={formData?.otp}
        onChange={handleInputChange}
        error={errors?.otp}
        maxLength={6}
        required
      />

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn't receive OTP?
        </p>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => setCurrentStep(2)}
        >
          Back
        </Button>
        
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Complete Registration
        </Button>
      </div>
    </form>
  );

  return (
    <div>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3]?.map((step) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep >= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step ? (
                  <Icon name="Check" size={16} />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div className={`w-8 h-0.5 transition-colors ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {/* Switch to Login */}
      {currentStep === 1 && (
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;