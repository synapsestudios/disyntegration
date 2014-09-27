var childProcess = require('child_process');
var execSync     = require('execSync');
var gulp         = require('gulp');
var gutil        = require('gulp-util');

var config = require('../config');

var appCommand,
    handleError,
    phantomCommand,
    testCommand;

appCommand     = 'node node_modules/disyntegration/scripts/app-server.js';
phantomCommand = 'phantomjs node_modules/disyntegration/scripts/phantom.js';
testCommand    = 'node node_modules/disyntegration/scripts/test-server.js';

handleError = function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
};

gulp.task('disyntegrate', function() {
    var appProcess;

    gutil.log(
        'Serving', gutil.colors.magenta(config.buildDir), 'on',
        gutil.colors.magenta('http://localhost:' + config.appPort)
    );

    appProcess = childProcess.exec(appCommand, handleError);

    gutil.log(
        gutil.colors.red('Disyntegrating'), 'on',
        gutil.colors.magenta('http://localhost:' + config.testPort)
    );

    if (gutil.env.visible) {
        testCommand += ' --visible';
    }

    execSync.run(testCommand);
});

gulp.task('disyntegrate:ci', function() {
    var appProcess,
        phantomResult,
        testProcess;

    appProcess  = childProcess.exec(appCommand, handleError);

    testCommand += ' --visible';
    testProcess = childProcess.exec(testCommand, handleError);

    phantomCommand += ' --port=' + config.testPort;
    if (gutil.env.screenshot) {
        phantomCommand += ' --screenshot=' + gutil.env.screenshot;
    }

    if (gutil.env.trace) {
        phantomCommand += ' --trace=' + gutil.env.trace;
    }

    phantomResult = execSync.run(phantomCommand);

    appProcess.kill();
    testProcess.kill();

    if (phantomResult !== 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
