export interface Product {
  id_produit: number;
  code_produit: string;
  desi_produit: string;
  desc_produit: string;
  image_produit: string | null;
  image_url: string | null;
  qte_produit: number;
  prix_produit: string;
  id_famille: number;
  id_marque: number;
  caracteristiques_produit: string;
  created_at: string;
  updated_at: string;
}

export interface Famille {
  id_famille: number;
  libelle_famille: string;
  created_at: string;
  updated_at: string;
}

export interface Marque {
  id_marque: number;
  libelle_marque: string | null;
  created_at: string;
  updated_at: string;
}