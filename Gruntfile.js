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

    shell: {
      installBower: {
        command: 'bower install'
      }
    },
    // Create the documentation with this node-script
    execute: {
      target: {
        src: ['script.js']
      }
    },

    // Clean all folders
    clean: {
      all: {
        src: ["bower_components/**/*", "build/**/*", "dist/**/*", "tmp/**/*"]
      },

      styleguide: {
        src: ["build/styleguide/**/*"]
      }
    },
    // Rename the files to order them in the output
    rename:{
      frontend:{
        files:[
          {
            src: ['tmp/sass/webdesign/design-doc.scss'],
            dest: 'tmp/sass/webdesign/1-design-doc.scss'
          }
        ]
      },
      typography:{
        files:[
          {
            src: ['tmp/sass/styleguide/typography.scss'],
            dest: 'tmp/sass/styleguide/2-typography.scss'
          }
        ]
      },
      layout:{
        files:[
          {
            src: ['tmp/sass/styleguide/layout.scss'],
            dest: 'tmp/sass/styleguide/3-layout.scss'
          }
        ]
      },
      colors:{
        files:[
          {
            src: ['tmp/sass/styleguide/colors.scss'],
            dest: 'tmp/sass/styleguide/4-colors.scss'
          }
        ]
      }
    },
    // Copy sass fiels to temp directory, rename the final output file to json, copy illustrations
    copy: {

      styleguide:{
        expand: true,
        flatten: true,
        src: ['bower_components/hiof-*/**/*.scss', '!bower_components/hiof-*/**/_*.scss', '!bower_components/hiof-frontend/app/assets/sass/helpers/**/*.scss'],
        dest: 'tmp/sass/styleguide/',
      },
      webdesign:{
        expand: true,
        flatten: true,
        src: ['bower_components/hiof-frontend/app/assets/sass/helpers/**/*.scss', '!bower_components/hiof-frontend/app/assets/sass/helpers/**/_*.scss'],
        dest: 'tmp/sass/webdesign/',
      },
      rename:{
        expand: true,
        flatten: true,
        src: ['tmp/webdesign/1-design-doc.html', 'tmp/styleguide/2-typography.html'],
        dest: 'tmp/json/',
        rename: function(dest, matchedSrcPath, options) {
          // return the destination path and filename:
          return (dest + matchedSrcPath).replace('.html', '.json');
        }
      },
      illustrations:{

        expand: true,
        flatten: true,
        src: ['bower_components/hiof-frontend/app/assets/images/illustrations/**/*'],
        dest: 'dist/illustrations/',
      }

    },
    // Merge json data into one file
    "merge-json": {
      styleguide: {
        src: ["tmp/json/2-typography.json"],
        dest: "dist/doc-styleguide.json"
      },
      webdesign: {
        src: ["tmp/json/1-design-doc.json"],
        dest: "dist/doc-webdesign.json"
      }
    },
    // Setup credentials
    secret: mySecret,
    // Push code through SFTP to the server
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
  grunt.registerTask('build', ['clean:all', 'shell', 'copy:styleguide', 'copy:webdesign', 'rename', 'execute', 'copy:rename', 'copy:illustrations', 'clean:styleguide', 'merge-json'])
  grunt.registerTask('default', ['build']);


  // Deploy tasks
  grunt.registerTask('deploy-stage', ['build', 'sftp:stage']);
  grunt.registerTask('deploy-prod', ['build', 'sftp:prod']);

};
