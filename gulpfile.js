var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var typescript = require('gulp-tsc');
var rename = require('gulp-rename');
var Q = require('q');

var outFileStem = 'd3-awsp.timeline';
var out = 'dist/';

// Tasks
gulp.task('default', function () {

});

gulp.task('build', ['compile-one', 'minify-js', 'minify-css']);

/**
 * Minify CSS Task
 * - Exclude all *.min.css files.
 */
gulp.task('minify-css', function () {
  return gulp.src([
    './build/*.css',
    '!build/*.min.css'
  ]).pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./' + out))
    ;
});

/**
 * Minify JS Task
 * - Exclude all *.min.js files.
 */
gulp.task('minify-js', ['compile-one'], function () {
  return gulp.src([
    './' + out + '*.js',
    '!' + out + '*.min.js',
  ]).pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./' + out))
    ;
});

/**
 * Compile TypeScript Task
 */
gulp.task('compile', function () {
  return gulp.src(['./*.ts'])
    .pipe(typescript())
    .pipe(gulp.dest(out))
    ;
});

/**
 * Compile TypeScript Task into one file.
 */
gulp.task('compile-one', function () {
  var deferred = Q.defer();

  gulp.src(['./*.ts'])
    .pipe(typescript({
      out: outFileStem + '.js',
      noEmitOnError: false
    }))
    .pipe(gulp.dest(out))
    .on('end', function () {
      deferred.resolve();
    });
  ;

  return deferred.promise;
});