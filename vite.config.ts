import { ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue'

export default ({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [vue()],
    build: {
      cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      sourcemap: false, // 构建后是否生成 source map 文件。如果为 true，将会创建一个独立的 source map 文件
      target: 'modules', // 设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值——'modules'  还可设置为 'es2015' 'es2016'等
      chunkSizeWarningLimit: 550, // 单位kb  打包后文件大小警告的限制 (文件大于此此值会出现警告)
      assetsInlineLimit: 4096, // 单位字节（1024等于1kb） 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
      minify: 'terser', // 'terser' 相对较慢，但大多数情况下构建后的文件体积更小。'esbuild' 最小化混淆更快但构建后的文件相对更大。
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境去除console
          drop_debugger: true, // 生产环境去除debugger
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const arr = id.toString().split('node_modules/')[1].split('/')
              switch (arr[0]) {
                case '@naturefw': // 自然框架
                case '@popperjs':
                case '@vue':
                case 'element-plus': // UI 库
                case '@element-plus': // 图标
                  return '_' + arr[0]
                default:
                  return '__vendor'
              }
            }
          }
        },
      },
    },
  }
}
