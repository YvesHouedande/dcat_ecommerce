import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id_client: number;
  email: string;
  nom: string;
  contact: string;
  role: string;
}

interface AuthContextType {
  currentUser: UserData | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Vérifie l'état d'authentification au chargement
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/ecommerceweb/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data.user);
    } catch (err) {
      localStorage.removeItem('jwtToken');
      console.error('Session verification failed:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Inscription standard
  const register = async (email: string, password: string, name: string, phone: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/ecommerceweb/auth/register`, {
        email,
        password,
        nom: name,
        contact: phone
      });

      localStorage.setItem('jwtToken', response.data.token);
      setCurrentUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur lors de l'inscription";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Connexion standard
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/ecommerceweb/auth/login`, {
        email,
        password
      });

      localStorage.setItem('jwtToken', response.data.token);
      setCurrentUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Identifiants incorrects";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Connexion Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axios.post(`${API_URL}/api/ecommerceweb/auth/sync-user`, {
        uid: user.uid,
        email: user.email,
        nom: user.displayName || user.email?.split('@')[0],
        contact: user.phoneNumber || '',
        provider: 'google'
      });

      localStorage.setItem('jwtToken', response.data.token);
      setCurrentUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        const errorMessage = err.response?.data?.message || "Échec de la connexion Google";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      // Déconnexion Firebase si utilisateur Google
      if (currentUser?.email) {
        await firebaseSignOut(auth);
      }

      localStorage.removeItem('jwtToken');
      setCurrentUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      throw new Error("Erreur lors de la déconnexion");
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    register,
    login,
    signInWithGoogle,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};