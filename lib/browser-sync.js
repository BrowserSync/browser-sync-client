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

    bs.register();

    socket.on('Options.set', function (data) {
        if (data.id === currentId) {
            console.log('received', data.options);
            merge(_this.options, data.options);
        }
    });

    socket.on('reconnect', function () {
        utils.reloadBrowser();
    });

    var resizing = false;
    var timeout  = 1000;
    var int;

    utils.getWindow().addEventListener('resize', function () {
        if (!resizing) {
            resizing = true;
            int = setTimeout(function () {
                resizing = false;
                clearTimeout(int);
                bs.register();
            }, timeout);
        }
    });
};

/**
 *
 */
BrowserSync.prototype.register = function () {

    var bs = this;
    var options = this.options;

    /**
     * As per protocol, send 'client' + optional data
     */
    socket.emit('Client.register', {
        client: bs.store.get('client'),
        data: {
            hash: utils.getWindow().location.hash,
            sessionId: options.sessionId,
            socketId:  bs.socket.socket.id,
            browser: {
                scroll: utils.getBrowserScrollPosition(),
                dimensions: {
                    width:  utils.getDocument().documentElement.scrollWidth,
                    height: utils.getDocument().documentElement.scrollHeight
                }
            }
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
