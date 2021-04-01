// Gulp => npm install --save-dev gulp
const gulp = require('gulp');

// Sass compilation => npm install --save-dev gulp-sass
const sass = require('gulp-sass');

// Add auto prefix to css classes => npm install --save-dev gulp-autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// To combine files => npm install --save-dev gulp-concat
const concat = require('gulp-concat');

// Minify js files => npm install --save-dev gulp-uglify
const uglify = require('gulp-uglify');

// Minify css files if you dont user sass => npm install --save-dev gulp-minify-css
const minifycss  = require('gulp-minify-css');

// Rename file => npm install --save-dev gulp-rename
const rename = require('gulp-rename');

// Browser reload on every change => npm install --save-dev browser-sync
const browserSync = require('browser-sync').create();

// Base dir from the file gulpfile.js
const baseDir = '.';

// // ********** RELOAD PAGE TASK **********
gulp.task('my-server', () => {

    // Sync init
    browserSync.init({
        injectChanges: true,
        server: {
            baseDir: baseDir,
        },
        //notify: false,
        //reloadOnRestart: true,
        //open: false,
    });
    gulp.watch('./scss/**/*.scss', gulp.series(['sass']));
    gulp.watch('./js/**/*.js', gulp.series(['minify-js']));
    gulp.watch('./css/**/*.css', gulp.series(['minify-css']));

    // Files to watch into reload task
    gulp.watch(baseDir + '/js/*.js').on('change', browserSync.reload);
    gulp.watch(baseDir + '/css/*.css').on('change', browserSync.reload);
    gulp.watch(baseDir + '/dist/**/*.css').on('change', browserSync.reload);
    gulp.watch(baseDir + '/dist/**/*.js').on('change', browserSync.reload);
    gulp.watch(baseDir + '/*.html').on('change', browserSync.reload);
});

// ********** SASS TASK **********
gulp.task('sass', () => {
    return gulp.src('./scss/**/*.scss')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sass.sync({outputStyle: 'nested'}).on('error', sass.logError)) // compressed, nested, compact
        .pipe(gulp.dest('./css/'));
});

// ********** MINIFY JS TASK **********
gulp.task('minify-js', () => {
    return gulp.src('./js/*.js')
        .pipe(concat('all.js')) // Combine files into all.js
        .pipe(uglify()) // Minify JS
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js/'));
});

// ********** MINIFY CSS TASK **********
gulp.task('minify-css', () => {
    return gulp.src('./css/*.css')
        .pipe(concat('all.css')) // Combine files into all.css
        .pipe(minifycss()) // Minify CSS
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css/'));
});

// If you want to use custom execution, you should use my-tasks as task instead of default
// => gulp my-tasks

// If you want to use only gulp, you should use default as task instead of my-task
// => gulp

// ********** FINAL EXECUTION **********
// Execution command as
// gulp => default or
// my-tasks => gulp my-task
gulp.task('default', gulp.series(['sass', 'minify-js', 'minify-css', 'my-server']));