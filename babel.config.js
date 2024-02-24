module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@assets': "./assets",
            '@components': "./components",
            '@context': "./context",
            '@screens': "./screens",
            '@utils': "./utils",
            '@types': "./types",
          },
       },
      ],
      'react-native-reanimated/plugin',
    ]
  };
};
