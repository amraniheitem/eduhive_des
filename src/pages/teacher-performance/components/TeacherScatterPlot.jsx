import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from 'recharts';

const TeacherScatterPlot = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{data?.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              Charge: <span className="font-medium text-foreground">{data?.workload} cours</span>
            </p>
            <p className="text-muted-foreground">
              Note: <span className="font-medium text-foreground">{data?.rating}/5.0</span>
            </p>
            <p className="text-muted-foreground">
              Étudiants: <span className="font-medium text-foreground">{data?.students}</span>
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
          Charge vs Satisfaction
        </h3>
        <p className="text-sm text-muted-foreground">
          Corrélation entre charge de travail et évaluations étudiantes
        </p>
      </div>
      <div className="w-full h-64 md:h-80 lg:h-96" aria-label="Graphique de dispersion charge vs satisfaction">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              type="number" 
              dataKey="workload" 
              name="Charge"
              label={{ value: 'Nombre de cours', position: 'bottom', fill: 'var(--color-muted-foreground)' }}
              stroke="var(--color-muted-foreground)"
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="rating" 
              name="Note"
              domain={[0, 5]}
              label={{ value: 'Note moyenne', angle: -90, position: 'insideLeft', fill: 'var(--color-muted-foreground)' }}
              stroke="var(--color-muted-foreground)"
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="students" range={[50, 400]} name="Étudiants" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Scatter 
              name="Enseignants" 
              data={data} 
              fill="var(--color-primary)"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeacherScatterPlot;