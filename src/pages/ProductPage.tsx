// // // import React, { useState, useEffect } from "react";
// // // import { useParams, Link } from "react-router-dom";
// // // import {
// // //   ChevronRight,
// // //   Minus,
// // //   Plus,
// // //   Truck,
// // //   Shield,
// // //   RefreshCw,
// // // } from "lucide-react";
// // // import { useCart } from "../context/CartContext";
// // // import { stocksApi } from "../api/stocks";
// // // import LoadingSpinner from "../components/ui/LoadingSpinner";
// // // import ProductCard from "../components/ui/ProductCard";

// // // const ProductPage: React.FC = () => {
// // //   const { id } = useParams<{ id: string }>();
// // //   const { addToCart } = useCart();
// // //   const [quantity, setQuantity] = useState(1);
// // //   const [selectedImage, setSelectedImage] = useState(0);
// // //   const [activeTab, setActiveTab] = useState("description");
// // //   const [product, setProduct] = useState<any>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

// // //   useEffect(() => {
// // //     const fetchProductData = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const productData = await stocksApi.getProductById(Number(id));
// // //         setProduct(productData);

// // //         // Fetch related products from the same family
// // //         const relatedResponse = await stocksApi.getProducts(1, 4, {
// // //           famille: productData.famille.id_famille.toString()
// // //         });
// // //         setRelatedProducts(
// // //           relatedResponse.data.filter(p => p.produit.id_produit !== productData.produit.id_produit)
// // //         );

// // //         document.title = `${productData.produit.desi_produit} - DCAT Shop`;
// // //       } catch (err) {
// // //         setError("Produit introuvable ou erreur de chargement");
// // //         console.error(err);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchProductData();
// // //   }, [id]);

// // //   const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);
// // //   const increaseQuantity = () => setQuantity(quantity + 1);

// // //   const handleAddToCart = () => {
// // //     if (product) {
// // //       addToCart({
// // //         id: product.produit.id_produit,
// // //         code: product.produit.code_produit,
// // //         name: product.produit.desi_produit,
// // //         description: product.produit.desc_produit,
// // //         price: parseFloat(product.produit.prix_produit),
// // //         image: product.images[0]?.url || '/placeholder-product.png',
// // //         category: product.famille.libelle_famille,
// // //         brand: product.marque.libelle_marque,
// // //         inStock: product.produit.qte_produit > 0,
// // //         stockQuantity: product.produit.qte_produit,
// // //         location: product.produit.emplacement_produit
// // //       }, quantity);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="container py-16 text-center">
// // //         <LoadingSpinner />
// // //       </div>
// // //     );
// // //   }

// // //   if (error || !product) {
// // //     return (
// // //       <div className="container py-16 text-center">
// // //         <h1 className="text-3xl font-serif font-bold mb-4">
// // //           {error || "Produit introuvable"}
// // //         </h1>
// // //         <p className="text-slate-600 mb-8">
// // //           Le produit que vous recherchez n'existe pas ou a été supprimé.
// // //         </p>
// // //         <Link 
// // //           to="/catalog" 
// // //           className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-colors"
// // //         >
// // //           Retour au catalogue
// // //         </Link>
// // //       </div>
// // //     );
// // //   }

// // //   const mainImage = product.images[selectedImage]?.url || 
// // //                    product.images[0]?.url;

// // //   return (
// // //     <div className="bg-white">
// // //       {/* Breadcrumbs */}
// // //       <div className="container py-4">
// // //         <div className="flex items-center text-sm text-slate-500">
// // //           <Link to="/" className="hover:text-amber-600 transition-colors">
// // //             Accueil
// // //           </Link>
// // //           <ChevronRight className="h-4 w-4 mx-2" />
// // //           <Link to="/catalog" className="hover:text-amber-600 transition-colors">
// // //             Catalogue
// // //           </Link>
// // //           <ChevronRight className="h-4 w-4 mx-2" />
// // //           <Link 
// // //             to={`/catalog?category=${product.famille.id_famille}`}
// // //             className="hover:text-amber-600 transition-colors"
// // //           >
// // //             {product.famille.libelle_famille}
// // //           </Link>
// // //           <ChevronRight className="h-4 w-4 mx-2" />
// // //           <span className="text-slate-900 font-medium truncate">
// // //             {product.produit.desi_produit}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       {/* Product Details */}
// // //       <div className="container py-8">
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
// // //           {/* Product Images */}
// // //           <div>
// // //             <div className="bg-slate-50 rounded-lg overflow-hidden mb-4">
// // //               {mainImage ? (
// // //                 <img
// // //                   src={mainImage}
// // //                   alt={product.produit.desi_produit}
// // //                   className="w-full h-96 object-contain"
// // //                   onError={(e) => {
// // //                     (e.target as HTMLImageElement).src = '/placeholder-product.png';
// // //                   }}
// // //                 />
// // //               ) : (
// // //                 <div className="w-full h-96 flex items-center justify-center bg-slate-100 text-slate-400">
// // //                   Image non disponible
// // //                 </div>
// // //               )}
// // //             </div>
            
