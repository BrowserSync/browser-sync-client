var gulp       = require("gulp");
var jshint     = require("gulp-jshint");
var uglify     = require("gulp-uglify");
var contribs   = require("gulp-contribs");
var through2   = require("through2");
var rename     = require("gulp-rename");
var browserify = require("browserify");
var source     = require("vinyl-source-stream");

gulp.task("lint-test", function () {
    return gulp.src(["test/client-new/*.js", "test/middleware/*.js", "gulpfile.js"])
        .pipe(jshint("test/.jshintrc"))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("lint-lib", function () {
    return gulp.src(["lib/*", "!lib/browser-sync-client.js", "!lib/events.js"])
        .pipe(jshint("lib/.jshintrc"))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("contribs", function () {
    return gulp.src("README.md")
        .pipe(contribs())
        .pipe(gulp.dest("./"));
});

/**
 * Strip debug statements
 * @returns {*}
 */
var stripDebug = function () {
    var chunks = [];
    return through2.obj(function (file, enc, cb) {
        chunks.push(file);
        var string = file._contents.toString();
        var regex  = /\/\*\*debug:start\*\*\/[\s\S]*\/\*\*debug:end\*\*\//g;
        var stripped = string.replace(regex, "");
        file.contents = new Buffer(stripped);
        this.push(file);
        cb();
    });
};

gulp.task("build-dist", function() {
    return browserify("./lib/index.js")
        .bundle()
        .pipe(source("index.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("dist", ["build-dist"], function () {
    return gulp.src(["dist/index.js"])
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(rename("index.min.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("dev", ["build-dist"], function () {
    gulp.watch(["lib/*.js", "test/client-new/**/*.js"], ["dist"]);
});

gulp.task("default", ["lint-lib", "lint-test", "build-dist"]);

gulp.task("build", ["dist"]);
