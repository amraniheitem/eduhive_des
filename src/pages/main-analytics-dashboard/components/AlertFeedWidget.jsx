import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertFeedWidget = ({ alerts }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      case 'error':
        return { name: 'XCircle', color: 'var(--color-error)' };
      case 'success':
        return { name: 'CheckCircle', color: 'var(--color-success)' };
      default:
        return { name: 'Info', color: 'var(--color-primary)' };
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Alertes récentes
        </h3>
        <div className="flex items-center gap-1 px-2 py-1 bg-error/10 rounded-full">
          <Icon name="Bell" size={14} color="var(--color-error)" />
          <span className="text-xs font-medium text-error data-text">
            {alerts?.filter(a => !a?.read)?.length}
          </span>
        </div>
      </div>
      <div className="space-y-3 max-h-64 md:max-h-80 overflow-y-auto custom-scrollbar">
        {alerts?.map((alert) => {
          const iconConfig = getAlertIcon(alert?.type);
          return (
            <div
              key={alert?.id}
              className={`
                p-3 rounded-lg border transition-smooth hover:bg-muted cursor-pointer
                ${!alert?.read ? 'bg-primary/5 border-primary/20' : 'border-border'}
              `}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icon name={iconConfig?.name} size={18} color={iconConfig?.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground line-clamp-1">
                      {alert?.title}
                    </h4>
                    {!alert?.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {alert?.message}
                  </p>
                  <span className="text-xs text-muted-foreground caption">
                    {formatTime(alert?.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-smooth">
        Voir toutes les alertes
      </button>
    </div>
  );
};

export default AlertFeedWidget;