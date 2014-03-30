/*global window*/
/*global document*/
/*global ___socket___*/
(function (window, socket) {

    "use strict";

    var BrowserSync = function () {

    };

    BrowserSync.prototype.init = function (config) {
        console.log(config);
        if (config.ghostMode) {
            console.log("Ghost mode init");
        }
    };

    var browserSync = new BrowserSync();

    function start (data) {
        browserSync.init(data);
    }

    socket.on("connection", start);

}(window, (typeof ___socket___ === "undefined") ? {} : ___socket___));