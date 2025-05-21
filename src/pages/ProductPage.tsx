// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Minus, Plus } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { stocksApi } from '../api/stocks';
// import { Product } from '../types/product';
// import LoadingSpinner from '../components/ui/LoadingSpinner';
// import ProductCard from '../components/ui/ProductCard';
// import { toast } from 'react-toastify';

// const ProductPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { addToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [activeTab, setActiveTab] = useState('description');
//   const [product, setProduct] = useState<Product | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const productData = await stocksApi.getProductById(Number(id));
        
//         if (!productData?.produit?.id_produit) {
//           throw new Error('Produit non trouvé');
//         }

//         setProduct(productData);
//         document.title = `${productData.produit.desi_produit} - DCAT Shop`;

//         // Fetch related products
//         if (productData.famille?.id_famille) {
//           try {
//             const filters = {
//               page: 1,
//               limit: 4,
//               familleLibelle: productData.famille.libelle_famille,
//               exclude: productData.produit.id_produit.toString(),
//               sortBy: 'created_at',
//               sortOrder: 'desc'
//             };
//             const { data } = await stocksApi.getProducts(filters);
//             setRelatedProducts(data);
//           } catch (e) {
//             console.error('Failed to load related products', e);
//           }
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Erreur de chargement');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const adjustQuantity = (amount: number) => {
//     if (!product) return;
//     const newQuantity = quantity + amount;
//     setQuantity(Math.max(1, Math.min(newQuantity, product.produit.qte_produit)));
//   };

//   const handleAddToCart = () => {
//     if (!product) return;
    
//     try {
//       addToCart(product, quantity);
//       toast.success(`${quantity} ${product.produit.desi_produit} ajouté(s) au panier`, {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       toast.error("Erreur lors de l'ajout au panier");
//       console.error('Add to cart error:', error);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error || !product) {
//     return (
//       <div className="container py-16 text-center">
//         <h1 className="text-3xl font-bold mb-4 text-amber-600">{error || 'Produit introuvable'}</h1>
//         <Link 
//           to="/catalog" 
//           className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md"
//         >
//           Retour au catalogue
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-8">
//       {/* Breadcrumbs */}
//       <div className="text-sm breadcrumbs mb-6">
//         <ul>
//           <li><Link to="/" className="hover:text-amber-600">Accueil</Link></li>
//           <li><Link to="/catalog" className="hover:text-amber-600">Catalogue</Link></li>
//           <li className="text-amber-600">{product.produit.desi_produit}</li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Images Column */}
//         <div className="space-y-4">
//           <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center p-4">
//             <img
//               src={product.images[selectedImage]?.url || '/placeholder-product.png'}
//               alt={product.produit.desi_produit}
//               className="max-h-full max-w-full object-contain"
//             />
//           </div>
//           {product.images.length > 1 && (
//             <div className="grid grid-cols-4 gap-2">
//               {product.images.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`rounded-md overflow-hidden border-2 transition-all ${
//                     selectedImage === index 
//                       ? 'border-amber-500 ring-2 ring-amber-200' 
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <img 
//                     src={img.url} 
//                     alt="" 
//                     className="h-20 w-full object-cover" 
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Info Column */}
//         <div className="space-y-6">
//           <h1 className="text-3xl font-bold text-gray-900">{product.produit.desi_produit}</h1>

//           {product.marque?.libelle_marque && (
//             <p className="text-lg text-gray-600">
//               Marque : <span className="text-amber-600 font-medium">{product.marque.libelle_marque}</span>
//             </p>
//           )}

//           <div className="text-3xl font-extrabold text-amber-600">
//             {parseFloat(product.produit.prix_produit).toLocaleString('fr-FR')} FCFA
//           </div>

//           <div className="space-y-2 text-gray-700">
//             <div>
//               <span className="font-medium">Stock :</span> {product.produit.qte_produit} disponible(s)
//             </div>
//             <div>
//               <span className="font-medium">Référence :</span> {product.produit.code_produit}
//             </div>
//             {product.modele?.libelle_modele && (
//               <div>
//                 <span className="font-medium">Modèle :</span> {product.modele.libelle_modele}
//               </div>
//             )}
//           </div>

