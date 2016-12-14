'use strict';

const regExpAbsHttpUrl = new RegExp( '^(https?:)?//', 'i' );
const regExpAbsUrlPath = new RegExp( '^(https?:)?/', 'i' );
const regExpUrlDir     = new RegExp( '^(.*/)[^/]+$', 'i' );


//------------------------------------------
// getUrlDir( url )
//---------------------------------------

export function getUrlDir ( url ) {

    if (url[url.length - 1] === '/') return url;
    return regExpUrlDir.exec(url)[1];

}

//------------------------------------------
// getAssetUrl( url )
//---------------------------------------

export function getAssetUrl ( url ) {

    var assetUrl;

    if ( this.assetBaseUrl === undefined ) {

        assetUrl = url;

    } else {

        if ( regExpAbsHttpUrl.test( url ) ) {

            if ( url[ 0 ] === '/' && this.assetBaseUrl[ this.assetBaseUrl.length - 1 ] === '/' ) {

                assetUrl = this.assetBaseUrl + url.substr( 1 );

            } else {

                assetUrl = this.assetBaseUrl + url;

            }

        } else {

            assetUrl = url;

        }

    }

    return assetUrl;

}

//------------------------------------------
// joinAssetUrl( baseUrl, url )
//---------------------------------------

export function joinAssetUrl ( baseUrl, url ) {

    if ( regExpAbsUrlPath.test( url ) ) {

        return url;

    }

    return this.getAssetUrl( getUrlDir( baseUrl ? baseUrl : this.assetBaseUrl ) + url );

}

