
module.exports = function( grunt ) {

    // Set up baking
    grunt.initConfig( {

        bake: {

            build: {

                options: {

                    content: "baking/content.json"

                },

                files: {

                    "index.html": "baking/index.html",
                    "adcirc.html": "baking/adcirc.html"

                }

            }

        },

        watch: {

            html: {

                files: [ 'baking/*.html' ],
                tasks: [ 'bake' ]

            }

        }

    });

    // Load baker
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-bake' );

    // Set baking as default task
    grunt.registerTask( 'default', ['bake'] );

};