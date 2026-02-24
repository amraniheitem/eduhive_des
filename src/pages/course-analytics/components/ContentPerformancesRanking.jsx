import React from 'react';
import Icon from '../../../components/AppIcon';

const ContentPerformanceRanking = ({ contentItems }) => {
  const getEngagementColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'pdf':
        return 'FileText';
      case 'quiz':
        return 'ClipboardCheck';
      case 'assignment':
        return 'FileEdit';
      default:
        return 'File';
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Performance du contenu
        </h2>
      </div>
      <div className="space-y-3 md:space-y-4">
        {contentItems?.map((item, index) => (
          <div key={item?.id} className="group">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                <Icon name={getContentIcon(item?.type)} size={16} color="var(--color-primary)" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {item?.title}
                  </h3>
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {item?.engagement}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground caption">
                  <span>{item?.views} vues</span>
                  <span>•</span>
                  <span>{item?.avgTime}</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getEngagementColor(item?.engagement)}`}
                style={{ width: `${item?.engagement}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 md:mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground caption">
          <span>Engagement moyen</span>
          <span className="font-semibold text-foreground">
            {Math.round(contentItems?.reduce((acc, item) => acc + item?.engagement, 0) / contentItems?.length)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContentPerformanceRanking;