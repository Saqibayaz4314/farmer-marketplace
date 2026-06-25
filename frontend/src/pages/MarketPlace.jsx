import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaSeedling, 
  FaTractor, 
  FaMapMarkerAlt, 
  FaStar,
  FaWhatsapp,
  FaPhone,
  FaShoppingCart,
  FaSpinner
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import { getImageUrl, handleApiError } from "../utils/apiHelpers";
import { useToast } from "../components/Toast";

const categories = [
  { name: "All", icon: "🌿" },
  { name: "Fruits", icon: "🍎" },
  { name: "Vegetables", icon: "🥦" },
  { name: "Grains", icon: "🌾" },
  { name: "Dairy", icon: "🥛" },
  { name: "Livestock", icon: "🐄" },
  { name: "Seeds", icon: "🌱" },
  { name: "Pulses", icon: "🫘" },
  { name: "Spices", icon: "🌶️" },
];

const MarketPlace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  
  // Get current user and role
  const user = getCurrentUser();
  const userRole = user?.role;

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        
        // Handle different response structures
        const productsList = data?.data?.products || data?.products || data || [];
        setProducts(productsList);
      } catch (err) {
        setError(handleApiError(err));
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate category counts
  const getCategoryCount = (categoryName) => {
    if (categoryName === "All") return products.length;
    return products.filter(p => p.category === categoryName).length;
  };

  // Handle quick add to cart from marketplace
  const handleQuickAddToCart = async (product) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        toast.warning("Please login to add items to cart");
        navigate("/login");
        return;
      }

      setAddingToCart(prev => ({ ...prev, [product._id]: true }));

      await addToCart({
        productId: product._id,
        userId: user._id,
        name: product.title,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: 1
      });

      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(handleApiError(error));
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  // Filter products based on category and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = 
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4 lg:mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-2xl shadow-lg">
            <FaTractor className="text-white text-2xl lg:text-3xl" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-black  bg-gradient-to-r from-green-900 to-green-800 bg-clip-text text-transparent">
            Farmer Marketplace
          </h1>
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-2xl shadow-lg">
            <FaSeedling className="text-white text-2xl lg:text-3xl" />
          </div>
        </div>
        <p className="text-gray-700 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          Discover trusted farmers, browse fresh produce, and buy directly from local sellers across Pakistan 🌾
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-8 lg:gap-12 mt-8">
          {[
            { number: products.length, label: "Products Available" },
            { number: new Set(products.map(p => p.farmerId?._id)).size, label: "Active Farmers" },
            { number: new Set(products.map(p => p.category)).size, label: "Categories" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                {stat.number}+
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-12 lg:mb-16">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-8">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 text-lg lg:text-xl">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search for products or farmers..."
              className="w-full pl-12 pr-4 py-4 lg:py-5 rounded-2xl border-2 border-green-200 bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200/50 transition-all duration-300 text-base lg:text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Toggle for Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-700 transition-all duration-300"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Category Filter */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block transition-all duration-300`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg border border-green-200/60">
            <h3 className="text-lg lg:text-xl font-bold text-green-900 mb-6 lg:mb-8 flex items-center gap-2">
              <FaFilter className="text-green-600" />
              Browse Categories
            </h3>
            <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl border-2 transition-all duration-300 group min-w-[120px] lg:min-w-[140px] ${
                    selectedCategory === cat.name
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg scale-105"
                      : "bg-white text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md"
                  }`}
                >
                  <span className="text-lg lg:text-xl">{cat.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-sm lg:text-base">{cat.name}</div>
                    <div className="text-xs text-white-600/70">{getCategoryCount(cat.name)} items</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-8">
        <p className="text-gray-700 text-lg">
          Showing <span className="font-bold text-green-700">{filteredProducts.length}</span> products
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <FaSpinner className="animate-spin text-green-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">Error loading products</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Seller Cards Section */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(product.mainImage)}
                      alt={product.title}
                      className="w-full h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=400&q=60";
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        product.quantity > 0
                          ? "bg-green-500 text-white" 
                          : "bg-orange-500 text-white"
                      }`}>
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 lg:p-6">
                    {/* Product Info */}
                    <h3 className="text-lg lg:text-xl font-bold text-green-900 mb-2 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm lg:text-base mb-3 flex items-center gap-1">
                      <FaTractor className="text-green-500 text-sm" />
                      {product.farmerId?.name || "Unknown Farmer"}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl lg:text-2xl font-bold text-green-700">
                        Rs. {product.price}
                      </span>
                    </div>

                    {/* Location & Category */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-600 text-sm">
                        <FaMapMarkerAlt className="mr-2 text-green-500 flex-shrink-0" />
                        <span className="truncate">{product.region}</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {product.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        Quantity: {product.quantity} available
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link 
                          to={`/product/${product._id}`}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart className="text-sm" />
                          View Details
                        </Link>
                        {product.farmerId?.contact && (
                          <a
                            href={`https://wa.me/${product.farmerId.contact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                            title="Contact via WhatsApp"
                          >
                            <FaWhatsapp className="text-xl" />
                          </a>
                        )}
                      </div>
                      
                      {/* Quick Add to Cart Button - Only for buyers */}
                      {userRole === "buyer" && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuickAddToCart(product);
                          }}
                          disabled={addingToCart[product._id] || product.quantity === 0}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                            product.quantity === 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                          }`}
                        >
                          {addingToCart[product._id] ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <FaShoppingCart className="text-sm" />
                              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 lg:py-24">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto shadow-lg border border-green-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  No products found
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  We couldn't find any products matching your search. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketPlace;