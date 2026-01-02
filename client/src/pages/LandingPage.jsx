import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Add scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="navbar py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.jpg" alt="MyHireShield" className="h-12 w-12 object-contain" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-red-500 bg-clip-text text-transparent">
                MyHireShield
              </span>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-8">
              <li><a href="#features" className="navbar-link">Features</a></li>
              <li><a href="#how-it-works" className="navbar-link">How It Works</a></li>
              <li><a href="#pricing" className="navbar-link">Pricing</a></li>
              {isAuthenticated ? (
                <li>
                  <Link 
                    to={user?.role === 'company' ? '/dashboard/company' : '/dashboard/employee'} 
                    className="btn btn-primary"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li><Link to="/login" className="navbar-link">Sign In</Link></li>
                  <li><Link to="/register/company" className="btn btn-primary">Get Started</Link></li>
                </>
              )}
            </ul>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-2xl">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-red-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-on-scroll">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Employers.
                <span className="block text-gradient">Protecting Futures.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Make smarter hiring decisions with verified employee backgrounds, authentic reviews, 
                and comprehensive verification reports. Like CIBIL score for employment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register/company" className="btn btn-primary text-lg px-8 py-4">
                  <i className="fas fa-building mr-2"></i>
                  For Companies
                </Link>
                <Link to="/register/employee" className="btn btn-secondary text-lg px-8 py-4">
                  <i className="fas fa-user mr-2"></i>
                  For Employees
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">10K+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">50K+</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">100K+</div>
                  <div className="text-sm text-gray-600">Verifications</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Illustration */}
            <div className="animate-on-scroll">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-red-400 rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                  <img src="/logo.jpg" alt="MyHireShield Platform" className="w-full h-auto" />
                  
                  {/* Score Indicator Demo */}
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full border-8 border-green-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">85</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">Excellent</div>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full border-8 border-yellow-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-600">55</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">Average</div>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full border-8 border-red-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-red-600">25</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">Poor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Smart Hiring</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to make informed hiring decisions and build a verified professional profile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-shield-alt text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Profiles</h3>
              <p className="text-gray-600">
                Complete background verification with document validation and authenticity checks
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fas fa-star text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Parameter Reviews</h3>
              <p className="text-gray-600">
                8 detailed rating parameters for comprehensive employee evaluation
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="fas fa-chart-line text-3xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Score Indicators</h3>
              <p className="text-gray-600">
                Visual green/yellow/red scoring system for quick hiring decisions
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fas fa-file-alt text-3xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Document Verification</h3>
              <p className="text-gray-600">
                Automated verification of Aadhaar, PAN, certificates, and more
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                <i className="fas fa-search text-3xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Search</h3>
              <p className="text-gray-600">
                Filter by score, skills, experience, location, and verification status
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <i className="fas fa-lock text-3xl text-yellow-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600">
                Two-factor authentication, encryption, and complete audit logging
              </p>
            </div>

            {/* Feature 7 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                <i className="fas fa-file-pdf text-3xl text-pink-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">PDF Reports</h3>
              <p className="text-gray-600">
                Download comprehensive verification reports for your records
              </p>
            </div>

            {/* Feature 8 */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                <i className="fas fa-balance-scale text-3xl text-teal-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">GDPR Compliant</h3>
              <p className="text-gray-600">
                Full data rights management with export and deletion options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 3-step process to start making better hiring decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center animate-on-scroll">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  1
                </div>
                <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-green-400 to-blue-400"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Register & Verify</h3>
              <p className="text-gray-600">
                Companies register with business email. Employees create profiles and upload documents for verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center animate-on-scroll">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  2
                </div>
                <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-400 to-red-400"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Search & Review</h3>
              <p className="text-gray-600">
                Companies search verified employees, view complete profiles, and submit detailed reviews with 8 parameters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center animate-on-scroll">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hire with Confidence</h3>
              <p className="text-gray-600">
                Make informed decisions using score indicators, verified documents, and authentic company reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Start for free. No hidden charges. No surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">₹0</div>
                <div className="text-gray-600">Forever</div>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Search verified employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>View basic profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Submit 5 reviews/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Basic document verification</span>
                </li>
              </ul>
              <Link to="/register/company" className="btn btn-outline w-full">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll border-4 border-green-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">₹999</div>
                <div className="text-gray-600">Per month</div>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Unlimited employee searches</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Full profile access</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Unlimited reviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Advanced document verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>PDF report downloads</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/register/company" className="btn btn-primary w-full">
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="card text-center hover:scale-105 transition-transform animate-on-scroll">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">Custom</div>
                <div className="text-gray-600">Contact us</div>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>White-label options</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                  <span>24/7 support</span>
                </li>
              </ul>
              <a href="mailto:sales@myhireshield.com" className="btn btn-outline w-full">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-red-600">
        <div className="container mx-auto px-4 text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies making smarter, safer hiring decisions with MyHireShield
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/company" className="btn bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
              Get Started Free
            </Link>
            <a href="#features" className="btn border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.jpg" alt="MyHireShield" className="h-10 w-10 object-contain" />
                <span className="text-xl font-bold">MyHireShield</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering employers. Protecting futures.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/consent" className="text-gray-400 hover:text-white transition-colors">Consent Form</Link></li>
                <li><Link to="/data-rights" className="text-gray-400 hover:text-white transition-colors">Data Rights</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 MyHireShield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;