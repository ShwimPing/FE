const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
(async () => {
  // 비동기로 기본 설정을 가져옵니다.
  const defaultConfig = await getDefaultConfig(__dirname);

  const svgConfig = {
    transformer: {
      // 'react-native-svg-transformer'를 transformer로 추가
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      // svg를 asset에서 제거하고 source로 추가
      assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    },
  };

  // 기본 설정과 SVG 설정을 병합합니다.
  const config = mergeConfig(defaultConfig, svgConfig);

  module.exports = config;
})();
