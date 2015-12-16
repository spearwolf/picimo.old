'use strict';

import gulp from 'gulp';
import serve from 'gulp-serve';

gulp.task('serve', serve({
    port: 5000,
    root: '.',
}));
