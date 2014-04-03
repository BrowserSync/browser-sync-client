"use strict";

var scroll = require("./ghostmode.scroll");

var styles = [
    "background-color: black",
    "color: white",
    "padding: 10px",
    "display: none",
    "font-family: sans-serif",
    "position: absolute",
    "z-index: 9999",
    "right: 0px",
    "border-bottom-left-radius: 5px"
];

var elem;

/**
 * @returns {*}
 */
module.exports.init = function (options) {
    var cssStyles = styles;
    elem = document.createElement("DIV");
    elem.id = "notifyElem";

    if (options.notify.styles) {
        cssStyles = options.notify.styles;
    }

    elem.style.cssText = cssStyles.join(";");
    document.getElementsByTagName("body")[0].appendChild(elem);
    return elem;
};

/**
 * @param message
 * @param [timeout]
 * @returns {*}
 */
module.exports.flash = function (message, timeout) {

    // return if notify was never initialised
    if (!elem) {
        return;
    }

    var html = document.getElementsByTagName("HTML")[0];
    html.style.position = "relative";

    elem.innerHTML = message;
    elem.style.top = scroll.getScrollPosition()[1] + "px";
    elem.style.display = "block";

    window.setTimeout(function () {
        elem.style.display = "none";
    }, timeout || 2000);

    return elem;
};