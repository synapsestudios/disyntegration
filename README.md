disyntegration
============

Integration test running plugin inspired by and borrowing heavily from [jasmine-integration](https://github.com/jordinl/jasmine-integration). Rewritten for a gulp workflow and to be more plugin-based. Supports jasmine or mocha as a test framework.

## Installation
1. Add `"disyntegration" : "git@github.com:synapsestudios/disyntegration.git#v0.3.0` to devDependencies
1. Run `npm install -g phantomjs`
1. Copy `templates/disintegration.yml` to your root directory and customize for your app
1. Require `gulp-tasks/disintegrate.js` in your gulpfile

## Usage
1. Run in your browser with `gulp disintegrate`
    - Use `--visible` to view the tests as they run
1. Run from the command line with `gulp disyntegrate:ci`
    - Use `--screenshot=path/to/screenshot.png` to take screen shots. Currently the screenshot file is updated five times a second to give a pesudo-view of the tests as they run in phantomjs.
    - Use `--trace` to get more detailed error message output from phantomjs
