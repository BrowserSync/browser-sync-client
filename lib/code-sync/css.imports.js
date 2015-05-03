var $document = require("../browser.abstractions").$document();
var utils     = require("./utils");

cssimports = exports;

/**
 * Find any imports that match the basename of
 * the requested file
 * @param basename
 * @returns {Array}
 */
cssimports.getMatches = function (data) {
    var imported = [];
    var ref = $document.getElementsByTagName('style');
    var style;
    var match = [];

    for (var i = 0, len = ref.length; i < len; i++) {
        style = ref[i];
        if (style.sheet) {
            cssimports.collect(style, style.sheet, imported);
        }
    }

    if (imported.length) {

        if (data.basename[0] === "*") {
            return imported;
        }

        return imported.filter(function (item) {
            return item.href.indexOf(data.basename) > -1;
        });
    }

    return match;
};

/**
 * @param link
 * @param styleSheet
 * @param result
 */
cssimports.collect = function (link, styleSheet, result) {
    var rule, rules, i;
    try {
        rules = styleSheet != null ? styleSheet.cssRules : void 0;
    } catch (error) {
        /* noop */
    }
    if (rules && rules.length) {
        for (var index = i = 0, len = rules.length; i < len; index = ++i) {
            rule = rules[index];
            switch (rule.type) {
                case CSSRule.CHARSET_RULE:
                    continue;
                case CSSRule.IMPORT_RULE:
                    result.push({
                        link: link,
                        rule: rule,
                        index: index,
                        href: rule.href
                    });
                    cssimports.collect(link, rule.styleSheet, result);
                    break;
                default:
                    break;
            }
        }
    }
};

/**
 * @param item
 */
cssimports.reattach = function(item) {

    var rule    = item.rule;
    var index   = item.index;
    var link    = item.link;
    var parent  = rule.parentStyleSheet;
    var href    = utils.generateCacheBustUrl(rule.href);
    var media   = rule.media.length ? [].join.call(rule.media, ', ') : '';
    var newRule = "@import url(\"" + href + "\") " + media + ";";

    rule.__BrowserSync_newHref = href;

    var tempLink  = document.createElement("link");
    tempLink.rel  = 'stylesheet';
    tempLink.href = href;
    tempLink.__BrowserSync_pendingRemoval = true;

    if (link.parentNode) {
        link.parentNode.insertBefore(tempLink, link);
    }

    setTimeout(function () {
        if (tempLink.parentNode) {
            tempLink.parentNode.removeChild(tempLink);
        }

        if (rule.__BrowserSync_newHref !== href) {
            return;
        }

        parent.insertRule(newRule, index);
        parent.deleteRule(index + 1);
        rule = parent.cssRules[index];
        rule.__BrowserSync_newHref = href;

        return setTimeout(function() {
            if (rule.__BrowserSync_newHref !== href) {
                return;
            }
            parent.insertRule(newRule, index);
            return parent.deleteRule(index + 1);

        }, 200);

    }, 200);
};