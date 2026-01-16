const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // In Docker, use container name; in local dev, use localhost
  // Docker: REACT_APP_API_URL=http://f11a-p16-api:5000
  // Local:  REACT_APP_API_URL=http://localhost:5001
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      ws: true, // Enable websocket proxying
    })
  );
};
