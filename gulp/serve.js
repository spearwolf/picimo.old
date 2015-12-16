'use strict';

const gulp = require('gulp');
const serve = require('gulp-serve');

module.exports = function (taskName, port, rootDir) {

    gulp.task(taskName, serve({
        port: port,
        root: (rootDir || '.'),
    }));

}

