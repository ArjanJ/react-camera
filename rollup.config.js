const babel = require('rollup-plugin-babel');

export default [
  {
    input: 'src/camera/Camera.js',
    output: {
      file: './lib/react-camera.js',
      format: 'cjs',
    },
    plugins: [
      babel({
        babelrc: false,
        exclude: /node_modules/,
        plugins: [
          '@babel/transform-regenerator',
          ['@babel/transform-runtime'],
          '@babel/plugin-proposal-class-properties',
        ],
        presets: ['@babel/env', '@babel/preset-react'],
        runtimeHelpers: true,
      }),
    ],
  },
];
