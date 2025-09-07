import React from 'react';
import Icon from '../../../components/AppIcon';

const PriceComparison = ({ comparisons = [] }) => {
  if (!comparisons?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="TrendingDown" size={20} className="text-success" />
        <h3 className="text-lg font-semibold text-foreground">Price Comparison</h3>
      </div>
      <div className="bg-surface rounded-lg p-4">
        <div className="space-y-3">
          {comparisons?.map((comparison, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-foreground">
                    {comparison?.seller?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{comparison?.seller}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={10}
                          className={i < comparison?.rating ? "text-warning fill-current" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({comparison?.reviews})
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  ₹{comparison?.price?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  + ₹{comparison?.shipping} shipping
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Best Price</span>
            <span className="text-lg font-bold text-success">
              ₹{Math.min(...comparisons?.map(c => c?.price + c?.shipping))?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;