import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DepartmentPerformanceTable = ({ departments }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedDepartments = [...departments]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const getPerformanceColor = (value) => {
    if (value >= 85) return 'text-success';
    if (value >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Performance par département
        </h3>
        <p className="text-sm text-muted-foreground caption mt-1">
          Comparaison des indicateurs clés
        </p>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Département
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('students')}
                  className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth ml-auto"
                >
                  Étudiants
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('retention')}
                  className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth ml-auto"
                >
                  Rétention
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('satisfaction')}
                  className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth ml-auto"
                >
                  Satisfaction
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button
                  onClick={() => handleSort('revenue')}
                  className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth ml-auto"
                >
                  Revenus
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {sortedDepartments?.map((dept) => (
              <React.Fragment key={dept?.id}>
                <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                        <Icon name={dept?.icon} size={16} color="var(--color-primary)" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {dept?.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-foreground data-text">
                      {dept?.students?.toLocaleString('fr-FR')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium data-text ${getPerformanceColor(dept?.retention)}`}>
                      {dept?.retention}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-medium data-text ${getPerformanceColor(dept?.satisfaction)}`}>
                      {dept?.satisfaction}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-foreground data-text">
                      {dept?.revenue?.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setExpandedRow(expandedRow === dept?.id ? null : dept?.id)}
                      className="p-1 hover:bg-muted rounded transition-smooth"
                    >
                      <Icon 
                        name={expandedRow === dept?.id ? 'ChevronUp' : 'ChevronDown'} 
                        size={16} 
                      />
                    </button>
                  </td>
                </tr>
                {expandedRow === dept?.id && (
                  <tr className="bg-muted/30">
                    <td colSpan="6" className="py-4 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground caption mb-1">
                            Cours actifs
                          </p>
                          <p className="text-sm font-medium text-foreground data-text">
                            {dept?.details?.activeCourses}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground caption mb-1">
                            Enseignants
                          </p>
                          <p className="text-sm font-medium text-foreground data-text">
                            {dept?.details?.teachers}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground caption mb-1">
                            Taux de réussite
                          </p>
                          <p className="text-sm font-medium text-foreground data-text">
                            {dept?.details?.successRate}%
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentPerformanceTable;