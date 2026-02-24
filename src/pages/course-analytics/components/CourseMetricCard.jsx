import React from 'react';
import Icon from '../../../components/AppIcon';

const CourseMetricCard = ({ title, value, change, changeType, icon, iconColor, trend }) => {
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
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10">
          <Icon name={icon} size={20} color={iconColor || 'var(--color-primary)'} />
        </div>
        {trend && (
          <div className="h-8 w-16 md:w-20">
            <svg viewBox="0 0 80 32" className="w-full h-full">
              <polyline
                points={trend?.map((val, idx) => `${(idx / (trend?.length - 1)) * 80},${32 - (val / Math.max(...trend)) * 28}`)?.join(' ')}
                fill="none"
                stroke={changeType === 'positive' ? 'var(--color-success)' : changeType === 'negative' ? 'var(--color-error)' : 'var(--color-muted-foreground)'}
                strokeWidth="2"
              />
            </svg>
          </div>
        )}
      </div>
      <h3 className="text-xs md:text-sm text-muted-foreground font-medium mb-1 caption">
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl md:text-3xl font-bold text-foreground font-heading">
          {value}
        </p>
        {change && (
          <div className={`flex items-center gap-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMetricCard;