/* global jQuery */
jQuery( function ( $ ) {

    "use strict";

    window.highlightPageLink = function () {};

    var stickies = [];

    $( '.page-title' ).each( function () {

        var $el = $( this );

        var $stickyEl = $( '<div>' )
            .addClass( 'page-title-sticky' )
            .hide()
            .css({
                position: 'fixed',
                top: 0,
                right: 0,
                left: 0,
                height: $el.height()
            })
            .data( 'offsetTop', this.offsetTop )
            .append( $( '<span>' ).addClass( 'sticky-sub-title' ).text( $el.text() ) )
            .append( $( '<span>' ).addClass( 'sticky-title' ).append( $el.parent().find( 'h2' ).html() ) )
            ;

        $el.after( $stickyEl );

        stickies.push( $stickyEl );

        var name = $( '.main header[data-current]' ).data( 'current' );
        //console.debug( "current", name );
        window.parent.highlightPageLink( name );

    });

    var checkStickyStates = function( showAction ) {

        stickies.forEach( function( $el ) {

            var offsetTop = $el.data( 'offsetTop' );

            if ( $( window ).scrollTop() > offsetTop ) {

                $el[ showAction ]();

            } else {

                $el.hide();

            }

        });

    };

    checkStickyStates( 'show' );

    $( window ).scroll( function () {

        checkStickyStates( 'fadeIn' );

    });

    // =================================== ====== ===  ==   =

    $( '.navigation ul.list > li.item' ).each( function () {
        
        $( 'ul.itemMembers', this ).each( function () {

            var subItems = $( 'li', this );

            if ( subItems.length === 0 ) {

                $( this ).remove();

            }

        });

        if ( $( 'ul.itemMembers', this ).length === 0 ) {

            $( this ).addClass( 'none-itemMembers' );

        } else {

            $( this ).addClass( 'has-itemMembers' );

        }

        $( 'a', this ).click( function() {

            $( this ).closest( 'ul.list' ).find( '.current' ).removeClass( 'current' );
            $( this ).closest( 'li.item' ).addClass( 'expanded current' );

        });

        $( '.folder-icon', this ).click( function () {

            $( this ).closest( 'li.item' ).toggleClass( 'expanded' );

        });

    });

    // =================================== ====== ===  ==   =

    $( '.navigation' ).each( function () {

        window.highlightPageLink = function ( name ) {

            $( '.navigation li.item.current' ).removeClass( 'current' );
            $( '.navigation li.item[data-name="' + name + '"]').addClass( 'current' );
        
        };

    });

});
