import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ExportMenu = ({ students, filteredStudents, title = "Étudiants" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Fonction pour exporter en CSV
  const exportToCSV = (data) => {
    setIsExporting(true);
    setExportProgress(0);

    // Simuler la progression
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      try {
        // Préparer les données
        const csvData = data.map(student => ({
          ID: student.id,
          Nom: student.name,
          Email: student.email,
          Téléphone: student.phone,
          'Nom Parent': student.parentName,
          Programme: student.program,
          GPA: student.gpa,
          'Présence (%)': student.attendance,
          'Engagement (%)': student.engagement,
          'Devoirs Complétés': student.assignmentsCompleted,
          'Total Devoirs': student.assignments,
          'Dernière Activité': student.lastActive,
          Statut: student.status,
          Performance: student.performanceStatus,
          'Crédits Disponibles': student.credits,
          'Total Dépensé': student.totalSpent,
          'Questions IA': student.aiQuestionsAsked,
          'Points IA Dépensés': student.aiPointsSpent
        }));

        // Créer le contenu CSV
        const headers = Object.keys(csvData[0]).join(',');
        const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        // Créer le blob et télécharger
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Succès
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
          setIsOpen(false);
          alert(`✅ Export CSV réussi ! ${data.length} étudiant(s) exporté(s).`);
        }, 500);
      } catch (error) {
        console.error('Erreur export CSV:', error);
        setIsExporting(false);
        setExportProgress(0);
        alert('❌ Erreur lors de l\'export CSV');
      }
    }, 1000);
  };

  // Fonction pour exporter en Excel (simulé avec CSV amélioré)
  const exportToExcel = (data) => {
    setIsExporting(true);
    setExportProgress(0);

    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      try {
        // Pour un vrai Excel, il faudrait utiliser une bibliothèque comme xlsx
        // Ici on simule avec un CSV
        const csvData = data.map(student => ({
          ID: student.id,
          Nom: student.name,
          Email: student.email,
          Téléphone: student.phone,
          'Nom Parent': student.parentName,
          Programme: student.program,
          GPA: student.gpa,
          'Présence (%)': student.attendance,
          'Engagement (%)': student.engagement,
          'Devoirs Complétés': student.assignmentsCompleted,
          'Total Devoirs': student.assignments,
          'Dernière Activité': student.lastActive,
          Statut: student.status,
          Performance: student.performanceStatus,
          'Crédits Disponibles': student.credits,
          'Total Dépensé': student.totalSpent,
          'Matières Achetées': student.subjectsPurchased.join('; '),
          'Questions IA': student.aiQuestionsAsked,
          'Points IA Dépensés': student.aiPointsSpent
        }));

        const headers = Object.keys(csvData[0]).join(',');
        const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title}_${new Date().toISOString().split('T')[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
          setIsOpen(false);
          alert(`✅ Export Excel réussi ! ${data.length} étudiant(s) exporté(s).`);
        }, 500);
      } catch (error) {
        console.error('Erreur export Excel:', error);
        setIsExporting(false);
        setExportProgress(0);
        alert('❌ Erreur lors de l\'export Excel');
      }
    }, 1000);
  };

  // Fonction pour exporter en PDF (simulé)
  const exportToPDF = (data) => {
    setIsExporting(true);
    setExportProgress(0);

    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      // Pour un vrai PDF, il faudrait utiliser jsPDF ou pdfmake
      alert(`📄 Génération du PDF avec ${data.length} étudiant(s)...\n\nNote: Pour une vraie implémentation, utilisez jsPDF ou pdfmake.`);
      setIsExporting(false);
      setExportProgress(0);
      setIsOpen(false);
    }, 1500);
  };

  const handleExport = (format) => {
    const dataToExport = filteredStudents || students;
    
    if (dataToExport.length === 0) {
      alert('⚠️ Aucune donnée à exporter');
      return;
    }

    switch (format) {
      case 'csv':
        exportToCSV(dataToExport);
        break;
      case 'excel':
        exportToExcel(dataToExport);
        break;
      case 'pdf':
        exportToPDF(dataToExport);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      {/* Bouton Export */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="Download" size={16} />
        Exporter
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isExporting && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">Format d'export</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredStudents ? `${filteredStudents.length} étudiant(s) filtré(s)` : `${students.length} étudiant(s) au total`}
            </p>
          </div>
          
          <div className="p-2">
            {/* Option CSV */}
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-smooth text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
                <Icon name="FileText" size={20} color="var(--color-success)" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">CSV</p>
                <p className="text-xs text-muted-foreground">Compatible Excel, Google Sheets</p>
              </div>
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
            </button>

            {/* Option Excel */}
            <button
              onClick={() => handleExport('excel')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-smooth text-left mt-1"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="FileSpreadsheet" size={20} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Excel</p>
                <p className="text-xs text-muted-foreground">Format .xls avec formatage</p>
              </div>
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
            </button>

            {/* Option PDF */}
            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-smooth text-left mt-1"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
                <Icon name="FileText" size={20} color="var(--color-error)" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">PDF</p>
                <p className="text-xs text-muted-foreground">Document imprimable</p>
              </div>
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
            </button>
          </div>

          <div className="p-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              💡 L'export inclut toutes les données visibles après filtrage
            </p>
          </div>
        </div>
      )}

      {/* Barre de progression pendant l'export */}
      {isExporting && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} color="var(--color-primary)" />
            </div>
            <p className="text-sm font-medium text-foreground">Export en cours...</p>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {exportProgress}%
          </p>
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {isOpen && !isExporting && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ExportMenu;