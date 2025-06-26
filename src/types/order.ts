export interface OrderProduct {
  id_produit: number;
  quantite: number;
  prix_unitaire: number;
  designation: string;
  code_produit: string;
  images: string[];
}

export interface OrderDetails {
  id_commande: number;
  date_de_commande: string;
  etat_commande: 'en_attente' | 'expédiée' | 'livrée' | 'annulée';
  lieu_de_livraison: string;
  mode_de_paiement: string;
  produits: OrderProduct[];
}

export interface OrderResponse {
  success: boolean;
  commande: OrderDetails;
}

export interface OrdersResponse {
  success: boolean;
  commandes: OrderDetails[];
}