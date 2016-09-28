'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputProd = outputProd;
exports.outputDev = outputDev;
exports.default = output;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Output for production build.
 */
function outputProd(filename, flags, dist) {
  var base = typeof flags.base === 'string' ? flags.base : '';
  var publicPath = base.endsWith('/') ? base : base + '/';

  return {
    path: (0, _helpers.resolveToCwd)(dist),
    filename: _path2.default.basename(filename, '.js') + '.[hash:8].js',
    hash: true,
    publicPath: publicPath
  };
}

/**
 * Output for dev server.
 */
function outputDev(filename) {
  return {
    path: _path2.default.join(process.cwd(), _path2.default.dirname(filename)),
    filename: _path2.default.basename(filename),
    hash: true
  };
}

/**
 * Setups output section of webpack config.
 */
function output(filename, flags, isProd, dist) {
  return isProd ? outputProd(filename, flags, dist) : outputDev(filename);
}