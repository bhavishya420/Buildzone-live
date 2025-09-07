import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

const AIAgentCard = ({ agent, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'coming_soon':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'in_development':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'planning':
        return 'text-muted-foreground bg-muted/20 border-muted/30';
      default:
        return 'text-muted-foreground bg-muted/20 border-muted/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'coming_soon':
        return 'Coming Soon';
      case 'in_development':
        return 'In Development';
      case 'planning':
        return 'Planning';
      default:
        return 'Coming Soon';
    }
  };

  const IconComponent = agent?.icon;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(agent?.status)}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(agent?.status)}`}>
          {getStatusText(agent?.status)}
        </span>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {agent?.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {agent?.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs text-muted-foreground">{agent?.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${agent?.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{agent?.estimatedLaunch}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSelect?.(agent)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="text-xs">Learn More</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {/* Disabled Overlay */}
      <div className="absolute inset-0 bg-transparent" />
    </div>
  );
};

export default AIAgentCard;