"use strict";

var etag  = require("etag");
var fresh = require("fresh");
var fs    = require("fs");
var path  = require("path");

var minifiedScript   = path.join(__dirname, "/dist/index.min.js");
var unminifiedScript = path.join(__dirname, "/dist/index.js");

function setHeaders(res, body) {
    res.setHeader("Cache-Control", "public, max-age=0");
    res.setHeader("Content-Type", "text/javascript");
    res.setHeader("ETag", etag(body));
}

function getScriptBody(options, connector) {

    var script = minifiedScript;

    if (options && !options.minify) {
        script = unminifiedScript;
    }

    return connector + fs.readFileSync(script);
}

function isConditionalGet(req) {
    return req.headers["if-none-match"] || req.headers["if-modified-since"];
}

function notModified(res) {
    res.removeHeader("Content-Type");
    res.statusCode = 304;
    res.end();
}

function init(options, connector, type) {

    var requestBody = getScriptBody(options, connector);

    if (type && type === "file") {
        return requestBody;
    }

    return function (req, res) {
        setHeaders(res, requestBody);

        if (isConditionalGet(req) && fresh(req.headers, res._headers)) {
            return notModified(res);
        }

        res.end(requestBody);
    };
}

module.exports.middleware = init;
module.exports.plugin = init;