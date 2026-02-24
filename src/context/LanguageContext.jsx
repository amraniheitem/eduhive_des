import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Simple translation dictionary (expand as needed)
const translations = {
    fr: {
        settings: 'Paramètres',
        appearance: 'Apparence',
        account: 'Mon Compte',
        adminManagement: 'Gestion Admins',
        darkMode: 'Mode Sombre',
        lightMode: 'Mode Clair',
        language: 'Langue',
        logout: 'Déconnexion',
        save: 'Enregistrer',
        cancel: 'Annuler',
        addAdmin: 'Ajouter un Admin',
        name: 'Nom',
        email: 'Email',
        role: 'Rôle',
        actions: 'Actions',
        security: 'Sécurité',
        twoFactor: 'Authentification à deux facteurs (2FA)',
        twoFactorDesc: 'Ajoutez une couche de sécurité supplémentaire à votre compte.',
        enable: 'Activer',
        disable: 'Désactiver',
    },
    en: {
        settings: 'Settings',
        appearance: 'Appearance',
        account: 'My Account',
        adminManagement: 'Admin Management',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        language: 'Language',
        logout: 'Logout',
        save: 'Save',
        cancel: 'Cancel',
        addAdmin: 'Add Admin',
        name: 'Name',
        email: 'Email',
        role: 'Role',
        actions: 'Actions',
        security: 'Security',
        twoFactor: 'Two-Factor Authentication (2FA)',
        twoFactorDesc: 'Add an extra layer of security to your account.',
        enable: 'Enable',
        disable: 'Disable',
    },
    ar: {
        settings: 'الإعدادات',
        appearance: 'المظهر',
        account: 'حسابي',
        adminManagement: 'إدارة المسؤولين',
        darkMode: 'الوضع الداكن',
        lightMode: 'الوضع الفاتح',
        language: 'اللغة',
        logout: 'تسجيل الخروج',
        save: 'حفظ',
        cancel: 'إلغاء',
        addAdmin: 'إضافة مسؤول',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        role: 'الدور',
        actions: 'إجراءات',
        security: 'الأمان',
        twoFactor: 'المصادقة الثنائية (2FA)',
        twoFactorDesc: 'أضف طبقة أمان إضافية لحسابك.',
        enable: 'تفعيل',
        disable: 'تعطيل',
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'fr');

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        // Handle RTL for Arabic
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
