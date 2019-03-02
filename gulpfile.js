var gulp        = require("gulp");
var path        = require('path');
var browserSync = require("browser-sync");
var reload      = browserSync.reload;
var harp        = require("harp");
var sass        = require("gulp-sass");
var sourcemaps  = require("gulp-sourcemaps");
var sassdoc     = require("sassdoc");
var autoprefixer = require("gulp-autoprefixer");
var spritesmith = require("gulp.spritesmith");
var buffer      = require("vinyl-buffer");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var merge       = require("merge-stream");
var prettier = require('gulp-prettier');

var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

var imageminGuetzli = require('imagemin-guetzli');
var imageminPngquant = require('imagemin-pngquant');

// Variables:

var buildFolder = "./build";
var outputFolder = "./public";

var compilePath = "./static";

var cssInput = buildFolder + "/sass/*.scss";
var cssOutput = outputFolder + "/css";

var imagesFolder = outputFolder + '/images/';
var spriteInput = buildFolder + "/sprites/*.png";
var spriteInput2x = buildFolder + "/sprites/*_2x.png";
var spriteOutput = imagesFolder;
var spriteCssOutput = buildFolder + "/sass/";

var webpackOptions = {
  devtool: "source-map",
  output: {
    filename: 'bundle.min.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
      }),
    new UnminifiedWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

var javascriptInput = buildFolder + "/js/index.js";
var javascriptOutput = outputFolder + "/js/";

var sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};

var autoprefixerOptions = {
  browsers: ["last 2 versions", "> 5%", "Firefox ESR"]
};

// Tasks:

gulp.task("sass", function () {
  return gulp
    .src(cssInput)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(csso())
    .pipe(gulp.dest(cssOutput))
    .resume();

  //reload(cssOutput + "/screen.css", {stream: true});
});

gulp.task('sassdoc', function () {
  return gulp
    .src(cssInput)
    .pipe(sassdoc());
});


gulp.task("webpack", function() {
  return gulp.src(javascriptInput)
    .pipe(gulpWebpack(webpackOptions, webpack))
    .pipe(gulp.dest(javascriptOutput));
});

gulp.task("sprite", function () {
  // Generate our spritesheet
  var spriteData = gulp.src(spriteInput).pipe(spritesmith({
    // Filter out `_2x` (retina) images to separate spritesheet
        retinaSrcFilter: spriteInput2x,
        retinaImgName: '../images/spritesheet-2x.png',
        imgName: "../images/spritesheet.png",
        cssName: "_spritesheet.scss",
        padding: 6
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    //.pipe(imagemin())
    .pipe(imagemin([imageminPngquant( { quality: 90 } )]))
    .pipe(gulp.dest(spriteOutput));

  // Pipe CSS stream onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest(spriteCssOutput));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

/**
 * Serve the Harp Site from the src directory
 */
gulp.task("serve", function () {
  harp.server(__dirname, {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ["opacity: 0", "position: absolute"]
      }
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch([cssOutput + "/**/*.css", cssOutput + "/**/*.scss"], function (obj) {
      reload( obj.path , {stream: true});
    });

    gulp.watch([javascriptOutput + "bundle.js"], function () {
      reload(javascriptOutput + "bundle.js", {stream: true});
    });


    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch([outputFolder + "/**/*.html", outputFolder + "/**/*.ejs", outputFolder + "/**/*.jade", outputFolder + "/**/*.js", outputFolder + "/**/*.json", outputFolder + "/**/*.md"], function () {
      reload();
    });

    gulp.watch(cssInput, [ "sass", "sassdoc" ])
       .on("change", function(event) {
        console.log("File " + event.path + " was " + event.type);
      });

    gulp.watch(spriteInput, [ "sprite", "sass" ])
       .on("change", function(event) {
        console.log("File " + event.path + " was " + event.type);
      });



    gulp.watch(buildFolder + "/js/**/*.js", [ "webpack" ])
       .on("change", function(event) {
        console.log("File " + event.path + " was " + event.type);
      });
   



  })
});

gulp.task('prettier', () => {
  gulp.src(buildFolder + "/js/**/*.js")
    .pipe(prettier({useFlowParser: true, useTabs: true }))
    .pipe(gulp.dest(buildFolder + "/js/"))
  });

gulp.task("compile", () => {
  harp.compile("./", compilePath, function() {
    console.log("Compiled to " + compilePath + ".");
  });
});

// Image optimization
// Put images in build/images and they will be optimized and copied to /public/images

gulp.task('optimize-jpg', () => {
  console.log("Optimizing...");
    return gulp.src(buildFolder + '/images/**/*.jpg')
        .pipe(imagemin([imageminGuetzli( { quality: 84 } )]))
        .pipe(gulp.dest(imagesFolder));
});

gulp.task('optimize-png', () => {
  console.log("Optimizing...");
    return gulp.src(buildFolder + '/images/**/*.png')
        .pipe(imagemin([imageminPngquant( { quality: 50 } )]))
        .pipe(gulp.dest(imagesFolder));
});

gulp.task("optimize", ["optimize-png", "optimize-jpg"] );

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */

gulp.task("build", [ "sprite",  "sass", "webpack" ])
gulp.task("default", [ "build", "serve"]);
