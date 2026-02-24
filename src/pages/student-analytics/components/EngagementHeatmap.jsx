import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EngagementHeatmap = () => {
  const [selectedCell, setSelectedCell] = useState(null);

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = ['00h', '04h', '08h', '12h', '16h', '20h'];

  const heatmapData = [
    [12, 8, 15, 45, 78, 23],
    [15, 10, 18, 52, 85, 28],
    [18, 12, 22, 58, 92, 32],
    [20, 14, 25, 62, 95, 35],
    [22, 16, 28, 65, 88, 30],
    [35, 42, 48, 55, 62, 45],
    [28, 35, 40, 48, 52, 38]
  ];

  const getHeatColor = (value) => {
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-primary';
    if (value >= 40) return 'bg-secondary';
    if (value >= 20) return 'bg-warning';
    return 'bg-muted';
  };

  const getHeatOpacity = (value) => {
    const opacity = Math.min(value / 100, 1);
    return { opacity: 0.3 + (opacity * 0.7) };
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border h-full">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
          <Icon name="Activity" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Carte de Chaleur d'Engagement
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground caption mt-1">
            Activité par jour et heure
          </p>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[400px]">
          <div className="flex gap-2 mb-2 pl-12">
            {hours?.map((hour) => (
              <div key={hour} className="flex-1 text-center">
                <span className="text-xs text-muted-foreground caption">{hour}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {days?.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2">
                <div className="w-10 text-right">
                  <span className="text-xs font-medium text-foreground">{day}</span>
                </div>
                <div className="flex-1 flex gap-2">
                  {heatmapData?.[dayIndex]?.map((value, hourIndex) => (
                    <button
                      key={`${dayIndex}-${hourIndex}`}
                      onClick={() => setSelectedCell({ day, hour: hours?.[hourIndex], value })}
                      className={`flex-1 h-10 md:h-12 rounded ${getHeatColor(value)} transition-smooth hover-lift press-scale`}
                      style={getHeatOpacity(value)}
                      title={`${day} ${hours?.[hourIndex]}: ${value}% d'activité`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 md:mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground caption">Faible</span>
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100]?.map((value) => (
              <div
                key={value}
                className={`w-4 h-4 rounded ${getHeatColor(value)}`}
                style={getHeatOpacity(value)}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground caption">Élevé</span>
        </div>
      </div>
      {selectedCell && (
        <div className="mt-4 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedCell?.day} à {selectedCell?.hour}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Taux d'engagement: <span className="font-bold text-secondary">{selectedCell?.value}%</span>
              </p>
            </div>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementHeatmap;