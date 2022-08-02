const plugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      absoluteRuntime: false,
      corejs: false,
      helpers: true,
      regenerator: true,
    },
  ],
  [
    'module-resolver',
    {
      alias: {
        '@app': './src',
        '@components': './src/components',
        '@ts': './src/ts',
        '@hooks': "./src/hooks",
      },
    },
  ],
];
if (process.env.SERVE) {
  plugins.push('react-refresh/babel');
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins,
};
