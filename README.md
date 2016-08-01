# <img src="https://cdn.rawgit.com/spearwolf/picimo/master/assets/images/picimo-logo-640x248.png" alt="picimo" width="320">

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

To build this project you will require **node 5.11+**.


### Start local dev server

```sh
$ npm start
```

This will start a local http server, serves the application at
[http://localhost:8080/](http://localhost:8080/), watches for changes in and *rebuilds* all
if changes are detected.

The *api docs* can be found here: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)


### Build scripts overview

| command | description |
|-----------|-------------|
| `npm run build:dev` | build the *development* version of `picimo.js` into [`build/`](build/) |
| `npm run build:release` | build the *release* version `picimo.min.js` |
| `npm run api-docs` | generate the *api docs* into [`build/`](build/))|
| `npm run release` | build the *release* version `picimo.min.js` and the *api docs* |
| `npm run clean` | remove all *build artifacts* |
| `npm start` | start a local http server and watch for changes |


