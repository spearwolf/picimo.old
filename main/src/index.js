/* jshint esversion:6 */
/* global __PACKAGE_VERSION__ */
/* global DEBUG */

const VERSION = DEBUG ? __PACKAGE_VERSION__ + '-dbg' : __PACKAGE_VERSION__;

import App from './app';

import * as graph from './graph';
import * as render from './render';
import * as core from './core';

import { defineSprite, SpriteFactory } from './sprites';

export { VERSION, App, graph, render, core, defineSprite, SpriteFactory };

