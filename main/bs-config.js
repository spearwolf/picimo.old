/* jshint node:true */
const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory() ?
            walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
};

module.exports = {
    port: 4000,
    open: false,
    notify: false,
    files: [
        "dist/**/*",
        "test/regression/**/*"
    ],
    serveStatic: [{
        "route": "/assets",
        "dir": "test/regression/assets"
    }],
    server: {
        baseDir: "test/regression",
        routes: {
            "/dist": "dist"
        }
    },
    middleware: function (req, res, next) {
        if (req.url === '/index.html' || req.url === '/') {
            res.writeHead(200, { "Content-type": "text/html" });
            let files = walkSync(path.join(__dirname, 'test/regression'));
            files = files.filter(file => file.match(/\.html$/)).map(file => file.replace(/.*test.regression\/(.*)/, '$1'));
            res.end(
                '<h1 style="font-size: 16px">generated api docs</h1>' +
                '<ul style="list-style-type:none;margin:0 0 0 1em;padding:0">' +
                  '<li><a href="dist/esdoc/index.html">/dist/esdoc/</a></li>' +
                '</ul>' +
                '<h1 style="font-size: 16px">picimo visual regression tests</h1>' +
                '<ul style="list-style-type:none;margin:0 0 0 1em;padding:0">' +
                files.map(f => `<li><a href="${f}">/${f}</a></li>`).join('\n') +
                '</ul>');
        } else {
            next();
        }
    }
};
