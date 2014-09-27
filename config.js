var _    = require('underscore');
var fs   = require('fs');
var glob = require('glob');
var yaml = require('js-yaml');

var configYaml, runner;

configYaml = yaml.safeLoad(fs.readFileSync(process.cwd() + '/disyntegration.yml', 'utf8'));
runner     = configYaml.runner || 'jasmine';

module.exports            = configYaml;
module.exports.runnerHtml = _.template(
    fs.readFileSync(__dirname + '/templates/' + runner + '.erb', 'utf8')
);

module.exports.appPort   = configYaml.appPort || 8888;
module.exports.buildDir  = configYaml.buildDir || 'build';
module.exports.mochaMode = configYaml.mochaMode || 'bdd';
module.exports.plugins   = [];
module.exports.proxyPort = configYaml.testProxy || 8889;
module.exports.runner    = runner;
module.exports.specs     = [];
module.exports.testPort  = configYaml.testPort || 9002;

_.each(configYaml.pluginFiles, function(fileGlob) {
    var files = glob.sync(process.cwd() + fileGlob);

    if (files.length) {
        _.each(files, function(file) {
            module.exports.plugins.push({
                path : file,
                name : file.split('/').pop()
            });
        });
    } else {
        module.exports.plugins.push({
            path : fileGlob,
            name : fileGlob.split('/').pop()
        });
    }
});

_.each(configYaml.specFiles, function(fileGlob) {
    _.each(glob.sync(process.cwd() + fileGlob), function(file) {
        module.exports.specs.push(file);
    });
});
