import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FinancialBreakdownTable = () => {
  const [selectedView, setSelectedView] = useState('department');
  const [sortConfig, setSortConfig] = useState({ key: 'revenue', direction: 'desc' });

  const departmentData = [
    {
      id: 1,
      name: 'Ingénierie',
      revenue: 920000,
      costs: 789000,
      profit: 131000,
      margin: 14.2,
      enrollments: 612,
      courses: 24
    },
    {
      id: 2,
      name: 'Sciences',
      revenue: 850000,
      costs: 723000,
      profit: 127000,
      margin: 14.9,
      enrollments: 567,
      courses: 28
    },
    {
      id: 3,
      name: 'Commerce',
      revenue: 680000,
      costs: 578000,
      profit: 102000,
      margin: 15.0,
      enrollments: 453,
      courses: 18
    },
    {
      id: 4,
      name: 'Arts',
      revenue: 550000,
      costs: 467000,
      profit: 83000,
      margin: 15.1,
      enrollments: 367,
      courses: 22
    },
    {
      id: 5,
      name: 'Sciences humaines',
      revenue: 500000,
      costs: 290000,
      profit: 210000,
      margin: 42.0,
      enrollments: 334,
      courses: 16
    }
  ];

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedData = [...departmentData]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ChevronsUpDown" size={14} color="var(--color-muted-foreground)" />;
    }
    return (
      <Icon 
        name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
        size={14} 
        color="var(--color-primary)" 
      />
    );
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Table" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
              Répartition Financière Détaillée
            </h3>
            <p className="text-sm text-muted-foreground caption">
              Analyse par département avec drill-down
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedView('department')}
            className={`
              px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-smooth
              ${selectedView === 'department' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            Département
          </button>
          <button
            onClick={() => setSelectedView('course')}
            className={`
              px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-smooth
              ${selectedView === 'course' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            Cours
          </button>
          <button
            onClick={() => setSelectedView('payment')}
            className={`
              px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-smooth
              ${selectedView === 'payment' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            Paiement
          </button>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground caption">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 hover:text-foreground transition-smooth"
                >
                  Département
                  <SortIcon columnKey="name" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground caption">
                <button
                  onClick={() => handleSort('revenue')}
                  className="flex items-center justify-end gap-2 ml-auto hover:text-foreground transition-smooth"
                >
                  Revenus
                  <SortIcon columnKey="revenue" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground caption">
                <button
                  onClick={() => handleSort('costs')}
                  className="flex items-center justify-end gap-2 ml-auto hover:text-foreground transition-smooth"
                >
                  Coûts
                  <SortIcon columnKey="costs" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground caption">
                <button
                  onClick={() => handleSort('profit')}
                  className="flex items-center justify-end gap-2 ml-auto hover:text-foreground transition-smooth"
                >
                  Profit
                  <SortIcon columnKey="profit" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground caption">
                <button
                  onClick={() => handleSort('margin')}
                  className="flex items-center justify-end gap-2 ml-auto hover:text-foreground transition-smooth"
                >
                  Marge
                  <SortIcon columnKey="margin" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground caption">
                <button
                  onClick={() => handleSort('enrollments')}
                  className="flex items-center justify-end gap-2 ml-auto hover:text-foreground transition-smooth"
                >
                  Inscriptions
                  <SortIcon columnKey="enrollments" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground caption">
                Cours
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground caption">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((dept) => (
              <tr 
                key={dept?.id}
                className="border-b border-border hover:bg-muted transition-smooth"
              >
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-foreground">
                    {dept?.name}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-semibold text-foreground data-text">
                    €{dept?.revenue?.toLocaleString('fr-FR')}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-muted-foreground data-text">
                    €{dept?.costs?.toLocaleString('fr-FR')}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-semibold text-success data-text">
                    €{dept?.profit?.toLocaleString('fr-FR')}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`
                    text-sm font-medium data-text
                    ${dept?.margin >= 20 ? 'text-success' : 
                      dept?.margin >= 15 ? 'text-warning': 'text-error'}
                  `}>
                    {dept?.margin}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-muted-foreground data-text">
                    {dept?.enrollments}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-muted-foreground data-text">
                    {dept?.courses}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      className="p-1.5 hover:bg-primary/10 rounded-md transition-smooth"
                      title="Voir détails"
                    >
                      <Icon name="Eye" size={16} color="var(--color-primary)" />
                    </button>
                    <button 
                      className="p-1.5 hover:bg-primary/10 rounded-md transition-smooth"
                      title="Exporter"
                    >
                      <Icon name="Download" size={16} color="var(--color-primary)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/50">
              <td className="py-3 px-4 text-sm font-semibold text-foreground">
                Total
              </td>
              <td className="py-3 px-4 text-right text-sm font-bold text-foreground data-text">
                €{sortedData?.reduce((sum, d) => sum + d?.revenue, 0)?.toLocaleString('fr-FR')}
              </td>
              <td className="py-3 px-4 text-right text-sm font-bold text-foreground data-text">
                €{sortedData?.reduce((sum, d) => sum + d?.costs, 0)?.toLocaleString('fr-FR')}
              </td>
              <td className="py-3 px-4 text-right text-sm font-bold text-success data-text">
                €{sortedData?.reduce((sum, d) => sum + d?.profit, 0)?.toLocaleString('fr-FR')}
              </td>
              <td className="py-3 px-4 text-right text-sm font-bold text-foreground data-text">
                {((sortedData?.reduce((sum, d) => sum + d?.profit, 0) / sortedData?.reduce((sum, d) => sum + d?.revenue, 0)) * 100)?.toFixed(1)}%
              </td>
              <td className="py-3 px-4 text-right text-sm font-bold text-foreground data-text">
                {sortedData?.reduce((sum, d) => sum + d?.enrollments, 0)}
              </td>
              <td className="py-3 px-4 text-right text-sm font-bold text-foreground data-text">
                {sortedData?.reduce((sum, d) => sum + d?.courses, 0)}
              </td>
              <td className="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default FinancialBreakdownTable;