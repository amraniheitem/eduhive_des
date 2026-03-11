import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACTIVE_TEACHERS } from '../../../graphql/queries';
import {
  CREATE_SUBJECT_MUTATION,
  UPDATE_SUBJECT_MUTATION,
  ASSIGN_TEACHER_MUTATION,
  REMOVE_TEACHER_MUTATION
} from '../../../graphql/mutations';
import client from '../../../config/apollo';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { GET_SUBJECTS_WITH_CONTENT } from '../../../graphql/queries/courses';

const CoursePerformanceTable = () => {
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'enrollment', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);


  // États pour les modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignmentSubject, setAssignmentSubject] = useState(null); // Le sujet pour lequel on assigne (Legacy/Object)
  const [selectedSubjectId, setSelectedSubjectId] = useState(''); // ID du sujet pour le Select
  const [selectedTeacherId, setSelectedTeacherId] = useState(''); // L'ID du prof sélectionné

  // État du formulaire de création/modification
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    level: 'LYCEE'
  });
  const [isEditing, setIsEditing] = useState(false); // Mode édition vs création

  // États pour recherche et filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [revenueFilter, setRevenueFilter] = useState('all');

  const itemsPerPage = 10;

  // GraphQL Queries
  const { data, loading, error, refetch } = useQuery(GET_SUBJECTS_WITH_CONTENT, {
    fetchPolicy: 'cache-and-network'
  });
  const { data: teachersData } = useQuery(GET_ACTIVE_TEACHERS);

  // GraphQL Mutations
  const [creating, setCreating] = useState(false);

  const [updateSubject, { loading: updating }] = useMutation(UPDATE_SUBJECT_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsCreateModalOpen(false);
      resetForm();
      alert('Matière mise à jour avec succès !');
    },
    onError: (err) => alert('Erreur lors de la mise à jour: ' + err.message)
  });

  const [createSubject, { loading: creatingSubject }] = useMutation(CREATE_SUBJECT_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsCreateModalOpen(false);
      resetForm();
      alert('Matière créée avec succès !');
    },
    onError: (err) => alert('Erreur lors de la création: ' + err.message)
  });

  const [assignTeacher, { loading: assigning }] = useMutation(ASSIGN_TEACHER_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsAssignModalOpen(false);
      alert('Professeur assigné avec succès !');
    },
    onError: (err) => alert('Erreur lors de l\'assignation: ' + err.message)
  });

  const [removeTeacher, { loading: removing }] = useMutation(REMOVE_TEACHER_MUTATION, {
    onCompleted: () => {
      refetch();
      setIsAssignModalOpen(false); // Si ouvert
      alert('Professeur retiré avec succès !');
    },
    onError: (err) => alert('Erreur lors du retrait: ' + err.message)
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      level: 'LYCEE'
    });
    setIsEditing(false);
    setSelectedCourse(null);
  };

  const toggleSubject = (subjectId) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  // Format durée (secondes → "15min 30s")
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  // Format taille de fichier (bytes → "2.5 MB")
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const coursesData = useMemo(() => {
    if (!data?.subjects) return [];

    return data.subjects.map(subject => {
      const instructor = subject.assignedTeachers?.[0]?.teacher?.user;
      const instructorName = instructor ? `${instructor.firstName} ${instructor.lastName}` : "Non assigné";

      return {
        id: subject.id,
        code: subject.id.substring(0, 8).toUpperCase(), // Placeholder code using ID
        name: subject.name,
        description: subject.description,
        department: subject.category || "Général",
        instructor: instructorName,
        instructorId: subject.assignedTeachers?.[0]?.teacherId,
        price: subject.price,
        videosCount: subject.videos?.length || 0,
        pdfsCount: subject.pdfs?.length || 0,
        enrollment: subject.stats?.studentsEnrolled || 0,
        revenue: subject.stats?.revenue || 0,
        status: subject.status,
        completionRate: 0, // Placeholder
        rating: subject.ratingsStats?.averageRating || 0,
        createdDate: subject.createdAt,

        videos: subject.videos || [],
        pdfs: subject.pdfs || [],
        enrolledStudents: subject.enrolledStudents?.map(enrolled => ({
          id: enrolled.studentId,
          name: enrolled.student?.user ? `${enrolled.student.user.firstName} ${enrolled.student.user.lastName}` : "Étudiant",
          enrollDate: "2026-01-01", // Placeholder
          progress: enrolled.progress || 0,
          avatar: ""
        })) || []
      };
    });
  }, [data]);

  // Handler pour ouvrir les détails
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setIsDetailsOpen(true);
  };

  // Handler pour fermer les détails
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedCourse(null);
  };

  // Handler pour modifier
  const handleEdit = () => {
    if (!selectedCourse) return;
    setFormData({
      name: selectedCourse.name,
      description: selectedCourse.description || '', // Assuming description is available in selectedCourse (need to add to mapping if not)
      price: selectedCourse.price,
      category: selectedCourse.department,
      level: 'LYCEE' // Default or derived from course data
    });
    setIsEditing(true);
    setIsCreateModalOpen(true);
    // On ferme les détails pour éditer tranquillement
    handleCloseDetails();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing && selectedCourse) {
      updateSubject({
        variables: {
          id: selectedCourse.id,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
        }
      });
      setCreating(true);
      try {
        await createSubject({
          variables: {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            level: formData.level
          }
        });
      } finally {
        setCreating(false);
      }
    }
  };

  const handleOpenAssignModal = (course) => {
    setAssignmentSubject(course);
    setSelectedSubjectId(course ? course.id : '');
    setSelectedTeacherId('');
    setIsAssignModalOpen(true);
  };

  const handleAssignSubject = (e) => {
    if (e) e.preventDefault();
    const subjId = selectedSubjectId || assignmentSubject?.id;
    if (!subjId || !selectedTeacherId) return;

    assignTeacher({
      variables: {
        subjectId: subjId,
        teacherId: selectedTeacherId
      }
    });
  };

  const handleAssignTeacher = () => {
    if (!assignmentSubject || !selectedTeacherId) return;
    assignTeacher({
      variables: {
        subjectId: assignmentSubject.id,
        teacherId: selectedTeacherId
      }
    });
  };

  const handleRemoveTeacher = (subjectId, teacherId) => {
    if (window.confirm('Voulez-vous vraiment retirer ce professeur de cette matière ?')) {
      removeTeacher({
        variables: {
          subjectId,
          teacherId
        }
      });
    }
  };

  // Handler pour activer/désactiver
  const handleToggleStatus = () => {
    const newStatus = selectedCourse?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    alert(`Matière ${selectedCourse?.name} ${newStatus === 'ACTIVE' ? 'activée' : 'désactivée'} avec succès !`);
  };

  // Handler pour supprimer
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la matière "${selectedCourse?.name}" ? Cette action est irréversible et supprimera toutes les vidéos et PDF associés.`)) {
      alert(`Matière ${selectedCourse?.name} supprimée avec succès !`);
      handleCloseDetails();
    }
  };

  // Handler pour supprimer une vidéo
  const handleDeleteVideo = (video) => {
    if (window.confirm(`Supprimer la vidéo "${video?.title}" ?`)) {
      alert(`Vidéo "${video?.title}" supprimée avec succès !`);
    }
  };

  // Handler pour supprimer un PDF
  const handleDeletePDF = (pdf) => {
    if (window.confirm(`Supprimer le PDF "${pdf?.title}" ?`)) {
      alert(`PDF "${pdf?.title}" supprimé avec succès !`);
    }
  };

  // Handler pour voir les élèves
  const handleViewStudents = () => {
    alert(`Redirection vers la liste des ${selectedCourse?.enrollment} élèves inscrits`);
  };

  // Handler pour réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriceFilter('all');
    setRevenueFilter('all');
    setCurrentPage(1);
  };

  // Compter les filtres actifs
  const activeFiltersCount = [
    searchTerm !== '',
    statusFilter !== 'all',
    priceFilter !== 'all',
    revenueFilter !== 'all'
  ].filter(Boolean).length;

  // Logique de filtrage
  const filteredData = useMemo(() => {
    return coursesData.filter(course => {
      // Filtre de recherche
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        course.name.toLowerCase().includes(searchLower) ||
        course.code.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower) ||
        course.department.toLowerCase().includes(searchLower);

      // Filtre de statut
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;

      // Filtre de prix
      let matchesPrice = true;
      if (priceFilter === 'free') matchesPrice = course.price === 0;
      else if (priceFilter === 'low') matchesPrice = course.price > 0 && course.price < 40;
      else if (priceFilter === 'medium') matchesPrice = course.price >= 40 && course.price < 50;
      else if (priceFilter === 'high') matchesPrice = course.price >= 50;

      // Filtre de revenus
      let matchesRevenue = true;
      if (revenueFilter === 'high') matchesRevenue = course.revenue >= 5000;
      else if (revenueFilter === 'medium') matchesRevenue = course.revenue >= 3000 && course.revenue < 5000;
      else if (revenueFilter === 'low') matchesRevenue = course.revenue < 3000;

      return matchesSearch && matchesStatus && matchesPrice && matchesRevenue;
    });
  }, [searchTerm, statusFilter, priceFilter, revenueFilter, coursesData]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedCourses = [...filteredData]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const paginatedCourses = sortedCourses?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedCourses?.length / itemsPerPage);

  // Réinitialiser la page quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priceFilter, revenueFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 3.5) return 'text-warning';
    return 'text-error';
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-error';
  };

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
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-background/50 z-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-error/10 text-error rounded-lg m-4">
            Erreur lors du chargement des cours: {error.message}
          </div>
        )}
        {/* HEADER */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Icon name="BookOpen" size={20} color="var(--color-primary)" />
              <div>
                <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Performance détaillée des matières
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredData?.length} matière{filteredData?.length > 1 ? 's' : ''} {activeFiltersCount > 0 && `(${coursesData?.length} au total)`}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setIsCreateModalOpen(true);
              }}
              iconName="Plus"
            >
              Ajouter une matière
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleOpenAssignModal(null)}
              iconName="Link"
              className="ml-2"
            >
              Assigner une matière
            </Button>
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
              placeholder="Rechercher par nom, code, professeur ou département..."
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

            {/* Filtre Prix */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth cursor-pointer"
            >
              <option value="all">Tous les prix</option>
              <option value="free">Gratuit</option>
              <option value="low">Bas (&lt;40 pts)</option>
              <option value="medium">Moyen (40-49 pts)</option>
              <option value="high">Élevé (≥50 pts)</option>
            </select>

            {/* Filtre Revenus */}
            <select
              value={revenueFilter}
              onChange={(e) => setRevenueFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth cursor-pointer"
            >
              <option value="all">Tous les revenus</option>
              <option value="high">Élevé (≥5000 pts)</option>
              <option value="medium">Moyen (3000-4999 pts)</option>
              <option value="low">Faible (&lt;3000 pts)</option>
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
          <table className="w-full min-w-[1100px]">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('code')}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth caption"
                  >
                    Code
                    <SortIcon columnKey="code" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth caption"
                  >
                    Nom
                    <SortIcon columnKey="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('instructor')}
                    className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth caption"
                  >
                    Instructeur
                    <SortIcon columnKey="instructor" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth caption mx-auto"
                  >
                    Prix
                    <SortIcon columnKey="price" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('enrollment')}
                    className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth caption mx-auto"
                  >
                    Inscrits
                    <SortIcon columnKey="enrollment" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-xs font-medium text-muted-foreground caption">
                    Contenus
                  </span>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('revenue')}
                    className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-smooth caption mx-auto"
                  >
                    Revenus
                    <SortIcon columnKey="revenue" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-xs font-medium text-muted-foreground caption">
                    Statut
                  </span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-xs font-medium text-muted-foreground caption">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedCourses?.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Icon name="Search" size={48} color="var(--color-muted-foreground)" />
                      <p className="text-muted-foreground">Aucune matière trouvée</p>
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
                paginatedCourses?.map((course) => {
                  const isExpanded = expandedSubjects.has(course.id);

                  return (
                    <React.Fragment key={course.id}>
                      {/* Main Row */}
                      <tr
                        className="hover:bg-muted/50 transition-smooth cursor-pointer"
                        onClick={() => toggleSubject(course.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Icon
                              name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                              size={18}
                              className="text-muted-foreground"
                            />
                            <span className="text-sm font-medium text-foreground">{course?.code}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{course?.name}</p>
                            <p className="text-xs text-muted-foreground caption">{course?.department}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground">{course?.instructor}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-primary">{course?.price} pts</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-medium text-foreground">{course?.enrollment}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="Video" size={14} color="var(--color-secondary)" />
                              {course?.videosCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="FileText" size={14} color="var(--color-warning)" />
                              {course?.pdfsCount}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-success">{course?.revenue} pts</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${course?.status === 'ACTIVE'
                            ? 'text-success bg-success/10'
                            : 'text-error bg-error/10'
                            }`}>
                            {course?.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(course);
                              }}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 transition-smooth"
                              title="Voir les détails"
                            >
                              <Icon name="Eye" size={16} color="var(--color-primary)" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row - Vidéos & PDFs */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="9" className="bg-muted/20 px-6 py-4">
                            <div className="space-y-6">
                              {/* 📹 TABLEAU DES VIDÉOS */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon name="Video" size={20} color="var(--color-accent-blue)" />
                                  <h4 className="font-semibold text-foreground">
                                    Vidéos ({course.videosCount})
                                  </h4>
                                </div>

                                {course.videos?.length > 0 ? (
                                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                                    <table className="w-full">
                                      <thead className="bg-muted/50">
                                        <tr>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Durée</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Taille</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Format</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ordre</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date d'ajout</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border">
                                        {[...course.videos]
                                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                                          .map((video) => (
                                            <tr key={video.id} className="hover:bg-muted/30 transition-colors">
                                              <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-foreground">{video.title}</div>
                                                {video.description && (
                                                  <div className="text-xs text-muted-foreground mt-1 truncate max-w-xs">{video.description}</div>
                                                )}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-foreground">{formatDuration(video.duration)}</td>
                                              <td className="px-4 py-3 text-sm text-foreground">{formatFileSize(video.fileSize)}</td>
                                              <td className="px-4 py-3">
                                                <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                                                  {video.format || 'N/A'}
                                                </span>
                                              </td>
                                              <td className="px-4 py-3 text-sm text-muted-foreground">#{video.order || '-'}</td>
                                              <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(video.uploadedAt).toLocaleDateString('fr-FR')}
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="bg-card rounded-lg border border-border p-6 text-center">
                                    <Icon name="Video" size={32} className="text-muted-foreground mx-auto mb-2 opacity-50" />
                                    <p className="text-sm text-muted-foreground">Aucune vidéo ajoutée</p>
                                  </div>
                                )}
                              </div>

                              {/* 📄 TABLEAU DES PDFs */}
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon name="FileText" size={20} color="var(--color-warning)" />
                                  <h4 className="font-semibold text-foreground">
                                    Documents PDF ({course.pdfsCount})
                                  </h4>
                                </div>

                                {course.pdfs?.length > 0 ? (
                                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                                    <table className="w-full">
                                      <thead className="bg-muted/50">
                                        <tr>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pages</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Taille</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date d'ajout</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border">
                                        {course.pdfs.map((pdf) => (
                                          <tr key={pdf.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                              <div className="text-sm font-medium text-foreground">{pdf.title}</div>
                                              {pdf.description && (
                                                <div className="text-xs text-muted-foreground mt-1 truncate max-w-xs">{pdf.description}</div>
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground">{pdf.pageCount || 'N/A'} p.</td>
                                            <td className="px-4 py-3 text-sm text-foreground">{formatFileSize(pdf.fileSize)}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                              {new Date(pdf.uploadedAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-4 py-3">
                                              <a
                                                href={pdf.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <Icon name="Download" size={14} />
                                                Télécharger
                                              </a>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="bg-card rounded-lg border border-border p-6 text-center">
                                    <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2 opacity-50" />
                                    <p className="text-sm text-muted-foreground">Aucun PDF ajouté</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {paginatedCourses?.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-xs text-muted-foreground caption">
              Affichage {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredData?.length)} sur {filteredData?.length} matière{filteredData?.length > 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              />
              <span className="text-sm text-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              />
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE DÉTAILS - 60% de la largeur */}
      {isDetailsOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg border border-border w-[60%] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono font-semibold rounded">
                    {selectedCourse?.code}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedCourse?.status === 'ACTIVE'
                    ? 'text-success bg-success/10'
                    : 'text-error bg-error/10'
                    }`}>
                    {selectedCourse?.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  {selectedCourse?.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCourse?.department} • {selectedCourse?.instructor}
                </p>
              </div>
              <button
                onClick={handleCloseDetails}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={20} color="var(--color-foreground)" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Informations Générales */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Info" size={20} color="var(--color-primary)" />
                  Informations Générales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prix</p>
                    <p className="text-xl font-bold text-primary">{selectedCourse?.price} points</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(selectedCourse?.createdDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Note moyenne</p>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} color="var(--color-warning)" />
                      <span className={`text-lg font-bold ${getRatingColor(selectedCourse?.rating)}`}>
                        {selectedCourse?.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">/5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de complétion</p>
                    <p className={`text-lg font-bold ${getCompletionColor(selectedCourse?.completionRate)}`}>
                      {selectedCourse?.completionRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="BarChart3" size={20} color="var(--color-primary)" />
                  Statistiques
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Élèves inscrits</p>
                    <p className="text-2xl font-bold text-foreground">{selectedCourse?.enrollment}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Vidéos</p>
                    <p className="text-2xl font-bold text-secondary">{selectedCourse?.videosCount}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">PDF</p>
                    <p className="text-2xl font-bold text-warning">{selectedCourse?.pdfsCount}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Revenus</p>
                    <p className="text-2xl font-bold text-success">{selectedCourse?.revenue} pts</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">Professeur (70%): <strong className="text-success">{Math.round(selectedCourse?.revenue)} pts</strong></span>
                  <span className="text-foreground">Entreprise (30%): <strong className="text-primary">{Math.round(selectedCourse?.revenue * 0.30 / 0.70)} pts</strong></span>
                </div>
              </div>

              {/* Section Professeur Assigné */}
              <div className="mt-4 p-4 border border-border rounded-lg bg-card">
                <h4 className="text-sm font-semibold mb-2">Professeur Responsable</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {selectedCourse?.instructor?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedCourse?.instructor}</p>
                      <p className="text-xs text-muted-foreground">{selectedCourse?.instructorId ? "Assigné" : "Non assigné"}</p>
                    </div>
                  </div>
                  <div>
                    {selectedCourse?.instructorId ? (
                      <button
                        onClick={() => handleRemoveTeacher(selectedCourse.id, selectedCourse.instructorId)}
                        className="text-xs text-error hover:underline"
                      >
                        Retirer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenAssignModal(selectedCourse)}
                        className="text-xs text-primary hover:underline"
                      >
                        Assigner
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Vidéos */}
              {selectedCourse?.videos?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Video" size={20} color="var(--color-primary)" />
                    Vidéos ({selectedCourse?.videosCount})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedCourse?.videos?.map((video) => (
                      <div key={video?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon name="PlayCircle" size={20} color="var(--color-secondary)" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{video?.title}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Icon name="Clock" size={12} /> {video?.duration}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Icon name="Eye" size={12} /> {video?.views} vues
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(video)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-muted-foreground hover:text-error transition-smooth"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs */}
              {selectedCourse?.pdfs?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="FileText" size={20} color="var(--color-primary)" />
                    Documents PDF ({selectedCourse?.pdfsCount})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCourse?.pdfs?.map((pdf) => (
                      <div key={pdf?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon name="FileText" size={20} color="var(--color-warning)" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{pdf?.title}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {pdf?.size}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Icon name="Download" size={12} /> {pdf?.downloads}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePDF(pdf)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error/10 text-muted-foreground hover:text-error transition-smooth"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étudiants inscrits */}
              {selectedCourse?.enrolledStudents?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Users" size={20} color="var(--color-primary)" />
                    Derniers inscrits
                  </h3>
                  <div className="space-y-3">
                    {selectedCourse?.enrolledStudents?.slice(0, 5).map((student) => (
                      <div key={student?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {student?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{student?.name}</p>
                            <p className="text-xs text-muted-foreground">Inscrit le {formatDate(student?.enrollDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-medium text-foreground">{student?.progress}%</span>
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getCompletionColor(student?.progress).replace('text-', 'bg-')}`}
                                style={{ width: `${student?.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedCourse?.enrolledStudents?.length > 5 && (
                      <button
                        onClick={handleViewStudents}
                        className="w-full py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-smooth"
                      >
                        Voir tous les {selectedCourse?.enrollment} étudiants
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Actions */}
            <div className="p-6 border-t border-border flex flex-wrap items-center gap-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth flex items-center gap-2"
              >
                <Icon name="Edit" size={16} />
                Modifier
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-lg transition-smooth flex items-center gap-2 ${selectedCourse?.status === 'ACTIVE'
                  ? 'bg-warning/10 text-warning hover:bg-warning/20'
                  : 'bg-success/10 text-success hover:bg-success/20'
                  }`}
              >
                <Icon name={selectedCourse?.status === 'ACTIVE' ? 'EyeOff' : 'Eye'} size={16} />
                {selectedCourse?.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
              </button>
              <button
                onClick={handleViewStudents}
                className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-smooth flex items-center gap-2"
              >
                <Icon name="Users" size={16} />
                Voir élèves
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-smooth flex items-center gap-2 ml-auto"
              >
                <Icon name="Trash2" size={16} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION / ÉDITION */}
      {
        isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card rounded-lg border border-border w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">{isEditing ? 'Modifier la matière' : 'Nouvelle matière'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (points)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Niveau</label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                  >
                    <option value="LYCEE">Lycée</option>
                    <option value="COLLEGE">Collège</option>
                    <option value="PRIMAIRE">Primaire</option>
                    <option value="UNIVERSITE">Youtube</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-sm hover:bg-muted rounded-lg"
                  >
                    Annuler
                  </button>
                  <Button type="submit" variant="primary" isLoading={creating || updating}>
                    {isEditing ? 'Sauvegarder' : 'Créer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* MODAL ASSIGNATION PROFESSEUR */}
      {/* MODAL ASSIGNATION PROFESSEUR (Nouveau Design) */}
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
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  {data?.subjects?.map((subject) => (
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
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                  required
                >
                  <option value="">Sélectionner un professeur</option>
                  {teachersData?.users?.map((user) => (
                    <option key={user.teacherProfile?.id} value={user.teacherProfile?.id}>
                      {user.firstName} {user.lastName}
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
                  disabled={assigning}
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-smooth flex items-center justify-center gap-2"
                >
                  {assigning ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Icon name="Check" size={18} />
                      Assigner
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursePerformanceTable;