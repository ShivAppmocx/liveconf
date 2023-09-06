const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/bigbluebutton/api',
    createProxyMiddleware({
      target: 'https://scalelite-lb.quiklrn.net',
      changeOrigin: true,
      secure: false, // Use this only for development
    })
  );
};
