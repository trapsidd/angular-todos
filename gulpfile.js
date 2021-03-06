var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')();

// Paths
var paths = {
  main: 'app/index.html',
  images: 'app/assets/images/**',
  fonts: 'app/assets/fonts/**',
  styles: 'app/styles/*.scss',
  scripts: 'app/scripts/*.js'
};

// Server task
gulp.task('serve', ['compile'], function() {
  browserSync.init({
    server: {
    baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // Watchers
  gulp.watch(paths.main).on('change', reload);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('compile', function(cb) {
  runSequence('wiredep', 'styles', 'scripts', 'fonts', cb);
});

// Styles task
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.sass.sync({
      includePaths: ['.']
    }))
    .on('error', $.sass.logError)
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

// Scripts task
gulp.task('scripts', function(){
  return gulp.src(paths.scripts)
    .pipe($.plumber())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});


gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {}).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'));
});

// Wiredep
gulp.task('wiredep', function() {
  gulp.src(paths.styles)
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src(paths.main)
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
      exclude: ['bootstrap-sass'],
      exclude: ['bootstrap.js']
    }))
    .pipe(gulp.dest('app'));
});

// Default task
gulp.task('default', ['serve']);
