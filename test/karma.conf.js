// Karma configuration
// Generated on Wed Sep 18 2013 18:10:53 GMT+0100 (BST)

module.exports = function (config) {

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: "",

        // frameworks to use
        frameworks: ["mocha", "sinon"],


        // list of files / patterns to load in the browser
//        files: [
//            "client-script/libs/utils.js",
//            "client-script/libs/jquery.js",
//            "client-script/libs/assert.js",
//            "../node_modules/sinon/pkg/sinon.js",
//            "fixtures/*.html",
//            "client-script/injector/*.js",
//            "../lib/old/browser-sync-client.js"
//        ],

        files: [
            "client-script/libs/utils.js",
            "client-script/libs/jquery.js",
            "client-script/libs/assert.js",
            "../node_modules/sinon/pkg/sinon.js",
//            "fixtures/*.html",
            "../dist/index.js",
            "client-new/stubs/bs.js",
            "client-new/*.js"
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ["dots", "coverage"],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ["Chrome"],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        preprocessors: {
            "fixtures/*.html": ["html2js"],
            "../dist/index.js": ["coverage"]
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false

    });
};
