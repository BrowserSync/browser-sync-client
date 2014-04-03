//var socket = require("./socket");
var scroll = require("./ghostmode.scroll");


module.exports.init = function (opts) {
    if (opts.scroll) {
        scroll.init(opts);
    }
};