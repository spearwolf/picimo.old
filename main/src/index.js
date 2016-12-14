/* global __PACKAGE_VERSION__ */
/* global DEBUG */

const VERSION = DEBUG ? __PACKAGE_VERSION__ + '-dbg' : __PACKAGE_VERSION__;

import App from './app';

import * as graph from './graph';
import * as render from './render';
import * as utils from './utils';
import * as math from './math';
import * as core from './core';

import { defineSprite, SpriteFactory } from './sprites';

export { VERSION, App, graph, render, utils, math, core, defineSprite, SpriteFactory };

