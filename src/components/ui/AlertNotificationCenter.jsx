import React, { useState, createContext, useContext, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('eduHiveNotifications');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        type: 'warning',
        title: 'Seuil budgétaire atteint',
        message: 'Le département Sciences a atteint 85% de son budget annuel',
        timestamp: new Date('2026-01-18T14:30:00')?.toISOString(),
        read: false,
        category: 'financial'
      },
      {
        id: '2',
        type: 'error',
        title: 'Anomalie de performance',
        message: 'Taux de réussite du cours MATH-301 en baisse de 15%',
        timestamp: new Date('2026-01-18T10:15:00')?.toISOString(),
        read: false,
        category: 'performance'
      },
      {
        id: '3',
        type: 'success',
        title: 'Objectif atteint',
        message: 'Taux de rétention étudiante dépasse 92%',
        timestamp: new Date('2026-01-17T16:45:00')?.toISOString(),
        read: true,
        category: 'achievement'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eduHiveNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now()?.toString(),
      timestamp: new Date()?.toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev?.map(notif => notif?.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev?.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev?.filter(notif => notif?.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

const AlertNotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle', color: 'var(--color-success)' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      case 'error':
        return { name: 'XCircle', color: 'var(--color-error)' };
      default:
        return { name: 'Info', color: 'var(--color-primary)' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const handleNotificationClick = (notification) => {
    if (!notification?.read) {
      markAsRead(notification?.id);
    }
  };

  return (
    <>
      {/* Bouton de notification - maintenant relatif au flux du document */}
      <div className="flex justify-end p-4 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Icon name="Bell" size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-error rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Panel de notifications */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[1199] bg-background/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1200] w-full max-w-md bg-card rounded-lg shadow-xl border border-border animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Icon name="Bell" size={20} color="var(--color-primary)" />
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium text-primary-foreground bg-primary rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <Icon name="X" size={18} />
              </Button>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              {notifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Icon name="BellOff" size={48} color="var(--color-muted-foreground)" />
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    Aucune notification pour le moment
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications?.map((notification) => {
                    const iconConfig = getNotificationIcon(notification?.type);
                    return (
                      <div
                        key={notification?.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`
                          p-4 cursor-pointer transition-smooth hover:bg-muted
                          ${!notification?.read ? 'bg-primary/5' : ''}
                        `}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <Icon
                              name={iconConfig?.name}
                              size={20}
                              color={iconConfig?.color}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium text-foreground">
                                {notification?.title}
                              </h4>
                              {!notification?.read && (
                                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1" />
                              )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {notification?.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground caption">
                                {formatTimestamp(notification?.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  deleteNotification(notification?.id);
                                }}
                                className="h-6 px-2"
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications?.length > 0 && (
              <div className="flex items-center gap-2 p-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex-1"
                >
                  Tout marquer comme lu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="flex-1"
                >
                  Tout effacer
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AlertNotificationCenter;