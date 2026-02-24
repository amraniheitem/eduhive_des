import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenueStreamChart = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const revenueData = [
    {
      month: 'Août 2025',
      enrollmentRevenue: 245000,
      courseRevenue: 89000,
      certificationRevenue: 34000,
      otherRevenue: 12000
    },
    {
      month: 'Sept 2025',
      enrollmentRevenue: 312000,
      courseRevenue: 124000,
      certificationRevenue: 45000,
      otherRevenue: 18000
    },
    {
      month: 'Oct 2025',
      enrollmentRevenue: 298000,
      courseRevenue: 142000,
      certificationRevenue: 52000,
      otherRevenue: 21000
    },
    {
      month: 'Nov 2025',
      enrollmentRevenue: 334000,
      courseRevenue: 156000,
      certificationRevenue: 58000,
      otherRevenue: 24000
    },
    {
      month: 'Déc 2025',
      enrollmentRevenue: 289000,
      courseRevenue: 134000,
      certificationRevenue: 48000,
      otherRevenue: 19000
    },
    {
      month: 'Jan 2026',
      enrollmentRevenue: 356000,
      courseRevenue: 178000,
      certificationRevenue: 67000,
      otherRevenue: 28000
    }
  ];

  const forecastData = [
    {
      month: 'Fév 2026',
      enrollmentRevenue: 368000,
      courseRevenue: 185000,
      certificationRevenue: 71000,
      otherRevenue: 30000,
      isForecast: true
    },
    {
      month: 'Mars 2026',
      enrollmentRevenue: 382000,
      courseRevenue: 192000,
      certificationRevenue: 75000,
      otherRevenue: 32000,
      isForecast: true
    }
  ];

  const allData = [...revenueData, ...forecastData];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const isForecast = payload?.[0]?.payload?.isForecast;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            {label} {isForecast && '(Prévision)'}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <span style={{ color: entry?.color }}>{entry?.name}:</span>
              <span className="font-medium data-text">€{entry?.value?.toLocaleString('fr-FR')}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
              Flux de Revenus
            </h3>
            <p className="text-sm text-muted-foreground caption">
              Analyse temporelle avec prévisions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeRange('3months')}
            className={`
              px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-smooth
              ${timeRange === '3months' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            3 Mois
          </button>
          <button
            onClick={() => setTimeRange('6months')}
            className={`
              px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-smooth
              ${timeRange === '6months' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            6 Mois
          </button>
          <button
            onClick={() => setTimeRange('12months')}
            className={`
              px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-smooth
              ${timeRange === '12months' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            12 Mois
          </button>
        </div>
      </div>
      <div className="w-full h-64 md:h-80 lg:h-96" aria-label="Revenue Streams Area Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={allData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="certificationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="otherGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `€${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="enrollmentRevenue"
              name="Inscriptions"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#enrollmentGradient)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="courseRevenue"
              name="Cours"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#courseGradient)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="certificationRevenue"
              name="Certifications"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#certificationGradient)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="otherRevenue"
              name="Autres"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#otherGradient)"
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground caption">
          <Icon name="Info" size={14} />
          <span>Les deux derniers mois représentent des prévisions basées sur les tendances historiques</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueStreamChart;