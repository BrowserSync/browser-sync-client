var fs = require("fs");
var path = require("path");

var clientScript = path.resolve(__dirname + "/lib/browser-sync-client.js");
var shims = path.resolve(__dirname + "/lib/client-shims.js");

module.exports.middleware = function () {

    var jsFile    = fs.readFileSync(clientScript);
    var jsShims   = fs.readFileSync(shims);
    var result    = jsShims + jsFile;

    return function (req, res) {
        res.setHeader("Content-Type", "text/javascript");
        res.end(result);
    };
};