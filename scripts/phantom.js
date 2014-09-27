require('es5-shim');

var args   = {};
var system = require('system');

system.args.forEach(function(arg, index) {
    if (index > 0) {
        args[arg.split('=')[0].replace(/^--/, '')] = arg.split('=')[1];
    }
});

// Shim the process variable for chalk
var process = {argv : system.args.join(' '), env : system.env};

var chalk     = require('chalk');
var myConsole = console;
var webpage   = require('webpage');

var execute,
    getDuration,
    getFailures,
    getResults,
    getSummary,
    page,
    testsAreFinished,
    testsWereSuccessful,
    url;

page = webpage.create();
url  = 'http://localhost:' + args.port;

if (! ('trace' in args)) {
    console = {
        log   : function() {},
        error : function() {}
    };
}

page.onError = function(message, trace) {
    var messages, time;

    messages = ['[' + chalk.red(time) + '] ERROR:' + message];
    time     = new Date().toString().split(' ')[4];

    if (trace && trace.length) {
        messages.push('[' + chalk.red(time) + '] TRACE:');

        trace.forEach(function(item) {
            messages.push(
                '[' + chalk.red(time) + '] -> ' + item.file + ': ' + item.line +
                (item.function ? ' (in function "' + item.function +'")' : '')
            );
        });
    }

    console.error(messages.join('\n'));
};

getDuration = function() {
    return page.evaluate(function() {
        return document.getElementsByClassName('duration')[0].innerText;
    });
};

getFailures = function() {
    return page.evaluate(function() {
        return document.getElementsByClassName('failures')[0].innerText;
    });
};

getResults = function() {
    return page.evaluate(function() {
        return document.getElementsByClassName('bar')[0].innerText;
    });
};

getSummary = function() {
    return page.evaluate(function() {
        return document.getElementsByClassName('summary')[0].innerText;
    });
};

testsWereSuccessful = function() {
    return page.evaluate(function() {
        return (document.getElementsByClassName('failed').length === 0);
    });
};

testsAreFinished = function() {
    return page.evaluate(function() {
        banner = document.getElementsByClassName('banner')[0];

        if (! banner) {
            return false;
        }

        return banner.getElementsByClassName('duration').length;
    });
};

execute = function() {
    var results, time;

    if ('screenshot' in args) {
        page.render(args.screenshot || 'disyntegrating.png');
    }

    if (testsAreFinished()) {
        var time;

        results = getResults() + ' ' + getDuration();
        time    = new Date().toString().split(' ')[4];

        if (testsWereSuccessful()) {
            myConsole.log('[' + chalk.green(time) + ']', results);
            phantom.exit(0);
        } else {
            myConsole.error('[' + chalk.red(time) + ']', results);
            console.error('[' + chalk.red(time) + ']', getFailures());
            phantom.exit(1);
        }
    } else {
        setTimeout(execute, 200);
    }
};

setTimeout(function() {
    page.open(url, function(status) {
        var time;

        time = new Date().toString().split(' ')[4];

        if(status === 'success') {
            myConsole.log('[' + chalk.dim(time) + ']', 'Spec Runner loaded');
            execute();
        } else {
            myConsole.error('[' + chalk.red(time) + ']', 'Spec Runner not loaded');
            phantom.exit(1);
        }
    });
}, 200);
