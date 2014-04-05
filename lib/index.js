"use strict";

var socket    = require("./socket");
var notify    = require("./notify");
var codeSync  = require("./code-sync");
var ghostMode = require("./ghostmode");
var emitter   = require("./emitter");
var utils     = require("./browser.utils");

/**
 * @constructor
 */
var BrowserSync = function () {
    this.socket  = socket;
    this.emitter = emitter;
    this.utils   = utils;
};

/**
 * Helper to check if syncing is allowed
 * @param data
 * @returns {boolean}
 */
BrowserSync.prototype.canSync = function (data) {
    return data.url === window.location.pathname;
};

var bs;

/**
 * @param opts
 */
function init(opts) {
    bs  = new BrowserSync();
    bs.opts = opts;

    if (opts.notify) {
        notify.init(bs);
        notify.flash("Connected to BrowserSync :)");
    }
    if (opts.ghostMode) {
        ghostMode.init(bs);
    }
}

socket.on("connection", init);

socket.on("reload", function (data) {
    if (data) {
        codeSync.reload(bs.opts, data);
    }
});