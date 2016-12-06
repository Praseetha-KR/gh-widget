var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence'),
    del = require('del');

var paths = {
    src: 'src/',
    dev: '.dev/',
    dest: 'dest/',
    scss: 'src/**/*.scss',
    js: 'src/gh-widget.js'
};
var is_prod = false;

gulp.task('scss', () => {
    var dest = is_prod ? paths.dest : paths.dev;
    var bundle = gulp.src(paths.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dest))

    if (is_prod) {
        bundle = bundle
            .pipe(cssnano())
            .pipe(rename('gh-widget.min.css'))
            .pipe(gulp.dest(dest));
    }
    return bundle;
});

function compilejs(watch) {
    var bundler = watchify(browserify(paths.js, {}).transform(babelify));

    function rebundle() {
        var dest = is_prod ? paths.dest : paths.dev;
        bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('gh-widget.js'))
            .pipe(buffer())
            .pipe(gulp.dest(dest));
    }

    if (watch) {
        bundler.on('update', () => {
            console.log('bundling...')
            rebundle();
        });
    }
    rebundle();
}

gulp.task('clean', () => {
    del([paths.dev]);
    del([paths.dest]);
});

gulp.task('js', () => {
    compilejs(true);
});

gulp.task('watch', () => {
    gulp.watch(paths.scss, ['scss']);
    runSequence(
        'js'
    )
});

gulp.task('build', () => {
    is_prod = true;
    runSequence(
        'scss',
        'js'
    )
});

gulp.task('default', ['scss', 'watch']);