// // //             {/* Thumbnails */}
// // //             {product.images.length > 1 && (
// // //               <div className="grid grid-cols-4 gap-2">
// // //                 {product.images.map((image: any, index: number) => (
// // //                   <button
// // //                     key={image.id_image}
// // //                     onClick={() => setSelectedImage(index)}
// // //                     className={`border rounded-md overflow-hidden ${selectedImage === index ? 'border-amber-500' : 'border-slate-200'}`}
// // //                   >
// // //                     <img
// // //                       src={image.url}
// // //                       alt={image.libelle_image}
// // //                       className="w-full h-20 object-cover"
// // //                     />
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Product Info */}
// // //           <div>
// // //             <div className="mb-2">
// // //               <Link
// // //                 to={`/catalog?brand=${product.marque.id_marque}`}
// // //                 className="text-amber-600 hover:text-amber-700 font-medium"
// // //               >
// // //                 {product.marque.libelle_marque}
// // //               </Link>
// // //             </div>

// // //             <h1 className="text-3xl font-serif font-bold mb-4">
// // //               {product.produit.desi_produit}
// // //             </h1>

// // //             <div className="mb-6">
// // //               <div className="flex items-center">
// // //                 <span className="text-3xl font-bold text-slate-900">
// // //                   {parseFloat(product.produit.prix_produit).toLocaleString('fr-FR')} FCFA
// // //                 </span>
// // //               </div>
// // //               <div className="text-slate-500 mt-1">
// // //                 Disponibilité:
// // //                 <span
// // //                   className={`ml-2 font-medium ${
// // //                     product.produit.qte_produit > 0 ? "text-green-600" : "text-amber-600"
// // //                   }`}
// // //                 >
// // //                   {product.produit.qte_produit > 0 
// // //                     ? `${product.produit.qte_produit} en stock` 
// // //                     : "Rupture de stock"}
// // //                 </span>
// // //               </div>
// // //               <div className="text-slate-500 mt-1">
// // //                 Emplacement: {product.produit.emplacement_produit || "Non spécifié"}
// // //               </div>
// // //               <div className="text-slate-500 mt-1">
// // //                 Modèle: {product.modele.libelle_modele}
// // //               </div>
// // //             </div>

// // //             <div className="prose prose-slate mb-6 text-slate-700">
// // //               <p>{product.produit.desc_produit}</p>
// // //             </div>

// // //             {/* Add to cart */}
// // //             {product.produit.qte_produit > 0 ? (
// // //               <div className="flex items-center mb-8">
// // //                 <div className="flex border border-slate-300 rounded-md mr-4">
// // //                   <button
// // //                     onClick={decreaseQuantity}
// // //                     className="px-3 py-2 flex items-center justify-center hover:bg-slate-100"
// // //                     aria-label="Diminuer la quantité"
// // //                   >
// // //                     <Minus className="h-4 w-4" />
// // //                   </button>
// // //                   <input
// // //                     type="number"
// // //                     min="1"
// // //                     max={product.produit.qte_produit}
// // //                     value={quantity}
// // //                     onChange={(e) => {
// // //                       const value = Math.max(
// // //                         1, 
// // //                         Math.min(
// // //                           product.produit.qte_produit, 
// // //                           Number(e.target.value) || 1
// // //                         )
// // //                       );
// // //                       setQuantity(value);
// // //                     }}
// // //                     className="w-12 px-2 py-2 text-center focus:outline-none focus:ring-0 border-x border-slate-300"
// // //                   />
// // //                   <button
// // //                     onClick={increaseQuantity}
// // //                     disabled={quantity >= product.produit.qte_produit}
// // //                     className="px-3 py-2 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50"
// // //                     aria-label="Augmenter la quantité"
// // //                   >
// // //                     <Plus className="h-4 w-4" />
// // //                   </button>
// // //                 </div>
// // //                 <button
// // //                   onClick={handleAddToCart}
// // //                   className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-colors flex-1"
// // //                 >
// // //                   Ajouter au panier
// // //                 </button>
// // //               </div>
// // //             ) : (
// // //               <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-8">
// // //                 Ce produit est actuellement en rupture de stock
// // //               </div>
// // //             )}

