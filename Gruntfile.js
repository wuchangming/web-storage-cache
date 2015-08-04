module.exports = function(grunt){

    'use strict';

    var BANNER = '/*!\n' +
                 '    web-storage-cache -- Added `expires` and `serializer` to the localStorage and sessionStorage\n' +
                 '    Version ' + grunt.file.readJSON('package.json').version + '\n' +
                 '    https://github.com/WQTeam/web-storage-cache\n' +
                 '    (c) 2013-2015 WQTeam, MIT license\n' +
                 '*/\n';

    grunt.initConfig({
        jshint: {
            files: ['src/web-storage-cache.js']
        },
        uglify: {
            build: {
                src: 'src/web-storage-cache.js',
                dest: 'src/web-storage-cache.min.js'
            },
            options: {
                banner: BANNER
            }
        },
        watch: {
            files: ['src/*.js'],
            tasks: ['test']
        },
        mocha: {
            test: {
                src: ['test/**/*.html']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-mocha');

    grunt.registerTask('build', ['uglify']);

    grunt.registerTask('test', ['jshint', 'build', 'mocha']);
}
