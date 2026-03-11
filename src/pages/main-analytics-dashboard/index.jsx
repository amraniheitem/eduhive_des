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
// Import des queries
import {
  GET_DASHBOARD_KPIS,
  GET_MONTHLY_TRENDS,
  GET_TOP_COURSES,
  GET_AT_RISK_STUDENTS,
  GET_DEPARTMENT_PERFORMANCE,
  GET_RECENT_ACTIVITY
} from '../../graphql/queries/dashboard';
const MainAnalyticsDashboardContent = () => {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  // ==========================================
  // FETCHING DES DONNÉES
  // ==========================================
  const { data: kpisData, loading: kpisLoading, error: kpisError, refetch: refetchKpis } = useQuery(
    GET_DASHBOARD_KPIS,
    {
      variables: { dateRange: null }, // Utiliser les 30 derniers jours par défaut
      fetchPolicy: 'cache-and-network'
    }
  );
  const { data: trendsData, loading: trendsLoading, error: trendsError, refetch: refetchTrends } = useQuery(
    GET_MONTHLY_TRENDS,
    {
      variables: { months: 12 },
      fetchPolicy: 'cache-and-network'
    }
  );
  const { data: topCoursesDataRaw, loading: topCoursesLoading, error: topCoursesError, refetch: refetchTopCourses } = useQuery(
    GET_TOP_COURSES,
    {
      variables: { limit: 10 },
      fetchPolicy: 'cache-and-network'
    }
  );
  const { data: atRiskDataRaw, loading: atRiskLoading, error: atRiskError, refetch: refetchAtRisk } = useQuery(
    GET_AT_RISK_STUDENTS,
    {
      variables: { limit: 10 },
      fetchPolicy: 'cache-and-network'
    }
  );
  const { data: departmentsDataRaw, loading: departmentsLoading, error: departmentsError, refetch: refetchDepartments } = useQuery(
    GET_DEPARTMENT_PERFORMANCE,
    {
      fetchPolicy: 'cache-and-network'
    }
  );
  const { data: activityDataRaw, loading: activityLoading, error: activityError, refetch: refetchActivity } = useQuery(
    GET_RECENT_ACTIVITY,
    {
      variables: { limit: 10 },
      fetchPolicy: 'cache-and-network'
    }
  );
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
  // 2. Tendances (déjà au bon format)
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
  // Mapper severity: HIGH/MEDIUM/LOW → low/medium/high (inversé pour l'affichage)
  const severityToStatus = {
    'HIGH': 'low',    // Haute sévérité = status rouge (low)
    'MEDIUM': 'medium',
    'LOW': 'low'
  };
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
  // 6. Activité (passer directement au composant)
  const recentActivityData = activityDataRaw?.recentActivity || [];
  // ==========================================
  // GESTION DU REFRESH
  // ==========================================
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
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
  // Auto-refresh toutes les 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 900000); // 15 minutes
    return () => clearInterval(interval);
  }, []);
  // ==========================================
  // GESTION DES ÉTATS DE CHARGEMENT
  // ==========================================
  const isLoading = kpisLoading || trendsLoading || topCoursesLoading ||
    atRiskLoading || departmentsLoading || activityLoading;
  const hasError = kpisError || trendsError || topCoursesError ||
    atRiskError || departmentsError || activityError;
  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Erreur de chargement
          </h2>
          <p className="text-muted-foreground mb-4">
            Impossible de charger les statistiques du dashboard
          </p>
          <Button onClick={handleRefresh}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }
  // ==========================================
  // DONNÉES D'EXPORT
  // ==========================================
  const exportData = {
    kpis: kpiData,
    trends: trendData,
    departments: departmentsData,
    filters: filters
  };
  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[128px] lg:pt-[144px] px-4 lg:px-6 pb-8">
        <div className="max-w-[1600px] mx-auto">
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
          {/* KPI Cards avec skeleton loader */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {isLoading ? (
              // Skeleton loaders
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              ))
            ) : (
              kpiData?.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
              ))
            )}
          </div>
          {/* Graphique et widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6">
            <div className="lg:col-span-8">
              {isLoading ? (
                <div className="bg-card rounded-lg border border-border p-6 h-[400px] animate-pulse">
                  <div className="h-full bg-muted rounded"></div>
                </div>
              ) : (
                <EnrollmentTrendChart data={trendData} />
              )}
            </div>
            <div className="lg:col-span-4 space-y-4 md:space-y-6">
              {/* On garde AlertFeedWidget si tu veux (données hardcodées) */}
              {isLoading ? (
                <div className="bg-card rounded-lg border border-border p-6 h-[300px] animate-pulse">
                  <div className="h-full bg-muted rounded"></div>
                </div>
              ) : (
                <RealTimeActivityFeed activities={recentActivityData} />
              )}
            </div>
          </div>
          {/* Quick Access Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            {isLoading ? (
              <>
                <div className="bg-card rounded-lg border border-border p-6 h-[300px] animate-pulse">
                  <div className="h-full bg-muted rounded"></div>
                </div>
                <div className="bg-card rounded-lg border border-border p-6 h-[300px] animate-pulse">
                  <div className="h-full bg-muted rounded"></div>
                </div>
              </>
            ) : (
              <>
                <QuickAccessWidget {...topCoursesData} />
                <QuickAccessWidget {...atRiskStudentsData} />
              </>
            )}
          </div>
          {/* Table des départements */}
          {isLoading ? (
            <div className="bg-card rounded-lg border border-border p-6 h-[400px] animate-pulse">
              <div className="h-full bg-muted rounded"></div>
            </div>
          ) : (
            <DepartmentPerformanceTable departments={departmentsData} />
          )}
          {/* Quick access buttons */}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/student-analytics')}
                  iconName="Users"
                  iconPosition="left"
                >
                  Étudiants
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/course-analytics')}
                  iconName="BookOpen"
                  iconPosition="left"
                >
                  Cours
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/teacher-performance')}
                  iconName="GraduationCap"
                  iconPosition="left"
                >
                  Enseignants
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/financial-analytics')}
                  iconName="DollarSign"
                  iconPosition="left"
                >
                  Finances
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/memory-analytics')}
                  iconName="Brain"
                  iconPosition="left"
                >
                  IA Mémorisation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
const MainAnalyticsDashboard = () => {
  return (
    <NotificationProvider>
      <FilterProvider>
        <MainAnalyticsDashboardContent />
      </FilterProvider>
    </NotificationProvider>
  );
};
export default MainAnalyticsDashboard;