"use strict";

var fs       = require("fs");
var path     = require("path");

var script  = path.resolve(__dirname + "/dist/index.min.js");

module.exports.middleware = function () {

    return function (options, connector, type) {

        var result;

        if (options && options.minify) {
            result = fs.readFileSync(script);
        } else {
            script = path.resolve(__dirname + "/dist/index.js");
            result = fs.readFileSync(script);
        }

        if (type && type === "file") {
            return connector + result;
        }

        return function (req, res) {
            res.setHeader("Content-Type", "text/javascript");
            res.end(connector + result);
        };
    }
};