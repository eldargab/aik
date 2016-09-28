'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveToCwd = resolveToCwd;
exports.getTemplatePath = getTemplatePath;
exports.isTemplateExists = isTemplateExists;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Resolves file path to current working directory.
 */
function resolveToCwd() {
  var filename = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return _path2.default.join(process.cwd(), filename);
}

/**
 * Generates possible template path for given file name.
 *
 * For example: index.js -> index.html
 */
function getTemplatePath() {
  var filename = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var basename = _path2.default.basename(filename, '.js');
  var dirname = _path2.default.dirname(filename);
  return resolveToCwd(_path2.default.join(dirname, basename + '.html'));
}

/**
 * Checks whether templatePath is a file.
 */
function isTemplateExists(templatePath) {
  try {
    var stats = _fs2.default.statSync(templatePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}