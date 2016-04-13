'use strict';

import marked from 'marked';
import { hasRef, refId } from './utils';

const glob = require('glob');
const path = require('path');

export default function (apiDocContext, markdownText) {

    let renderer = new marked.Renderer();

    renderer.image = function (href_, title, text) {
        let href = assetPath(href_, 'fs');
        let srcset = srcsetValue(href);
        //console.log('srcset=', srcset);
        return `<img src="${assetPath(href, 'web')}" srcset="${srcset}" alt="${text}">`;
    }

    function srcsetValue (href) {

        let pattern = srcsetImagePattern(href);
        let files = [href].concat(glob.sync(pattern)).map(function (filename) {
            let m = filename.match(/.*@([0-9])x/);
            let ratio = m ? m[1] : '1';
            let asset = assetPath(filename, 'web').replace(/ /g, '%20');
            return `${asset} ${ratio}x`;
        });
        //console.log('files=', files);

        return files.join(', ');

    }

    function srcsetImagePattern (href) {
        let ext = path.extname(href);
        let base = href.substr(0, href.length - ext.length);
        let pattern = `${base}?[0-9]x${ext}`;
        //console.log('image ext=', ext, 'base=', base, 'pattern=', pattern, 'src=', href);
        return pattern;
    }

    function assetPath (path_, target) {
        let filepath = path_;
        Object.keys(apiDocContext.assetDirs[target]).forEach(function (prefix) {
            if (path_.indexOf(prefix) === 0) {
                filepath = filepath.replace(prefix, apiDocContext.assetDirs[target][prefix]);
            }
        });
        return filepath;
    }

    renderer.link = function (href, title, text) {
        let classNames = ['md__link'];
        if (hasRef(apiDocContext, text)) {
            href = '#' + refId(text);
            classNames.push('md__link--type');
        }
        if (!title) title = text;
        //console.log('LINK href=', href, 'title=', title, 'text=', text);
        return '<a href="' + href + '" alt="' + title + '" class="' + classNames.join(' ') + '">' + text + '</a>';
    };

    return marked(markdownText, { renderer: renderer });

}

