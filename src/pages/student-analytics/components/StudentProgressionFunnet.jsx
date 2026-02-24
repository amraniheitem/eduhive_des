import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const StudentProgressionFunnel = () => {
  const [selectedStage, setSelectedStage] = useState(null);

  const progressionData = [
    {
      stage: 'Inscrits',
      students: 2450,
      percentage: 100,
      color: '#6366F1',
      description: 'Total des étudiants inscrits pour l\'année académique'
    },
    {
      stage: 'Actifs',
      students: 2280,
      percentage: 93.1,
      color: '#8B5CF6',
      description: 'Étudiants avec activité régulière sur la plateforme'
    },
    {
      stage: 'En progression',
      students: 2105,
      percentage: 85.9,
      color: '#10B981',
      description: 'Étudiants progressant selon le calendrier académique'
    },
    {
      stage: 'Examens réussis',
      students: 1960,
      percentage: 80.0,
      color: '#F59E0B',
      description: 'Étudiants ayant réussi les évaluations intermédiaires'
    },
    {
      stage: 'Diplômés',
      students: 1820,
      percentage: 74.3,
      color: '#059669',
      description: 'Étudiants ayant obtenu leur diplôme'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{data?.stage}</p>
          <p className="text-lg font-bold text-primary">{data?.students?.toLocaleString('fr-FR')} étudiants</p>
          <p className="text-xs text-muted-foreground mt-1">{data?.percentage}% du total</p>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs">{data?.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Progression des Étudiants
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground caption mt-1">
              Parcours académique de la cohorte 2025-2026
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedStage(null)}
          className="text-xs md:text-sm text-primary hover:text-primary/80 transition-smooth"
        >
          Réinitialiser
        </button>
      </div>
      <div className="w-full h-64 md:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={progressionData}
            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
            onClick={(data) => {
              if (data && data?.activePayload) {
                setSelectedStage(data?.activePayload?.[0]?.payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="stage"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              label={{ value: 'Nombre d\'étudiants', angle: -90, position: 'insideLeft', fill: 'var(--color-text-secondary)' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-muted)' }} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              dataKey="students"
              name="Étudiants"
              radius={[8, 8, 0, 0]}
              cursor="pointer"
            >
              {progressionData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={selectedStage?.stage === entry?.stage ? entry?.color : `${entry?.color}CC`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {selectedStage && (
        <div className="mt-4 md:mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} color="var(--color-primary)" />
            <div>
              <h4 className="text-sm md:text-base font-medium text-foreground mb-1">
                {selectedStage?.stage}
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                {selectedStage?.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-xs text-muted-foreground caption">Étudiants</p>
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {selectedStage?.students?.toLocaleString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground caption">Pourcentage</p>
                  <p className="text-lg md:text-xl font-bold text-primary">
                    {selectedStage?.percentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProgressionFunnel;