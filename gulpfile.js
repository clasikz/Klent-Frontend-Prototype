const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');
const fs = require('fs');
const path = require('path');

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}

gulp.task('cleanData', function (done) {
    console.log('Cleaning data folder...');
    deleteFolderRecursive('dist/data');
    done();
});

gulp.task('styles', function () {
    return gulp.src(['src/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(concat('pre-optimized.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(concat('pre-optimized.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

gulp.task('data', function () {
    console.log('Copying data files...');
    return gulp.src('src/data/**/*')
        .pipe(gulp.dest('dist/data'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('htmlForComponents', function () {
    return gulp.src('src/html/**/*')
        .pipe(gulp.dest('dist/html'))
        .pipe(connect.reload());
});

gulp.task('handlebars', function () {
    return gulp.src('src/**/*.hbs')
        .pipe(gulp.dest('dist/handlebars'))
        .pipe(connect.reload());
});

gulp.task('server', function () {
    connect.server({
        root: 'dist',
        port: 3000,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', gulp.series('scripts'));
    gulp.watch('src/**/*.scss', gulp.series('styles'));
    gulp.watch('src/html/**/*', gulp.series('htmlForComponents'));
    gulp.watch('index.html', gulp.series('html'));
    gulp.watch('src/data/**/*', gulp.series('cleanData', 'data'));
    gulp.watch('src/**/*.hbs', gulp.series('handlebars'));
});

gulp.task('default', gulp.series(
    gulp.parallel('cleanData', 'styles', 'scripts', 'data', 'html', 'htmlForComponents', 'handlebars'),
    gulp.parallel('server', 'watch')
));
