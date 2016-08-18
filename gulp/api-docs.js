import gulp from 'gulp';
import sass from 'gulp-sass';
//import minifyHtml from 'gulp-minify-html';
import htmlmin from 'gulp-htmlmin';
import { apiDocsJson } from './api-docs-json';

const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const gutil = require('gulp-util');
const chalk = require('chalk');
const rename = require('gulp-rename');


gulp.task('api-docs:html', function () {

    return gulp.src(['./api-docs/**/*.json', './api-docs/**/*.yaml', './api-docs/**/*.md'])
        .pipe(apiDocsJson({
            template: './api-docs/index.html',
            partials: './api-docs/partials',
            contentJson: 'contents.json',
            assetDirs: {
                fs: {
                    '/assets/images/': './assets/images/'
                },
                web: {
                    './assets/images/': '/assets/images/'
                }
            }
        }))
        //.pipe(minifyHtml({
            //conditionals: true,
            //spare: true,
            //quotes: true,
            //loose: true
        //}))
        //.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./build/api-docs'));

});

gulp.task('api-docs:css', function () {

    return gulp.src('./api-docs/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/api-docs'));

});

gulp.task('api-docs:js', function () {

    let bundle = browserify('./api-docs/index.js').transform(babelify);

    return bundle.bundle()
        .on('error', map_error)
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(rename('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/api-docs'));

});

gulp.task('api-docs', ['api-docs:html', 'api-docs:css', 'api-docs:js']);

gulp.task('api-docs:watch', () => {

    gulp.watch('./api-docs/**/*', ['api-docs']);

});

function map_error (err) {
    if (err.fileName) {
        // regular error
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': '
            + 'Line '
            + chalk.magenta(err.lineNumber)
            + ' & '
            + 'Column '
            + chalk.magenta(err.columnNumber || err.column)
            + ': '
            + chalk.blue(err.description));
    } else {
        // browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }

    this.end();
}


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

