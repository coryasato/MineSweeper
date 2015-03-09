var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    clean      = require('gulp-clean'),
    source     = require('vinyl-source-stream'),
    browserify = require('browserify'),
    reactify   = require('reactify');

/**
 * House Keeping
 */

gulp.task('clean', function() {
  gulp.src('./public/*.js', { read: false} )
    .pipe(clean());
});

/**
 * Javascript
 */

gulp.task('browserify', ['clean'], function() {
  return browserify('./app/main.js')
    .transform(reactify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Development
 */

gulp.task('watch', function() {
  gulp.watch('./app/**/*.js', ['browserify']);
});

/**
 * Default
 */

gulp.task('default', ['browserify', 'watch']);