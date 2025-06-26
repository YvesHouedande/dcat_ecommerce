// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
// import ProductCard from '../components/ui/ProductCard';
// import { stocksApi } from '../api/stocks';
// import { Product, Famille, Marque, PaginatedResponse } from '../types/product';
// import LoadingSpinner from '../components/ui/LoadingSpinner';

// const CatalogPage: React.FC = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [productsData, setProductsData] = useState<PaginatedResponse<Product> | null>(null);
//   const [familles, setFamilles] = useState<Famille[]>([]);
//   const [marques, setMarques] = useState<Marque[]>([]);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const page = parseInt(searchParams.get('page') || '1');
//   const limit = 3;

//   // Filter states
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
//   const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

//   const fetchProducts = async (page: number) => {
//     try {
//       setLoading(true);
      
//       // Convert selected IDs to libelles
//       const selectedFamilleLibelles = familles
//         .filter(f => selectedCategories.includes(f.id_famille.toString()))
//         .map(f => f.libelle_famille)
//         .join(',');

//       const selectedMarqueLibelles = marques
//         .filter(m => selectedBrands.includes(m.id_marque?.toString() || ''))
//         .map(m => m.libelle_marque || '')
//         .filter(Boolean)
//         .join(',');

//       // Prepare sort parameters
//       const sortBy = 'updated_at';
//       const sortOrder = sortOption === 'newest' ? 'desc' : 'asc';

//       const filters = {
//         page,
//         limit,
//         prixMin: priceRange[0],
//         prixMax: priceRange[1],
//         familleLibelle: selectedFamilleLibelles,
//         marqueLibelle: selectedMarqueLibelles,
//         sortBy,
//         sortOrder
//       };

//       const data = await stocksApi.getProducts(filters);
//       setProductsData(data);
      
//       // Update URL params
//       const params: Record<string, string> = { page: page.toString() };
//       if (selectedFamilleLibelles) params.familleLibelle = selectedFamilleLibelles;
//       if (selectedMarqueLibelles) params.marqueLibelle = selectedMarqueLibelles;
//       if (priceRange[0] > 0 || priceRange[1] < 1000000) {
//         params.prixMin = priceRange[0].toString();
//         params.prixMax = priceRange[1].toString();
//       }
//       if (sortOption !== 'newest') params.sort = sortOption;
      
//       setSearchParams(params);
//     } catch (err) {
//       setError('Erreur lors du chargement des données');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     document.title = "Catalogue Produits - DCAT Shop";

//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
        
//         // Read filters from URL if present
//         const urlFamilleLibelle = searchParams.get('familleLibelle');
//         const urlMarqueLibelle = searchParams.get('marqueLibelle');
//         const urlPrixMin = searchParams.get('prixMin');
//         const urlPrixMax = searchParams.get('prixMax');
//         const urlSort = searchParams.get('sort');

//         // First load familles and marques
//         const [famillesData, marquesData] = await Promise.all([
//           stocksApi.getFamilles(),
//           stocksApi.getMarques()
//         ]);

//         setFamilles(famillesData);
//         setMarques(marquesData);

//         // Convert URL libelles to IDs after data is loaded
//         if (urlFamilleLibelle) {
//           const familleIds = famillesData
//             .filter(f => urlFamilleLibelle.split(',').includes(f.libelle_famille))
//             .map(f => f.id_famille.toString());
//           setSelectedCategories(familleIds);
//         }

//         if (urlMarqueLibelle) {
//           const marqueIds = marquesData
//             .filter(m => m.libelle_marque && urlMarqueLibelle.split(',').includes(m.libelle_marque))
//             .map(m => m.id_marque?.toString() || '');
//           setSelectedBrands(marqueIds);
//         }

//         if (urlPrixMin || urlPrixMax) {
//           setPriceRange([
//             urlPrixMin ? Number(urlPrixMin) : 0,
//             urlPrixMax ? Number(urlPrixMax) : 1000000
//           ]);
//         }

//         if (urlSort) {
//           setSortOption(urlSort as 'newest' | 'oldest');
//         }

