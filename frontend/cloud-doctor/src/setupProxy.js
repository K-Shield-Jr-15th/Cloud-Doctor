const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'https://back.takustory.site',
      changeOrigin: true,
      secure: true,
      cookieDomainRewrite: 'localhost',
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Origin', 'https://localhost:3001');
      },
      onProxyRes: (proxyRes, req, res) => {
        const setCookieHeader = proxyRes.headers['set-cookie'];
        if (setCookieHeader) {
          proxyRes.headers['set-cookie'] = setCookieHeader.map(cookie => 
            cookie.replace(/Domain=[^;]+/gi, 'Domain=localhost')
                  .replace(/SameSite=None/gi, 'SameSite=Lax')
          );
        }
      }
    })
  );
};