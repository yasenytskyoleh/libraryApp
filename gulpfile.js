var gulp          = require('gulp'),
    pug           = require('gulp-pug2'),
    stylus        = require('gulp-stylus'),
    autoprefixer  = require('gulp-autoprefixer'),
    util         = require('gulp-util'),
    browserSync   = require('browser-sync').create(),
    concat        = require('gulp-concat'),
    concatCss     = require('gulp-concat-css'),
    imagemin      = require('gulp-imagemin'),
    tinypng       = require('gulp-tinypng'),
    cache         = require('gulp-cache'),
    del           = require('del'),
    runSequence   = require('run-sequence');

gulp.task('pug', function(){
    return gulp.src('app/pug/**/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('views', function () {
    return gulp.src('app/views-pug/**/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('app/views/'))
        .pipe(browserSync.reload({
                stream: true
            }))
})

gulp.task('stylus', function () {
    return gulp.src('app/stylus/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('app/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('autoprefixer', function() {
    gulp.src('app/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css/'))
});

gulp.task('watch', ['browserSync', 'pug', 'stylus', 'autoprefixer', 'views'],function(){
    gulp.watch('app/pug/**/*.pug', ['pug'])
    gulp.watch('app/pug-fragments/**/*.pug', ['pug'])
    gulp.watch('app/views-pug/**/*.pug', ['views'])
    gulp.watch('app/stylus/**/*.styl', ['stylus'])
    gulp.watch('app/stylus-mixins/**/*.styl', ['stylus'])
    gulp.watch('app/css/**/*.css', ['autoprefixer'])
    gulp.watch('app/*.html', browserSync.reload)
    gulp.watch('app/css/**/*.css', browserSync.reload)
    gulp.watch('app/js/**/*.js', browserSync.reload)
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('concatJs', function() {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('concatCss', function () {
    return gulp.src('app/css/**/*.css')
        .pipe(concatCss("custom.css"))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('tinypng', function () {
    gulp.src('app/images/**/*.+(png|jpg|jpeg)')
        .pipe(tinypng('ZkCNUIo7GbfxernYmHUcsOjIPK6O31Fo'))
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'))
});

gulp.task('css', function() {
    return gulp.src('app/css/*.css')
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('js', function() {
    return gulp.src('app/js/*.js')
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('vendors', function() {
    return gulp.src('app/vendors/**/*')
        .pipe(gulp.dest('dist/vendors/'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist/*');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['html', 'css', 'js', 'vendors', 'fonts', 'images'],
        callback
    )
});

gulp.task('dev', function (callback) {
    runSequence(['pug','stylus','browserSync', 'watch'],
        callback
    )
});

