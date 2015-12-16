const gulp = require('gulp');
const bundleTasks = require('./gulp/bundle');
//const htmlTask = require('./gulp/html');
const serveTask = require('./gulp/serve');
const packageJson = require('./package.json');
const del = require('del');
require('./gulp/api-docs');

const srcDir = 'src';
const bundleJs = 'picimo.js';
//const indexHtml = 'index.html';
const standalone = 'Picimo';
const buildDir = 'build';
const servePort = 1904;

bundleTasks('bundle', srcDir, bundleJs, buildDir, standalone, packageJson.babel);
//htmlTask('html', srcDir + '/' + indexHtml, buildDir, Object.assign({ bundleJs: bundleJs, bundleCss: bundleCss, standalone: standalone }, packageJson));
serveTask('serve', servePort, buildDir);

gulp.task('clean', () => del(['build/**/*']));

gulp.task('favicon', () => {
    gulp.src('src/favicon.ico', { base: 'src' }).pipe(gulp.dest('build'));
});

//gulp.task('build', ['html', 'favicon', 'bundle']);
gulp.task('build', ['bundle']);
//gulp.task('release', ['clean', 'html', 'favicon', 'bundle:release']);
gulp.task('release', ['clean', 'bundle:release']);

//gulp.task('default', ['html', 'favicon', 'bundle:watch']);
gulp.task('default', ['bundle:watch']);
