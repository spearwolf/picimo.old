import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import watchify from 'watchify';


gulp.task('build-picimo-js', () => bundle(build()));

gulp.task('build-n-watch-picimo-js', () => {

    let b = build();
    b.on('update', bundle.bind(global, b));
    bundle(b);

});


function build () {

    var b = watchify(browserify({
        entries: './src/index.js',
        debug: true,
        bundleExternal: true,
        standalone: 'Picimo',
    }))

    b.transform(babelify.configure({
        sourceMapRelative: '.',
        optional: [
            "es7.asyncFunctions",
            "es7.classProperties",
            "es7.decorators",
            "runtime"
        ]
    }));

    b.on('log', gutil.log.bind(gutil, '[picimo.js]'));

    return b;

}

function bundle ( b ) {

    return b.bundle()
        //.on('error', gutil.log.bind(gutil, 'Browserify error'))
        .pipe(source('picimo.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/'))
        ;

}
