'use strict';

import Handlebars from 'handlebars';

Handlebars.registerHelper('ref', function (name, options) {
    //console.log('REF', name, options);
    return options.fn(options.data.root.ref[name]);
});

