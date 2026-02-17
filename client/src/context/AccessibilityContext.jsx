import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    focusVisible: true
  });

  const [announcements, setAnnouncements] = useState([]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load accessibility settings:', e);
      }
    }

    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast
    }));
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announce = (message, priority = 'polite') => {
    const id = Date.now();
    setAnnouncements(prev => [...prev, { id, message, priority }]);
    
    // Remove announcement after it's read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  const getAccessibilityClasses = () => {
    const classes = [];
    if (settings.highContrast) classes.push('high-contrast');
    if (settings.largeText) classes.push('large-text');
    if (settings.reducedMotion) classes.push('reduced-motion');
    if (settings.screenReaderOptimized) classes.push('screen-reader-optimized');
    return classes.join(' ');
  };

  const value = {
    settings,
    updateSetting,
    announce,
    getAccessibilityClasses,
    announcements
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <div className={getAccessibilityClasses()}>
        {children}
        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcements.map(a => a.message).join('. ')}
        </div>
      </div>
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
