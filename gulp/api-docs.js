import gulp from 'gulp';
import { apiDocsJson } from './compile-api-docs';


gulp.task('build:api-docs', () => {

    gulp.src('./api-docs/**/*.json')
        .pipe(apiDocsJson({ template: './api-docs/template.html' }))
        .pipe(gulp.dest('./build/api-docs'));

});


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
//  SORRY, this will NOT work unless jsdoc supports ES2015!!
//  ( waiting for jsdoc-3.4.0+ to release )
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//gulp.task('build:jsdocs', () => {

    //gutil.log(gutil.colors.red.bold("I'm sorry, but the api-docs task will fail!"));
    //gutil.log(gutil.colors.red.bold(".. need to wait until jsdoc@3.4.0 is released!"));

    //gulp.src("./src/**/*.js")
        //.pipe(jsdoc('./doc/api-docs/'));

//});

