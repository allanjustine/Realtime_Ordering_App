import React, { useState, memo, useEffect } from "react";
import AddProductModal from "./modals/AddProductModal";
import ProductList from "./ProductList";
import toastr from "toastr";
import { useAuth } from "../context/AuthContext";
import Echo from "../utils/Echo";

interface ProductProps {
  setOnSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductPage: React.FC<ProductProps> = memo(({ setOnSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [channelRead, setChannelRead] = useState(false);
  const [userBuyer, setUserBuyer] = useState("");
  const [productBought, setProductBought] = useState("");
  const { user } = useAuth();

  toastr.options = {
    positionClass: "toast-top-right",
    closeButton: true,
    progressBar: true,
    timeOut: 5000,
  };

  const toggleModal = () => setIsOpen(!isOpen);

  useEffect(() => {
    const channel = Echo.private(`App.Models.User.${user.id}`).notification(
      (notification: any) => {
        if (notification.order.user_id !== user.id) {
          setChannelRead(true);
          setUserBuyer(notification.order.user.name);
          setProductBought(notification.order.product.name);
        }
      }
    );

    return () => {
      channel.stopListening("OrderEvent");
    };
  }, [user]);

  useEffect(() => {
    if (channelRead) {
      toastr.info("Good day, " + user.name + " Your product " + productBought + " was added to cart by " + userBuyer);
      setChannelRead(false);
      setUserBuyer("");
      setProductBought("");
    }
  }, [channelRead, productBought, userBuyer, user]);

  useEffect(() => {
    document.title = "Ordering App | Products";
  }, []);

  return (
    <div className="container p-4 mx-auto overflow-x-hidden">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">Product List</h1>
        <button
          onClick={toggleModal}
          className="px-2 mb-3 text-xs text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          <i className="far fa-plus"></i> Add Product
        </button>
      </div>

      {/* Display product list */}
      <ProductList isRefresh={isRefresh} setOnSubmit={setOnSubmit} />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        setIsRefresh={setIsRefresh}
      />
    </div>
  );
});

export default ProductPage;
