import React from "react";

const Loader = ({ 
  type = "spinner", 
  size = "medium", 
  color = "green", 
  text = "Loading...",
  fullScreen = true,
  overlay = false 
}) => {
  // Size configurations
  const sizeConfig = {
    small: { spinner: "w-8 h-8", dots: "w-2 h-2", text: "text-sm" },
    medium: { spinner: "w-16 h-16", dots: "w-3 h-3", text: "text-base" },
    large: { spinner: "w-24 h-24", dots: "w-4 h-4", text: "text-lg" }
  };

  // Color configurations
  const colorConfig = {
    green: {
      primary: "text-green-500",
      secondary: "text-green-600",
      bg: "bg-green-500",
      light: "bg-green-100"
    },
    blue: {
      primary: "text-blue-500",
      secondary: "text-blue-600",
      bg: "bg-blue-500",
      light: "bg-blue-100"
    },
    orange: {
      primary: "text-orange-500",
      secondary: "text-orange-600",
      bg: "bg-orange-500",
      light: "bg-orange-100"
    },
    purple: {
      primary: "text-purple-500",
      secondary: "text-purple-600",
      bg: "bg-purple-500",
      light: "bg-purple-100"
    }
  };

  // Loader types
  const loaders = {
    spinner: (
      <div className="relative flex items-center justify-center">
        <div className={`${sizeConfig[size].spinner} border-4 ${colorConfig[color].primary} border-t-transparent rounded-full animate-spin`}></div>
        <div className={`absolute ${sizeConfig[size].spinner} border-4 ${colorConfig[color].light} border-t-transparent rounded-full animate-ping`}></div>
      </div>
    ),
    
    dots: (
      <div className="flex items-center justify-center space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${sizeConfig[size].dots} ${colorConfig[color].bg} rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    ),

    pulse: (
      <div className="flex items-center justify-center">
        <div className={`${sizeConfig[size].spinner} ${colorConfig[color].bg} rounded-full animate-pulse`}></div>
      </div>
    ),

    progress: (
      <div className="w-48 bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${colorConfig[color].bg} animate-progress`}
          style={{ animation: 'progress 1.5s ease-in-out infinite' }}
        ></div>
      </div>
    ),

    farm: (
      <div className="relative flex items-center justify-center">
        <div className={`${sizeConfig[size].spinner} border-4 ${colorConfig[color].primary} border-t-transparent rounded-full animate-spin`}></div>
        <div className="absolute">
          <span className="text-2xl">🌱</span>
        </div>
      </div>
    ),

    growing: (
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className={`w-8 h-8 ${colorConfig[color].bg} rounded-full animate-ping`}></div>
          <div className={`absolute top-0 w-8 h-8 ${colorConfig[color].primary} rounded-full animate-grow`}></div>
        </div>
      </div>
    ),

    wave: (
      <div className="flex items-end justify-center space-x-1 h-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-2 ${colorConfig[color].bg} rounded-t-lg animate-wave`}
            style={{ 
              height: `${(i % 2 === 0 ? 60 : 80) + (i * 5)}%`,
              animationDelay: `${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>
    )
  };

  // Container styles based on props
  const containerClass = fullScreen 
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50" 
    : "flex items-center justify-center";

  const contentClass = overlay 
    ? "bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    : "";

  return (
    <div className={containerClass}>
      <div className={`flex flex-col items-center justify-center space-y-4 ${contentClass}`}>
        {loaders[type]}
        
        {text && (
          <div className={`text-center ${colorConfig[color].secondary} ${sizeConfig[size].text} font-medium`}>
            {text}
          </div>
        )}
        
        {/* Optional loading progress for progress type */}
        {type === "progress" && (
          <div className="text-xs text-gray-500 mt-2">
            Preparing your content...
          </div>
        )}
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
        
        @keyframes wave {
          0%, 100% { transform: scaleY(0.8); }
          50% { transform: scaleY(1.2); }
        }
        
        @keyframes grow {
          0% { transform: scale(0.8); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.7; }
        }
        
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
        
        .animate-grow {
          animation: grow 1.5s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Quick loader components for common use cases
export const SpinnerLoader = (props) => <Loader type="spinner" {...props} />;
export const DotsLoader = (props) => <Loader type="dots" {...props} />;
export const PulseLoader = (props) => <Loader type="pulse" {...props} />;
export const ProgressLoader = (props) => <Loader type="progress" {...props} />;
export const FarmLoader = (props) => <Loader type="farm" {...props} />;
export const GrowingLoader = (props) => <Loader type="growing" {...props} />;
export const WaveLoader = (props) => <Loader type="wave" {...props} />;

// Inline loader for small spaces
export const InlineLoader = ({ size = "small", color = "green" }) => (
  <div className="inline-flex items-center justify-center">
    <div className={`${size === "small" ? "w-4 h-4" : "w-6 h-6"} border-2 ${color === "green" ? "border-green-500" : "border-blue-500"} border-t-transparent rounded-full animate-spin`}></div>
  </div>
);

// Page loader with farm theme
export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50 z-50">
    <div className="text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🌾</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-green-800 mb-2">FarmConnect</h3>
      <p className="text-green-600">Loading your farming experience...</p>
      <div className="mt-4 w-48 bg-green-200 rounded-full h-1.5 mx-auto">
        <div className="bg-green-600 h-1.5 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Card loader for loading states in cards
export const CardLoader = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

// Table row loader
export const TableRowLoader = ({ columns = 4 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

export default Loader;