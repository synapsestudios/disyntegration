var execSync = require('execSync');
var gulp     = require('gulp');
var gutil    = require('gulp-util');

var command, logOutput;

logOutput = function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (error) {
        console.log(error);
    }
};

command = './node_modules/.bin/disyntegrate';

gulp.task('disyntegrate', function() {
    if (gutil.env.visible) {
        command += ' --visible';
    }

    execSync.run(command);
});

gulp.task('disyntegrate:ci', function() {
    var returnCode;

    command += ' --ci';

    if (gutil.env.screenshot) {
        command += (
            ' --screenshot' +
            (typeof gutil.env.screenshot === 'string' ?
            ('=' + gutil.env.screenshot) : '')
        );
    }

    if (gutil.env.trace) {
        command += ' --trace';
    }

    returnCode = execSync.run(command);

    process.exit(returnCode);
});
