"use strict";

var socket   = require("./socket");
var emitter  = require("./emitter");
var notify   = require("./notify");
var utils    = require("./browser.utils");
var merge    = require("lodash.merge");
var objGet   = require("lodash.get");
var storage  = require("./store");

/**
 * @constructor
 */
var BrowserSync = function (options) {

    this.options = options;
    this.socket  = socket;
    this.emitter = emitter;
    this.utils   = utils;
    this.store   = storage.create(options.sessionId);
    var _this    = this;

    var bs = this;

    if (!this.store.get('client')) {
        this.store.set('client', {
            id: this.socket.socket.id
        });
    }

    var currentId = this.store.get('client.id');

    socket.emit('Client.register', {
        client: bs.store.get('client'),
        data: {
            sessionId: options.sessionId,
            socketId: bs.socket.socket.id
        }
    });

    socket.on('Options.set', function (data) {
        if (data.id === currentId) {
            console.log('received', data.options);
            merge(_this.options, data.options);
        }
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
