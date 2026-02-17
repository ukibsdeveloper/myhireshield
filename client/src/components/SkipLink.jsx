import React, { useEffect } from 'react';

const SkipLink = () => {
  useEffect(() => {
    const handleSkipLink = (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.focus();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
      link.addEventListener('click', handleSkipLink);
    });

    return () => {
      skipLinks.forEach(link => {
        link.removeEventListener('click', handleSkipLink);
      });
    };
  }, []);

  return (
    <a 
      href="#main-content" 
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
