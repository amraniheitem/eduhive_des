import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACTIVE_TEACHERS } from '../../../graphql/queries';
import { TOGGLE_USER_STATUS_MUTATION } from '../../../graphql/mutations';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TeacherPerformanceTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const itemsPerPage = 10;

  // GraphQL Query & Mutation
  const { data, loading, error, refetch } = useQuery(GET_ACTIVE_TEACHERS);
  const [toggleUserStatus] = useMutation(TOGGLE_USER_STATUS_MUTATION, {
    onCompleted: () => {
      refetch();
      alert('✅ Statut mis à jour avec succès !');
      handleCloseDetails();
    },
    onError: (err) => {
      alert("Erreur lors de la mise à jour : " + err.message);
    }
  });

  const teachersData = useMemo(() => {
    if (!data?.users) return [];

    return data.users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1af0263ad-1763293958642.png", // Placeholder
      avatarAlt: `Photo de profil de ${user.firstName}`,
      department: "Général",
      enrollmentDate: user.createdAt,
      status: user.status,
      verified: user.verified,

      // Statistiques globales
      totalSubjects: user.teacherProfile?.subjects?.length || 0,
      totalStudents: 0, // Placeholder
      totalRevenue: user.teacherProfile?.totalEarnings || 0,
      totalVideos: 0, // Placeholder
      totalPDF: 0, // Placeholder

      // Détail des matières
      subjects: user.teacherProfile?.selectedSubjects?.map(sub => ({
        id: sub.id,
        name: sub.name,
        price: sub.price,
        studentsEnrolled: 0, // Placeholder
        videosCount: 0, // Placeholder
        pdfsCount: 0, // Placeholder
        revenue: 0 // Placeholder
      })) || [],

      // Historique encaissements
      withdrawals: [] // Placeholder
    }));
  }, [data]);

  // Handler pour ouvrir les détails
  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsOpen(true);
  };

  // Handler pour fermer les détails
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTeacher(null);
  };

  // Handler pour modifier
  const handleEdit = () => {
    alert(`Fonctionnalité "Modifier" pour ${selectedTeacher?.name} - À implémenter`);
  };

  // Handler pour activer/désactiver
  const handleToggleStatus = () => {
    if (!selectedTeacher) return;
    const action = selectedTeacher.status === 'ACTIVE' ? 'désactiver' : 'activer';

    if (window.confirm(`Êtes-vous sûr de vouloir ${action} le compte de ${selectedTeacher.name} ?`)) {
      toggleUserStatus({
        variables: {
          userId: selectedTeacher.id
        }
      });
    }
  };



  // Handler pour supprimer
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedTeacher?.name} ? Cette action est irréversible.`)) {
      alert(`Enseignant ${selectedTeacher?.name} supprimé avec succès !`);
      handleCloseDetails();
    }
  };

  // Handler pour voir les matières
  const handleViewSubjects = () => {
    alert(`Redirection vers la page des matières de ${selectedTeacher?.name}`);
  };

  // Handler pour valider l'encaissement
  const handleValidateWithdrawal = () => {
    if (selectedTeacher?.totalRevenue === 0) {
      alert('Aucun point disponible pour l\'encaissement');
      return;
    }
    if (window.confirm(`Valider l'encaissement de ${selectedTeacher?.totalRevenue} points (${(selectedTeacher?.totalRevenue * 0.01).toFixed(2)}€) pour ${selectedTeacher?.name} ?`)) {
      alert(`Encaissement validé ! Virement de ${(selectedTeacher?.totalRevenue * 0.01).toFixed(2)}€ en cours...`);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortedData = () => {
    const sorted = [...teachersData]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        return sortConfig?.direction === 'asc'
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      }

      return sortConfig?.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted?.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(teachersData?.length / itemsPerPage);
  const sortedData = getSortedData();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
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
            Erreur lors du chargement des données: {error.message}
          </div>
        )}
        <div className="p-4 md:p-6 border-b border-border">
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Performance Enseignants
          </h3>
          <p className="text-sm text-muted-foreground">
            {teachersData?.length} enseignants au total
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    Enseignant
                    <SortIcon columnKey="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    Email
                    <SortIcon columnKey="email" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('totalSubjects')}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth w-full"
                  >
                    Matières
                    <SortIcon columnKey="totalSubjects" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('totalStudents')}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth w-full"
                  >
                    Élèves
                    <SortIcon columnKey="totalStudents" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort('totalRevenue')}
                    className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth w-full"
                  >
                    Revenus
                    <SortIcon columnKey="totalRevenue" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">
                    Statut
                  </span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedData?.map((teacher) => (
                <tr key={teacher?.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={teacher?.avatar}
                        alt={teacher?.avatarAlt}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {teacher?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {teacher?.department}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {teacher?.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-foreground data-text">
                      {teacher?.totalSubjects}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-foreground data-text">
                      {teacher?.totalStudents}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-bold text-success data-text">
                      {teacher?.totalRevenue} pts
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${teacher?.status === 'ACTIVE'
                      ? 'text-success bg-success/10'
                      : 'text-error bg-error/10'
                      }`}>
                      {teacher?.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetails(teacher)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 transition-smooth"
                      title="Voir les détails"
                    >
                      <Icon name="Eye" size={18} color="var(--color-primary)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      </div>

      {/* MODAL DE DÉTAILS - 60% de la largeur */}
      {isDetailsOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-lg border border-border w-[60%] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedTeacher?.avatar}
                  alt={selectedTeacher?.avatarAlt}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    {selectedTeacher?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTeacher?.department}
                  </p>
                </div>
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
              {/* Informations Personnelles */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="User" size={20} color="var(--color-primary)" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedTeacher?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium text-foreground">{selectedTeacher?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'inscription</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(selectedTeacher?.enrollmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut du compte</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${selectedTeacher?.status === 'ACTIVE'
                      ? 'text-success bg-success/10'
                      : 'text-error bg-error/10'
                      }`}>
                      {selectedTeacher?.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistiques Globales */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="BarChart3" size={20} color="var(--color-primary)" />
                  Statistiques Globales
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Matières</p>
                    <p className="text-2xl font-bold text-foreground">{selectedTeacher?.totalSubjects}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Vidéos</p>
                    <p className="text-2xl font-bold text-foreground">{selectedTeacher?.totalVideos}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">PDF</p>
                    <p className="text-2xl font-bold text-foreground">{selectedTeacher?.totalPDF}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Élèves</p>
                    <p className="text-2xl font-bold text-foreground">{selectedTeacher?.totalStudents}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Revenus</p>
                    <p className="text-2xl font-bold text-success">{selectedTeacher?.totalRevenue} pts</p>
                  </div>
                </div>
              </div>

              {/* Matières Créées */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="BookOpen" size={20} color="var(--color-primary)" />
                  Matières Créées ({selectedTeacher?.totalSubjects})
                </h3>
                <div className="space-y-3">
                  {selectedTeacher?.subjects?.map((subject) => (
                    <div key={subject?.id} className="bg-muted/30 p-4 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{subject?.name}</h4>
                        <span className="text-sm font-bold text-success">{subject?.revenue} pts</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Prix:</span> {subject?.price} pts
                        </div>
                        <div>
                          <span className="font-medium">Élèves:</span> {subject?.studentsEnrolled}
                        </div>
                        <div>
                          <span className="font-medium">📹 Vidéos:</span> {subject?.videosCount}
                        </div>
                        <div>
                          <span className="font-medium">📄 PDF:</span> {subject?.pdfsCount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finances */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Wallet" size={20} color="var(--color-primary)" />
                  Informations Financières
                </h3>
                <div className="bg-success/10 p-4 rounded-lg border border-success/20 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Points disponibles (encaissables)</p>
                  <p className="text-3xl font-bold text-success">
                    {selectedTeacher?.totalRevenue} points
                    <span className="text-lg text-muted-foreground ml-2">
                      ({(selectedTeacher?.totalRevenue * 0.01).toFixed(2)}€)
                    </span>
                  </p>
                </div>

                {selectedTeacher?.withdrawals?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Historique des encaissements</p>
                    <div className="space-y-2">
                      {selectedTeacher?.withdrawals?.map((withdrawal) => (
                        <div key={withdrawal?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                          <span className="text-muted-foreground">{formatDate(withdrawal?.date)}</span>
                          <span className="font-medium text-foreground">{withdrawal?.amount} pts ({(withdrawal?.amount * 0.01).toFixed(2)}€)</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${withdrawal?.status === 'COMPLETED'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                            }`}>
                            {withdrawal?.status === 'COMPLETED' ? 'Complété' : 'En attente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                className={`px-4 py-2 rounded-lg transition-smooth flex items-center gap-2 ${selectedTeacher?.status === 'ACTIVE'
                  ? 'bg-warning/10 text-warning hover:bg-warning/20'
                  : 'bg-success/10 text-success hover:bg-success/20'
                  }`}
              >
                <Icon name={selectedTeacher?.status === 'ACTIVE' ? 'UserX' : 'UserCheck'} size={16} />
                {selectedTeacher?.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
              </button>
              <button
                onClick={handleViewSubjects}
                className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-smooth flex items-center gap-2"
              >
                <Icon name="BookOpen" size={16} />
                Voir Matières
              </button>
              <button
                onClick={handleValidateWithdrawal}
                className="px-4 py-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-smooth flex items-center gap-2"
                disabled={selectedTeacher?.totalRevenue === 0}
              >
                <Icon name="CreditCard" size={16} />
                Valider Encaissement
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
    </>
  );
};

export default TeacherPerformanceTable;