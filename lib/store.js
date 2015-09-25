var utils   = require('./browser.utils');
var $window = utils.getWindow();
var merge   = require("lodash.merge");
var objGet   = require("lodash.get");
var objSet   = require("lodash.set");
var PREFIX  = 'bs=';

function getFromName () {
    try {
        var json = $window.name.match(/bs=(.+)$/);
        if (json) {
            return JSON.parse(json[1]);
        }
    } catch (e) {
        console.log('Could not parse saved JSON');
    }

    return {};
}

function saveInName (incoming) {
    $window.name = PREFIX + JSON.stringify(incoming);
}

function wipeName () {
    $window.name = '';
}


function create (id) {

    function get (path) {

        if (typeof path === 'string') {
            path = path.split('.');
        }

        var prev = getFromName();

        if (prev[id]) {
            return objGet(prev, [id].concat(path));
        }

        return undefined;
    }

    /**
     * @param path
     * @param value
     * @param mergeValues
     */
    function set (path, value, mergeValues) {

        var prev = getFromName();

        if (prev[id]) {
            var newValues = mergeValues ? merge({}, objGet(prev[id], path), value) : value;
            var newObj = objSet(prev[id], path, newValues);
            saveInName(prev);
        } else {

            wipeName();
            var newSession = {};
            newSession[id] = objSet({}, path, value);
            saveInName(newSession);
        }
    }

    return {
        get: get,
        set: set,
        merge: merge
    }
}

module.exports.create = create;