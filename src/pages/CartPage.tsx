import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    subtotal,
    itemCount,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `Panier (${itemCount}) - DCAT Shop`;
  }, [itemCount]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  const shippingCost = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shippingCost;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container py-6 sm:py-12 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-6 sm:mb-8">Panier ({itemCount})</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 bg-slate-50 p-3 sm:p-4 border-b border-slate-200">
                  <div className="col-span-6">
                    <span className="font-medium">Produit</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium">Prix unitaire</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium">Quantité</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-medium">Total</span>
                  </div>
                </div>

                {cartItems.map((item) => {
                  if (!item?.product?.produit) return null;
                  
                  const price = parseFloat(item.product.produit.prix_produit) || 0;
                  const itemTotal = price * item.quantity;

                  return (
                    <div
                      key={item.product.produit.id_produit}
                      className="grid grid-cols-1 sm:grid-cols-12 p-3 sm:p-4 border-b border-slate-200 last:border-b-0 items-center"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center mb-3 sm:mb-0">
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 bg-slate-50 rounded-md">
                          <img
                            src={item.product.images[0]?.url || '/placeholder-product.png'}
                            alt={item.product.produit.desi_produit}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="ml-3 sm:ml-4 flex-1">
                          <Link
                            to={`/produits/${item.product.produit.id_produit}`}
                            className="font-medium text-slate-900 hover:text-amber-600 transition-colors mb-1 block text-sm sm:text-base"
                          >
                            {item.product.produit.desi_produit}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.produit.id_produit)}
                            className="text-red-500 hover:text-red-600 transition-colors text-xs sm:text-sm flex items-center mt-1 sm:hidden"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Retirer
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center text-slate-900 mb-3 sm:mb-0 text-sm sm:text-base">
                        <div className="sm:hidden inline font-medium mr-2">
                          Prix:
                        </div>
                        {price.toLocaleString('fr-FR')} FCFA
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center mb-3 sm:mb-0">
                        <div className="flex border border-slate-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.produit.id_produit, item.quantity - 1)}
                            className="px-2 py-1 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              updateQuantity(
                                item.product.produit.id_produit,
                                newQuantity
                              );
                            }}
                            className="w-8 sm:w-10 py-1 text-center focus:outline-none focus:ring-0 border-x border-slate-300 text-sm sm:text-base"
                          />
                          <button
                            onClick={() => updateQuantity(item.product.produit.id_produit, item.quantity + 1)}
                            className="px-2 py-1 flex items-center justify-center hover:bg-slate-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 text-right">
                        <div className="font-medium text-slate-900 text-sm sm:text-base">
                          <div className="sm:hidden inline font-medium mr-2">
                            Total:
                          </div>
                          {itemTotal.toLocaleString('fr-FR')} FCFA
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.produit.id_produit)}
                          className="text-red-500 hover:text-red-600 transition-colors text-xs sm:text-sm flex items-center mt-1 ml-auto hidden sm:flex"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Retirer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6">
                  Résumé de la commande
                </h2>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-slate-600">Sous-total</span>
                    <span className="font-medium">
                      {subtotal.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-slate-600">Livraison</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Gratuit' : `${shippingCost.toLocaleString('fr-FR')} FCFA`}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
                    <div className="flex justify-between font-bold text-base sm:text-lg">
                      <span>Total</span>
                      <span>{total.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 rounded-md font-medium transition-colors mb-3 sm:mb-4 flex items-center justify-center text-sm sm:text-base"
                >
                  {isAuthenticated ? 'Passer la commande' : 'Se connecter pour commander'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>

                <Link
                  to="/catalog"
                  className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 sm:py-3 rounded-md font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-12 text-center">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4">Votre panier est vide</h2>
            <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Il semble que vous n'ayez pas encore ajouté de produits à votre panier.
            </p>
            <Link 
              to="/catalog" 
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium transition-colors text-sm sm:text-base"
            >
              Commencez vos achats
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;