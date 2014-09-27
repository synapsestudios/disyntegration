#!/usr/bin/env node
var chalk        = require('chalk');
var childProcess = require('child_process');
var execSync     = require('execSync');

var config = require('../config');

var appCommand,
    appProcess,
    args,
    logOutput,
    phantomCommand,
    phantomResult,
    testCommand,
    testProcess,
    time;

args = {};
process.argv.forEach(function(arg, index) {
    if (index > 1) {
        args[arg.split('=')[0].replace(/^--/, '')] = arg.split('=')[1];
    }
});

logOutput = function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (error) {
        console.log(error);
    }
};

childProcess.exec(__dirname + '/bundle.js', logOutput);

appCommand     = 'node ' + __dirname + '/../scripts/app-server.js';
phantomCommand = 'phantomjs ' + __dirname + '/../scripts/phantom.js';
testCommand    = 'node ' + __dirname + '/../scripts/test-server.js';
time           = new Date().toString().split(' ')[4];

if (('ci' in args) || ('visible' in args)) {
    testCommand += ' --visible';
}

if (! ('ci' in args)) {
    console.log(
        "[%s] Serving %s on %s",
        chalk.dim(time),
        chalk.magenta(config.buildDir),
        chalk.magenta('http://localhost:' + config.appPort)
    );
}

appProcess = childProcess.exec(appCommand, logOutput);

if ('ci' in args) {
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

    testProcess   = childProcess.exec(testCommand, logOutput);
    phantomResult = execSync.run(phantomCommand);

    process.on('exit', function() {
        execSync.run('killall node');
    });

    process.exit(phantomResult);
} else {
    console.log(
        "[%s] %s on %s",
        chalk.dim(time),
        chalk.red('Disyntegrating'),
        chalk.magenta('http://localhost:' + config.testPort)
    );

    process.on('exit', function() {
        execSync.run('killall node');
    });

    execSync.run(testCommand);
}
