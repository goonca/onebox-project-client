module.exports = api => {
  api.cache(true);

  const presets = [
    '@babel/env',
    ['@babel/react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ];

  const plugins = [
    '@babel/plugin-transform-runtime',
    'babel-plugin-styled-components'
  ];

  return { presets, plugins };
};
