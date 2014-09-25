var args           = {};
var page           = require('webpage').create();
var phantomConsole = console;
var system         = require('system');

var url;

system.args.forEach(function(arg, index) {
    if (index > 0) {
        args[arg.split('=')[0].replace(/^--/, '')] = arg.split('=')[1];
    }
});

url = 'http://localhost:' + args.port;

if (! args.trace) {
    console = {
        log   : function() {},
        error : function() {}
    };
}

var failures = function() {
    return page.evaluate(function(){
        return document.getElementsByClassName('failures')[0].innerText;
    })
};

var finished = function() {
    return page.evaluate(function() {
        banner = document.getElementsByClassName('banner')[0];

        if (! banner) {
            return false;
        }

        return banner.getElementsByClassName('duration')[0]
    });
};

var results = function() {
    return page.evaluate(function(){
        return document.getElementsByClassName('bar')[0].innerText;
    })
};

var summary = function() {
    return page.evaluate(function(){
        return document.getElementsByClassName('summary')[0].innerText;
    })
};

var success = function() {
    return page.evaluate(function(){
        return document.getElementsByClassName('failed').length == 0;
    })
};

var process = function() {
    if (args.screenshot) {
        page.render(args.screenshot);
    }

    if (finished()) {
        phantomConsole.log(results());

        if(success()) {
            phantom.exit(0);
        } else {
            phantomConsole.log(failures());
            phantom.exit(1);
        }
    } else {
        setTimeout(process, 200)
    }
};

setTimeout(function() {
    page.open(url, function (status) {
        if(status === 'success') {
            phantomConsole.log('Spec Runner loaded!');
        } else {
            phantomConsole.log('Spec Runner not loaded!');
        }

        process();
    });
}, 200);
