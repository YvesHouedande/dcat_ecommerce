import React from 'react';
import { Zap, ShieldCheck, RefreshCw } from "lucide-react";

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
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Expédition rapide",
      description: "Commandes préparées et envoyées dans un délai très court",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-amber-500" />,
      title: "Produit authentique",
      description: "Qualité garantie, sans contrefaçon",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-amber-500" />,
      title: "Service d'installation",
      description: "Nous proposons l'installation professionnelle de vos produits, sur demande",
    },
  ];

  const benefitsToDisplay = benefits || defaultBenefits;

  return (
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefitsToDisplay.map((benefit, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl p-6 flex flex-col items-center text-center"
          >
            <div className="p-3 bg-white rounded-lg shadow-sm mb-4">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2">
              {benefit.title}
            </h3>
            <p className="text-slate-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;