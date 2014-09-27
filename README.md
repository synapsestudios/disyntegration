disyntegration
============

Integration test running plugin inspired by and borrowing heavily from [jasmine-integration](https://github.com/jordinl/jasmine-integration). Rewritten for a gulp workflow and to be more plugin-based. Supports jasmine or mocha as a test framework.

## Installation
1. Add `"disyntegration" : "git@github.com:synapsestudios/disyntegration.git#v0.1.0` to devDependencies
1. `npm install`
1. `npm install -g phantomjs`
1. Copy `templates/disintegration.yml` to your root directory and customize for your app
1. Require `gulp-tasks/disintegrate.js` in your gulpfile

## Usage
1. Run with `gulp disintegrate` or `gulp disyntegrate:ci`
