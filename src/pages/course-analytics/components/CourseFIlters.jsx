import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CourseFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    instructor: 'all',
    term: 'current',
    status: 'all',
    department: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const instructorOptions = [
    { value: 'all', label: 'Tous les instructeurs' },
    { value: 'prof-martin', label: 'Prof. Martin Dubois' },
    { value: 'prof-laurent', label: 'Prof. Sophie Laurent' },
    { value: 'prof-bernard', label: 'Prof. Jean Bernard' },
    { value: 'prof-rousseau', label: 'Prof. Marie Rousseau' }
  ];

  const termOptions = [
    { value: 'current', label: 'Semestre actuel (Printemps 2026)' },
    { value: 'fall-2025', label: 'Automne 2025' },
    { value: 'spring-2025', label: 'Printemps 2025' },
    { value: 'fall-2024', label: 'Automne 2024' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'completed', label: 'Terminé' },
    { value: 'upcoming', label: 'À venir' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'Tous les départements' },
    { value: 'sciences', label: 'Sciences' },
    { value: 'humanities', label: 'Sciences humaines' },
    { value: 'engineering', label: 'Ingénierie' },
    { value: 'business', label: 'Commerce' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      instructor: 'all',
      term: 'current',
      status: 'all',
      department: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="SlidersHorizontal" size={20} color="var(--color-primary)" />
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Filtres de cours
          </h2>
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
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
        ${isExpanded ? 'block' : 'hidden lg:grid'}
      `}>
        <Select
          label="Instructeur"
          options={instructorOptions}
          value={filters?.instructor}
          onChange={(value) => handleFilterChange('instructor', value)}
        />

        <Select
          label="Période académique"
          options={termOptions}
          value={filters?.term}
          onChange={(value) => handleFilterChange('term', value)}
        />

        <Select
          label="Statut"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Département"
          options={departmentOptions}
          value={filters?.department}
          onChange={(value) => handleFilterChange('department', value)}
        />
      </div>
      <div className={`
        flex items-center justify-end gap-2 mt-4
        ${isExpanded ? 'flex' : 'hidden lg:flex'}
      `}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default CourseFilters;