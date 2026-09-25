import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon = null,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'is-loading' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-hidden="true"></span>
      ) : icon ? (
        <span className="btn-icon" aria-hidden="true">{icon}</span>
      ) : null}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
