module.exports = {
  exclude: /(node_modules|bower_components)/,
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-classes',
    ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
  ],
};
