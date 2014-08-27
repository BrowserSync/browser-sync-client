"use strict";

var socket       = require("./socket");
var emitter      = require("./emitter");
var utils        = require("./browser.utils");

/**
 * @constructor
 */
var BrowserSync = function (options) {
    this.options = options;
    this.socket  = socket;
    this.emitter = emitter;
    this.utils   = utils.utils;
};

/**
 * Helper to check if syncing is allowed
 * @param data
 * @returns {boolean}
 */
BrowserSync.prototype.canSync = function (data, opt) {

    return data.url === window.location.pathname;
};

/**
 * Helper to check if syncing is allowed
 * @returns {boolean}
 */
BrowserSync.prototype.getOption = function (path) {

    if (path.match(/\./)) {

        return getByPath(this.options, path);
        
    } else {

        var opt = this.options[path];
        
        if (isUndefined(opt)) {
            return false;
        } else {
            return opt;
        }
    }
};

/**
 * @type {Function}
 */
module.exports = BrowserSync;

/**
 * @param {String} val
 * @returns {boolean}
 */
function isUndefined(val) {

    return "undefined" === typeof val;
}

/**
 * @param obj
 * @param string
 */
function getByPath(obj, string) {

    var segs = string.split(".");

    while (segs.length) {
        var n = segs.shift();
        if (n in obj) {
            obj = obj[n];
        } else {
            return false;
        }
    }
    return obj;
}