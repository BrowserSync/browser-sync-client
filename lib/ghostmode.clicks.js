"use strict";

/**
 * This is the plugin for syncing clicks between browsers
 * @type {string}
 */
var canEmitEvents = true;
var EVENT_NAME  = "click";

/**
 * @param {BrowserSync} bs
 * @param eventManager
 */
exports.init = function (bs, eventManager) {
    var body = exports.getBody();
    eventManager.addEvent(body, EVENT_NAME, exports.browserEvent(bs.socket));
    bs.socket.on(EVENT_NAME, exports.socketEvent(bs, eventManager));
};

/**
 * @param {BrowserSync.socket} socket
 * @returns {Function}
 */
exports.browserEvent = function (socket) {

    return function (event) {

        if (canEmitEvents) {

            var elem = event.target || event.srcElement;
            var tagName = elem.tagName;

            if (elem.type === "checkbox" || elem.type === "radio") {
                return;
            }

            var allElems = document.getElementsByTagName(tagName);
            var index = Array.prototype.indexOf.call(allElems, elem);

            var data = {
                tagName: tagName,
                index: index
            };

            socket.emit(EVENT_NAME, data);

        } else {
            canEmitEvents = true;
        }
    };
};

/**
 * @param {BrowserSync} bs
 * @param {manager} eventManager
 * @returns {Function}
 */
exports.socketEvent = function (bs, eventManager) {

    return function (data) {

        if (bs.canSync(data)) {

            var elems = document.getElementsByTagName(data.tagName);
            var elem = elems[data.index];

            canEmitEvents = false;

            if (elem && bs.canSync(data)) {
                eventManager.triggerClick(elem);
            }
        }
    };
};

/**
 * @returns {HTMLElement}
 */
exports.getBody = function () {
    return document.getElementsByTagName("body")[0];
};