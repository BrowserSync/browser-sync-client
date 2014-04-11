"use strict";

var eventManager = require("./events").manager;

exports.plugins = {
    "scroll": require("./ghostmode.scroll"),
    "clicks": require("./ghostmode.clicks"),
    "forms": require("./ghostmode.forms")
};

var options = [
    "scroll",
    "clicks",
    "forms"
];

/**
 * Load plugins for enabled options
 * @param bs
 */
exports.init = function (bs) {
    var ghostMode = bs.opts.ghostMode;
    for (var i = 0, n = options.length; i < n; i += 1) {
        var item = options[i];
        if (ghostMode[item]) {
            exports.plugins[item].init(bs, eventManager);
        }
    }
};