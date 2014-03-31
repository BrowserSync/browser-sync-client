"use strict";

var socket = require("./socket.connecter");
var notify = require("./notify");

socket.on("connection", function (opts) {
    if (opts.notify) {
        notify.init();
        notify.flash("Connected to BrowserSync :)");
    }
});

