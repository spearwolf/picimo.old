(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.core.Resource
     * @param {Picimo.App} app
     * @param {string} dataPropAlias
     */

    function Resource ( app, dataPropAlias ) {

        /**
         * @member {Picimo.App} Picimo.core.Resource#app
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'app', app );

        /**
         * @member {number} Picimo.core.Resource#uid
         * @readonly
         */
        utils.addUid( this );

        /**
         * @member {Picimo.utils.Deferred} Picimo.core.Resource#deferred
         * @readonly
         */

        /**
         * @member {boolean} Picimo.core.Resource#ready
         */

        utils.Deferred.make( this );

        /**
         * @member {String} Picimo.core.Resource#url
         */
        this.url = null;

        /**
         * @member {Object} Picimo.core.Resource#data
         */
        this._data = null;

        if ( dataPropAlias !== undefined ) {

            Object.defineProperty( this, dataPropAlias, {

                get        : function () { return this.data; },
                set        : function ( data ) { this.data = data; },
                enumerable : true

            });

        }

    }


    /**
     * @method Picimo.core.Resource#convertData
     * @param {Object} data
     */

    Resource.prototype.convertData = function ( data ) {

        return data;

    };


    /**
     * @method Picimo.core.Resource#onData
     * @param {Object} data
     */

    Resource.prototype.onData = function ( /* data */ ) { /* override */ };


    /**
     * @method Picimo.core.Resource#load
     * @param {string} url
     * @return self
     */

    Resource.prototype.load = function ( url ) {

        var self = this;

        this.url = url;

        var req = new XMLHttpRequest();

        req.open( "GET", url, true );

        req.onreadystatechange = function () {

            if ( req.readyState !== 4 /* DONE */ ) return;

            if ( req.status >= 200 && req.status < 300 ) {

                self.data = req.responseText;

            }

        };

        req.send();

        return this;

    };


    /**
     * @method Picimo.core.Resource#getData
     * @param {function} resolve
     */

    Resource.prototype.getData = function ( resolve ) {

        this.deferred.forward( 'data', resolve );

    };



    Object.defineProperties( Resource.prototype, {

        'data': {

            get: function () { return this._data; },

            set: function ( data ) {

                if ( data ) {

                    var data_ = this.convertData( data );

                    if ( data_ ) {

                        this._data = data_;
                        this.onData( data_ );

                    }

                } else {

                    this._data = data;

                }

                this.ready = !! this._data;

            },

            enumerable: true

        }

    });


    module.exports = Resource;

})();
