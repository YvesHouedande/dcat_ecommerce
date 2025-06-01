// src/api/stocks.ts
import axios from 'axios';
import { Product, Famille, Marque, PaginatedResponse } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

interface ProductFilters {
  page?: number;
  limit?: number;
  prixMin?: number;
  prixMax?: number;
  familleLibelle?: string;
  marqueLibelle?: string;
  inStockOnly?: boolean;
  sortBy?: 'updated_at' | 'prix_produit';
  sortOrder?: 'asc' | 'desc';
  exclude?: string;
}

export const stocksApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    try {
      const params: Record<string, any> = {
        page: filters.page || 1,
        limit: filters.limit || 10,
      };

      if (filters.prixMin !== undefined) params.prixMin = filters.prixMin;
      if (filters.prixMax !== undefined) params.prixMax = filters.prixMax;
      if (filters.familleLibelle) params.familleLibelle = filters.familleLibelle;
      if (filters.marqueLibelle) params.marqueLibelle = filters.marqueLibelle;
      if (filters.inStockOnly) params.inStockOnly = true;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters.exclude) params.exclude = filters.exclude;

      const response = await axios.get(`${API_URL}/api/stocks/produits`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await axios.get(`${API_URL}/api/stocks/produits/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  getFamilles: async (): Promise<Famille[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/stocks/familles`);
      return response.data;
    } catch (error) {
      console.error('Error fetching familles:', error);
      throw error;
    }
  },

  getMarques: async (): Promise<Marque[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/stocks/marques`);
      return response.data;
    } catch (error) {
      console.error('Error fetching marques:', error);
      throw error;
    }
  },
};