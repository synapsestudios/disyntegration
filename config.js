var _    = require('underscore');
var fs   = require('fs');
var glob = require('glob');
var os   = require('os');
var yaml = require('js-yaml');

var config,
    configYaml,
    defaultYaml;

configYaml  = fs.readFileSync(process.cwd() + '/disyntegration.yml', 'utf8');
defaultYaml = fs.readFileSync(__dirname + '/disyntegration.yml', 'utf8');

config = yaml.safeLoad(defaultYaml);
if (configYaml) {
    _.extend(config, yaml.safeLoad(configYaml));
}

module.exports            = config;
module.exports.runnerHtml = _.template(
    fs.readFileSync(__dirname + '/templates/' + config.testRunner + '.erb', 'utf8')
);

module.exports.buildDir   = process.cwd();
module.exports.plugins    = [];
module.exports.specs      = [];

_.each(config.pluginFiles, function(fileGlob) {
    var files = glob.sync(fileGlob);

    _.each(files, function(file) {
        module.exports.plugins.push(file);
    });
});

// Look for spec files in the current path
_.each(config.specFiles, function(fileGlob) {
    _.each(glob.sync(fileGlob), function(file) {
        module.exports.specs.push(file);
    });
});
