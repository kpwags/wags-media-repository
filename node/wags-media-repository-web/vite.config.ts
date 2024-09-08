import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
  ],
  server: {
    port: 3009,
  },
  resolve: {
    alias: {
      '@components': resolve(projectRootDir, 'src/components'),
      '@contexts': resolve(projectRootDir, 'src/contexts'),
      '@hooks': resolve(projectRootDir, 'src/hooks'),
      '@lib': resolve(projectRootDir, 'src/lib'),
      '@models': resolve(projectRootDir, 'src/models'),
      '@pages': resolve(projectRootDir, 'src/pages'),
    },
  }
})
