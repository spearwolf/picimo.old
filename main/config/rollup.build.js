import rollup from './rollup';

const format = process.env.FORMAT || 'umd';
const sourceMap = process.env.SOURCE_MAP === 'inline' ? 'inline' : process.env.SOURCE_MAP === 'true';
const debug = process.env.DEBUG === 'true';
const uglify = process.env.UGLIFY === 'true';
const dest = process.env.OUTFILE;

export default rollup({
    format,
    sourceMap,
    debug,
    uglify,
    dest
});

