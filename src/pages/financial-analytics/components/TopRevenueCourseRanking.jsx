import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TopRevenueCoursesRanking = () => {
  const topCourses = [
  {
    id: 1,
    name: 'Intelligence Artificielle Avancée',
    code: 'CS-401',
    department: 'Ingénierie',
    revenue: 234000,
    enrollments: 156,
    avgRevenue: 1500,
    growth: 23,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15b9cfc75-1764651774193.png",
    imageAlt: 'Modern computer screen displaying artificial intelligence neural network visualization with blue and purple glowing nodes and connections'
  },
  {
    id: 2,
    name: 'Finance d\'Entreprise',
    code: 'BUS-302',
    department: 'Commerce',
    revenue: 198000,
    enrollments: 132,
    avgRevenue: 1500,
    growth: 18,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1451a6a62-1768305328630.png",
    imageAlt: 'Professional business meeting with financial charts and graphs displayed on laptop screen showing upward trending revenue data'
  },
  {
    id: 3,
    name: 'Biologie Moléculaire',
    code: 'SCI-305',
    department: 'Sciences',
    revenue: 187000,
    enrollments: 124,
    avgRevenue: 1508,
    growth: 15,
    image: "https://images.unsplash.com/photo-1630959302878-a30de73cdbb5",
    imageAlt: 'Laboratory scientist examining molecular biology samples under microscope with test tubes and scientific equipment on clean white workspace'
  },
  {
    id: 4,
    name: 'Architecture Moderne',
    code: 'ART-201',
    department: 'Arts',
    revenue: 156000,
    enrollments: 104,
    avgRevenue: 1500,
    growth: 12,
    image: "https://images.unsplash.com/photo-1691903835863-6e86e70a4664",
    imageAlt: 'Contemporary architectural building with geometric glass facade and modern design elements against clear blue sky'
  },
  {
    id: 5,
    name: 'Psychologie Cognitive',
    code: 'HUM-303',
    department: 'Sciences humaines',
    revenue: 143000,
    enrollments: 95,
    avgRevenue: 1505,
    growth: 9,
    image: "https://images.unsplash.com/photo-1714976694756-28bf07af3758",
    imageAlt: 'Psychology therapy session with professional counselor taking notes while patient sits comfortably in modern office setting'
  }];


  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Top Cours par Revenus
          </h3>
          <p className="text-sm text-muted-foreground caption">
            Classement des cours les plus rentables
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {topCourses?.map((course, index) =>
        <div
          key={course?.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-smooth">

            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg flex-shrink-0">
              <span className="text-sm font-bold text-primary data-text">
                #{index + 1}
              </span>
            </div>

            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
              src={course?.image}
              alt={course?.imageAlt}
              className="w-full h-full object-cover" />

            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {course?.name}
                  </h4>
                  <p className="text-xs text-muted-foreground caption">
                    {course?.code} • {course?.department}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded-md flex-shrink-0">
                  <Icon name="TrendingUp" size={12} color="var(--color-success)" />
                  <span className="text-xs font-medium text-success">
                    +{course?.growth}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground caption">
                  <div className="flex items-center gap-1">
                    <Icon name="Users" size={12} />
                    <span>{course?.enrollments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="DollarSign" size={12} />
                    <span>€{course?.avgRevenue}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground data-text whitespace-nowrap">
                  €{course?.revenue?.toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-smooth">
          <span>Voir tous les cours</span>
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>
    </div>);

};

export default TopRevenueCoursesRanking;