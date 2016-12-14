import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const packageJson = require('../package.json');
const babelConfig = (() => {
    try {
        return require(`./babel.${process.env.TARGET}.json`);
    } catch (ex) {
        return null;
    }
})();

export default function (config) {
    let plugins = [
        json(),
        nodeResolve({
            extensions: [ '.js', '.json' ]
        }),
        commonjs({
            include: 'node_modules/**',
            sourceMap: !!config.sourceMap
        }),
        replace({
            DEBUG: config.debug,
            __PACKAGE_NAME__: JSON.stringify(packageJson.name),
            __PACKAGE_VERSION__: JSON.stringify(packageJson.version),
        }),
    ];
    if (babelConfig) {
        plugins.push(babel(Object.assign({
            exclude: 'node_modules/**'
        }, babelConfig)));
    }
    if (config.uglify) {
        plugins.push(uglify());
    }
    return {
        entry: 'src/index.js',
        moduleName: 'Picimo',
        format: config.format,
        sourceMap: config.sourceMap,
        sourceMapFile: `${config.dest}.map`,
        dest: config.dest,
        plugins
    }
}
