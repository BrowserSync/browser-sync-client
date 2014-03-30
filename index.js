"use strict";

var fs       = require("fs");
var path     = require("path");

var script = path.resolve(__dirname + "/lib/browser-sync-client.js");
var shims  = path.resolve(__dirname + "/lib/client-shims.js");

module.exports.middleware = function () {

    return function (options) {

        var jsFile  = fs.readFileSync(script);
        var jsShims = fs.readFileSync(shims);
        var result  = jsShims + jsFile;

        if (options && options.minify) {
            var UglifyJS = require("uglify-js");
            result = UglifyJS.minify(result, {fromString: true});
        }

        return function (req, res) {
            res.setHeader("Content-Type", "text/javascript");
            res.end(result.code);
        };
    }
};