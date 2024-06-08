const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');

// Task to compile CSS files
gulp.task('styles', function () {
    return gulp.src(['src/**/*.css', 'dist/css/main.css'])
        .pipe(concat('pre-optimized.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

// Task to compile JS files
gulp.task('scripts', function () {
    return gulp.src(['src/**/*.js', 'dist/js/main.js'])
        .pipe(concat('pre-optimized.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

// Task to copy HTML files
gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

// Task to start a server
gulp.task('server', function () {
    connect.server({
        root: 'dist',
        port: 3000
    });
});

// Watch task to automatically compile files when they change
gulp.task('watch', function () {
    gulp.watch('src/**/*.js', gulp.series('scripts'));
    gulp.watch('src/**/*.css', gulp.series('styles'));
    gulp.watch('index.html', gulp.series('html'));
});

// Default task to run scripts, styles, server, and watch tasks
gulp.task('default', gulp.series('scripts', 'styles', 'html', gulp.parallel('server', 'watch')));
