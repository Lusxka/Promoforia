// src/components/common/ThemeToggle.tsx

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  // ✅ NOVA PROPRIEDADE: para receber as classes de cor do componente pai (Header)
  className?: string; 
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    // O botão agora aplica a className recebida e um hover genérico
    <button
      onClick={toggleDarkMode}
      // A className que o Header passar (com a cor certa) será aplicada aqui
      className={`relative p-2 transition-colors ${className}`}
      aria-label={isDarkMode ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'}
    >
      {isDarkMode ? (
        // O ícone do Sol não precisa de classe de cor, pois já é amarelo por padrão
        <Sun size={22} className="text-yellow-400" />
      ) : (
        // O ícone da Lua herdará a cor do texto do botão
        <Moon size={22} />
      )}
    </button>
  );
};

export default ThemeToggle;