import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' 
import cesium from 'vite-plugin-cesium'; 

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {     
    alias: {       
        '@': resolve(__dirname, 'src'),
    }   
  },   
  plugins: [vue(),cesium()],   
  base: './', //打包路径   
  server: {     
      port: 18120,  //服务端口号     
      open: true,   //服务启动时是否自动打开浏览器     
      cors: true,   //允许跨域     
      proxy: {       
          '/api': {         
              target:'http://www.xxxx.com.cn',         
              changeOrigin:true,         
              rewrite:(path) =>path.replace('/api','')       
          }     
      }   
  } 
})
