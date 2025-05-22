import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import axios from 'axios'; // Assurez-vous d'installer axios

// Interface pour les données utilisateur
interface UserData {
  uid: string;
  email: string | null;
  nom: string | null;
  contact?: string | null;
  photoURL?: string | null;
  provider: string; // 'email' ou 'google'
}

// Types pour notre contexte d'authentification
interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string, nom: string, contact: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  isAuthenticated: boolean;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// URL de l'API backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Fournisseur du contexte
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchroniser l'utilisateur avec le backend
  const syncUserWithBackend = async (user: User, additionalData?: { nom?: string, contact?: string }) => {
    try {
      // Récupérer le token d'authentification
      const token = await user.getIdToken();

      // Préparer les données utilisateur
      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        nom: user.displayName || additionalData?.nom || null,
        contact: user.phoneNumber || additionalData?.contact || null,
        photoURL: user.photoURL,
        provider: user.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
      };

      // Envoyer les données au backend
      const response = await axios.post(`${API_URL}/auth/sync-user`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Mettre à jour l'état local avec les données du backend
      setUserData(response.data.user);
      
      return response.data.user;
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec le backend:', error);
      throw error;
    }
  };

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Synchroniser l'utilisateur avec le backend à chaque connexion
          await syncUserWithBackend(user);
        } catch (error) {
          console.error("Erreur lors de la synchronisation initiale:", error);
        }
      } else {
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fonction de connexion avec email/mot de passe
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await syncUserWithBackend(userCredential.user);
    return userCredential;
  };

  // Fonction d'inscription avec email/mot de passe
  const register = async (email: string, password: string, nom: string, contact: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil avec le nom
      await updateProfile(userCredential.user, {
        displayName: nom
      });
      
      // Synchroniser avec le backend, en incluant le contact
      await syncUserWithBackend(userCredential.user, { nom, contact });
      
      return userCredential;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  };

  // Fonction de connexion avec Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Demander l'accès à l'email et au profil
    provider.addScope('email');
    provider.addScope('profile');
    
    const userCredential = await signInWithPopup(auth, provider);
    
    // Récupérer les informations supplémentaires de Google
    const user = userCredential.user;
    
    // Extraire des informations supplémentaires si disponibles
    // Note: Google ne fournit pas le numéro de téléphone par défaut
    // donc nous devrons peut-être le demander séparément
    await syncUserWithBackend(user);
    
    return userCredential;
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!currentUser) throw new Error('Aucun utilisateur connecté');
    
    try {
      const token = await currentUser.getIdToken();
      
      // Si nous mettons à jour le nom d'affichage, mettre à jour Firebase Auth aussi
      if (data.nom) {
        await updateProfile(currentUser, {
          displayName: data.nom
        });
      }
      
      // Envoyer la mise à jour au backend
      const response = await axios.put(`${API_URL}/auth/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserData(prev => prev ? { ...prev, ...data } : null);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  // Valeur du contexte
  const value = {
    currentUser,
    userData,
    isLoading,
    login,
    register,
    logout,
    signInWithGoogle,
    isAuthenticated: currentUser !== null,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}








// import { User, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { auth } from '../firebase/firebase';
// import axios from 'axios';
// import React, { createContext, useContext, useState } from 'react';
// import { UserCredential } from 'firebase/auth';

// API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthContextType {
//   currentUser: User | null;
//   register: (email: string, password: string, nom: string, contact: string) => Promise<void>;
//   signInWithGoogle: () => Promise<UserCredential>;
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   const register = async (email: string, password: string, nom: string, contact: string) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
//       // Synchronisation avec le backend
//       await axios.post(`${API_URL}/ecommerce/auth/sync-user`, {
//         uid: userCredential.user.uid,
//         email,
//         nom,
//         contact,
//         provider: 'email'
//       }, {
//         headers: { Authorization: `Bearer ${await userCredential.user.getIdToken()}` }
//       });

//       setCurrentUser(userCredential.user);
//     } catch (error) {
//       console.error("Registration error:", error);
//       throw error;
//     }
//   };

//   const signInWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
    
//     // Sync avec backend
//     await axios.post(`${API_URL}/ecommerce/auth/sync-user`, {
//       uid: result.user.uid,
//       email: result.user.email,
//       nom: result.user.displayName || result.user.email?.split('@')[0],
//       provider: 'google'
//     }, {
//       headers: { Authorization: `Bearer ${await result.user.getIdToken()}` }
//     });

//     return result;
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, register, signInWithGoogle }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
