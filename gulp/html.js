'use strict';

const gulp = require('gulp');
const mustache = require('gulp-mustache');

module.exports = function (taskName, htmlSrc, buildDir, context) {

    gulp.task(taskName, () => {
        gulp.src(htmlSrc).pipe(mustache(context)).pipe(gulp.dest(buildDir));
    });

}
