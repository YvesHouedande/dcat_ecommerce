// export interface UserProfile {
//     id_client: number;
//     email: string;
//     nom: string;
//     contact: string;
//     role: string;
//     created_at: string;
//     updated_at: string;
//   }
  
//   export interface OrderProduct {
//     id_commande_produit: number;
//     id_produit: number;
//     quantite: number;
//     prix_unitaire: number;
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
//     lieu_de_livraison: string;
//     mode_de_paiement: string;
//     produits: OrderProduct[];
//   }
  
//   export interface ProfileUpdateData {
//     nom: string;
//     contact: string;
//   }
  
//   // Nouvelle interface pour les réponses API
//   export interface ApiResponse<T = any> {
//     success: boolean;
//     user?: T;  // Pour /auth/me
//     data?: T;  // Pour les autres endpoints
//     commandes?: Order[]; // Spécifique pour l'historique
//     message?: string;
//   }


// src/types/account.ts
export interface UserProfile {
    id_client: number;
    email: string;
    nom: string;
    contact: string;
    role: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface OrderProduct {
    id_produit: number;
    quantite: number;
    prix_unitaire: number;
    designation: string;
    code_produit: string;
    images: string[];
  }
  
  export interface Order {
    id_commande: number;
    date_de_commande: string;
    etat_commande: 'en_attente' | 'expédiée' | 'livrée' | 'annulée';
    lieu_de_livraison: string;
    mode_de_paiement: string;
  }
  
  export interface OrderDetails extends Order {
    produits: OrderProduct[];
  }
  
  export interface ProfileUpdateData {
    nom: string;
    contact: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
  }