#!/usr/bin/env node
var args = {};
process.argv.forEach(function(arg, index) {
    if (index > 1) {
        args[arg.split('=')[0].replace(/^--/, '')] = arg.split('=')[1];
    }
});

var chalk        = require('chalk');
var childProcess = require('child_process');
var execSync     = require('execSync');

var config = require('../config');

var appCommand,
    appProcess,
    bundleCommand,
    bundleProcess,
    ci,
    logOutput,
    phantomCommand,
    phantomResult,
    testCommand,
    testProcess,
    time,
    visible;

logOutput = function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (error) {
        console.error(error);
    }
};

ci      = ('ci' in args);
visible = ('visible' in args);

appCommand     = 'node ' + __dirname + '/../scripts/app-server.js';
bundleCommand  = __dirname + '/bundle.js';
phantomCommand = 'phantomjs ' + __dirname + '/../scripts/phantom.js';
testCommand    = 'node ' + __dirname + '/../scripts/test-server.js';
time           = new Date().toString().split(' ')[4];

if (! ci) {
    console.log(
        "[%s] Serving %s on %s",
        chalk.dim(time),
        chalk.magenta(config.appDir),
        chalk.magenta('http://localhost:' + config.appPort)
    );
}

appProcess = childProcess.exec(appCommand, logOutput);

if (ci) {
    console.log(
        "[%s] %s",
        chalk.dim(time),
        chalk.red('Disyntegrating')
    );

    phantomCommand += ' --port=' + config.testPort;

    if ('screenshot' in args) {
        phantomCommand += (
            ' --screenshot' +
            (typeof args.screenshot === 'string' ?
            ('=' + args.screenshot) : '')
        );
    }

    if ('trace' in args) {
        phantomCommand += ' --trace';
    }

    bundleCommand += ' --ci';

    bundleProcess = execSync.run(bundleCommand, logOutput);
    testProcess   = childProcess.exec(testCommand, logOutput);
    phantomResult = execSync.run(phantomCommand);

    process.on('exit', function() {
        appProcess.kill();
        testProcess.kill();
    });

    process.exit(phantomResult);
} else {
    console.log(
        "[%s] %s on %s",
        chalk.dim(time),
        chalk.red('Disyntegrating' + (visible ? ' Live' : '')),
        chalk.magenta('http://localhost:' + config.testPort)
    );

    bundleProcess = childProcess.exec(bundleCommand, logOutput);

    process.on('exit', function() {
        appProcess.kill();
    });

    execSync.run(testCommand);
}
