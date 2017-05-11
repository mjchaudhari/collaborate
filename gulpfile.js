//1. create folder structure
// concatinate all js files
var gulp = require("gulp");
var del = require("del");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var replace = require('gulp-html-replace');
var templateCache = require('gulp-angular-templatecache');

var dest = "./dist/"

var clientAssetsStyles =[
    "/www/fonts/**.*",
    "/www/images/**.*",
]

var clientStyles =[
    './www/vendor/bootstrap.superhero.min.css'
    , './www/vendor/ui-cropper/compile/minified/ui-cropper.css'
    , './www/vendor/angular-busy/dist/angular-busy.min.css'
    , './www/vendor/angularJS-Toaster/toaster.min.css'
    , "./www/vendor/ez-utils/dist/ez-directives.css",
    , "./styles/animations.css"
    , "./www/styles/style.css",
]
var clientJsFiles =[
    "./www/app.js",
    "./www/httpInterceptor.js",
    "./www/index.controller.js",
    "./wwm/utils.js",
    "./www/services/**/*.js",
    "./www/modules/**/*.js",
]
var vendorJsFiles =[
    , "./www/vendor/angular/angular.min.js"
    , "./www/vendor/angular-animate/angular-animate.min.js"
    , "./www/vendor/angular-aria/angular-aria.min.js"
    , "./www/vendor/angular-sanitize/angular-sanitize.min.js"
    , "./www//vendor/angular-bootstrap/ui-bootstrap-tpls.min.js"
    , "./www/vendor/angular-cache/dist/angular-cache.min.js"  
    , "./www/vendor/angular-ui-router/release/angular-ui-router.min.js"
    , "./www/vendor/ng-file-upload/ng-file-upload.js"  
    , "./www/vendor/angular-cache/dist/angular-cache.min.js"
    , "./www/vendor/angular-ui-router/release/angular-ui-router.min.js"
    , "./www/vendor/ng-file-upload/ng-file-upload.js"  
    , "./www/vendor/ui-cropper/compile/minified/ui-cropper.js"  
    , "./www/vendor/underscore/underscore-min.js"
    , "./www/vendor/moment/min/moment.min.js"
    , "./www/vendor/angular-moment/angular-moment.min.js"
    , "./www/vendor/ngStorage/ngStorage.min.js"
    , "./www/vendor/angular-ellipsis/src/angular-ellipsis.min.js"
    , "./www/vendor/angular-busy/dist/angular-busy.js"
    , "./www/vendor/angularJS-Toaster/toaster.min.js"
    , "./www/vendor/ez-utils/dist/ez-directives.js"
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
 * create template
 */
gulp.task('template', function () {
   gulp.src("./www/modules/**/*.html")
        .pipe(templateCache('templates.js', {module: 'app', root: '/modules'}))
        .pipe(gulp.dest(dest));
});

/**
 * concat vendors js
 */
gulp.task('replaceRefs', function () {
   gulp.src(  "./www/index.html")
      .pipe(replace(
          {
              'styles': '<link rel="stylesheet" href="./styles/styles.css">'
              , "vendor" : '<script src="./vendor/vendor.js"></script>'
              , "app" : '<script src="./app.js"></script>'
              , "templates" : '<script src="./templates.js"></script>'
        }))
        .pipe(gulp.dest(dest));
});

gulp.task('default', ['clean', 'concatStyles', 'copyMedia', 'vendor', 'template', 'app', 'replaceRefs']);
//gulp.task('default', ['replaceRefs']);

