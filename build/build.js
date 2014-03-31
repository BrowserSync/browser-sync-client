var UglifyJS    = require("uglify-js");
var fs         = require("vinyl-fs");
var through2    = require("through2");
var File        = require("vinyl");
var browserify  = require('browserify');

var eventsFile  = fs.src("lib/events.js");

/**
 * @returns {*}
 */
var uglifier = function () {
    return through2.obj(function (file, enc, cb) {
        var minified = UglifyJS.minify(file.toString(), {fromString: true});
        this.push(new File({
            cwd:  "./",
            base: "./",
            path: "./dist.js",
            contents: new Buffer(minified.code)
        }));
        cb(null);
    });
};

/**
 *
 * @returns {*}
 */
var combiner = function (events) {

    var eventCode;
    events.pipe(through2.obj(function (file, enc, cb) {
        eventCode = file.contents.toString();
        cb();
    }));
    var string;
    return through2.obj(function (data, enc, cb) {
        string += data.toString();
        cb(null);
    }, function (cb) {
        if (string.length) {
            this.push(new Buffer(eventCode + string));
        }
        this.push(null);
        cb();
    });
};

var b = browserify();
b.add('./lib/index.js');
b.bundle()
    .pipe(combiner(eventsFile))
    .pipe(uglifier())
    .pipe(fs.dest("./dist"));