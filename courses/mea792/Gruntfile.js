
module.exports = function(grunt) {

    // Set up baking
    grunt.initConfig( {

        bake: {

            build: {

                options: {

                    content: "baking/content.json"

                },

                files: {

                    "index.html": "baking/index.html",
                    "assignment1.html": "baking/assignment1.html",
                    "assignment2.html": "baking/assignment2.html",
                    "assignment3.html": "baking/assignment3.html",
                    "assignment4.html": "baking/assignment4.html",
                    "assignment5.html": "baking/assignment5.html",
                    "assignment6.html": "baking/assignment6.html",
                    "assignment7.html": "baking/assignment7.html",
                    "assignment8.html": "baking/assignment8.html",
                    "project.html": "baking/project.html"

                }

            }

        }

    });

    // Load baker
    grunt.loadNpmTasks( 'grunt-bake' );

    // Set baking to default task
    grunt.registerTask( 'default', ['bake'] );

};

