import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialKPICard = ({ title, value, change, changeType, icon, iconColor, currency = '€' }) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  const isNeutral = changeType === 'neutral';

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border hover-lift transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon name={icon} size={20} color={iconColor} />
          </div>
          <h3 className="text-sm md:text-base font-medium text-muted-foreground caption">
            {title}
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground data-text">
          {currency}{value}
        </p>

        <div className="flex items-center gap-2">
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-md text-xs md:text-sm font-medium
            ${isPositive ? 'bg-success/10 text-success' : ''}
            ${isNegative ? 'bg-error/10 text-error' : ''}
            ${isNeutral ? 'bg-muted text-muted-foreground' : ''}
          `}>
            <Icon 
              name={isPositive ? 'TrendingUp' : isNegative ? 'TrendingDown' : 'Minus'} 
              size={14} 
            />
            <span>{change}</span>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground caption">
            vs mois dernier
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialKPICard;