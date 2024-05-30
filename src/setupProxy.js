const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://bfe7-103-78-218-58.ngrok-free.app',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding to target
      },
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      }
    })
  );
};
