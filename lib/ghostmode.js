//var socket = require("./socket");
var scroll = require("./ghostmode.scroll");
var socket = require("./socket");

module.exports.init = function (opts) {
    if (opts.ghostMode.scroll) {
        scroll.init(opts, socket);
    }
};