import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Tableau de produits à faire défiler
const PRODUCT_SLIDES = [
  {
    image: "/slides/Produits/Image1.jpg",
    title: "Casques Professionnels",
    subtitle: "Équipements professionnels pour studios et radios"
  },
    {
    image: "/slides/Produits/Image2-1.jpg",
    title: "Consoles de Mixage",
    subtitle: "Équipements professionnels pour Régisseur technique"
  },
  {
    image: "/slides/Produits/Image2.webp",
    title: "Ampoules Connectées",
    subtitle: "Automatisez votre habitat avec nos solutions connectées"
  },
  {
    image: "/slides/Produits/Image3.jpg",
    title: "chargeur de batterie",
    subtitle: "Systèmes durables pour une indépendance énergétique"
  },
  {
    image: "/slides/Produits/Image4.webp",
    title: "Detecteurs de mouvement",
    subtitle: "Sécurisez votre habitat avec nos détecteurs de mouvement"
  },
  {
    image: "/slides/Produits/Image5.webp",
    title: "Informatique Professionnelle",
    subtitle: "Matériel performant pour vos besoins technologiques"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-rotation des slides
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % PRODUCT_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Carrousel d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={PRODUCT_SLIDES[currentSlide].image}
              alt={PRODUCT_SLIDES[currentSlide].title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Contenu principal */}
      <div className="container relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-2xl animate-slide-in">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
                {PRODUCT_SLIDES[currentSlide].title}
              </h1>
              <p className="text-xl text-slate-100 mb-8 drop-shadow-md">
                {PRODUCT_SLIDES[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-4">
            <Link 
              to="/catalog" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-lg"
            >
              Explorer le catalogue
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-6 py-3 rounded-md font-medium transition-colors flex items-center"
            >
              Demander un devis
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contrôles du carrousel */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container flex justify-between items-center">
          <div className="flex space-x-2">
            {PRODUCT_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${currentSlide === index ? 'bg-amber-500 w-6' : 'bg-white/50 w-2'}`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={togglePlay}
            className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Badge de catégories */}
      <div className="absolute top-8 right-8 z-10 hidden md:block">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
          <div className="flex space-x-3 text-sm text-white font-medium">
            <span>Audiovisuel</span>
            <span>•</span>
            <span>Domotique</span>
            <span>•</span>
            <span>Solaire</span>
            <span>•</span>
            <span>IoT</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
