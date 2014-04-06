"use strict";

/**
 * @returns {window}
 */
module.exports.getWindow = function () {
    return window;
};

/**
 *
 * @returns {HTMLDocument}
 */
module.exports.getDocument = function () {
    return document;
};

/**
 * @type {{getScrollPosition: getScrollPosition, getScrollSpace: getScrollSpace}}
 */
module.exports.utils = {
    /**
     * Cross-browser scroll position
     * @returns {{x: number, y: number}}
     */
    getScrollPosition: function () {

        var $window   = exports.getWindow();
        var $document = exports.getDocument();
        var scrollX;
        var scrollY;
        var dElement = $document.documentElement;
        var dBody    = $document.body;

        if ($window.pageYOffset !== undefined) {
            scrollX = $window.pageXOffset;
            scrollY = $window.pageYOffset;
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
        var $document = exports.getDocument();
        var dElement = $document.documentElement;
        var dBody    = $document.body;
        return {
            x: dBody.scrollHeight - dElement.clientWidth,
            y: dBody.scrollHeight - dElement.clientHeight
        };
    }
};