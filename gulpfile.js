var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    Server = require('karma').Server;

var PROJ_ROOT = '',
    BOWER_COMP_ROOT = PROJ_ROOT + 'bower_components',
    SCRIPTS_ROOT = PROJ_ROOT,
    TESTS_ROOT = PROJ_ROOT + 'test/spec',
    DIST_ROOT = PROJ_ROOT + 'dist';

var libs = [
        BOWER_COMP_ROOT + '/angular/angular.js',
        BOWER_COMP_ROOT + '/angular-mocks/angular-mocks.js'
    ],
    tests = [
        TESTS_ROOT + '/**/*.js'
    ],
    scripts = [
        SCRIPTS_ROOT + 'svg-render.js'
    ];

/**
 * Run test once and exit
 */
gulp.task('test', ['libs'], function (done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

// Lint Task
gulp.task('lint', function () {
    gulp.src(scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS - LIBRARIES
gulp.task('libs', function () {
    return gulp.src(libs)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(DIST_ROOT));
});


// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(scripts, ['lint', 'test']);
    gulp.watch(tests, ['lint', 'test']);
});

// Default Task
gulp.task('default', ['lint', 'libs', 'test']);