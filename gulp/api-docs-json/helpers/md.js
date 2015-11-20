'use strict';

import _ from 'lodash';
import marked from 'marked';
import Handlebars from 'handlebars';
import { hasRef, refId } from '../utils';

let renderer = new marked.Renderer();
let apiDocContext = null;

export function configure (ctx) {
    apiDocContext = ctx;
}

renderer.link = function (href, title, text) {
    let classNames = ['md__link'];
    if (hasRef(apiDocContext, text)) {
        href = '#' + refId(text);
        classNames.push('md__link--type');
    }
    if (!title) title = text;
    //console.log('LINK href=', href, 'title=', title, 'text=', text);
    return '<a href="' + href + '" alt="' + title + '" class="' + classNames.join(' ') + '">' + text + '</a>';
};

Handlebars.registerHelper('md', function (text) {
    return _.trim(text ? marked(text, { renderer: renderer }) : '<span class="TODO">TODO</span>');
});

