const gulp = require('gulp');
const umd = require('gulp-umd');

function umd_task() {
    return gulp.src('index.js')
    //   .pipe(umd())
      .pipe(gulp.dest('build'));
}
gulp.task('umd_task', umd_task);


exports.default = umd_task;