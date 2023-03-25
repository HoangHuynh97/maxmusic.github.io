const { createProxyMiddleware } = require('http-proxy-middleware');
const apiLink = "http://localhost/music";

module.exports = app => {
	app.use(
		createProxyMiddleware('/api_login', {
			target: apiLink,
			changeOrigin: true
		})
	)
}