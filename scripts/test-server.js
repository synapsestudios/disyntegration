var connect   = require('connect');
var fs        = require('fs');
var http      = require('http');
var httpProxy = require('http-proxy');

var config = require('../config');

var proxy, server;

server = http.createServer(function(request, response) {
    response.loadFile = function(filePath, contentType) {
        fs.readFile(filePath, function(error, page) {
            response.writeHead(200, {
                'Content-Type' : contentType
            });

            response.write(page);
            response.end();
        });
    };

    proxy = httpProxy.createProxyServer({
        target : 'http://localhost:' + config.appPort
    });

    if (
        ! request.headers.referer || // If it is the initial page request
        request.url.match(/^\/\?$/) || // Or a link to one of the specs
        request.url.match(/^\/\?spec/)
    ) {
        // Send the spec runner HTML
        response.writeHead(200, {
            'Content-Type' : 'text/html'
        });

        response.write(config.runnerHtml({
            plugins   : config.plugins,
            mochaMode : config.mochaMode,
            proxyPort : config.proxyPort,
            specs     : config.specs,
            visible   : (process.argv.join(' ').indexOf('--visible') !== -1)
        }));

        response.end();
    } else {
        // Otherwise proxy to the application port
        proxy.web(request, response);
    }
});

server.listen(config.testPort);

connect.createServer(
    connect.static(process.cwd())
).listen(config.proxyPort);
