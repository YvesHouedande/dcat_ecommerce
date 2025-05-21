// // src/context/CartContext.tsx
// import { createContext, useContext, useEffect, useState } from 'react';
// import { Product } from '../types/product';

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (product: Product) => void;
//   removeFromCart: (productId: number) => void;
//   updateQuantity: (productId: number, quantity: number) => void;
//   clearCart: () => void;
//   subtotal: number;
//   itemCount: number;
// }

// const CartContext = createContext<CartContextType>(null!);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       setCartItems(JSON.parse(savedCart));
//     }
//   }, []);

//   // Save cart to localStorage on change
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product: Product) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => 
//         item.product.produit.id_produit === product.produit.id_produit
//       );
      
//       if (existingItem) {
//         return prevItems.map(item =>
//           item.product.produit.id_produit === product.produit.id_produit
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
      
//       return [...prevItems, { product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (productId: number) => {
//     setCartItems(prevItems => 
//       prevItems.filter(item => item.product.produit.id_produit !== productId)
//     );
//   };

//   const updateQuantity = (productId: number, quantity: number) => {
//     if (quantity < 1) {
//       removeFromCart(productId);
//       return;
//     }

//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.product.produit.id_produit === productId
//           ? { ...item, quantity }
//           : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + (parseFloat(item.product.produit.prix_produit) * item.quantity),
//     0
//   );

//   const itemCount = cartItems.reduce(
//     (count, item) => count + item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         subtotal,
//         itemCount
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => useContext(CartContext);

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types/product';
import { toast } from 'react-toastify';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>(null!);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          // Validate cart items structure
          const validItems = parsed.filter(item => 
            item?.product?.produit?.id_produit && 
            typeof item.quantity === 'number'
          );
          setCartItems(validItems);
        }
      } catch (e) {
        console.error('Failed to parse cart', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product?.produit?.id_produit) {
      toast.error('Produit invalide');
      return;
    }

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.produit.id_produit === product.produit.id_produit
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [...prev, { product, quantity }];
    });

    toast.success(`Ajouté au panier (${quantity}x)`);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(
      item => item.product.produit.id_produit !== productId
    ));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product.produit.id_produit === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product.produit.prix_produit) || 0;
    return sum + (price * item.quantity);
  }, 0);

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};