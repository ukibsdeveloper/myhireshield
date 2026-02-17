import React from 'react';
import { useResponsive } from '../context/ResponsiveContext';

const ResponsiveGrid = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 4,
  className = '' 
}) => {
  const { breakpoint } = useResponsive();

  // Get column count for current breakpoint
  const getCols = () => {
    for (const [bp, colCount] of Object.entries(cols).reverse()) {
      if (breakpoint === bp) {
        return colCount;
      }
    }
    return cols.lg || cols.md || cols.sm || cols.xs || 1;
  };

  const colsCount = getCols();
  const gapClass = `gap-${gap}`;

  return (
    <div 
      className={`grid grid-cols-${colsCount} ${gapClass} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  );
};

const ResponsiveContainer = ({ 
  children, 
  className = '',
  maxWidth = '7xl',
  padding = true 
}) => {
  const { isMobile } = useResponsive();

  const paddingClass = padding 
    ? isMobile ? 'px-4' : 'px-6'
    : '';

  return (
    <div className={`max-w-${maxWidth} mx-auto ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

const ResponsiveCard = ({ 
  children, 
  className = '',
  hover = true,
  shadow = true 
}) => {
  const { isMobile } = useResponsive();

  const baseClasses = 'bg-white rounded-lg border border-gray-200 dark:border-gray-700';
  const responsiveClasses = isMobile ? 'p-4' : 'p-6';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  const shadowClasses = shadow ? 'shadow-sm' : '';

  return (
    <div className={`${baseClasses} ${responsiveClasses} ${hoverClasses} ${shadowClasses} ${className}`}>
      {children}
    </div>
  );
};

const ResponsiveButton = ({ 
  children, 
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const { isMobile } = useResponsive();

  const sizeClasses = {
    small: isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm',
    medium: isMobile ? 'px-4 py-3 text-base' : 'px-6 py-3 text-base',
    large: isMobile ? 'px-6 py-4 text-lg' : 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${sizeClasses[size]} ${widthClass} bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const ResponsiveNav = ({ children, className = '' }) => {
  const { isMobile } = useResponsive();

  return (
    <nav className={`${isMobile ? 'flex-col' : 'flex-row'} flex ${className}`}>
      {children}
    </nav>
  );
};

// Hook for responsive values
export const useResponsiveValue = (values) => {
  const { breakpoint } = useResponsive();
  
  // Return value for current breakpoint or fallback to lg
  return values[breakpoint] || values.lg || values.md || values.sm || values.xs;
};

// Hook for responsive styles
export const useResponsiveStyles = (styles) => {
  const { breakpoint } = useResponsive();
  
  return styles[breakpoint] || styles.lg || styles.md || styles.sm || styles.xs;
};

export {
  ResponsiveGrid,
  ResponsiveContainer,
  ResponsiveCard,
  ResponsiveButton,
  ResponsiveNav,
};

export default ResponsiveGrid;
