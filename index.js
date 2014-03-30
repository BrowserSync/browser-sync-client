var fs       = require("fs");
var path     = require("path");
var UglifyJS = require("uglify-js");

var clientScript = path.resolve(__dirname + "/lib/browser-sync-client.js");
var shims = path.resolve(__dirname + "/lib/client-shims.js");

module.exports.middleware = function () {

    return function (options) {

        var jsFile    = fs.readFileSync(clientScript);
        var jsShims   = fs.readFileSync(shims);
        var result    = jsShims + jsFile;

        if (options && options.minify) {
            result    = UglifyJS.minify(jsShims + jsFile, {fromString: true});
        }

        return function (req, res) {
            res.setHeader("Content-Type", "text/javascript");
            res.end(result);
        };
    }
};