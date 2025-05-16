// import React from "react";
// import { Link } from "react-router-dom";
// import { ShoppingCart } from "lucide-react";
// import { Produit } from "../../types/produit";
// import { useCart } from "../../context/CartContext";

// interface ProductCardProps {
//   product: Produit;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { addToCart } = useCart();

//   const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     addToCart(product, 1);
//   };

//   // Convertir le prix de string à nombre
//   const prixNumerique = parseFloat(product.prix_produit);
  
//   // Vérifier si le produit est en stock
//   const estEnStock = product.qte_produit > 0;

//   return (
//     <div className="card h-full">
//       <Link to={`/product/${product.id_produit}`} className="block h-full">
//         <div className="relative pt-[100%]">
//           <img
//             src={product.image_url}
//             alt={product.desi_produit}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             onError={(e) => {
//               // Image de remplacement en cas d'erreur
//               (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
//             }}
//           />
//         </div>
//         <div className="p-4">
//           <div className="flex items-center mb-1">
//             <span className="text-sm text-slate-500">{product.code_produit}</span>
//           </div>
//           <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
//             {product.desi_produit}
//           </h3>
//           <div className="flex items-center mb-3">
//             <div className="text-sm text-slate-600 line-clamp-1">
//               {product.caracteristiques_produit}
//             </div>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <span className="font-medium text-slate-900">
//                 {prixNumerique.toLocaleString('fr-FR')} FCFA
//               </span>
//             </div>
//             {estEnStock ? (
//               <button
//                 onClick={handleAddToCart}
//                 className="flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-amber-500 text-white rounded-full transition-colors"
//                 aria-label="Ajouter au panier"
//               >
//                 <ShoppingCart className="h-5 w-5" />
//               </button>
//             ) : (
//               <span className="text-xs font-medium text-amber-600 bg-red-50 px-2 py-1 rounded">
//                 Rupture de stock
//               </span>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default ProductCard;






// import React from "react";
// import { Link } from "react-router-dom";
// import {ShoppingCart } from "lucide-react";
// import { Product } from "../../types/product";
// import { useCart } from "../../context/CartContext";

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { addToCart } = useCart();

//   const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     addToCart(product, 1);
//   };

//   return (
//     <div className="card h-full">
//       <Link to={`/product/${product.id}`} className="block h-full">
//         <div className="relative pt-[100%]">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           />
//         </div>
//         <div className="p-4">
//           {/* <div className="flex items-center mb-1">
//             <span className="text-sm text-slate-500">{product.brand}</span>
//             <span className="mx-2 text-slate-300">•</span>
//             <span className="text-sm text-slate-500">{product.category}</span>
//           </div> */}
//           <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
//             {product.name}
//           </h3>
//           <div className="flex items-center mb-3">
//             <div className="flex items-center"></div>
//           </div>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <span className="font-medium text-slate-900">
//                 {product.price.toFixed(2)} FCFA
//               </span>
//             </div>
//             {product.inStock ? (
//               <button
//                 onClick={handleAddToCart}
//                 className="flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-amber-500 text-white rounded-full transition-colors"
//                 aria-label="Add to cart"
//               >
//                 <ShoppingCart className="h-5 w-5" />
//               </button>
//             ) : (
//               <span className="text-xs font-medium text-amber-600 bg-red-50 px-2 py-1 rounded">
//                 Bientôt disponible
//               </span>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default ProductCard;

import React from 'react';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    inStock: boolean;
    features?: string;
    code?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="aspect-square bg-gray-100 relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span>Pas d'image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          {product.code && (
            <span className="text-xs text-gray-500">{product.code}</span>
          )}
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">
          {product.description}
        </p>
        {product.features && (
          <p className="text-gray-500 text-xs mb-2 line-clamp-1">
            {product.features}
          </p>
        )}
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-amber-600">
            {product.price.toLocaleString()} FCFA
          </span>
          <span className={`text-xs ${
            product.inStock ? 'text-green-500' : 'text-red-500'
          }`}>
            {product.inStock ? 'En stock' : 'Rupture'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;




