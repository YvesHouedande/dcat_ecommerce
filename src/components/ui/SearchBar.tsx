import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stocksApi } from '../../api/stocks';

interface SearchBarProps {
  onClose?: () => void;
}

interface SearchResult {
  produit: {
    id_produit: number;
    code_produit: string;
    desi_produit: string;
    prix_produit: number | null;
  };
  images: {
    url: string;
  }[];
  famille: {
    libelle_famille: string;
  };
  marque: {
    libelle_marque: string;
  };
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus sur l'input au montage
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Gestion du clic externe et de la touche Échap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Recherche des produits
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const response = await stocksApi.getProducts({
            search: query,
            limit: 5
          });
          setResults(response.data);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (id: number) => {
    navigate(`/produits/${id}`);
    if (onClose) onClose();
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Prix non disponible';
    return price.toLocaleString() + ' FCFA';
  };

  return (
    <div ref={searchRef} className="w-full max-w-3xl mx-auto relative">
      {/* Bouton de fermeture pour mobile */}
      <button 
        onClick={onClose}
        className="md:hidden absolute -top-10 right-0 p-2 text-slate-500 hover:text-slate-700"
      >
        <X className="h-5 w-5" />
      </button>

      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des produits..."
          className="w-full px-4 py-2 md:py-3 pl-10 pr-12 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 text-sm md:text-base"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-slate-400" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-slate-100"
          >
            <X className="h-3 w-3 md:h-4 md:w-4 text-slate-400" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-amber-500 text-white p-1 rounded-full hover:bg-amber-600"
        >
          <Search className="h-3 w-3 md:h-4 md:w-4" />
        </button>
      </form>

      {(results.length > 0 || isLoading) && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-slate-200 max-h-80 md:max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500">Chargement...</div>
          ) : (
            <>
              <ul>
                {results.map((item) => (
                  <li key={item.produit.id_produit} className="border-b border-slate-100 last:border-none">
                    <button
                      onClick={() => handleResultClick(item.produit.id_produit)}
                      className="flex items-center p-2 md:p-3 w-full text-left hover:bg-slate-50 transition-colors"
                    >
                      {item.images.length > 0 && (
                        <img 
                          src={item.images[0].url} 
                          alt={item.produit.desi_produit} 
                          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded mr-3 md:mr-4" 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm md:text-base">{item.produit.desi_produit}</p>
                        <p className="text-xs md:text-sm text-slate-500 truncate">
                          {item.famille.libelle_famille} • {item.marque.libelle_marque}
                        </p>
                      </div>
                      <p className="ml-2 md:ml-4 font-medium text-amber-600 whitespace-nowrap text-sm md:text-base">
                        {formatPrice(item.produit.prix_produit)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-2 md:p-3 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={handleSearch}
                  className="w-full text-center text-slate-600 hover:text-amber-600 transition-colors text-sm md:text-base"
                >
                  Voir tous les résultats pour "{query}"
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;