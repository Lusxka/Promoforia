// src/components/common/Pagination.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Ícones de seta

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Não renderizar nada se houver apenas uma página
  if (totalPages <= 1) {
    return null;
  }

  // Determine o range de páginas a serem exibidas (ex: mostrar 2 páginas ao redor da atual + primeira/última)
  const pageRange = 2; // Quantas páginas mostrar para cada lado da página atual

  // --- MOVIDO PARA CIMA: Declarar startPage e endPage antes de usá-los ---
  const startPage = Math.max(1, currentPage - pageRange);
  const endPage = Math.min(totalPages, currentPage + pageRange);
  // -------------------------------------------------------------------

  const pages = [];

  // Adiciona a primeira página e reticências se necessário
  if (startPage > 1) {
     pages.push(1);
     if (startPage > 2) {
         pages.push('...'); // Representa páginas omitidas
     }
  }

  // Adiciona as páginas ao redor da página atual
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Adiciona reticências e a última página se necessário
  if (endPage < totalPages) {
     if (endPage < totalPages - 1) {
         pages.push('...'); // Representa páginas omitidas
     }
     pages.push(totalPages);
  }


  return (
    <nav className="flex justify-center items-center space-x-1 md:space-x-2 mt-8">
      {/* Botão Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 md:px-4 md:py-2 border rounded-md text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center"
        aria-label="Página anterior"
      >
         <ChevronLeft size={18} className="mr-1"/> Anterior
      </button>

      {/* Botões de Números das Páginas */}
      {pages.map((page, index) => (
        <React.Fragment key={index}> {/* Usar Fragment para a chave nos casos de '...' */}
             {page === '...' ? (
                 <span className="px-3 py-2 md:px-4 md:py-2 text-neutral-700">...</span>
             ) : (
                 <button
                     onClick={() => onPageChange(page as number)}
                     className={`px-3 py-2 md:px-4 md:py-2 border rounded-md text-sm md:text-base ${currentPage === page ? 'bg-primary-600 text-white border-primary-600' : 'text-neutral-700 hover:bg-neutral-100'}`}
                 >
                     {page}
                 </button>
             )}
         </React.Fragment>
      ))}

      {/* Botão Próximo */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 md:px-4 md:py-2 border rounded-md text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center"
         aria-label="Próxima página"
      >
         Próximo <ChevronRight size={18} className="ml-1"/>
      </button>
    </nav>
  );
};

export default Pagination;