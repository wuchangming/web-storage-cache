module.exports = function(grunt){

    'use strict';

    var BANNER = '/*!\n' +
                 '    web-storage-cache -- Added `expires` and `serializer` to the localStorage and sessionStorage\n' +
                 '    Version ' + grunt.file.readJSON('package.json').version + '\n' +
                 '    https://github.com/WQTeam/web-storage-cache\n' +
                 '    (c) 2013-2015 WQTeam, MIT license\n' +
                 '*/\n';

    grunt.initConfig({
        uglify: {
            files: {
                'src/web-storage-cache.min.js': ['src/web-storage-cache.js']
            },
            options: {
                banner: BANNER
            }
        },
        watch: {
            build: {
                files: ['src/*.js'],
                tasks: ['build']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('test', ['uglify']);
}
