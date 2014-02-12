module.exports = function(grunt) {

  'use strict';

  var requirejs = require('requirejs');
  var compress = require('../lib/compress');

  var path = require('path');
  var resolve = path.resolve;
  var join = path.join;

  var _ = grunt.util._;

  var defaults = {
    'logLevel': 2,
    'paths': {},
    'baseUrl': 'public',
    'buildDir': 'build',
    'useSourceUrl': true,
    'optimize': 'none',
    'compress': false
  };

  function onBuildRead (name, path, contents ) {
    return compress(contents);
  }

  function RequireJSCompilerTask() {

    // Async task
    var done = this.async();

    // Options
    var target = this.target;
    var options = this.options(defaults);

    // for debugging
    grunt.verbose.writeflags(options, 'Options');

    if (options.compress) {
      options.onBuildRead = onBuildRead;
    }

    // make paths absolute, to be able to include files outside the base directory
    var paths = options.paths = options.paths || {};
    _.each(paths, function (path, key) {
      paths[key] = resolve(join(options.baseUrl, path));
    });

    // make the out-file path absolute too
    if (!options.out && options.buildDir) {
      options.out = resolve(join(options.buildDir, target + '.js'));
    } else {
      options.out = resolve(join(options.baseUrl, options.out));
    }

    // Optimize
    requirejs.optimize(options, function () {
      grunt.log.writeln('\u2714'.green, target);
      process.nextTick(done);
    });
  }

  grunt.registerMultiTask('requirejs', 'Build a RequireJS project.', RequireJSCompilerTask);
};
