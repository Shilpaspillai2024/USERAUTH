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
  base:"/",
  plugins: [react()],
  server: {
    port: 3000, 
  },
  build: {
    outDir: 'dist', 
  },
  resolve: {
    alias: {
      '@': '/src', 
    },
  }
})


