// import React from "react";
// import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { productData } from "../../data/products";

// const FeaturedProducts: React.FC = () => {
//   const featuredProducts = productData
//     .filter((product) => product.featured)
//     .slice(0, 8);

//   // Custom arrow components for the slider
//   const PrevArrow = (props: any) => {
//     const { onClick } = props;
//     return (
//       <button
//         onClick={onClick}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-5 bg-white rounded-full shadow-md p-2 hover:bg-slate-50 focus:outline-none"
//       >
//         <ChevronLeft className="h-6 w-6 text-slate-800" />
//       </button>
//     );
//   };

//   const NextArrow = (props: any) => {
//     const { onClick } = props;
//     return (
//       <button
//         onClick={onClick}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-5 bg-white rounded-full shadow-md p-2 hover:bg-slate-50 focus:outline-none"
//       >
//         <ChevronRight className="h-6 w-6 text-slate-800" />
//       </button>
//     );
//   };

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     prevArrow: <PrevArrow />,
//     nextArrow: <NextArrow />,
//     responsive: [
//       {
//         breakpoint: 1280,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 640,
//         settings: {
//           slidesToShow: 1,
//           arrows: false,
//         },
//       },
//     ],
//   };

//   return (
//     <section className="py-16">
//       <div className="container">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
//           <h2 className="text-3xl font-serif font-bold">Produits en vedette</h2>
//           <Link
//             to="/catalog"
//             className="mt-4 sm:mt-0 text-amber-600 hover:text-amber-700 transition-colors font-medium flex items-center"
//           >
//             Voir tous les produits
//             <ChevronRight className="h-5 w-5 ml-1" />
//           </Link>
//         </div>

//         <div className="px-6">
//           <Slider {...settings}>
//             {featuredProducts.map((product) => (
//               <div key={product.id} className="px-3 pb-6">
//                 <Link to={`/product/${product.id}`} className="block">
//                   <div className="card h-full">
//                     <div className="relative pt-[100%]">
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="absolute top-0 left-0 w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="p-4">
//                       <div className="flex items-center mb-1">
//                         <span className="text-sm text-slate-500">
//                           {product.brand}
//                         </span>
//                         <span className="mx-2 text-slate-300">•</span>
//                         <span className="text-sm text-slate-500">
//                           {product.category}
//                         </span>
//                       </div>
//                       <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
//                         {product.name}
//                       </h3>
//                       <div className="flex items-center mb-3"></div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <span className="font-medium text-slate-900">
//                             {product.price.toFixed(2)} FCFA
//                           </span>
//                         </div>
//                         {product.inStock ? (
//                           <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
//                             En stock
//                           </span>
//                         ) : (
//                           <span className="text-xs font-medium text-amber-600 bg-red-50 px-2 py-1 rounded">
//                             Bientôt disponible
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { stocksApi } from "../../api/stocks";
import { Product } from "../../types/product";

const FeaturedProducts: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await stocksApi.getProducts({
          limit: 6,
          sortBy: 'updated_at',
          sortOrder: 'desc',
          inStockOnly: true
        });
        setFeaturedProducts(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des produits");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Custom arrow components for the slider
  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-5 bg-white rounded-full shadow-md p-2 hover:bg-slate-50 focus:outline-none"
        aria-label="Précédent"
      >
        <ChevronLeft className="h-6 w-6 text-slate-800" />
      </button>
    );
  };

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-5 bg-white rounded-full shadow-md p-2 hover:bg-slate-50 focus:outline-none"
        aria-label="Suivant"
      >
        <ChevronRight className="h-6 w-6 text-slate-800" />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-serif font-bold mb-10">Nos dernières pépites technologiques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-slate-200 h-64 rounded-lg"></div>
                <div className="mt-4 space-y-2">
                  <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
                  <div className="bg-slate-200 h-4 w-1/4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Nos dernières pépites technologiques</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold">Nos dernières pépites technologiques</h2>
            <p className="text-slate-600 mt-2">Découvrez les nouveautés qui vont révolutionner votre quotidien</p>
          </div>
          <Link
            to="/catalog"
            className="mt-4 sm:mt-0 text-amber-600 hover:text-amber-700 transition-colors font-medium flex items-center"
          >
            Voir tous les produits
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>

        <div className="px-6">
          <Slider {...settings}>
            {featuredProducts.map((product) => (
              <div key={product.produit.id_produit} className="px-3 pb-6">
                <Link to={`/produits/${product.produit.id_produit}`} className="block group">
                  <div className="card h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative pt-[100%] bg-slate-100">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.produit.desi_produit}
                          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-slate-400">
                          Image non disponible
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        <span className="text-slate-500 text-sm">
                          {product.marque?.libelle_marque || 'Marque inconnue'}
                        </span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="text-sm text-slate-500">
                          {product.famille?.libelle_famille || 'Catégorie inconnue'}
                        </span>
                      </div>
                      <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 h-12 text-xl">
                        {product.produit.desi_produit}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <span className="font-bold text-amber-600">
                            {new Intl.NumberFormat('fr-FR').format(product.produit.prix_produit)} FCFA
                          </span>
                        </div>
                        {product.produit.qte_produit > 0 ? (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            En stock
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            Sur commande
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
