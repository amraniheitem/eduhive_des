import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_STUDENT_PERFORMANCE_LIST, GET_STUDENTS } from '../../../graphql/queries';
import { TOGGLE_USER_STATUS_MUTATION } from '../../../graphql/mutations';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const StudentPerformanceTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const client = useApolloClient();

  // États pour recherche et filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');

  const itemsPerPage = 10;

  // GraphQL Query
  const { data, loading, error, refetch } = useQuery(GET_STUDENT_PERFORMANCE_LIST, {
    variables: {
      limit: 1000 // For now we keep client side pagination
    },
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  // Mutation pour activer/désactiver un étudiant
  const [toggleStatus] = useMutation(TOGGLE_USER_STATUS_MUTATION, {
    onCompleted: (result) => {
      console.log('✅ Statut mis à jour:', result.toggleUserStatus.status);
      refetch(); // Rafraîchir la liste
      handleCloseDetails(); // Fermer la modale
    },
    onError: (error) => {
      console.error('❌ Erreur:', error.message);
      alert('Erreur lors de la mise à jour: ' + error.message);
    }
  });

  console.log('GraphQL Data:', data);
  console.log('GraphQL Error:', error);
  console.log('GraphQL Loading:', loading);

  const studentsData = useMemo(() => {
    return (data?.studentPerformanceList?.students || [])
      .filter(s => s !== null && s !== undefined)
      .map(student => ({
        id: student.studentId,
        name: `${student?.firstName || 'Inconnu'} ${student?.lastName || ''}`.trim(),
        email: student?.email || 'N/A',
        program: student?.educationLevel || 'N/A',
        gpa: student?.averageGrade || 0,
        attendance: student?.averageProgress || 0,
        engagement: student?.averageProgress || 0,
        assignments: student?.enrolledCourses || 0,
        assignmentsCompleted: student?.completedCourses || 0,
        lastActive: student?.lastActivity || new Date().toISOString(),
        status: student?.status || 'INACTIVE',
        performanceStatus: (student?.averageProgress || 0) > 80 ? 'excellent'
          : (student?.averageProgress || 0) > 50 ? 'good'
            : (student?.averageProgress || 0) > 20 ? 'average'
              : 'at-risk'
      }));
  }, [data]);

  // Programmes uniques pour le filtre
  const uniquePrograms = [...new Set(studentsData.map(s => s.program))];

  // Handler pour ouvrir les détails
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  // Handler pour fermer les détails
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedStudent(null);
  };

  // Handler pour modifier
  const handleEdit = () => {
    console.log('Modifier:', selectedStudent);
    alert(`Fonctionnalité "Modifier" pour ${selectedStudent?.name} - À implémenter`);
  };

  // Handler pour activer/désactiver
  const handleToggleStatus = async () => {
    if (!selectedStudent) return;

    const confirmMsg = selectedStudent.status === 'ACTIVE'
      ? `Désactiver l'étudiant ${selectedStudent.name} ?`
      : `Activer l'étudiant ${selectedStudent.name} ?`;

    if (window.confirm(confirmMsg)) {
      try {
        // Solution de contournement : on récupère tous les étudiants 
        // pour trouver le userId car le backend ne le renvoie pas encore
        const { data: studentsDataResponse } = await client.query({
          query: GET_STUDENTS,
          fetchPolicy: 'network-only' // S'assurer qu'on a les données à jour
        });

        const targetStudent = studentsDataResponse?.students?.find(
          s => s.id === selectedStudent.id
        );

        if (!targetStudent || !targetStudent.user || !targetStudent.user.id) {
          throw new Error("Impossible de trouver l'ID système de l'utilisateur. Veuillez rafraîchir la page.");
        }

        toggleStatus({
          variables: {
            userId: targetStudent.user.id
          }
        });
      } catch (err) {
        console.error("Erreur de récupération:", err);
        alert(err.message);
      }
    }
  };

  // Handler pour supprimer
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedStudent?.name} ? Cette action est irréversible.`)) {
      console.log('Supprimer:', selectedStudent);
      alert(`Étudiant ${selectedStudent?.name} supprimé avec succès !`);
      // TODO: Appel API pour supprimer
      handleCloseDetails();
    }
  };

  // Handler pour envoyer un message
  const handleSendMessage = () => {
    console.log('Envoyer message à:', selectedStudent);
    alert(`Ouverture de l'interface de messagerie pour ${selectedStudent?.name}`);
    // TODO: Ouvrir interface de message
  };

  // Handler pour reset password
  const handleResetPassword = () => {
    if (window.confirm(`Réinitialiser le mot de passe de ${selectedStudent?.name} ?`)) {
      console.log('Reset password:', selectedStudent);
      alert(`Un email de réinitialisation a été envoyé à ${selectedStudent?.email}`);
      // TODO: Appel API pour reset password
    }
  };

  // Handler pour réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPerformanceFilter('all');
    setProgramFilter('all');
    setCurrentPage(1);
  };

  // Compter les filtres actifs
  const activeFiltersCount = [
    searchTerm !== '',
    statusFilter !== 'all',
    performanceFilter !== 'all',
    programFilter !== 'all'
  ].filter(Boolean).length;

  // LOGIQUE DE FILTRAGE ET RECHERCHE
  const filteredData = useMemo(() => {
    return studentsData.filter(student => {
      // Filtre de recherche
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        student.name.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.program.toLowerCase().includes(searchLower) ||
        student.id.toString().includes(searchLower);

      // Filtre de statut
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

      // Filtre de performance
      const matchesPerformance = performanceFilter === 'all' || student.performanceStatus === performanceFilter;

      // Filtre de programme
      const matchesProgram = programFilter === 'all' || student.program === programFilter;

      return matchesSearch && matchesStatus && matchesPerformance && matchesProgram;
    });
  }, [studentsData, searchTerm, statusFilter, performanceFilter, programFilter]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  // Réinitialiser la page quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, performanceFilter, programFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-primary bg-primary/10';
      case 'average':
        return 'text-warning bg-warning/10';
      case 'at-risk':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Bon';
      case 'average':
        return 'Moyen';
      case 'at-risk':
        return 'À risque';
      default:
        return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ChevronsUpDown" size={14} color="var(--color-muted-foreground)" />;
    }
    return sortConfig?.direction === 'asc' ?
      <Icon name="ChevronUp" size={14} color="var(--color-primary)" /> :
      <Icon name="ChevronDown" size={14} color="var(--color-primary)" />;
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-background/50 z-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-error/10 text-error rounded-lg m-4">
            Erreur lors du chargement des données: {error.message}
          </div>
        )}
        {/* HEADER */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="Users" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                  Performance des Étudiants
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground caption mt-1">
                  {filteredData?.length} étudiant{filteredData?.length > 1 ? 's' : ''} {activeFiltersCount > 0 && `(${studentsData?.length} au total)`}
                </p>
              </div>
            </div>
          </div>

          {/* BARRE DE RECHERCHE */}
          <div className="relative mb-4">
            <Icon
              name="Search"
              size={18}
              color="var(--color-muted-foreground)"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Rechercher par nom, email, programme ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>

          {/* FILTRES */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtre Statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
            </select>

            {/* Filtre Performance */}
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth cursor-pointer"
            >
              <option value="all">Toutes les performances</option>
              <option value="excellent">Excellent</option>
              <option value="good">Bon</option>
              <option value="average">Moyen</option>
              <option value="at-risk">À risque</option>
            </select>

            {/* Filtre Programme */}
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth cursor-pointer"
            >
              <option value="all">Tous les programmes</option>
              {uniquePrograms.map((program) => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            {/* Bouton Réinitialiser */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 bg-error/10 text-error rounded-lg text-sm font-medium hover:bg-error/20 transition-smooth flex items-center gap-2"
              >
                <Icon name="RotateCcw" size={14} />
                Réinitialiser ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* TABLEAU */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 md:p-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 text-xs md:text-sm font-medium text-foreground hover:text-primary transition-smooth">
                    Étudiant
                    <SortIcon columnKey="name" />
                  </button>
                </th>
                <th className="text-left p-3 md:p-4">
                  <button
                    onClick={() => handleSort('program')}
                    className="flex items-center gap-2 text-xs md:text-sm font-medium text-foreground hover:text-primary transition-smooth">
                    Programme
                    <SortIcon columnKey="program" />
                  </button>
                </th>
                <th className="text-center p-3 md:p-4">
                  <button
                    onClick={() => handleSort('gpa')}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-foreground hover:text-primary transition-smooth w-full">
                    GPA
                    <SortIcon columnKey="gpa" />
                  </button>
                </th>
                <th className="text-center p-3 md:p-4">
                  <button
                    onClick={() => handleSort('attendance')}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-foreground hover:text-primary transition-smooth w-full">
                    Présence
                    <SortIcon columnKey="attendance" />
                  </button>
                </th>
                <th className="text-center p-3 md:p-4">
                  <button
                    onClick={() => handleSort('engagement')}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-foreground hover:text-primary transition-smooth w-full">
                    Engagement
                    <SortIcon columnKey="engagement" />
                  </button>
                </th>
                <th className="text-center p-3 md:p-4">
                  <span className="text-xs md:text-sm font-medium text-foreground">Devoirs</span>
                </th>
                <th className="text-center p-3 md:p-4">
                  <button
                    onClick={() => handleSort('lastActive')}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-foreground hover:text-primary transition-smooth w-full">
                    Dernière activité
                    <SortIcon columnKey="lastActive" />
                  </button>
                </th>
                <th className="text-center p-3 md:p-4">
                  <span className="text-xs md:text-sm font-medium text-foreground">Statut</span>
                </th>
                <th className="text-center p-3 md:p-4">
                  <span className="text-xs md:text-sm font-medium text-foreground">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData?.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Icon name="Search" size={48} color="var(--color-muted-foreground)" />
                      <p className="text-muted-foreground">Aucun étudiant trouvé</p>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-smooth"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData?.map((student) =>
                  <tr key={student?.id} className="hover:bg-muted/30 transition-smooth">
                    <td className="p-3 md:p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={"https://img.rocket.new/generatedImages/rocket_gen_img_13be3c843-1763299967170.png"}
                          alt={`Photo de profil de ${student?.name}`}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{student?.name || 'Inconnu'}</span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <span className="text-xs md:text-sm text-muted-foreground caption">
                        {student?.program}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="text-sm font-medium text-foreground data-text">
                        {student?.gpa?.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${student?.attendance}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground data-text whitespace-nowrap">
                          {student?.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-secondary"
                            style={{ width: `${student?.engagement}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground data-text whitespace-nowrap">
                          {student?.engagement}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="text-sm text-foreground data-text whitespace-nowrap">
                        {student?.assignmentsCompleted}/{student?.assignments}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="text-xs md:text-sm text-muted-foreground caption whitespace-nowrap">
                        {formatDate(student?.lastActive)}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student?.performanceStatus)} whitespace-nowrap`}>
                        {getStatusLabel(student?.performanceStatus)}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 transition-smooth"
                        title="Voir les détails">
                        <Icon name="Eye" size={18} color="var(--color-primary)" />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {paginatedData?.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <div className="text-xs md:text-sm text-muted-foreground caption">
              Affichage {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData?.length)} sur {filteredData?.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon name="ChevronLeft" size={16} />
              </button>
              <span className="text-sm text-foreground data-text">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE DÉTAILS - 60% de la largeur */}
      {isDetailsOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg border border-border w-[60%] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={"https://img.rocket.new/generatedImages/rocket_gen_img_13be3c843-1763299967170.png"}
                  alt={`Photo de profil de ${selectedStudent?.name}`}
                  className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    {selectedStudent?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedStudent?.program}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseDetails}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth">
                <Icon name="X" size={20} color="var(--color-foreground)" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Informations Personnelles */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="User" size={20} color="var(--color-primary)" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedStudent?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium text-foreground">N/A</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom du Parent</p>
                    <p className="text-sm font-medium text-foreground">N/A</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'inscription</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(selectedStudent?.lastActive)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut du compte</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${selectedStudent?.status === 'ACTIVE' ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>
                      {selectedStudent?.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Académique */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="GraduationCap" size={20} color="var(--color-primary)" />
                  Performance Académique
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">GPA</p>
                    <p className="text-2xl font-bold text-foreground">{selectedStudent?.gpa?.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de Présence</p>
                    <p className="text-2xl font-bold text-foreground">{selectedStudent?.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score d'Engagement</p>
                    <p className="text-2xl font-bold text-foreground">{selectedStudent?.engagement}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Devoirs Complétés</p>
                    <p className="text-2xl font-bold text-foreground">{selectedStudent?.assignmentsCompleted}/{selectedStudent?.assignments}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière Activité</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(selectedStudent?.lastActive)}</p>
                  </div>
                </div>
              </div>

              {/* Financier */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Wallet" size={20} color="var(--color-primary)" />
                  Informations Financières
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Crédits Disponibles</p>
                    <p className="text-2xl font-bold text-success">0 points</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Dépensé</p>
                    <p className="text-2xl font-bold text-foreground">0 points</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Matières Achetées</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      Aucune
                    </span>
                  </div>
                </div>
              </div>

              {/* Utilisation IA */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Bot" size={20} color="var(--color-primary)" />
                  Utilisation de l'IA
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Questions Posées</p>
                    <p className="text-2xl font-bold text-foreground">0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Dépensés</p>
                    <p className="text-2xl font-bold text-foreground">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Actions */}
            <div className="p-6 border-t border-border flex flex-wrap items-center gap-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center gap-2">
                <Icon name="Edit" size={16} />
                Modifier
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg transition-smooth flex items-center gap-2 ${selectedStudent?.status === 'ACTIVE'
                  ? 'bg-warning/10 text-warning hover:bg-warning/20'
                  : 'bg-success/10 text-success hover:bg-success/20'
                  }`}>
                <Icon name={selectedStudent?.status === 'ACTIVE' ? 'UserX' : 'UserCheck'} size={16} />
                {selectedStudent?.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-smooth flex items-center gap-2">
                <Icon name="MessageSquare" size={16} />
                Envoyer Message
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth flex items-center gap-2">
                <Icon name="Key" size={16} />
                Reset Password
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-smooth flex items-center gap-2 ml-auto">
                <Icon name="Trash2" size={16} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentPerformanceTable;