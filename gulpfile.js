const { src, dest, task, series, parallel, watch, lastRun } = require('gulp');

const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');

const connect = require('gulp-connect');
const fileinclude = require('gulp-file-include');
const proxy = require('http-proxy-middleware');//反向代理
const del = require('del');

// NODE_ENV
var env = process.env.NODE_ENV || 'development';
var condition = env === 'production';

const staticpath = "./1019/";

task('css', function (cb) {
    src(staticpath+'sass/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(condition, cleanCSS()))
    .pipe(dest('dist/css'))
    .pipe(connect.reload());
    cb();
});

task('html', function (cb) {
    src(staticpath+'*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
     }))
    .pipe(plumber())
    .pipe(gulpif(condition, htmlmin()))
    .pipe(dest('dist/'))
    .pipe(connect.reload());
    cb();
});

task('js', function (cb) {
    src(staticpath+'js/*.js')
    .pipe(plumber())
    .pipe(concat({ path: 'business.js', stat: { mode: 0666 }}))
    .pipe(gulpif(condition, uglify()))
    .pipe(dest('dist/js'))
    .pipe(connect.reload());
    cb();
});

task('view', function (cb) {
  src(staticpath+'html/*.html')
  .pipe(dest('dist/html'))
  .pipe(connect.reload());
  cb();
})

task('config', function (cb) {
  src(staticpath+'config/*')
  .pipe(dest('dist/config'));
  cb();
})

task('lib', function (cb) {
  src(staticpath+'lib/*')
  .pipe(dest('dist/lib'));
  cb();
})

task('image', function (cb) {
    src(staticpath+'imgs/*')
    .pipe(plumber())
    .pipe(gulpif(condition, imagemin()))
    .pipe(dest('dist/imgs'));
    cb();
});


task('watch', function(cb){//监控

  let watcher = watch(
    ['js/*.js','lib/*.js','/sass/*.scss','/html/*.html','/*.html'],
    {events:['change','add','unlink'],cwd:staticpath},//cwd : change working directory
    parallel('css','js','lib','view','html')
  );

  watcher.on('change', function(path, stats) {
    console.log(`
      ------------------------
      File ${path} was changed
      ------------------------
      `);
  });

  watcher.on('add', function(path, stats) {
    console.log(`
      ----------------------
      File ${path} was added
      ----------------------
      `);
  });

  watcher.on('unlink', function(path, stats) {
    console.log(`
      ------------------------
      File ${path} was removed
      ------------------------
      `);
  });

  //watcher.close();
  cb();
});



task('clean', (cb) => {

  (async () => {
  	const deletedPaths = await del(['dist/*/'], {dryRun: true});

  	console.log(`
      -----------------------
      ${ deletedPaths }
      ------------------------`
    );

    cb();
  })();

});


//生成环境
task('build', series('clean', parallel('config','lib','css','js','image','view','html'),function(cb){
  console.log(
    `-----------------------------
      build tasks are successful
    -----------------------------`);
    cb();
}));

//开发环境
task('server',series('clean','watch',parallel('config','lib','css','js','image','view','html'),function(){
    connect.server({
        root: 'dist',
        host:'192.168.1.77',
        port: 9000,
        name:'spa',
        livereload: true,
        fallback:"http://192.168.1.77:9000/index.html",
        middleware: function(connect, opt) {
            return [
                proxy('/api',  {
                    target: 'http://192.168.1.77:9000/',
                    changeOrigin:true,
                    headers: {
                         "Connection": "keep-alive"
                     },
                    //ws: true,
                    pathRewrite: {
                        '^/api' : ''
                    },
                    router: {
                      // 'integration.localhost:3000' : 'http://localhost:8001',  // host only
                      // 'staging.localhost:3000'     : 'http://localhost:8002',  // host only
                      // 'localhost:3000/api'         : 'http://localhost:8003',  // host + path
                      // '/rest'                      : 'http://localhost:8004'   // path only
                    }
                })
            ]
        }

    });
    console.log(`
        -----------------------------
          server tasks are successful
        -----------------------------`);
}));

task('default', () => {
  console.log(
   `
  Build Setup
    开发环境： npm run start
    生产环境： npm run build
    `
  )
})
