/* @flow */
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssPartialImport from 'postcss-partial-import';

/**
 * Creates loader for JavaScript files and add some extra features for dev server, like hot reloading.
 */
export function createJSLoader(flags: CLIFlags, isProd: boolean): any[] {
  const jsLoaders: { loader: string, query?: any }[] = [
    {
      loader: require.resolve('babel-loader'),
      query: {
        presets: [require.resolve('babel-preset-react'), require.resolve('babel-preset-latest')]
      }
    }
  ];

  if (!isProd && flags.react) {
    jsLoaders.unshift({
      loader: require.resolve('react-hot-loader')
    });
  }

  return jsLoaders;
}

/**
 * Creates production loader for CSS files.
 */
export function createCSSLoaderProd(flags: CLIFlags): Loader {
  return {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: require.resolve('style-loader'),
      use: [
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: flags.cssmodules,
            importLoaders: 1,
            minimize: true
          }
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            plugins() {
              return [
                postcssPartialImport(),
                autoprefixer(),
                precss()
              ];
            }
          }
        }
      ]
    })
  };
}

/**
 * Creates dev server loader for CSS files.
 */
export function createCSSLoaderDev(flags: CLIFlags): Loader {
  return {
    test: /\.css$/,
    use: [
      {
        loader: require.resolve('style-loader'),
        options: {
          convertToAbsoluteUrls: true
        }
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: flags.cssmodules,
          importLoaders: 1
        }
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          plugins() {
            return [
              postcssPartialImport(),
              autoprefixer(),
              precss()
            ];
          }
        }
      }
    ]
  };
}

/**
 * Setups loaders for webpack.
 */
export function rules(flags: CLIFlags, params: AikParams): Loader[] {
  const { isProd } = params;
  const jsLoaders = createJSLoader(flags, isProd);

  return [
    isProd
      ? createCSSLoaderProd(flags)
      : createCSSLoaderDev(flags),
    {
      test: /\.jsx?$/,
      enforce: 'pre',
      exclude: /(node_modules|bower_components)/,
      loader: require.resolve('eslint-loader'),
      options: {
        configFile: path.join(__dirname, '..', 'eslint-config.js'),
        useEslintrc: false
      }
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: jsLoaders
    },
    {
      test: /\.json$/,
      use: require.resolve('json-loader')
    },
    {
      exclude: [
        /\/$/,
        /\.html$/,
        /\.ejs$/,
        /\.css$/,
        /\.jsx?$/,
        /\.json$/
      ],
      loader: require.resolve('file-loader'),
      query: {
        name: isProd ? '[name].[hash:8].[ext]' : '[name].[ext]'
      }
    }
  ];
}