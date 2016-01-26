require("babel-register");

const gulp = require('gulp');
const gutil = require('gulp-util');
const bundleTasks = require('./gulp/bundle');
const serveTask = require('./gulp/serve');
const packageJson = require('./package.json');
const del = require('del');
const runSequence = require('run-sequence');
require('./gulp/api-docs');

const srcDir = 'src';
const bundleJs = 'picimo.js';
const standalone = 'Picimo';
const buildDir = 'build';
const servePort = 1904;

gulp.task('clean', () => del(['build/**/*']));

serveTask('serve', servePort, '.'); //buildDir);
bundleTasks('bundle', srcDir, bundleJs, buildDir, standalone, packageJson.babel);

function ready () {
    console.log(gutil.colors.green.bold('Thank you and have a nice day.'));
    process.exit();
}

gulp.task('build', () => { runSequence('bundle', ready); });
gulp.task('release', () => { runSequence('clean', ['bundle:release', 'api-docs'], ready) });

gulp.task('default', ['bundle:watch']);
