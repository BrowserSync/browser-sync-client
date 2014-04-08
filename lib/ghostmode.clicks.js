"use strict";

/**
 * This is the plugin for syncing clicks between browsers
 * @type {string}
 */
var EVENT_NAME  = "click";
exports.canEmitEvents = true;

/**
 * @param {BrowserSync} bs
 * @param eventManager
 */
exports.init = function (bs, eventManager) {
    var body = exports.utils.getBody();
    eventManager.addEvent(body, EVENT_NAME, exports.browserEvent(bs.socket));
    bs.socket.on(EVENT_NAME, exports.socketEvent(bs, eventManager));
};

/**
 * Uses event delegation to determine the clicked element
 * @param {BrowserSync.socket} socket
 * @returns {Function}
 */
exports.browserEvent = function (socket) {

    return function (event) {

        if (exports.canEmitEvents) {

            var elem    = event.target || event.srcElement;

            if (elem.type === "checkbox" || elem.type === "radio") {
                return;
            }

            var tagName = elem.tagName;
            var index   = exports.getElementIndex(tagName, elem);

            var data = {
                tagName: tagName,
                index: index
            };

            socket.emit(EVENT_NAME, data);

        } else {
            exports.canEmitEvents = true;
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

            exports.canEmitEvents = false;

            if (elem && bs.canSync(data)) {
                eventManager.triggerClick(elem);
            }
        }
    };
};

/**
 * @param {string} tagName
 * @param {HTMLElement} elem
 */
exports.getElementIndex = function (tagName, elem) {
    var allElems = document.getElementsByTagName(tagName);
    return Array.prototype.indexOf.call(allElems, elem);
};


exports.getElementData = function (elem) {

};

/**
 * @returns {HTMLElement}
 */
exports.utils = {
    getBody: function () {
        return document.getElementsByTagName("body")[0];
    }
};