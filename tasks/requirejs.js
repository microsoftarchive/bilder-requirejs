module.exports = function(grunt) {

  'use strict';

  var requirejs = require('requirejs/bin/r');
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
    'twoFiles': false,
    'optimize': 'none',
    'compress': false
  };

  function RequireJSCompilerTask() {

    // target name
    var target = this.target;

    // Async task
    var finish = this.async();
    var done = function () {
      grunt.log.writeln('\u2714'.green, target);
      setImmediate(finish);
    };

    // Options
    var options = this.options(defaults);

    // for debugging
    grunt.verbose.writeflags(options, 'Options');

    // make paths absolute, to be able to include files outside the base directory
    var paths = options.paths = options.paths || {};
    _.each(paths, function (path, key) {
      if (path !== 'empty:') {
        path = join(options.baseUrl, path);
        paths[key] = resolve(path);
      }
    });

    // make the out-file path absolute too
    if (!options.out && options.buildDir) {
      options.out = resolve(join(options.buildDir, target + '.js'));
    } else {
      options.out = resolve(join(options.baseUrl, options.out));
    }

    // Optimize
    requirejs.optimize(options, function () {
      // if compression flag was set, generate a '.min.js' file
      if (options.compress) {
        var outFile = options.out;
        var minFile = outFile;
        if (options.twoFiles) {
          minFile = outFile.replace(/\.js$/, '.min.js');
        }
        grunt.file.write(minFile, compress(grunt.file.read(outFile)));
      }
      // wrap up
      done();
    });
  }

  grunt.registerMultiTask('requirejs', 'Build a RequireJS project.', RequireJSCompilerTask);
};
