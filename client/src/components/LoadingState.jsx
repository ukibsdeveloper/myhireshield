import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const { announce } = useAccessibility();
  
  React.useEffect(() => {
    announce(message, 'polite');
  }, [message, announce]);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4" role="status" aria-live="polite">
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className="mt-2 text-sm text-gray-600 sr-only">{message}</span>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse" role="presentation">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden" role="presentation">
    <div className="border-b border-gray-200 p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="border-b border-gray-100 p-4 last:border-b-0">
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
    ))}
  </div>
);

const LoadingState = ({ 
  type = 'spinner', 
  message = 'Loading...', 
  size = 'medium',
  rows = 5 
}) => {
  const renderLoadingComponent = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard />;
      case 'table':
        return <SkeletonTable rows={rows} />;
      case 'spinner':
      default:
        return <LoadingSpinner size={size} message={message} />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {renderLoadingComponent()}
    </div>
  );
};

export { LoadingSpinner, SkeletonCard, SkeletonTable, LoadingState };
export default LoadingState;
