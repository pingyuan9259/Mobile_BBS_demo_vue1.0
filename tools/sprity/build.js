
// npm install sprity@^1.0.8 sprity-less@^1.0.3

var sprite = require('sprity');
sprite.create({
  src: './src/assets/sprites/icons/*.png',
  out: './src/assets/sprites/',
  name: 'sprites',
  style: './sprites.less',
  processor: 'less',
  cssPath: './',
  'style-type': 'less',
  'dimension': [{
    ratio: 1, dpi: 72
  }, {
    ratio: 2, dpi: 192
  }]
}, function () {
  console.log('css spr.tes done, please copy @import \'../../../assets/sprites/sprites\';');
});