"use strict";

module.exports = {
    /**
     * Cross-browser scroll position
     * @returns {{x: number, y: number}}
     */
    getScrollPosition: function () {

        var scrollX;
        var scrollY;
        var dElement = document.documentElement;
        var dBody    = document.body;

        if (window.pageYOffset !== undefined) {
            scrollX = window.pageXOffset;
            scrollY = window.pageYOffset;
        } else {
            scrollX = dElement.scrollLeft || dBody.scrollLeft || 0;
            scrollY = dElement.scrollTop || dBody.scrollTop || 0;
        }

        return {
            x: scrollX,
            y: scrollY
        };
    },
    /**
     * @returns {{x: number, y: number}}
     */
    getScrollSpace: function () {
        var dElement = document.documentElement;
        var dBody    = document.body;
        return {
            x: dBody.scrollHeight - dElement.clientWidth,
            y: dBody.scrollHeight - dElement.clientHeight
        };
    }
};