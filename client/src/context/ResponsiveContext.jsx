import React, { createContext, useContext, useState, useEffect } from 'react';

const ResponsiveContext = createContext();

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return context;
};

// Breakpoint definitions
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const ResponsiveProvider = ({ children }) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });

      // Determine current breakpoint
      let currentBreakpoint = 'xs';
      for (const [bp, minWidth] of Object.entries(breakpoints).reverse()) {
        if (width >= minWidth) {
          currentBreakpoint = bp;
          break;
        }
      }
      setBreakpoint(currentBreakpoint);
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
  const isSmallScreen = windowSize.width < 768;
  const isMediumScreen = windowSize.width >= 768 && windowSize.width < 1024;
  const isLargeScreen = windowSize.width >= 1024;

  const value = {
    windowSize,
    breakpoint,
    breakpoints,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export default ResponsiveProvider;
