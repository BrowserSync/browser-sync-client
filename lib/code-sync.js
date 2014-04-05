"use strict";

var options = {

    tagNames: {
        "css": "link",
        "jpg": "img",
        "jpeg": "img",
        "png": "img",
        "svg": "img",
        "gif": "img",
        "js": "script"
    },
    attrs: {
        "link": "href",
        "img": "src",
        "script": "src"
    }
};

var emitter;

/**
 * @param {BrowserSync} bs
 */
module.exports.init = function (bs) {
    emitter = bs.emitter;
};

/**
 * @param elem
 * @param attr
 * @param opts
 * @returns {{elem: *, timeStamp: number}}
 */
module.exports.swapFile = function (elem, attr, opts) {

    var currentValue = elem[attr];
    var timeStamp = new Date().getTime();
    var suffix = "?rel=" + timeStamp;

    var justUrl = /^[^\?]+(?=\?)/.exec(currentValue);

    if (justUrl) {
        currentValue = justUrl[0];
    }

    if (opts) {
        if (!opts.timestamps) {
            suffix = "";
        }
    }

    elem[attr] = currentValue + suffix;

    return {
        elem: elem,
        timeStamp: timeStamp
    };
};

/**
 * @param opts
 * @param data
 * @returns {*}
 */
module.exports.reload = function (opts, data) {

    var transformedElem;

    if (data.url || !opts.injectChanges) {
        reloadBrowser(true);
    }

    if (data.assetFileName && data.fileExtension) {

        var domData = getElems(data.fileExtension);
        var elems   = getMatches(domData.elems, data.assetFileName, domData.attr);

        if (elems.length && opts.notify) {
            emitter.emit("notify", {message: "Injected: " + data.assetFileName});
        }

        for (var i = 0, n = elems.length; i < n; i += 1) {
            transformedElem = exports.swapFile(elems[i], domData.attr, opts);
        }
    }

    return transformedElem;
};

function getTagName(fileExtension) {
    return options.tagNames[fileExtension];
}

function getAttr(tagName) {
    return options.attrs[tagName];
}

function getMatches(elems, url, attr) {

    var matches = [];

    for (var i = 0, len = elems.length; i < len; i += 1) {
        if (elems[i][attr].indexOf(url) !== -1) {
            matches.push(elems[i]);
        }
    }

    return matches;
}

function getElems(fileExtension) {
    var tagName = getTagName(fileExtension);
    var attr = getAttr(tagName);

    return {
        elems: document.getElementsByTagName(tagName),
        attr: attr
    };
}

function reloadBrowser(confirm) {
    if (confirm) {
        window.location.reload(true);
    }
}