// // //             {/* Shipping and Returns */}
// // //             <div className="space-y-4 border-t border-slate-200 pt-6">
// // //               <div className="flex items-start">
// // //                 <Truck className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
// // //                 <div>
// // //                   <h3 className="font-medium">Expédition rapide</h3>
// // //                   <p className="text-sm text-slate-500">
// // //                     Commandes préparées et envoyées dans un délai très court
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //               <div className="flex items-start">
// // //                 <Shield className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
// // //                 <div>
// // //                   <h3 className="font-medium">Produit authentique</h3>
// // //                   <p className="text-sm text-slate-500">
// // //                     Qualité garantie, sans contrefaçon
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //               <div className="flex items-start">
// // //                 <RefreshCw className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
// // //                 <div>
// // //                   <h3 className="font-medium">Service d'installation</h3>
// // //                   <p className="text-sm text-slate-500">
// // //                     Nous proposons l'installation professionnelle de vos
// // //                     produits, sur demande
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Product Details Tabs */}
// // //       <div className="container py-12">
// // //         <div className="border-b border-slate-200">
// // //           <div className="flex overflow-x-auto">
// // //             <button
// // //               onClick={() => setActiveTab("description")}
// // //               className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
// // //                 activeTab === "description"
// // //                   ? "border-amber-500 text-amber-600"
// // //                   : "border-transparent text-slate-600 hover:text-slate-900"
// // //               }`}
// // //             >
// // //               Description
// // //             </button>
// // //             <button
// // //               onClick={() => setActiveTab("specifications")}
// // //               className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
// // //                 activeTab === "specifications"
// // //                   ? "border-amber-500 text-amber-600"
// // //                   : "border-transparent text-slate-600 hover:text-slate-900"
// // //               }`}
// // //             >
// // //               Caractéristiques
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <div className="py-8">
// // //           {activeTab === "description" && (
// // //             <div className="prose prose-slate max-w-none">
// // //               <p>{product.produit.desc_produit}</p>
// // //             </div>
// // //           )}

// // //           {activeTab === "specifications" && (
// // //             <div className="prose prose-slate max-w-none">
// // //               <table className="min-w-full divide-y divide-slate-200">
// // //                 <tbody className="divide-y divide-slate-200">
// // //                   <tr>
// // //                     <td className="py-3 px-4 font-medium text-slate-700 w-1/3">Code produit</td>
// // //                     <td className="py-3 px-4 text-slate-600">{product.produit.code_produit}</td>
// // //                   </tr>
// // //                   <tr>
// // //                     <td className="py-3 px-4 font-medium text-slate-700">Catégorie</td>
// // //                     <td className="py-3 px-4 text-slate-600">{product.category.libelle}</td>
// // //                   </tr>
// // //                   <tr>
// // //                     <td className="py-3 px-4 font-medium text-slate-700">Famille</td>
// // //                     <td className="py-3 px-4 text-slate-600">{product.famille.libelle_famille}</td>
// // //                   </tr>
// // //                   <tr>
// // //                     <td className="py-3 px-4 font-medium text-slate-700">Type</td>
// // //                     <td className="py-3 px-4 text-slate-600">{product.type.libelle}</td>
// // //                   </tr>
// // //                   <tr>
// // //                     <td className="py-3 px-4 font-medium text-slate-700">Marque</td>
// // //                     <td className="py-3 px-4 text-slate-600">{product.marque.libelle_marque}</td>
// // //                   </tr>
// // //                   <tr>
// // //                     <td className="py-3 px-4 font-medium text-slate-700">Modèle</td>
// // //                     <td className="py-3 px-4 text-slate-600">{product.modele.libelle_modele}</td>
// // //                   </tr>
// // //                   {product.produit.caracteristiques_produit && (
// // //                     <tr>
// // //                       <td className="py-3 px-4 font-medium text-slate-700">Caractéristiques</td>
// // //                       <td className="py-3 px-4 text-slate-600 whitespace-pre-line">
// // //                         {product.produit.caracteristiques_produit}
// // //                       </td>
// // //                     </tr>
// // //                   )}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Related Products */}
// // //       {relatedProducts.length > 0 && (
// // //         <div className="container py-12 border-t border-slate-200">
// // //           <h2 className="text-2xl font-serif font-bold mb-8">
// // //             Produits similaires
// // //           </h2>
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // //             {relatedProducts.map((product) => (
// // //               <ProductCard
// // //                 key={product.produit.id_produit}
// // //                 product={{
// // //                   id: product.produit.id_produit,
// // //                   code: product.produit.code_produit,
// // //                   name: product.produit.desi_produit,
// // //                   description: product.produit.desc_produit,
// // //                   price: parseFloat(product.produit.prix_produit),
// // //                   images: product.images,
// // //                   inStock: product.produit.qte_produit > 0,
// // //                   stockQuantity: product.produit.qte_produit,
// // //                   features: product.produit.caracteristiques_produit,
// // //                   brand: product.marque.libelle_marque,
// // //                   location: product.produit.emplacement_produit
// // //                 }}
// // //               />
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default ProductPage;


