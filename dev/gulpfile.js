const gulp = require('gulp');
const del = require('del');
const replace = require('gulp-replace');

gulp.task('clean', function () {
    console.log('clean start...')
    let cleanDir = ['./dist/**'];
    console.log('cleanDir=', cleanDir);
    return del(cleanDir, {force: true});
});

gulp.task('css', function () {
    return gulp.src('public/**/css/*.css')
        .pipe(replace(/url\(\"\/.*\/img\//g, 'url("../img/'))
        .pipe(gulp.dest('./dist'));
})

gulp.task('js', function () {
    return gulp.src('public/**/js/*.js')
        .pipe(replace(/src=\"\/.*\/img\//g, 'src="./img/'))
        .pipe(gulp.dest('./dist'));
})

gulp.task('copyImg', function () {
    return gulp.src('public/**/img/**')
        .pipe(gulp.dest('./dist'));
});

gulp.task('copyHtml', function () {
    return gulp.src('public/**/*.html')
        .pipe(replace(/href=\"\/.*\/css\//g, 'href="./css/'))
        .pipe(replace(/src=\"\/.*\/js\//g, 'src="./js/'))
        .pipe(replace(/src=\"\/.*\/img\//g, 'src="./img/'))
        .pipe(gulp.dest('./dist'));
})

// gulp.task('copyWap', function () {
//     return gulp.src('public/wap/**').pipe(gulp.dest('./dist/wap'));
// })

//gulp.series 串行
//gulp.parallel 并行
// gulp.task('default', gulp.series('clean', gulp.parallel('css', 'js', 'copyImg', 'copyHtml')));


const RevAll = require("gulp-rev-all");
const through = require('through2');
const util = require('util');
const crypto = require('crypto');

gulp.task('test', function (cb) {
   
    console.log(__dirname);
    console.log(__filename);

    // cb();
    return gulp.src('public/findPwd/css/setPwd.css')
        // .pipe(RevAll.revision())
        // .pipe(()=>{
        //     return 'aaa';
        // })
        .pipe(through.obj((file, encoding, callback) => {
            console.log('file.path=', file.path);
            console.log('file.base=', file.base);
            console.log('file.contents=', file.contents);
            console.log('file.relative=', file.relative);
            console.log('file.stem=', file.stem);
            console.log('file.extname=', file.extname);
            console.log('file.symlink=', file.symlink);
            console.log('file.cwd=', file.cwd);
            // console.log('file=', util.inspect(file.__proto__, { compact:true, breakLength:1000, showHidden: true }));
            // for (const key in file.__proto__) {
            //     // if (Object.hasOwnProperty.call(file, key)) {
            //         const element = file[key];
            //         console.log('key:', key);
            //         console.log('element:', element);
            //     // }
            // }
            let contents = file.contents.toString();
            let md5 = crypto.createHash('md5').update(contents).digest('hex')//.slice(0, 5);
            console.log('md5=', md5);
            contents = contents.replace(/(url\(.*?\.(png|gif|jpg))(.*?\))/ig, '$1?' + md5 + '$2')
            console.log(contents);

            file.contents = new Buffer(contents)
            callback(null, file);
        },function (callback) {
            callback()
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('default', gulp.series('clean', gulp.parallel('test')));



