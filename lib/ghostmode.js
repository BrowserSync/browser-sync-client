"use strict";

var socket       = require("./socket");
var eventManager = require("./events").manager;

var plugins = {
    "scroll": require("./ghostmode.scroll")
};

var options = [
    "scroll"
];

/**
 * Load plugins for enabled options
 * @param opts
 */
module.exports.init = function (opts) {
    var ghostMode = opts.ghostMode;
    for (var i = 0, n = options.length; i < n; i += 1) {
        var item = options[i];
        if (ghostMode[item]) {
            plugins[item].init(opts, socket, eventManager);
        }
    }
};