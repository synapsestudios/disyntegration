var exec  = require('child_process').exec;
var gulp  = require('gulp');
var gutil = require('gulp-util');
var sh    = require('../node_modules/syntegration/node_modules/execSync/index');

var config = require('../node_modules/syntegration/src/config');

gulp.task('syntegration', function() {
    if(config.serverCommand) {
      exec(config.serverCommand, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
      });
    }

    sh.run('node node_modules/syntegration/src/server.js');
});

gulp.task('syntegration:ci', function(cb) {
    var code, jsProcess, serverProcess, options;

    options = '';

    if (config.serverCommand) {
        serverProcess = exec(config.serverCommand, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    }

    jsProcess = exec('node node_modules/syntegration/src/server.js', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });

    if (gutil.env.screenshot) {
        options += ' --screenshot=' + gutil.env.screenshot;
    }

    if (gutil.env.trace) {
        options += ' --trace=' + gutil.env.trace;
    }

    code = sh.run('phantomjs node_modules/syntegration/src/headless.js' + options);

    if (serverProcess) {
        serverProcess.kill();
    }

    jsProcess.kill();

    if (code !== 0) {
        process.exit(1);
    }

    return;
});

