import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            // CORREÇÃO DARK MODE: Fundo do painel do modal
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-lg w-full mx-auto overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          >
            {/* CORREÇÃO DARK MODE: Cabeçalho do modal */}
            {(title || onClose) && (
              <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
                {title && <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">{title}</h3>}
                {!title && <div></div>}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    aria-label="Fechar modal"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            )}

            <div className="p-6">
              {children}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;