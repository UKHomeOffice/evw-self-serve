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
$ bundle install
$ cucumber -r features
```

You will need phantomjs installed to run tests. Alternatively you can export IN_BROWSER=true to run the tests in firefox.
