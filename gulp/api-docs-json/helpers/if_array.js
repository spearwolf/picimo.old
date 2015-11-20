'use strict';

import _ from 'lodash';
import Handlebars from 'handlebars';

Handlebars.registerHelper('ifArray', function (array, options) {
    if (array && Array.isArray(array) && array.length) {
        return _.trim(options.fn(this));
    } else if (options.inverse) {
        return _.trim(options.inverse(this));
    }
});

