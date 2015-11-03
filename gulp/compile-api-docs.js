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
//


export function apiDocsJson (opt = {}) {

    opt.templateEnc = opt.templateEnc || 'utf-8';
    opt.apiDocContentJson = opt.apiDocContentJson || 'contents.json';

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

                let html = template(context);

                let outFile = new File();
                outFile.path = path.basename(file.relative, path.extname(file.relative)) + '.html';
                outFile.contents = new Buffer(html, opt.templateEnc);
                this.push(outFile);

                cb();

            } catch (ex) {
                console.error(ex);
            }

        });

    }

    function endStream (cb) {

        //console.log('-- endStream');

        if (opt.apiDocContentJson) {
            let outFile = new File();
            outFile.path = path.basename(opt.apiDocContentJson);
            outFile.contents = new Buffer(JSON.stringify(apiDocContent, null, 4), 'utf-8');
            this.push(outFile);
        }

        cb();

    }

    return through.obj(bufferContents, endStream);

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

