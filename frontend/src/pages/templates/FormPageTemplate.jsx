import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Form Page Template
 * 
 * A reusable template for form-heavy pages with:
 * - Form validation and error handling
 * - Loading states
 * - Success/error messages
 * - Responsive design
 * - Consistent styling
 * 
 * Usage:
 * <FormPageTemplate
 *   title="Form Title"
 *   description="Form description"
 *   onSubmit={handleSubmit}
 *   loading={isLoading}
 *   success={successMessage}
 *   error={errorMessage}
 * >
 *   <FormField>...</FormField>
 * </FormPageTemplate>
 */

export default function FormPageTemplate({
  title,
  description,
  children,
  onSubmit,
  loading = false,
  success = null,
  error = null,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  cancelTo = null,
  breadcrumbs = [],
  heroBackground = "bg-gradient-to-br from-blue-50 to-indigo-50",
  className = "",
  maxWidth = "max-w-2xl"
}) {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData, { setValidationErrors });
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Hero Section */}
      <section className={`${heroBackground} py-12 lg:py-16`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${maxWidth} mx-auto`}>
            {/* Breadcrumb Navigation */}
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
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
                      <span className="text-gray-900 font-medium">{crumb.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                <p className="text-lg text-gray-600">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`${maxWidth} mx-auto`}>
          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fade-in">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800 mb-1">Success!</h3>
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="card p-8 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Render form fields with context */}
              {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    formData,
                    updateFormData,
                    validationErrors
                  });
                }
                return child;
              })}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    submitLabel
                  )}
                </button>

                {cancelTo && (
                  <Link
                    to={cancelTo}
                    className="btn btn-outline flex-1 text-center"
                  >
                    {cancelLabel}
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Form Field Component
 * A styled form field with validation support
 */
export function FormField({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  required = false,
  options = [], // For select fields
  rows = 4, // For textarea
  accept, // For file inputs
  helpText,
  formData = {},
  updateFormData = () => {},
  validationErrors = {},
  className = ""
}) {
  const value = formData[name] || "";
  const error = validationErrors[name];

  const handleChange = (e) => {
    const newValue = type === "file" ? e.target.files[0] : e.target.value;
    updateFormData(name, newValue);
  };

  const fieldId = `field-${name}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`textarea w-full ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
      ) : type === "select" ? (
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          className={`select w-full ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <input
          type="file"
          id={fieldId}
          name={name}
          onChange={handleChange}
          accept={accept}
          required={required}
          className={`block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200 ${error ? 'border-red-300' : ''}`}
        />
      ) : (
        <input
          type={type}
          id={fieldId}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`input w-full ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

/**
 * Form Section Component
 * Groups related form fields together
 */
export function FormSection({ title, description, icon, children, className = "" }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {(title || description || icon) && (
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center mb-2">
            {icon && (
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Form Grid Component
 * Creates responsive grid layouts for form fields
 */
export function FormGrid({ columns = 2, children, className = "" }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {children}
    </div>
  );
}