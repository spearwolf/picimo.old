import gulp from 'gulp';
import sass from 'gulp-sass';
import minifyHtml from 'gulp-minify-html';
import { apiDocsJson } from './api-docs-json';


gulp.task('api-docs', () => {

    gulp.src(['./api-docs/**/*.json', './api-docs/**/*.md'])
        .pipe(apiDocsJson({
            template: './api-docs/index.html',
            partials: './api-docs/partials',
            contentJson: 'contents.json',
        }))
        .pipe(minifyHtml({
            conditionals: true,
            spare: true,
            quotes: true,
            loose: true
        }))
        .pipe(gulp.dest('./build/api-docs'));

    gulp.src('./api-docs/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/api-docs'));

});

gulp.task('api-docs:watch', () => {

    gulp.watch('./api-docs/**/*', ['api-docs']);

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