// // import React, { useState, useEffect } from "react";
// // import { useParams, Link, useSearchParams } from "react-router-dom";
// // import {
// //   ChevronRight,
// //   Minus,
// //   Plus,
// //   Truck,
// //   Shield,
// //   RefreshCw,
// // } from "lucide-react";
// // import { useCart } from "../context/CartContext";
// // import { stocksApi } from "../api/stocks";
// // import { Product, Famille, Marque, PaginatedResponse } from "../types/product";
// // import LoadingSpinner from "../components/ui/LoadingSpinner";
// // import ProductCard from "../components/ui/ProductCard";

// // const ProductPage: React.FC = () => {
// //   const { id } = useParams<{ id: string }>();
// //   const [searchParams] = useSearchParams();
// //   const { addToCart } = useCart();
// //   const [quantity, setQuantity] = useState(1);
// //   const [selectedImage, setSelectedImage] = useState(0);
// //   const [activeTab, setActiveTab] = useState("description");
// //   const [product, setProduct] = useState<Product | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

// //   useEffect(() => {
// //     const fetchProductData = async () => {
// //       try {
// //         setLoading(true);
// //         const productData = await stocksApi.getProductById(Number(id));
// //         setProduct(productData);

// //         // Fetch related products from the same family
// //         if (productData.famille?.id_famille) {
// //           const filters = {
// //             page: 1,
// //             limit: 4,
// //             familleLibelle: productData.famille.libelle_famille,
// //             exclude: productData.produit.id_produit.toString()
// //           };
          
// //           const relatedResponse = await stocksApi.getProducts(filters);
// //           setRelatedProducts(
// //             relatedResponse.data.filter(p => 
// //               p.produit.id_produit !== productData.produit.id_produit
// //             )
// //           );
// //         }

// //         document.title = `${productData.produit.desi_produit} - DCAT Shop`;
// //       } catch (err) {
// //         setError("Produit introuvable ou erreur de chargement");
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProductData();
// //   }, [id]);

// //   const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);
// //   const increaseQuantity = () => {
// //     if (product && quantity < product.produit.qte_produit) {
// //       setQuantity(quantity + 1);
// //     }
// //   };

// //   const handleAddToCart = () => {
// //     if (product) {
// //       addToCart({
// //         id: product.produit.id_produit,
// //         code: product.produit.code_produit,
// //         name: product.produit.desi_produit,
// //         description: product.produit.desc_produit,
// //         price: parseFloat(product.produit.prix_produit),
// //         image: product.images[0]?.url || '/placeholder-product.png',
// //         category: product.famille.libelle_famille,
// //         brand: product.marque.libelle_marque || 'Non spécifié',
// //         inStock: product.produit.qte_produit > 0,
// //         stockQuantity: product.produit.qte_produit,
// //         location: product.produit.emplacement_produit || 'Non spécifié'
// //       }, quantity);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="container py-16 text-center">
// //         <LoadingSpinner />
// //       </div>
// //     );
// //   }

// //   if (error || !product) {
// //     return (
// //       <div className="container py-16 text-center">
// //         <h1 className="text-3xl font-serif font-bold mb-4">
// //           {error || "Produit introuvable"}
// //         </h1>
// //         <p className="text-slate-600 mb-8">
// //           Le produit que vous recherchez n'existe pas ou a été supprimé.
// //         </p>
// //         <Link 
// //           to="/catalog" 
// //           className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-colors"
// //         >
// //           Retour au catalogue
// //         </Link>
// //       </div>
// //     );
// //   }

// //   const mainImage = product.images[selectedImage]?.url || 
// //                    product.images[0]?.url;

// //   return (
// //     <div className="bg-white">
// //       {/* Breadcrumbs */}
// //       <div className="container py-4">
// //         <div className="flex items-center text-sm text-slate-500">
// //           <Link to="/" className="hover:text-amber-600 transition-colors">
// //             Accueil
// //           </Link>
// //           <ChevronRight className="h-4 w-4 mx-2" />
// //           <Link to="/catalog" className="hover:text-amber-600 transition-colors">
// //             Catalogue
// //           </Link>
// //           <ChevronRight className="h-4 w-4 mx-2" />
// //           <Link 
// //             to={`/catalog?familleLibelle=${product.famille.libelle_famille}`}
// //             className="hover:text-amber-600 transition-colors"
// //           >
// //             {product.famille.libelle_famille}
// //           </Link>
// //           <ChevronRight className="h-4 w-4 mx-2" />
// //           <span className="text-slate-900 font-medium truncate">
// //             {product.produit.desi_produit}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Product Details */}
// //       <div className="container py-8">
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
// //           {/* Product Images */}
// //           <div>
// //             <div className="bg-slate-50 rounded-lg overflow-hidden mb-4">
// //               {mainImage ? (
// //                 <img
// //                   src={mainImage}
// //                   alt={product.produit.desi_produit}
// //                   className="w-full h-96 object-contain"
// //                   onError={(e) => {
// //                     (e.target as HTMLImageElement).src = '/placeholder-product.png';
// //                   }}
// //                 />
// //               ) : (
// //                 <div className="w-full h-96 flex items-center justify-center bg-slate-100 text-slate-400">
// //                   Image non disponible
// //                 </div>
// //               )}
// //             </div>
            
