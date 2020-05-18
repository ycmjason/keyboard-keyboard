module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
        corejs: { version: 3 },
        useBuiltIns: 'usage',
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-proposal-optional-chaining'],
};
