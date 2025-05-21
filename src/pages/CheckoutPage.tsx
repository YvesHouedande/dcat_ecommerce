// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = subtotal > 50000 ? 0 : 2000;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

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
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, vous enverriez ici les données au backend
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     customerId: user?.id,
      //     items: cartItems,
      //     deliveryAddress,
      //     paymentMethod,
      //     total
      //   })
      // });

      // if (!response.ok) throw new Error('Erreur lors de la commande');

      // Vider le panier après succès
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue lors de la commande. Veuillez réessayer.');
      console.error(err);
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
            Merci pour votre commande. Nous avons envoyé une confirmation à {user?.email}.
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
      <div className="container py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-amber-600 hover:text-amber-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-2xl font-bold mb-6">Finaliser la commande</h1>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Informations de livraison</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse de livraison
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  rows={3}
                  required
                />
              </div>

              <h2 className="text-lg font-medium mb-4">Méthode de paiement</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="cash" className="ml-2 block text-sm text-gray-700">
                    Paiement à la livraison
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
                  <label htmlFor="card" className="ml-2 block text-sm text-gray-700">
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
                  <label htmlFor="mobile" className="ml-2 block text-sm text-gray-700">
                    Mobile Money
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-md font-medium disabled:opacity-70"
              >
                {isLoading ? 'Traitement en cours...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-medium mb-4">Votre commande</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.product.produit.id_produit} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.product.produit.desi_produit}</span>
                      <span className="text-gray-500 text-sm block">x {item.quantity}</span>
                    </div>
                    <span>{(parseFloat(item.product.produit.prix_produit) * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span>{shippingCost === 0 ? 'Gratuit' : `${shippingCost.toLocaleString('fr-FR')} FCFA`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (18%)</span>
                  <span>{tax.toLocaleString('fr-FR')} FCFA</span>
                </div>

                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
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