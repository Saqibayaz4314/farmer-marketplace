import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaLeaf, 
  FaSearch, 
  FaFilter,
  FaChartLine,
  FaShoppingCart,
  FaUser,
  FaBox,
  FaTachometerAlt,
  FaBell,
  FaSpinner
} from "react-icons/fa";
import { getProducts, deleteProduct } from "../services/productService";
import { getProfile } from "../services/authService";
import { getImageUrl, handleApiError, formatPrice } from "../utils/apiHelpers";
import { useToast } from "../components/Toast";

const Dashboard = () => {
  // State
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const { toast } = useToast();

  // Fetch farmer profile and products
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch farmer profile
        const profileData = await getProfile();
        const currentUser = profileData?.data?.user || profileData?.user || profileData;
        setFarmer(currentUser);

        if (!currentUser || !currentUser._id) {
          throw new Error("Failed to load user profile");
        }

        // Fetch all products and filter by current user
        const productsData = await getProducts();
        
        // Handle different response structures
        let allProducts = [];
        if (Array.isArray(productsData)) {
          allProducts = productsData;
        } else if (productsData?.data?.products) {
          allProducts = productsData.data.products;
        } else if (productsData?.products) {
          allProducts = productsData.products;
        } else {
          console.warn("Unexpected products response structure:", productsData);
        }

        // Filter products by current farmer
        const farmerProducts = allProducts.filter(
          product => {
            const sellerId = product.seller?._id || product.farmerId?._id || product.farmerId;
            return sellerId === currentUser._id;
          }
        );
        
        setProducts(farmerProducts);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get unique categories
  const categories = ["all", ...new Set(products.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (product.title || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.title || '').localeCompare(b.title || '');
        case "price":
          return (a.price || 0) - (b.price || 0);
        case "orders":
          return (b.orders || 0) - (a.orders || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Calculate stats from real data
  const stats = farmer ? [
    { 
      label: "Total Products", 
      value: products.length, 
      icon: FaBox, 
      color: "bg-blue-500",
      change: `${products.length} listings`
    },
    { 
      label: "Total Sales", 
      value: products.reduce((sum, p) => sum + (p.orders || 0), 0), 
      icon: FaShoppingCart, 
      color: "bg-green-500",
      change: "Total orders received"
    },
    { 
      label: "Customer Rating", 
      value: farmer.rating || "N/A", 
      icon: FaChartLine, 
      color: "bg-yellow-500",
      change: farmer.rating ? `${farmer.rating}/5.0 average` : "No ratings yet"
    },
    { 
      label: "Active Listings", 
      value: products.filter(p => p.stock > 0).length, 
      icon: FaLeaf, 
      color: "bg-purple-500",
      change: `${products.filter(p => p.stock > 0).length} in stock`
    }
  ] : [];

  // Handle delete confirmation
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        setDeletingProduct(true);
        await deleteProduct(productToDelete._id);
        setProducts(products.filter(p => p._id !== productToDelete._id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error(handleApiError(err));
      } finally {
        setDeletingProduct(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-5xl mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-semibold">Error loading dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FarmConnect</h1>
                <p className="text-sm text-gray-500">Farmer Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-green-600 transition">
                <FaBell className="text-xl" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <span className="font-medium text-gray-700">{farmer.fullName || farmer.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {farmer.fullName || farmer.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your products, track sales, and grow your farming business.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="orders">Sort by Orders</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md transition ${
                    viewMode === "grid" 
                      ? "bg-white shadow-sm text-green-600" 
                      : "text-gray-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md transition ${
                    viewMode === "list" 
                      ? "bg-white shadow-sm text-green-600" 
                      : "text-gray-600"
                  }`}
                >
                  List
                </button>
              </div>

              {/* Add Product Button */}
              <Link
                to="/add-product"
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition flex-1 lg:flex-none justify-center"
              >
                <FaPlus className="text-sm" />
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            viewMode === "grid" ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(product.mainImage)}
                        alt={product.title || 'Product'}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                        (product.quantity || 0) > 0 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {(product.quantity || 0) > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                      </div>
                      <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        ⭐ {product.rating || "N/A"}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{product.title || 'Untitled'}</h3>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                      
                      <p className="text-green-600 font-bold text-lg mb-3">
                        {formatPrice(product.price)} / {product.unit || 'kg'}
                      </p>
                      
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>📦 {product.orders || 0} orders</span>
                        <span>{(product.quantity || 0) > 0 ? "🟢 Active" : "🔴 Out of stock"}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                        >
                          <FaEdit />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              className="h-10 w-10 rounded-lg object-cover" 
                              src={getImageUrl(product.mainImage)} 
                              alt={product.title || 'Product'}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/40?text=No+Image";
                              }}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title || 'Untitled'}</div>
                              <div className="text-sm text-gray-500">⭐ {product.rating || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatPrice(product.price)} / {product.unit || 'kg'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            (product.quantity || 0) > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {(product.quantity || 0) > 0 ? `${product.quantity} units` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.orders || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/edit-product/${product._id}`}
                              className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            // Empty State
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <FaLeaf className="text-green-400 text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria." 
                  : "You haven't added any products yet. Start by adding your first product!"
                }
              </p>
              <Link
                to="/add-product"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
              >
                <FaPlus />
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete?.title || 'this product'}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deletingProduct ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;