'use strict';

const seleniumServer = require('selenium-server');
const phantomjs = require('phantomjs-prebuilt');
const chromedriver = require('chromedriver');

/*eslint camelcase: 0*/
const screenshotSettings = function (folderName) {
    return {
        enabled: true,
        on_failure: true,
        on_error: false,
        path: `acceptance_tests/screenshots/${folderName}`
    };
};

/*eslint camelcase: 0*/
module.exports = {
    src_folders: [require('nightwatch-cucumber')({
        featureFiles: 'acceptance_tests/features',
        stepDefinitions: 'acceptance_tests/features/step_definitions',
        htmlReport: 'acceptance_tests/reports/index.html'
    })],
    output_folder: 'acceptance_tests/reports',
    custom_commands_path: '',
    custom_assertions_path: '',
    page_objects_path: '',
    live_output: false,
    disable_colors: false,
    // test_workers: {
    //  enabled: true,
    //  workers: 'auto'
    // },

    selenium: {
        start_process: true,
        server_path: seleniumServer.path,
        log_path: '',
        host: '127.0.0.1',
        port: 4444
    },

    /*eslint camelcase: 0 no-reserved-keys: 0*/
    test_settings: {
        default: {
            launch_url: 'http://localhost',
            selenium_port: 4444,
            selenium_host: 'localhost',
            silent: true,
            screenshots: screenshotSettings('phantomjs'),
            desiredCapabilities: {
                browserName: 'phantomjs',
                javascriptEnabled: true,
                acceptSslCerts: true,
                'phantomjs.binary.path': phantomjs.path
            }
        },

        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true
            },
            selenium: {
                cli_args: {
                    'webdriver.chrome.driver': chromedriver.path
                }
            },
            screenshots: screenshotSettings('chrome')
        },

        firefox: {
            desiredCapabilities: {
                browserName: 'firefox',
                javascriptEnabled: true,
                acceptSslCerts: true
            },
            screenshots: screenshotSettings('firefox')
        }
    }
};
