import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter from '../../components/ui/AlertNotificationCenter';
import Icon from '../../components/AppIcon';
import CourseMetricCard from './components/CourseMetricCard';
import EnrollmentCompletionChart from './components/EnrollementCompletionChart';
import ContentPerformanceRanking from './components/ContentPerformancesRanking';
import InstructorWorkloadChart from './components/InsctructorWorkloadChart';
import ContentEngagementHeatmap from './components/ContenEngagementHeatmap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SUBJECTS, GET_ACTIVE_TEACHERS } from '../../graphql/queries';
import { ASSIGN_TEACHER_MUTATION, CREATE_SUBJECT_MUTATION } from '../../graphql/mutations';
import CoursePerformanceTable from './components/CoursePerformanceTable';
import ExportMenu from './components/ExportMenu';

const CourseAnalytics = () => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // États pour le formulaire d'assignation
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // États pour le formulaire de création
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    department: '',
    price: '',
    teacher: ''
  });

  // GraphQL Queries
  const { data: subjectsData, refetch: refetchSubjects } = useQuery(GET_SUBJECTS);
  const { data: teachersData } = useQuery(GET_ACTIVE_TEACHERS);

  // GraphQL Mutations
  const [creating, setCreating] = useState(false);

  const [createSubject] = useMutation(CREATE_SUBJECT_MUTATION, {
    onError: (err) => {
      console.error('❌ ERREUR Création Matière :', err);
      alert('Erreur lors de la création: ' + err.message);
    }
  });

  const [assignTeacher, { loading: assigning }] = useMutation(ASSIGN_TEACHER_MUTATION, {
    onCompleted: () => {
      refetchSubjects();
      // Si c'était une assignation seule
      if (isAssignModalOpen) {
        setIsAssignModalOpen(false);
        setSelectedSubject('');
        setSelectedTeacher('');
        alert('Professeur assigné avec succès !');
      } else {
        // C'était une création + assignation
        setIsCreateModalOpen(false);
        setNewSubject({
          code: '',
          name: '',
          department: '',
          price: '',
          teacher: ''
        });
        alert('Matière créée et assignée avec succès !');
      }
    },
    onError: (err) => {
      // Même si l'assignation échoue, la matière est créée
      if (isCreateModalOpen) {
        setIsCreateModalOpen(false);
        alert("Matière créée, mais erreur lors de l'assignation: " + err.message);
      } else {
        alert("Erreur lors de l'assignation: " + err.message);
      }
    }
  });

  // Départements disponibles (pour la création)
  const departments = [
    "Informatique",
    "Mathématiques",
    "Sciences",
    "Langues",
    "Commerce",
    "Arts",
    "Sciences sociales",
    "Économie"
  ];

  // Handler pour assigner une matière
  const handleAssignSubject = (e) => {
    e.preventDefault();

    if (!selectedSubject || !selectedTeacher) {
      alert('Veuillez sélectionner une matière et un professeur');
      return;
    }

    assignTeacher({
      variables: {
        subjectId: selectedSubject,
        teacherId: selectedTeacher
      }
    });
  };

  // Handler pour créer une nouvelle matière
  const handleCreateSubject = async (e) => {
    e.preventDefault();

    // Validation de base (enseignant optionnel maintenant)
    if (!newSubject.name || !newSubject.department || !newSubject.price) {
      alert('Veuillez remplir au moins le nom, le département et le prix');
      return;
    }

    const name = newSubject.name;
    const description = `Matière de ${newSubject.department} - Code: ${newSubject.code || 'N/A'}`;
    const price = parseFloat(newSubject.price);
    const category = newSubject.department;
    const level = 'LYCEE';

    console.log("🚀 Lancement Mutation CreateSubject avec :", { name, description, price, category, level });

    setCreating(true);
    try {
      const { data } = await createSubject({
        variables: { name, description, price, category, level }
      });

      console.log("✅ Matière créée :", data);
      refetchSubjects();

      // Si un prof est sélectionné, on l'assigne
      if (newSubject.teacher && data?.createSubject?.id) {
        assignTeacher({
          variables: {
            subjectId: data.createSubject.id,
            teacherId: newSubject.teacher
          }
        });
      } else {
        setIsCreateModalOpen(false);
        setNewSubject({
          code: '',
          name: '',
          department: '',
          price: '',
          teacher: ''
        });
        alert('Matière créée avec succès !');
      }
    } catch (err) {
      console.error("❌ ERREUR Création Matière :", err);
      console.error("Détails GraphQL :", err.graphQLErrors);
      console.error("Détails Réseau :", err.networkError);
      alert("Erreur lors de la création: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const kpiMetrics = [
    {
      title: "Total Matières",
      value: "892",
      change: "+48",
      changeType: "positive",
      icon: "BookOpen",
      iconColor: "var(--color-primary)",
      description: "Matières disponibles"
    },
    {
      title: "Inscriptions totales",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      icon: "Users",
      iconColor: "var(--color-secondary)",
      description: "Élèves inscrits"
    },
    {
      title: "Revenus Matières",
      value: "52,840 pts",
      change: "+8,250",
      changeType: "positive",
      icon: "DollarSign",
      iconColor: "var(--color-success)",
      description: "Revenus générés"
    },
    {
      title: "Vidéos Totales",
      value: "2,340",
      change: "+156",
      changeType: "positive",
      icon: "Video",
      iconColor: "var(--color-accent)",
      description: "Contenus vidéo"
    },
    {
      title: "PDF Totaux",
      value: "1,890",
      change: "+98",
      changeType: "positive",
      icon: "FileText",
      iconColor: "var(--color-warning)",
      description: "Documents PDF"
    },
    {
      title: "Taux de complétion",
      value: "78.3%",
      change: "+5.2%",
      changeType: "positive",
      icon: "CheckCircle",
      iconColor: "var(--color-success)",
      description: "Taux moyen"
    },
    {
      title: "Note moyenne",
      value: "4.2/5",
      change: "+0.3",
      changeType: "positive",
      icon: "Star",
      iconColor: "var(--color-warning)",
      description: "Satisfaction globale"
    },
    {
      title: "Matières Actives",
      value: "856",
      change: "+42",
      changeType: "positive",
      icon: "Activity",
      iconColor: "var(--color-primary)",
      description: "Actuellement actives"
    }
  ];

  const enrollmentData = [
    { month: "Sep", enrollments: 420, completionRate: 72, engagementRate: 78 },
    { month: "Oct", enrollments: 385, completionRate: 75, engagementRate: 80 },
    { month: "Nov", enrollments: 410, completionRate: 73, engagementRate: 79 },
    { month: "Déc", enrollments: 395, completionRate: 76, engagementRate: 81 },
    { month: "Jan", enrollments: 445, completionRate: 78, engagementRate: 82 },
    { month: "Fév", enrollments: 425, completionRate: 77, engagementRate: 83 },
    { month: "Mar", enrollments: 467, completionRate: 79, engagementRate: 84 }
  ];

  const contentPerformance = [
    {
      id: 1,
      title: "Introduction à l'analyse de données",
      type: "video",
      engagement: 92,
      views: 2847,
      avgTime: "18m 32s"
    },
    {
      id: 2,
      title: "Guide de programmation Python",
      type: "pdf",
      engagement: 87,
      views: 2654,
      avgTime: "25m 15s"
    },
    {
      id: 3,
      title: "Quiz interactif - Statistiques",
      type: "quiz",
      engagement: 84,
      views: 2589,
      avgTime: "12m 45s"
    },
    {
      id: 4,
      title: "Projet final - Analyse de cas",
      type: "assignment",
      engagement: 78,
      views: 2401,
      avgTime: "45m 20s"
    },
    {
      id: 5,
      title: "Visualisation de données avancée",
      type: "video",
      engagement: 75,
      views: 2287,
      avgTime: "22m 10s"
    }
  ];

  const instructorWorkload = [
    { name: "Prof. Martin Dubois", value: 8, percentage: 28 },
    { name: "Prof. Sophie Laurent", value: 7, percentage: 24 },
    { name: "Prof. Jean Bernard", value: 6, percentage: 21 },
    { name: "Prof. Marie Rousseau", value: 5, percentage: 17 },
    { name: "Autres", value: 3, percentage: 10 }
  ];

  const heatmapData = [
    { hours: [45, 52, 68, 85, 78, 62] },
    { hours: [48, 55, 72, 88, 82, 65] },
    { hours: [42, 58, 75, 92, 85, 68] },
    { hours: [50, 62, 78, 90, 88, 72] },
    { hours: [46, 60, 80, 87, 84, 70] },
    { hours: [35, 42, 55, 68, 62, 48] },
    { hours: [28, 35, 45, 58, 52, 40] }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header, FilterBar et Notifications */}
      <div className="relative">
        <Header />
      </div>

      {/* Contenu principal */}
      <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-[1920px] mx-auto">
          {/* Titre + Boutons d'action */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Analytique des Matières
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Optimisation de l'efficacité des matières et analyse d'engagement du contenu
              </p>
            </div>

            {/* Boutons d'actions */}
            <div className="flex items-center gap-3">


              <ExportMenu
                students={[]}
                filteredStudents={null}
                title="Matières_Analytics"
              />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {kpiMetrics?.map((metric, index) => (
              <CourseMetricCard key={index} {...metric} />
            ))}
          </div>

          <CoursePerformanceTable />

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <EnrollmentCompletionChart data={enrollmentData} />
            </div>
            <div className="space-y-4 md:space-y-6">
              <ContentPerformanceRanking contentItems={contentPerformance} />
              <InstructorWorkloadChart data={instructorWorkload} />
            </div>
          </div>

          {/* Heatmap */}
          <div className="mb-6 md:mb-8">
            <ContentEngagementHeatmap data={heatmapData} />
          </div>

          {/* Tableau des matières */}
        </div>
      </main>

      {/* MODAL ASSIGNER MATIÈRE */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg border border-border w-[90%] max-w-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Link" size={20} color="var(--color-secondary)" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">
                    Assigner une Matière
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Attribuer une matière existante à un professeur
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignSubject} className="p-6 space-y-4">
              {/* Sélection de la matière */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Matière <span className="text-error">*</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  {subjectsData?.subjects?.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code || subject.name.substring(0, 3).toUpperCase()} - {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sélection du professeur */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Professeur <span className="text-error">*</span>
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                  required
                >
                  <option value="">Sélectionner un professeur</option>
                  {teachersData?.users?.map((user) => (
                    <option key={user.teacherProfile?.id} value={user.teacherProfile?.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-smooth flex items-center justify-center gap-2"
                >
                  <Icon name="Check" size={18} />
                  Assigner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CRÉER MATIÈRE */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg border border-border w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Plus" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">
                    Créer une Nouvelle Matière
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajouter une nouvelle matière et l'assigner à un professeur
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* Form - Scrollable */}
            <form onSubmit={handleCreateSubject} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Code de la matière */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Code <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    placeholder="Ex: CS-401"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                    required
                  />
                </div>

                {/* Département */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Département <span className="text-error">*</span>
                  </label>
                  <select
                    value={newSubject.department}
                    onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                    required
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nom de la matière */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom de la matière <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="Ex: Intelligence Artificielle Avancée"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prix (en points) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newSubject.price}
                    onChange={(e) => setNewSubject({ ...newSubject, price: e.target.value })}
                    placeholder="Ex: 50"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    1 point = 0.01€
                  </p>
                </div>

                {/* Professeur (Optionnel) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Professeur <span className="text-xs text-muted-foreground">(Optionnel)</span>
                  </label>
                  <select
                    value={newSubject.teacher}
                    onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                  >
                    <option value="">Sélectionner un professeur</option>
                    {teachersData?.users?.map((user) => (
                      <option key={user.teacherProfile?.id} value={user.teacherProfile?.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={18} color="var(--color-primary)" className="mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Répartition des revenus
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Le professeur recevra 70% des ventes et l'entreprise 30%. Les vidéos et PDF pourront être ajoutés après la création de la matière.
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2"
                >
                  <Icon name="Check" size={18} />
                  <Icon name="Check" size={18} />
                  {creating || assigning ? 'Traitement...' : 'Créer' + (newSubject.teacher ? ' et Assigner' : '')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAnalytics;