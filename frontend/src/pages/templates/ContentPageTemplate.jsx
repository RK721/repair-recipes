import React from "react";
import { Link } from "react-router-dom";

/**
 * Content Page Template
 *
 * A reusable template for content-heavy pages with:
 * - Hero section with title and description
 * - Main content area with sidebar support
 * - Responsive layout
 * - Consistent styling
 *
 * Usage:
 * <ContentPageTemplate
 *   title="Page Title"
 *   description="Page description"
 *   breadcrumbs={[{label: "Home", to: "/"}, {label: "Current Page"}]}
 *   sidebar={<SidebarContent />}
 * >
 *   <MainContent />
 * </ContentPageTemplate>
 */

export default function ContentPageTemplate({
  title,
  description,
  breadcrumbs = [],
  sidebar = null,
  children,
  heroBackground = "bg-gradient-to-br from-blue-50 to-indigo-50",
  className = "",
}) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Hero Section */}
      <section className={`${heroBackground} py-12 lg:py-16`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb Navigation */}
            {breadcrumbs.length > 0 && (
              <nav
                className="flex items-center space-x-2 text-sm text-gray-600 mb-6"
                aria-label="Breadcrumb"
              >
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {crumb.to ? (
                      <Link
                        to={crumb.to}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {crumb.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            {/* Page Header */}
            <div className="text-center animate-slide-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid gap-8 ${
              sidebar ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {/* Main Content Area */}
            <main
              className={`${
                sidebar ? "lg:col-span-3" : "col-span-1"
              } animate-fade-in`}
            >
              {children}
            </main>

            {/* Sidebar */}
            {sidebar && (
              <aside className="lg:col-span-1 animate-fade-in">{sidebar}</aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Content Card Component
 * A styled card for content sections
 */
export function ContentCard({ title, icon, children, className = "" }) {
  return (
    <div className={`card p-8 mb-8 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center mb-6">
          {icon && (
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              {icon}
            </div>
          )}
          {title && (
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Sidebar Widget Component
 * A styled widget for sidebar content
 */
export function SidebarWidget({ title, icon, children, className = "" }) {
  return (
    <div className={`card p-6 mb-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && (
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Feature Grid Component
 * A responsive grid for displaying features or benefits
 */
export function FeatureGrid({ features, columns = 3 }) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {features.map((feature, index) => (
        <div key={index} className="text-center">
          {feature.icon && (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {feature.icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Call to Action Component
 * A styled CTA section
 */
export function CallToAction({
  title,
  description,
  primaryAction,
  secondaryAction,
  background = "bg-gradient-to-r from-blue-600 to-indigo-600",
}) {
  return (
    <section className={`py-16 ${background} text-white`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">{title}</h2>
        {description && (
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && (
            <Link
              to={primaryAction.to}
              className="btn bg-white text-blue-600 hover:bg-gray-100 btn-lg group"
            >
              {primaryAction.icon && (
                <span className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200">
                  {primaryAction.icon}
                </span>
              )}
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 btn-lg group"
            >
              {secondaryAction.icon && (
                <span className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200">
                  {secondaryAction.icon}
                </span>
              )}
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
