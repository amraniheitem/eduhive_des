import React from 'react';
import Icon from '../../../components/AppIcon';
const QuickAccessWidget = ({ title, icon, iconColor, items = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'high':
        return 'bg-success text-success';
      case 'medium':
        return 'bg-warning text-warning';
      case 'low':
        return 'bg-error text-error';
      default:
        return 'bg-muted-foreground text-muted-foreground';
    }
  };
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'high':
        return 'bg-success/10';
      case 'medium':
        return 'bg-warning/10';
      case 'low':
        return 'bg-error/10';
      default:
        return 'bg-muted/50';
    }
  };
  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name={icon} size={20} color={iconColor || 'var(--color-primary)'} />
        </div>
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          {title}
        </h3>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon name="Inbox" size={24} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 md:max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {items.map((item, index) => {
            const statusColor = getStatusColor(item.status);
            const statusBg = getStatusBgColor(item.status);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth border border-transparent hover:border-border"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusBg}`}>
                  <span className={`text-xs font-bold ${statusColor.split(' ')[1]}`}>
                    {item.value}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground caption truncate">
                    {item.subtitle}
                  </p>
                </div>
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${statusColor.split(' ')[0]}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default QuickAccessWidget;