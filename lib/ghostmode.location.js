"use strict";

/**
 * This is the plugin for syncing location
 * @type {string}
 */
var EVENT_NAME = "location";
var OPT_PATH   = "location";
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
exports.socketEvent = function (bs, eventManager) {
    return function (data) {
        if (bs.canSync(data, OPT_PATH)) {
            window.location = data.url;
        }
    };
};