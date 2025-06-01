import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2000';

const CheckoutPage: React.FC = () => {
  const { cartItems, subtotal, clearCart, itemCount } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('Authentication token not found');
  
      const commandeData = {
        panier: {
          infos: {
            adresse_livraison: deliveryAddress,
            methode_paiement: paymentMethod,
          },
          produits: cartItems.map(item => ({
            id_produit: item.product.produit.id_produit,
            quantite: item.quantity,
            prix: parseFloat(item.product.produit.prix_produit)
          }))
        }
      };
  
      const response = await axios.post(`${API_URL}/api/ecommerceweb/commande`, commandeData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.data.success) {
        clearCart();
        setOrderSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la commande');
      console.error('Erreur commande:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Commande confirmée!</h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre commande. Nous avons envoyé une confirmation à {currentUser?.email}.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-md font-medium"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container py-8 px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-amber-600 hover:text-amber-700 mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Finaliser la commande</h1>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Informations de livraison</h2>
              
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Adresse de livraison complète
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base"
                  rows={3}
                  required
                  placeholder="Rue, quartier, ville et repères"
                />
              </div>

              <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Méthode de paiement</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    required
                  />
                  <label htmlFor="cash" className="ml-2 block text-xs sm:text-sm text-gray-700">
                    Paiement à la livraison (Espèces)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="card" className="ml-2 block text-xs sm:text-sm text-gray-700">
                    Carte bancaire
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile"
                    name="payment"
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={() => setPaymentMethod('mobile')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="mobile" className="ml-2 block text-xs sm:text-sm text-gray-700">
                    Mobile Money (Wave, Orange Money, etc.)
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-xs sm:text-sm mb-3 sm:mb-4 p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || cartItems.length === 0}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 rounded-md font-medium disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? 'Traitement en cours...' : `Confirmer la commande (${itemCount} article${itemCount > 1 ? 's' : ''})`}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4">
              <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Récapitulatif</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-64 sm:max-h-96 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.product.produit.id_produit} className="flex justify-between items-start border-b border-gray-100 pb-2 sm:pb-3">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-md overflow-hidden">
                        <img 
                          src={item.product.images[0]?.url || '/placeholder-product.png'} 
                          alt={item.product.produit.desi_produit}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm sm:text-base">{item.product.produit.desi_produit}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">Qté: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-sm sm:text-base">
                      {(parseFloat(item.product.produit.prix_produit) * item.quantity).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 sm:space-y-3 border-t border-gray-200 pt-3 sm:pt-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Livraison</span>
                  <span>{shippingCost === 0 ? 'Gratuit' : `${shippingCost.toLocaleString('fr-FR')} FCFA`}</span>
                </div>

                <div className="flex justify-between font-bold text-sm sm:text-base pt-2 sm:pt-3 mt-1 sm:mt-2 border-t border-gray-200">
                  <span>Total à payer</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;