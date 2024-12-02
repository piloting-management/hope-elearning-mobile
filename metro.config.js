const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = {
  resolver: {
    blockList: exclusionList([
      // Çakışan bağımlılık yollarını dışla
      /node_modules\/.*\/node_modules\/react-native\/.*/,
      /\.idea\/.*$/, // IDEA IDE dosyalarını dışla
      /\.vscode\/.*$/, // VSCode dosyalarını dışla
      /__tests__\/.*/, // Test dosyalarını dışla
    ]),
    unstable_enablePackageExports: true, // Paket dışa aktarımlarını etkinleştir
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true, // Performans optimizasyonu
      },
    }),
  },
  watchFolders: [
    './src', // Proje kaynak klasörü
    './node_modules', // Gerekirse diğer yolları ekleyin
  ],
  projectRoot: __dirname, // Proje kök dizini
  maxWorkers: 8, // İş parçacığı sayısını artırarak daha fazla dosya işle
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
