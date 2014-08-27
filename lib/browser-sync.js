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
 * @param optPath
 * @returns {boolean}
 */
BrowserSync.prototype.canSync = function (data, optPath) {


    var canSync = true;

    if (optPath) {
        canSync = this.getOption(optPath);

    }

    return canSync && data.url === window.location.pathname;
};

/**
 * Helper to check if syncing is allowed
 * @returns {boolean}
 */
BrowserSync.prototype.getOption = function (path) {

    if (path && path.match(/\./)) {

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
 * @param path
 * @param def
 */
function getByPath(obj, path) {

    for(var i = 0, path = path.split('.'), len = path.length; i < len; i++){
        if(!obj || typeof obj !== 'object') return false;
        obj = obj[path[i]];
    }

    if(typeof obj === 'undefined') return false;

    return obj;
}