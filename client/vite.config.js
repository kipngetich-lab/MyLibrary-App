import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig(
{ plugins: [react()],
build: {
    outDir: '../client/dist',
  }, 
 server: { 
 	port: 3000, 
 	proxy: 
 	{ '/api': { 
 		target: 'http://localhost:5000',
 		changeOrigin: true,
 		secure: false },
 	 '/socket.io': { 
 	 	target: 'http://localhost:5000',
 	 	 ws: true } 
 	 } 
  } 
})
