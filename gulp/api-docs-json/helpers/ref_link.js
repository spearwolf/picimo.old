'use strict';

import Handlebars from 'handlebars';
import { hasRef, refId } from '../utils';

Handlebars.registerHelper('refLink', function (name, options) {

    if (!name) return;

    //console.log('NAME', name);

    var m = name.match(/^([a-zA-Z0-9._]+)<([a-zA-Z0-9._]+)>$/);
    if (m) {

        var outerName = m[1];
        var innerName = m[2];

        //console.log('INNER/OUTER', outerName, innerName);

        if (!hasRef(options.data.root, innerName)) {
            return noLink(outerName + '&lt;' + innerName + '&gt;');
        } else {
            var out = noLink(outerName + '&lt;' + asLink(innerName) + '&gt;');
            //console.log(out);
            return out;
        }

    } else {

        if (!hasRef(options.data.root, name)) {
            return noLink(name);
        } else {
            return asLink(name);
        }

    }

});

function noLink (content) {
    return '<span class="pid-idl__type-type">' + content + '</span>';
}

function asLink (name) {
    var out;
    out = '<a href="#' + refId(name) + '" class="pid-idl__type-type pid-idl__type-link">';
    out += name;
    out += '</a>';
    return out;
}

