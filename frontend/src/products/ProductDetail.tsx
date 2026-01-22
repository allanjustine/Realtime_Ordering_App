// src/components/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../context/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Storage } from "../utils/Storage";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price: number;
  quantity: number;
  image_url: string[];
  rating: number;
  reviewsCount: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product-detail/${id}`);
        setProduct(response.data.product);
        setMainImage(response.data.product.image_url[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  if (loading) return <LoadingSpinner />;

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <img
          className="w-24 h-24 mb-4"
          src="https://static.thenounproject.com/png/4532229-512.png"
          alt=""
        />
        <div className="text-lg font-semibold text-gray-700">
          No product found
        </div>
      </div>
    );

  const changeImage = (src: string) => {
    setMainImage(src);
  };

  return (
    <div className="bg-gray-100">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-wrap -mx-4">
          {/* Product Images */}
          <div className="w-full px-4 mb-8 md:w-1/2">
            <img
              src={Storage(mainImage)}
              alt={product.name}
              className="w-full mb-4 rounded-lg shadow-md md:h-[65vh]"
            />
            <div className="flex gap-4 py-4 ml-5 overflow-x-auto">
              {product.image_url.map((url, index) => (
                <img
                  key={index}
                  src={Storage(url)}
                  alt={`Thumbnail ${index + 1}`}
                  className={`object-cover transition duration-300 rounded-md cursor-pointer size-16 sm:size-20 ${
                    url === mainImage ? "opacity-100" : "opacity-60"
                  } hover:opacity-100`}
                  onClick={() => changeImage(url)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full px-4 md:w-1/2">
            <h2 className="mb-2 text-3xl font-bold">{product.name}</h2>
            <p className="mb-4 text-gray-600">ID: {product.id}</p>
            <div className="mb-4">
              <span className="mr-2 text-2xl font-bold">₱{product.price}</span>
              <span className="text-gray-500 line-through">
                ₱{product.old_price}
              </span>
            </div>
            <div className="flex items-center mb-4">
              {Array.from({ length: 5 }, (_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-6 ${
                    index < product.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>
            <p className="mb-6 text-gray-700">{product.description}</p>
            <p className="mb-6 text-gray-700">
              <span className="font-bold">Stock:</span>{" "}
              {product.quantity <= 0
                ? "Out of Stock"
                : product.quantity === 1
                  ? `${product.quantity} pc`
                  : `${product.quantity} pcs`}
            </p>

            <div className="mb-6">
              <label
                htmlFor="quantity"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.quantity}
                defaultValue="1"
                className="w-12 text-center border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div className="flex justify-center mb-6 space-x-4">
              <button className="flex items-center gap-2 px-6 py-2 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <i className="fas fa-cart-plus"></i>
                Add to Cart
              </button>
              <button className="flex items-center gap-2 px-6 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <i className="fas fa-shopping-cart"></i>
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
