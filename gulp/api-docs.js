import gulp from 'gulp';
import jsdoc from 'gulp-jsdoc';
import gutil from 'gulp-util';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
//  SORRY, this will NOT work unless jsdoc support ES2015!!
//  ( waiting for jsdoc-3.4.0+ to release )
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

gulp.task('build:api-docs', () => {

    gutil.log(gutil.colors.red.bold("I'm sorry, but the api-docs task will fail!"));
    gutil.log(gutil.colors.red.bold(".. need to wait until jsdoc@3.4.0 is released!"));

    gulp.src("./src/**/*.js")
        .pipe(jsdoc('./doc/api-docs/'));

});

