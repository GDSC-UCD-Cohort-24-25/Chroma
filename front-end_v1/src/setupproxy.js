// src/setupProxy.js
require("dotenv").config()
const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKENDURL = process.env.BACKEND_URL

module.exports = function (app) {
  app.use(
    '/api', // Only proxy requests starting with /api
    createProxyMiddleware({
      target: BACKENDURL, //backend server URL
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '', // Optionally remove `/api` from the URL when forwarding to the backend
      },
    })
  );

  app.use(
    '/auth', // Only proxy requests starting with /auth
    createProxyMiddleware({
      target: BACKENDURL, // Your backend server URL
      changeOrigin: true,
      pathRewrite: {
        '^/auth/': '', // Optionally remove `/auth` from the URL when forwarding to the backend
      },
    })
  );
};