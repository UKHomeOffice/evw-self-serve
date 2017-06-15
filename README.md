[![Build Status](https://travis-ci.org/UKHomeOffice/evw-self-serve.svg?branch=master)](https://travis-ci.org/UKHomeOffice/evw-self-serve)
[![Dependency Status](https://david-dm.org/UKHomeOffice/evw-self-serve.svg)](https://david-dm.org/UKHomeOffice/evw-self-serve)
[![devDependency Status](https://david-dm.org/UKHomeOffice/evw-self-serve/dev-status.svg)](https://david-dm.org/UKHomeOffice/evw-self-serve#info=devDependencies)

# EVW Self serve

A tiny, HOF-based form to allow Electronic visa waiver users to update their travel details.

### Prerequisities

What things you need to install the software and how to install them
- [NodeJS](https://nodejs.org/en/)
- npm (bundled with node)
- [Redis server](http://redis.io/topics/quickstart) running on the default port

### Installing

```bash
$ redis-server &
$ npm install
$ npm run dev
```

Go to http://localhost:8080/update-journey-details

## Running the tests
You will need the server running to run the cucumber tests against.

```bash
$ node_modules/.bin/nightwatch
$ # or run in chrome and firefox in parallel 🤘🏽😝🤘🏽
$ node_modules/.bin/nightwatch  -e chrome,firefox
$ # or via npm scripts
$ npm run test:acceptance
```