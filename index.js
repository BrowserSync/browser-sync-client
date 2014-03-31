"use strict";

var fs       = require("fs");
var path     = require("path");

var built  = path.resolve(__dirname + "/dist/dist.js");

module.exports.middleware = function () {

    return function (options) {

        var result;

        if (options && options.minify) {
            result = fs.readFileSync(built);
        } else {

            var client = path.resolve(__dirname + "/lib/browser-sync-client.js");
            var shims  = path.resolve(__dirname + "/lib/client-shims.js");

            var jsFile  = fs.readFileSync(client);
            var jsShims = fs.readFileSync(shims);

            result  = jsShims + jsFile;
        }

        return function (req, res) {
            res.setHeader("Content-Type", "text/javascript");
            res.end(result);
        };
    }
};