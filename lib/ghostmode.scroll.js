"use strict";

var events = require("./events").manager;

var canScroll = true;

var EVENT_NAME = "scroll";

var options;

module.exports.PLUGIN_NAME = "scroll";

/**
 * @param opts
 * @param socket
 */
module.exports.init = function (opts, socket) {
    options = opts;
    watchScroll(options, socket);
    socket.on(EVENT_NAME, scrollEvent);
};

function scrollEvent(data) {
    // ensure synchronization occurs only between same pages
    canScroll = false;
    if (options.scrollProportionally) {
        var scrollSpace = getScrollSpace();
        window.scrollTo(0, scrollSpace[1] * data.position.proportional); // % of y axis of scroll to px
    } else {
        window.scrollTo(0, data.position.raw);
    }
}

function watchScroll(opts, socket) {

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
                socket.emit(EVENT_NAME, {
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