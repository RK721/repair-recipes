import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="animate-fade-in">
          {/* 404 Illustration */}
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved. 
            Let's get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="btn btn-primary btn-lg w-full group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
            
            <Link
              to="/search"
              className="btn btn-outline w-full group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Tutorials
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800 mb-4">
              If you think this is an error, or if you were looking for something specific:
            </p>
            <div className="space-y-2">
              <Link
                to="/contact"
                className="block text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Contact Support →
              </Link>
              <Link
                to="/about"
                className="block text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Learn About Write2Repair →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;