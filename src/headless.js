var args           = {};
var page           = require('webpage').create();
var phantomConsole = console;
var system         = require('system');

var url = 'http://localhost:9001';

system.args.forEach(function(arg, index) {
    if(index > 0) {
        args[arg.split('=')[0].replace(/^--/, '')] = arg.split('=')[1];
    }
});

console = {
    log   : function() {},
    error : function() {}
}

var finished = function()
{
    return page.evaluate(function() {
        banner = document.getElementsByClassName('banner')[0];

        if (! banner) {
            return false;
        }

        return banner.getElementsByClassName('duration')[0]
    });
};

var success = function()
{
    return page.evaluate(function(){
        return document.getElementsByClassName('failed').length == 0;
    })
};

var results = function()
{
    return page.evaluate(function(){
        return document.getElementsByClassName('bar')[0].innerText;
    })
};

var process = function()
{
    if (args.screenshot) {
        page.render(args.screenshot);
    }

    if(finished()) {
        phantomConsole.log(results());

        if(success()) {
            phantom.exit(0);
        } else {
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
