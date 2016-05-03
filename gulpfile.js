'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var inlinesource = require('gulp-inline-source');
var merge = require('merge-stream');
var bump = require('gulp-bump');
var vulcanize = require('gulp-vulcanize');
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

//Copy Files to .tmp
gulp.task('copy', function () {
  var src = gulp.src([
    'src/*',
  ]).pipe(gulp.dest('.tmp/paper-autocomplete'));

  var bower = gulp.src([
    'bower_components/**/*'
  ]).pipe(gulp.dest('.tmp/'));

  return merge(src, bower)
    .pipe($.size({title: 'copy'}));
});

//Create the polymer element with imports intact
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

//Vulcanize imports
gulp.task('vulcanize', function () {

  return gulp.src('.tmp/paper-autocomplete/paper-autocomplete.html')
    .pipe(vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe($.crisper())
    // Minify paper-autocomplete.js
    .pipe($.if('*.js', $.uglify()))
    .pipe(gulp.dest('./dist'))
    .pipe($.size({title: 'vulcanize'}));
});

//Clean Output Directory
gulp.task('clean', function (cb) {
  return del('.tmp', cb);
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

gulp.task('dist', function (callback) {
  runSequence(
    'clean',
    ['default', 'copy'],
    'vulcanize',
    callback);
});
