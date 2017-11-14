var gulp = require('gulp'),connect = require('gulp-connect');

gulp.task('watch',function(){
    gulp.watch('./*.html',['html']);
});

gulp.task('connect',function(){
    connect.server({
        root:'./',
        port: 8080,  // Default: 8080
        livereload:false
    })
});

gulp.task('html', function(){
  gulp.src('*.html')
      .pipe(connect.reload());
});

gulp.task('default',['connect','watch','html']);
