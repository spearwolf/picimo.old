'use strict';

import _ from 'lodash';

export function hasRef (root, name) {

    let ref = root.ref[name];
    if (ref) return true;

    let otherRefIds = _.flatten(_.map(Object.keys(root.ref), (refKey) => {
        let interfaces = _.map(root.ref[refKey].interfaces, "name");
        let dictionaries = _.map(root.ref[refKey].dictionaries, "name");
        let enums = _.map(root.ref[refKey].enums, "name");
        return interfaces.concat(dictionaries).concat(enums);
    }));

    return otherRefIds.indexOf(name) !== -1;

}

export function refId (name) {
    return _.kebabCase(name);
}

