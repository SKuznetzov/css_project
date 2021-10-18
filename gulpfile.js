const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');
const cssFile = ['./src/css/main.less',
                 './src/css/media.css'];

const jsFile = ['./src/js/main.js',
                './src/js/lob.js'];
   
gulp.task('styles',()=>{
    return gulp.src(cssFile)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(autoprefixer ({
        overrideBrowsersList:['last 2 versions'],
        cascade: false
    }) )
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts',()=>{
    return gulp.src(jsFile)
    .pipe(concat('script.js'))
    .pipe(uglify({
        toplevel: true
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});
gulp.task('img-compress',()=>{
    return gulp.src('./src/img/**')
    .pipe(imagemin({
        progressiv: true
    }))
    .pipe(gulp.dest('./build/img'))
});

gulp.task('del',()=>{
    return del(['build/*'])
})

gulp.task('watch',()=>{
    browserSync.init({
        server: {baseDir: "./"}
    });
    gulp.watch('./src/css/**/*.less',gulp.series('styles'))
    // gulp.watch('./src/css/**/*.css',styles)
    gulp.watch('./src/js/**/*.js',gulp.series('scripts'))
    gulp.watch('./src/img/**',gulp.series('img-compress'))
    gulp.watch("./*.html").on('change',browserSync.reload);
});


gulp.task('default',gulp.series('del',gulp.parallel('styles','scripts','img-compress'),'watch'));