// //             {/* Thumbnails */}
// //             {product.images.length > 1 && (
// //               <div className="grid grid-cols-4 gap-2">
// //                 {product.images.map((image, index) => (
// //                   <button
// //                     key={image.id_image}
// //                     onClick={() => setSelectedImage(index)}
// //                     className={`border rounded-md overflow-hidden ${selectedImage === index ? 'border-amber-500' : 'border-slate-200'}`}
// //                   >
// //                     <img
// //                       src={image.url}
// //                       alt={image.libelle_image}
// //                       className="w-full h-20 object-cover"
// //                       onError={(e) => {
// //                         (e.target as HTMLImageElement).src = '/placeholder-product.png';
// //                       }}
// //                     />
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Product Info */}
// //           <div>
// //             {product.marque?.libelle_marque && (
// //               <div className="mb-2">
// //                 <Link
// //                   to={`/catalog?marqueLibelle=${product.marque.libelle_marque}`}
// //                   className="text-amber-600 hover:text-amber-700 font-medium"
// //                 >
// //                   {product.marque.libelle_marque}
// //                 </Link>
// //               </div>
// //             )}

// //             <h1 className="text-3xl font-serif font-bold mb-4">
// //               {product.produit.desi_produit}
// //             </h1>

// //             <div className="mb-6">
// //               <div className="flex items-center">
// //                 <span className="text-3xl font-bold text-slate-900">
// //                   {parseFloat(product.produit.prix_produit).toLocaleString('fr-FR')} FCFA
// //                 </span>
// //               </div>
// //               <div className="text-slate-500 mt-1">
// //                 Disponibilité:
// //                 <span
// //                   className={`ml-2 font-medium ${
// //                     product.produit.qte_produit > 0 ? "text-green-600" : "text-amber-600"
// //                   }`}
// //                 >
// //                   {product.produit.qte_produit > 0 
// //                     ? `${product.produit.qte_produit} en stock` 
// //                     : "Rupture de stock"}
// //                 </span>
// //               </div>
// //               {product.produit.emplacement_produit && (
// //                 <div className="text-slate-500 mt-1">
// //                   Emplacement: {product.produit.emplacement_produit}
// //                 </div>
// //               )}
// //               {product.modele?.libelle_modele && (
// //                 <div className="text-slate-500 mt-1">
// //                   Modèle: {product.modele.libelle_modele}
// //                 </div>
// //               )}
// //             </div>

// //             {product.produit.desc_produit && (
// //               <div className="prose prose-slate mb-6 text-slate-700">
// //                 <p>{product.produit.desc_produit}</p>
// //               </div>
// //             )}

// //             {/* Add to cart */}
// //             {product.produit.qte_produit > 0 ? (
// //               <div className="flex items-center mb-8">
// //                 <div className="flex border border-slate-300 rounded-md mr-4">
// //                   <button
// //                     onClick={decreaseQuantity}
// //                     className="px-3 py-2 flex items-center justify-center hover:bg-slate-100"
// //                     aria-label="Diminuer la quantité"
// //                   >
// //                     <Minus className="h-4 w-4" />
// //                   </button>
// //                   <input
// //                     type="number"
// //                     min="1"
// //                     max={product.produit.qte_produit}
// //                     value={quantity}
// //                     onChange={(e) => {
// //                       const value = Math.max(
// //                         1, 
// //                         Math.min(
// //                           product.produit.qte_produit, 
// //                           Number(e.target.value) || 1
// //                         )
// //                       );
// //                       setQuantity(value);
// //                     }}
// //                     className="w-12 px-2 py-2 text-center focus:outline-none focus:ring-0 border-x border-slate-300"
// //                   />
// //                   <button
// //                     onClick={increaseQuantity}
// //                     disabled={quantity >= product.produit.qte_produit}
// //                     className="px-3 py-2 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50"
// //                     aria-label="Augmenter la quantité"
// //                   >
// //                     <Plus className="h-4 w-4" />
// //                   </button>
// //                 </div>
// //                 <button
// //                   onClick={handleAddToCart}
// //                   className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-colors flex-1"
// //                 >
// //                   Ajouter au panier
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-8">
// //                 Ce produit est actuellement en rupture de stock
// //               </div>
// //             )}

