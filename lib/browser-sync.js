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
        
        var segs = path.split(".");

        return getDeepOption(segs, this.options);
        
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
 * @param {Array} segs
 * @param {Object} opts
 */
function getDeepOption(segs, opts) {

    if (segs.length === 2) {
        if (!isUndefined(opts[segs[0]])) {
            if (!isUndefined(opts[segs[0]][segs[1]])) {
                return opts[segs[0]][segs[1]];
            }
        }
    }

    if (segs.length === 3) {
        if (!isUndefined(opts[segs[0]])) {
            if (!isUndefined(opts[segs[0]][segs[1]])) {
                if (!isUndefined(opts[segs[0]][segs[1]][segs[2]])) {
                    return opts[segs[0]][segs[1]][segs[2]];
                }
            }
        }
    }

    return false;
}