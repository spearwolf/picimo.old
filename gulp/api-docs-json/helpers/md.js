'use strict';

import marked from 'marked';
import Handlebars from 'handlebars';

Handlebars.registerHelper('md', function (text) {
    return text ? marked(text) : '<span class="TODO">TODO</span>';
});

