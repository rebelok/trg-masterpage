// generated on 2015-09-28 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';
import autoprefixer from 'autoprefixer';
import colorFunction from 'postcss-color-function';
import simpleVars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'cssnext';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const variables = require('./app/scripts/config/variables');

gulp.task('styles', () => {
  return gulp.src('app/styles/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.postcss([simpleVars({variables}),cssnext(),colorFunction(),nested(),autoprefixer({browsers: ['last 1 version']})]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('app/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    //.pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    //.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/img/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/img'));
});


gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/img/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('inject', function () {

  var injectStyles = gulp.src([
      // selects all css files from the .tmp dir
      paths.tmp + '/**/*.css'
    ], { read: false }
  );

  var injectScripts = gulp.src([
    // selects all js files from .tmp dir
    paths.tmp + '/**/*.js',
    // but ignores test files
    '!' + paths.src + '/**/*.test.js'
    // then uses the gulp-angular-filesort plugin
    // to order the file injection
  ]).pipe($.angularFilesort()
    .on('error', $.util.log));
  // tell wiredep where your bower_components are
  var wiredepOptions = {
    directory: 'bower_components'
  };

  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    // write the injections to the .tmp/index.html file
    .pipe(gulp.dest(paths.tmp));
  // so that src/index.html file isn't modified
  // with every commit by automatic injects

});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['html', 'images', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
