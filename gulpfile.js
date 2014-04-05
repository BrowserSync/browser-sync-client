var gulp        = require("gulp");
var karma       = require('gulp-karma');
var jshint      = require('gulp-jshint');
var contribs    = require('gulp-contribs');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');

var testFiles = [
    'test/todo.js'
];

gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'test/karma.conf.ci.js',
            action: 'run'
        }));
});

gulp.task('test:watch', function() {
    gulp.src(testFiles)
        .pipe(karma({
            configFile: 'test/karma.conf.js',
            action: 'watch'
        }));
});

//gulp.task('lint-test', function () {
//    gulp.src(['test/client-script/*.js', 'test/middleware/*.js'])
//        .pipe(jshint('test/.jshintrc'))
//        .pipe(jshint.reporter("default"))
//        .pipe(jshint.reporter("fail"))
//});

gulp.task('lint-lib', function () {
    gulp.src(['lib/*', '!lib/browser-sync-client.js', '!lib/events.js'])
        .pipe(jshint('lib/.jshintrc'))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"))
});

gulp.task('contribs', function () {
    gulp.src('README.md')
        .pipe(contribs())
        .pipe(gulp.dest("./"))
});

// Basic usage
gulp.task('build', function() {
    // Single entry point to browserify
    gulp.src('lib/index.js')
        .pipe(browserify())
        .pipe(uglify({outSourceMap: true}))
        .pipe(gulp.dest('./dist'))
});

gulp.task("dev", ['build'], function () {
    gulp.watch("lib/*.js", ['build']);
});

gulp.task('default', ["lint-lib", "test"]);
