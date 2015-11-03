require('./gulp/picimo-js');
require('./gulp/api-docs');

import gulp from 'gulp';

gulp.task('default', ['build:watch:picimo-js']);

