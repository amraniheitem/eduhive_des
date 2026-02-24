import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import GlobalFilterBar, { FilterProvider } from '../../components/ui/GlobalFilterBar';
import AlertNotificationCenter, { NotificationProvider } from '../../components/ui/AlertNotificationCenter';
import ExportToolbar from '../../components/ui/ExportToolbar';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import PerformanceMetricCard from './components/PerformanceMetricCard';
import TeacherScatterPlot from './components/TeacherScatterPlot';
import InstructorRankingList from './components/InstructorRankingList';
import WorkloadDistributionChart from './components/WorkloadDistributionChart';
import TeacherPerformanceTable from './components/InstructorDetailTable';
import { useQuery, useMutation } from '@apollo/client';
import { GET_INACTIVE_TEACHERS } from '../../graphql/queries';
import { TOGGLE_USER_STATUS_MUTATION, UPDATE_USER_MUTATION } from '../../graphql/mutations';

const TeacherPerformance = () => {
  const [employmentStatus, setEmploymentStatus] = useState('all');
  const [performanceRange, setPerformanceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // État pour le modal des profils en attente
  const [isPendingProfilesModalOpen, setIsPendingProfilesModalOpen] = useState(false);

  // État pour le modal d'édition
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    status: ''
  });

  // GraphQL Queries & Mutations
  const { data: teachersData, refetch } = useQuery(GET_INACTIVE_TEACHERS);
  const [toggleUserStatus] = useMutation(TOGGLE_USER_STATUS_MUTATION, {
    onCompleted: () => {
      refetch();
      alert('✅ Statut de l\'enseignant mis à jour avec succès !');
    },
    onError: (err) => {
      alert("Erreur lors de l'activation : " + err.message);
    }
  });

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsEditModalOpen(false);
      setEditingTeacher(null);
      alert('✅ Profil mis à jour avec succès !');
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      const specificError = err.graphQLErrors?.[0]?.message ||
        err.networkError?.result?.errors?.[0]?.message ||
        err.message;
      alert("Erreur lors de la mise à jour : " + specificError);
    }
  });

  // Les données viennent déjà filtrées par la query GET_INACTIVE_TEACHERS
  const pendingTeachers = teachersData?.users || [];

  // Handler pour activer un enseignant
  const handleActivateTeacher = (teacher) => {
    if (window.confirm(`Voulez-vous vraiment activer le profil de ${teacher.firstName} ${teacher.lastName} ?`)) {
      toggleUserStatus({
        variables: {
          userId: teacher.id
        }
      });
    }
  };

  // Handler pour ouvrir le modal d'édition
  const handleEditLimit = (teacher) => {
    setEditingTeacher(teacher);
    setEditFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      phone: teacher.phone || '',
      status: teacher.status
    });
    setIsEditModalOpen(true);
  };

  // Handler pour soumettre la modification
  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingTeacher) return;

    // Basic cleaning/validation
    const cleanPhone = editFormData.phone ? editFormData.phone.replace(/\s+/g, '') : '';

    const variables = {
      id: editingTeacher.id,
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      phone: cleanPhone || undefined // Send undefined if empty to avoid empty string validation issues
    };

    console.log("Submitting Update User Mutation:", variables);

    // Call update mutation for details
    updateUser({
      variables
    });

    // Check if status changed and call toggle if needed
    // Note: status is either 'ACTIVE' or 'INACTIVE'
    if (editFormData.status && editingTeacher.status && editFormData.status !== editingTeacher.status) {
      console.log("Status changed from", editingTeacher.status, "to", editFormData.status, "- Calling toggleUserStatus");
      toggleUserStatus({
        variables: {
          userId: editingTeacher.id
        }
      });
    }
  };

  const performanceMetrics = [
    {
      title: "Total Enseignants",
      value: "247",
      trend: "up",
      trendValue: "+12",
      icon: "Users",
      iconColor: "var(--color-primary)",
      description: "Actifs ce semestre"
    },
    {
      title: "Note Moyenne",
      value: "4.3",
      trend: "up",
      trendValue: "+0.2",
      icon: "Star",
      iconColor: "var(--color-warning)",
      description: "Sur 5.0"
    },
    {
      title: "Charge Moyenne",
      value: "3.8",
      trend: "down",
      trendValue: "-0.3",
      icon: "BookOpen",
      iconColor: "var(--color-secondary)",
      description: "Cours par enseignant"
    },
    {
      title: "Engagement Étudiant",
      value: "87%",
      trend: "up",
      trendValue: "+5%",
      icon: "Activity",
      iconColor: "var(--color-success)",
      description: "Taux de participation"
    },
    {
      title: "Formation Continue",
      value: "42h",
      trend: "up",
      trendValue: "+8h",
      icon: "GraduationCap",
      iconColor: "var(--color-accent)",
      description: "Moyenne annuelle"
    },
    {
      title: "Taux de Rétention",
      value: "94%",
      trend: "up",
      trendValue: "+2%",
      icon: "TrendingUp",
      iconColor: "var(--color-success)",
      description: "Enseignants actifs"
    }
  ];

  const scatterPlotData = [
    { name: "Dr. Sophie Martin", workload: 2, rating: 4.8, students: 180 },
    { name: "Prof. Jean Dubois", workload: 4, rating: 4.6, students: 240 },
    { name: "Dr. Marie Laurent", workload: 3, rating: 4.7, students: 210 },
    { name: "Prof. Pierre Bernard", workload: 5, rating: 4.2, students: 320 },
    { name: "Dr. Claire Moreau", workload: 3, rating: 4.5, students: 195 },
    { name: "Prof. Luc Petit", workload: 6, rating: 3.9, students: 380 },
    { name: "Dr. Anne Roux", workload: 2, rating: 4.9, students: 150 },
    { name: "Prof. Marc Simon", workload: 4, rating: 4.4, students: 260 },
    { name: "Dr. Julie Michel", workload: 3, rating: 4.6, students: 205 },
    { name: "Prof. Thomas Leroy", workload: 5, rating: 4.1, students: 310 },
    { name: "Dr. Isabelle Garnier", workload: 2, rating: 4.7, students: 165 },
    { name: "Prof. Nicolas Blanc", workload: 4, rating: 4.3, students: 245 },
    { name: "Dr. Émilie Rousseau", workload: 3, rating: 4.8, students: 190 },
    { name: "Prof. François Girard", workload: 6, rating: 4.0, students: 360 },
    { name: "Dr. Céline Bonnet", workload: 2, rating: 4.6, students: 170 }
  ];

  const instructorRankings = [
    {
      id: 1,
      name: "Dr. Anne Roux",
      department: "Mathématiques",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1479bf0bf-1763297239550.png",
      avatarAlt: "Photo professionnelle d'une femme aux cheveux bruns courts portant un blazer marine et une chemise blanche",
      rating: 4.9,
      engagement: 95,
      completion: 96
    },
    {
      id: 2,
      name: "Dr. Sophie Martin",
      department: "Physique",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1af0263ad-1763293958642.png",
      avatarAlt: "Photo professionnelle d'une femme blonde en costume noir élégant",
      rating: 4.8,
      engagement: 93,
      completion: 94
    },
    {
      id: 3,
      name: "Dr. Émilie Rousseau",
      department: "Chimie",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1076a9ac3-1763295560026.png",
      avatarAlt: "Photo professionnelle d'une femme rousse portant un blazer bordeaux",
      rating: 4.8,
      engagement: 92,
      completion: 95
    },
    {
      id: 4,
      name: "Dr. Marie Laurent",
      department: "Biologie",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13c3b2153-1763298177110.png",
      avatarAlt: "Photo professionnelle d'une femme aux cheveux foncés en costume gris professionnel",
      rating: 4.7,
      engagement: 91,
      completion: 93
    },
    {
      id: 5,
      name: "Dr. Isabelle Garnier",
      department: "Informatique",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1194a8e94-1763301813569.png",
      avatarAlt: "Photo professionnelle d'une femme aux cheveux bouclés portant un blazer bleu moderne",
      rating: 4.7,
      engagement: 90,
      completion: 92
    },
    {
      id: 6,
      name: "Prof. Jean Dubois",
      department: "Histoire",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_12738108c-1763292578912.png",
      avatarAlt: "Photo professionnelle d'un homme aux cheveux gris portant un costume marine classique",
      rating: 4.6,
      engagement: 89,
      completion: 91
    }
  ];

  const workloadDistribution = [
    { range: "1-2 cours", count: 45 },
    { range: "3-4 cours", count: 98 },
    { range: "5-6 cours", count: 76 },
    { range: "7-8 cours", count: 22 },
    { range: "9+ cours", count: 6 }
  ];

  const employmentOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'full-time', label: 'Temps plein' },
    { value: 'part-time', label: 'Temps partiel' },
    { value: 'contract', label: 'Contractuel' },
    { value: 'visiting', label: 'Visiteur' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'Toutes les notes' },
    { value: 'excellent', label: 'Excellence (4.5-5.0)' },
    { value: 'good', label: 'Bon (4.0-4.4)' },
    { value: 'average', label: 'Moyen (3.5-3.9)' },
    { value: 'needs-improvement', label: 'À améliorer (<3.5)' }
  ];

  return (
    <FilterProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-background">
          <Header />

          <main className="pt-32 md:pt-36 lg:pt-40 pb-8 px-4 lg:px-6">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                    Performance des Enseignants
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Analyse de l'efficacité pédagogique et distribution de la charge
                  </p>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPendingProfilesModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center gap-2"
                  >
                    <Icon name="UserPlus" size={18} />
                    Créer un Profil Enseignant
                    {pendingTeachers.length > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {pendingTeachers.length}
                      </span>
                    )}
                  </button>
                  <ExportToolbar screenType="teacher-performance" data={{ metrics: performanceMetrics }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Select
                  label="Statut d'emploi"
                  options={employmentOptions}
                  value={employmentStatus}
                  onChange={setEmploymentStatus}
                />

                <Select
                  label="Plage de performance"
                  options={performanceOptions}
                  value={performanceRange}
                  onChange={setPerformanceRange}
                />

                <div className="lg:col-span-2">
                  <Input
                    label="Rechercher un enseignant"
                    type="search"
                    placeholder="Nom, département, spécialité..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                  />
                </div>
              </div>

              <TeacherPerformanceTable />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {performanceMetrics?.map((metric, index) => (
                  <PerformanceMetricCard key={index} {...metric} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
                <div className="lg:col-span-2">
                  <TeacherScatterPlot data={scatterPlotData} />
                </div>
                <div className="space-y-6">
                  <InstructorRankingList instructors={instructorRankings} />
                  <WorkloadDistributionChart data={workloadDistribution} />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* MODAL PROFILS ENSEIGNANTS EN ATTENTE */}
        {isPendingProfilesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-lg border border-border w-[90%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="UserPlus" size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-foreground">
                      Profils d'Enseignants en Attente
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pendingTeachers.length} demande{pendingTeachers.length > 1 ? 's' : ''} à traiter
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPendingProfilesModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>

              {/* Liste des profils - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {pendingTeachers.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="CheckCircle" size={48} color="var(--color-success)" className="mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucun profil en attente
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tous les enseignants sont actifs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="bg-background border border-border rounded-lg p-5 hover:shadow-lg transition-smooth"
                      >
                        {/* En-tête du profil */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon name="User" size={24} color="var(--color-primary)" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {teacher.firstName} {teacher.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Créé le {new Date(teacher.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>

                          {/* Boutons d'action */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditLimit(teacher)}
                              className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-smooth flex items-center gap-2"
                              title="Modifier"
                            >
                              <Icon name="Edit" size={16} />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleActivateTeacher(teacher)}
                              className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-smooth flex items-center gap-2"
                              title="Activer"
                            >
                              <Icon name="Check" size={16} />
                              Activer
                            </button>
                          </div>
                        </div>

                        {/* Informations du profil */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Mail" size={16} color="var(--color-muted-foreground)" />
                            <span className="text-foreground">{teacher.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Phone" size={16} color="var(--color-muted-foreground)" />
                            <span className="text-foreground">{teacher.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="BookOpen" size={16} color="var(--color-muted-foreground)" />
                            <span className="text-foreground">
                              {teacher.teacherProfile?.educationLevels?.join(', ') || 'Niveaux non spécifiés'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Briefcase" size={16} color="var(--color-muted-foreground)" />
                            <span className="text-foreground">Gains : {teacher.teacherProfile?.totalEarnings} pts</span>
                          </div>
                        </div>

                        {/* Matières enseignées */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-2">Matières :</p>
                          <div className="flex gap-2 flex-wrap">
                            {teacher.teacherProfile?.subjects?.length > 0 ? teacher.teacherProfile.subjects.map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {subject}
                              </span>
                            )) : (
                              <span className="text-sm text-muted-foreground">Aucune matière assignée</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {pendingTeachers.length > 0 && (
                <div className="p-6 border-t border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Approuvez ou rejetez les profils pour les traiter
                    </p>
                    <button
                      onClick={() => setIsPendingProfilesModalOpen(false)}
                      className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </NotificationProvider>
      {/* MODAL ÉDITION ENSEIGNANT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg border border-border w-[90%] max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Modifier l'Enseignant</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  value={editFormData.firstName}
                  onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={editFormData.lastName}
                  onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={editFormData.status}
                  onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="INACTIVE">Inactif</option>
                  <option value="ACTIVE">Actif</option>
                </select>
              </div>


              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm hover:bg-muted rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center gap-2"
                >
                  {updating ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div >
      )}
    </FilterProvider >
  );
};

export default TeacherPerformance;