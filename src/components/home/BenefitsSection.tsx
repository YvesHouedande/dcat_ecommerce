import React from 'react';
import { Zap, ShieldCheck, RefreshCw, Headphones, Settings, Globe } from "lucide-react";

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  benefits?: BenefitItem[]; // Optionnel pour permettre la personnalisation
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  const defaultBenefits: BenefitItem[] = [
    {
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "Livraison Express",
      description: "Expédition sous 24h pour les produits en stock",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-amber-500" />,
      title: "Garantie Étendue",
      description: "2 ans de garantie sur tous nos équipements",
    },
    {
      icon: <Settings className="h-8 w-8 text-amber-500" />,
      title: "Installation Pro",
      description: "Service d'installation par nos techniciens certifiés",
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-amber-500" />,
      title: "Satisfait ou Remboursé",
      description: "15 jours pour changer d'avis",
    },
    {
      icon: <Headphones className="h-8 w-8 text-amber-500" />,
      title: "Support Technique",
      description: "Assistance 7j/7 pour vos équipements",
    },
    {
      icon: <Globe className="h-8 w-8 text-amber-500" />,
      title: "Livraison Nationale",
      description: "Partout en Côte d'Ivoire sans frais supplémentaires",
    },
  ];

  const benefitsToDisplay = benefits || defaultBenefits;

  return (
    <div className=" py-16"> 
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold  mb-4">
            Pourquoi choisir DCAT Shop ?
          </h2>
          <p className="text-lg  max-w-2xl mx-auto">
            L'excellence technologique et un service client hors pair
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitsToDisplay.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 flex flex-col items-center text-center border border-blue-100 hover:border-blue-200 transition-all hover:shadow-lg"
            >
              <div className="p-4 bg-blue-50 rounded-full mb-5">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 ">
                {benefit.title}
              </h3>
              <p className="">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;