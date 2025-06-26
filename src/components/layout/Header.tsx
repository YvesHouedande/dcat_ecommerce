import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, Phone, Mail, Headphones, Play, Pause } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../ui/SearchBar";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleServicesClick = () => {
    if (location.pathname !== '/about') {
      navigate('/about', { state: { scrollTo: 'expertise' } });
    } else {
      const element = document.getElementById('expertise');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo === 'expertise') {
      const element = document.getElementById('expertise');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Audio Element (hidden) */}
      <audio 
        ref={audioRef} 
        src="https://media.dcat.ci/stream" 
        loop
        onEnded={() => setIsPlaying(false)}
      />

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white md:bg-transparent"
        }`}
      >
        {/* Top Contact Bar - Desktop only */}
        <div className="hidden md:flex bg-amber-800 text-white text-sm justify-center py-1 px-4">
          <div className="container flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="tel:+2252721373363" className="flex items-center hover:underline">
                <div className="flex items-center justify-center w-5 h-5 mr-2">
                  <Phone className="h-4 w-4" />
                </div>
                +225 27 21 37 33 63
              </a>
              <a href="https://wa.me/+22508878490" className="flex items-center hover:underline">
                <div className="flex items-center justify-center w-5 h-5 mr-2">
                </div>
                WhatsApp
              </a>
              <a href="mailto:infos@dcat.ci" className="flex items-center hover:underline">
                <div className="flex items-center justify-center w-5 h-5 mr-2">
                  <Mail className="h-4 w-4" />
                </div>
                infos@dcat.ci
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span>Livraison gratuite à partir de 100.000 FCFA</span>
              <button 
                onClick={togglePlay}
                className={`flex items-center ml-2 px-3 py-1 rounded-full ${isPlaying ? 'bg-amber-600' : 'bg-amber-900 hover:bg-amber-700'}`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    <span>En écoute</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    <span>Écouter DCAT FM</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="container py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="DCAT Shop Logo" 
                className="h-8 w-auto"
              />
              <span className="text-2xl font-serif font-bold">Shop</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="px-3 py-2 text-slate-800 hover:text-amber-500 transition-colors font-medium"
              >
                Accueil
              </Link>
              <Link
                to="/catalog"
                className="px-3 py-2 text-slate-800 hover:text-amber-500 transition-colors font-medium"
              >
                Nos Produits
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 text-slate-800 hover:text-amber-500 transition-colors font-medium"
              >
                À Propos De Nous
              </Link>
              
              {/* Audio Player - Desktop */}
              <button 
                onClick={togglePlay}
                className={`flex items-center px-3 py-2 rounded-full ${isPlaying ? 'bg-amber-100 text-amber-800' : 'hover:bg-amber-50 text-slate-800'}`}
                title={isPlaying ? "Arrêter l'écoute" : "Écouter en direct"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                <span className="ml-1 hidden lg:inline">Ecouter DCAT FM</span>
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>

              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-b-lg p-4 animate-fade-in">
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg animate-fade-in">
            <nav className="flex flex-col py-4">
              <Link to="/" className="px-6 py-3 text-slate-800 hover:bg-slate-50 flex items-center">
                Accueil
              </Link>
              <Link
                to="/catalog"
                className="px-6 py-3 text-slate-800 hover:bg-slate-50 flex items-center"
              >
                Nos Produits
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 text-slate-800 hover:bg-slate-50 flex items-center"
              >
                À Propos De Nous
              </Link>
              <div className="border-t border-slate-100 mt-2 pt-2">
                <a 
                  href="tel:+2252721373363" 
                  className="px-6 py-3 text-slate-800 hover:bg-slate-50 flex items-center"
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-3">
                    <Phone className="h-5 w-5 text-amber-500" />
                  </div>
                  +225 27 21 37 33 63
                </a>
                <a 
                  href="https://wa.me/2252721373363" 
                  className="px-6 py-3 text-slate-800 hover:bg-slate-50 flex items-center"
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-3">
                    <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29 13.883c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10"/>
                    </svg>
                  </div>
                  WhatsApp
                </a>
                <a 
                  href="mailto:infos@dcat.ci" 
                  className="px-6 py-3 text-slate-800 hover:bg-slate-50 flex items-center"
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-3">
                    <Mail className="h-5 w-5 text-amber-500" />
                  </div>
                  infos@dcat.ci
                </a>
                <button 
                  onClick={togglePlay}
                  className="px-6 py-3 text-slate-800 hover:bg-slate-50 flex items-center w-full text-left"
                >
                  <Headphones className="h-5 w-5 mr-3 text-amber-500" />
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 mr-2 text-amber-500" />
                      <span>Arrêter l'écoute</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2 text-amber-500" />
                      <span>Écouter DCAT FM</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
