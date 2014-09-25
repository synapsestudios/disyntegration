var connect   = require('connect');
var fs        = require('fs');
var http      = require('http');
var httpProxy = require('http-proxy');

var config = require('./config');

var server = http.createServer(function(req, res) {
    var proxy;

    res.loadFile = function(filePath, contentType) {
        fs.readFile(filePath, function(err, page) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(page);
            res.end();
        });
    };

    proxy = httpProxy.createProxyServer({target: 'http://localhost:' + config.appPort});
    if (req.headers.referer && ! req.url.match(/^\/\?$/) && ! req.url.match(/^\/\?spec/)) {
        proxy.web(req, res);
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(config.runnerHtml({
            plugins   : config.plugins,
            proxyPort : config.proxyPort,
            specs     : config.specs,
            testMode  : config.testMode
        }));
        res.end();
    }
});

server.listen(config.testPort);

connect.createServer(
    connect.static(process.cwd())
).listen(config.proxyPort);
