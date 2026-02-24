import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const BudgetUtilizationGauge = () => {
  const budgetData = [
    { name: 'Utilisé', value: 2847000, color: '#6366F1' },
    { name: 'Restant', value: 653000, color: '#E5E7EB' }
  ];

  const totalBudget = budgetData?.reduce((sum, item) => sum + item?.value, 0);
  const utilizationPercentage = ((budgetData?.[0]?.value / totalBudget) * 100)?.toFixed(1);

  const departmentBreakdown = [
    { department: 'Sciences', allocated: 850000, spent: 723000, percentage: 85 },
    { department: 'Ingénierie', allocated: 920000, spent: 789000, percentage: 86 },
    { department: 'Commerce', allocated: 680000, spent: 578000, percentage: 85 },
    { department: 'Arts', allocated: 550000, spent: 467000, percentage: 85 },
    { department: 'Sciences humaines', allocated: 500000, spent: 290000, percentage: 58 }
  ];

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="PieChart" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Utilisation du Budget
          </h3>
          <p className="text-sm text-muted-foreground caption">
            Année fiscale 2025-2026
          </p>
        </div>
      </div>
      <div className="relative w-full h-48 md:h-56" aria-label="Budget Utilization Gauge">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              {budgetData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl md:text-4xl font-bold text-foreground data-text">
            {utilizationPercentage}%
          </p>
          <p className="text-xs md:text-sm text-muted-foreground caption">
            Budget utilisé
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Budget total:</span>
          <span className="font-semibold text-foreground data-text">
            €{totalBudget?.toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Dépensé:</span>
          <span className="font-semibold text-primary data-text">
            €{budgetData?.[0]?.value?.toLocaleString('fr-FR')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Restant:</span>
          <span className="font-semibold text-success data-text">
            €{budgetData?.[1]?.value?.toLocaleString('fr-FR')}
          </span>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">
          Répartition par Département
        </h4>
        <div className="space-y-3">
          {departmentBreakdown?.map((dept, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{dept?.department}</span>
                <span className="font-medium text-foreground data-text">
                  {dept?.percentage}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    dept?.percentage >= 90 ? 'bg-error' :
                    dept?.percentage >= 80 ? 'bg-warning': 'bg-success'
                  }`}
                  style={{ width: `${dept?.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground caption">
                <span>€{dept?.spent?.toLocaleString('fr-FR')}</span>
                <span>/ €{dept?.allocated?.toLocaleString('fr-FR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetUtilizationGauge;