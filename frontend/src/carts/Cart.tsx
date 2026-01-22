import React, { useEffect, useState } from "react";
import CartList from "./CartList"; // Adjust the path as necessary

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 122222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222",
      price: 19.99,
      quantity: 1,
      image: "https://via.placeholder.com/150", // Placeholder image
    },
    {
      id: 2,
      name: "Product 2",
      price: 29.99,
      quantity: 1,
      image: "https://via.placeholder.com/150", // Placeholder image
    },
    {
      id: 3,
      name: "Product 3",
      price: 39.99,
      quantity: 1,
      image: "https://via.placeholder.com/150", // Placeholder image
    },
  ]);

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      )
    );
  };

  const handleDeleteSelected = (selectedIds: number[]) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !selectedIds.includes(item.id))
    );
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  useEffect(() => {
    document.title = "Ordering App | Carts";
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-2 text-2xl font-bold">Your Cart</h2>
      <hr />
      {cartItems.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          <span>
            <i className="far fa-cart-xmark"></i>
          </span>
          <br />
          <span>Your cart is empty.</span>
        </p>
      ) : (
        <div>
          <CartList
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
            onDeleteSelected={handleDeleteSelected} // Pass the new function
          />
          <div className="pt-2 mt-4 border-t">
            <p className="text-lg font-bold">Total: ${getTotalPrice()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; // Ensure this line is present
