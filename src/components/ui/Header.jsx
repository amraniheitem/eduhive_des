import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Tableau de Bord',
      path: '/main-analytics-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Vue d\'ensemble institutionnelle et KPI'
    },
    {
      label: 'Étudiants',
      path: '/student-analytics',
      icon: 'Users',
      tooltip: 'Analytique du cycle de vie étudiant'
    },
    {
      label: 'Cours',
      path: '/course-analytics',
      icon: 'BookOpen',
      tooltip: 'Efficacité des cours et optimisation'
    },
    {
      label: 'Enseignants',
      path: '/teacher-performance',
      icon: 'GraduationCap',
      tooltip: 'Performance et charge de travail des instructeurs'
    },
    {
      label: 'Finances',
      path: '/financial-analytics',
      icon: 'DollarSign',
      tooltip: 'Suivi des revenus et surveillance budgétaire'
    },
    {
      label: 'EduhiveAI',
      path: '/memory-analytics',
      icon: 'Brain',
      tooltip: 'IA Mémorisation et sessions d\'apprentissage'
    },
    {
      label: 'Paramètres',
      path: '/settings',
      icon: 'Settings',
      tooltip: 'Préférences et configuration'
    },
    {
      label: 'Logout',
      path: '/login',
      icon: 'LogOut',
      tooltip: 'Déconnexion du système',
      isLogout: true
    }
  ];

  const handleNavigation = (path, isLogout = false) => {
    if (isLogout) {
      // Logout user and clear auth data
      logout();
    }
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Modern Glassmorphism Header */}
      <header className="relative bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg transition-smooth">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent"></div>

        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo Section */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/main-analytics-dashboard')}>
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <Icon name="GraduationCap" size={24} color="#FFFFFF" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduHive Analytics
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigationItems?.map((item) => {
                const isActive = isActivePath(item?.path);
                const isLogout = item?.isLogout || item?.path === '/login';

                return (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path, item?.isLogout)}
                    title={item?.tooltip}
                    className={`
                      group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                      transition-all duration-300 hover-lift press-scale
                      ${isActive
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : isLogout
                          ? 'text-error hover:bg-error/10 hover:text-error'
                          : 'text-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    {/* Icon with animation */}
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      <Icon
                        name={item?.icon}
                        size={18}
                        color={isActive ? '#FFFFFF' : undefined}
                      />
                    </div>
                    <span className="relative">
                      {item?.label}
                      {/* Underline effect for non-active items */}
                      {!isActive && (
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
                      )}
                    </span>

                    {/* Active indicator glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-xl rounded-xl -z-10"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Section - Notifications & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { }}
                className="relative hover:bg-muted/80 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Icon name="Bell" size={20} />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-card"></span>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden hover:bg-muted/80 rounded-xl transition-all duration-300"
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="relative lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Navigation */}
          <nav className="relative bg-card/95 backdrop-blur-xl shadow-2xl border-b border-border/50 animate-slide-in-top z-50">
            <div className="flex flex-col p-4 gap-2">
              {navigationItems?.map((item) => {
                const isActive = isActivePath(item?.path);
                const isLogout = item?.isLogout || item?.path === '/login';

                return (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path, item?.isLogout)}
                    className={`
                      group relative flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium
                      transition-all duration-300 press-scale
                      ${isActive
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : isLogout
                          ? 'text-error hover:bg-error/10'
                          : 'text-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      <Icon
                        name={item?.icon}
                        size={20}
                        color={isActive ? '#FFFFFF' : undefined}
                      />
                    </div>
                    <span>{item?.label}</span>

                    {/* Active indicator glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-xl rounded-xl -z-10"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;