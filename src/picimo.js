/* global __PACKAGE_VERSION__ */
/* global DEBUG */
'use strict';

export { App, graph, render, utils, math, core, defineSprite, SpriteFactory } from './picimo/index';

export const VERSION = DEBUG ? __PACKAGE_VERSION__ + '-dev' : __PACKAGE_VERSION__;

