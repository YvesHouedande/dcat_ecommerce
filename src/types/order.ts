// // src/types/order.ts
// export interface OrderProduct {
//     id_commande_produit: number;
//     id_commande: number;
//     id_produit: number;
//     quantite: number;
//     prix_unitaire: number;
//     created_at: string;
//     updated_at: string;
//     produit: {
//       desi_produit: string;
//       code_produit: string;
//       images: {
//         lien_image: string;
//       }[];
//     };
//   }
  
//   export interface Order {
//     id_commande: number;
//     date_de_commande: string;
//     etat_commande: 'en_attente' | 'expédiée' | 'livrée' | 'annulée';
//     date_livraison: string | null;
//     lieu_de_livraison: string;
//     mode_de_paiement: string;
//     id_client: number;
//     created_at: string;
//     updated_at: string;
//     produits: OrderProduct[];
//   }
  
//   export interface OrderResponse {
//     success: boolean;
//     commandes: Order[];
//   }

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