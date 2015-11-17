'use strict';

import _ from 'lodash';
import fs from 'fs';
import through from 'through2';
import path from 'path';
import gutil from 'gulp-util';
import Handlebars from 'handlebars';
import glob from 'glob';
import yamlFront from 'yaml-front-matter';
import marked from 'marked';
//import highlightJs from 'highlight.js';
import yaml from 'js-yaml';

let PluginError = gutil.PluginError;
let File = gutil.File;

// pre-load all handlebars helpers
(function () {
    let helpersPath = path.join(__dirname, path.basename(__filename, path.extname(__filename, '.js')), 'helpers');
    glob(helpersPath + '/*.js', function (err, files) {
        files.forEach(function (helperFile) {
            require(helperFile);
        });
    });
})();


// https://github.com/contra/gulp-concat/blob/master/index.js
// https://www.npmjs.com/package/gulp-pipe

export function apiDocsJson (opt = {}) {

    opt.template    = opt.template || 'index.html';
    opt.templateEnc = opt.templateEnc || 'utf-8';
    opt.contentJson = opt.contentJson || 'contents.json';
    // opt.partials

    let templateLoaded = loadTemplate(opt.template, opt.templateEnc);
    let apiDocContent = { ref: {} };

    function bufferContents (file, enc, cb) {

        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        // we don't do streams (yet)
        if (file.isStream()) {
            this.emit('error', new PluginError('apiDocsJson',  'Streaming not supported'));
            cb();
            return;
        }

        let fileExt = path.extname(file.relative);

        if (fileExt === '.md') {

            // ============ markdown *.md ============= //

            let context = yamlFront.loadFront(file.contents);

            context.fileBaseName = path.basename(file.relative, path.extname(file.relative));
            if (!context.name) context.name = _.kebabCase(context.fileBaseName);
            if (!context.type) context.type = 'topic';

            context.html = marked(context.__content);  // TODO highlight.js?
            delete context.__content;

            addTo(apiDocContent, context);

            cb();

        } else {

            // ============ json *.json ============= //

            parseApiDocFile(file, enc).then(function (context) {

                apiDocContent.ref[context.name] = context;

                if (context.type) {
                    if (!apiDocContent[context.type]) apiDocContent[context.type] = [];
                    apiDocContent[context.type].push(context.name);
                    apiDocContent[context.type].sort();
                }

                cb();

            });

        }

    }

    function parseApiDocFile (file, enc) {
        return new Promise((resolve, reject) => {

            let contents = file.contents.toString(enc);
            let fileExt = path.extname(file.relative);

            if (fileExt === '.json') {
                resolve(JSON.parse(contents));
            } else if (fileExt === '.yaml') {
                yaml.safeLoadAll(contents, function (doc) {
                    //console.log('YAML', JSON.stringify(doc, null, 2));
                    resolve(doc);
                });
            } else {
                reject('File extension ' + fileExt + ' is not supported!');
            }
        });
    }

    function endStream (cb) {

        if (opt.contentJson) {
            let outFile = makeFile(path.basename(opt.contentJson), JSON.stringify(apiDocContent, null, 2));
            this.push(outFile);
        }

        registerHbsPartialsFromDirectory(opt.partials, opt.templateEnc).then(() => {
            templateLoaded.then((template) => {
                try {

                    let htmlBody = template(apiDocContent);
                    let htmlPath = path.basename(opt.template, path.extname(opt.template)) + '.html';
                    let htmlFile = makeFile(htmlPath, htmlBody, opt.templateEnc);

                    this.push(htmlFile);

                    cb();

                } catch (ex) {
                    console.error(ex);
                }
            });
        })
    }

    return through.obj(bufferContents, endStream);

}

function addTo (apiDocContent, context) {
    apiDocContent.ref[context.name] = context;

    if (context.type) {
        if (!apiDocContent[context.type]) apiDocContent[context.type] = [];
        apiDocContent[context.type].push(context.name);
        apiDocContent[context.type].sort();
    }
}

function makeFile (path_, content, enc = 'utf-8') {
    let file = new File();
    file.path = path_;
    file.contents = new Buffer(content, enc);
    return file;
}

function loadTemplate (path_, enc = 'utf-8') {
    return loadFile(path_, enc).then((content) => Handlebars.compile(content));
}

function loadFile (path_, enc = 'utf-8') {
    return new Promise((resolve, reject) => {
        fs.readFile(path_, enc, (err, data) => {

            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
}

function registerHbsPartialsFromDirectory (dirPath, enc = 'utf-8') {
    return new Promise(function (resolve, reject) {
        glob(dirPath + '/*.html', function (err, files) {
            if (err) reject(err);
            resolve(Promise.all(files.map((file) => {
                return loadFile(file, enc).then((partialBody) => {
                    let name = path.basename(file, path.extname(file));
                    Handlebars.registerPartial(name, partialBody);
                });
            })));
        });
    });
}

