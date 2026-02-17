import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorFallback />;
    }
    return this.props.children;
  }
}

export function ErrorFallback() {
  return (
    <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center px-6 py-12 text-[#496279]">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#dd8d88]/10 text-[#dd8d88] mb-8">
          <i className="fas fa-exclamation-triangle text-4xl"></i>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Something went wrong</h1>
        <p className="text-slate-500 font-medium text-sm mb-8">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-[#496279] text-white rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#3a4e61] transition-colors"
          >
            Reload page
          </button>
          <Link
            to="/"
            className="px-8 py-4 bg-white border-2 border-[#496279] text-[#496279] rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-[#496279]/5 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
