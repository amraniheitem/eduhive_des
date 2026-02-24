import React from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeActivityFeed = ({ activities = [] }) => {
  // Fonction helper pour mapper le type d'activité à une icône et couleur
  const getActivityConfig = (type) => {
    switch (type) {
      case 'ENROLLMENT':
        return { icon: 'UserPlus', color: 'var(--color-success)' };
      case 'COMPLETION':
        return { icon: 'CheckCircle', color: 'var(--color-primary)' };
      case 'PAYMENT':
        return { icon: 'DollarSign', color: 'var(--color-secondary)' };
      case 'WITHDRAWAL':
        return { icon: 'ArrowDownCircle', color: 'var(--color-error)' };
      case 'SUBJECT_CREATED':
        return { icon: 'BookOpen', color: 'var(--color-info)' };
      case 'RATING_SUBMITTED':
        return { icon: 'Star', color: 'var(--color-warning)' };
      default:
        return { icon: 'Activity', color: 'var(--color-muted)' };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Activité en temps réel
          </h3>
          <div className="flex items-center gap-2 px-2 py-1 bg-success/10 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-medium text-success caption">
              En direct
            </span>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon name="Activity" size={24} className="text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Aucune activité récente</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 md:max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
          {activities.map((activity) => {
            const config = getActivityConfig(activity.type);
            return (
              <div
                key={activity.id}
                className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth animate-fade-in border border-transparent hover:border-border"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Icon name={config.icon} size={16} color={config.color} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">
                      {activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'Utilisateur'}
                    </span>
                    {' '}
                    <span className="text-muted-foreground">{activity.description}</span>
                    {activity.subject && (
                      <>
                        {' '}
                        <span className="font-medium text-primary">{activity.subject.name}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground caption mt-1 flex items-center gap-1">
                    <Icon name="Clock" size={10} />
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RealTimeActivityFeed;