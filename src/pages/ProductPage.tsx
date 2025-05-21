import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { stocksApi } from '../api/stocks';
import { Product } from '../types/product';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/ui/ProductCard';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await stocksApi.getProductById(Number(id));
        setProduct(productData);

        if (productData.famille?.id_famille) {
          const filters = {
            page: 1,
            limit: 4,
            familleLibelle: productData.famille.libelle_famille,
            exclude: productData.produit.id_produit.toString(),
            sortBy: 'created_at',
            sortOrder: 'desc'
          };

          const relatedResponse = await stocksApi.getProducts(filters);
          setRelatedProducts(relatedResponse.data);
        }

        document.title = `${productData.produit.desi_produit} - DCAT Shop`;
      } catch (err) {
        setError('Produit introuvable ou erreur de chargement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  const increaseQuantity = () => setQuantity(prev => prev + 1);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.produit.id_produit,
        name: product.produit.desi_produit,
        price: parseFloat(product.produit.prix_produit),
        image: product.images[0]?.url || '/placeholder-product.png',
        quantity,
        brand: product.marque?.libelle_marque || '',
        category: product.famille?.libelle_famille || '',
        stock: product.produit.qte_produit,
        // location: product.produit.emplacement_produit || ''
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-amber-600">{error || 'Produit introuvable'}</h1>
        <Link to="/catalog" className="btn bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li><Link to="/" className="hover:text-amber-600">Accueil</Link></li>
          <li><Link to="/catalog" className="hover:text-amber-600">Catalogue</Link></li>
          <li className="text-amber-600">{product.produit.desi_produit}</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center p-4">
            <img
              src={product.images[selectedImage]?.url || '/placeholder-product.png'}
              alt={product.produit.desi_produit}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-amber-500 ring-2 ring-amber-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt="" 
                    className="h-20 w-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.produit.desi_produit}</h1>

          {product.marque?.libelle_marque && (
            <p className="text-lg text-gray-600">
              Marque : <span className="text-amber-600 font-medium">{product.marque.libelle_marque}</span>
            </p>
          )}

          <div className="text-3xl font-extrabold text-amber-600">
            {parseFloat(product.produit.prix_produit).toLocaleString('fr-FR')} FCFA
          </div>

          <div className="space-y-2 text-gray-700">
            <div><span className="font-medium">Référence :</span> {product.produit.code_produit}</div>
            {product.modele?.libelle_modele && (
              <div><span className="font-medium">Modèle :</span> {product.modele.libelle_modele}</div>
            )}
          </div>

          {/* Quantity and Cart */}
          <div className="flex items-center gap-4 py-6">
            <div className="flex border border-gray-300 rounded-md">
              <button 
                onClick={decreaseQuantity} 
                className="px-3 py-2 hover:bg-gray-50 text-gray-600"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-12 text-center border-x border-gray-300 focus:outline-none"
              />
              <button 
                onClick={increaseQuantity} 
                className="px-3 py-2 hover:bg-gray-50 text-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-md font-medium transition-colors"
            >
              Ajouter au panier
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-1 font-medium relative ${
                  activeTab === 'description' 
                    ? 'text-amber-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 px-1 font-medium relative ${
                  activeTab === 'specs' 
                    ? 'text-amber-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Caractéristiques
                {activeTab === 'specs' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {activeTab === 'description' ? (
              <div className="prose max-w-none">
                {product.produit.desc_produit ? (
                  <div className="text-gray-700 whitespace-pre-line">
                    {product.produit.desc_produit}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune description disponible</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Référence</h4>
                    <p className="text-gray-900">{product.produit.code_produit}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Categorie</h4>
                    <p className="text-gray-900">{product.famille?.libelle_famille || 'Non spécifié'}</p>
                  </div>
                  {product.marque?.libelle_marque && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Marque</h4>
                      <p className="text-gray-900">{product.marque.libelle_marque}</p>
                    </div>
                  )}
                  {product.modele?.libelle_modele && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Modèle</h4>
                      <p className="text-gray-900">{product.modele.libelle_modele}</p>
                    </div>
                  )}
                </div>

                {product.produit.caracteristiques_produit && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Caractéristiques techniques</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-gray-900 whitespace-pre-wrap font-sans">
                        {product.produit.caracteristiques_produit}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-amber-600 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.produit.id_produit} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;