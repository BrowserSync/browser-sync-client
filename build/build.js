var UglifyJS    = require("uglify-js");
var fs          = require("vinyl-fs");
var through2    = require("through2");
var File        = require("vinyl");
var browserify  = require('browserify');

var uglifier = function () {
    var combined = "";
    return through2.obj(function (file, enc, cb) {
        combined += file.toString();
        cb();
    }, function (cb) {
        var minified = UglifyJS.minify(combined, {fromString: true});
        this.push(new File({
            cwd:  "./",
            base: "./",
            path: "./dist.js",
            contents: new Buffer(minified.code)
        }));
        cb();
    });
};

var b = browserify();
b.add('./lib/index.js');
b.bundle()
    .pipe(uglifier())
    .pipe(fs.dest("./dist"));