//           {/* Quantity Selector */}
//           <div className="flex items-center gap-4 py-6">
//             <div className="flex border border-gray-300 rounded-md">
//               <button 
//                 onClick={() => adjustQuantity(-1)}
//                 className="px-3 py-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
//                 disabled={quantity <= 1}
//               >
//                 <Minus size={16} />
//               </button>
//               <input
//                 type="number"
//                 min="1"
//                 max={product.produit.qte_produit}
//                 value={quantity}
//                 onChange={(e) => {
//                   const value = parseInt(e.target.value) || 1;
//                   setQuantity(Math.max(1, Math.min(value, product.produit.qte_produit)));
//                 }}
//                 className="w-12 text-center border-x border-gray-300 focus:outline-none"
//               />
//               <button 
//                 onClick={() => adjustQuantity(1)}
//                 className="px-3 py-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
//                 disabled={quantity >= product.produit.qte_produit}
//               >
//                 <Plus size={16} />
//               </button>
//             </div>
//             <button
//               onClick={handleAddToCart}
//               className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-md font-medium transition-colors"
//             >
//               Ajouter au panier
//             </button>
//           </div>

//           {/* Product Tabs */}
//           <div className="border-b border-gray-200">
//             <div className="flex space-x-8">
//               <button
//                 onClick={() => setActiveTab('description')}
//                 className={`pb-3 px-1 font-medium relative ${
//                   activeTab === 'description' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Description
//                 {activeTab === 'description' && (
//                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></span>
//                 )}
//               </button>
//               <button
//                 onClick={() => setActiveTab('specs')}
//                 className={`pb-3 px-1 font-medium relative ${
//                   activeTab === 'specs' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Caractéristiques
//                 {activeTab === 'specs' && (
//                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"></span>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="py-4">
//             {activeTab === 'description' ? (
//               <div className="prose max-w-none">
//                 {product.produit.desc_produit ? (
//                   <div className="text-gray-700 whitespace-pre-line">
//                     {product.produit.desc_produit}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">Aucune description disponible</p>
//                 )}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-500">Référence</h4>
//                     <p className="text-gray-900">{product.produit.code_produit}</p>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-500">Famille</h4>
//                     <p className="text-gray-900">{product.famille?.libelle_famille || 'Non spécifié'}</p>
//                   </div>
//                   {product.marque?.libelle_marque && (
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500">Marque</h4>
//                       <p className="text-gray-900">{product.marque.libelle_marque}</p>
//                     </div>
//                   )}
//                   {product.modele?.libelle_modele && (
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500">Modèle</h4>
//                       <p className="text-gray-900">{product.modele.libelle_modele}</p>
//                     </div>
//                   )}
//                 </div>

//                 {product.produit.caracteristiques_produit && (
//                   <div className="mt-6">
//                     <h4 className="text-sm font-medium text-gray-500 mb-2">Caractéristiques techniques</h4>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <pre className="text-gray-900 whitespace-pre-wrap font-sans">
//                         {product.produit.caracteristiques_produit}
//                       </pre>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-16 pt-8 border-t border-gray-200">
//           <h2 className="text-2xl font-bold text-amber-600 mb-6">Produits similaires</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {relatedProducts.map((product) => (
//               <ProductCard key={product.produit.id_produit} product={product} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductPage;


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
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
      console.error('Add to cart error:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-amber-600">{error || 'Produit introuvable'}</h1>
        <Link 
          to="/catalog" 
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md"
        >
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
        {/* Images Column */}
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

        {/* Info Column */}
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
            <div>
              <span className="font-medium">Référence :</span> {product.produit.code_produit}
            </div>
            {product.modele?.libelle_modele && (
              <div>
                <span className="font-medium">Modèle :</span> {product.modele.libelle_modele}
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 py-6">
            <div className="flex border border-gray-300 rounded-md">
              <button 
                onClick={() => adjustQuantity(-1)}
                className="px-3 py-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
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
                className="w-12 text-center border-x border-gray-300 focus:outline-none"
              />
              <button 
                onClick={() => adjustQuantity(1)}
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

          {/* Product Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-1 font-medium relative ${
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
                className={`pb-3 px-1 font-medium relative ${
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Référence</h4>
                    <p className="text-gray-900">{product.produit.code_produit}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Famille</h4>
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