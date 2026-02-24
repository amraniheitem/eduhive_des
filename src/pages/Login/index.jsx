import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { LOGIN_MUTATION } from '../../graphql/mutations';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  // GraphQL login mutation
  const [loginMutation, { loading: isLoading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      try {
        const { token, user } = data.login;

        // Validate role - only ADMIN and SUPER_ADMIN can access
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          setErrors({
            email: '',
            password: '',
            general: 'Accès refusé. Seuls les administrateurs peuvent accéder à cette application.'
          });
          return;
        }

        // Login successful - save auth data
        login(token, user);

        // Navigate to dashboard
        navigate('/main-analytics-dashboard');
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          email: '',
          password: '',
          general: 'Une erreur est survenue lors de la connexion.'
        });
      }
    },
    onError: (error) => {
      console.error('GraphQL Error Full Details:', JSON.stringify(error, null, 2));
      console.error('GraphQL Error Message:', error.message);

      // Handle different error types
      if (error.message.includes('Invalid credentials') || error.message.includes('User not found') || error.message.includes('incorrect')) {
        setErrors({
          email: '',
          password: '',
          general: 'Email ou mot de passe incorrect.'
        });
      } else if (error.message.includes('Network')) {
        setErrors({
          email: '',
          password: '',
          general: 'Erreur de connexion au serveur.'
        });
      } else {
        // Show raw error message for debugging
        setErrors({
          email: '',
          password: '',
          general: `Erreur: ${error.message}`
        });
      }
    }
  });

  // Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handler de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    // Réinitialiser les erreurs
    setErrors({ email: '', password: '', general: '' });

    // Validation
    let hasError = false;

    if (!cleanEmail) {
      setErrors(prev => ({ ...prev, email: 'L\'email est requis' }));
      hasError = true;
    } else if (!validateEmail(cleanEmail)) {
      setErrors(prev => ({ ...prev, email: 'Email invalide' }));
      hasError = true;
    }

    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Le mot de passe est requis' }));
      hasError = true;
    } else if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Le mot de passe doit contenir au moins 6 caractères' }));
      hasError = true;
    }

    if (hasError) return;

    // Log for debugging
    console.log('Login Attempt:', { email: email.trim(), passwordLength: password.length });

    // Execute GraphQL login mutation
    try {
      await loginMutation({
        variables: {
          email: email.trim(),
          password
        }
      });
    } catch (error) {
      // Error is handled in onError callback
      console.error('Login submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Icon name="GraduationCap" size={32} color="white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Eduhive
          </h1>
          <p className="text-muted-foreground">
            Plateforme de gestion éducative
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <h2 className="text-2xl font-heading font-bold text-white mb-1">
              Connexion
            </h2>
            <p className="text-white/80 text-sm">
              Accédez à votre tableau de bord
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-start gap-3">
                <Icon name="AlertCircle" size={20} color="var(--color-error)" />
                <p className="text-sm text-error flex-1">{errors.general}</p>
              </div>
            )}

            {/* Champ Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icon name="Mail" size={18} color="var(--color-muted-foreground)" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@eduhive.com"
                  className={`w-full pl-10 pr-4 py-3 bg-background border ${errors.email ? 'border-error' : 'border-border'
                    } rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <Icon name="AlertCircle" size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Icon name="Lock" size={18} color="var(--color-muted-foreground)" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 bg-background border ${errors.password ? 'border-error' : 'border-border'
                    } rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-muted rounded p-1 transition-smooth"
                >
                  <Icon
                    name={showPassword ? 'EyeOff' : 'Eye'}
                    size={18}
                    color="var(--color-muted-foreground)"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <Icon name="AlertCircle" size={12} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded ${rememberMe
                    ? 'bg-primary border-primary'
                    : 'bg-background border-border group-hover:border-primary/50'
                    } transition-smooth flex items-center justify-center`}>
                    {rememberMe && (
                      <Icon name="Check" size={14} color="white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-foreground">
                  Se souvenir de moi
                </span>
              </label>

              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-smooth"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-smooth flex items-center justify-center gap-2 ${isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={18} />
                  Se connecter
                </>
              )}
            </button>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">
                  Ou continuer avec
                </span>
              </div>
            </div>

            {/* Connexion sociale */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-3 px-4 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-smooth flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="py-3 px-4 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-smooth flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-muted/30 px-6 py-4 text-center border-t border-border">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <button className="text-primary hover:text-primary/80 font-medium transition-smooth">
                S'inscrire
              </button>
            </p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            En vous connectant, vous acceptez nos{' '}
            <button className="text-primary hover:underline">
              Conditions d'utilisation
            </button>{' '}
            et notre{' '}
            <button className="text-primary hover:underline">
              Politique de confidentialité
            </button>
          </p>
        </div>

        {/* Aide */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <button className="hover:text-primary transition-smooth flex items-center gap-1">
            <Icon name="HelpCircle" size={16} />
            Aide
          </button>
          <button className="hover:text-primary transition-smooth flex items-center gap-1">
            <Icon name="MessageCircle" size={16} />
            Support
          </button>
          <button className="hover:text-primary transition-smooth flex items-center gap-1">
            <Icon name="Globe" size={16} />
            Langue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;