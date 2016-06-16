requirejs.config({
	baseUrl: "js",
	paths: {
		libs: "libs"
	}
});

requirejs(["app"], function(app){
	app.start();
	window.spinHandler = app.toggleSpin;
});