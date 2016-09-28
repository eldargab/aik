'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackConfigBuilder;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _precss = require('precss');

var _precss2 = _interopRequireDefault(_precss);

var _postcssImport = require('postcss-import');

var _postcssImport2 = _interopRequireDefault(_postcssImport);

var _helpers = require('./helpers');

var _entry = require('./entry');

var _entry2 = _interopRequireDefault(_entry);

var _output = require('./output');

var _output2 = _interopRequireDefault(_output);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _loaders = require('./loaders');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generates config for webpack.
 */
function webpackConfigBuilder(filename, flags, isProd, dist) {
  // eslint-disable-line
  var template = (0, _helpers.getTemplatePath)(filename);

  return {
    entry: (0, _entry2.default)(filename, flags, isProd),
    output: (0, _output2.default)(filename, flags, isProd, dist),
    debug: !isProd,
    devtool: !isProd && 'eval',
    plugins: (0, _plugins2.default)((0, _helpers.isTemplateExists)(template) && template, isProd),
    module: {
      preLoaders: (0, _loaders.preloaders)(),
      loaders: (0, _loaders.loaders)(flags, isProd)
    },
    eslint: {
      configFile: _path2.default.join(__dirname, '../../eslint-config.js'),
      useEslintrc: false
    },
    postcss: function postcss(wp) {
      return [(0, _postcssImport2.default)({ addDependencyTo: wp }), (0, _autoprefixer2.default)(), (0, _precss2.default)()];
    }
  };
}