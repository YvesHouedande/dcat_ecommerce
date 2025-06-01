// src/api/account.ts
import axios from 'axios';
import { UserProfile, Order, OrderDetails, ProfileUpdateData } from '../types/account';
import { OrderResponse } from '../types/order';


const API_URL = import.meta.env.VITE_API_URL;

export const accountApi = {
  // Récupérer le profil utilisateur
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await axios.get(`${API_URL}/api/ecommerceweb/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Mettre à jour le profil
  updateProfile: async (data: ProfileUpdateData): Promise<UserProfile> => {
    try {
      const response = await axios.put(
        `${API_URL}/api/ecommerceweb/auth/update-profile`, 
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        }
      );
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Récupérer l'historique des commandes
  getOrderHistory: async (): Promise<Order[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/ecommerceweb/commande/historique`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      return response.data.commandes || [];
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  },

  getOrderDetails: async (orderId: number): Promise<OrderDetails> => {
    try {
      const response = await axios.get<OrderResponse>(
        `${API_URL}/api/ecommerceweb/commande/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        }
      );

      if (!response.data.success || !response.data.commande) {
        throw new Error('Réponse de l\'API invalide');
      }

      // Conversion des données
      return {
        ...response.data.commande,
        produits: response.data.commande.produits.map(p => ({
          ...p,
          prix_unitaire: Number(p.prix_unitaire) // Conversion en number
        }))
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error(error.response?.data?.message || 'Impossible de charger les détails de la commande');
    }
  },

  // Annuler une commande
  cancelOrder: async (orderId: number): Promise<void> => {
    try {
      await axios.put(
        `${API_URL}/api/ecommerceweb/commande/${orderId}/annuler`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        }
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

};