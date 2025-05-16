import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { stocksApi } from '../api/stocks';
import { Product, Famille, Marque } from '../types/product';

const CatalogPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('featured');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        document.title = "Catalogue Produits - DCAT Shop";

        const [productsData, famillesData, marquesData] = await Promise.all([
          stocksApi.getProducts(),
          stocksApi.getFamilles(),
          stocksApi.getMarques()
        ]);

        setProducts(productsData);
        setFamilles(famillesData);
        setMarques(marquesData);
        setFilteredProducts(productsData);

        // Initialize from URL params
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        
        if (category) setSelectedCategories([category]);
        if (brand) setSelectedBrands([brand]);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    if (products.length === 0) return;

    let results = products.filter(product => {
      // Category filter
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(product.id_famille.toString());
      
      // Brand filter
      const brandMatch = selectedBrands.length === 0 ||
        selectedBrands.includes(product.id_marque.toString());
      
      // Price filter
      const price = parseFloat(product.prix_produit);
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];
      
      // Stock filter
      const stockMatch = !inStockOnly || product.qte_produit > 0;
      
      return categoryMatch && brandMatch && priceMatch && stockMatch;
    });

    // Sorting
    results.sort((a, b) => {
      const priceA = parseFloat(a.prix_produit);
      const priceB = parseFloat(b.prix_produit);
      
      switch (sortOption) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'newest': 
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });

    setFilteredProducts(results);
  }, [products, selectedCategories, selectedBrands, priceRange, inStockOnly, sortOption]);

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
    setPriceRange([0, 100000000]);
    setInStockOnly(false);
  };

  if (loading) {
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
            <option value="featured">Recommandés</option>
            <option value="price-asc">Prix : croissant</option>
            <option value="price-desc">Prix : décroissant</option>
            <option value="newest">Nouveautés</option>
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
                  />
                  <span className="text-slate-500">à</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full rounded border-slate-300 focus:ring-amber-500"
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
                      checked={selectedBrands.includes(marque.id_marque.toString())}
                      onChange={() => toggleBrand(marque.id_marque.toString())}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-slate-700">{marque.libelle_marque}</span>
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
          {/* Desktop sort */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <p className="text-slate-600">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-slate-600">Trier par:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-slate-300 rounded-md px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="featured">Recommandés</option>
                  <option value="price-asc">Prix : croissant</option>
                  <option value="price-desc">Prix : décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id_produit}
                  product={{
                    id: product.id_produit,
                    name: product.desi_produit,
                    description: product.desc_produit,
                    price: parseFloat(product.prix_produit),
                    imageUrl: product.image_url,
                    inStock: product.qte_produit > 0,
                    features: product.caracteristiques_produit,
                    code: product.code_produit
                  }}
                />
              ))}
            </div>
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
