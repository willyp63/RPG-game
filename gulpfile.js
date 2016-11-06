let gulp = require('gulp')
let source = require('vinyl-source-stream');
let browserify = require('browserify');
let typescript = require('gulp-typescript');

let tsProject = typescript.createProject('tsconfig.json');


gulp.task('build_typescript', () => {
    let tsResult = tsProject.src('./src/**/*.ts').pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('build'));
});

gulp.task('browser_friendly', ['build_typescript'], () => {
    return browserify('./build/index.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public'))
}) 

gulp.task('default', () => {
    gulp.watch('./src/**/*.ts', ['browser_friendly']);
});