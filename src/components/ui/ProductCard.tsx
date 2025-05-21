
import React from 'react';
import { Product } from '../../types/product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { produit, images, marque } = product;
  
  // Trouver l'image principale (préférer celle avec numéro_image = '1')
  const mainImage = images.find((img) => img.numero_image === '1')?.url || images[0]?.url;

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
            {produit.code_produit && (
              <span className="text-xs text-gray-500">{produit.code_produit}</span>
            )}
            <h3 className="font-medium text-lg line-clamp-1">
              {produit.desi_produit}
            </h3>
            {marque?.libelle_marque && (
              <span className="text-sm text-gray-600">{marque.libelle_marque}</span>
            )}
          </div>

          {produit.desc_produit && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">
              {produit.desc_produit}
            </p>
          )}

          {produit.caracteristiques_produit && (
            <p className="text-gray-500 text-xs mb-2 line-clamp-1">
              {produit.caracteristiques_produit}
            </p>
          )}

          <div className="flex justify-between items-center mt-auto">
            <span className="font-bold text-amber-600">
              {produit.prix_produit
                ? `${parseFloat(produit.prix_produit).toLocaleString('fr-FR')} FCFA`
                : 'Prix indisponible'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
