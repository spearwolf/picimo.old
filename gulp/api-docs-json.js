'use strict';

import fs from 'fs';
import through from 'through2';
import path from 'path';
import gutil from 'gulp-util';
import Handlebars from 'handlebars';

let PluginError = gutil.PluginError;
let File = gutil.File;

// https://github.com/contra/gulp-concat/blob/master/index.js
// https://www.npmjs.com/package/gulp-pipe

registerHandlebarsHelpers();

export function apiDocsJson (opt = {}) {

    opt.templateEnc = opt.templateEnc || 'utf-8';
    opt.contentJson = opt.contentJson || 'contents.json';

    let templateLoaded = loadTemplate(opt.template, opt.templateEnc);
    let apiDocContent = {};

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

        let contents = file.contents.toString(enc);
        let context = JSON.parse(contents);

        apiDocContent[context.name] = context;

        templateLoaded.then((template) => {
            try {

                let htmlPath = path.basename(file.relative, path.extname(file.relative)) + '.html';
                let htmlFile = makeFile(htmlPath, template(context), opt.templateEnc);

                this.push(htmlFile);

                cb();

            } catch (ex) {
                console.error(ex);
            }
        });

    }

    function endStream (cb) {

        //console.log('-- endStream');

        if (opt.contentJson) {
            let outFile = makeFile(path.basename(opt.contentJson), JSON.stringify(apiDocContent, null, 2));
            this.push(outFile);
        }

        cb();

    }

    return through.obj(bufferContents, endStream);

}

function makeFile (path_, content, enc = 'utf-8') {
    let file = new File();
    file.path = path_;
    file.contents = new Buffer(content, enc);
    return file;
}

function loadTemplate (path_, enc = 'utf-8') {
    return new Promise((resolve, reject) => {
        fs.readFile(path_, enc, (err, data) => {

            //console.log('-- templateLoaded', data);

            if (err) {
                reject(err);
                return;
            }

            resolve(Handlebars.compile(data));
        });
    });
}


function registerHandlebarsHelpers () {

    Handlebars.registerHelper('ifArray', function (array, options) {
        if (array && Array.isArray(array) && array.length) {
            return options.fn(this);
        } else if (options.inverse) {
            return options.inverse(this);
        }
    });

}


//export function loadJson (path) {
    //return new Promise((resolve, reject) => {
        //fs.readFile(path, 'utf-8', (err, data) => {
            //try {
                //if (err) {
                    //reject(err);
                //} else {
                    //resolve(JSON.parse(data));
                //}
            //} catch (ex) {
                //reject(ex);
            //}
        //});
    //});
//}

