//require("babel-register");

const gulp = require('gulp');
const del = require('del');
require('./gulp/api-docs');

gulp.task('clean', () => del(['build/**/*']));

gulp.task('default', ['api-docs']);

gulp.task('help', () => {

    console.log("\nUsage: gulp <task>\n\n"+
        "  api-docs\tBuild api documentation -> build/api-docs/\n" +
        "  clean\t\tClean up build artifacts -> build/\n"
    );

});
