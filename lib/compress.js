'use strict';

var UglifyJS = require('uglify-js');

// This function takes JS code as string input,
// & returns the compressed version
function compress (code) {

  var tree = UglifyJS.parse(code);
  tree.figure_out_scope();

  var compressor = UglifyJS.Compressor({
    'warnings': false
  });

  var ast = tree.transform(compressor);
  ast.figure_out_scope();
  ast.compute_char_frequency();
  ast.mangle_names();

  var stream = UglifyJS.OutputStream({
    'indent_start': 0,
    'indent_level': 0,
    'beautify': true
  });

  ast.print(stream);
  return stream.toString();
}

module.exports = compress;