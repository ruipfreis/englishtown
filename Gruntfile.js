'use strict';

module.exports = function (grunt) {

  //var connect = require('connect');
  var serveStatic = require('serve-static');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || '.',
    dist: 'dist'
  };

  grunt.initConfig({

    appConfig: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= appConfig.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      sass: {
        files: ['<%= appConfig.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= appConfig.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= appConfig.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: 'localhost',
        hostname: '0.0.0.0',
        livereload: 34729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/fonts',
                serveStatic('./fonts')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= appConfig.app %>/scripts/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= appConfig.dist %>/{,*/}*',
            '!<%= appConfig.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= appConfig.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= appConfig.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Grunt-sass
    sass: {
      server: {
        // Takes every file that ends with .scss from the scss
        // directory and compile them into the css directory.
        // Also changes the extension from .scss into .css.
        // Note: file name that begins with _ are ignored automatically
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/styles',
          src: ['*.scss', '*.sass'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      dist: {
        // Takes every file that ends with .scss from the scss
        // directory and compile them into the css directory.
        // Also changes the extension from .scss into .css.
        // Note: file name that begins with _ are ignored automatically
        files: [{
          expand: true,
          cwd: '<%= appConfig.app %>/styles',
          src: ['*.scss', '*.sass'],
          dest: '<%= appConfig.dist %>/styles',
          ext: '.css'
        }]
      },
      options: {
        sourceMap: false,
        outputStyle: 'nested',
        imagePath: "<%= appConfig.app %>/images",
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= appConfig.app %>',
          dest: '<%= appConfig.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: 'images',
          dest: '<%= appConfig.dist %>/images',
          src: ['*']
        },{
          expand: true,
          cwd: '.',
          dest: '<%= appConfig.dist %>',
          src: ['data/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= appConfig.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass:server'
      ],
      test: [
        'sass'
      ],
      dist: [
        'sass:dist'
      ]
    }
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function () {
    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'concurrent:dist',
    'autoprefixer',
    'copy:dist'
  ]);
};