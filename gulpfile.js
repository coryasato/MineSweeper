var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    clean      = require('gulp-clean'),
    source     = require('vinyl-source-stream'),
    browserify = require('browserify'),
    reactify   = require('reactify'),
    stylus     = require('gulp-stylus'),
    nib        = require('nib');

/**
 * House Keeping
 */

gulp.task('clean-js', function() {
  gulp.src('./dist/*.js', { read: false } )
    .pipe(clean());
});

gulp.task('clean-css', function() {
  gulp.src('./dist/*.css', { read: false } )
    .pipe(clean());
});

/**
 * Javascript
 */

gulp.task('browserify', ['clean-js'], function() {
  return browserify('./app/main.js')
    .transform(reactify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Stylus
 */

gulp.task('stylus', ['clean-css'], function() {
  gulp.src('./app/styles/**.styl')
    .pipe(stylus({
      use: [nib()]
    }))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Development
 */

gulp.task('watch', function() {
  gulp.watch('./app/**/*.js', ['browserify']);
  gulp.watch('./app/styles/main.styl', ['stylus']);
});

/**
 * Default
 */

gulp.task('default', ['browserify', 'stylus', 'watch']);