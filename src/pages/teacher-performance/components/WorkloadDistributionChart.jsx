import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WorkloadDistributionChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{payload?.[0]?.payload?.range}</p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              Enseignants: <span className="font-medium text-foreground">{payload?.[0]?.value}</span>
            </p>
            <p className="text-muted-foreground">
              Pourcentage: <span className="font-medium text-foreground">
                {((payload?.[0]?.value / data?.reduce((sum, item) => sum + item?.count, 0)) * 100)?.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          Distribution de Charge
        </h3>
        <p className="text-sm text-muted-foreground">
          Répartition des enseignants par nombre de cours
        </p>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Graphique de distribution de charge">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="range" 
              stroke="var(--color-muted-foreground)"
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              label={{ value: 'Nombre d\'enseignants', angle: -90, position: 'insideLeft', fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar 
              dataKey="count" 
              fill="var(--color-secondary)" 
              radius={[8, 8, 0, 0]}
              name="Enseignants"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WorkloadDistributionChart;