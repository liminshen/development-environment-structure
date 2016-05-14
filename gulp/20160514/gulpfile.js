var gulp = require('gulp'),
    // sass = require('gulp-ruby-sass'),
    clean = require('gulp-clean'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    notify = require('gulp-notify'),
    minifyHTML   = require('gulp-minify-html');

var browserSync = require('browser-sync').create();
var fixerBrowsers = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];
gulp.task('less',['cleanCss'],function() {
    return gulp.src('style/less/*.less')
    	.pipe(less())
        .pipe(autoprefixer({
	      browsers: fixerBrowsers,
	      cascade: true, //是否美化属性值 默认：true 像这样：
	      //-webkit-transform: rotate(45deg);
	      //        transform: rotate(45deg);
	      remove: true //是否去掉不必要的前缀 默认：true
	    }))
	    .pipe(gulp.dest('style/css'))
       
        .pipe(minifycss())
        .pipe(rev())
        .pipe(rename(function (path) {
            path.basename += '.min';
         }))
        .pipe(gulp.dest('dist/style/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/style'))
        .pipe(notify({ message: 'Styles task complete' }))
        .pipe(browserSync.stream());
});
gulp.task('miniJS',function () {
    return gulp.src(['js/app/*.js','!js/*.min.js'])
            .pipe(uglify({
                mangle:{except: ['require' ,'exports' ,'module' ,'$']},//排除混淆关键字
                compress: true,//类型：Boolean 默认：true 是否完全压缩
                preserveComments: 'all' //保留所有注释
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('js/app'))
            .pipe(notify({ message: 'Script task complete' }))
            .pipe(browserSync.stream());
})
gulp.task('server', ['less'], function() {
    browserSync.init({
        server: "./",
        port: 8080
    });
    gulp.watch("style/less/**/*.less", ['less']);
    gulp.watch("*.html").on('change', browserSync.reload);
});
gulp.task('cleanCss',function () {
    return gulp.src('dist/style/css/*.min.css')
        .pipe(clean());
});
gulp.task('build:css-md5-web',function () {
    return gulp.src(['./dist/style/*.json','./web/*.html'])
        .pipe( revCollector({
            replaceReved: true
        }))
        .pipe(minifyHTML())
        .pipe(gulp.dest('./dist/web'));
});
gulp.task('build:css-md5-wap',function () {
    return gulp.src(['./dist/style/*.json','./wap/*.html'])
        .pipe( revCollector({
            replaceReved: true
        }))
        .pipe(minifyHTML())
        .pipe(gulp.dest('./dist/wap'));
});
gulp.task('build:css-md5-index',function () {
    return gulp.src(['./dist/style/*.json','./*.html'])
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe(minifyHTML())
        .pipe(gulp.dest('./dist/'));
});
gulp.task('build',['build:css-md5-web','build:css-md5-wap','build:css-md5-index']);
