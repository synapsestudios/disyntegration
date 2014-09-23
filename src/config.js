var _    = require('underscore');
var fs   = require('fs');
var glob = require('glob');
var yaml = require('js-yaml');

var configYaml;

configYaml = yaml.safeLoad(fs.readFileSync('syntegration.yml', 'utf8'));

module.exports           = configYaml;
module.exports.indexHtml = _.template(fs.readFileSync(__dirname + '/index.erb', 'utf8'));

// The localhost port your application will be running on
module.exports.appPort     = configYaml.applicationPort;
module.exports.jasminePort = configYaml.jasminePort || 8888;
module.exports.proxyPort   = configYaml.proxyPort || 8889;
module.exports.files       = [];

_.each(configYaml.srcFiles, function(fileGlob) {
    _.each(glob.sync(fileGlob), function(file) {
        module.exports.files.push(file);
    });
});

_.each(configYaml.specFiles, function(fileGlob) {
    _.each(glob.sync(fileGlob), function(file) {
        module.exports.files.push(file);
    });
});
