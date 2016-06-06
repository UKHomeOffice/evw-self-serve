# EVW Self serve

It's the hof example form, but not as we know it

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
$ cd acceptance_tests
$ ../node_modules/.bin/nightwatch
$ # or run in chrome and firefox in parallel 🤘🏽😝🤘🏽
$ ../node_modules/.bin/nightwatch -e chrome,firefox
```