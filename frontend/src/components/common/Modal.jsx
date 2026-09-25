import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({
  isOpen,
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '560px'
}) => {
  const modalOpen = isOpen || open;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen, handleKeyDown]);

  if (!modalOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="modal-title" className="modal-title-text">{title}</h3>
            {subtitle && <p className="modal-subtitle-text">{subtitle}</p>}
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
