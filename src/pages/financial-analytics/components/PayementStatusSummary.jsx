import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStatusSummary = () => {
  const paymentStats = [
    {
      status: 'Payé',
      count: 3847,
      amount: 2456000,
      percentage: 78,
      icon: 'CheckCircle',
      color: 'var(--color-success)',
      bgColor: 'bg-success/10'
    },
    {
      status: 'En attente',
      count: 542,
      amount: 346000,
      percentage: 11,
      icon: 'Clock',
      color: 'var(--color-warning)',
      bgColor: 'bg-warning/10'
    },
    {
      status: 'En retard',
      count: 234,
      amount: 149000,
      percentage: 7,
      icon: 'AlertCircle',
      color: 'var(--color-error)',
      bgColor: 'bg-error/10'
    },
    {
      status: 'Échelonné',
      count: 189,
      amount: 121000,
      percentage: 4,
      icon: 'Calendar',
      color: 'var(--color-primary)',
      bgColor: 'bg-primary/10'
    }
  ];

  const paymentMethods = [
    { method: 'Carte bancaire', percentage: 62, amount: 1523000 },
    { method: 'Virement', percentage: 24, amount: 589000 },
    { method: 'Chèque', percentage: 9, amount: 221000 },
    { method: 'Espèces', percentage: 5, amount: 123000 }
  ];

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="CreditCard" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Statut des Paiements
          </h3>
          <p className="text-sm text-muted-foreground caption">
            Vue d'ensemble des transactions
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {paymentStats?.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat?.bgColor}`}>
                  <Icon name={stat?.icon} size={16} color={stat?.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {stat?.status}
                  </p>
                  <p className="text-xs text-muted-foreground caption">
                    {stat?.count} transactions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground data-text">
                  €{stat?.amount?.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-muted-foreground caption">
                  {stat?.percentage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: `${stat?.percentage}%`,
                  backgroundColor: stat?.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">
          Méthodes de Paiement
        </h4>
        <div className="space-y-3">
          {paymentMethods?.map((method, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">
                  {method?.method}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground data-text">
                  €{method?.amount?.toLocaleString('fr-FR')}
                </span>
                <span className="text-xs text-muted-foreground caption min-w-[3rem] text-right">
                  {method?.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
            <span className="text-sm font-medium text-foreground">
              Paiements en retard
            </span>
          </div>
          <span className="text-sm font-bold text-warning data-text">
            €149 000
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusSummary;