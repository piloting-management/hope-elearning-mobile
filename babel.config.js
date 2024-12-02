module.exports = {
  presets: [
    'module:metro-react-native-babel-preset', // React Native için varsayılan preset
    '@babel/preset-typescript', // TypeScript desteği
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: false,
      },
    ],
    ['@babel/plugin-transform-object-rest-spread', { loose: true }], // Object Rest/Spread desteği
    ['@babel/plugin-transform-private-methods', { loose: true }], // Private Methods desteği
    ['@babel/plugin-transform-private-property-in-object', { loose: true }], // Private Properties desteği
  ],
};
