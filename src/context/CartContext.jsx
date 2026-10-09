import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // initialize state directly from localStorage (avoids a flash of empty cart on load)
  const [cartItem, setCartItem] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.log("Error reading cart from localStorage:", error);
      return [];
    }
  });

  // save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItem));
  }, [cartItem]);

  const addToCart = (product) => {
    const itemInCart = cartItem.find((item) => item.id === product.id);
    if (itemInCart) {
      setCartItem(
        cartItem.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success("Quantity increased!");
    } else {
      setCartItem([...cartItem, { ...product, quantity: 1 }]);
      toast.success("Added to cart!");
    }
  };

  const updateQuantity = (productId, action) => {
    setCartItem((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty =
              action === "increase" ? item.quantity + 1 : item.quantity - 1;
            if (newQty <= 0) return null;
            toast.success(action === "increase" ? "Quantity increased!" : "Quantity decreased!");
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const deleteItem = (productId) => {
    setCartItem((prev) => prev.filter((item) => item.id !== productId));
    toast.success("Item removed!");
  };

  // Derived values — memoised so consumers don't recompute on every render
  const totalItems = useMemo(
    () => cartItem.reduce((sum, item) => sum + item.quantity, 0),
    [cartItem]
  );

  const totalPrice = useMemo(
    () => cartItem.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItem]
  );

  return (
    <CartContext.Provider
      value={{ cartItem, setCartItem, addToCart, updateQuantity, deleteItem, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);