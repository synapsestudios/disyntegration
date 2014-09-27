var _    = require('underscore');
var fs   = require('fs');
var glob = require('glob');
var os   = require('os');
var yaml = require('js-yaml');

var configYaml, testRunner, yamlFile;

yamlFile = fs.readFileSync(process.cwd() + '/disyntegration.yml', 'utf8');

if (! yamlFile) {
    yamlFile = fs.readFileSync(__dirname + '/disyntegration.yml', 'utf8');
}

configYaml = yaml.safeLoad(yamlFile);
testRunner = configYaml.testRunner || 'jasmine';

module.exports            = configYaml;
module.exports.runnerHtml = _.template(
    fs.readFileSync(__dirname + '/templates/' + testRunner + '.erb', 'utf8')
);

module.exports.appPort    = configYaml.appPort || 8888;
module.exports.appDir     = configYaml.appDir || 'build';
module.exports.buildDir   = os.tmpdir() + '/disyntegration';
module.exports.mochaMode  = configYaml.mochaMode || 'bdd';
module.exports.plugins    = [];
module.exports.proxyPort  = configYaml.testProxy || 8889;
module.exports.testRunner = testRunner;
module.exports.specs      = [];
module.exports.testPort   = configYaml.testPort || 9002;

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
console.log(module.exports.plugins);

// Look for spec files in the current path
_.each(configYaml.specFiles, function(fileGlob) {
    _.each(glob.sync(process.cwd() + fileGlob), function(file) {
        module.exports.specs.push(file);
    });
});
