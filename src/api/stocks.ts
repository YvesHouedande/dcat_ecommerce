import axios from 'axios';
import { Product, Famille, Marque } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const stocksApi = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/api/stocks/produits');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getFamilles: async (): Promise<Famille[]> => {
    try {
      const response = await api.get('/api/stocks/familles');
      return response.data.map((f: any) => ({
        ...f,
        libelle_famille: f.libelle_famille || 'Non classé'
      }));
    } catch (error) {
      console.error('Error fetching families:', error);
      throw error;
    }
  },

  getMarques: async (): Promise<Marque[]> => {
    try {
      const response = await api.get('/api/stocks/marques');
      return response.data.map((m: any) => ({
        ...m,
        libelle_marque: m.libelle_marque || 'Marque inconnue'
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },
};