'use strict';

const seleniumServer = require('selenium-server');
const phantomjs = require('phantomjs-prebuilt');
const chromedriver = require('chromedriver');

// assign a port number between 4-5k
const testUrl = process.env.TEST_URL || 'http://localhost';
const port = process.env.SELENIUM_PORT || Math.floor(Math.random() * (5000 - 4000) + 4000);
const host = process.env.SELENIUM_HOST || 'localhost';


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
        start_process: host === 'localhost' ? true : false,
        server_path: seleniumServer.path,
        log_path: '',
        host: host,
        port: port
    },

    /*eslint camelcase: 0 no-reserved-keys: 0*/
    test_settings: {
        default: {
            launch_url: testUrl,
            selenium_port: port,
            selenium_host: host,
            silent: true,
            screenshots: screenshotSettings('phantomjs'),
            desiredCapabilities: {
                browserName: 'phantomjs',
                javascriptEnabled: true,
                acceptSslCerts: true,
                'phantomjs.cli.args': ['--ignore-ssl-errors=true'],
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
