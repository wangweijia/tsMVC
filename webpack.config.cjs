const path = require('path');

module.exports = {
  entry: './src/index.ts', // 入口文件
  output: {
    filename: 'index.js', // 输出文件名
    path: path.resolve(__dirname, 'lib'), // 输出目录
  },
  resolve: {
    extensions: ['.ts', '.js'], // 支持的文件扩展名
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
