'use strict';

import marked from 'marked';
import Handlebars from 'handlebars';

Handlebars.registerHelper('md', function (text) {
    return marked(text);
});

