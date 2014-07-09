"use strict";

/**
 * This is the plugin for syncing key typing between browsers
 * @type {string}
 */
var EVENT_NAME  = "input:text";
exports.canEmitEvents = true;

/**
 * @param {BrowserSync} bs
 * @param eventManager
 */
exports.init = function (bs, eventManager) {
    eventManager.addEvent(document.body, "keydown", exports.browserEvent(bs));
    bs.socket.on(EVENT_NAME, exports.socketEvent(bs, eventManager));
};

/**
 * Uses event delegation to determine the key element
 * @param {BrowserSync} bs
 * @returns {Function}
 */
exports.browserEvent = function (bs) {

    return function (event) {
        
        var elem = event.target || event.srcElement;
        var data;

        if (exports.canEmitEvents) {
                data = bs.utils.getElementData(elem);
                data.value = event.keyCode.toString();
                bs.socket.emit(EVENT_NAME, data);
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

            var elem = bs.utils.getSingleElement(data.tagName, data.index);
                elem.value = data.value;
                //elem.tagName =data.tagName
            if (elem) {
                exports.canEmitEvents = false;            
                eventManager.triggerTypekey(elem);
            }
        }
    };
};