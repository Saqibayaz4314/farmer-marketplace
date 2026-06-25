import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaSave, FaArrowLeft, FaImages, FaSpinner } from "react-icons/fa";
import { addProduct } from "../services/productService";
import { handleApiError } from "../utils/apiHelpers";
import { useToast } from "../components/Toast";

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    region: "",
    mainImage: null,
    otherImages: [],
  });

  const [previewMain, setPreviewMain] = useState(null);
  const [previewOthers, setPreviewOthers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Handle text input
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ✅ Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, mainImage: file });
      setPreviewMain(URL.createObjectURL(file));
    }
  };

  // ✅ Handle multiple image uploads
  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, otherImages: files });
    setPreviewOthers(files.map((file) => URL.createObjectURL(file)));
  };

  // ✅ Handle form submission with API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('quantity', product.quantity);
      formData.append('category', product.category);
      formData.append('region', product.region);
      
      // Append main image
      if (product.mainImage) {
        formData.append('mainImage', product.mainImage);
      }
      
      // Append other images
      product.otherImages.forEach(image => {
        formData.append('otherImages', image);
      });

      // Submit to API
      const response = await addProduct(formData);
      
      // Success - cleanup and navigate
      if (previewMain) URL.revokeObjectURL(previewMain);
      previewOthers.forEach(url => URL.revokeObjectURL(url));
      
      toast.success('Product added successfully!');
      navigate('/dashboard');
      
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-green-800">Add New Product 🌾</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 transition"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-8 max-w-3xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              placeholder="e.g. Fresh Organic Tomatoes"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Describe your product quality, freshness, etc."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            ></textarea>
          </div>

          {/* Category & Region */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Dairy">Dairy</option>
                <option value="Pulses">Pulses</option>
                <option value="Spices">Spices</option>
                <option value="Seeds">Seeds</option>
                <option value="Livestock">Livestock</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Region / Location
              </label>
              <input
                type="text"
                name="region"
                value={product.region}
                onChange={handleChange}
                placeholder="e.g. Sindh, Pakistan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price (PKR)
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Quantity (kg / liters / items)
              </label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                placeholder="e.g. 100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Image Uploads */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Upload Main Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-lg w-40 h-40 cursor-pointer hover:bg-green-50 transition">
                <FaUpload className="text-green-600 text-3xl mb-2" />
                <span className="text-sm text-gray-600">Main Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </label>

              {previewMain && (
                <img
                  src={previewMain}
                  alt="Main Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Upload Other Images (optional)
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-lg w-32 h-32 cursor-pointer hover:bg-green-50 transition">
                <FaImages className="text-green-600 text-2xl mb-2" />
                <span className="text-xs text-gray-600">Add Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleOtherImagesChange}
                  className="hidden"
                />
              </label>

              {previewOthers.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Other ${index}`}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <FaSave /> Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
