var gulp = require('gulp');

var fs = require('fs'),
    fileContent = fs.readFileSync('./package.json'),
    jsonObj = JSON.parse(fileContent);

var mainBowerFiles = require('main-bower-files');
 

//基础变量
var paths = {
  name : jsonObj.name,
  version : jsonObj.version
}

gulp.task("bower", function(){
  return gulp.src("./bower_components/*/dist/**/*")
    .pipe(gulp.dest('./lib/'));
});

//默认任务
gulp.task('default',['bower']);
