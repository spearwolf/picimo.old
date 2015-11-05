'use strict';

import Handlebars from 'handlebars';

Handlebars.registerHelper('ifArray', function (array, options) {
    if (array && Array.isArray(array) && array.length) {
        return options.fn(this);
    } else if (options.inverse) {
        return options.inverse(this);
    }
});

