import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import KPICard from './components/KPICard';
import StudentProgressionFunnel from './components/StudentProgressionFunnet';
import EngagementHeatmap from './components/EngagementHeatmap';
import AtRiskStudentsList from './components/AtRiskStudentsList';
import StudentPerformanceTable from './components/StudentPerformanceTable';
import ExportMenu from './components/ExportMenu';
import Icon from '../../components/AppIcon';

// Import des queries
import {
  GET_STUDENT_ANALYTICS_KPIS,
  GET_STUDENT_PROGRESSION_FUNNEL,
  GET_STUDENT_ENGAGEMENT_HEATMAP,
  GET_AT_RISK_STUDENTS_LIST,
  GET_STUDENT_PERFORMANCE_LIST
} from '../../graphql/queries';

const StudentAnalytics = () => {
  // ==========================================
  // FETCHING DES DONNÉES
  // ==========================================

  const { data: kpisData, loading: kpisLoading, error: kpisError } = useQuery(
    GET_STUDENT_ANALYTICS_KPIS,
    {
      variables: { dateRange: null },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  );

  const { data: funnelData, loading: funnelLoading, error: funnelError } = useQuery(
    GET_STUDENT_PROGRESSION_FUNNEL,
    {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  );

  const { data: heatmapData, loading: heatmapLoading, error: heatmapError } = useQuery(
    GET_STUDENT_ENGAGEMENT_HEATMAP,
    {
      variables: { dateRange: null },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  );

  const { data: atRiskData, loading: atRiskLoading, error: atRiskError } = useQuery(
    GET_AT_RISK_STUDENTS_LIST,
    {
      variables: { limit: 50, riskLevel: null },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  );

  const { data: performanceData, loading: performanceLoading, error: performanceError } = useQuery(
    GET_STUDENT_PERFORMANCE_LIST,
    {
      variables: {
        limit: 100,
        offset: 0,
        orderBy: null,
        filters: null
      },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  );

  // ==========================================
  // TRANSFORMATION DES DONNÉES
  // ==========================================

  // 1. KPIs - Mapper vers format KPICard
  const kpiData = kpisData?.studentAnalyticsKPIs ? [
    {
      title: 'Étudiants Actifs',
      value: kpisData.studentAnalyticsKPIs.activeStudents.value,
      change: `${kpisData.studentAnalyticsKPIs.activeStudents.change >= 0 ? '+' : ''}${kpisData.studentAnalyticsKPIs.activeStudents.change}%`,
      changeType: kpisData.studentAnalyticsKPIs.activeStudents.changeType.toLowerCase(),
      icon: 'Users',
      iconColor: 'var(--color-primary)',
      description: kpisData.studentAnalyticsKPIs.activeStudents.description
    },
    {
      title: 'Taux de Réussite',
      value: kpisData.studentAnalyticsKPIs.successRate.value,
      change: `${kpisData.studentAnalyticsKPIs.successRate.change >= 0 ? '+' : ''}${kpisData.studentAnalyticsKPIs.successRate.change}%`,
      changeType: kpisData.studentAnalyticsKPIs.successRate.changeType.toLowerCase(),
      icon: 'TrendingUp',
      iconColor: 'var(--color-success)',
      description: kpisData.studentAnalyticsKPIs.successRate.description
    },
    {
      title: 'Taux de Rétention',
      value: kpisData.studentAnalyticsKPIs.retentionRate.value,
      change: `${kpisData.studentAnalyticsKPIs.retentionRate.change >= 0 ? '+' : ''}${kpisData.studentAnalyticsKPIs.retentionRate.change}%`,
      changeType: kpisData.studentAnalyticsKPIs.retentionRate.changeType.toLowerCase(),
      icon: 'Users',
      iconColor: 'var(--color-warning)',
      description: kpisData.studentAnalyticsKPIs.retentionRate.description
    },
    {
      title: 'Étudiants à Risque',
      value: kpisData.studentAnalyticsKPIs.atRiskCount.value,
      change: `${kpisData.studentAnalyticsKPIs.atRiskCount.change >= 0 ? '+' : ''}${kpisData.studentAnalyticsKPIs.atRiskCount.change}%`,
      changeType: kpisData.studentAnalyticsKPIs.atRiskCount.changeType.toLowerCase(),
      icon: 'AlertTriangle',
      iconColor: 'var(--color-error)',
      description: kpisData.studentAnalyticsKPIs.atRiskCount.description
    },
    {
      title: 'Moyenne Générale',
      value: kpisData.studentAnalyticsKPIs.averageGrade.value,
      change: `${kpisData.studentAnalyticsKPIs.averageGrade.change >= 0 ? '+' : ''}${kpisData.studentAnalyticsKPIs.averageGrade.change}`,
      changeType: kpisData.studentAnalyticsKPIs.averageGrade.changeType.toLowerCase(),
      icon: 'Award',
      iconColor: 'var(--color-primary)',
      description: kpisData.studentAnalyticsKPIs.averageGrade.description
    },
    {
      title: 'Taux d\'Assiduité',
      value: kpisData.studentAnalyticsKPIs.attendanceRate.value,
      change: `${kpisData.studentAnalyticsKPIs.attendanceRate.change >= 0 ? '+' : ''}${kpisData.studentAnalyticsKPIs.attendanceRate.change}%`,
      changeType: kpisData.studentAnalyticsKPIs.attendanceRate.changeType.toLowerCase(),
      icon: 'Calendar',
      iconColor: 'var(--color-success)',
      description: kpisData.studentAnalyticsKPIs.attendanceRate.description
    }
  ] : [];

  // 2. Funnel (déjà au bon format)
  const progressionFunnelData = funnelData?.studentProgressionFunnel || [];

  // 3. Heatmap (déjà au bon format)
  const engagementHeatmapData = heatmapData?.studentEngagementHeatmap || [];

  // 4. Étudiants à risque (déjà au bon format)
  const atRiskStudentsData = atRiskData?.atRiskStudentsList || [];

  // 5. Performance des étudiants
  const studentsPerformanceData = performanceData?.studentPerformanceList?.students || [];
  const studentsData = studentsPerformanceData; // Pour ExportMenu

  // ==========================================
  // GESTION DES ÉTATS
  // ==========================================

  const isLoading = kpisLoading || funnelLoading || heatmapLoading ||
    atRiskLoading || performanceLoading;

  const hasError = (kpisError && !kpisData) &&
    (funnelError && !funnelData) &&
    (heatmapError && !heatmapData) &&
    (atRiskError && !atRiskData) &&
    (performanceError && !performanceData);

  if (hasError) {
    console.error("Toutes les requêtes analytiques ont échoué.");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header, FilterBar et Notifications */}
      <div className="relative">
        <Header />
      </div>

      {/* Contenu principal */}
      <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-[1920px] mx-auto">
          {(atRiskError || performanceError) && (
            <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg text-warning text-sm flex items-center gap-2">
              <Icon name="AlertTriangle" size={16} />
              Certaines données n'ont pas pu être chargées.
            </div>
          )}

          {/* Titre + Bouton Export */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Analytique des Étudiants
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Suivi de l'engagement, des performances et des indicateurs de réussite des étudiants
              </p>
            </div>

            {/* Bouton Export Global */}
            <ExportMenu
              students={studentsData}
              filteredStudents={null}
              title="Étudiants_Analytics"
            />
          </div>

          {/* KPI Cards avec skeleton loader */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {isLoading ? (
              // Skeleton loaders
              Array.from({ length: 6 }).map((_, index) => (
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

          {/* Tableau de Performance */}
          <div className="mb-6 md:mb-8">
            {isLoading ? (
              <div className="bg-card rounded-lg border border-border p-6 h-[400px] animate-pulse">
                <div className="h-full bg-muted rounded"></div>
              </div>
            ) : (
              <StudentPerformanceTable
                students={studentsPerformanceData}
                total={performanceData?.studentPerformanceList?.total || 0}
                hasMore={performanceData?.studentPerformanceList?.hasMore || false}
              />
            )}
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-card rounded-lg border border-border p-6 h-[400px] animate-pulse">
                  <div className="h-full bg-muted rounded"></div>
                </div>
              ) : (
                <StudentProgressionFunnel data={progressionFunnelData} />
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="grid grid-cols-1 gap-4 md:gap-6">
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
                    <EngagementHeatmap data={engagementHeatmapData} />
                    <AtRiskStudentsList students={atRiskStudentsData} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAnalytics;