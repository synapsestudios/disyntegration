#!/usr/bin/env node
var browserify = require('browserify');
var del        = require('del');
var fs         = require('fs');
var watchify   = require('watchify');

var config = require('../config');

var bundle,
    copyFile,
    packages,
    rebundle;

packages = [
    __dirname + '/../scripts/page'
];

copyFile = function(path, name) {
    if (! name) {
        name = path.split('/').pop();
    }

    return fs.createReadStream(path)
        .pipe(fs.createWriteStream(config.buildDir + '/' + name));
}

packages = packages.concat(config.specs);

bundle = browserify({
        debug        : true,
        entries      : packages,
        extensions   : ['.js'],
        fullPaths    : true,
        cache        : {},
        packageCache : {}
    });

for (var i in config.specs) {
    bundle.add(config.specs[i]);
}

watchify(bundle)

rebundle = function() {
    return del(config.buildDir, function() {
        fs.mkdirSync(config.buildDir);

        copyFile(__dirname + '/../images/favicon.png', 'favicon.png');
        copyFile(__dirname + '/../node_modules/jquery/dist/jquery.js', 'jquery.js');

        switch (config.testRunner) {
            case 'assert' :
                break;
            case 'jasmine' :
                copyFile('./node_modules/jasmine-core/lib/jasmine-core/jasmine.css', 'jasmine.css');
                copyFile('./node_modules/jasmine-core/lib/jasmine-core/jasmine.js', 'jasmine.js');
                copyFile('./node_modules/jasmine-core/lib//jasmine-core/jasmine-html.js', 'jasmine-html.js');
                copyFile('./node_modules/jasmine-core/lib//jasmine-core/boot.js', 'boot.js');
                break;
            case 'mocha' :
                copyFile('./node_modules/mocha/mocha.css', 'mocha.css');
                copyFile('./node_modules/mocha/mocha.js', 'mocha.js');
                break;
        }

        for (var i in config.plugins) {
            copyFile(config.plugins[i].path, config.plugins[i].name);
        }

        bundle.bundle()
            .pipe(fs.createWriteStream(config.buildDir + '/specs.js'));
    });
};

bundle.on('update', rebundle);

rebundle();
