var _    = require('underscore');
var fs   = require('fs');
var glob = require('glob');
var yaml = require('js-yaml');

var configYaml, runner;

configYaml = yaml.safeLoad(fs.readFileSync('syntegration.yml', 'utf8'));

runner = configYaml.runner || 'jasmine';

module.exports           = configYaml;
module.exports.runnerHtml = _.template(fs.readFileSync(__dirname + '/' + runner + '-runner.erb', 'utf8'));

// The localhost port your application will be running on
module.exports.appPort   = configYaml.appPort || 9000;
module.exports.plugins   = [];
module.exports.proxyPort = configYaml.proxyPort || 8888;
module.exports.specs     = [];
module.exports.testMode  = configYaml.testMode || 'bdd';
module.exports.testPort  = configYaml.testPort || 9001;

_.each(configYaml.pluginFiles, function(fileGlob) {
    _.each(glob.sync(fileGlob), function(file) {
        module.exports.plugins.push(file);
    });
});

_.each(configYaml.specFiles, function(fileGlob) {
    _.each(glob.sync(fileGlob), function(file) {
        module.exports.specs.push(file);
    });
});
