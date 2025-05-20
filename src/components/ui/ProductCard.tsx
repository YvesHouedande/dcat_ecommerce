// import React from 'react';
// import { ProductImage } from '../../types/product';

// interface ProductCardProps {
//   product: {
//     id: number;
//     code: string;
//     name: string;
//     description: string;
//     price: number;
//     images: ProductImage[];
//     inStock: boolean;
//     stockQuantity: number;
//     features?: string;
//     brand?: string;
//     location?: string | null;
//   };
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const mainImage = product.images.find(img => img.numero_image === "1")?.url || 
//                    product.images[0]?.url;

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
//       <div className="aspect-square bg-gray-100 relative">
//         {mainImage ? (
//           <img
//             src={mainImage}
//             alt={product.name}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = '/placeholder-product.png';
//             }}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
//             <span>Image non disponible</span>
//           </div>
//         )}
//       </div>
      
//       <div className="p-4 flex flex-col flex-grow">
//         <div className="mb-2">
//           <span className="text-xs text-gray-500">{product.code}</span>
//           <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
//           {product.brand && (
//             <span className="text-sm text-gray-600">{product.brand}</span>
//           )}
//         </div>
        
//         <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">
//           {product.description}
//         </p>
        
//         {product.features && (
//           <p className="text-gray-500 text-xs mb-2 line-clamp-1">
//             {product.features}
//           </p>
//         )}
        
//         {product.location && (
//           <p className="text-gray-500 text-xs mb-1">
//             Emplacement: {product.location}
//           </p>
//         )}

//         <div className="flex justify-between items-center mt-auto">
//           <span className="font-bold text-amber-600">
//             {product.price.toLocaleString()} FCFA
//           </span>
//           <span className={`text-xs ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
//             {product.stockQuantity > 0 ? `${product.stockQuantity} en stock` : 'Rupture'}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


import React from 'react';
import { ProductImage, Product } from '../../types/product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { produit, images, marque } = product;

  const mainImage =
    images.find((img) => img.numero_image === '1')?.url || images[0]?.url;

  return (
    <Link to={`/produits/${produit.id_produit}`} className="h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="aspect-square bg-gray-100 relative">
          {mainImage ? (
            <img
              src={mainImage}
              alt={produit.desi_produit}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span>Image non disponible</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <span className="text-xs text-gray-500">{produit.code_produit}</span>
            <h3 className="font-medium text-lg line-clamp-1">
              {produit.desi_produit}
            </h3>
            {marque?.libelle_marque && (
              <span className="text-sm text-gray-600">{marque.libelle_marque}</span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">
            {produit.desc_produit}
          </p>

          {produit.caracteristiques_produit && (
            <p className="text-gray-500 text-xs mb-2 line-clamp-1">
              {produit.caracteristiques_produit}
            </p>
          )}

          {produit.emplacement_produit && (
            <p className="text-gray-500 text-xs mb-1">
              Emplacement: {produit.emplacement_produit}
            </p>
          )}

          <div className="flex justify-between items-center mt-auto">
            <span className="font-bold text-amber-600">
              {produit.prix_produit
                ? `${parseFloat(produit.prix_produit).toLocaleString()} FCFA`
                : 'Prix indisponible'}
            </span>
            <span
              className={`text-xs ${
                parseInt(produit.qte_produit.toString()) > 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {parseInt(produit.qte_produit.toString()) > 0
                ? `${produit.qte_produit} en stock`
                : 'Rupture'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
