import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, iconColor, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border hover-lift transition-smooth">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-muted-foreground caption mb-1">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground data-text">
            {value}
          </h3>
        </div>
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary/10 rounded-lg">
          <Icon name={icon} size={20} color={iconColor || 'var(--color-primary)'} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={16} />
          <span className="text-sm md:text-base font-medium data-text">
            {change}
          </span>
        </div>
        <span className="text-xs md:text-sm text-muted-foreground caption">
          vs période précédente
        </span>
      </div>
      {trend && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs caption">
            <span className="text-muted-foreground">Tendance</span>
            <span className={`font-medium ${trend?.direction === 'up' ? 'text-success' : 'text-error'}`}>
              {trend?.value}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPICard;