import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',  // Make sure Vite listens on all network interfaces
    port: process.env.PORT || 3000,  // Use the PORT environment variable or fallback to 3000
  },
});
