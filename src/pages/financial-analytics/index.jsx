import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import ExportToolbar from '../../components/ui/ExportToolbar';
import FinancialKPICard from './components/FinancialKPICard';
import RevenueStreamChart from './components/RevenuStreamChart';
import BudgetUtilizationGauge from './components/BudgetUtilizationGauge';
import PaymentStatusSummary from './components/PayementStatusSummary';
import TopRevenueCoursesRanking from './components/TopRevenueCourseRanking';
import FinancialBreakdownTable from './components/FinancialBreakdownTable';
import Icon from '../../components/AppIcon';

const FinancialAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const kpiData = [
    {
      title: 'Revenus Totaux',
      value: '3 500 000',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign',
      iconColor: 'var(--color-primary)'
    },
    {
      title: 'Revenus Inscriptions',
      value: '2 456 000',
      change: '+15.2%',
      changeType: 'positive',
      icon: 'Users',
      iconColor: 'var(--color-secondary)'
    },
    {
      title: 'Coûts Opérationnels',
      value: '2 847 000',
      change: '+8.3%',
      changeType: 'negative',
      icon: 'TrendingDown',
      iconColor: 'var(--color-warning)'
    },
    {
      title: 'Marge Bénéficiaire',
      value: '18.7',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Percent',
      iconColor: 'var(--color-success)',
      currency: ''
    },
    {
      title: 'Écart Budgétaire',
      value: '653 000',
      change: '-5.4%',
      changeType: 'positive',
      icon: 'Target',
      iconColor: 'var(--color-accent)'
    }
  ];

  const exportData = {
    kpis: kpiData,
    timestamp: new Date()?.toISOString()
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 md:pt-36 pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Analytique Financière
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Suivi des revenus, analyse des coûts et surveillance budgétaire
              </p>
            </div>
            <ExportToolbar screenType="financial-analytics" data={exportData} />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth flex-shrink-0
                ${activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name="LayoutDashboard" size={16} />
              <span>Vue d'ensemble</span>
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth flex-shrink-0
                ${activeTab === 'revenue' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name="TrendingUp" size={16} />
              <span>Revenus</span>
            </button>
            <button
              onClick={() => setActiveTab('costs')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth flex-shrink-0
                ${activeTab === 'costs' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name="TrendingDown" size={16} />
              <span>Coûts</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth flex-shrink-0
                ${activeTab === 'budget' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'
                }
              `}
            >
              <Icon name="Target" size={16} />
              <span>Budget</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {kpiData?.map((kpi, index) => (
              <FinancialKPICard key={index} {...kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-8">
              <RevenueStreamChart />
            </div>

            <div className="lg:col-span-4 space-y-4 md:space-y-6">
              <BudgetUtilizationGauge />
              <PaymentStatusSummary />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-8">
              <FinancialBreakdownTable />
            </div>

            <div className="lg:col-span-4">
              <TopRevenueCoursesRanking />
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg flex-shrink-0">
                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
                  Alertes Budgétaires Actives
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-warning/5 rounded-lg">
                    <Icon name="AlertCircle" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Département Sciences - Seuil budgétaire atteint
                      </p>
                      <p className="text-xs text-muted-foreground caption mt-1">
                        85% du budget annuel utilisé. Révision recommandée pour Q2.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-error/5 rounded-lg">
                    <Icon name="XCircle" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Paiements en retard - Action requise
                      </p>
                      <p className="text-xs text-muted-foreground caption mt-1">
                        234 transactions en retard totalisant €149 000. Suivi immédiat nécessaire.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-card border-t border-border py-6 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground caption">
              © {new Date()?.getFullYear()} EduHive Analytics. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground caption">
              <span>Dernière mise à jour: 18/01/2026 18:32</span>
              <span>•</span>
              <span>Données en temps réel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinancialAnalytics;