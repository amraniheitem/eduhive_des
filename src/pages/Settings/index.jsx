import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { CREATE_ADMIN_MUTATION } from '../../graphql/mutations';
import { GET_ADMINS } from '../../graphql/queries';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Settings = () => {
    const { user, hasRole } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, changeLanguage, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('appearance');

    // Admin Management State
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        permissions: ['MANAGE_USERS', 'VIEW_STATS'] // ✅ Valeurs par défaut
    });

    // Fetch Admins
    const { data: adminsData, loading: loadingAdmins, refetch: refetchAdmins, error: adminsError } = useQuery(GET_ADMINS, {
        skip: !hasRole(['SUPER_ADMIN']),
        fetchPolicy: 'network-only'
    });

    const [createAdmin, { loading: creatingAdmin }] = useMutation(CREATE_ADMIN_MUTATION, {
        onCompleted: () => {
            setShowAddAdminModal(false);
            setNewAdmin({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                department: '',
                permissions: ['MANAGE_USERS', 'VIEW_STATS']
            });
            refetchAdmins();
            alert("Admin créé avec succès !");
        },
        onError: (error) => {
            console.error("❌ Erreur GraphQL détaillée:", error);
            if (error.graphQLErrors) {
                console.error("GraphQLErrors:", JSON.stringify(error.graphQLErrors, null, 2));
            }
            if (error.networkError) {
                console.error("NetworkError:", error.networkError);
                console.error("NetworkError result:", error.networkError.result);
                if (error.networkError.result?.errors) {
                    error.networkError.result.errors.forEach((err, i) => {
                        console.error(`🔴 Server Error ${i}:`, JSON.stringify(err, null, 2));
                    });
                }
            }
            alert("Erreur lors de la création: " + error.message);
        }
    });

    const handleCreateAdmin = (e) => {
        e.preventDefault();

        // ✅ Validation des permissions
        if (!newAdmin.permissions || newAdmin.permissions.length === 0) {
            alert("Veuillez sélectionner au moins une permission !");
            return;
        }

        // ✅ Construction des variables - phone et department sont obligatoires (String!)
        const variables = {
            email: newAdmin.email.trim(),
            password: newAdmin.password,
            firstName: newAdmin.firstName.trim(),
            lastName: newAdmin.lastName.trim(),
            phone: newAdmin.phone?.trim() || "",
            department: newAdmin.department || "",
            permissions: newAdmin.permissions // ✅ Toujours un tableau non vide
        };

        console.log("🚀 Variables envoyées:", JSON.stringify(variables, null, 2));

        createAdmin({ variables }).catch(err => {
            console.error("❌ Erreur lors de l'appel de la mutation:", err);
        });
    };

    const handlePermissionToggle = (permissionId) => {
        setNewAdmin(prev => {
            const currentPerms = prev.permissions || [];
            const newPerms = currentPerms.includes(permissionId)
                ? currentPerms.filter(p => p !== permissionId)
                : [...currentPerms, permissionId];

            console.log("📝 Permissions mises à jour:", newPerms);
            return { ...prev, permissions: newPerms };
        });
    };

    const tabs = [
        { id: 'appearance', label: t('appearance'), icon: 'Palette' },
        { id: 'account', label: t('account'), icon: 'User' },
        ...(hasRole(['SUPER_ADMIN']) ? [{ id: 'admin', label: t('adminManagement'), icon: 'ShieldAlert' }] : [])
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-foreground">{t('settings')}</h1>
                <p className="text-muted-foreground mt-2">Gérez vos préférences et la configuration de l'application</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-md scale-105'
                                : 'bg-card text-foreground hover:bg-muted'
                                }`}
                        >
                            <Icon name={tab.icon} size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-card rounded-2xl p-6 shadow-sm border border-border/50">

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-8 animate-slide-in-right">
                            <div>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Icon name="Moon" className="text-primary" />
                                    {t('darkMode')}
                                </h2>
                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            <Icon name={theme === 'dark' ? 'Moon' : 'Sun'} size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium">{theme === 'dark' ? t('darkMode') : t('lightMode')}</p>
                                            <p className="text-sm text-muted-foreground">Ajustez l'apparence de l'application</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} className="sr-only peer" />
                                        <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Icon name="Languages" className="text-primary" />
                                    {t('language')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { code: 'fr', label: 'Français', flag: '🇫🇷' },
                                        { code: 'en', label: 'English', flag: '🇺🇸' },
                                        { code: 'ar', label: 'العربية', flag: '🇩🇿' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${language === lang.code
                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                : 'border-transparent bg-background hover:bg-muted'
                                                }`}
                                        >
                                            <span className="text-2xl mb-2">{lang.flag}</span>
                                            <span className="font-medium">{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <div className="space-y-8 animate-slide-in-right">
                            <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h3>
                                    <p className="text-muted-foreground">{user?.email}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold tracking-wider">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Icon name="ShieldCheck" className="text-primary" />
                                    {t('security')}
                                </h2>
                                <div className="p-4 bg-background rounded-xl border border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{t('twoFactor')}</p>
                                            <p className="text-sm text-muted-foreground">{t('twoFactorDesc')}</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {t('enable')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Management (Super Admin) */}
                    {activeTab === 'admin' && hasRole(['SUPER_ADMIN']) && (
                        <div className="space-y-6 animate-slide-in-right">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Gestion des Administrateurs</h2>
                                    <p className="text-muted-foreground">Gérez les comptes ayant accès au tableau de bord.</p>
                                </div>
                                <Button
                                    onClick={() => setShowAddAdminModal(true)}
                                    className="flex items-center gap-2 shadow-lg hover:shadow-primary/25"
                                >
                                    <Icon name="Plus" size={18} />
                                    {t('addAdmin')}
                                </Button>
                            </div>

                            {loadingAdmins ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-muted-foreground">Chargement des administrateurs...</p>
                                </div>
                            ) : adminsError ? (
                                <div className="p-4 bg-error/10 text-error rounded-xl text-center">
                                    Erreur de chargement: {adminsError.message}
                                </div>
                            ) : (
                                <div className="bg-background rounded-xl border border-border overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-muted/50 border-b border-border">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">{t('name')}</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">{t('email')}</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Département</th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {adminsData?.admins?.map((admin) => (
                                                <tr key={admin.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-6 py-4 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                            {admin.user?.firstName?.charAt(0)}{admin.user?.lastName?.charAt(0)}
                                                        </div>
                                                        <span className="font-medium">{admin.user?.firstName} {admin.user?.lastName}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">{admin.user?.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                                                            {admin.department || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => alert("Fonctionnalité d'édition à venir !")}>
                                                            <Icon name="Edit" size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-error hover:bg-error/10" onClick={() => alert("Fonctionnalité de suppression à venir !")}>
                                                            <Icon name="Trash2" size={16} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!adminsData?.admins || adminsData.admins.length === 0) && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-8 text-muted-foreground">
                                                        Aucun administrateur trouvé.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Admin Modal */}
            {showAddAdminModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-xl font-bold">{t('addAdmin')}</h3>
                            <button onClick={() => setShowAddAdminModal(false)} className="text-muted-foreground hover:text-foreground">
                                <Icon name="X" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('name')}</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        required
                                        className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={newAdmin.firstName}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        required
                                        className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={newAdmin.lastName}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('email')}</label>
                                    <input
                                        type="email"
                                        placeholder="admin@eduhive.com"
                                        required
                                        className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="0555..."
                                        className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={newAdmin.phone}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Département</label>
                                <select
                                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={newAdmin.department}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                                >
                                    <option value="">Sélectionner un département</option>
                                    <option value="IT">IT Support</option>
                                    <option value="Administration">Administration</option>
                                    <option value="Finance">Finance</option>
                                    <option value="HR">Ressources Humaines</option>
                                    <option value="Education">Pédagogie</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mot de passe</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Permissions
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        ({newAdmin.permissions?.length || 0} sélectionnée(s))
                                    </span>
                                </label>
                                <div className="grid grid-cols-1 gap-2 p-3 border border-border rounded-xl bg-muted/20">
                                    {[
                                        { id: 'MANAGE_USERS', label: 'Gérer les utilisateurs', icon: 'Users' },
                                        { id: 'VIEW_STATS', label: 'Voir les statistiques', icon: 'BarChart3' },
                                        { id: 'MANAGE_CONTENT', label: 'Gérer le contenu', icon: 'FileText' }
                                    ].map((perm) => (
                                        <label
                                            key={perm.id}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${newAdmin.permissions?.includes(perm.id)
                                                ? 'bg-primary/10 border border-primary/30'
                                                : 'hover:bg-muted/50'
                                                }`}
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-5 w-5 appearance-none rounded border-2 border-input bg-background checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                    checked={newAdmin.permissions?.includes(perm.id)}
                                                    onChange={() => handlePermissionToggle(perm.id)}
                                                />
                                                <Icon
                                                    name="Check"
                                                    size={12}
                                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon name={perm.icon} size={16} className="text-primary" />
                                                <span className="text-sm font-medium">{perm.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {(!newAdmin.permissions || newAdmin.permissions.length === 0) && (
                                    <p className="text-xs text-error mt-1">
                                        ⚠️ Veuillez sélectionner au moins une permission
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowAddAdminModal(false);
                                        setNewAdmin({
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            password: '',
                                            phone: '',
                                            department: '',
                                            permissions: ['MANAGE_USERS', 'VIEW_STATS']
                                        });
                                    }}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    loading={creatingAdmin}
                                    disabled={!newAdmin.permissions || newAdmin.permissions.length === 0}
                                >
                                    {t('addAdmin')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;