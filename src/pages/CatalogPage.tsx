import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { stocksApi } from '../api/stocks';
import { Product, Famille, Marque, PaginatedResponse } from '../types/product';

const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<PaginatedResponse<Product> | null>(null);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current page from URL or default to 1
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('newest');

  // Fetch products with filters and pagination
  // const fetchProducts = async (page: number) => {
  //   try {
  //     setLoading(true);
      
  //     // Convert selected IDs to libelles
  //     const selectedFamilleLibelles = familles
  //       .filter(f => selectedCategories.includes(f.id_famille.toString()))
  //       .map(f => f.libelle_famille)
  //       .join(',');

  //     const selectedMarqueLibelles = marques
  //       .filter(m => selectedBrands.includes(m.id_marque?.toString() || ''))
  //       .map(m => m.libelle_marque || '')
  //       .filter(Boolean)
  //       .join(',');

  //     // Prepare filters for backend
  //     const filters = {
  //       page,
  //       limit,
  //       minPrice: priceRange[0],
  //       maxPrice: priceRange[1],
  //       familleLibelle: selectedFamilleLibelles,
  //       marqueLibelle: selectedMarqueLibelles,
  //       inStockOnly,
  //       sort: sortOption
  //     };

  //     const data = await stocksApi.getProducts(filters);
  //     setProductsData(data);
      
  //     // Update URL params
  //     const params: Record<string, string> = { page: page.toString() };
  //     if (selectedFamilleLibelles) params.familleLibelle = selectedFamilleLibelles;
  //     if (selectedMarqueLibelles) params.marqueLibelle = selectedMarqueLibelles;
  //     if (priceRange[0] > 0 || priceRange[1] < 1000000) {
  //       params.prixMin = priceRange[0].toString();
  //       params.Prixmax = priceRange[1].toString();
  //     }
  //     if (inStockOnly) params.inStock = 'true';
  //     if (sortOption !== 'newest') params.sort = sortOption;
      
  //     setSearchParams(params);
  //   } catch (err) {
  //     setError('Erreur lors du chargement des données');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      
      const selectedFamilleLibelles = familles
        .filter(f => selectedCategories.includes(f.id_famille.toString()))
        .map(f => f.libelle_famille)
        .join(',');
  
      const selectedMarqueLibelles = marques
        .filter(m => selectedBrands.includes(m.id_marque?.toString() || ''))
        .map(m => m.libelle_marque || '')
        .filter(Boolean)
        .join(',');
  
      // Changé ici pour utiliser prixMin/prixMax
      const filters = {
        page,
        limit,
        prixMin: priceRange[0],  // Changé de minPrice à prixMin
        prixMax: priceRange[1],  // Changé de maxPrice à prixMax
        familleLibelle: selectedFamilleLibelles,
        marqueLibelle: selectedMarqueLibelles,
        inStockOnly,
        sort: sortOption
      };
  
      const data = await stocksApi.getProducts(filters);
      setProductsData(data);
      
      // Mise à jour des paramètres URL
      const params: Record<string, string> = { page: page.toString() };
      if (selectedFamilleLibelles) params.familleLibelle = selectedFamilleLibelles;
      if (selectedMarqueLibelles) params.marqueLibelle = selectedMarqueLibelles;
      if (priceRange[0] > 0 || priceRange[1] < 1000000) {
        params.prixMin = priceRange[0].toString();  // Changé ici
        params.prixMax = priceRange[1].toString();  // Changé ici
      }
      if (inStockOnly) params.inStock = 'true';
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
        
        // Lire les filtres depuis l'URL
        const urlFamilleLibelle = searchParams.get('familleLibelle');
        const urlMarqueLibelle = searchParams.get('marqueLibelle');
        const urlPrixMin = searchParams.get('prixMin');  // Changé ici
        const urlPrixMax = searchParams.get('prixMax');  // Changé ici
        const urlInStock = searchParams.get('inStock');
        const urlSort = searchParams.get('sort');
  
        // Charger d'abord les familles et marques
        const [famillesData, marquesData] = await Promise.all([
          stocksApi.getFamilles(),
          stocksApi.getMarques()
        ]);
  
        setFamilles(famillesData);
        setMarques(marquesData);
  
        // Convertir les libellés en IDs après avoir chargé les données
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
  
        // Changé ici pour utiliser prixMin/prixMax
        if (urlPrixMin || urlPrixMax) {
          setPriceRange([
            urlPrixMin ? Number(urlPrixMin) : 0,
            urlPrixMax ? Number(urlPrixMax) : 1000000
          ]);
        }
        if (urlInStock) setInStockOnly(urlInStock === 'true');
        if (urlSort) setSortOption(urlSort);
  
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
      fetchProducts(1); // Reset to page 1 when filters change
    }
  }, [selectedCategories, selectedBrands, priceRange, inStockOnly, sortOption]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (productsData?.pagination.totalPages || 1)) return;
    fetchProducts(newPage);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleBrand = (id: string) => {
    setSelectedBrands(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000000]);
    setInStockOnly(false);
    setSortOption('newest');
    setSearchParams({});
  };

  if (loading && !productsData) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Notre Catalogue</h1>

      {/* Mobile filter toggle */}
      <div className="flex md:hidden justify-between items-center mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 border border-slate-300 rounded-md px-4 py-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
        </button>

        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-slate-300 rounded-md px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="newest">Nouveautés</option>
            <option value="price-asc">Prix : croissant</option>
            <option value="price-desc">Prix : décroissant</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Filters - Sidebar */}
        <aside className={`md:w-64 flex-shrink-0 pb-6 md:pb-0 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-20 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Filtres</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-amber-600 hover:text-amber-500"
              >
                Tout effacer
              </button>
            </div>

            {/* Categories */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="font-medium mb-4">Catégories</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {familles.map((famille) => (
                  <label key={famille.id_famille} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(famille.id_famille.toString())}
                      onChange={() => toggleCategory(famille.id_famille.toString())}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-slate-700">{famille.libelle_famille}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="font-medium mb-4">Gamme de prix</h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="number"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full rounded border-slate-300 focus:ring-amber-500"
                    placeholder="Min"
                  />
                  <span className="text-slate-500">à</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full rounded border-slate-300 focus:ring-amber-500"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="font-medium mb-4">Marques</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {marques.map((marque) => (
                  <label key={marque.id_marque} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(marque.id_marque?.toString() || '')}
                      onChange={() => toggleBrand(marque.id_marque?.toString() || '')}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-slate-700">{marque.libelle_marque || 'Non spécifié'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-medium mb-4">Disponibilité</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="ml-2 text-slate-700">En stock seulement</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop sort and pagination info */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <p className="text-slate-600">
              {productsData?.pagination.total || 0} produits trouvés
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-slate-600">Trier par:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-slate-300 rounded-md px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="newest">Nouveautés</option>
                  <option value="price-asc">Prix : croissant</option>
                  <option value="price-desc">Prix : décroissant</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {productsData?.data && productsData.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.data.map((product) => (
                  <ProductCard
                    key={product.produit.id_produit}
                    product={product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {productsData && productsData.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-md border disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md">
                    Page {page} sur {productsData.pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= productsData.pagination.totalPages}
                    className="p-2 rounded-md border disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-600 mb-4">
                Aucun produit ne correspond à vos filtres.
              </p>
              <button
                onClick={clearFilters}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md"
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;