const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.toConfig().plugins.push(
      new MonacoWebpackPlugin({
        languages: ['yaml', 'json'],
      }),
    );
  });
};
