import React, { useEffect, useRef, useState } from "react";
import axios from "../context/api";
import { Storage } from "../utils/Storage";
import toastr from "toastr";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface Cart {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

const CartDropdown: React.FC<any> = ({
  onSubmit,
  setCartData,
  isScrolling,
  isMenuOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isRefreshAfterDelete, setIsRefreshAfterDelete] = useState(false);

  toastr.options = {
    positionClass: "toast-top-right",
    closeButton: true,
    progressBar: true,
    timeOut: 5000,
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/carts");
        if (response.status === 200) {
          setCartItems(response.data.carts);
          setCartData(response.data.carts.length);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
  }, [onSubmit, isRefreshAfterDelete, setCartData]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRemoveItem = async (itemId: number) => {
    setIsRefreshAfterDelete(true);
    try {
      const response = await axios.delete(`/delete-cart-item/${itemId}`);

      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId),
        );
        toastr.success(
          response.data.message || "Item removed successfully.",
          "Item removed",
        );
      } else {
        toastr.error("Failed to delete item from cart.", "Error");
      }
    } catch (error: any) {
      console.error("Error deleting cart item:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete item from cart.";
      toastr.error(errorMessage, "Error");
    } finally {
      setIsRefreshAfterDelete(false);
    }
  };

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item,
      ),
    );
  };

  const handleSelectChange = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleDeleteSelected = async () => {
    setIsRefreshAfterDelete(true);
    if (selectedItems.length === 0) {
      toastr.info("No items selected for deletion.", "No items selected");
      return;
    }

    try {
      const response = await axios.delete("/delete-cart-items", {
        data: {
          ids: selectedItems,
        },
      });

      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => !selectedItems.includes(item.id)),
        );
        toastr.success(response.data.message, "Items removed");
        setSelectedItems([]);
      }
    } catch (error) {
      console.error("Error deleting carts:", error);
      toastr.error("Failed to delete cart.", "Error");
    } finally {
      setIsRefreshAfterDelete(false);
    }
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((tempTotal, item) => {
      return tempTotal + item.quantity * item.product.price;
    }, 0);

    return total.toFixed(2);
  };

  const cartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative z-50" ref={cartRef}>
      <button
        className={`${
          isScrolling || isMenuOpen
            ? "text-white hover:text-gray-200"
            : "text-orange-800 hover:text-orange-600"
        } flex items-center justify-center px-4 py-2 text-sm rounded-md`}
        onClick={toggleDropdown}
      >
        <i className="relative mr-2 fas fa-shopping-cart">
          {cartItems.length > 0 && (
            <span className="absolute w-4 h-4 text-xs text-center text-white bg-red-500 rounded-full left-3 -top-4">
              {cartItems.length}
            </span>
          )}
        </i>
      </button>

      {isOpen && (
        <div className="absolute right-5 mt-2 bg-white border rounded-md shadow-lg md:w-[415px]">
          <div className="absolute right-2 top-[-4px] transform rotate-45 bg-white w-2 h-2"></div>
          <h3 className="mt-2 mb-2 ml-3 font-bold text-md">Cart Items</h3>
          <hr />
          <div className="p-3 max-h-[400px] overflow-x-hidden overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                <span>
                  <i className="far fa-cart-xmark"></i>
                </span>
                <br />
                <span>Your cart is empty.</span>
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectChange(item.id)}
                    className="mr-2 cursor-pointer"
                  />
                  <img
                    src={Storage(item.product.image_url[0])}
                    alt={item.product.name}
                    className="w-12 h-12 mr-2"
                  />
                  <div className="flex items-center w-full">
                    <div className="flex flex-col w-[105px] overflow-hidden">
                      <p
                        title={item.product.name}
                        className="text-sm font-medium truncate text-wrap md:text-balance"
                      >
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        ₱{item.product.price}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-2 text-gray-600 border hover:text-gray-800"
                      >
                        -
                      </button>
                      <span className="text-xs text-center w-[30px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-2 text-gray-600 border hover:text-gray-800"
                      >
                        +
                      </button>
                      <button
                        onClick={(e) => handleRemoveItem(item.id)}
                        className="px-1 ml-3 text-xs text-red-600 underline hover:text-red-800"
                      >
                        Delete
                      </button>
                      <button className="px-1 text-xs text-blue-600 underline hover:text-blue-800">
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="px-3 py-1 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold">Total:</span>
                <span className="text-sm font-bold">₱{calculateTotal()}</span>
              </div>
              {selectedItems.length > 0 && (
                <div>
                  <button
                    onClick={handleDeleteSelected}
                    className="w-full py-2 mb-2 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete Selected
                  </button>
                  <button className="w-full py-2 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">
                    Checkout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
