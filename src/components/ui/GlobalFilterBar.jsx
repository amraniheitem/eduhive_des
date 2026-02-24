import React, { useState, createContext, useContext, useEffect } from 'react';
import Select from './Select';
import Button from './Button';
import Icon from '../AppIcon';

const FilterContext = createContext();

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(() => {
    const savedFilters = sessionStorage.getItem('eduHiveFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
      academicPeriod: '2025-2026',
      department: 'all',
      dateRange: 'current-semester'
    };
  });

  useEffect(() => {
    sessionStorage.setItem('eduHiveFilters', JSON.stringify(filters));
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      academicPeriod: '2025-2026',
      department: 'all',
      dateRange: 'current-semester'
    };
    setFilters(defaultFilters);
    sessionStorage.setItem('eduHiveFilters', JSON.stringify(defaultFilters));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

const GlobalFilterBar = () => {
  const { filters, updateFilter, resetFilters } = useFilters();
  const [isExpanded, setIsExpanded] = useState(false);

  const academicPeriodOptions = [
    { value: '2025-2026', label: 'Année 2025-2026' },
    { value: '2024-2025', label: 'Année 2024-2025' },
    { value: '2023-2024', label: 'Année 2023-2024' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'Tous les départements' },
    { value: 'sciences', label: 'Sciences' },
    { value: 'humanities', label: 'Sciences humaines' },
    { value: 'engineering', label: 'Ingénierie' },
    { value: 'business', label: 'Commerce' },
    { value: 'arts', label: 'Arts' }
  ];

  const dateRangeOptions = [
    { value: 'current-semester', label: 'Semestre actuel' },
    { value: 'last-semester', label: 'Dernier semestre' },
    { value: 'current-year', label: 'Année en cours' },
    { value: 'last-year', label: 'Année dernière' },
    { value: 'custom', label: 'Personnalisé' }
  ];

  return (
    // Retiré: fixed top-16 left-0 right-0 z-[999]
    <div className="bg-card border-b border-border shadow-sm">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={20} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground font-heading">
              Filtres globaux
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            {isExpanded ? 'Masquer' : 'Afficher'}
          </Button>
        </div>

        <div className={`
          grid grid-cols-1 md:grid-cols-3 gap-4 mt-4
          ${isExpanded ? 'block' : 'hidden lg:grid'}
        `}>
          <Select
            label="Période académique"
            options={academicPeriodOptions}
            value={filters?.academicPeriod}
            onChange={(value) => updateFilter('academicPeriod', value)}
          />

          <Select
            label="Département"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => updateFilter('department', value)}
          />

          <Select
            label="Plage de dates"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => updateFilter('dateRange', value)}
          />
        </div>

        <div className={`
          flex items-center justify-end gap-2 mt-4
          ${isExpanded ? 'flex' : 'hidden lg:flex'}
        `}>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalFilterBar;