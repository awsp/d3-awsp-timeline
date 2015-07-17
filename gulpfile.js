var gulp = require('gulp');
var uglify = require('gulp-uglify');
var typescript = require('gulp-tsc');
var rename = require('gulp-rename');
var Q = require('q');
var outFileStem = 'd3-awsp.timeline';

// Tasks
gulp.task('default', function () {

});

gulp.task('build', ['compile-one', 'minify']);

gulp.task('minify', ['compile-one'], function() {
  return gulp.src('./dest/' + outFileStem + '.js')
    .pipe(uglify())
    .pipe(rename(outFileStem + '.min.js'))
    .pipe(gulp.dest('./dest/'))
  ;
});

gulp.task('compile', function () {
  return gulp.src(['./*.ts'])
    .pipe(typescript())
    .pipe(gulp.dest('dest/'))
  ;
});

gulp.task('compile-one', function () {
  var deferred = Q.defer();

  gulp.src(['./*.ts'])
    .pipe(typescript({
      out: outFileStem + '.js'
    }))
    .pipe(gulp.dest('dest/'))
    .on('end', function () {
      deferred.resolve();
    });
  ;

  return deferred.promise;
});