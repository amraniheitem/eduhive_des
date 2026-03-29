import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Header from '../../components/ui/Header';
import GlobalFilterBar, { FilterProvider, useFilters } from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter, { NotificationProvider } from '../../components/ui/AlertNotificationCenter';
import ExportToolbar from '../../components/ui/ExportToolbar';
import KPICard from './components/KPICard';
import EnrollmentTrendChart from './components/EnrollementTrendChart';
import AlertFeedWidget from './components/AlertFeedWidget';
import QuickAccessWidget from './components/QuickAccessWidget';
import DepartmentPerformanceTable from './components/DepartementPerformanceTable';
import RealTimeActivityFeed from './components/RealTimeActivityFeed';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import {
  GET_DASHBOARD_KPIS,
  GET_MONTHLY_TRENDS,
  GET_TOP_COURSES,
  GET_AT_RISK_STUDENTS,
  GET_DEPARTMENT_PERFORMANCE,
  GET_RECENT_ACTIVITY
} from '../../graphql/queries/dashboard';

// ==========================================
// COMPOSANT : Bloc d'erreur par section
// ==========================================
const SectionError = ({ title, message, onRetry }) => (
  <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center min-h-[120px] text-center gap-3">
    <Icon name="AlertCircle" size={28} className="text-error" />
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{message}</p>
    </div>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        Réessayer
      </Button>
    )}
  </div>
);

// ==========================================
// COMPOSANT : Skeleton loader
// ==========================================
const Skeleton = ({ className = '' }) => (
  <div className={`bg-card rounded-lg border border-border p-6 animate-pulse ${className}`}>
    <div className="h-full bg-muted rounded"></div>
  </div>
);

