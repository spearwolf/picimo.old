# <img src="assets/images/picimo-logo-640x248.png" alt="picimo" width="320">
> Pictures in Motion

# NEW: I started working on picimo's successor, version 2. It’s almost a full rewrite. See the new project page [https://github.com/spearwolf/picimo](https://github.com/spearwolf/picimo)

THIS REPOSITORY IS NO LONGER MAINTAINED.


---

_picimo_ is a __sprite__ engine for __javascript__ running in a modern __browser__. it is built from scratch and exclusively utilizes __webgl__ as rendering technology.

it is written in <del>pure ES5 javascript (no transpilers are used)</del> ES2016 using the [babel](https://babeljs.io/) transpiler.

it is, however, under active development and building a *fantastic* sprite engine together with an incredible *easy-and-fun-to-use* api is difficult to get correct. if you are comfortable with bleeding-edge software please try picimo and share your feedback.

*have fun!* ;-)


## Table of Contents

* [Examples](#examples)
* [Setup local dev environment](#setup-local-dev-environment)
  * [Prerequisites](#prerequisites)
  * [Start local dev server](#start-local-dev-server)
  * [Build scripts overview](#build-scripts-overview)


## Examples

Find examples of how to use this library in [`examples/`](examples/).
The [`examples/hello-world`](examples/hello-world/index.js) is a good starting point.
Find more examples in [spearwolf/picimo-examples/](//github.com/spearwolf/picimo-examples/).


## Setup local dev environment


### Prerequisites

- node **5.x** (5.11 or higher)


### Start local dev server

```sh
$ npm start
```

This will start a local http server, serves the application at
[http://localhost:8080/](http://localhost:8080/), watches for changes in and *rebuilds* all
if changes are detected.

The *api docs* can be found here: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

The *source docs* can be found here: [http://localhost:8080/esdoc](http://localhost:8080/esdoc)


### Build scripts overview

| command | description |
|-----------|-------------|
| `npm run build:dev` | build the *development* version of `picimo.js` into [`build/`](build/) |
| `npm run build:release` | build the *release* version `picimo.min.js` |
| `npm run api-docs` | generate the *api docs* into [`build/api-docs`](build/api-docs) |
| `npm run esdoc` | generate the *source docs* into [`build/esdoc`](build/esdoc) |
| `npm run release` | build the *release* version `picimo.min.js` and the *api docs* |
| `npm run clean` | remove all *build artifacts* |
| `npm start` | start a local http server and watch for changes |


