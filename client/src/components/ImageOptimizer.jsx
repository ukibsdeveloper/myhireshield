import React, { useState, useEffect } from 'react';

const ImageOptimizer = ({ src, alt, className, loading = 'lazy', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Preload critical images
    if (loading === 'eager') {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src, loading]);

  const handleError = () => {
    setError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        role="img"
        aria-label={alt || 'Image failed to load'}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && loading === 'lazy' && (
        <div 
          className={`animate-pulse bg-gray-200 ${className}`}
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
};

export default ImageOptimizer;
