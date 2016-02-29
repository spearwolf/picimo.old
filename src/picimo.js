/* global __PACKAGE_VERSION__ */
/* global DEBUG */
'use strict';

export { App, graph, webgl, utils, math, core, sprites } from './picimo/index';

export const VERSION = DEBUG ? __PACKAGE_VERSION__ + '-dev' : __PACKAGE_VERSION__;

