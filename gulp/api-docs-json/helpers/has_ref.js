'use strict';

import Handlebars from 'handlebars';
import { hasRef } from '../utils';

Handlebars.registerHelper('hasRef', function (name, options) {
    if (name && hasRef(options.data.root, name)) {
        return options.fn(this).trim();
    } else if (options.inverse) {
        return options.inverse(this).trim();
    }
});

