"use strict";

var scroll = require("./ghostmode.scroll");
var utils  = require("./browser.utils");

var styles = [
    "display: none",
    "padding: 15px",
    "font-family: sans-serif",
    "position: fixed",
    "font-size: 0.9em",
    "z-index: 9999",
    "right: 0px",
    "top: 0px",
    "border-bottom-left-radius: 5px",
    "background-color: #1B2032",
    "margin: 0",
    "color: white",
    "text-align: center"
];

var elem;
var options;
var timeoutInt;

/**
 * @param {BrowserSync} bs
 * @returns {*}
 */
exports.init = function (bs) {

    options     = bs.options;

    var cssStyles = styles;

    if (options.notify.styles) {
        cssStyles = options.notify.styles;
    }

    elem = document.createElement("DIV");
    elem.id = "__bs_notify__";
    elem.style.cssText = cssStyles.join(";");

    var flashFn = exports.watchEvent(bs);

    bs.emitter.on("notify", flashFn);
    bs.socket.on("browser:notify", flashFn);

    return elem;
};

/**
 * @returns {Function}
 */
exports.watchEvent = function (bs) {
    return function (data) {
        if (bs.options.notify) {
            if (typeof data === "string") {
                return exports.flash(data);
            }
            exports.flash(data.message, data.timeout);
        }
    };
};

/**
 *
 */
exports.getElem = function () {
    return elem;
};

/**
 * @param message
 * @param [timeout]
 * @returns {*}
 */
exports.flash = function (message, timeout) {

    var elem  = exports.getElem();
    var $body = utils.getBody();

    // return if notify was never initialised
    if (!elem) {
        return false;
    }

    elem.innerHTML     = message;
    elem.style.display = "block";

    $body.appendChild(elem);

    if (timeoutInt) {
        clearTimeout(timeoutInt);
        timeoutInt = undefined;
    }

    timeoutInt = window.setTimeout(function () {
        elem.style.display = "none";
        $body.removeChild(elem);
    }, timeout || 2000);

    return elem;
};