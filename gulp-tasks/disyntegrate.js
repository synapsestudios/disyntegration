var exec  = require('child_process').exec;
var gulp  = require('gulp');
var gutil = require('gulp-util');
var sh    = require('execSync');

var config = require('../src/config');

gulp.task('disyntegrate', function() {
    var appProcess;

    gutil.log('Serving', gutil.colors.magenta(config.buildDir), 'on', gutil.colors.magenta('http://localhost:' + config.appPort));

    appProcess = exec('node node_modules/disyntegration/src/app-server.js', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });

    gutil.log(gutil.colors.red('Disyntegrating'), 'on', gutil.colors.magenta('http://localhost:' + config.testPort));

    sh.run('node node_modules/disyntegration/src/test-server.js');
});

gulp.task('desyntegrate:ci', function(cb) {
    var appProcess, code, phantomCommand, testProcess;

    appProcess = exec('node node_modules/disyntegration/src/app-server.js', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });

    testProcess = exec('node node_modules/disyntegration/src/test-server.js', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });

    phantomCommand = 'phantomjs';

    phantomCommand += ' node_modules/disyntegration/src/headless.js';

    phantomCommand += ' --port=' + config.testPort;
    if (gutil.env.screenshot) {
        phantomCommand += ' --screenshot=' + gutil.env.screenshot;
    }

    if (gutil.env.trace) {
        phantomCommand += ' --trace=' + gutil.env.trace;
    }

    code = sh.run(phantomCommand);

    appProcess.kill();
    testProcess.kill();

    if (code !== 0) {
        process.exit(1);
    }

    process.exit(0);
});