// //             {/* Shipping and Returns */}
// //             <div className="space-y-4 border-t border-slate-200 pt-6">
// //               <div className="flex items-start">
// //                 <Truck className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
// //                 <div>
// //                   <h3 className="font-medium">Expédition rapide</h3>
// //                   <p className="text-sm text-slate-500">
// //                     Commandes préparées et envoyées dans un délai très court
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex items-start">
// //                 <Shield className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
// //                 <div>
// //                   <h3 className="font-medium">Produit authentique</h3>
// //                   <p className="text-sm text-slate-500">
// //                     Qualité garantie, sans contrefaçon
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex items-start">
// //                 <RefreshCw className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
// //                 <div>
// //                   <h3 className="font-medium">Service d'installation</h3>
// //                   <p className="text-sm text-slate-500">
// //                     Nous proposons l'installation professionnelle de vos
// //                     produits, sur demande
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Product Details Tabs */}
// //       <div className="container py-12">
// //         <div className="border-b border-slate-200">
// //           <div className="flex overflow-x-auto">
// //             <button
// //               onClick={() => setActiveTab("description")}
// //               className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
// //                 activeTab === "description"
// //                   ? "border-amber-500 text-amber-600"
// //                   : "border-transparent text-slate-600 hover:text-slate-900"
// //               }`}
// //             >
// //               Description
// //             </button>
// //             <button
// //               onClick={() => setActiveTab("specifications")}
// //               className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
// //                 activeTab === "specifications"
// //                   ? "border-amber-500 text-amber-600"
// //                   : "border-transparent text-slate-600 hover:text-slate-900"
// //               }`}
// //             >
// //               Caractéristiques
// //             </button>
// //           </div>
// //         </div>

// //         <div className="py-8">
// //           {activeTab === "description" && product.produit.desc_produit && (
// //             <div className="prose prose-slate max-w-none">
// //               <p>{product.produit.desc_produit}</p>
// //             </div>
// //           )}

// //           {activeTab === "specifications" && (
// //             <div className="prose prose-slate max-w-none">
// //               <table className="min-w-full divide-y divide-slate-200">
// //                 <tbody className="divide-y divide-slate-200">
// //                   <tr>
// //                     <td className="py-3 px-4 font-medium text-slate-700 w-1/3">Code produit</td>
// //                     <td className="py-3 px-4 text-slate-600">{product.produit.code_produit}</td>
// //                   </tr>
// //                   {product.category?.libelle && (
// //                     <tr>
// //                       <td className="py-3 px-4 font-medium text-slate-700">Catégorie</td>
// //                       <td className="py-3 px-4 text-slate-600">{product.category.libelle}</td>
// //                     </tr>
// //                   )}
// //                   <tr>
// //                     <td className="py-3 px-4 font-medium text-slate-700">Famille</td>
// //                     <td className="py-3 px-4 text-slate-600">{product.famille.libelle_famille}</td>
// //                   </tr>
// //                   {product.type?.libelle && (
// //                     <tr>
// //                       <td className="py-3 px-4 font-medium text-slate-700">Type</td>
// //                       <td className="py-3 px-4 text-slate-600">{product.type.libelle}</td>
// //                     </tr>
// //                   )}
// //                   {product.marque?.libelle_marque && (
// //                     <tr>
// //                       <td className="py-3 px-4 font-medium text-slate-700">Marque</td>
// //                       <td className="py-3 px-4 text-slate-600">{product.marque.libelle_marque}</td>
// //                     </tr>
// //                   )}
// //                   {product.modele?.libelle_modele && (
// //                     <tr>
// //                       <td className="py-3 px-4 font-medium text-slate-700">Modèle</td>
// //                       <td className="py-3 px-4 text-slate-600">{product.modele.libelle_modele}</td>
// //                     </tr>
// //                   )}
// //                   {product.produit.caracteristiques_produit && (
// //                     <tr>
// //                       <td className="py-3 px-4 font-medium text-slate-700">Caractéristiques</td>
// //                       <td className="py-3 px-4 text-slate-600 whitespace-pre-line">
// //                         {product.produit.caracteristiques_produit}
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Related Products */}
// //       {relatedProducts.length > 0 && (
// //         <div className="container py-12 border-t border-slate-200">
// //           <h2 className="text-2xl font-serif font-bold mb-8">
// //             Produits similaires
// //           </h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //             {relatedProducts.map((product) => (
// //               <ProductCard
// //                 key={product.produit.id_produit}
// //                 product={product}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ProductPage;

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ChevronRight, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { stocksApi } from '../api/stocks';
// import { Product } from '../types/product';
// import LoadingSpinner from '../components/ui/LoadingSpinner';
// import ProductCard from '../components/ui/ProductCard';

// const ProductPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { addToCart } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [activeTab, setActiveTab] = useState('description');
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const productData = await stocksApi.getProductById(Number(id));
//         setProduct(productData);

