
module.exports = {
  lintOnSave: false,

  configureWebpack: {
    devtool: 'source-map'
  },
  
  devServer: {
    port: 8080,
    historyApiFallback: {
      rewrites: [
        { from: /\/app/, to: '/app/index.html' },
        { from: /./, to: '/index.html' }
      ]
    },
  },

  pages: {
    index: {
      entry: 'src/Website/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Brandollo Website',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    plantool: {
      entry: 'src/App/main.js',
      template: 'public/app-index.html',
      filename: 'app/index.html',
      title: 'Brandollo App',
      chunks: ['chunk-vendors', 'chunk-common', 'plantool']
    },
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [        
        "/alt",
        "/product",
        "/free",
        "/about",
        "/team",
        "/get-started",      
        '/learn-more',
        "/terms-and-conditions",
        '/privacy-policy',
        "/pricing",
        "/enquire",


        "/for-startup",
        "/for-accelerators",
        "/for-small-business",
        "/for-agency",

        "/download-ebook",

        "/preview",
        "/preview/demo",
        "/preview/startup",
        "/404"
      ],
      useRenderEvent: false,
      headless: true,
      onlyProduction: true, 
      postProcess: route => {
       if(route.outputPath.indexOf('/alt')){
         route.outputPath = route.outputPath.replace('alt.html','index.html');         
       }
       return route; 
      }
    }
  }
}
