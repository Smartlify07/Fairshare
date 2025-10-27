import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        signup: resolve(__dirname, 'src/pages/signup.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
        friends: resolve(__dirname, 'src/pages/friends.html'),
        bills: resolve(__dirname, 'src/pages/bills.html'),
      },
    },
  },
});
