var gulp = require("gulp");
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');

var testFiles = [
    'test/todo.js'
];

gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src(testFiles)
        .pipe(karma({
            configFile: 'test/karma.conf.js',
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

gulp.task('lint', function () {
    gulp.src(['test/*.js', 'lib/*'])
        .pipe(jshint('test/.jshintrc'))
        .pipe(jshint.reporter('default'))
});
gulp.task('default', ["lint", "test"]);
