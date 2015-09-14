module.exports = function(grunt) {
    // Loads each task referenced in the packages.json file
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('sassdown');

    var mySecret = false;
    if (grunt.file.exists('secret.json')) {
        mySecret = grunt.file.readJSON('secret.json');
    }


    // Initiate grunt tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        moment: require('moment'),

        sassdown: {
            layout: {
                options: {
                    highlight: 'monokai',
                    excludeMissing: true,
                    handlebarsHelpers: ['templates/*.js'],
                    readme: 'bower_components/hiof-layout/README.md',
                    template: 'templates/sass.hbs'
                },
                files: [{
                    expand: true,
                    cwd: 'bower_components/hiof-layout/app/assets/sass',
                    src: ['*.scss'],
                    dest: 'build/styleguide/'
                }]
            },
            colors: {
                options: {
                    highlight: 'monokai',
                    excludeMissing: true,
                    handlebarsHelpers: ['templates/*.js'],
                    readme: 'bower_components/hiof-colors/README.md',
                    template: 'templates/sass.hbs'
                },
                files: [{
                    expand: true,
                    cwd: 'bower_components/hiof-colors/app/assets/sass',
                    src: ['*.scss'],
                    dest: 'build/styleguide/'
                }]
            }
        },
        clean: {
            all: {
                src: ["build/**/*", "dist/**/*"]
            },

            styleguide: {
                src: ["build/styleguide/**/*"]
            }
        },
        copy: {
            layout: {
                src: 'build/styleguide/layout.html',
                dest: 'build/1-layout.json',
            },
            colors: {
                src: 'build/styleguide/colors.html',
                dest: 'build/2-colors.json',
            },
        },
        "merge-json": {
            "data": {
                src: ["build/**/*.json"],
                dest: "dist/data.json"
            }
        },
        secret: mySecret,
        sftp: {
            stage: {
                files: {
                    "./": "dist/**"
                },
                options: {
                    path: '<%= secret.prod.path %>',
                    srcBasePath: "dist/",
                    host: '<%= secret.stage.host %>',
                    username: '<%= secret.stage.username %>',
                    password: '<%= secret.stage.password %>',
                    showProgress: true,
                    createDirectories: true,
                    directoryPermissions: parseInt(755, 8)
                }
            },
            prod: {
                files: {
                    "./": "dist/**"
                },
                options: {
                    path: '<%= secret.prod.path %>',
                    srcBasePath: "dist/",
                    host: '<%= secret.prod.host %>',
                    username: '<%= secret.prod.username %>',
                    password: '<%= secret.prod.password %>',
                    showProgress: true,
                    createDirectories: true,
                    directoryPermissions: parseInt(755, 8)
                }
            }
        }
    });

    // ----------------------------------------------------------
    // Tasks

    // Register tasks
    grunt.registerTask('build', ['clean:all', 'sassdown', 'copy', 'clean:styleguide', 'merge-json'])
    grunt.registerTask('default', ['build']);


    // Deploy tasks
    grunt.registerTask('deploy-stage', ['build', 'sftp:stage']);
    grunt.registerTask('deploy-prod', ['build', 'sftp:prod']);

};
