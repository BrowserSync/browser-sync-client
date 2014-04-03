"use strict";

var socket    = require("./socket");
var notify    = require("./notify");
var codeSync  = require("./code-sync");
var ghostMode = require("./ghostmode");
var events    = require("./events").manager;

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

socket.on("scroll", function () {
    console.log("Received Scroll event");
});



//events.addEvent(window, "load", function () {                       //#1
//
//    var elem = document.getElementsByTagName("body")[0];
//    elem.addEventListener("click",function (e) {
//        console.log(this);
//        console.log(e);
//    });
//
//});
