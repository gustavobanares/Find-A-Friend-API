import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    exclude: ['**/prisma/**'], // Continua excluindo a pasta prisma dos testes
    dir: 'src/http',
  },
});
