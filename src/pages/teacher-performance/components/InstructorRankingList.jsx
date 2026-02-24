import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const InstructorRankingList = ({ instructors }) => {
  const [sortBy, setSortBy] = useState('rating');

  const sortOptions = [
    { value: 'rating', label: 'Note', icon: 'Star' },
    { value: 'engagement', label: 'Engagement', icon: 'Activity' },
    { value: 'completion', label: 'Complétion', icon: 'CheckCircle' }
  ];

  const getSortedInstructors = () => {
    return [...instructors]?.sort((a, b) => {
      if (sortBy === 'rating') return b?.rating - a?.rating;
      if (sortBy === 'engagement') return b?.engagement - a?.engagement;
      if (sortBy === 'completion') return b?.completion - a?.completion;
      return 0;
    });
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-warning/20 text-warning border-warning/30';
    if (rank === 2) return 'bg-muted text-muted-foreground border-border';
    if (rank === 3) return 'bg-accent/20 text-accent border-accent/30';
    return 'bg-muted/50 text-muted-foreground border-border';
  };

  const sortedInstructors = getSortedInstructors();

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Classement Enseignants
          </h3>
          <p className="text-sm text-muted-foreground">
            Top performers par critère
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sortOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSortBy(option?.value)}
              title={option?.label}
              className={`
                p-2 rounded-md transition-smooth press-scale
                ${sortBy === option?.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <Icon name={option?.icon} size={16} />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {sortedInstructors?.slice(0, 5)?.map((instructor, index) => {
          const rank = index + 1;
          return (
            <div 
              key={instructor?.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-sm
                ${getRankBadgeColor(rank)}
              `}>
                {rank}
              </div>
              <div className="flex-shrink-0">
                <Image
                  src={instructor?.avatar}
                  alt={instructor?.avatarAlt}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm md:text-base font-medium text-foreground truncate">
                  {instructor?.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {instructor?.department}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Icon name="Star" size={14} color="var(--color-warning)" />
                <span className="text-sm font-medium text-foreground data-text">
                  {sortBy === 'rating' && instructor?.rating}
                  {sortBy === 'engagement' && `${instructor?.engagement}%`}
                  {sortBy === 'completion' && `${instructor?.completion}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InstructorRankingList;