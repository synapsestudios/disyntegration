var connect  = require('gulp-connect');
var fallback = require('connect-history-api-fallback');

var config = require('../config');

connect.server({
    root       : config.appDir,
    port       : config.appPort,
    middleware : function (connect, options) {
        return [fallback];
    }
});
