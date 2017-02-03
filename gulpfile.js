"use strict";

let gulp = require('gulp');
let connect = require('gulp-connect'); //runs local dev server
let open = require('gulp-open'); // Open a URL in a web browser
let webpack = require('webpack-stream');
let concat = require('gulp-concat'); // concatenates files
let babel = require('gulp-babel');
let shell = require('gulp-shell');
var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/client/**/*.html',
        js: './src/client/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            './src/client/css/style.css'
        ],
        dist: './dist',
        temp: './dist/temp',
        mainJs: './dist/temp/app.js'
    }
};

//Start a local development server
gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

//open after connect
gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

//put all html file to dist and reload
gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('translate', () => {
    return gulp.src([config.paths.js])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(config.paths.temp));
});

gulp.task('js', ['translate'], function () {
    gulp.src(config.paths.mainJs)
        .pipe(webpack({
            devtool: 'source-map',
            output: {
                filename: 'bundle.js'
            }
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest(config.paths.dist + '/scripts')) // bundle path
        .pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});



gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);

});
// gulp.task('start-server', function () {
//     return gulp.src('src/server/app.js')
//     .pipe(shell('npm run start'));
// });

gulp.task('start-client', ['html', 'js', 'css', 'open', 'watch']);
gulp.task('default', ['start-client']);