import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ContentEngagementHeatmap = ({ data }) => {
  const [selectedDay, setSelectedDay] = useState(null);

  const getHeatColor = (value) => {
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-success/60';
    if (value >= 40) return 'bg-warning';
    if (value >= 20) return 'bg-warning/60';
    return 'bg-muted';
  };

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = ['00h', '04h', '08h', '12h', '16h', '20h'];

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Activity" size={20} color="var(--color-primary)" />
          <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
            Carte thermique d'engagement
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground caption hidden md:inline">
            Derniers 7 jours
          </span>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-12" />
            {hours?.map((hour) => (
              <div key={hour} className="flex-1 text-center">
                <span className="text-xs text-muted-foreground caption">{hour}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {data?.map((dayData, dayIndex) => (
              <div key={dayIndex} className="flex items-center gap-2">
                <div className="w-12">
                  <span className="text-xs font-medium text-foreground">{days?.[dayIndex]}</span>
                </div>
                {dayData?.hours?.map((value, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`flex-1 h-10 md:h-12 rounded cursor-pointer transition-all hover:scale-105 ${getHeatColor(value)}`}
                    onClick={() => setSelectedDay({ day: days?.[dayIndex], hour: hours?.[hourIndex], value })}
                    title={`${days?.[dayIndex]} ${hours?.[hourIndex]}: ${value}% engagement`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 md:mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground caption">Faible</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-muted" />
            <div className="w-4 h-4 rounded bg-warning/60" />
            <div className="w-4 h-4 rounded bg-warning" />
            <div className="w-4 h-4 rounded bg-success/60" />
            <div className="w-4 h-4 rounded bg-success" />
          </div>
          <span className="text-xs text-muted-foreground caption">Élevé</span>
        </div>
        {selectedDay && (
          <div className="text-xs text-muted-foreground caption">
            {selectedDay?.day} {selectedDay?.hour}: <span className="font-medium text-foreground">{selectedDay?.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEngagementHeatmap;