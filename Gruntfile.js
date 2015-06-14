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
            }
        },

        watch: {
            'picimo-dev': {
                files: [
                    'src/**/*'
                ],
                tasks: [ 'build:src' ]
            }
        }

    });


    grunt.registerTask('build:src', ['browserify:picimo-dev']);

    grunt.registerTask('default', [ 'build:src', 'watch' ]);

};
