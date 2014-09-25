var exec  = require('child_process').exec;
var gulp  = require('gulp');
var gutil = require('gulp-util');
var sh    = require('../node_modules/execSync/index');

var config = require('../src/config');

gulp.task('desyntegrate', function() {
    if(config.serverCommand) {
        exec(config.serverCommand, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    }

    sh.run('node node_modules/desyntegration/src/server.js');
});

gulp.task('desyntegrate:ci', function(cb) {
    var code, phantomCommand, serverProcess, testProcess;

    if (config.serverCommand) {
        serverProcess = exec(config.serverCommand, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    }

    testProcess = exec('node node_modules/desyntegration/src/server.js', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });

    phantomCommand = 'phantomjs';

    phantomCommand += ' node_modules/desyntegration/src/headless.js';

    phantomCommand += ' --port=' + config.testPort;
    if (gutil.env.screenshot) {
        phantomCommand += ' --screenshot=' + gutil.env.screenshot;
    }

    if (gutil.env.trace) {
        phantomCommand += ' --trace=' + gutil.env.trace;
    }

    code = sh.run(phantomCommand);

    if (serverProcess) {
        serverProcess.kill();
    }

    testProcess.kill();

    if (code !== 0) {
        process.exit(1);
    }

    process.exit(0);
});
