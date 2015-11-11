'use strict';

import _ from 'lodash';
import Handlebars from 'handlebars';

Handlebars.registerHelper('hasRef', function (name, options) {
    if (name && hasRef(options.data.root, name)) {
        return options.fn(this).trim();
    } else if (options.inverse) {
        return options.inverse(this).trim();
    }
});

function hasRef (root, name) {

    let ref = root.ref[name];
    if (ref) return true;

    let otherRefIds = _.flatten(_.map(Object.keys(root.ref), (refKey) => {
        let interfaces = _.map(root.ref[refKey].interfaces, "name");
        let dictionaries = _.map(root.ref[refKey].dictionaries, "name");
        return interfaces.concat(dictionaries);
    }));

    return otherRefIds.indexOf(name) !== -1;

}
