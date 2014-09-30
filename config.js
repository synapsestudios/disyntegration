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
    var files = glob.sync(process.cwd() + '/' + fileGlob);

    if (files.length) {
        _.each(files, function(file) {
            module.exports.plugins.push({
                path : file,
                name : file.split('/').pop()
            });
        });
    } else {
        module.exports.plugins.push({
            path : process.cwd() + '/' + fileGlob,
            name : fileGlob.split('/').pop()
        });
    }
});

// Look for spec files in the current path
_.each(config.specFiles, function(fileGlob) {
    _.each(glob.sync(process.cwd() + '/' + fileGlob), function(file) {
        module.exports.specs.push(file);
    });
});
