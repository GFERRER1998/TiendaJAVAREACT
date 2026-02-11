import { createContext, useState, useEffect } from "react";
import { fetchCategories } from "../../service/CategoryService";
import { fetchItems } from "../../service/ItemService";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [auth, setAuthState] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
  });
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
      });
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const itemResponse = await fetchItems();
        if (itemResponse && itemResponse.data) {
          setItemData(itemResponse.data);
        }

        const response = await fetchCategories();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  const setAuth = (token, role) => {
    setAuthState({ token, role });
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.itemID === item.itemID);
      if (existingItem) {
        if (existingItem.quantity >= item.stock) {
          alert(`Product reached stock limit: ${item.stock}`);
          return prevItems;
        }
        return prevItems.map((i) =>
          i.itemID === item.itemID ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemID) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.itemID !== itemID)
    );
  };

  const updateQuantity = (itemID, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemID);
      return;
    }
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find((i) => i.itemID === itemID);
      if (itemToUpdate && quantity > itemToUpdate.stock) {
        alert(`Maximum stock available is ${itemToUpdate.stock}`);
        return prevItems;
      }
      return prevItems.map((item) =>
        item.itemID === itemID ? { ...item, quantity: quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const contextValue = {
    categories,
    setCategories,
    auth,
    setAuth,
    itemData,
    setItemData,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};