import eventize from '@spearwolf/eventize';
import * as utils from '../utils';

/**
 * @desc
 *   A generic resource which has a ready state and loads data from an url.
 *
 *   The resource will load the data immediately after you set the url. The incoming data object can be transformed
 *   by subscribing to the `incomingData` event. When data is successfully loaded and transformed the `data`
 *   event will be emitted.
 */
export default class Resource {

    /**
     * @param {App} app - the app instance
     * @param {string} [dataPropAlias] - name alias of the data property
     */
    constructor (app, dataPropAlias) {

        eventize(this);

        utils.object.definePropertyPublicRO(this, 'app', app);
        utils.addUid(this);
        utils.makeReadyPromise(this);

        /**
         * @type {boolean}
         */
        this.ready = false;

        /**
         * @type {string}
         */
        this.url = null;

        /**
         * @type {Object}
         */
        this._data = null;

        if (dataPropAlias) {

            Object.defineProperty(this, dataPropAlias, {

                get        : function () { return this.data; },
                set        : function ( data ) { this.data = data; },
                enumerable : true

            });

        }

    } // => constructor

    /**
     * Load the resource and set the Resource#data property to the content.
     *
     * @param {!string} url - the resource url
     * @return {Resource} self
     */
    load (url) {

        this.url = this.app.getAssetUrl(url);

        let req = new XMLHttpRequest();
        req.open("GET", this.url, true);

        req.onreadystatechange = () => {

            if (req.readyState !== 4 /* DONE */) return;

            if (req.status >= 200 && req.status < 300) {

                this.data = req.responseText;

            }

        };

        req.send();

        return this;

    }

    get data () {
        return this._data;
    }

    set data (incomingData) {

        if (incomingData) {

            let transformedData = this.emitReduce('incomingData', incomingData);

            if (transformedData) {

                this._data = transformedData;
                this.emit('data', transformedData);

            }

        } else {

            this._data = incomingData;

        }

        this.ready = !! this._data; // => trigger the ready promise

    }

} // => class Resource

