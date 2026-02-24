import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import { useFilters } from './GlobalFilterBar';

const ExportToolbar = ({ screenType, data = {} }) => {
  const { filters } = useFilters();
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const exportFormats = [
    { value: 'pdf', label: 'PDF', icon: 'FileText' },
    { value: 'excel', label: 'Excel', icon: 'FileSpreadsheet' },
    { value: 'csv', label: 'CSV', icon: 'Table' },
    { value: 'json', label: 'JSON', icon: 'Code' }
  ];

  const getScreenTitle = () => {
    const titles = {
      'main-analytics': 'Tableau de Bord Principal',
      'student-analytics': 'Analytique Étudiants',
      'course-analytics': 'Analytique Cours',
      'teacher-performance': 'Performance Enseignants',
      'financial-analytics': 'Analytique Financière'
    };
    return titles?.[screenType] || 'Rapport';
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowOptions(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const exportData = {
        title: getScreenTitle(),
        timestamp: new Date()?.toISOString(),
        filters: filters,
        data: data,
        format: format
      };

      console.log('Exporting data:', exportData);

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${screenType}-${Date.now()}.${format}`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="default"
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        loading={isExporting}
        iconName="Download"
        iconPosition="left"
        className="hidden md:flex"
      >
        Exporter
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className="md:hidden"
      >
        <Icon name="Download" size={18} />
      </Button>
      {showOptions && (
        <>
          <div
            className="fixed inset-0 z-[49]"
            onClick={() => setShowOptions(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-[50] w-48 bg-popover rounded-lg shadow-lg border border-border animate-fade-in">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground caption">
                Format d'export
              </div>
              {exportFormats?.map((format) => (
                <button
                  key={format?.value}
                  onClick={() => handleExport(format?.value)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground rounded-md hover:bg-muted transition-smooth"
                >
                  <Icon name={format?.icon} size={16} />
                  <span>{format?.label}</span>
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={() => handleExport('all')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-primary rounded-md hover:bg-primary/10 transition-smooth"
              >
                <Icon name="Package" size={16} />
                <span>Tous les formats</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportToolbar;