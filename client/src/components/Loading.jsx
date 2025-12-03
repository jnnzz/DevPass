// Loading.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ 
  darkMode = true, 
  size = 'medium', 
  message = 'Loading...',
  fullScreen = false,
  type = 'spinner',
  inline = false
}) {
  // Size configurations
  const sizeConfig = {
    small: {
      spinner: 'h-4 w-4',
      icon: 'h-5 w-5',
      text: 'text-xs'
    },
    medium: {
      spinner: 'h-8 w-8',
      icon: 'h-10 w-10',
      text: 'text-sm'
    },
    large: {
      spinner: 'h-12 w-12',
      icon: 'h-16 w-16',
      text: 'text-base'
    },
    xlarge: {
      spinner: 'h-16 w-16',
      icon: 'h-20 w-20',
      text: 'text-lg'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.medium;
  
  // Types of loaders
  const loaderContent = {
    spinner: (
      <Loader2 className={`${currentSize.spinner} animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
    ),
    dots: (
      <div className="flex items-center justify-center space-x-1">
        <div className={`${darkMode ? 'bg-blue-400' : 'bg-blue-600'} w-2 h-2 rounded-full animate-pulse`} style={{animationDelay: '0ms'}}></div>
        <div className={`${darkMode ? 'bg-blue-400' : 'bg-blue-600'} w-2 h-2 rounded-full animate-pulse`} style={{animationDelay: '150ms'}}></div>
        <div className={`${darkMode ? 'bg-blue-400' : 'bg-blue-600'} w-2 h-2 rounded-full animate-pulse`} style={{animationDelay: '300ms'}}></div>
      </div>
    ),
    pulse: (
      <div className={`${currentSize.icon} ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-full animate-pulse`}></div>
    ),
    shimmer: (
      <div className="space-y-2">
        <div className={`${currentSize.spinner} ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-lg animate-pulse`}></div>
      </div>
    )
  };

  const textColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  
  // Full screen loading
  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${
        darkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="text-center">
          {loaderContent[type]}
          {message && (
            <p className={`mt-4 font-medium ${currentSize.text} ${textColor}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline loading
  if (inline) {
    return (
      <div className="inline-flex items-center gap-2">
        {loaderContent[type]}
        {message && (
          <span className={`${currentSize.text} ${textColor}`}>{message}</span>
        )}
      </div>
    );
  }

  // Regular centered loading
  return (
    <div className="flex flex-col items-center justify-center">
      {loaderContent[type]}
      {message && (
        <p className={`mt-3 font-medium ${currentSize.text} ${textColor}`}>
          {message}
        </p>
      )}
    </div>
  );
}