//         await fetchProducts(page);
//       } catch (err) {
//         setError('Erreur lors du chargement des données');
//         console.error(err);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Refetch products when filters change
//   useEffect(() => {
//     if (productsData) {
//       fetchProducts(1);
//     }
//   }, [selectedCategories, selectedBrands, priceRange, sortOption]);

//   const handlePageChange = (newPage: number) => {
//     if (newPage < 1 || newPage > (productsData?.pagination.totalPages || 1)) return;
//     fetchProducts(newPage);
//   };

//   const toggleCategory = (id: string) => {
//     setSelectedCategories(prev => 
//       prev.includes(id) ? [] : [id] // Single selection
//     );
//   };

//   const toggleBrand = (id: string) => {
//     setSelectedBrands(prev => 
//       prev.includes(id) ? [] : [id] // Single selection
//     );
//   };

//   const clearFilters = () => {
//     setSelectedCategories([]);
//     setSelectedBrands([]);
//     setPriceRange([0, 1000000]);
//     setSortOption('newest');
//     setSearchParams({});
//   };

//   const getSortLabel = () => {
//     return sortOption === 'newest' ? 'Nouveautés' : 'Ancienneté';
//   };

//   if (loading && !productsData) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return (
//       <div className="container py-8 md:py-12">
//         <div className="alert alert-error">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-8 md:py-12">
//       <h1 className="text-3xl font-bold mb-8">Notre Catalogue</h1>

//       {/* Mobile filter toggle */}
//       <div className="flex md:hidden justify-between items-center mb-6">
//         <button
//           onClick={() => setIsFilterOpen(!isFilterOpen)}
//           className="btn btn-outline"
//         >
//           <Filter className="h-4 w-4 mr-2" />
//           Filtres
//         </button>

//         <div className="relative">
//           <button 
//             className="btn btn-outline flex items-center"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             Trier par: {getSortLabel()}
//             <ChevronDown className="h-4 w-4 ml-2" />
//           </button>
          
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-50 border border-gray-100">
//               <ul className="py-1">
//                 <li>
//                   <button 
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-50"
//                     onClick={() => {
//                       setSortOption('newest');
//                       setDropdownOpen(false);
//                     }}
//                   >
//                     Nouveautés
//                   </button>
//                 </li>
//                 <li>
//                   <button 
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-50"
//                     onClick={() => {
//                       setSortOption('oldest');
//                       setDropdownOpen(false);
//                     }}
//                   >
//                     Ancienneté
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row md:space-x-8">
//         {/* Filters - Sidebar */}
//         <aside className={`md:w-64 flex-shrink-0 pb-6 md:pb-0 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
//           <div className="sticky top-20 space-y-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-medium">Filtres</h2>
//               <button onClick={clearFilters} className="text-sm text-primary">
//                 Tout effacer
//               </button>
//             </div>

//             {/* Categories */}
//             <div className="border-b border-base-200 pb-6">
//               <h3 className="font-medium mb-4">Catégories</h3>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {familles.map((famille) => (
//                   <label key={famille.id_famille} className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={selectedCategories.includes(famille.id_famille.toString())}
//                       onChange={() => toggleCategory(famille.id_famille.toString())}
//                       className="checkbox checkbox-sm checkbox-primary mr-2"
//                     />
//                     <span>{famille.libelle_famille}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div className="border-b border-base-200 pb-6">
//               <h3 className="font-medium mb-4">Gamme de prix</h3>
//               <div className="space-y-4">
//                 <div className="flex space-x-4">
//                   <input
//                     type="number"
//                     min="0"
//                     value={priceRange[0]}
//                     onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
//                     className="input input-bordered w-full"
//                     placeholder="Min"
//                   />
//                   <span className="flex items-center">à</span>
//                   <input
//                     type="number"
//                     min={priceRange[0]}
//                     value={priceRange[1]}
//                     onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                     className="input input-bordered w-full"
//                     placeholder="Max"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Brands */}
//             <div className="border-b border-base-200 pb-6">
//               <h3 className="font-medium mb-4">Marques</h3>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {marques.map((marque) => (
//                   <label key={marque.id_marque} className="flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={selectedBrands.includes(marque.id_marque?.toString() || '')}
//                       onChange={() => toggleBrand(marque.id_marque?.toString() || '')}
//                       className="checkbox checkbox-sm checkbox-primary mr-2"
//                     />
//                     <span>{marque.libelle_marque || 'Non spécifié'}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1">
//           {/* Desktop sort and pagination info */}
//           <div className="hidden md:flex justify-between items-center mb-6">
//             <p className="text-gray-600">
//               {productsData?.pagination.total || 0} produits trouvés
//             </p>
//             <div className="relative">
//               <button 
//                 className="btn btn-outline flex items-center"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               >
//                 Trier par: {getSortLabel()}
//                 <ChevronDown className="h-4 w-4 ml-2" />
//               </button>
              
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-50 border border-gray-100">
//                   <ul className="py-1">
//                     <li>
//                       <button 
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-50"
//                         onClick={() => {
//                           setSortOption('newest');
//                           setDropdownOpen(false);
//                         }}
//                       >
//                         Nouveautés
//                       </button>
//                     </li>
//                     <li>
//                       <button 
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-50"
//                         onClick={() => {
//                           setSortOption('oldest');
//                           setDropdownOpen(false);
//                         }}
//                       >
//                         Ancienneté
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Products Grid */}
//           {productsData?.data && productsData.data.length > 0 ? (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {productsData.data.map((product) => (
//                   <ProductCard key={product.produit.id_produit} product={product} />
//                 ))}
//               </div>

