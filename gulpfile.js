/* reference
https://dotblogs.com.tw/dog0416/2016/07/12/173353
*/

var gulp = require('gulp');
//1. gulp hello_world
gulp.task('hello_world', function () {
    console.log("hellow world first");
});

var cssminify = require('gulp-minify-css');

//2.最小css化工作 
gulp.task("css", ['sass'], function () {
    var stream = gulp.src("css/*.css");//資料來源
    stream
        .pipe(cssminify())//最小css化工作
        .pipe(gulp.dest('build/css'));//輸出位置
    return stream;
})

//3.hello world 前先叫用 其他工作
gulp.task('hello_world_before_css', ['hello_world', 'css'], function () {
    console.log("hellow world second");
});

//4.最小化 JavaScript require: npm install --save-dev gulp-uglify

var gulpUglify = require('gulp-uglify');
gulp.task('script', function () {
    gulp.src('script/*.js')
        .pipe(gulpUglify())
        .pipe(gulp.dest('build/js'));
})

//5.指定所有檔案異動就做 gulp 工作
gulp.task('watch', function () {
    gulp.watch('script/*.js', ['script']);
    gulp.watch('css/*.scss', ['css']);
})


// npm install gulp-sass --save-dev
var gulpSass = require('gulp-sass');
gulp.task('sass', function () {
    gulp.src('css/*.scss')
    .pipe(gulpSass())
    .pipe(gulp.dest('css'));

})

//99.指定使用預設工作去執行監看工作，並預先執行指定工作
gulp.task('default', ['watch']);

