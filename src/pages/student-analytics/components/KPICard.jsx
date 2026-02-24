import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, iconColor, description }) => {
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
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10">
            <Icon name={icon} size={20} color={iconColor || 'var(--color-primary)'} />
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground caption">{title}</p>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-foreground mt-1">
              {value}
            </h3>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name={getChangeIcon()} size={16} color={changeType === 'positive' ? 'var(--color-success)' : changeType === 'negative' ? 'var(--color-error)' : 'var(--color-muted-foreground)'} />
          <span className={`text-sm md:text-base font-medium ${getChangeColor()}`}>
            {change}
          </span>
        </div>
        {description && (
          <span className="text-xs text-muted-foreground caption">{description}</span>
        )}
      </div>
    </div>
  );
};

export default KPICard;