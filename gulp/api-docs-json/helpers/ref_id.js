'use strict';

import _ from 'lodash';
import Handlebars from 'handlebars';

Handlebars.registerHelper('refId', function (name) {
    //var id = _.capitalize(_.camelCase(name));
    var id = _.kebabCase(name);
    //console.log('REF-ID', name, id);
    return id;
});

