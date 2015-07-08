module.exports = function( grunt ) {

    require( "load-grunt-tasks" )( grunt ); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({

        clean: {

            all: [
                "dist",
                ".tmp"
            ]

        },

        browserify: {
            'picimo-dev': {
                dest: 'dist/picimo.js',
                src: [
                    "src/index.js"
                ],
                options: {
                    transform: [ 'brfs' ],
                    browserifyOptions: {
                        debug: true,
                        standalone: 'Picimo'
                    }
                }
            },
            'picimo-min': {
                dest: '.tmp/picimo.js',
                src: [
                    "src/index.js"
                ],
                options: {
                    transform: [ 'brfs' ],
                    browserifyOptions: {
                        debug: false,
                        standalone: 'Picimo'
                    }
                }
            }
        },

        uglify: {
            picimo: {
                options: {
                    mangle: true
                },
                files: {
                    'dist/picimo.min.js': [ '.tmp/picimo.js' ]
                }
            }
        },

        copy: {
            jsdoc: {
                files: [
                    {
                        expand: true,
                        cwd: "assets/images/doc",
                        src: ['**/*.png', '**/*.jpg', '**/*.gif'],
                        dest: 'doc/images/'
                    }
                ]
            },
        },

        jsdoc: {
            picimo: {
                src: [
                    'src/**/*.js'
                ],
                options: {
                    destination : "doc",
                    template    : "./node_modules/jaguarjs-jsdoc",
                    configure   : "jsdoc.conf.json"
                }
            }
        },

        watch: {
            'picimo-dev': {
                files: [
                    'src/**/*'
                ],
                tasks: [ 'build:src', 'doc' ]
            }
        }

    });


    grunt.registerTask('build:src', ['browserify:picimo-dev']);
    grunt.registerTask('dist', [ 'browserify:picimo-min', 'uglify' ]);
    grunt.registerTask('doc', ['jsdoc', 'copy:jsdoc']);

    grunt.registerTask('default', [ 'build:src', 'doc', 'watch' ]);

};