//               {/* Pagination */}
//               {productsData.pagination.totalPages > 1 && (
//                 <div className="flex justify-center items-center mt-8 space-x-2">
//                   <button
//                     onClick={() => handlePageChange(page - 1)}
//                     disabled={page === 1}
//                     className="btn btn-outline btn-sm"
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </button>
                  
//                   <span className="px-4 py-2 bg-base-200 rounded-md">
//                     Page {page} sur {productsData.pagination.totalPages}
//                   </span>
                  
//                   <button
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page >= productsData.pagination.totalPages}
//                     className="btn btn-outline btn-sm"
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-16">
//               <p className="text-gray-600 mb-4">
//                 Aucun produit ne correspond à vos filtres.
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="btn btn-primary"
//               >
//                 Effacer les filtres
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CatalogPage;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { stocksApi } from '../api/stocks';
import { Product, Famille, Marque, PaginatedResponse } from '../types/product';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<PaginatedResponse<Product> | null>(null);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = 8;

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      
      // Convert selected IDs to libelles
      const selectedFamilleLibelles = familles
        .filter(f => selectedCategories.includes(f.id_famille.toString()))
        .map(f => f.libelle_famille)
        .join(',');

      const selectedMarqueLibelles = marques
        .filter(m => selectedBrands.includes(m.id_marque?.toString() || ''))
        .map(m => m.libelle_marque || '')
        .filter(Boolean)
        .join(',');

      // Prepare sort parameters
      const sortBy = 'updated_at';
      const sortOrder = sortOption === 'newest' ? 'desc' : 'asc';

      const filters = {
        page,
        limit,
        prixMin: priceRange[0],
        prixMax: priceRange[1],
        familleLibelle: selectedFamilleLibelles,
        marqueLibelle: selectedMarqueLibelles,
        sortBy,
        sortOrder
      };

      const data = await stocksApi.getProducts(filters);
      setProductsData(data);
      
      // Update URL params
      const params: Record<string, string> = { page: page.toString() };
      if (selectedFamilleLibelles) params.familleLibelle = selectedFamilleLibelles;
      if (selectedMarqueLibelles) params.marqueLibelle = selectedMarqueLibelles;
      if (priceRange[0] > 0 || priceRange[1] < 1000000) {
        params.prixMin = priceRange[0].toString();
        params.prixMax = priceRange[1].toString();
      }
      if (sortOption !== 'newest') params.sort = sortOption;
      
      setSearchParams(params);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    document.title = "Catalogue Produits - DCAT Shop";

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Read filters from URL if present
        const urlFamilleLibelle = searchParams.get('familleLibelle');
        const urlMarqueLibelle = searchParams.get('marqueLibelle');
        const urlPrixMin = searchParams.get('prixMin');
        const urlPrixMax = searchParams.get('prixMax');
        const urlSort = searchParams.get('sort');

        // First load familles and marques
        const [famillesData, marquesData] = await Promise.all([
          stocksApi.getFamilles(),
          stocksApi.getMarques()
        ]);

        setFamilles(famillesData);
        setMarques(marquesData);

        // Convert URL libelles to IDs after data is loaded
        if (urlFamilleLibelle) {
          const familleIds = famillesData
            .filter(f => urlFamilleLibelle.split(',').includes(f.libelle_famille))
            .map(f => f.id_famille.toString());
          setSelectedCategories(familleIds);
        }

        if (urlMarqueLibelle) {
          const marqueIds = marquesData
            .filter(m => m.libelle_marque && urlMarqueLibelle.split(',').includes(m.libelle_marque))
            .map(m => m.id_marque?.toString() || '');
          setSelectedBrands(marqueIds);
        }

        if (urlPrixMin || urlPrixMax) {
          setPriceRange([
            urlPrixMin ? Number(urlPrixMin) : 0,
            urlPrixMax ? Number(urlPrixMax) : 1000000
          ]);
        }

        if (urlSort) {
          setSortOption(urlSort as 'newest' | 'oldest');
        }

        await fetchProducts(page);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  // Refetch products when filters change
  useEffect(() => {
    if (productsData) {
      fetchProducts(1);
    }
  }, [selectedCategories, selectedBrands, priceRange, sortOption]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (productsData?.pagination.totalPages || 1)) return;
    fetchProducts(newPage);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? [] : [id] // Single selection
    );
  };

  const toggleBrand = (id: string) => {
    setSelectedBrands(prev => 
      prev.includes(id) ? [] : [id] // Single selection
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000000]);
    setSortOption('newest');
    setSearchParams({});
  };

  // Function that was missing - now properly defined
  const getSortLabel = () => {
    return sortOption === 'newest' ? 'Nouveautés' : 'Ancienneté';
  };

  if (loading && !productsData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with subdued color */}
      <section className="bg-blue-700 py-12 text-white">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">Notre Catalogue</h1>
          <p className="text-blue-100">Découvrez nos produits technologiques</p>
        </div>
      </section>

      <div className="container py-8">
        {/* Filter/Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Filtres</span>
            </button>
            
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Réinitialiser
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <p className="text-gray-600 text-sm hidden md:block">
              {productsData?.pagination.total || 0} produits
            </p>
            
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-gray-700">Trier : {getSortLabel()}</span>
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-50 border border-gray-200">
                  <ul className="py-1">
                    <li>
                      <button 
                        className={`block w-full text-left px-4 py-2 text-sm ${sortOption === 'newest' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => {
                          setSortOption('newest');
                          setDropdownOpen(false);
                        }}
                      >
                        Nouveautés
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`block w-full text-left px-4 py-2 text-sm ${sortOption === 'oldest' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => {
                          setSortOption('oldest');
                          setDropdownOpen(false);
                        }}
                      >
                        Ancienneté
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          {isFilterOpen && (
            <div className="md:w-64 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-gray-900">Filtres</h2>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="md:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Catégories</h3>
                  <div className="space-y-2">
                    {familles.map((famille) => (
                      <label key={famille.id_famille} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedCategories.includes(famille.id_famille.toString())}
                          onChange={() => toggleCategory(famille.id_famille.toString())}
                          className="h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{famille.libelle_famille}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Gamme de prix</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="0"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="flex-1 input input-bordered input-sm"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        min={priceRange[0]}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="flex-1 input input-bordered input-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Marques</h3>
                  <div className="space-y-2">
                    {marques.map((marque) => (
                      <label key={marque.id_marque} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedBrands.includes(marque.id_marque?.toString() || '')}
                          onChange={() => toggleBrand(marque.id_marque?.toString() || '')}
                          className="h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{marque.libelle_marque || 'Non spécifié'}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid */}
            {productsData?.data && productsData.data.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {productsData.data.map((product) => (
                    <ProductCard key={product.produit.id_produit} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {productsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {page} sur {productsData.pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= productsData.pagination.totalPages}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">
                  Aucun produit ne correspond à vos filtres.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-sm btn-primary"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;