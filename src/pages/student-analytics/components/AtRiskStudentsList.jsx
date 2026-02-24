import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AtRiskStudentsList = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const atRiskStudents = [
  {
    id: 1,
    name: 'Sophie Martin',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19d0e83b5-1763298687249.png",
    avatarAlt: 'Photo de profil de Sophie Martin, étudiante avec cheveux bruns courts et sourire chaleureux',
    program: 'Licence Informatique',
    riskLevel: 'high',
    riskScore: 85,
    issues: ['Absence fréquente', 'Notes en baisse', 'Pas de connexion depuis 5 jours'],
    lastActivity: '2026-01-13',
    gpa: 2.1,
    attendance: 65
  },
  {
    id: 2,
    name: 'Lucas Dubois',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16e9d8251-1763294843980.png",
    avatarAlt: 'Photo de profil de Lucas Dubois, étudiant avec cheveux blonds et lunettes noires',
    program: 'Master Gestion',
    riskLevel: 'high',
    riskScore: 78,
    issues: ['Échec aux examens', 'Engagement faible', 'Retard dans les devoirs'],
    lastActivity: '2026-01-16',
    gpa: 2.3,
    attendance: 72
  },
  {
    id: 3,
    name: 'Emma Leroy',
    avatar: "https://images.unsplash.com/photo-1545506475-1175e38cd8b7",
    avatarAlt: 'Photo de profil d\'Emma Leroy, étudiante avec cheveux roux longs et expression sérieuse',
    program: 'Licence Sciences',
    riskLevel: 'medium',
    riskScore: 62,
    issues: ['Participation limitée', 'Retard dans les projets'],
    lastActivity: '2026-01-17',
    gpa: 2.8,
    attendance: 80
  },
  {
    id: 4,
    name: 'Thomas Bernard',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16e9d8251-1763294843980.png",
    avatarAlt: 'Photo de profil de Thomas Bernard, étudiant avec cheveux noirs courts et barbe légère',
    program: 'Master Ingénierie',
    riskLevel: 'medium',
    riskScore: 58,
    issues: ['Notes moyennes', 'Engagement variable'],
    lastActivity: '2026-01-18',
    gpa: 2.9,
    attendance: 85
  },
  {
    id: 5,
    name: 'Chloé Petit',
    avatar: "https://images.unsplash.com/photo-1714207427861-9b411beca97e",
    avatarAlt: 'Photo de profil de Chloé Petit, étudiante avec cheveux châtains mi-longs et sourire confiant',
    program: 'Licence Commerce',
    riskLevel: 'low',
    riskScore: 45,
    issues: ['Quelques absences'],
    lastActivity: '2026-01-18',
    gpa: 3.2,
    attendance: 88
  }];


  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level) {
      case 'high':
        return 'bg-error/10 border-error/20';
      case 'medium':
        return 'bg-warning/10 border-warning/20';
      case 'low':
        return 'bg-success/10 border-success/20';
      default:
        return 'bg-muted/10 border-border';
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'high':
        return 'Risque élevé';
      case 'medium':
        return 'Risque moyen';
      case 'low':
        return 'Risque faible';
      default:
        return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
            <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
              Étudiants à Risque
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground caption mt-1">
              {atRiskStudents?.length} étudiants nécessitent une intervention
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {atRiskStudents?.map((student) =>
        <div
          key={student?.id}
          onClick={() => setSelectedStudent(student)}
          className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-smooth hover-lift press-scale ${getRiskBgColor(student?.riskLevel)}`}>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Image
                src={student?.avatar}
                alt={student?.avatarAlt}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />

              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm md:text-base font-medium text-foreground">
                      {student?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground caption mt-1">
                      {student?.program}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(student?.riskLevel)}`}>
                    {getRiskLabel(student?.riskLevel)}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <Icon name="TrendingDown" size={14} color="var(--color-muted-foreground)" />
                    <span className="text-xs text-muted-foreground caption">
                      GPA: {student?.gpa}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} color="var(--color-muted-foreground)" />
                    <span className="text-xs text-muted-foreground caption">
                      {student?.attendance}% présence
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {student?.issues?.slice(0, 2)?.map((issue, index) =>
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-background rounded caption">

                      {issue}
                    </span>
                )}
                  {student?.issues?.length > 2 &&
                <span className="text-xs px-2 py-0.5 bg-background rounded caption">
                      +{student?.issues?.length - 2}
                    </span>
                }
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground caption">
                    Dernière activité: {formatDate(student?.lastActivity)}
                  </span>
                  <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedStudent &&
      <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 animate-fade-in">
          <div
          className="absolute inset-0 bg-background/80"
          onClick={() => setSelectedStudent(null)} />

          <div className="relative bg-card rounded-lg shadow-xl border border-border max-w-md w-full p-6 animate-slide-in-bottom">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image
                src={selectedStudent?.avatar}
                alt={selectedStudent?.avatarAlt}
                className="w-12 h-12 rounded-full object-cover" />

                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground">
                    {selectedStudent?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground caption">
                    {selectedStudent?.program}
                  </p>
                </div>
              </div>
              <button
              onClick={() => setSelectedStudent(null)}
              className="text-muted-foreground hover:text-foreground transition-smooth">

                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${getRiskBgColor(selectedStudent?.riskLevel)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Score de risque</span>
                  <span className={`text-lg font-bold ${getRiskColor(selectedStudent?.riskLevel)}`}>
                    {selectedStudent?.riskScore}%
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                  className={`h-2 rounded-full ${selectedStudent?.riskLevel === 'high' ? 'bg-error' : selectedStudent?.riskLevel === 'medium' ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${selectedStudent?.riskScore}%` }} />

                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Problèmes identifiés</h4>
                <ul className="space-y-2">
                  {selectedStudent?.issues?.map((issue, index) =>
                <li key={index} className="flex items-start gap-2">
                      <Icon name="AlertCircle" size={16} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{issue}</span>
                    </li>
                )}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground caption mb-1">GPA actuel</p>
                  <p className="text-xl font-bold text-foreground">{selectedStudent?.gpa}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground caption mb-1">Présence</p>
                  <p className="text-xl font-bold text-foreground">{selectedStudent?.attendance}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth press-scale text-sm font-medium">
                  Contacter l'étudiant
                </button>
                <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth press-scale text-sm font-medium">
                  Voir le profil
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

};

export default AtRiskStudentsList;