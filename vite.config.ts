import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicione este bloco 'define'
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Se você precisar definir outras variáveis de ambiente que achem o 'process.env', adicione-as aqui.
    // Exemplo: 'process.env.API_URL': JSON.stringify(process.env.API_URL),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});