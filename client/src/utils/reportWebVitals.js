/**
 * Lightweight Web Vitals: LCP, CLS, INP.
 * No heavy analytics dependency — just measure and optionally send to your backend.
 */

const onReport = (metric) => {
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating ?? '', metric.id);
  }
  // Optional: send to your analytics endpoint
  // if (window.analytics?.track) window.analytics.track('web_vital', { name: metric.name, value: metric.value, rating: metric.rating });
};

function getCLS(onReportCallback) {
  let clsValue = 0;
  const sessionEntries = [];

  const ob = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        sessionEntries.push(entry);
        clsValue += entry.value;
      }
    }
  });
  ob.observe({ type: 'layout-shift', buffered: true });

  const report = () => {
    ob.disconnect();
    onReportCallback({
      name: 'CLS',
      value: clsValue,
      id: 'v1',
      rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(report, { timeout: 3000 });
  } else {
    setTimeout(report, 3000);
  }
}

function getLCP(onReportCallback) {
  const ob = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1];
    if (last) {
      ob.disconnect();
      onReportCallback({
        name: 'LCP',
        value: last.startTime,
        id: last.id || 'v1',
        rating: last.startTime <= 2500 ? 'good' : last.startTime <= 4000 ? 'needs-improvement' : 'poor',
      });
    }
  });
  ob.observe({ type: 'largest-contentful-paint', buffered: true });

  setTimeout(() => ob.disconnect(), 10000);
}

function getINP(onReportCallback) {
  if (!('PerformanceObserver' in window) || !('PerformanceEventTiming' in window)) return;

  let inpValue = 0;
  const ob = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > inpValue) inpValue = entry.duration;
    }
  });
  try {
    ob.observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch (_) {
    return;
  }

  const report = () => {
    ob.disconnect();
    if (inpValue > 0) {
      onReportCallback({
        name: 'INP',
        value: Math.round(inpValue),
        id: 'v1',
        rating: inpValue <= 200 ? 'good' : inpValue <= 500 ? 'needs-improvement' : 'poor',
      });
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(report, { timeout: 5000 });
  } else {
    setTimeout(report, 5000);
  }
}

export function reportWebVitals(callback = onReport) {
  getCLS(callback);
  getLCP(callback);
  getINP(callback);
}

export default reportWebVitals;
