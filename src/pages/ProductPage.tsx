import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { stocksApi } from '../api/stocks';
import { Product } from '../types/product';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/ui/ProductCard';
import { toast } from 'react-toastify'; 

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await stocksApi.getProductById(Number(id));
        
        if (!productData?.produit?.id_produit) {
          throw new Error('Produit non trouvé');
        }

        setProduct(productData);
        document.title = `${productData.produit.desi_produit} - DCAT Shop`;

        // Charger les produits similaires
        if (productData.famille?.id_famille) {
          try {
            const { data } = await stocksApi.getProducts({
              page: 1,
              limit: 4,
              familleLibelle: productData.famille.libelle_famille,
              exclude: productData.produit.id_produit.toString()
            });
            setRelatedProducts(data);
          } catch (e) {
            console.error('Erreur produits similaires:', e);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const adjustQuantity = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      addToCart(product, quantity);
      toast.success(`${quantity} ${product.produit.desi_produit} ajouté(s) au panier`);
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
      }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-amber-600">{error || 'Produit introuvable'}</h1>
        <Link 
          to="/catalog" 
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-colors"
        >
          Retour au catalogue <ChevronRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumbs améliorés */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li>
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-amber-600">
              Accueil
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/catalog" className="ml-1 text-sm font-medium text-gray-700 hover:text-amber-600 md:ml-2">
                Catalogue
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-sm font-medium text-amber-600 md:ml-2">{product.produit.desi_produit}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl h-96 flex items-center justify-center p-4 border border-gray-200">
            <img
              src={product.images[selectedImage]?.url || '/placeholder-product.png'}
              alt={product.produit.desi_produit}
              className="max-h-full max-w-full object-contain transition-opacity duration-300"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-amber-500 ring-2 ring-amber-200' 
                      : 'border-gray-200 hover:border-amber-300'
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

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.produit.desi_produit}</h1>
            {product.marque?.libelle_marque && (
              <p className="text-gray-600">
                Marque : <span className="text-amber-600 font-medium">{product.marque.libelle_marque}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-3xl font-extrabold text-amber-600">
              {parseFloat(product.produit.prix_produit).toLocaleString('fr-FR')} FCFA
            </div>
            {product.produit.prix_promo && (
              <span className="text-sm line-through text-gray-500">
                {parseFloat(product.produit.prix_promo).toLocaleString('fr-FR')} FCFA
              </span>
            )}
          </div>

          <div className="space-y-3 text-gray-700">
            {product.modele?.libelle_modele && (
              <div>
                <span className="font-medium">Modèle :</span> {product.modele.libelle_modele}
              </div>
            )}
            {product.famille?.libelle_famille && (
              <div>
                <span className="font-medium">Catégorie :</span> {product.famille.libelle_famille}
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => adjustQuantity(-1)}
                className="px-3 py-2 hover:bg-gray-50 text-gray-600 disabled:opacity-30 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  setQuantity(value);
                }}
                className="w-12 text-center border-x border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button 
                onClick={() => adjustQuantity(1)}
                className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm"
            >
              Ajouter au panier
            </button>
          </div>

          {/* Product Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-1 font-medium relative transition-colors ${
                  activeTab === 'description' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 px-1 font-medium relative transition-colors ${
                  activeTab === 'specs' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
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
                {product.produit.caracteristiques_produit && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <pre className="text-gray-900 whitespace-pre-wrap font-sans text-sm">
                      {product.produit.caracteristiques_produit}
                    </pre>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.produit.id_produit} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;