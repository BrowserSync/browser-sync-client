var utils = exports;

utils.getFilenameOnly = function (url) {
    return /^[^\?]+(?=\?)?/.exec(url);
};

utils.generateCacheBustUrl = function (href) {
    return utils.getFilenameOnly(href) + "?rel=" + new Date().getTime();
};
