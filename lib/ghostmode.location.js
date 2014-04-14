"use strict";

/**
 * This is the plugin for syncing location
 * @type {string}
 */
var EVENT_NAME = "location";
exports.canEmitEvents = true;

/**
 * @param {BrowserSync} bs
 */
exports.init = function (bs) {
    bs.socket.on("location", exports.socketEvent());
};

/**
 * Respond to socket event
 */
exports.socketEvent = function () {
    return function (data) {
        if (data && data.url) {
            exports.setUrl(data.url);
        }
    };
};

/**
 * Set the window location
 */
exports.setUrl = function (data) {
    window.location = data.url;
};