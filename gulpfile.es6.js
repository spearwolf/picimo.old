require('./gulp/picimo-js');
require('./gulp/api-docs');
require('./gulp/serve');

import gulp from 'gulp';

gulp.task('default', ['build:watch:picimo-js']);

