import React from "react";
import { MapPin, Phone, Mail, Users, Award, Server, Shield, Cable, Settings, Wifi, Radio, Home, Cpu } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-blue-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">À Propos de DCAT</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Pionnière des solutions technologiques en Afrique depuis 2004
          </p>
        </div>
      </section>

      {/* Navigation Interne */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container flex overflow-x-auto py-4 space-x-6">
          <a href="#presentation" className="whitespace-nowrap text-blue-600 hover:text-blue-800">
            Notre Entreprise
          </a>
          <a href="#expertise" className="whitespace-nowrap text-blue-600 hover:text-blue-800">
            Domaines d'Expertise
          </a>
          <a href="#equipe" className="whitespace-nowrap text-blue-600 hover:text-blue-800">
            Notre Équipe
          </a>
          <a href="#realisations" className="whitespace-nowrap text-blue-600 hover:text-blue-800">
            Nos Réalisations
          </a>
          <a href="#localisation" className="whitespace-nowrap text-blue-600 hover:text-blue-800">
            Nous Trouver
          </a>
          <a href="#contact" className="whitespace-nowrap text-blue-600 hover:text-blue-800">
            Contact
          </a>
        </div>
      </nav>

      <div className="container py-16 space-y-20">
        {/* Présentation */}
        <section id="presentation" className="scroll-mt-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-800 mb-6">
                <Users className="inline mr-3 h-8 w-8" />
                Notre Histoire
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Fondée en 2004, <strong>Data Communications & All Technologies (DCAT)</strong> s'est imposée comme un leader des solutions technologiques innovantes en Côte d'Ivoire et en Afrique.
              </p>
              <p className="text-gray-600 mb-6">
                Depuis près de 20 ans, nous accompagnons entreprises et institutions dans leur transformation digitale avec des solutions sur mesure et un savoir-faire reconnu.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">Notre Mission</h3>
                <p className="text-gray-700">
                  "Fournir des solutions technologiques intégrées qui améliorent l'efficacité opérationnelle et créent de la valeur pour nos clients à travers l'innovation."
                </p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg" 
                alt="Équipe DCAT" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Domaines d'Expertise */}
        <section id="expertise" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              <Award className="inline mr-3 h-8 w-8" />
              Nos Domaines d'Expertise
            </h2>
            <p className="text-lg text-blue-600 max-w-3xl mx-auto">
              Découvrez nos pôles d'excellence et les services associés
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Réseaux & Infrastructure */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-blue-600 p-6 flex items-center">
                <Server className="h-8 w-8 text-white mr-4" />
                <h3 className="text-xl font-bold text-white">Réseaux & Infrastructure</h3>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Services clés :</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Conception et déploiement d'infrastructures réseaux</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Câblage structuré (cuivre/fibre optique)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Solutions WAN/LAN sécurisées</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Virtualisation et cloud hybride</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Maintenance préventive et corrective</span>
                  </li>
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-blue-600">
                    <Wifi className="h-4 w-4 mr-2" />
                    <span>+150 infrastructures déployées</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Domotique & Sécurité */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-blue-600 p-6 flex items-center">
                <Shield className="h-8 w-8 text-white mr-4" />
                <h3 className="text-xl font-bold text-white">Domotique & Sécurité</h3>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Services clés :</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Automatisation résidentielle et tertiaire</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Systèmes de sécurité intégrés</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Contrôle d'accès biométrique</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Vidéosurveillance IP haute définition</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Gestion énergétique intelligente</span>
                  </li>
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-blue-600">
                    <Home className="h-4 w-4 mr-2" />
                    <span>+80 installations domotiques complètes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Télécom & Audiovisuel */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-blue-600 p-6 flex items-center">
                <Cable className="h-8 w-8 text-white mr-4" />
                <h3 className="text-xl font-bold text-white">Télécom & Audiovisuel</h3>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Services clés :</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Stations radio/TV clés en main</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Solutions de streaming professionnel</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Sonorisation d'événements et installations fixes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Régies mobiles et studios</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Réseaux de télécommunication</span>
                  </li>
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-blue-600">
                    <Radio className="h-4 w-4 mr-2" />
                    <span>+60 médias équipés</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Équipe & Réalisations */}
        <section id="equipe" className="scroll-mt-20">
          <div className="bg-blue-50 rounded-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-8">
              <Users className="inline mr-3 h-8 w-8" />
              Notre Équipe
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-6">
                  Notre force réside dans notre équipe pluridisciplinaire composée d'experts chevronnés :
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-2 mr-4">
                      <Wifi className="h-5 w-5" />
                    </span>
                    <span>
                      <strong>1 Ingénieur Électronicien</strong> - 30+ ans d'expérience
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-2 mr-4">
                      <Radio className="h-5 w-5" />
                    </span>
                    <span>
                      <strong>1 Technicien Radio FM</strong> - 22+ ans d'expérience
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-2 mr-4">
                      <Cpu className="h-5 w-5" />
                    </span>
                    <span>
                      <strong>2 Informaticiens réseaux</strong> - Experts en infrastructure
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full p-2 mr-4">
                      <Award className="h-5 w-5" />
                    </span>
                    <span>
                      <strong>1 Chef de projet digital</strong> - Gestion de projets complexes
                    </span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg" 
                  alt="Équipe technique DCAT" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Réalisations */}
        <section id="realisations" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
            <Award className="inline mr-3 h-8 w-8" />
            Nos Réalisations
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "300+ Projets",
                description: "Solutions techniques déployées à travers l'Afrique",
                icon: <Award className="h-8 w-8 text-amber-500" />
              },
              {
                title: "50+ Radios",
                description: "Stations radio équipées et maintenues",
                icon: <Radio className="h-8 w-8 text-amber-500" />
              },
              {
                title: "100+ Clients",
                description: "Entreprises et institutions satisfaites",
                icon: <Users className="h-8 w-8 text-amber-500" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Localisation */}
        <section id="localisation" className="scroll-mt-20">
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-blue-800 mb-6">
                  <MapPin className="inline mr-3 h-8 w-8" />
                  Notre Siège
                </h2>
                <p className="text-gray-700 mb-6">
                  Venez nous rencontrer dans nos locaux pour discuter de vos projets technologiques.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Adresse</h4>
                      <p className="text-gray-600">27 BP 826 Abidjan 27</p>
                      <p className="text-gray-600">Angré Château, Immeuble BATIM II</p>
                      <p className="text-gray-600">1er étage, Porte A108, Abidjan</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Téléphone</h4>
                      <p className="text-gray-600">+225 27 21 37 33 63</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">infos@dcat.ci</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-96 w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7944.102078321464!2d-3.9866403!3d5.4091977!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb61024da95b%3A0x8ac01db5ac44fb4b!2sDCAT%20(Data%20Communications%20%26%20All%20Technologies)!5e0!3m2!1sfr!2sci!4v1750939771358!5m2!1sfr!2sci" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20">
          <div className="bg-blue-800 rounded-xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Contactez-nous</h2>
            <p className="text-blue-100 mb-8 max-w-2xl">
              Vous avez un projet ou besoin d'informations ? Notre équipe est à votre disposition pour répondre à toutes vos questions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-blue-100 mb-2">Nom complet</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-lg bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-blue-100 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 rounded-lg bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-blue-100 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-lg bg-blue-700 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-amber-400" 
                    placeholder="Décrivez votre projet ou demande..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Envoyer le message
                </button>
              </form>
              
              <div className="flex items-center justify-center">
                <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4">Coordonnées</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-amber-300 mr-3" />
                      <span>+225 27 21 37 33 63</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-amber-300 mr-3" />
                      <span>infos@dcat.ci</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-amber-300 mr-3" />
                      <span>Angré Château, BATIM II, 1er étage A108, Abidjan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;