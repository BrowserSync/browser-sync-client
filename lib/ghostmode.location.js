"use strict";

/**
 * This is the plugin for syncing location
 * @type {string}
 */
var EVENT_NAME = "browser:location";
var OPT_PATH   = "ghostMode.location";
exports.canEmitEvents = true;

/**
 * @param {BrowserSync} bs
 */
exports.init = function (bs) {
    bs.socket.on(EVENT_NAME, exports.socketEvent());
};

/**
 * Respond to socket event
 */
exports.socketEvent = function (bs) {
    return function (data) {
        if (data.override || bs.canSync(data, OPT_PATH)) {
            if (data.path) {
                exports.setPath(data.path);
            } else {
                exports.setUrl(data.url);
            }
        }
    };
};

/**
 * @param url
 */
exports.setUrl = function (url) {
    window.location = url;
};

/**
 * @param path
 */
exports.setPath = function (path) {
    window.location.pathname = path;
};