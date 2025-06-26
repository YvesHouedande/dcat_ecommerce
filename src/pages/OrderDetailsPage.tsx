import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, XCircle, CheckCircle, Truck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { accountApi } from '../api/account';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { OrderDetails } from '../types/order';

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) throw new Error('Numéro de commande manquant');
        
        const orderData = await accountApi.getOrderDetails(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        console.error('Erreur lors du chargement de la commande:', err);
        setError(err.message || 'Impossible de charger les détails de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!orderId || !order) return;
    
    try {
      await accountApi.cancelOrder(parseInt(orderId));
      setOrder({
        ...order,
        etat_commande: 'annulée'
      });
      setShowCancelModal(false);
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      setError('Erreur lors de l\'annulation de la commande');
    }
  };

  const getStatusBadge = () => {
    if (!order) return null;
    
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium flex items-center';
    
    switch (order.etat_commande) {
      case 'livrée':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Livrée
          </span>
        );
      case 'expédiée':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            <Truck className="h-4 w-4 mr-1" />
            Expédiée
          </span>
        );
      case 'annulée':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="h-4 w-4 mr-1" />
            Annulée
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            <Clock className="h-4 w-4 mr-1" />
            En attente
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/account/orders')}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel = order.etat_commande === 'en_attente';
  const subtotal = order.produits.reduce((sum, p) => sum + (p.prix_unitaire * p.quantite), 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shipping;

  return (
    <div className="bg-slate-50 min-h-screen py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/account')}
            className="flex items-center text-amber-600 hover:text-amber-700 mb-3"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm sm:text-base">Retour à l'historique</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif">Commande #{order.id_commande}</h1>
              <p className="text-slate-500 text-sm sm:text-base">
                Passée le {new Date(order.date_de_commande).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Products List - Desktop */}
              <div className="hidden sm:grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-200">
                <div className="col-span-6 font-medium">Produit</div>
                <div className="col-span-2 text-center font-medium">Prix unitaire</div>
                <div className="col-span-2 text-center font-medium">Quantité</div>
                <div className="col-span-2 text-right font-medium">Total</div>
              </div>

              {order.produits.map((product) => (
                <div
                  key={product.id_produit}
                  className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:p-4 border-b border-slate-200 last:border-b-0"
                >
                  <div className="col-span-6 flex items-center mb-3 sm:mb-0">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-100 rounded-md overflow-hidden mr-3 sm:mr-4">
                      <img
                        src={ `${import.meta.env.VITE_API_URL}/${product.images[0]}` || '/placeholder-product.png'}
                        alt={product.designation}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        to={`/produits/${product.id_produit}`}
                        className="font-medium hover:text-amber-600 text-sm sm:text-base"
                      >
                        {product.designation}
                      </Link>
                      <p className="text-xs sm:text-sm text-slate-500">{product.code_produit}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-slate-900 mb-3 sm:mb-0 text-sm sm:text-base">
                    <span className="sm:hidden font-medium mr-2">Prix:</span>
                    {product.prix_unitaire.toLocaleString('fr-FR')} FCFA
                  </div>

                  <div className="col-span-2 text-center mb-3 sm:mb-0 text-sm sm:text-base">
                    <span className="sm:hidden font-medium mr-2">Quantité:</span>
                    {product.quantite}
                  </div>

                  <div className="col-span-2 text-right text-sm sm:text-base">
                    <span className="sm:hidden font-medium mr-2">Total:</span>
                    {(product.prix_unitaire * product.quantite).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6">Détails de la commande</h2>

              {/* Customer Info */}
              {currentUser && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Client</h3>
                  <p className="text-slate-600 text-sm sm:text-base">{currentUser.nom}</p>
                  <p className="text-slate-600 text-sm sm:text-base">{currentUser.email}</p>
                  <p className="text-slate-600 text-sm sm:text-base">{currentUser.contact}</p>
                </div>
              )}

              {/* Delivery Info */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Lieu de Livraison</h3>
                <p className="text-slate-600 text-sm sm:text-base">{order.lieu_de_livraison}</p>
              </div>

              {/* Payment Info */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Paiement</h3>
                <p className="text-slate-600 text-sm sm:text-base capitalize">{order.mode_de_paiement}</p>
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-200 pt-3 mt-3 sm:pt-4 sm:mt-4">
                <div className="flex justify-between py-1 sm:py-2 text-sm sm:text-base">
                  <span className="text-slate-600">Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between py-1 sm:py-2 text-sm sm:text-base">
                  <span className="text-slate-600">Livraison</span>
                  <span>{shipping === 0 ? 'Gratuit' : `${shipping.toLocaleString('fr-FR')} FCFA`}</span>
                </div>
                <div className="flex justify-between py-1 sm:py-2 font-bold border-t border-slate-200 mt-2 pt-2 sm:pt-3 text-sm sm:text-base">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm sm:text-base"
                  >
                    Annuler la commande
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Confirmer l'annulation</h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <p className="mb-6">Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
              >
                Retour
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;