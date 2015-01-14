var gulp = require('gulp'),
    cached = require('gulp-cached'),
    concat = require('gulp-concat'),
    dateFormat = require('dateformat'),
    footer = require('gulp-footer'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    pkg = require('./package.json'),
    path = require('path'),
    remember = require('gulp-remember'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    bundleName = 'angular-iscroll.js',
    paths = {
        src: path.join('src', bundleName),
        dest: 'dist/'
    };

gulp.task('scripts', function () {
    var now = new Date();

    return gulp.src(paths.src)
        .pipe(cached('scripts'))            // Only pass through changed files.
        .pipe(jshint())
        .pipe(header('/**\n' +
        ' * @license <%= pkg.name %> v<%= pkg.version %>, <%= now %>\n' +
        ' * (c) <%= years %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
        ' * License: <%= pkg.license %>\n' +
        ' */\n' +
        ';(function () {\n', {
            now: dateFormat(now, "isoDateTime"),
            years: dateFormat(now, "yyyy"),
            pkg: pkg
        }))
        .pipe(footer('})();\n'))
        .pipe(remember('scripts'))          // Add back all files to the stream.
        .pipe(concat('angular-iscroll.js')) // Do things that require all files.
        .pipe(gulp.dest(paths.dest))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.dest));

});

gulp.task('watch', function () {
    var watcher = gulp.watch(paths.src, ['scripts']);

    watcher.on('change', function _srcChanged(event) {
        if (event.type === 'deleted') {
            delete cached.caches.scripts[event.path];
            remember.forget('scripts', event.path);
        }
    });
});

gulp.task('default', ['scripts']);