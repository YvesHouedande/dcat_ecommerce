export interface ProductImage {
  id_image: number;
  libelle_image: string;
  lien_image: string;
  numero_image: string;
  url: string;
  created_at: string;
}

export interface ProductDetails {
  id_produit: number;
  code_produit: string;
  desi_produit: string;
  desc_produit: string;
  qte_produit: number;
  emplacement_produit: string | null;
  caracteristiques_produit: string;
  prix_produit: string;
  id_categorie: number;
  id_type_produit: number;
  id_modele: number;
  id_famille: number;
  id_marque: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  produit: ProductDetails;
  category: {
    id_categorie: number;
    libelle: string;
  };
  type: {
    id_type_produit: number;
    libelle: string;
  };
  modele: {
    id_modele: number;
    libelle_modele: string;
  };
  famille: {
    id_famille: number;
    libelle_famille: string;
  };
  marque: {
    id_marque: number;
    libelle_marque: string | null;
  };
  images: ProductImage[];
}

export interface Famille {
  id_famille: number;
  libelle_famille: string;
}

export interface Marque {
  id_marque: number;
  libelle_marque: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}