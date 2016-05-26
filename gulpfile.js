'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var inlinesource = require('gulp-inline-source');
var bump = require('gulp-bump');
var src = ['src/*.js',
           'src/*.html',
           'test/*.js',
           'test/*.html'];

//Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src(src)
    .pipe($.jshint.extract()) // Extract JS from .html files
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

//JavaScript Code Style
gulp.task('jscs', function () {
  return gulp.src([
      'src/*.js',
      'test/*.js'
    ])
    .pipe($.jscs());
});

gulp.task('inlinesource', function () {
  debugger;
  var options = {
    compress: false,
    handlers: [function(source, context, next) {
      if(source.type === 'css') {
        source.attributes.is = 'custom-style';
      }
      next();
    }]
  };
  return gulp.src('./src/paper-autocomplete.html')
    .pipe(inlinesource(options))
    .pipe(gulp.dest('./'));
});

gulp.task('bump', function(){
  gulp.src('./bower.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('default', function (callback) {
  runSequence(
    ['jshint', 'jscs', 'inlinesource'],
    callback);
});

gulp.task('watch', function () {
  gulp.watch(src.concat('src/*.css'), ['default']);
});