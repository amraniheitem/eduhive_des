import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const InstructorWorkloadChart = ({ data }) => {
  const COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{payload?.[0]?.name}</p>
          <p className="text-xs text-muted-foreground">
            {payload?.[0]?.value} cours ({payload?.[0]?.payload?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <Icon name="Users" size={20} color="var(--color-primary)" />
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Répartition de la charge
        </h2>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Graphique de répartition de la charge des instructeurs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${percentage}%`}
              outerRadius={80}
              fill="var(--color-primary)"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 md:mt-6 pt-4 border-t border-border space-y-2">
        {data?.map((item, index) => (
          <div key={item?.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
              />
              <span className="text-muted-foreground">{item?.name}</span>
            </div>
            <span className="font-medium text-foreground">{item?.value} cours</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorWorkloadChart;