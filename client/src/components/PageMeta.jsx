import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://myhireshield.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

/**
 * Per-page SEO: title, meta description, Open Graph & Twitter tags.
 */
export default function PageMeta({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  noIndex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | HireShield` : 'HireShield | Secure Hiring. Professional Integrity.';
  const url = canonical ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`) : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Verify employees, measure trustworthiness, and hire with confidence. The gold standard for secure employee verification and professional integrity.'} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'Verify employees, measure trustworthiness, and hire with confidence.'} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="HireShield" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || 'Verify employees, measure trustworthiness, and hire with confidence.'} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">
          {typeof jsonLd === 'object' ? JSON.stringify(jsonLd) : jsonLd}
        </script>
      )}
    </Helmet>
  );
}