// ==========================================
// CONTENU PRINCIPAL
// ==========================================
const MainAnalyticsDashboardContent = () => {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // ==========================================
  // FETCHING — chaque query est indépendante
  // ==========================================
  const {
    data: kpisData,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKpis
  } = useQuery(GET_DASHBOARD_KPIS, {
    variables: { dateRange: null },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'   // ← retourne data partielle même en cas d'erreur
  });

  const {
    data: trendsData,
    loading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends
  } = useQuery(GET_MONTHLY_TRENDS, {
    variables: { months: 12 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const {
    data: topCoursesDataRaw,
    loading: topCoursesLoading,
    error: topCoursesError,
    refetch: refetchTopCourses
  } = useQuery(GET_TOP_COURSES, {
    variables: { limit: 10 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const {
    data: atRiskDataRaw,
    loading: atRiskLoading,
    error: atRiskError,
    refetch: refetchAtRisk
  } = useQuery(GET_AT_RISK_STUDENTS, {
    variables: { limit: 10 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const {
    data: departmentsDataRaw,
    loading: departmentsLoading,
    error: departmentsError,
    refetch: refetchDepartments
  } = useQuery(GET_DEPARTMENT_PERFORMANCE, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const {
    data: activityDataRaw,
    loading: activityLoading,
    error: activityError,
    refetch: refetchActivity
  } = useQuery(GET_RECENT_ACTIVITY, {
    variables: { limit: 10 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // ==========================================
  // TRANSFORMATION DES DONNÉES
  // ==========================================

  // 1. KPIs
  const kpiData = kpisData?.dashboardKPIs ? [
    {
      title: 'Inscriptions totales',
      value: kpisData.dashboardKPIs.totalEnrollments.value,
      change: `${kpisData.dashboardKPIs.totalEnrollments.change >= 0 ? '+' : ''}${kpisData.dashboardKPIs.totalEnrollments.change}%`,
      changeType: kpisData.dashboardKPIs.totalEnrollments.changeType.toLowerCase(),
      icon: 'Users',
      iconColor: 'var(--color-primary)',
      trend: {
        direction: kpisData.dashboardKPIs.totalEnrollments.trend.direction.toLowerCase(),
        value: kpisData.dashboardKPIs.totalEnrollments.trend.description
      }
    },
    {
      title: 'Taux de rétention',
      value: kpisData.dashboardKPIs.retentionRate.value,
      change: `${kpisData.dashboardKPIs.retentionRate.change >= 0 ? '+' : ''}${kpisData.dashboardKPIs.retentionRate.change}%`,
      changeType: kpisData.dashboardKPIs.retentionRate.changeType.toLowerCase(),
      icon: 'TrendingUp',
      iconColor: 'var(--color-success)',
      trend: {
        direction: kpisData.dashboardKPIs.retentionRate.trend.direction.toLowerCase(),
        value: kpisData.dashboardKPIs.retentionRate.trend.description
      }
    },
    {
      title: 'Revenus totaux',
      value: kpisData.dashboardKPIs.totalRevenue.value,
      change: `${kpisData.dashboardKPIs.totalRevenue.change >= 0 ? '+' : ''}${kpisData.dashboardKPIs.totalRevenue.change}%`,
      changeType: kpisData.dashboardKPIs.totalRevenue.changeType.toLowerCase(),
      icon: 'DollarSign',
      iconColor: 'var(--color-secondary)',
      trend: {
        direction: kpisData.dashboardKPIs.totalRevenue.trend.direction.toLowerCase(),
        value: kpisData.dashboardKPIs.totalRevenue.trend.description
      }
    },
    {
      title: 'Satisfaction étudiante',
      value: kpisData.dashboardKPIs.studentSatisfaction.value,
      change: `${kpisData.dashboardKPIs.studentSatisfaction.change >= 0 ? '+' : ''}${kpisData.dashboardKPIs.studentSatisfaction.change}`,
      changeType: kpisData.dashboardKPIs.studentSatisfaction.changeType.toLowerCase(),
      icon: 'Star',
      iconColor: 'var(--color-warning)',
      trend: {
        direction: kpisData.dashboardKPIs.studentSatisfaction.trend.direction.toLowerCase(),
        value: kpisData.dashboardKPIs.studentSatisfaction.trend.description
      }
    }
  ] : [];

  // 2. Tendances
  const trendData = trendsData?.monthlyTrends || [];

  // 3. Top Cours
  const topCoursesData = {
    title: 'Cours les plus performants',
    icon: 'TrendingUp',
    iconColor: 'var(--color-success)',
    items: topCoursesDataRaw?.topPerformingCourses?.map(course => ({
      name: course.name,
      subtitle: `${course.studentsCount.toLocaleString('fr-FR')} étudiants`,
      value: course.averageRating.toFixed(1),
      status: course.status.toLowerCase()
    })) || []
  };

  // 4. Étudiants à risque
  const severityToStatus = { 'HIGH': 'low', 'MEDIUM': 'medium', 'LOW': 'low' };
  const atRiskStudentsData = {
    title: 'Étudiants à risque',
    icon: 'AlertTriangle',
    iconColor: 'var(--color-error)',
    items: atRiskDataRaw?.atRiskStudents?.map(course => ({
      name: course.subjectName,
      subtitle: `${course.studentsAtRisk} étudiants`,
      value: course.studentsAtRisk.toString(),
      status: severityToStatus[course.severity] || 'medium'
    })) || []
  };

  // 5. Départements
  const departmentsData = departmentsDataRaw?.departmentPerformance?.map((dept, index) => ({
    id: index + 1,
    name: dept.category,
    icon: dept.icon,
    students: dept.students,
    retention: dept.retention,
    satisfaction: dept.satisfaction,
    revenue: dept.revenue,
    details: dept.details
  })) || [];

  // 6. Activité récente
  const recentActivityData = activityDataRaw?.recentActivity || [];

  // ==========================================
  // REFRESH
  // ==========================================
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([   // ← allSettled: continue même si une query échoue
        refetchKpis(),
        refetchTrends(),
        refetchTopCourses(),
        refetchAtRisk(),
        refetchDepartments(),
        refetchActivity()
      ]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Erreur lors du refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => { handleRefresh(); }, 900000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // EXPORT
  // ==========================================
  const exportData = { kpis: kpiData, trends: trendData, departments: departmentsData, filters };

  // ==========================================
  // RENDER — chaque section gère son propre état
  // ==========================================
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[128px] lg:pt-[144px] px-4 lg:px-6 pb-8">
        <div className="max-w-[1600px] mx-auto">

          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Tableau de Bord Principal
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Vue d'ensemble institutionnelle et indicateurs clés de performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={handleRefresh}
                loading={refreshing}
                iconName="RefreshCw"
                iconPosition="left"
                className="hidden md:flex"
              >
                Actualiser
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                loading={refreshing}
                className="md:hidden"
              >
                <Icon name="RefreshCw" size={18} />
              </Button>
              <ExportToolbar screenType="main-analytics" data={exportData} />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 text-xs md:text-sm text-muted-foreground caption">
            <Icon name="Clock" size={14} />
            <span>
              Dernière mise à jour: {lastRefresh?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {kpisLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              ))
            ) : kpisError ? (
              // FIX: erreur KPI → affiche un message, pas une page blanche
              <div className="col-span-4">
                <SectionError
                  title="Impossible de charger les KPIs"
                  message={kpisError.message}
                  onRetry={refetchKpis}
                />
              </div>
            ) : (
              kpiData.map((kpi, index) => <KPICard key={index} {...kpi} />)
            )}
          </div>

          {/* ── Graphique + Activité ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
            <div className="lg:col-span-8">
              {trendsLoading ? (
                <Skeleton className="h-[400px]" />
              ) : trendsError ? (
                // FIX: erreur trends → section erreur isolée
                <SectionError
                  title="Impossible de charger les tendances"
                  message={trendsError.message}
                  onRetry={refetchTrends}
                />
              ) : (
                <EnrollmentTrendChart data={trendData} />
              )}
            </div>

            <div className="lg:col-span-4 space-y-4 md:space-y-6">
              {activityLoading ? (
                <Skeleton className="h-[300px]" />
              ) : activityError ? (
                // FIX: erreur activity → section erreur isolée
                <SectionError
                  title="Impossible de charger l'activité"
                  message={activityError.message}
                  onRetry={refetchActivity}
                />
              ) : (
                <RealTimeActivityFeed activities={recentActivityData} />
              )}
            </div>
          </div>

          {/* ── Quick Access Widgets ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            {topCoursesLoading ? (
              <Skeleton className="h-[300px]" />
            ) : topCoursesError ? (
              // FIX: erreur top courses → section erreur isolée
              <SectionError
                title="Impossible de charger les top cours"
                message={topCoursesError.message}
                onRetry={refetchTopCourses}
              />
            ) : (
              <QuickAccessWidget {...topCoursesData} />
            )}

            {atRiskLoading ? (
              <Skeleton className="h-[300px]" />
            ) : atRiskError ? (
              // FIX: erreur at-risk → section erreur isolée, pas de page blanche
              <SectionError
                title="Impossible de charger les étudiants à risque"
                message={atRiskError.message}
                onRetry={refetchAtRisk}
              />
            ) : (
              <QuickAccessWidget {...atRiskStudentsData} />
            )}
          </div>

          {/* ── Table des départements ── */}
          {departmentsLoading ? (
            <Skeleton className="h-[400px]" />
          ) : departmentsError ? (
            // FIX: erreur departments → section erreur isolée
            <SectionError
              title="Impossible de charger les départements"
              message={departmentsError.message}
              onRetry={refetchDepartments}
            />
          ) : (
            <DepartmentPerformanceTable departments={departmentsData} />
          )}

          {/* ── Accès rapide ── */}
          <div className="mt-8 p-4 md:p-6 bg-card rounded-lg border border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
                  Accès rapide aux analyses détaillées
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explorez les données approfondies par catégorie
                </p>
              </div>
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/student-analytics')} iconName="Users" iconPosition="left">Étudiants</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/course-analytics')} iconName="BookOpen" iconPosition="left">Cours</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/teacher-performance')} iconName="GraduationCap" iconPosition="left">Enseignants</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/financial-analytics')} iconName="DollarSign" iconPosition="left">Finances</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/memory-analytics')} iconName="Brain" iconPosition="left">IA Mémorisation</Button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// ==========================================
// EXPORT
// ==========================================
const MainAnalyticsDashboard = () => (
  <NotificationProvider>
    <FilterProvider>
      <MainAnalyticsDashboardContent />
    </FilterProvider>
  </NotificationProvider>
);

export default MainAnalyticsDashboard;