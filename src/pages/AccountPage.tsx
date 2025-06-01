import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, User, LogOut } from "lucide-react";
import { accountApi } from "../api/account";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {  Order } from "../types/account";

interface AccountPageState {
  profile: {
    nom: string;
    email: string;
    contact: string;
  };
  orders: Order[];
}

const AccountPage: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    logout,
    loading: authLoading
  } = useAuth();
  
  const navigate = useNavigate();
  const [state, setState] = useState<AccountPageState>({
    profile: {
      nom: '',
      email: '',
      contact: ''
    },
    orders: []
  });

  const [loading, setLoading] = useState({
    profile: true,
    orders: true,
    update: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Mon compte - DCAT Shop";
    
    if (isAuthenticated) {
      fetchProfileData();
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const userData = await accountApi.getProfile();
      setState(prev => ({
        ...prev,
        profile: {
          nom: userData.nom,
          email: userData.email,
          contact: userData.contact
        }
      }));
    } catch (err) {
      setError('Erreur lors du chargement du profil');
      console.error('Erreur:', err);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      const orders = await accountApi.getOrderHistory();
      setState(prev => ({
        ...prev,
        orders
      }));
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error('Erreur:', err);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, update: true }));
    
    try {
      await accountApi.updateProfile({
        nom: state.profile.nom,
        contact: state.profile.contact
      });
      await fetchProfileData();
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error('Erreur:', err);
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value
      }
    }));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusStyle = (status: string) => {
    const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'livrée':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'expédiée':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'annulée':
        return `${baseClasses} bg-red-100 text-red-800`;
      default: // en_attente
        return `${baseClasses} bg-amber-100 text-amber-800`;
    }
  };

  const calculateOrderTotal = (order: Order) => {
    return order.produits.reduce(
      (total, produit) => total + (produit.prix_unitaire * produit.quantite), 
      0
    ).toLocaleString('fr-FR');
  };

  const handleViewOrderDetails = (orderId: number) => {
    navigate(`/account/orders/${orderId}`);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mon compte</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-100 rounded-full h-12 w-12 flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="font-medium text-slate-900">{currentUser?.nom}</h2>
                    <p className="text-sm text-slate-500">{currentUser?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                <a href="#account-info" className="flex items-center space-x-3 px-4 py-3 rounded-md bg-slate-50 text-slate-900">
                  <User className="h-5 w-5 text-slate-600" />
                  <span>Informations</span>
                </a>
                <a href="#orders" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors">
                  <Package className="h-5 w-5 text-slate-600" />
                  <span>Commandes</span>
                </a>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <section id="account-info" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">Informations personnelles</h2>
              
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-slate-700 mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={state.profile.nom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={state.profile.email}
                        disabled
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-100 cursor-not-allowed sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-slate-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={state.profile.contact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading.update}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                  >
                    {loading.update ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </section>

            {/* Order History Section */}
            <section id="orders" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">Historique des commandes</h2>

              {loading.orders ? (
                <LoadingSpinner />
              ) : state.orders.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Commande</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {state.orders.map((order) => (
                        <tr key={order.id_commande} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            #{order.id_commande}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(order.date_de_commande)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center ${getStatusStyle(order.etat_commande)}`}>
                              {order.etat_commande.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {calculateOrderTotal(order)} FCFA
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <button
                              onClick={() => handleViewOrderDetails(order.id_commande)}
                              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                            >
                              Voir détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900">Aucune commande</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Vos commandes apparaîtront ici.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/catalog"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700"
                    >
                      Commencer vos achats
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;