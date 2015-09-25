module.exports = function (config) {
    config.set({
        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'dist/libs.js',
            'svg-render.js',
            'test/spec/*.js',
            'exampleSvg.html'
        ],

        preprocessors: {
            'svg-render.js': 'coverage',
            'exampleSvg.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            moduleName: 'test.ui.templates'
        },

        coverageReporter: {
            dir: 'jstest/coverage',
            reporters: [
                {
                    type: 'html'
                },
                {
                    type: 'text'
                }
            ]
        },

        // list of files / patterns to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage'],

        htmlReporter: {
            outputDir: 'test/karma_html',
            templatePath: 'node_modules/karma-html-reporter/jasmine_template.html'
        },

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // web server port
        port: 8082,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};