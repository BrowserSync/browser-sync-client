"use strict";

var socket    = require("./socket");
var notify    = require("./notify");
var codeSync  = require("./code-sync");
var ghostMode = require("./ghostmode");

var opts;

socket.on("connection", function (data) {
    opts = data;
    if (opts.notify) {
        notify.init();
        notify.flash("Connected to BrowserSync :)");
    }
    if (opts.ghostMode) {
        ghostMode.init(opts);
    }
});

socket.on("reload", function (data) {
    if (data) {
        codeSync.reload(opts, data);
    }
});