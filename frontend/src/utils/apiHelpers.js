// src/utils/apiHelpers.js

/**
 * Utility functions for API operations
 */

/**
 * Get full image URL from backend path
 * @param {string} imagePath - Image path from backend
 * @returns {string} Full URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-image.jpg";

  // Replace backslashes (Windows) and encode spaces
  const sanitizedPath = imagePath.replace(/\\/g, "/").split("backend/").pop();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseUrl}/${sanitizedPath}`;
};



/**
 * Format price in Pakistani Rupees
 * @param {number} price - Price value
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Format date
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || "Server error occurred";
  } else if (error.request) {
    // Request made but no response
    return "No response from server. Please check your connection.";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred";
  }
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPG, PNG, or WebP images.",
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB. Please upload a smaller image.`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Create preview URL for image file
 * @param {File} file - Image file
 * @returns {string} Preview URL
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Cleanup preview URLs to prevent memory leaks
 * @param {string|string[]} urls - URL or array of URLs to revoke
 */
export const cleanupImagePreviews = (urls) => {
  const urlArray = Array.isArray(urls) ? urls : [urls];
  urlArray.forEach((url) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isUserAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get auth header for API requests
 * @returns {Object} Headers object
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Calculate percentage discount
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Validate form data
 * @param {Object} data - Form data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} { valid: boolean, errors: Object }
 */
export const validateFormData = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === "string" && !data[field].trim())) {
      errors[field] = `${field} is required`;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Convert file to Base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Get user role from localStorage
 * @returns {string|null} User role
 */
export const getUserRole = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user).role;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Check if current user is a farmer
 * @returns {boolean}
 */
export const isFarmer = () => {
  return getUserRole() === "farmer";
};

/**
 * Check if current user is a buyer
 * @returns {boolean}
 */
export const isBuyer = () => {
  return getUserRole() === "buyer";
};

/**
 * Format phone number for WhatsApp
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone for WhatsApp URL
 */
export const formatPhoneForWhatsApp = (phone) => {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, "");
};

/**
 * Open WhatsApp chat
 * @param {string} phone - Phone number
 * @param {string} message - Pre-filled message (optional)
 */
export const openWhatsAppChat = (phone, message = "") => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ""}`;
  window.open(url, "_blank");
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
};

/**
 * Share product (Web Share API)
 * @param {Object} productData - { title, text, url }
 * @returns {Promise<boolean>} Success status
 */
export const shareProduct = async (productData) => {
  if (navigator.share) {
    try {
      await navigator.share(productData);
      return true;
    } catch (error) {
      console.error("Error sharing:", error);
      return false;
    }
  } else {
    // Fallback: copy URL to clipboard
    return await copyToClipboard(productData.url);
  }
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Retry async function on failure
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} Function result
 */
export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