//         // Fetch related products from the same family
//         if (productData.famille?.id_famille) {
//           const filters = {
//             page: 1,
//             limit: 4,
//             familleLibelle: productData.famille.libelle_famille,
//             exclude: productData.produit.id_produit.toString(),
//             sortBy: 'created_at',
//             sortOrder: 'desc'
//           };
          
//           const relatedResponse = await stocksApi.getProducts(filters);
//           setRelatedProducts(relatedResponse.data);
//         }

//         document.title = `${productData.produit.desi_produit} - DCAT Shop`;
//       } catch (err) {
//         setError('Produit introuvable ou erreur de chargement');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductData();
//   }, [id]);

//   const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
//   const increaseQuantity = () => setQuantity(prev => prev + 1);

//   const handleAddToCart = () => {
//     if (product) {
//       addToCart({
//         id: product.produit.id_produit,
//         name: product.produit.desi_produit,
//         price: parseFloat(product.produit.prix_produit),
//         image: product.images[0]?.url || '/placeholder-product.png',
//         quantity,
//         brand: product.marque?.libelle_marque || '',
//         category: product.famille?.libelle_famille || '',
//         stock: product.produit.qte_produit,
//         location: product.produit.emplacement_produit || ''
//       });
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error || !product) {
//     return (
//       <div className="container py-16 text-center">
//         <h1 className="text-3xl font-bold mb-4">{error || 'Produit introuvable'}</h1>
//         <Link to="/catalog" className="btn btn-primary">
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
//           <li><Link to="/">Accueil</Link></li>
//           <li><Link to="/catalog">Catalogue</Link></li>
//           <li>{product.produit.desi_produit}</li>
//         </ul>
//       </div>

//       {/* Product Details */}
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Images */}
//         <div>
//           <div className="bg-base-200 rounded-lg h-96 flex items-center justify-center">
//             <img
//               src={product.images[selectedImage]?.url || '/placeholder-product.png'}
//               alt={product.produit.desi_produit}
//               className="max-h-full"
//             />
//           </div>
//           {product.images.length > 1 && (
//             <div className="grid grid-cols-4 gap-2 mt-4">
//               {product.images.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
//                 >
//                   <img src={img.url} alt="" className="h-20 w-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Info */}
//         <div>
//           <h1 className="text-3xl font-bold">{product.produit.desi_produit}</h1>
          
//           {product.marque?.libelle_marque && (
//             <div className="text-lg text-gray-600 mb-2">
//               Marque: {product.marque.libelle_marque}
//             </div>
//           )}

//           <div className="text-2xl font-bold my-4">
//             {parseFloat(product.produit.prix_produit).toLocaleString('fr-FR')} FCFA
//           </div>

//           <div className="mb-6 space-y-2">
//             <div className="text-gray-600">
//               <span className="font-medium">Référence:</span> {product.produit.code_produit}
//             </div>
//             {product.produit.emplacement_produit && (
//               <div className="text-gray-600">
//                 <span className="font-medium">Emplacement:</span> {product.produit.emplacement_produit}
//               </div>
//             )}
//             {product.modele?.libelle_modele && (
//               <div className="text-gray-600">
//                 <span className="font-medium">Modèle:</span> {product.modele.libelle_modele}
//               </div>
//             )}
//             {product.produit.qte_produit > 0 && (
//               <div className="text-gray-600">
//                 <span className="font-medium">Stock:</span> {product.produit.qte_produit} unités disponibles
//               </div>
//             )}
//           </div>

//           {/* Add to Cart */}
//           <div className="flex items-center gap-4 my-6">
//             <div className="flex border rounded-lg">
//               <button onClick={decreaseQuantity} className="px-3 py-2">
//                 <Minus size={16} />
//               </button>
//               <input
//                 type="number"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
//                 className="w-12 text-center border-x"
//               />
//               <button onClick={increaseQuantity} className="px-3 py-2">
//                 <Plus size={16} />
//               </button>
//             </div>
//             <button
//               onClick={handleAddToCart}
//               className="btn btn-primary flex-1"
//             >
//               Ajouter au panier
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="tabs my-6">
//             <button
//               className={`tab tab-bordered ${activeTab === 'description' ? 'tab-active' : ''}`}
//               onClick={() => setActiveTab('description')}
//             >
//               Description
//             </button>
//             <button
//               className={`tab tab-bordered ${activeTab === 'specs' ? 'tab-active' : ''}`}
//               onClick={() => setActiveTab('specs')}
//             >
//               Caractéristiques
//             </button>
//           </div>

