'use strict';

import Handlebars from 'handlebars';
import { refId } from '../utils';

Handlebars.registerHelper('refId', function (name) {
    var id = refId(name);
    //console.log('REF-ID', name, id);
    return id;
});

