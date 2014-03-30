var UglifyJS = require("uglify-js");
var fs       = require("vinyl-fs");
var through2 = require("through2");
var File     = require("vinyl");

var src = [
    "lib/client-shims.js",
    "lib/browser-sync-client.js"
];

var writer = function () {

    var combined = "";

    return through2.obj(function (file, enc, cb) {
        combined += file.contents.toString();
        cb();
    }, function (cb) {

        var minified = UglifyJS.minify(combined, {fromString: true});

        this.push(new File({
            cwd:  "./",
            base: "./",
            path: "./dist.js",
            contents: new Buffer(minified.code)
        }));
        cb(null);
    });
};

fs.src(src)
    .pipe(writer())
    .pipe(fs.dest("./dist"));
