/* jshint esversion:6 */
/* jshint eqnull:true */

export default function delegateMethods (srcObj, target, methodName) {

    function delegate (failIfNotAFunction, key, newKey) {

        let method = srcObj[key];

        if (!newKey) newKey = key;

        if (typeof method === 'function') {
            if (target[newKey] == null) {
                target[newKey] = method.bind(srcObj);
            } else {
                throw new Error(`delegateMethods() panic! could not override property ${newKey}`);
            }
        } else if (failIfNotAFunction) {
            throw new Error(`delegateMethods() panic! ${key} is not a function!`);
        }

    }

    if (Array.isArray(methodName)) {
        methodName.forEach(function (key) {
            delegate(true, key, key);
        });
    } else if (typeof methodName === 'string') {
        delegate(true, methodName);
    } else if (typeof methodName === 'object') {
        Object.keys(methodName).forEach(function (key) {
            delegate(true, key, methodName[key]);
        });
    } else {
        for (let key of Object.keys(srcObj)) {
            delegate(false, key);
        }
    }

}

