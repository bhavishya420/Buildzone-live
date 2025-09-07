import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreditManagementTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Mock credit data
  const creditData = {
    totalLimit: 5000000,
    availableCredit: 3500000,
    usedCredit: 1500000,
    outstandingBalance: 750000,
    nextPaymentDue: '2025-09-15',
    nextPaymentAmount: 125000,
    creditScore: 785,
    lastUpdated: '2025-08-30'
  };

  const paymentHistory = [
    {
      id: 1,
      date: '2025-08-25',
      description: 'Payment Received',
      amount: 250000,
      type: 'credit',
      status: 'completed',
      balance: 750000
    },
    {
      id: 2,
      date: '2025-08-20',
      description: 'Purchase - Order #BZ12345',
      amount: 125000,
      type: 'debit',
      status: 'completed',
      balance: 1000000
    },
    {
      id: 3,
      date: '2025-08-15',
      description: 'Purchase - Order #BZ12344',
      amount: 85000,
      type: 'debit',
      status: 'completed',
      balance: 875000
    },
    {
      id: 4,
      date: '2025-08-10',
      description: 'Payment Received',
      amount: 300000,
      type: 'credit',
      status: 'completed',
      balance: 790000
    },
    {
      id: 5,
      date: '2025-08-05',
      description: 'Purchase - Order #BZ12343',
      amount: 95000,
      type: 'debit',
      status: 'completed',
      balance: 1090000
    }
  ];

  const creditUtilization = (creditData?.usedCredit / creditData?.totalLimit) * 100;

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleMakePayment = () => {
    alert('Redirecting to payment gateway...');
  };

  const handleRequestIncrease = () => {
    alert('Credit limit increase request submitted. We will review and get back to you within 2-3 business days.');
  };

  return (
    <div className="space-y-6">
      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="CreditCard" size={20} className="text-primary" />
            <span className="text-xs text-muted-foreground">Total Limit</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {formatCurrency(creditData?.totalLimit)}
          </div>
          <div className="text-xs text-success flex items-center">
            <Icon name="TrendingUp" size={12} className="mr-1" />
            Active
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Wallet" size={20} className="text-success" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="text-2xl font-bold text-success mb-1">
            {formatCurrency(creditData?.availableCredit)}
          </div>
          <div className="text-xs text-muted-foreground">
            {((creditData?.availableCredit / creditData?.totalLimit) * 100)?.toFixed(1)}% available
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={20} className="text-warning" />
            <span className="text-xs text-muted-foreground">Outstanding</span>
          </div>
          <div className="text-2xl font-bold text-warning mb-1">
            {formatCurrency(creditData?.outstandingBalance)}
          </div>
          <div className="text-xs text-muted-foreground">
            Due: {formatDate(creditData?.nextPaymentDue)}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Star" size={20} className="text-accent" />
            <span className="text-xs text-muted-foreground">Credit Score</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {creditData?.creditScore}
          </div>
          <div className="text-xs text-success">Excellent</div>
        </div>
      </div>
      {/* Credit Utilization Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Icon name="PieChart" size={20} className="text-primary mr-2" />
          Credit Utilization
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Used Credit</span>
            <span className="font-medium text-foreground">
              {formatCurrency(creditData?.usedCredit)} ({creditUtilization?.toFixed(1)}%)
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-success to-warning transition-all duration-500"
              style={{ width: `${creditUtilization}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Available Credit</span>
            <span className="font-medium text-success">
              {formatCurrency(creditData?.availableCredit)}
            </span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="default"
          size="lg"
          onClick={handleMakePayment}
          iconName="CreditCard"
          iconPosition="left"
          fullWidth
        >
          Make Payment - {formatCurrency(creditData?.nextPaymentAmount)}
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleRequestIncrease}
          iconName="TrendingUp"
          iconPosition="left"
          fullWidth
        >
          Request Limit Increase
        </Button>
      </div>
      {/* Payment History */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="History" size={20} className="text-primary mr-2" />
            Payment History
          </h3>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {paymentHistory?.map((transaction) => (
            <div key={transaction?.id} className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction?.type === 'credit' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  <Icon 
                    name={transaction?.type === 'credit' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                    size={16} 
                  />
                </div>
                
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {transaction?.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction?.date)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold text-sm ${
                  transaction?.type === 'credit' ? 'text-success' : 'text-warning'
                }`}>
                  {transaction?.type === 'credit' ? '+' : '-'}{formatCurrency(transaction?.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Balance: {formatCurrency(transaction?.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Download Statement
          </Button>
        </div>
      </div>
      {/* Credit Health Tips */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Lightbulb" size={20} className="text-primary mr-2" />
          Credit Health Tips
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Pay on Time</p>
              <p className="text-xs text-muted-foreground">Always pay before due date to maintain good credit score</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Keep Utilization Low</p>
              <p className="text-xs text-muted-foreground">Try to use less than 30% of your credit limit</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Regular Payments</p>
              <p className="text-xs text-muted-foreground">Make regular payments to improve your credit profile</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Monitor Regularly</p>
              <p className="text-xs text-muted-foreground">Check your credit status regularly for better management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditManagementTab;