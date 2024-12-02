module.exports = {
  root: true, // Projenin kök düzeyde bir ESLint yapılandırması olduğunu belirtir
  extends: '@react-native', // React Native için varsayılan kuralları uygular
  parser: '@typescript-eslint/parser', // TypeScript için parser kullanımı
  plugins: ['@typescript-eslint', 'jest'], // TypeScript ve Jest desteği için eklentiler
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // Kullanılmayan değişkenler için uyarıları kapatır
    'react-native/no-inline-styles': 'off', // Inline stil kullanımı için uyarıları kapatır
    'react/react-in-jsx-scope': 'off', // React 17 sonrası React import gereksinimini kapatır
    'react-hooks/exhaustive-deps': 'warn', // Eksik bağımlılıklar için uyarı verir
    '@typescript-eslint/explicit-function-return-type': 'warn', // Fonksiyon dönüş tiplerini zorunlu yapar
    '@typescript-eslint/no-explicit-any': 'warn', // "any" tipi için uyarı verir
    'no-console': 'warn', // Konsol kullanımına karşı uyarı verir
    'jest/no-disabled-tests': 'warn', // Devre dışı bırakılmış Jest testleri için uyarı
    'jest/no-focused-tests': 'error', // "only" veya odaklanmış Jest testleri için hata
  },
  env: {
    'jest/globals': true, // Jest küresel değişkenlerini tanımlar
  },
};
