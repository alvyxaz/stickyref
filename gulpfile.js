var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var colors = require('colors');
var watchify = require('watchify');
var webserver = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');
var shim = require('browserify-shim');
var plumber = require('gulp-plumber');

global.isWatching = true;

gulp.task('default', ['styles', 'scripts', 'watch', 'server'] , function () {

});

gulp.task('server', function () {
    gulp.src('client')
        .pipe(plumber())
        .pipe(webserver({
            //livereload: true,
            port: 8081
        }));
});

gulp.task('server-close', function() {

});

gulp.task('scripts', function () {
    var bundler = browserify({
        cache: {}, packageCache: {}, fullPaths: true,
        entries: ['./client/app/app.js'],
        debug: true
    });

    var bundle = function () {
        var tempBundler = bundler
            .bundle()
            .pipe(plumber())
            .pipe(source('app.js'))
            .pipe(gulp.dest('client/js/'));

        return tempBundler;
    }

    if (global.isWatching) {
        watchify(bundler);
        bundler.on('update', bundle);
    }

    return bundle();
});

gulp.task('styles', function () {
    gulp.src('./client/sass/main.scss')
        .pipe(plumber())
        .pipe(sass({style: 'expanded'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./client/css/'));
});

gulp.task('watch', function () {
    gulp.watch('./client/sass/**/*.scss', ['styles'])
});