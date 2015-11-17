'use strict';

import marked from 'marked';
import Handlebars from 'handlebars';

let renderer = new marked.Renderer();

renderer.link = function (href, title, text) {
    console.log('LINK href=', href, 'title=', title, 'text=', text);
    return '<a href="' + href + '" alt="' + title + '" class="md-link">' + text + '</a>';
};

Handlebars.registerHelper('md', function (text) {
    return text ? marked(text, { renderer: renderer }) : '<span class="TODO">TODO</span>';
});

