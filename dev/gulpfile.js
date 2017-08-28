var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require("gulp-babel");

gulp.task('default',function() {
  gulp.watch('./sass/**/*.scss',['styles']);
  gulp.watch('./es6/*.js',['js']);
});

gulp.task('styles', function() {
  gulp.src('./sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('../client/style'));
});

gulp.task("js", function () {
  return gulp.src('./es6/*.js')
    .pipe(babel())
    .pipe(gulp.dest('../client/js'));
});