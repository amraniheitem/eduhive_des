import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon, 
  iconColor,
  description 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border hover-lift transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10">
          <Icon name={icon} size={20} color={iconColor || 'var(--color-primary)'} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-xs md:text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-xs md:text-sm text-muted-foreground mb-1 caption">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-foreground mb-1 data-text">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
      )}
    </div>
  );
};

export default PerformanceMetricCard;