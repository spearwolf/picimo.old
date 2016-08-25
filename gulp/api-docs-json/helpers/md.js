'use strict';

import _ from 'lodash';
import Handlebars from 'handlebars';
import markedRenderer from '../marked_renderer';

let apiDocContext = null;

export function configure (ctx) {
    apiDocContext = ctx;
}

Handlebars.registerHelper('md', function (text) {
    //return _.trim(text ? markedRenderer(apiDocContext, text) : '<span class="TODO">TODO</span>');
    return _.trim(markedRenderer(apiDocContext, text ? text : '*TODO description*'));
});

