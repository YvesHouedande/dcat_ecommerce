import axios from 'axios';
import { Product, Famille, Marque, PaginatedResponse } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

interface ProductFilters {
  page?: number;
  limit?: number;
  prixMin?: number;  // Changé de minPrice à prixMin
  prixMax?: number;  // Changé de maxPrice à prixMax
  familleLibelle?: string; // Filtre par libellé de famille
  marqueLibelle?: string;  // Filtre par libellé de marque
  inStockOnly?: boolean;
  sort?: string; // 'newest', 'price-asc', 'price-desc'
}

export const stocksApi = {
  getProducts: async (filters: ProductFilters): Promise<PaginatedResponse<Product>> => {
    try {
      const params: Record<string, string> = {
        page: filters.page?.toString() || '1',
        limit: filters.limit?.toString() || '10'
      };

      if (filters.prixMin) params.prixMin = filters.prixMin.toString(); // Changé ici
      if (filters.prixMax) params.prixMax = filters.prixMax.toString(); // Changé ici
      if (filters.familleLibelle) params.familleLibelle = filters.familleLibelle;
      if (filters.marqueLibelle) params.marqueLibelle = filters.marqueLibelle;
      if (filters.inStockOnly) params.inStockOnly = 'true';
      if (filters.sort) params.sort = filters.sort;

      const response = await axios.get(`${API_URL}/api/stocks/produits`, {
        params
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits :', error);
      throw error;
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_URL}/api/stocks/produits/${id}`);
    return response.data;
  },

  getFamilles: async (): Promise<Famille[]> => {
    const response = await axios.get(`${API_URL}/api/stocks/familles`);
    return response.data;
  },

  getMarques: async (): Promise<Marque[]> => {
    const response = await axios.get(`${API_URL}/api/stocks/marques`);
    return response.data;
  },
};