//           <div className="prose">
//             {activeTab === 'description' && (
//               <div>
//                 <p>{product.produit.desc_produit}</p>
//                 {product.produit.created_at && (
//                   <p className="text-sm text-gray-500 mt-4">
//                     Ajouté le: {new Date(product.produit.created_at).toLocaleDateString('fr-FR')}
//                   </p>
//                 )}
//               </div>
//             )}
//             {activeTab === 'specs' && (
//               <table className="table">
//                 <tbody>
//                   <tr>
//                     <td className="font-medium">Référence</td>
//                     <td>{product.produit.code_produit}</td>
//                   </tr>
//                   <tr>
//                     <td className="font-medium">Marque</td>
//                     <td>{product.marque?.libelle_marque || 'Non spécifié'}</td>
//                   </tr>
//                   <tr>
//                     <td className="font-medium">Famille</td>
//                     <td>{product.famille?.libelle_famille || 'Non spécifié'}</td>
//                   </tr>
//                   <tr>
//                     <td className="font-medium">Catégorie</td>
//                     <td>{product.category?.libelle || 'Non spécifié'}</td>
//                   </tr>
//                   <tr>
//                     <td className="font-medium">Type</td>
//                     <td>{product.type?.libelle || 'Non spécifié'}</td>
//                   </tr>
//                   <tr>
//                     <td className="font-medium">Modèle</td>
//                     <td>{product.modele?.libelle_modele || 'Non spécifié'}</td>
//                   </tr>
//                   <tr>
//                     <td className="font-medium">Date de création</td>
//                     <td>
//                       {product.produit.created_at 
//                         ? new Date(product.produit.created_at).toLocaleDateString('fr-FR')
//                         : 'Non spécifié'}
//                     </td>
//                   </tr>
//                   {product.produit.caracteristiques_produit && (
//                     <tr>
//                       <td className="font-medium">Caractéristiques</td>
//                       <td className="whitespace-pre-line">
//                         {product.produit.caracteristiques_produit}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-16">
//           <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
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
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
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

        // Fetch related products from the same family
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
        location: product.produit.emplacement_produit || ''
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{error || 'Produit introuvable'}</h1>
        <Link to="/catalog" className="btn btn-primary">
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
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/catalog">Catalogue</Link></li>
          <li>{product.produit.desi_produit}</li>
        </ul>
      </div>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-base-200 rounded-lg h-96 flex items-center justify-center">
            <img
              src={product.images[selectedImage]?.url || '/placeholder-product.png'}
              alt={product.produit.desi_produit}
              className="max-h-full"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.produit.desi_produit}</h1>
          
          {product.marque?.libelle_marque && (
            <div className="text-lg text-gray-600 mb-2">
              Marque: {product.marque.libelle_marque}
            </div>
          )}

          <div className="text-2xl font-bold my-4">
            {parseFloat(product.produit.prix_produit).toLocaleString('fr-FR')} FCFA
          </div>

          <div className="mb-6 space-y-2">
            <div className="text-gray-600">
              <span className="font-medium">Référence:</span> {product.produit.code_produit}
            </div>
            {product.produit.emplacement_produit && (
              <div className="text-gray-600">
                <span className="font-medium">Emplacement:</span> {product.produit.emplacement_produit}
              </div>
            )}
            {product.modele?.libelle_modele && (
              <div className="text-gray-600">
                <span className="font-medium">Modèle:</span> {product.modele.libelle_modele}
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex border rounded-lg">
              <button onClick={decreaseQuantity} className="px-3 py-2">
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-12 text-center border-x"
              />
              <button onClick={increaseQuantity} className="px-3 py-2">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary flex-1"
            >
              Ajouter au panier
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs my-6">
            <button
              className={`tab tab-bordered ${activeTab === 'description' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab tab-bordered ${activeTab === 'specs' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Caractéristiques
            </button>
          </div>

          <div className="prose">
            {activeTab === 'description' && (
              <div>
                <p>{product.produit.desc_produit}</p>
                {product.produit.created_at && (
                  <p className="text-sm text-gray-500 mt-4">
                    Ajouté le: {new Date(product.produit.created_at).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            )}
            {activeTab === 'specs' && (
              <table className="table">
                <tbody>
                  <tr>
                    <td className="font-medium">Référence</td>
                    <td>{product.produit.code_produit}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Marque</td>
                    <td>{product.marque?.libelle_marque || 'Non spécifié'}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Famille</td>
                    <td>{product.famille?.libelle_famille || 'Non spécifié'}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Catégorie</td>
                    <td>{product.category?.libelle || 'Non spécifié'}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Type</td>
                    <td>{product.type?.libelle || 'Non spécifié'}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Modèle</td>
                    <td>{product.modele?.libelle_modele || 'Non spécifié'}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Date de création</td>
                    <td>
                      {product.produit.created_at 
                        ? new Date(product.produit.created_at).toLocaleDateString('fr-FR')
                        : 'Non spécifié'}
                    </td>
                  </tr>
                  {product.produit.caracteristiques_produit && (
                    <tr>
                      <td className="font-medium">Caractéristiques</td>
                      <td className="whitespace-pre-line">
                        {product.produit.caracteristiques_produit}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
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