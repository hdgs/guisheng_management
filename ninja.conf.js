var path = require('path')

module.exports = {
	template: "swig", // whatever template engine you like
	mock: "/mock/mock.json", // dir for mock data
	webpack: true, // flag for using webpack or not
	webpackConfigPath: path.join(__dirname, "./webpack.dev.config.js"),
	// proxy: {
	// 	route: "/guisheng/upload_pics/",
	// 	origin: "http://119.23.35.1:7777"
	// },
	proxy: {
		route: "/api",
		origin: "http://gs.muxixyz.com"
	},
	// proxy: {
	// 	route: "/api",
	// 	origin: "http://xueer.muxixyz.com"
	// },
	staticDir: "/static",
	templateDir: "/templates",
}