// src/components/Modal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // Ícone de fechar, se estiver usando lucide-react

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  // Opcional: Adicionar um título para o modal
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora do modal (no backdrop)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Fechar ao pressionar a tecla ESC
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
          onClick={handleBackdropClick} // Adiciona o clique no backdrop
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto overflow-hidden" // Container do modal
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          >
            {/* Cabeçalho do Modal (Opcional) */}
            {(title || onClose) && (
              <div className="flex justify-between items-center p-4 border-b border-neutral-200">
                {title && <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>}
                {!title && <div></div>} {/* Espaçador se não houver título, mas houver botão de fechar */}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label="Fechar modal"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            )}

            {/* Conteúdo do Modal */}
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