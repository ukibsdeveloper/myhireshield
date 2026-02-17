import React, { useState, useEffect } from 'react';
import { LoadingState } from '../components/LoadingState';

const withAsyncBoundary = (WrappedComponent, options = {}) => {
  const {
    loadingComponent = LoadingState,
    errorComponent = ErrorFallback,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  return function AsyncBoundaryWrapper(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [retries, setRetries] = useState(0);

    const executeAsync = async (asyncFunction, ...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        setLoading(false);
        return result;
      } catch (err) {
        setLoading(false);
        
        if (retries < retryCount) {
          setTimeout(() => {
            setRetries(prev => prev + 1);
            executeAsync(asyncFunction, ...args);
          }, retryDelay * Math.pow(2, retries)); // Exponential backoff
        } else {
          setError(err);
        }
      }
    };

    const resetError = () => {
      setError(null);
      setRetries(0);
    };

    return (
      <div>
        {loading && React.createElement(loadingComponent)}
        {error && React.createElement(errorComponent, { 
          error, 
          onRetry: resetError,
          retryCount: retries 
        })}
        {!loading && !error && (
          <WrappedComponent 
            {...props} 
            executeAsync={executeAsync}
            resetError={resetError}
          />
        )}
      </div>
    );
  };
};

const ErrorFallback = ({ error, onRetry, retryCount }) => (
  <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-lg font-semibold text-red-800 mb-2">
      Operation Failed
    </h3>
    <p className="text-red-600 mb-4">
      {error?.message || 'An unexpected error occurred'}
    </p>
    {retryCount > 0 && (
      <p className="text-sm text-red-500 mb-4">
        Retries attempted: {retryCount}
      </p>
    )}
    <button
      onClick={onRetry}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Try Again
    </button>
  </div>
);

export default withAsyncBoundary;
