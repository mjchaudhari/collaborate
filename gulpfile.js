//1. create folder structure
// concatinate all js files
var gulp = require("gulp");
del = require("del");
uglify = require('gulp-uglify');
concat = require('gulp-concat');
replace = require('gulp-html-replace');

var dest = "./dist/client/"

var clientAssetsStyles =[
    "/www/fonts/**.*",
    "/www/images/**.*",
]

var clientStyles =[
    './www/vendor/angular-material/angular-material.min.css'
    , './www/styles/robotodraft.css'
    , './www/fonts/icon.css'
    , './www/vendor/ez-utils/ez-directives/eztree.css'
    , './www/vendor/ng-img-crop/compile/minified/ng-img-crop.css'
    , './www/vendor/angular-busy/dist/angular-busy.min.css'
    , './www/vendor/angular-material-data-table/dist/md-data-table.css'
    , './www/vendor/angular-material-sidenav/angular-material-sidenav.css'
    , "./www/vendor/ez-utils/ez-directives/expando.css",
    , "./www/styles/style.css",
]
var clientJsFiles =[
    "./www/app.js",
    "./www/httpInterceptor.js",
    "./wwm/index.controller.js",
    "./wwm/utils.js",
    "./www/services/**/*.js",
    "./www/modules/**/*.js",
]
var vendorJsFiles =[
    , "./www/vendor/angular/angular.min.js"
    , "./www/vendor/angular-animate/angular-animate.min.js"
    , "./www/vendor/angular-aria/angular-aria.min.js"
    , "./www/vendor/angular-sanitize/angular-sanitize.min.js"
    , "./www/vendor/angular-material/angular-material.min.js"
    , "./www/vendor/angular-material-icons/angular-material-icons.js"
    , "./www/vendor/angular-cache/dist/angular-cache.min.js"  
    , "./www/vendor/angular-ui-router/release/angular-ui-router.min.js"
    , "./www/vendor/ng-file-upload/ng-file-upload.js"  
     
    , "./www/vendor/ng-img-crop-full-extended/compile/unminified/ng-img-crop.js"  
    , "./www/vendor/underscore/underscore-min.js"
    , "./www/vendor/moment/min/moment.min.js"
    , "./www/vendor/angular-moment/angular-moment.min.js"
    , "./www/vendor/angular-cookies/angular-cookies.min.js"
    , "./www/vendor/ngStorage/ngStorage.min.js"
    , "./www/vendor/angular-ellipsis/src/angular-ellipsis.min.js"
    , "./www/vendor/angular-busy/dist/angular-busy.js"
    , "./www/vendor/angular-material-sidenav/angular-material-sidenav.js"
    , "./www/vendor/angular-material-data-table/dist/md-data-table.min.js"
]
/** clean up */
gulp.task('clean', function (cb) {
    del([
        dest
    ], cb);
});
/** concat */
gulp.task('copyMedia', function () {
   gulp.src(
            ["./www/fonts/**/*"
            , "./www/images/**/*"
            ],
            { "base" : "./www/" }
        )
      .pipe(gulp.dest(dest))
});
/** concat */
gulp.task('concatStyles', function () {
   gulp.src(clientStyles)
      .pipe(concat('styles.css'))
      .pipe(gulp.dest(dest + "styles/"))
});
/**
 * concat vendors js
 */
gulp.task('vendor', function () {
   gulp.src(vendorJsFiles)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(dest + "vendor/"))
});

/**
 * concat app js
 */
gulp.task('app', function () {
   gulp.src(clientJsFiles)
      .pipe(concat('app.js'))
      .pipe(gulp.dest(dest))
});
/**
 * concat vendors js
 */
gulp.task('replaceRefs', function () {
   gulp.src(  "./www/index.html")
      .pipe(replace(
          {
              'styles': '<link rel="stylesheet" href="' + dest + 'styles/styles.css">'
              , "app" : '<script src="'+ dest + 'app.js"></script>'
              , "vendor" : '<script src="'+ dest + 'vendor/vendor.js"></script>'
        }))
        .pipe(gulp.dest(dest));
      
});

gulp.task('default', ['clean', 'concatStyles', 'copyMedia', 'vendor', 'app', 'replaceRefs']);
//gulp.task('default', ['replaceRefs']);

