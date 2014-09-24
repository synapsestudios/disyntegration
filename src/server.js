var connect   = require('connect');
var dir       = process.cwd();
var fs        = require('fs');
var gutil     = require('gulp-util');
var http      = require('http');
var httpProxy = require('http-proxy');
var proxy     = httpProxy.createProxyServer({});

var config = require('./config');

var server = http.createServer(function(req, res) {
    res.loadFile = function(filePath, contentType) {
        fs.readFile(filePath, function(err, page) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(page);
            res.end();
        });
    };

    if (req.headers.referer && ! req.url.match(/^\/\?$/) && ! req.url.match(/^\/\?spec/)) {
        proxy.web(req, res, { target: 'http://localhost:' + config.appPort });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(config.indexHtml({
            plugins       : config.plugins,
            proxyPort     : config.proxyPort,
            specs         : config.specs,
            testInterface : config.testInterface
        }));
        res.end();
    }
});

gutil.log('Server started at', gutil.colors.magenta('http://localhost:' + config.testPort));

server.listen(config.testPort);

connect.createServer(
    connect.static(dir)
).listen(config.proxyPort);
