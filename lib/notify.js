"use strict";

var styles = [
    "background-color: black",
    "color: white",
    "padding: 10px",
    "display: none",
    "font-family: sans-serif",
    "position: absolute",
    "z-index: 9999",
    "right: 0px"
];

var elem;

/**
 * @returns {*}
 */
module.exports.init = function () {
    elem = document.createElement("DIV");
    elem.id = "notifyElem";
    if (styles) {
        elem.style.cssText = styles.join(";");
    }
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
    elem.style.top = "0px";
    elem.style.display = "block";

    window.setTimeout(function () {
        elem.style.display = "none";
    }, timeout || 2000);

    return elem;
};