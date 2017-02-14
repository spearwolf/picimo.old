/* jshint esversion:6 */
/* global __PACKAGE_VERSION__ */
/* global DEBUG */

const VERSION = DEBUG ? __PACKAGE_VERSION__ + '-dbg' : __PACKAGE_VERSION__;

import App from './app';

import { defineSprite, SpriteFactory } from './sprites';

export {
    VERSION,
    App,
    defineSprite,
    SpriteFactory
};

