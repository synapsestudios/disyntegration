var myConsle = console;
var system   = require('system');
var webpage  = require('webpage');

var args,
    getDuration,
    getFailures,
    getResults,
    getSummary,
    page,
    execute,
    testsAreFinished,
    testsWereSuccessful,
    url;

args = {};

system.args.forEach(function(arg, index) {
    if (index > 0) {
        args[arg.split('=')[0].replace(/^--/, '')] = arg.split('=')[1];
    }
});

page = webpage.create();

url = 'http://localhost:' + args.port;

if (! args.trace) {
    console = {
        log   : function() {},
        error : function() {}
    };
}

page.onError = function(message, trace) {
    var messages;

    messages = ['[ERROR] ' + message];

    if (trace && trace.length) {
        messages.push('[TRACE]');

        trace.forEach(function(item) {
            messages.push(
                ' -> ' + item.file + ': ' + item.line +
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
        return document.getElementsByClassName('getFailures')[0].innerText;
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
    var results;

    if (args.screenshot) {
        page.render(args.screenshot);
    }

    if (testsAreFinished()) {
        results = getResults() + ' ' + getDuration();

        if (testsWereSuccessful()) {
            myConsle.log(results);
            phantom.exit(0);
        } else {
            myConsle.error(results);
            myConsle.error(getFailures());
            phantom.exit(1);
        }
    } else {
        setTimeout(execute, 200);
    }
};

setTimeout(function() {
    page.open(url, function(status) {
        if(status === 'success') {
            myConsle.log('[INFO] Spec Runner loaded. Running specs.');
            execute();
        } else {
            myConsle.error('[ERROR] Spec Runner not loaded');
            phantom.exit(1);
        }
    });
}, 200);
