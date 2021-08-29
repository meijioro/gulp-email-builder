const { src, dest, watch, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const browserSync = require("browser-sync").create();
const inlineCss = require('gulp-inline-css');
const rename = require('gulp-rename');
const connect = require("gulp-connect-php");
const htmlmin = require('gulp-htmlmin');
const fs = require('fs');
const replace = require('gulp-replace');

const template = './index.html';

// COMPILE ALL CSS
function css() {
  return src("./scss/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(dest("./"))
    .pipe(browserSync.stream());
}
exports.css = css;


// BROWESER SYNC + WATCH
function myWatch() {
  connect.server({
    // a standalone PHP server that browsersync connects to via proxy
    port: 8000,
    keepalive: true,
  }, function (){
    browserSync.init({
      proxy: '127.0.0.1:8000'
    });
  });

  watch("./scss/**/*.scss", css);
  watch(template).on('change', browserSync.reload);
}
exports.watch = myWatch;


// REPLACE CLASSES TO INLINE FOR DESKTOP
function inlineCSS() {
  return src(template)
    // inject mobile css into head
    .pipe(replace(/<style>?([^<]+)<\/style>/gmi, function(){
      const mobileCSS = fs.readFileSync('mobile.css', 'utf8');
      return `<style>
        ${mobileCSS}
      </style>`;
    }))
    // delete mobile css link since we don't want to replace mobile class as inline
    .pipe(replace(/<link rel="stylesheet" href="mobile.css" \/>/gi, ''))
    // replace desktop classes as inline
    .pipe(inlineCss({
      removeStyleTags: false
    }))
    // minify html
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      minifyCSS: true
    }))
    // copy file and rename
    .pipe(rename('index.build.html'))
    // final destination
    .pipe(dest('.'));
}


// Final Build
const build = series(css, inlineCSS);
exports.build = build;
