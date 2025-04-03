// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000, // Set the server to run on port 3000
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set the server to run on port 3000
  },
  build: {
    outDir: 'dist', // Ensure it's set to 'dist' for Render deployment
  },
  resolve: {
    alias: {
      '@': '/src', // Optional alias setup
    },
  },
  // Ensure React Router works with Render
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})

