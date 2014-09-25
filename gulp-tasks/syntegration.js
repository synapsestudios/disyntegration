var exec  = require('child_process').exec;
var gulp  = require('gulp');
var gutil = require('gulp-util');
var sh    = require('../node_modules/execSync/index');

var config = require('../src/config');

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
    var code, jsProcess, headlessOptions, serverProcess;

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

    headlessOptions = ' --port=' + config.testPort;
    if (gutil.env.screenshot) {
        headlessOptions += ' --screenshot=' + gutil.env.screenshot;
    }

    if (gutil.env.trace) {
        headlessOptions += ' --trace=' + gutil.env.trace;
    }

    code = sh.run('phantomjs --web-security=no node_modules/syntegration/src/headless.js' + headlessOptions);

    if (serverProcess) {
        serverProcess.kill();
    }

    jsProcess.kill();

    if (code !== 0) {
        process.exit(1);
    }

    return;
});

