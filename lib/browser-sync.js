"use strict";

var socket  = require("./socket");
var emitter = require("./emitter");
var notify  = require("./notify");
var utils   = require("./browser.utils");
var merge   = require("lodash.merge");
var objGet  = require("lodash.get");
var store  = require("./store");

/**
 * @constructor
 */
var BrowserSync = function (options) {

    this.options = options;
    this.socket  = socket;
    this.emitter = emitter;
    this.utils   = utils;

    var _this = this;
    var _store = store.create(options.id);

    //console.log('current store', _store.get());

    _store.set('user', {
        name: 'shane',
        pet: 'kittie'
    });

    _store.set('user.name', 'Alfred');

    console.log(_store.get('user.name'));

    //console.log();
    //console.log('after set', _store.get());

    /**
     * Options set
     */
    socket.on("options:set", function (data) {
        emitter.emit("notify", "Setting options...");
        merge(_this.options, data.options);
    });
};

/**
 * Helper to check if syncing is allowed
 * @param data
 * @param optPath
 * @returns {boolean}
 */
BrowserSync.prototype.canSync = function (data, optPath) {

    data = data || {};

    if (data.override) {
        return true;
    }

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
    return objGet(this.options, path);
};

/**
 * @type {Function}
 */
module.exports = BrowserSync;