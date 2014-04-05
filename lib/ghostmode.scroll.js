"use strict";

/**
 * This is the plugin for syncing scroll between devices
 * @type {string}
 */

var EVENT_NAME    = "scroll";
var canEmitEvents = true;
var browserSync;
var opts;
var utils;

/**
 * @param {BrowserSync} bs
 * @param eventManager
 */
module.exports.init = function (bs, eventManager) {
    browserSync = bs;
    opts  = bs.opts;
    utils = bs.utils;
    watchScroll(opts, bs.socket, eventManager);
    bs.socket.on(EVENT_NAME, scrollEvent);
};

/**
 * @param {object} data
 */
function scrollEvent(data) {

    canEmitEvents = false;

    if (!browserSync.canSync(data)) {
        return;
    }

    if (opts.scrollProportionally) {
        var scrollSpace = utils.getScrollSpace();
        window.scrollTo(0, scrollSpace.y * data.position.proportional); // % of y axis of scroll to px
    } else {
        window.scrollTo(0, data.position.raw);
    }
}

function watchScroll(opts, socket, eventManager) {

    var lastScroll = new Date().getTime();

    eventManager.addEvent(window, "scroll", function () {

        var scrollTop = {
            raw:          getScrollTop(), // Get px of y axis of scroll
            proportional: getScrollTopPercentage() // Get % of y axis of scroll
        };

        var newScroll = new Date().getTime();
        var scrollThrottle = 0;

        if (opts && opts.scrollThrottle) {
            scrollThrottle = opts.scrollThrottle;
        }

        if (newScroll > lastScroll + scrollThrottle) { // throttle scroll events
            if (canEmitEvents) {
                lastScroll = newScroll;
                socket.emit(EVENT_NAME, {
                    position: scrollTop
                });
            }
        }
        canEmitEvents = true;
    });
}

/**
 * @param {{x: number, y: number}} scrollSpace
 * @param scrollPosition
 * @returns {{x: number, y: number}}
 */
function getScrollPercentage (scrollSpace, scrollPosition) {

    var x = scrollPosition.x / scrollSpace.x;
    var y = scrollPosition.y / scrollSpace.y;

    return {
        x: x,
        y: y
    };
}

/**
 * Get just the Y axis of scroll
 * @returns {number}
 */
function getScrollTop () {
    var pos = utils.getScrollPosition();
    return pos.y;
}

/**
 * Get just the percentage of Y axis of scroll
 * @returns {number}
 */
function getScrollTopPercentage() {
    var scrollSpace    = utils.getScrollSpace();
    var scrollPosition = utils.getScrollPosition();
    var percentage     = getScrollPercentage(scrollSpace, scrollPosition);
    return percentage.y;
}