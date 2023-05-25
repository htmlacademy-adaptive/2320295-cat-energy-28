import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import { deleteAsync } from 'del';
import svgo from 'gulp-svgmin';
import { stacksvg } from 'gulp-stacksvg';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Clean

const clean = () => {
  return deleteAsync('build');
};

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/favicon.ico',
    'source/manifest.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// SVG

const svg = () =>
  gulp.src([
    'source/img/**/*.svg',
    '!source/img/icons/*.svg'
  ])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

const makeStack = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(stacksvg({
      output: 'sprite'
    }))
    .pipe(gulp.dest('build/img'));
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'));
}

// Webp

const createWebp = () => {
  return gulp.src([
    'source/img/content/*.{jpg,png}'
  ])
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img/content'));
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    // browser: ['Firefox', 'Chrome']
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html').on(html, browser.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    makeStack,
    createWebp
  ));

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    makeStack,
    createWebp
  ),
  gulp.series(
    server, watcher
  ));
