'use strict';


var autoprefixerList = [
    'Chrome >= 45',
    'Firefox ESR',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 9',
    'Safari >= 9',
    'Android >= 4.4',
    'Opera >= 30'
];


var path = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/images/',
        fonts: 'dist/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/scss/app.scss',
        img: 'src/sourceimages/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/scss/**/*.scss',
        img: 'src/sourceimages/**/*.*',
        fonts: 'srs/fonts/**/*.*'
    },
    clean: './dist'
};


var config = {
    server: {
        baseDir: './dist',
        index: "index.html",
        directory: true
    },
    notify: true
};


var nodePath = require('path'),
    fs = require('fs'),
    Transform = require('stream').Transform,
    rimraf = require('rimraf').rimraf;

var gulp = require('gulp'),
    webserver = require('browser-sync'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass')(require('sass')),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    sharp = require('sharp'),
    rename = require('gulp-rename');


var riggerDirective = /^([ \t]*)\/\/=\s*(.+?)\s*$/gm;

function riggerExpand(content, baseDir) {
    return content.replace(riggerDirective, function (match, indent, relPath) {
        var filePath = nodePath.join(baseDir, relPath);
        var included = fs.readFileSync(filePath, 'utf8');
        return riggerExpand(included, nodePath.dirname(filePath));
    });
}

function rigger() {
    return new Transform({
        objectMode: true,
        transform: function (file, enc, cb) {
            if (file.isNull() || file.isDirectory()) return cb(null, file);
            file.contents = Buffer.from(riggerExpand(file.contents.toString(), nodePath.dirname(file.path)));
            cb(null, file);
        }
    });
}


function imageOptimize() {
    return new Transform({
        objectMode: true,
        transform: function (file, enc, cb) {
            if (file.isNull() || file.isDirectory()) return cb(null, file);

            var ext = nodePath.extname(file.path).toLowerCase();
            var image = sharp(file.contents);

            if (ext === '.jpg' || ext === '.jpeg') {
                image = image.jpeg({ quality: 85, progressive: true });
            } else if (ext === '.png') {
                image = image.png({ quality: 85, compressionLevel: 9 });
            } else {
                return cb(null, file);
            }

            image.toBuffer()
                .then(function (buffer) {
                    file.contents = buffer;
                    cb(null, file);
                })
                .catch(function (err) {
                    cb(null, file);
                });
        }
    });
}




gulp.task('webserver', function () {
    webserver(config);
});


gulp.task('html:build', function () {
    return gulp.src(path.src.html) 
        .pipe(plumber()) 
        .pipe(rigger()) 
        .pipe(gulp.dest(path.build.html)) 
        .pipe(webserver.reload({ stream: true })); 
});


gulp.task('css:build', function () {
    return gulp.src(path.src.style) 
        .pipe(plumber()) 
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                overrideBrowserslist: autoprefixerList,
                cascade: false
            })
        ]))
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) 
        .pipe(sourcemaps.write('./')) 
        .pipe(gulp.dest(path.build.css)) 
        .pipe(webserver.reload({ stream: true })); 
});

gulp.task('css:dist', function () {
    return gulp.src(path.src.style) 
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                overrideBrowserslist: autoprefixerList,
                cascade: false
            })
        ]))
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) 
        .pipe(gulp.dest(path.build.css)) 
});


gulp.task('js:build', function () {
    return gulp.src(path.src.js) 
        .pipe(plumber()) 
        .pipe(rigger()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init()) 
        .pipe(uglify()) 
        .pipe(sourcemaps.write('./')) 
        .pipe(gulp.dest(path.build.js)) 
        .pipe(webserver.reload({ stream: true })); 
});

gulp.task('js:dist',  function () {
    return gulp.src(path.src.js) 
        .pipe(plumber()) 
        .pipe(rigger()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify()) 
        .pipe(gulp.dest(path.build.js)) 
});


gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});


gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(imageOptimize())
        .pipe(gulp.dest(path.build.img));
});


gulp.task('clean:build', function () {
    return rimraf(path.clean);
});


gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'image:build'
        )
    )
);

gulp.task('dist',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:dist',
            'js:dist',
            'fonts:build',
            'image:build'
        )
    )
);


gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});


gulp.task('default', gulp.series(
    'build',
    gulp.parallel('webserver','watch')      
));
