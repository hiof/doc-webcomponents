module.exports = function(grunt) {
    // Loads each task referenced in the packages.json file
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    var mySecret = false;
    if (grunt.file.exists('secret.json')) {
        mySecret = grunt.file.readJSON('secret.json');
    }


    // Initiate grunt tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        moment: require('moment'),


        sassdoc: {
            layout: {
                src: 'app/assets/sass/',
            },
        },
        html2md: {
            main: {
                src: [
                    'sassdoc/*.html'
                ],
                dest: 'sassdoc/test.md'
            },
        },

        m2j: {
            release: {
                options: {
                    minify: false,
                    width: 10000
                },
                files: {
                    'bower_components/api/sections.json': ['content/designguidelines/*.md'],
                    'bower_components/api/files.json': ['content/files/*.md']
                },
            }
        }

    });

    // ----------------------------------------------------------
    // Tasks

    // Register tasks
    grunt.registerTask('default', ['sassdoc', 'html2md', 'm2j']);



};
