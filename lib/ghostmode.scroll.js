"use strict";

/**
 * This is the plugin for syncing scroll between devices
 * @type {string}
 */
var EVENT_NAME    = "scroll";
exports.canEmitEvents = true;
var browserSync;
var opts;
var utils;

/**
 * @param {BrowserSync} bs
 * @param eventManager
 */
exports.init = function (bs, eventManager) {
    browserSync = bs;
    opts  = bs.opts;
    utils = bs.utils;
    eventManager.addEvent(window, "scroll", exports.watchScroll(bs.socket));
    bs.socket.on(EVENT_NAME, exports.scrollEvent(bs, opts));
};

/**
 * @param {BrowserSync} bs
 */
exports.scrollEvent = function (bs) {

    return function (data) {

        var scrollSpace = utils.getScrollSpace();

        exports.canEmitEvents = false;

        if (!bs.canSync(data)) {
            return false;
        }

        if (bs.opts && bs.opts.scrollProportionally) {
            return window.scrollTo(0, scrollSpace.y * data.position.proportional); // % of y axis of scroll to px
        } else {
            return window.scrollTo(0, data.position.raw);
        }
    };
};

/**
 * @param socket
 */
exports.watchScroll = function (socket) {

    return function () {

        var canSync = exports.canEmitEvents;

        if (canSync) {
            socket.emit(EVENT_NAME, {
                position: exports.getScrollPosition()
            });
        }

        exports.canEmitEvents = true;
    };
};


/**
 * @returns {{raw: number, proportional: number}}
 */
exports.getScrollPosition = function () {
    return {
        raw:          exports.getScrollTop(), // Get px of y axis of scroll
        proportional: exports.getScrollTopPercentage() // Get % of y axis of scroll
    };
};

/**
 * @param {{x: number, y: number}} scrollSpace
 * @param scrollPosition
 * @returns {{x: number, y: number}}
 */
exports.getScrollPercentage = function (scrollSpace, scrollPosition) {

    var x = scrollPosition.x / scrollSpace.x;
    var y = scrollPosition.y / scrollSpace.y;

    return {
        x: x || 0,
        y: y
    };
};

/**
 * Get just the Y axis of scroll
 * @returns {number}
 */
exports.getScrollTop = function () {
    var pos = utils.getScrollPosition();
    return pos.y;
};

/**
 * Get just the percentage of Y axis of scroll
 * @returns {number}
 */
exports.getScrollTopPercentage = function () {
    var scrollSpace    = utils.getScrollSpace();
    var scrollPosition = utils.getScrollPosition();
    var percentage     = exports.getScrollPercentage(scrollSpace, scrollPosition);
    return percentage.y;
};