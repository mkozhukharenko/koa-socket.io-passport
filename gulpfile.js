var gulp = require('gulp'),
    node,
    nodemon = require('gulp-nodemon'),
    mocha  = require('gulp-mocha'),
    mongoose = require('./libs/mongoose');


/**
 * $ test
 */
gulp.task('test', function() {
  process.env.NODE_ENV === 'test';

  return gulp
    .src('index.js')
    .pipe(mocha({
      end: {'NODE_ENV': 'test'}
    }));
});

/**
 * $ gulp server
 */
gulp.task('nodemon', function() {
  nodemon({
    script: 'index.js',
    ext: 'js css jade',
    ignore: ['node_modules/*'],
    nodeArgs: ['--debug'],
    env: {
      'NODE_ENV': 'development'
    }
  })
    .on('restart', function () {
      console.log('restarted!');
    })
    .on('error', function(e) {
      console.log('error:', e);
    })
    .once('end', function () {
      console.log('end');
      process.exit();
    });
});


/**
 * $ gulp default
 */
gulp.task('default', ['nodemon']);


gulp.on('stop', function() {
  mongoose.disconnect();
});
gulp.on('err', function(gulpErr) {
  console.log(gulpErr);
  mongoose.disconnect();
});

process.on('uncaughtException', function(err) {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});
