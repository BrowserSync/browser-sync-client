"use strict";

var events = require("./events").manager;
var socket = require("./socket");

var canScroll = true;

/**
 * @param opts
 */
module.exports.init = function (opts) {
    watchScroll(opts);
};

function watchScroll(opts) {

    var lastScroll = new Date().getTime();

    events.addEvent(window, "scroll", function () {

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

            if (canScroll) {
                lastScroll = newScroll;

                socket.emit("scroll", {
                    position: scrollTop
                });
            }
        }

        canScroll = true;

    });
}

/**
 * Get scroll position cross-browser
 * @returns {Array}
 */
function getScrollPosition() {

    var sx, sy, d = document, r = d.documentElement, b = d.body;

    if (window.pageYOffset !== undefined) {
        return [window.pageXOffset, window.pageYOffset];
    }

    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;

    return [sx, sy];
}
/**
 * Get percentage of scroll position
 * @returns {Array}
 */
function getScrollPercentage (scrollSpace, scrollPosition) {

    var psx = scrollPosition[0] / scrollSpace[0];
    var psy = scrollPosition[1] / scrollSpace[1];

    return [psx, psy];
}

/**
 * Get scroll space in pixels
 * @returns {Array}
 */
function getScrollSpace () {
    var ssx, ssy, d = document, r = d.documentElement,
        b = d.body;

    ssx = b.scrollHeight - r.clientWidth;
    ssy = b.scrollHeight - r.clientHeight;

    return [ssx, ssy];
}

/**
 * Get just the Y axis of scroll
 * @returns {Number}
 */
function getScrollTop () {
    return getScrollPosition()[1];
}

/**
 * Get just the percentage of Y axis of scroll
 * @returns {Number}
 */
function getScrollTopPercentage() {
    var scrollSpace = getScrollSpace();
    var scrollPosition = getScrollPosition();
    return getScrollPercentage(scrollSpace, scrollPosition)[1];
}
/**
 * @param {Object} ghostMode
 * @param {number} y
 */
function setScrollTop(ghostMode, y) {
    canScroll = false;
    window.scrollTo(0, y);
}