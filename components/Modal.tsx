
import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
    >
      <div className="relative max-w-lg w-full m-4">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-1.5 bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close modal"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};
