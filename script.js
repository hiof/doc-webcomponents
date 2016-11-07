var Sassdown = require('node-sassdown');

var srcGlob = '**/*.scss';
var srcPathWebdesign = 'tmp/sass/webdesign';
var srcPathStyleguide = 'tmp/sass/styleguide';
var destPathWebdesign = 'tmp/webdesign';
var destPathStyleguide = 'tmp/styleguide';
var options = {
    highlight: 'monokai',
    excludeMissing: true,
    handlebarsHelpers: ['templates/*.js'],
    //readme: 'bower_components/hiof-colors/README.md',
    template: 'templates/sass.hbs'
};

var webdesign = new Sassdown(srcGlob, srcPathWebdesign, destPathWebdesign, options);
var styleguide = new Sassdown(srcGlob, srcPathStyleguide, destPathStyleguide, options);

//generate styleguide
webdesign.run();
styleguide.run();
