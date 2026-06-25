import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaHeart, 
  FaShare, 
  FaStar, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaUser, 
  FaLeaf,
  FaShieldAlt,
  FaTruck,
  FaSeedling,
  FaClock,
  FaCheckCircle,
  FaWhatsapp,
  FaSpinner
} from "react-icons/fa";
import { getProductById, getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import { getImageUrl, handleApiError, formatPrice } from "../utils/apiHelpers";
import { useToast } from "../components/Toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showShareModal, setShowShareModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Get current user and role
  const user = getCurrentUser();
  const userRole = user?.role;
useEffect(() => {
  if (product?.mainImage) {
    setSelectedImage(getImageUrl(product.mainImage));
  }
}, [product]);


  // Fetch product details
useEffect(() => {
const fetchProductDetails = async () => {
  try {
    setLoading(true);
    setError(null);

    const productData = await getProductById(id);
    const fetchedProduct =
      productData?.data?.product ||
      productData?.product ||
      productData;

    if (!fetchedProduct) {
      throw new Error("Product not found");
    }

    setProduct(fetchedProduct);
    setSelectedImage(getImageUrl(fetchedProduct.mainImage));

    // Fetch related products
    const allProductsData = await getProducts();
    const allProducts =
      allProductsData?.data?.products ||
      allProductsData?.products ||
      allProductsData ||
      [];

    const related = allProducts
      .filter(
        (item) =>
          item.category === fetchedProduct.category &&
          item._id !== fetchedProduct._id
      )
      .slice(0, 4);

    setRelatedProducts(related);
  } catch (err) {
    setError(handleApiError(err));
    console.error("Error fetching product:", err);
  } finally {
    setLoading(false);
  }
};

  if (id) {
    fetchProductDetails();
  }
}, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      const user = getCurrentUser();
      
      if (!user) {
        toast.warning("Please login to add items to cart");
        navigate("/login");
        return;
      }

      await addToCart({
        userId: user._id || user.id,
        productId: product._id,
        name: product.title,
        price: product.price,
        image: product.mainImage,
        quantity: quantity
      });

      toast.success(`Added ${quantity} unit(s) of ${product.title} to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(handleApiError(error));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    // Add to cart first, then navigate to cart
    await handleAddToCart();
    navigate("/cart");
  };

  const handleContactFarmer = () => {
    if (!product || !product.farmerId?._id) {
      toast.warning("Farmer information not available");
      return;
    }
    
    // Navigate to chat page with farmer ID
    navigate("/chat", { 
      state: { 
        farmerId: product.farmerId._id,
        farmerName: product.farmerId.name 
      } 
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareProduct = () => {
    setShowShareModal(true);
  };

  const calculateDiscount = () => {
    if (!product || !product.originalPrice) return 0;
    if (product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < Math.floor(rating || 0) ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Product...</h2>
          <p className="text-gray-600">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-700 hover:text-green-900 transition font-medium"
            >
              <FaArrowLeft />
              Back
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <FaHeart className={isFavorite ? "fill-current" : ""} />
              </button>
              <button
                onClick={shareProduct}
                className="p-2 text-gray-600 hover:text-green-600 transition"
              >
                <FaShare />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
        {console.log(selectedImage)}
<div className="space-y-6">
  {/* Main Image */}
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
    {console.log(selectedImage)
    }
    <img
      src={selectedImage || getImageUrl(product.mainImage)}
      
      alt={product.title}
      className="w-full h-96 object-cover rounded-xl"
      onError={(e) => {
        e.target.src = "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=400&q=60";
      }}
    />
  </div>

  {/* Thumbnail Gallery */}
  {(product.mainImage || (product.otherImages && product.otherImages.length > 0)) && (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">More Images</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[product.mainImage, ...(product.otherImages || [])].map((img, index) => {
          const url = getImageUrl(img);
          return (
            <button
              key={index}
              onClick={() => setSelectedImage(url)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                selectedImage === url ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              <img
                src={url}
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  )}
</div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {product.isOrganic && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaLeaf className="text-xs" />
                        Organic
                      </span>
                    )}
                    {product.qualityGrade && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Grade {product.qualityGrade}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {renderStars(product.rating || 4.5)}
                      <span className="ml-1">{product.rating || 4.5} ({product.reviewCount || 0} reviews)</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      {product.city ? `${product.city}, ` : ''}{product.region || 'Pakistan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-green-700">Rs {product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">Rs {product.originalPrice}</span>
                      <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                        {calculateDiscount()}% OFF
                      </span>
                    </>
                  )}
                </div>
                {product.aiSuggestedPrice && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      AI Suggested: Rs {product.aiSuggestedPrice}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags - Only show if tags exist */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.harvestDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaSeedling className="text-green-500" />
                    <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-green-500" />
                  <span>Fresh for 7-10 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaShieldAlt className="text-green-500" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaTruck className="text-green-500" />
                  <span>Free Delivery</span>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">({product.unit})</span>
              </div>

              {/* Action Buttons - Only show to buyers */}
              {userRole === "buyer" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.quantity === 0}
                    className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl transition font-semibold ${
                      product.quantity === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {addingToCart ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
                        {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart || product.quantity === 0}
                    className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl transition font-semibold ${
                      product.quantity === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              )}

              <button
                onClick={handleContactFarmer}
                className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 px-6 rounded-xl hover:bg-green-200 transition font-semibold mt-3"
              >
                <FaWhatsapp className="text-green-600" />
                Chat with Farmer
              </button>
            </div>

            {/* Farmer Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-green-600" />
                Farmer Information
              </h3>
              <div className="flex items-start gap-4">
                {product.farmerId?.photo && !product.farmerId.photo.includes('placeholder') ? (
                  <img
                    src={getImageUrl(product.farmerId.photo)}
                    alt={product.farmerId?.name || 'Farmer'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg ${product.farmerId?.photo && !product.farmerId.photo.includes('placeholder') ? 'hidden' : ''}`}>
                  {product.farmerId?.name ? product.farmerId.name.charAt(0).toUpperCase() : <FaUser className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{product.farmerId?.name || 'Farmer'}</h4>
                    {product.farmerId?.verified && (
                      <FaCheckCircle className="text-green-500 text-sm" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {product.farmerId?.location && (
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        {product.farmerId.location}
                      </p>
                    )}
                    {product.farmerId?.contact && (
                      <p className="flex items-center gap-2">
                        <FaPhone />
                        {product.farmerId.contact}
                      </p>
                    )}
                    {product.farmerId?.rating && (
                      <p>⭐ {product.farmerId.rating} Rating{product.farmerId.totalProducts ? ` • ${product.farmerId.totalProducts} Products` : ''}</p>
                    )}
                    {product.farmerId?.joinDate && (
                      <p>Member since {new Date(product.farmerId.joinDate).getFullYear()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {["description", "details", "shipping", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition ${
                      activeTab === tab
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "description" && "Description"}
                    {tab === "details" && "Details"}
                    {tab === "shipping" && "Shipping Info"}
                    {tab === "reviews" && `Reviews (${product.reviewCount || 0})`}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{product.detailedDescription || product.description || 'No detailed description available.'}</p>
                  {product.nutritionalInfo && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Nutritional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {product.nutritionalInfo.calories && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <span className="text-sm text-gray-600">Calories</span>
                            <p className="font-semibold">{product.nutritionalInfo.calories}</p>
                          </div>
                        )}
                        {product.nutritionalInfo.vitamins && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <span className="text-sm text-gray-600">Vitamins</span>
                            <p className="font-semibold">{product.nutritionalInfo.vitamins}</p>
                          </div>
                        )}
                        {product.nutritionalInfo.shelfLife && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <span className="text-sm text-gray-600">Shelf Life</span>
                            <p className="font-semibold">{product.nutritionalInfo.shelfLife}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Category</span>
                      <p className="font-medium">{product.category}{product.subcategory ? ` • ${product.subcategory}` : ''}</p>
                    </div>
                    {product.harvestDate && (
                      <div>
                        <span className="text-sm text-gray-600">Harvest Date</span>
                        <p className="font-medium">{new Date(product.harvestDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {product.qualityGrade && (
                      <div>
                        <span className="text-sm text-gray-600">Quality Grade</span>
                        <p className="font-medium">Grade {product.qualityGrade}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {product.minOrder && (
                      <div>
                        <span className="text-sm text-gray-600">Minimum Order</span>
                        <p className="font-medium">{product.minOrder} {product.unit || 'kg'}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Available Quantity</span>
                      <p className="font-medium">{product.quantity} {product.unit || 'kg'}</p>
                    </div>
                    {(product.city || product.region) && (
                      <div>
                        <span className="text-sm text-gray-600">Location</span>
                        <p className="font-medium">{product.city ? `${product.city}, ` : ''}{product.region || 'Pakistan'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">Delivery Time</span>
                    <span>{product.shipping?.deliveryTime || "2-3 business days"}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">Shipping Cost</span>
                    <span>{product.shipping?.freeShipping ? "Free" : "To be calculated"}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">Return Policy</span>
                    <span>{product.shipping?.returnPolicy || "7 days return policy"}</span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">⭐</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      Customer Reviews ({product.reviewCount || 0})
                    </h4>
                    <p className="text-gray-600">
                      This product has an average rating of {product.rating || 4.5} out of 5 stars
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  <img
                    src={getImageUrl(relatedProduct.mainImage)}
                    alt={relatedProduct.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=400&q=60";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-bold">Rs {relatedProduct.price}</span>
                      <span className="text-sm text-gray-600">{relatedProduct.unit || 'kg'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Product</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">f</span>
                </div>
                <span>Share on Facebook</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">in</span>
                </div>
                <span>Share on LinkedIn</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <FaWhatsapp className="text-green-500 text-xl" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;