import assert from 'assert';

export function assertProperties(vo, props) {
    Object.keys(props).forEach(type => {
        props[type].forEach(name => {
            assert.equal(typeof vo[name], type, name);
        });
    });
}

export function assertVOAttrDescriptor(descriptor, names, size, offset, uniform, attrNames) {
    const name = Array.isArray(names) ? names[0] : names;
    const alias = Array.isArray(names) ? names[1] : names;
    assert(descriptor.hasAttribute(name, size), `descriptor.hasAttribute("${name}", ${size})`);
    const attr = descriptor.attr[name];
    assert(attr, `descriptor.attr.${name}`);
    assert.equal(attr.name, alias, '.name');
    assert.equal(attr.size, size, '.size');
    assert.equal(attr.offset, offset, '.offset');
    assert.equal(attr.uniform, uniform, '.uniform');
    if (attrNames) {
        assert.deepEqual(attr.attrNames, attrNames, '.attrNames');
    } else {
        assert(attr.attrNames === undefined, '.attrNames');
    }
}

