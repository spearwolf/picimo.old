(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Picimo = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright (c) 2008-2013, Andrew Brehaut, Tim Baumann, Matt Wilson, 
//                          Simon Heimler, Michel Vielmetter 
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

// color.js - version 1.0.1
//
// HSV <-> RGB code based on code from http://www.cs.rit.edu/~ncs/color/t_convert.html
// object function created by Douglas Crockford.
// Color scheme degrees taken from the colorjack.com colorpicker
//
// HSL support kindly provided by Tim Baumann - http://github.com/timjb

// create namespaces
/*global net */
if ("undefined" == typeof net) { var net = {}; }
if (!net.brehaut) { net.brehaut = {}; }

// this module function is called with net.brehaut as 'this'
(function ( ) {
  "use strict";
  // Constants

  // css_colors maps color names onto their hex values
  // these names are defined by W3C
  var css_colors = {aliceblue:'#F0F8FF',antiquewhite:'#FAEBD7',aqua:'#00FFFF',aquamarine:'#7FFFD4',azure:'#F0FFFF',beige:'#F5F5DC',bisque:'#FFE4C4',black:'#000000',blanchedalmond:'#FFEBCD',blue:'#0000FF',blueviolet:'#8A2BE2',brown:'#A52A2A',burlywood:'#DEB887',cadetblue:'#5F9EA0',chartreuse:'#7FFF00',chocolate:'#D2691E',coral:'#FF7F50',cornflowerblue:'#6495ED',cornsilk:'#FFF8DC',crimson:'#DC143C',cyan:'#00FFFF',darkblue:'#00008B',darkcyan:'#008B8B',darkgoldenrod:'#B8860B',darkgray:'#A9A9A9',darkgrey:'#A9A9A9',darkgreen:'#006400',darkkhaki:'#BDB76B',darkmagenta:'#8B008B',darkolivegreen:'#556B2F',darkorange:'#FF8C00',darkorchid:'#9932CC',darkred:'#8B0000',darksalmon:'#E9967A',darkseagreen:'#8FBC8F',darkslateblue:'#483D8B',darkslategray:'#2F4F4F',darkslategrey:'#2F4F4F',darkturquoise:'#00CED1',darkviolet:'#9400D3',deeppink:'#FF1493',deepskyblue:'#00BFFF',dimgray:'#696969',dimgrey:'#696969',dodgerblue:'#1E90FF',firebrick:'#B22222',floralwhite:'#FFFAF0',forestgreen:'#228B22',fuchsia:'#FF00FF',gainsboro:'#DCDCDC',ghostwhite:'#F8F8FF',gold:'#FFD700',goldenrod:'#DAA520',gray:'#808080',grey:'#808080',green:'#008000',greenyellow:'#ADFF2F',honeydew:'#F0FFF0',hotpink:'#FF69B4',indianred:'#CD5C5C',indigo:'#4B0082',ivory:'#FFFFF0',khaki:'#F0E68C',lavender:'#E6E6FA',lavenderblush:'#FFF0F5',lawngreen:'#7CFC00',lemonchiffon:'#FFFACD',lightblue:'#ADD8E6',lightcoral:'#F08080',lightcyan:'#E0FFFF',lightgoldenrodyellow:'#FAFAD2',lightgray:'#D3D3D3',lightgrey:'#D3D3D3',lightgreen:'#90EE90',lightpink:'#FFB6C1',lightsalmon:'#FFA07A',lightseagreen:'#20B2AA',lightskyblue:'#87CEFA',lightslategray:'#778899',lightslategrey:'#778899',lightsteelblue:'#B0C4DE',lightyellow:'#FFFFE0',lime:'#00FF00',limegreen:'#32CD32',linen:'#FAF0E6',magenta:'#FF00FF',maroon:'#800000',mediumaquamarine:'#66CDAA',mediumblue:'#0000CD',mediumorchid:'#BA55D3',mediumpurple:'#9370D8',mediumseagreen:'#3CB371',mediumslateblue:'#7B68EE',mediumspringgreen:'#00FA9A',mediumturquoise:'#48D1CC',mediumvioletred:'#C71585',midnightblue:'#191970',mintcream:'#F5FFFA',mistyrose:'#FFE4E1',moccasin:'#FFE4B5',navajowhite:'#FFDEAD',navy:'#000080',oldlace:'#FDF5E6',olive:'#808000',olivedrab:'#6B8E23',orange:'#FFA500',orangered:'#FF4500',orchid:'#DA70D6',palegoldenrod:'#EEE8AA',palegreen:'#98FB98',paleturquoise:'#AFEEEE',palevioletred:'#D87093',papayawhip:'#FFEFD5',peachpuff:'#FFDAB9',peru:'#CD853F',pink:'#FFC0CB',plum:'#DDA0DD',powderblue:'#B0E0E6',purple:'#800080',rebeccapurple:'#663399',red:'#FF0000',rosybrown:'#BC8F8F',royalblue:'#4169E1',saddlebrown:'#8B4513',salmon:'#FA8072',sandybrown:'#F4A460',seagreen:'#2E8B57',seashell:'#FFF5EE',sienna:'#A0522D',silver:'#C0C0C0',skyblue:'#87CEEB',slateblue:'#6A5ACD',slategray:'#708090',slategrey:'#708090',snow:'#FFFAFA',springgreen:'#00FF7F',steelblue:'#4682B4',tan:'#D2B48C',teal:'#008080',thistle:'#D8BFD8',tomato:'#FF6347',turquoise:'#40E0D0',violet:'#EE82EE',wheat:'#F5DEB3',white:'#FFFFFF',whitesmoke:'#F5F5F5',yellow:'#FFFF00',yellowgreen:'#9ACD32'};

  // CSS value regexes, according to http://www.w3.org/TR/css3-values/
  var css_integer = '(?:\\+|-)?\\d+';
  var css_float = '(?:\\+|-)?\\d*\\.\\d+';
  var css_number = '(?:' + css_integer + ')|(?:' + css_float + ')';
  css_integer = '(' + css_integer + ')';
  css_float = '(' + css_float + ')';
  css_number = '(' + css_number + ')';
  var css_percentage = css_number + '%';
  var css_whitespace = '\\s*?';

  // http://www.w3.org/TR/2003/CR-css3-color-20030514/
  var hsl_hsla_regex = new RegExp([
    '^hsl(a?)\\(', css_number, ',', css_percentage, ',', css_percentage, '(,(', css_number, '))?\\)$'
  ].join(css_whitespace) );
  var rgb_rgba_integer_regex = new RegExp([
    '^rgb(a?)\\(', css_integer, ',', css_integer, ',', css_integer, '(,(', css_number, '))?\\)$'
  ].join(css_whitespace) );
  var rgb_rgba_percentage_regex = new RegExp([
    '^rgb(a?)\\(', css_percentage, ',', css_percentage, ',', css_percentage, '(,(', css_number, '))?\\)$'
  ].join(css_whitespace) );

  // Package wide variables

  // becomes the top level prototype object
  var color;

  /* registered_models contains the template objects for all the
   * models that have been registered for the color class.
   */
  var registered_models = [];


  /* factories contains methods to create new instance of
   * different color models that have been registered.
   */
  var factories = {};

  // Utility functions

  /* object is Douglas Crockfords object function for prototypal
   * inheritance.
   */
  if (!this.object) {
    this.object = function (o) {
      function F () { }
      F.prototype = o;
      return new F();
    };
  }
  var object = this.object;

  /* takes a value, converts to string if need be, then pads it
   * to a minimum length.
   */
  function pad ( val, len ) {
    val = val.toString();
    var padded = [];

    for (var i = 0, j = Math.max( len - val.length, 0); i < j; i++) {
      padded.push('0');
    }

    padded.push(val);
    return padded.join('');
  }


  /* takes a string and returns a new string with the first letter
   * capitalised
   */
  function capitalise ( s ) {
    return s.slice(0,1).toUpperCase() + s.slice(1);
  }

  /* removes leading and trailing whitespace
   */
  function trim ( str ) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  /* used to apply a method to object non-destructively by
   * cloning the object and then apply the method to that
   * new object
   */
  function cloneOnApply( meth ) {
    return function ( ) {
      var cloned = this.clone();
      meth.apply(cloned, arguments);
      return cloned;
    };
  }


  /* registerModel is used to add additional representations
   * to the color code, and extend the color API with the new
   * operation that model provides. see before for examples
   */
  function registerModel( name, model ) {
    var proto = object(color);
    var fields = []; // used for cloning and generating accessors

    var to_meth = 'to'+ capitalise(name);

    function convertAndApply( meth ) {
      return function ( ) {
        return meth.apply(this[to_meth](), arguments);
      };
    }

    for (var key in model) if (model.hasOwnProperty(key)) {
      proto[key] = model[key];
      var prop = proto[key];

      if (key.slice(0,1) == '_') { continue; }
      if (!(key in color) && "function" == typeof prop) {
        // the method found on this object is a) public and b) not
        // currently supported by the color object. Create an impl that
        // calls the toModel function and passes that new object
        // onto the correct method with the args.
        color[key] = convertAndApply(prop);
      }
      else if ("function" != typeof prop) {
        // we have found a public property. create accessor methods
        // and bind them up correctly
        fields.push(key);
        var getter = 'get'+capitalise(key);
        var setter = 'set'+capitalise(key);

        color[getter] = convertAndApply(
          proto[getter] = (function ( key ) {
            return function ( ) {
              return this[key];
            };
          })( key )
        );

        color[setter] = convertAndApply(
          proto[setter] = (function ( key ) {
            return function ( val ) {
              var cloned = this.clone();
              cloned[key] = val;
              return cloned;
            };
          })( key )
        );
      }
    } // end of for over model

    // a method to create a new object - largely so prototype chains dont
    // get insane. This uses an unrolled 'object' so that F is cached
    // for later use. this is approx a 25% speed improvement
    function F () { }
    F.prototype = proto;
    function factory ( ) {
      return new F();
    }
    factories[name] = factory;

    proto.clone = function () {
      var cloned = factory();
      for (var i = 0, j = fields.length; i < j; i++) {
        var key = fields[i];
        cloned[key] = this[key];
      }
      return cloned;
    };

    color[to_meth] = function ( ) {
      return factory();
    };

    registered_models.push(proto);

    return proto;
  }// end of registerModel

  // Template Objects

  /* color is the root object in the color hierarchy. It starts
   * life as a very simple object, but as color models are
   * registered it has methods programmatically added to manage
   * conversions as needed.
   */
  color = {
    /* fromObject takes an argument and delegates to the internal
     * color models to try to create a new instance.
     */
    fromObject: function ( o ) {
      if (!o) {
        return object(color);
      }

      for (var i = 0, j = registered_models.length; i < j; i++) {
        var nu = registered_models[i].fromObject(o);
        if (nu) {
          return nu;
        }
      }

      return object(color);
    },

    toString: function ( ) {
      return this.toCSS();
    }
  };

  var transparent = null; // defined with an RGB later.

  /* RGB is the red green blue model. This definition is converted
   * to a template object by registerModel.
   */
  registerModel('RGB', {
    red:    0,
    green:  0,
    blue:   0,
    alpha:  0,

    /* getLuminance returns a value between 0 and 1, this is the
     * luminance calcuated according to
     * http://www.poynton.com/notes/colour_and_gamma/ColorFAQ.html#RTFToC9
     */
    getLuminance: function ( ) {
      return (this.red * 0.2126) + (this.green * 0.7152) + (this.blue * 0.0722);
    },

    /* does an alpha based blend of color onto this. alpha is the
     * amount of 'color' to use. (0 to 1)
     */
    blend: function ( color , alpha ) {
      color = color.toRGB();
      alpha = Math.min(Math.max(alpha, 0), 1);
      var rgb = this.clone();     

      rgb.red = (rgb.red * (1 - alpha)) + (color.red * alpha);
      rgb.green = (rgb.green * (1 - alpha)) + (color.green * alpha);
      rgb.blue = (rgb.blue * (1 - alpha)) + (color.blue * alpha);
      rgb.alpha = (rgb.alpha * (1 - alpha)) + (color.alpha * alpha);

      return rgb;
    },

    /* fromObject attempts to convert an object o to and RGB
     * instance. This accepts an object with red, green and blue
     * members or a string. If the string is a known CSS color name
     * or a hexdecimal string it will accept it.
     */
    fromObject: function ( o ) {
      if (o instanceof Array) {
        return this._fromRGBArray ( o );
      }
      if ("string" == typeof o) {
        return this._fromCSS( trim( o ) );
      }
      if (o.hasOwnProperty('red') &&
          o.hasOwnProperty('green') &&
          o.hasOwnProperty('blue')) {
        return this._fromRGB ( o );
      }
      // nothing matchs, not an RGB object
    },

    _stringParsers: [
        // CSS RGB(A) literal:
        function ( css ) {
          css = trim(css);

          var withInteger = match(rgb_rgba_integer_regex, 255);
          if(withInteger) {
            return withInteger;
          }
          return match(rgb_rgba_percentage_regex, 100);

          function match(regex, max_value) {
            var colorGroups = css.match( regex );

            // If there is an "a" after "rgb", there must be a fourth parameter and the other way round
            if (!colorGroups || (!!colorGroups[1] + !!colorGroups[5] === 1)) {
              return null;
            }

            var rgb = factories.RGB();
            rgb.red   = Math.min(1, Math.max(0, colorGroups[2] / max_value));
            rgb.green = Math.min(1, Math.max(0, colorGroups[3] / max_value));
            rgb.blue  = Math.min(1, Math.max(0, colorGroups[4] / max_value));
            rgb.alpha = !!colorGroups[5] ? Math.min(Math.max(parseFloat(colorGroups[6]), 0), 1) : 1;

            return rgb;
          }
        },

        function ( css ) {
            var lower = css.toLowerCase();
            if (lower in css_colors) {
              css = css_colors[lower];
            }

            if (!css.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
              return;
            }

            css = css.replace(/^#/,'');

            var bytes = css.length / 3;

            var max = Math.pow(16, bytes) - 1;

            var rgb = factories.RGB();
            rgb.red =   parseInt(css.slice(0, bytes), 16) / max;
            rgb.green = parseInt(css.slice(bytes * 1,bytes * 2), 16) / max;
            rgb.blue =  parseInt(css.slice(bytes * 2), 16) / max;
            rgb.alpha = 1;
            return rgb;
        },

        function ( css ) {
            if (css.toLowerCase() !== 'transparent') return;

            return transparent;
        }
    ],

    _fromCSS: function ( css ) {
      var color = null;
      for (var i = 0, j = this._stringParsers.length; i < j; i++) {
          color = this._stringParsers[i](css);
          if (color) return color;
      }
    },

    _fromRGB: function ( RGB ) {
      var newRGB = factories.RGB();

      newRGB.red = RGB.red;
      newRGB.green = RGB.green;
      newRGB.blue = RGB.blue;
      newRGB.alpha = RGB.hasOwnProperty('alpha') ? RGB.alpha : 1;

      return newRGB;
    },

    _fromRGBArray: function ( RGB ) {
      var newRGB = factories.RGB();

      newRGB.red = Math.max(0, Math.min(1, RGB[0] / 255));
      newRGB.green = Math.max(0, Math.min(1, RGB[1] / 255));
      newRGB.blue = Math.max(0, Math.min(1, RGB[2] / 255));
      newRGB.alpha = RGB[3] !== undefined ? Math.max(0, Math.min(1, RGB[3])) : 1;

      return newRGB;
    },

    // convert to a CSS string. defaults to two bytes a value
    toCSSHex: function ( bytes ) {
        bytes = bytes || 2;

        var max = Math.pow(16, bytes) - 1;
        var css = [
          "#",
          pad ( Math.round(this.red * max).toString( 16 ).toUpperCase(), bytes ),
          pad ( Math.round(this.green * max).toString( 16 ).toUpperCase(), bytes ),
          pad ( Math.round(this.blue * max).toString( 16 ).toUpperCase(), bytes )
        ];

        return css.join('');
    },    
    
    toCSS: function ( bytes ) {
      if (this.alpha === 1) return this.toCSSHex(bytes); 

      var max = 255;
      
      var components = [
        'rgba(',
        Math.max(0, Math.min(max, Math.round(this.red * max))), ',',
        Math.max(0, Math.min(max, Math.round(this.green * max))), ',', 
        Math.max(0, Math.min(max, Math.round(this.blue * max))), ',',
        Math.max(0, Math.min(1, this.alpha)), 
        ')'
      ];

      return components.join('');
    },

    toHSV: function ( ) {
      var hsv = factories.HSV();
      var min, max, delta;

      min = Math.min(this.red, this.green, this.blue);
      max = Math.max(this.red, this.green, this.blue);
      hsv.value = max; // v

      delta = max - min;

      if( delta == 0 ) { // white, grey, black
        hsv.hue = hsv.saturation = 0;
      }
      else { // chroma
        hsv.saturation = delta / max;

        if( this.red == max ) {
          hsv.hue = ( this.green - this.blue ) / delta; // between yellow & magenta
        }
        else if( this.green  == max ) {
          hsv.hue = 2 + ( this.blue - this.red ) / delta; // between cyan & yellow
        }
        else {
          hsv.hue = 4 + ( this.red - this.green ) / delta; // between magenta & cyan
        }

        hsv.hue = ((hsv.hue * 60) + 360) % 360; // degrees
      }

      hsv.alpha = this.alpha;

      return hsv;
    },
    toHSL: function ( ) {
      return this.toHSV().toHSL();
    },

    toRGB: function ( ) {
      return this.clone();
    }
  });

  transparent = color.fromObject({red: 0, blue: 0, green: 0, alpha: 0});


  /* Like RGB above, this object describes what will become the HSV
   * template object. This model handles hue, saturation and value.
   * hue is the number of degrees around the color wheel, saturation
   * describes how much color their is and value is the brightness.
   */
  registerModel('HSV', {
    hue: 0,
    saturation: 0,
    value: 1,
    alpha: 1,

    shiftHue: cloneOnApply(function ( degrees ) {
      var hue = (this.hue + degrees) % 360;
      if (hue < 0) {
        hue = (360 + hue) % 360;
      }

      this.hue = hue;
    }),

    devalueByAmount: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value - val, 0));
    }),

    devalueByRatio: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value * (1 - val), 0));
    }),

    valueByAmount: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value + val, 0));
    }),

    valueByRatio: cloneOnApply(function ( val ) {
      this.value = Math.min(1, Math.max(this.value * (1 + val), 0));
    }),

    desaturateByAmount: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation - val, 0));
    }),

    desaturateByRatio: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation * (1 - val), 0));
    }),

    saturateByAmount: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation + val, 0));
    }),

    saturateByRatio: cloneOnApply(function ( val ) {
      this.saturation = Math.min(1, Math.max(this.saturation * (1 + val), 0));
    }),

    schemeFromDegrees: function ( degrees ) {
      var newColors = [];
      for (var i = 0, j = degrees.length; i < j; i++) {
        var col = this.clone();
        col.hue = (this.hue + degrees[i]) % 360;
        newColors.push(col);
      }
      return newColors;
    },

    complementaryScheme: function ( ) {
      return this.schemeFromDegrees([0,180]);
    },

    splitComplementaryScheme: function ( ) {
      return this.schemeFromDegrees([0,150,320]);
    },

    splitComplementaryCWScheme: function ( ) {
      return this.schemeFromDegrees([0,150,300]);
    },

    splitComplementaryCCWScheme: function ( ) {
      return this.schemeFromDegrees([0,60,210]);
    },

    triadicScheme: function ( ) {
      return this.schemeFromDegrees([0,120,240]);
    },

    clashScheme: function ( ) {
      return this.schemeFromDegrees([0,90,270]);
    },

    tetradicScheme: function ( ) {
      return this.schemeFromDegrees([0,90,180,270]);
    },

    fourToneCWScheme: function ( ) {
      return this.schemeFromDegrees([0,60,180,240]);
    },

    fourToneCCWScheme: function ( ) {
      return this.schemeFromDegrees([0,120,180,300]);
    },

    fiveToneAScheme: function ( ) {
      return this.schemeFromDegrees([0,115,155,205,245]);
    },

    fiveToneBScheme: function ( ) {
      return this.schemeFromDegrees([0,40,90,130,245]);
    },

    fiveToneCScheme: function ( ) {
      return this.schemeFromDegrees([0,50,90,205,320]);
    },

    fiveToneDScheme: function ( ) {
      return this.schemeFromDegrees([0,40,155,270,310]);
    },

    fiveToneEScheme: function ( ) {
      return this.schemeFromDegrees([0,115,230,270,320]);
    },

    sixToneCWScheme: function ( ) {
      return this.schemeFromDegrees([0,30,120,150,240,270]);
    },

    sixToneCCWScheme: function ( ) {
      return this.schemeFromDegrees([0,90,120,210,240,330]);
    },

    neutralScheme: function ( ) {
      return this.schemeFromDegrees([0,15,30,45,60,75]);
    },

    analogousScheme: function ( ) {
      return this.schemeFromDegrees([0,30,60,90,120,150]);
    },

    fromObject: function ( o ) {
      if (o.hasOwnProperty('hue') &&
          o.hasOwnProperty('saturation') &&
          o.hasOwnProperty('value')) {
        var hsv = factories.HSV();

        hsv.hue = o.hue;
        hsv.saturation = o.saturation;
        hsv.value = o.value;
        hsv.alpha = o.hasOwnProperty('alpha') ? o.alpha : 1;

        return hsv;
      }
      // nothing matches, not an HSV object
      return null;
    },

    _normalise: function ( ) {
       this.hue %= 360;
       this.saturation = Math.min(Math.max(0, this.saturation), 1);
       this.value = Math.min(Math.max(0, this.value));
       this.alpha = Math.min(1, Math.max(0, this.alpha));
    },

    toRGB: function ( ) {
      this._normalise();

      var rgb = factories.RGB();
      var i;
      var f, p, q, t;

      if( this.saturation === 0 ) {
        // achromatic (grey)
        rgb.red = this.value;
        rgb.green = this.value;
        rgb.blue = this.value;
        rgb.alpha = this.alpha;
        return rgb;
      }

      var h = this.hue / 60;			// sector 0 to 5
      i = Math.floor( h );
      f = h - i;			// factorial part of h
      p = this.value * ( 1 - this.saturation );
      q = this.value * ( 1 - this.saturation * f );
      t = this.value * ( 1 - this.saturation * ( 1 - f ) );

      switch( i ) {
        case 0:
          rgb.red = this.value;
          rgb.green = t;
          rgb.blue = p;
          break;
        case 1:
          rgb.red = q;
          rgb.green = this.value;
          rgb.blue = p;
          break;
        case 2:
          rgb.red = p;
          rgb.green = this.value;
          rgb.blue = t;
          break;
        case 3:
          rgb.red = p;
          rgb.green = q;
          rgb.blue = this.value;
          break;
        case 4:
          rgb.red = t;
          rgb.green = p;
          rgb.blue = this.value;
          break;
        default:		// case 5:
          rgb.red = this.value;
          rgb.green = p;
          rgb.blue = q;
          break;
      }

      rgb.alpha = this.alpha;

      return rgb;
    },
    toHSL: function() {
      this._normalise();

      var hsl = factories.HSL();

      hsl.hue = this.hue;
      var l = (2 - this.saturation) * this.value,
          s = this.saturation * this.value;
      if(l && 2 - l) {
        s /= (l <= 1) ? l : 2 - l;
      }
      l /= 2;
      hsl.saturation = s;
      hsl.lightness = l;
      hsl.alpha = this.alpha;

      return hsl;
    },

    toHSV: function ( ) {
      return this.clone();
    }
  });

  registerModel('HSL', {
    hue: 0,
    saturation: 0,
    lightness: 0,
    alpha: 1,

    darkenByAmount: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness - val, 0));
    }),

    darkenByRatio: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness * (1 - val), 0));
    }),

    lightenByAmount: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness + val, 0));
    }),

    lightenByRatio: cloneOnApply(function ( val ) {
      this.lightness = Math.min(1, Math.max(this.lightness * (1 + val), 0));
    }),

    fromObject: function ( o ) {
      if ("string" == typeof o) {
        return this._fromCSS( o );
      }
      if (o.hasOwnProperty('hue') &&
          o.hasOwnProperty('saturation') &&
          o.hasOwnProperty('lightness')) {
        return this._fromHSL ( o );
      }
      // nothing matchs, not an RGB object
    },

    _fromCSS: function ( css ) {
      var colorGroups = trim( css ).match( hsl_hsla_regex );

      // if there is an "a" after "hsl", there must be a fourth parameter and the other way round
      if (!colorGroups || (!!colorGroups[1] + !!colorGroups[5] === 1)) {
        return null;
      }

      var hsl = factories.HSL();
      hsl.hue        = (colorGroups[2] % 360 + 360) % 360;
      hsl.saturation = Math.max(0, Math.min(parseInt(colorGroups[3], 10) / 100, 1));
      hsl.lightness  = Math.max(0, Math.min(parseInt(colorGroups[4], 10) / 100, 1));
      hsl.alpha      = !!colorGroups[5] ? Math.max(0, Math.min(1, parseFloat(colorGroups[6]))) : 1;

      return hsl;
    },

    _fromHSL: function ( HSL ) {
      var newHSL = factories.HSL();

      newHSL.hue = HSL.hue;
      newHSL.saturation = HSL.saturation;
      newHSL.lightness = HSL.lightness;

      newHSL.alpha = HSL.hasOwnProperty('alpha') ? HSL.alpha : 1;

      return newHSL;
    },

    _normalise: function ( ) {
       this.hue = (this.hue % 360 + 360) % 360;
       this.saturation = Math.min(Math.max(0, this.saturation), 1);
       this.lightness = Math.min(Math.max(0, this.lightness));
       this.alpha = Math.min(1, Math.max(0, this.alpha));
    },

    toHSL: function() {
      return this.clone();
    },
    toHSV: function() {
      this._normalise();

      var hsv = factories.HSV();

      // http://ariya.blogspot.com/2008/07/converting-between-hsl-and-hsv.html
      hsv.hue = this.hue; // H
      var l = 2 * this.lightness,
          s = this.saturation * ((l <= 1) ? l : 2 - l);
      hsv.value = (l + s) / 2; // V
      hsv.saturation = ((2 * s) / (l + s)) || 0; // S
      hsv.alpha = this.alpha;

      return hsv;
    },
    toRGB: function() {
      return this.toHSV().toRGB();
    }
  });

  // Package specific exports

  /* the Color function is a factory for new color objects.
   */
  function Color( o ) {
    return color.fromObject( o );
  }
  Color.isValid = function( str ) {
    var key, c = Color( str );

    var length = 0;
    for(key in c) {
      if(c.hasOwnProperty(key)) {
        length++;
      }
    }

    return length > 0;
  };
  net.brehaut.Color = Color;
}).call(net.brehaut);

/* Export to CommonJS
*/
if(typeof module !== 'undefined') {
  module.exports = net.brehaut.Color;
}

},{}],2:[function(require,module,exports){
require('./shim');
require('./modules/core.dict');
require('./modules/core.iter-helpers');
require('./modules/core.$for');
require('./modules/core.delay');
require('./modules/core.function.part');
require('./modules/core.object');
require('./modules/core.array.turn');
require('./modules/core.number.iterator');
require('./modules/core.number.math');
require('./modules/core.string.escape-html');
require('./modules/core.date');
require('./modules/core.global');
require('./modules/core.log');
module.exports = require('./modules/$').core;
},{"./modules/$":24,"./modules/core.$for":43,"./modules/core.array.turn":44,"./modules/core.date":45,"./modules/core.delay":46,"./modules/core.dict":47,"./modules/core.function.part":48,"./modules/core.global":49,"./modules/core.iter-helpers":50,"./modules/core.log":51,"./modules/core.number.iterator":52,"./modules/core.number.math":53,"./modules/core.object":54,"./modules/core.string.escape-html":55,"./shim":104}],3:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var $ = require('./$');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = $.toObject($this)
      , length = $.toLength(O.length)
      , index  = $.toIndex(fromIndex, length)
      , value;
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$":24}],4:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var $   = require('./$')
  , ctx = require('./$.ctx');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = Object($.assertDefined($this))
      , self   = $.ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = $.toLength(self.length)
      , index  = 0
      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$":24,"./$.ctx":12}],5:[function(require,module,exports){
var $ = require('./$');
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
assert.def = $.assertDefined;
assert.fn = function(it){
  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
  return it;
};
assert.obj = function(it){
  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
assert.inst = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
module.exports = assert;
},{"./$":24}],6:[function(require,module,exports){
var $        = require('./$')
  , enumKeys = require('./$.enum-keys');
// 19.1.2.1 Object.assign(target, source, ...)
/* eslint-disable no-unused-vars */
module.exports = Object.assign || function assign(target, source){
/* eslint-enable no-unused-vars */
  var T = Object($.assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = $.ES5Object(arguments[i++])
      , keys   = enumKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
};
},{"./$":24,"./$.enum-keys":15}],7:[function(require,module,exports){
var $        = require('./$')
  , TAG      = require('./$.wks')('toStringTag')
  , toString = {}.toString;
function cof(it){
  return toString.call(it).slice(8, -1);
}
cof.classof = function(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
};
cof.set = function(it, tag, stat){
  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
};
module.exports = cof;
},{"./$":24,"./$.wks":42}],8:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , step     = require('./$.iter').step
  , $has     = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , isExtensible = Object.isExtensible || isObject
  , ID       = safe('id')
  , O1       = safe('O1')
  , LAST     = safe('last')
  , FIRST    = safe('first')
  , ITER     = safe('iter')
  , SIZE     = $.DESC ? safe('size') : 'size'
  , id       = 0;

function fastKey(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
}

function getEntry(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that[O1][index];
  // frozen object case
  for(entry = that[FIRST]; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
}

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      assert.inst(that, C, NAME);
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that[FIRST] = that[LAST] = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that[O1][entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that[FIRST] == entry)that[FIRST] = next;
          if(that[LAST] == entry)that[LAST] = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments[1], 3)
          , entry;
        while(entry = entry ? entry.n : this[FIRST]){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if($.DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return assert.def(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that[O1][index] = entry;
    } return that;
  },
  getEntry: getEntry,
  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  setIter: function(C, NAME, IS_MAP){
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        iter.o = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
  }
};
},{"./$":24,"./$.assert":5,"./$.ctx":12,"./$.for-of":16,"./$.iter":23,"./$.iter-define":21,"./$.mix":26,"./$.uid":40}],9:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def')
  , forOf = require('./$.for-of');
module.exports = function(NAME){
  $def($def.P, NAME, {
    toJSON: function toJSON(){
      var arr = [];
      forOf(this, false, arr.push, arr);
      return arr;
    }
  });
};
},{"./$.def":13,"./$.for-of":16}],10:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , safe      = require('./$.uid').safe
  , assert    = require('./$.assert')
  , forOf     = require('./$.for-of')
  , $has      = $.has
  , isObject  = $.isObject
  , hide      = $.hide
  , isExtensible = Object.isExtensible || isObject
  , id        = 0
  , ID        = safe('id')
  , WEAK      = safe('weak')
  , LEAK      = safe('leak')
  , method    = require('./$.array-methods')
  , find      = method(5)
  , findIndex = method(6);
function findFrozen(store, key){
  return find(store.array, function(it){
    return it[0] === key;
  });
}
// fallback for frozen keys
function leakStore(that){
  return that[LEAK] || hide(that, LEAK, {
    array: [],
    get: function(key){
      var entry = findFrozen(this, key);
      if(entry)return entry[1];
    },
    has: function(key){
      return !!findFrozen(this, key);
    },
    set: function(key, value){
      var entry = findFrozen(this, key);
      if(entry)entry[1] = value;
      else this.array.push([key, value]);
    },
    'delete': function(key){
      var index = findIndex(this.array, function(it){
        return it[0] === key;
      });
      if(~index)this.array.splice(index, 1);
      return !!~index;
    }
  })[LEAK];
}

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      $.set(assert.inst(that, C, NAME), ID, id++);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    require('./$.mix')(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return leakStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return leakStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this[ID]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(assert.obj(key))){
      leakStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that[ID]] = value;
    } return that;
  },
  leakStore: leakStore,
  WEAK: WEAK,
  ID: ID
};
},{"./$":24,"./$.array-methods":4,"./$.assert":5,"./$.for-of":16,"./$.mix":26,"./$.uid":40}],11:[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , BUGGY = $iter.BUGGY
  , forOf = require('./$.for-of')
  , assertInstance = require('./$.assert').inst
  , INTERNAL = require('./$.uid').safe('internal');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = $.g[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!$.DESC || !$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    require('./$.mix')(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      assertInstance(target, C, NAME);
      target[INTERNAL] = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var chain = KEY == 'add' || KEY == 'set';
      if(KEY in proto)$.hide(C.prototype, KEY, function(a, b){
        var result = this[INTERNAL][KEY](a === 0 ? 0 : a, b);
        return chain ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this[INTERNAL].size;
      }
    });
  }

  require('./$.cof').set(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);
  require('./$.species')(C);

  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

  return C;
};
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.for-of":16,"./$.iter":23,"./$.mix":26,"./$.species":34,"./$.uid":40}],12:[function(require,module,exports){
// Optional / simple context binding
var assertFunction = require('./$.assert').fn;
module.exports = function(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.assert":5}],13:[function(require,module,exports){
var $          = require('./$')
  , global     = $.g
  , core       = $.core
  , isFunction = $.isFunction;
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
}
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {}).prototype
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && !isFunction(target[key]))exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp.prototype = C.prototype;
    }(out);
    else exp = isProto && isFunction(out) ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports.prototype || (exports.prototype = {}))[key] = out;
  }
}
module.exports = $def;
},{"./$":24}],14:[function(require,module,exports){
var $        = require('./$')
  , document = $.g.document
  , isObject = $.isObject
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$":24}],15:[function(require,module,exports){
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getDesc    = $.getDesc
    , getSymbols = $.getSymbols;
  if(getSymbols)$.each.call(getSymbols(it), function(key){
    if(getDesc(it, key).enumerable)keys.push(key);
  });
  return keys;
};
},{"./$":24}],16:[function(require,module,exports){
var ctx  = require('./$.ctx')
  , get  = require('./$.iter').get
  , call = require('./$.iter-call');
module.exports = function(iterable, entries, fn, that){
  var iterator = get(iterable)
    , f        = ctx(fn, that, entries ? 2 : 1)
    , step;
  while(!(step = iterator.next()).done){
    if(call(iterator, f, step.value, entries) === false){
      return call.close(iterator);
    }
  }
};
},{"./$.ctx":12,"./$.iter":23,"./$.iter-call":20}],17:[function(require,module,exports){
module.exports = function($){
  $.FW   = false;
  $.path = $.core;
  return $;
};
},{}],18:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var $ = require('./$')
  , toString = {}.toString
  , getNames = $.getNames;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

function getWindowNames(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
}

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames($.toObject(it));
};
},{"./$":24}],19:[function(require,module,exports){
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
};
},{}],20:[function(require,module,exports){
var assertObject = require('./$.assert').obj;
function close(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)assertObject(ret.call(iterator));
}
function call(iterator, fn, value, entries){
  try {
    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
  } catch(e){
    close(iterator);
    throw e;
  }
}
call.close = close;
module.exports = call;
},{"./$.assert":5}],21:[function(require,module,exports){
var $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , $               = require('./$')
  , cof             = require('./$.cof')
  , $iter           = require('./$.iter')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values'
  , Iterators       = $iter.Iterators;
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iter.create(Constructor, NAME, next);
  function createMethod(kind){
    function $$(that){
      return new Constructor(that, kind);
    }
    switch(kind){
      case KEYS: return function keys(){ return $$(this); };
      case VALUES: return function values(){ return $$(this); };
    } return function entries(){ return $$(this); };
  }
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = $.getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    cof.set(IteratorPrototype, TAG, true);
    // FF fix
    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
  }
  // Define iterator
  if($.FW || FORCE)$iter.set(proto, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = $.that;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod(KEYS),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
  }
};
},{"./$":24,"./$.cof":7,"./$.def":13,"./$.iter":23,"./$.redef":29,"./$.wks":42}],22:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":42}],23:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , cof               = require('./$.cof')
  , classof           = cof.classof
  , assert            = require('./$.assert')
  , assertObject      = assert.obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = require('./$.shared')('iterators')
  , IteratorPrototype = {};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}

module.exports = {
  // Safari has buggy iterators w/o `next`
  BUGGY: 'keys' in [] && !('next' in [].keys()),
  Iterators: Iterators,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol;
    return (Symbol && Symbol.iterator || FF_ITERATOR) in O
      || SYMBOL_ITERATOR in O
      || $.has(Iterators, classof(O));
  },
  get: function(it){
    var Symbol = $.g.Symbol
      , getIter;
    if(it != undefined){
      getIter = it[Symbol && Symbol.iterator || FF_ITERATOR]
        || it[SYMBOL_ITERATOR]
        || Iterators[classof(it)];
    }
    assert($.isFunction(getIter), it, ' is not iterable!');
    return assertObject(getIter.call(it));
  },
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  }
};
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.shared":33,"./$.wks":42}],24:[function(require,module,exports){
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')()
  , core   = {}
  , defineProperty = Object.defineProperty
  , hasOwnProperty = {}.hasOwnProperty
  , ceil  = Math.ceil
  , floor = Math.floor
  , max   = Math.max
  , min   = Math.min;
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
  try {
    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
  } catch(e){ /* empty */ }
}();
var hide = createDefiner(1);
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}

function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
function assertDefined(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
}

var $ = module.exports = require('./$.fw')({
  g: global,
  core: core,
  html: global.document && document.documentElement,
  // http://jsperf.com/core-js-isobject
  isObject:   isObject,
  isFunction: isFunction,
  that: function(){
    return this;
  },
  // 7.1.4 ToInteger
  toInteger: toInteger,
  // 7.1.15 ToLength
  toLength: function(it){
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  },
  toIndex: function(index, length){
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key){
    return hasOwnProperty.call(it, key);
  },
  create:     Object.create,
  getProto:   Object.getPrototypeOf,
  DESC:       DESC,
  desc:       desc,
  getDesc:    Object.getOwnPropertyDescriptor,
  setDesc:    defineProperty,
  setDescs:   Object.defineProperties,
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  assertDefined: assertDefined,
  // Dummy, fix for not array-like ES3 string in es5 module
  ES5Object: Object,
  toObject: function(it){
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  each: [].forEach
});
/* eslint-disable no-undef */
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":17}],25:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":24}],26:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":29}],27:[function(require,module,exports){
var $            = require('./$')
  , assertObject = require('./$.assert').obj;
module.exports = function ownKeys(it){
  assertObject(it);
  var keys       = $.getNames(it)
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":24,"./$.assert":5}],28:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , invoke = require('./$.invoke')
  , assertFunction = require('./$.assert').fn;
module.exports = function(/* ...pargs */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = $.path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !_length)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(_length > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$":24,"./$.assert":5,"./$.invoke":19}],29:[function(require,module,exports){
module.exports = require('./$').hide;
},{"./$":24}],30:[function(require,module,exports){
'use strict';
module.exports = function(regExp, replace, isStatic){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  };
};
},{}],31:[function(require,module,exports){
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],32:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var $      = require('./$')
  , assert = require('./$.assert');
function check(O, proto){
  assert.obj(O);
  assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
}
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
    ? function(buggy, set){
        try {
          set = require('./$.ctx')(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
          set({}, []);
        } catch(e){ buggy = true; }
        return function setPrototypeOf(O, proto){
          check(O, proto);
          if(buggy)O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }()
    : undefined),
  check: check
};
},{"./$":24,"./$.assert":5,"./$.ctx":12}],33:[function(require,module,exports){
var $      = require('./$')
  , SHARED = '__core-js_shared__'
  , store  = $.g[SHARED] || ($.g[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$":24}],34:[function(require,module,exports){
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: $.that
  });
};
},{"./$":24,"./$.wks":42}],35:[function(require,module,exports){
// true  -> String#at
// false -> String#codePointAt
var $ = require('./$');
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String($.assertDefined(that))
      , i = $.toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$":24}],36:[function(require,module,exports){
// http://wiki.ecmascript.org/doku.php?id=strawman:string_padding
var $      = require('./$')
  , repeat = require('./$.string-repeat');

module.exports = function(that, minLength, fillChar, left){
  // 1. Let O be CheckObjectCoercible(this value).
  // 2. Let S be ToString(O).
  var S = String($.assertDefined(that));
  // 4. If intMinLength is undefined, return S.
  if(minLength === undefined)return S;
  // 4. Let intMinLength be ToInteger(minLength).
  var intMinLength = $.toInteger(minLength);
  // 5. Let fillLen be the number of characters in S minus intMinLength.
  var fillLen = intMinLength - S.length;
  // 6. If fillLen < 0, then throw a RangeError exception.
  // 7. If fillLen is +∞, then throw a RangeError exception.
  if(fillLen < 0 || fillLen === Infinity){
    throw new RangeError('Cannot satisfy string length ' + minLength + ' for string: ' + S);
  }
  // 8. Let sFillStr be the string represented by fillStr.
  // 9. If sFillStr is undefined, let sFillStr be a space character.
  var sFillStr = fillChar === undefined ? ' ' : String(fillChar);
  // 10. Let sFillVal be a String made of sFillStr, repeated until fillLen is met.
  var sFillVal = repeat.call(sFillStr, Math.ceil(fillLen / sFillStr.length));
  // truncate if we overflowed
  if(sFillVal.length > fillLen)sFillVal = left
    ? sFillVal.slice(sFillVal.length - fillLen)
    : sFillVal.slice(0, fillLen);
  // 11. Return a string made from sFillVal, followed by S.
  // 11. Return a String made from S, followed by sFillVal.
  return left ? sFillVal.concat(S) : S.concat(sFillVal);
};
},{"./$":24,"./$.string-repeat":37}],37:[function(require,module,exports){
'use strict';
var $ = require('./$');

module.exports = function repeat(count){
  var str = String($.assertDefined(this))
    , res = ''
    , n   = $.toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$":24}],38:[function(require,module,exports){
'use strict';
var $      = require('./$')
  , ctx    = require('./$.ctx')
  , cof    = require('./$.cof')
  , invoke = require('./$.invoke')
  , cel    = require('./$.dom-create')
  , global             = $.g
  , isFunction         = $.isFunction
  , html               = $.html
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
function run(){
  var id = +this;
  if($.has(queue, id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
}
function listner(event){
  run.call(event.data);
}
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!isFunction(setTask) || !isFunction(clearTask)){
  setTask = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(cof(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(global.addEventListener && isFunction(global.postMessage) && !global.importScripts){
    defer = function(id){
      global.postMessage(id, '*');
    };
    global.addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$":24,"./$.cof":7,"./$.ctx":12,"./$.dom-create":14,"./$.invoke":19}],39:[function(require,module,exports){
module.exports = function(exec){
  try {
    exec();
    return false;
  } catch(e){
    return true;
  }
};
},{}],40:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++sid + Math.random()).toString(36));
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":24}],41:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],42:[function(require,module,exports){
var global = require('./$').g
  , store  = require('./$.shared')('wks');
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":24,"./$.shared":33,"./$.uid":40}],43:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , ctx     = require('./$.ctx')
  , safe    = require('./$.uid').safe
  , $def    = require('./$.def')
  , $iter   = require('./$.iter')
  , forOf   = require('./$.for-of')
  , ENTRIES = safe('entries')
  , FN      = safe('fn')
  , ITER    = safe('iter')
  , call    = require('./$.iter-call')
  , getIterator    = $iter.get
  , setIterator    = $iter.set
  , createIterator = $iter.create;
function $for(iterable, entries){
  if(!(this instanceof $for))return new $for(iterable, entries);
  this[ITER]    = getIterator(iterable);
  this[ENTRIES] = !!entries;
}

createIterator($for, 'Wrapper', function(){
  return this[ITER].next();
});
var $forProto = $for.prototype;
setIterator($forProto, function(){
  return this[ITER]; // unwrap
});

function createChainIterator(next){
  function Iterator(iter, fn, that){
    this[ITER]    = getIterator(iter);
    this[ENTRIES] = iter[ENTRIES];
    this[FN]      = ctx(fn, that, iter[ENTRIES] ? 2 : 1);
  }
  createIterator(Iterator, 'Chain', next, $forProto);
  setIterator(Iterator.prototype, $.that); // override $forProto iterator
  return Iterator;
}

var MapIter = createChainIterator(function(){
  var step = this[ITER].next();
  return step.done
    ? step
    : $iter.step(0, call(this[ITER], this[FN], step.value, this[ENTRIES]));
});

var FilterIter = createChainIterator(function(){
  for(;;){
    var step = this[ITER].next();
    if(step.done || call(this[ITER], this[FN], step.value, this[ENTRIES]))return step;
  }
});

require('./$.mix')($forProto, {
  of: function(fn, that){
    forOf(this, this[ENTRIES], fn, that);
  },
  array: function(fn, that){
    var result = [];
    forOf(fn != undefined ? this.map(fn, that) : this, false, result.push, result);
    return result;
  },
  filter: function(fn, that){
    return new FilterIter(this, fn, that);
  },
  map: function(fn, that){
    return new MapIter(this, fn, that);
  }
});

$for.isIterable  = $iter.is;
$for.getIterator = getIterator;

$def($def.G + $def.F, {$for: $for});
},{"./$":24,"./$.ctx":12,"./$.def":13,"./$.for-of":16,"./$.iter":23,"./$.iter-call":20,"./$.mix":26,"./$.uid":40}],44:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , $def           = require('./$.def')
  , assertFunction = require('./$.assert').fn;
$def($def.P + $def.F, 'Array', {
  turn: function(fn, target /* = [] */){
    assertFunction(fn);
    var memo   = target == undefined ? [] : Object(target)
      , O      = $.ES5Object(this)
      , length = $.toLength(O.length)
      , index  = 0;
    while(length > index)if(fn(memo, O[index], index++, this) === false)break;
    return memo;
  }
});
require('./$.unscope')('turn');
},{"./$":24,"./$.assert":5,"./$.def":13,"./$.unscope":41}],45:[function(require,module,exports){
var $            = require('./$')
  , $def         = require('./$.def')
  , core         = $.core
  , formatRegExp = /\b\w\w?\b/g
  , flexioRegExp = /:(.*)\|(.*)$/
  , locales      = {}
  , current      = 'en'
  , SECONDS      = 'Seconds'
  , MINUTES      = 'Minutes'
  , HOURS        = 'Hours'
  , DATE         = 'Date'
  , MONTH        = 'Month'
  , YEAR         = 'FullYear';
function lz(num){
  return num > 9 ? num : '0' + num;
}
function createFormat(prefix){
  return function(template, locale /* = current */){
    var that = this
      , dict = locales[$.has(locales, locale) ? locale : current];
    function get(unit){
      return that[prefix + unit]();
    }
    return String(template).replace(formatRegExp, function(part){
      switch(part){
        case 's'  : return get(SECONDS);                  // Seconds : 0-59
        case 'ss' : return lz(get(SECONDS));              // Seconds : 00-59
        case 'm'  : return get(MINUTES);                  // Minutes : 0-59
        case 'mm' : return lz(get(MINUTES));              // Minutes : 00-59
        case 'h'  : return get(HOURS);                    // Hours   : 0-23
        case 'hh' : return lz(get(HOURS));                // Hours   : 00-23
        case 'D'  : return get(DATE);                     // Date    : 1-31
        case 'DD' : return lz(get(DATE));                 // Date    : 01-31
        case 'W'  : return dict[0][get('Day')];           // Day     : Понедельник
        case 'N'  : return get(MONTH) + 1;                // Month   : 1-12
        case 'NN' : return lz(get(MONTH) + 1);            // Month   : 01-12
        case 'M'  : return dict[2][get(MONTH)];           // Month   : Январь
        case 'MM' : return dict[1][get(MONTH)];           // Month   : Января
        case 'Y'  : return get(YEAR);                     // Year    : 2014
        case 'YY' : return lz(get(YEAR) % 100);           // Year    : 14
      } return part;
    });
  };
}
function addLocale(lang, locale){
  function split(index){
    var result = [];
    $.each.call(locale.months.split(','), function(it){
      result.push(it.replace(flexioRegExp, '$' + index));
    });
    return result;
  }
  locales[lang] = [locale.weekdays.split(','), split(1), split(2)];
  return core;
}
$def($def.P + $def.F, DATE, {
  format:    createFormat('get'),
  formatUTC: createFormat('getUTC')
});
addLocale(current, {
  weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
  months: 'January,February,March,April,May,June,July,August,September,October,November,December'
});
addLocale('ru', {
  weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
  months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' +
          'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
});
core.locale = function(locale){
  return $.has(locales, locale) ? current = locale : current;
};
core.addLocale = addLocale;
},{"./$":24,"./$.def":13}],46:[function(require,module,exports){
var $       = require('./$')
  , $def    = require('./$.def')
  , partial = require('./$.partial');
// https://esdiscuss.org/topic/promise-returning-delay-function
$def($def.G + $def.F, {
  delay: function(time){
    return new ($.core.Promise || $.g.Promise)(function(resolve){
      setTimeout(partial.call(resolve, true), time);
    });
  }
});
},{"./$":24,"./$.def":13,"./$.partial":28}],47:[function(require,module,exports){
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , $def     = require('./$.def')
  , assign   = require('./$.assign')
  , keyOf    = require('./$.keyof')
  , ITER     = require('./$.uid').safe('iter')
  , assert   = require('./$.assert')
  , $iter    = require('./$.iter')
  , forOf    = require('./$.for-of')
  , step     = $iter.step
  , getKeys  = $.getKeys
  , toObject = $.toObject
  , has      = $.has;

function Dict(iterable){
  var dict = $.create(null);
  if(iterable != undefined){
    if($iter.is(iterable)){
      forOf(iterable, true, function(key, value){
        dict[key] = value;
      });
    } else assign(dict, iterable);
  }
  return dict;
}
Dict.prototype = null;

function DictIterator(iterated, kind){
  $.set(this, ITER, {o: toObject(iterated), a: getKeys(iterated), i: 0, k: kind});
}
$iter.create(DictIterator, 'Dict', function(){
  var iter = this[ITER]
    , O    = iter.o
    , keys = iter.a
    , kind = iter.k
    , key;
  do {
    if(iter.i >= keys.length){
      iter.o = undefined;
      return step(1);
    }
  } while(!has(O, key = keys[iter.i++]));
  if(kind == 'keys'  )return step(0, key);
  if(kind == 'values')return step(0, O[key]);
  return step(0, [key, O[key]]);
});
function createDictIter(kind){
  return function(it){
    return new DictIterator(it, kind);
  };
}
function generic(A, B){
  // strange IE quirks mode bug -> use typeof instead of isFunction
  return typeof A == 'function' ? A : B;
}

// 0 -> Dict.forEach
// 1 -> Dict.map
// 2 -> Dict.filter
// 3 -> Dict.some
// 4 -> Dict.every
// 5 -> Dict.find
// 6 -> Dict.findKey
// 7 -> Dict.mapPairs
function createDictMethod(TYPE){
  var IS_MAP   = TYPE == 1
    , IS_EVERY = TYPE == 4;
  return function(object, callbackfn, that /* = undefined */){
    var f      = ctx(callbackfn, that, 3)
      , O      = toObject(object)
      , result = IS_MAP || TYPE == 7 || TYPE == 2 ? new (generic(this, Dict)) : undefined
      , key, val, res;
    for(key in O)if(has(O, key)){
      val = O[key];
      res = f(val, key, object);
      if(TYPE){
        if(IS_MAP)result[key] = res;            // map
        else if(res)switch(TYPE){
          case 2: result[key] = val; break;     // filter
          case 3: return true;                  // some
          case 5: return val;                   // find
          case 6: return key;                   // findKey
          case 7: result[res[0]] = res[1];      // mapPairs
        } else if(IS_EVERY)return false;        // every
      }
    }
    return TYPE == 3 || IS_EVERY ? IS_EVERY : result;
  };
}

// true  -> Dict.turn
// false -> Dict.reduce
function createDictReduce(IS_TURN){
  return function(object, mapfn, init){
    assert.fn(mapfn);
    var O      = toObject(object)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , memo, key, result;
    if(IS_TURN){
      memo = init == undefined ? new (generic(this, Dict)) : Object(init);
    } else if(arguments.length < 3){
      assert(length, 'Reduce of empty object with no initial value');
      memo = O[keys[i++]];
    } else memo = Object(init);
    while(length > i)if(has(O, key = keys[i++])){
      result = mapfn(memo, O[key], key, object);
      if(IS_TURN){
        if(result === false)break;
      } else memo = result;
    }
    return memo;
  };
}
var findKey = createDictMethod(6);

$def($def.G + $def.F, {Dict: Dict});

$def($def.S, 'Dict', {
  keys:     createDictIter('keys'),
  values:   createDictIter('values'),
  entries:  createDictIter('entries'),
  forEach:  createDictMethod(0),
  map:      createDictMethod(1),
  filter:   createDictMethod(2),
  some:     createDictMethod(3),
  every:    createDictMethod(4),
  find:     createDictMethod(5),
  findKey:  findKey,
  mapPairs: createDictMethod(7),
  reduce:   createDictReduce(false),
  turn:     createDictReduce(true),
  keyOf:    keyOf,
  includes: function(object, el){
    return (el == el ? keyOf(object, el) : findKey(object, function(it){
      return it != it;
    })) !== undefined;
  },
  // Has / get / set own property
  has: has,
  get: function(object, key){
    if(has(object, key))return object[key];
  },
  set: $.def,
  isDict: function(it){
    return $.isObject(it) && $.getProto(it) === Dict.prototype;
  }
});
},{"./$":24,"./$.assert":5,"./$.assign":6,"./$.ctx":12,"./$.def":13,"./$.for-of":16,"./$.iter":23,"./$.keyof":25,"./$.uid":40}],48:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , $def = require('./$.def');

// Placeholder
$.core._ = $.path._ = $.path._ || {};

$def($def.P + $def.F, 'Function', {
  part: require('./$.partial')
});
},{"./$":24,"./$.def":13,"./$.partial":28}],49:[function(require,module,exports){
var $def = require('./$.def');
$def($def.G + $def.F, {global: require('./$').g});
},{"./$":24,"./$.def":13}],50:[function(require,module,exports){
var core  = require('./$').core
  , $iter = require('./$.iter');
core.isIterable  = $iter.is;
core.getIterator = $iter.get;
},{"./$":24,"./$.iter":23}],51:[function(require,module,exports){
var $    = require('./$')
  , $def = require('./$.def')
  , log  = {}
  , enabled = true;
// Methods from https://github.com/DeveloperToolsWG/console-object/blob/master/api.md
$.each.call(('assert,clear,count,debug,dir,dirxml,error,exception,' +
    'group,groupCollapsed,groupEnd,info,isIndependentlyComposed,log,' +
    'markTimeline,profile,profileEnd,table,time,timeEnd,timeline,' +
    'timelineEnd,timeStamp,trace,warn').split(','), function(key){
  log[key] = function(){
    if(enabled && $.g.console && $.isFunction(console[key])){
      return Function.apply.call(console[key], console, arguments);
    }
  };
});
$def($def.G + $def.F, {log: require('./$.assign')(log.log, log, {
  enable: function(){
    enabled = true;
  },
  disable: function(){
    enabled = false;
  }
})});
},{"./$":24,"./$.assign":6,"./$.def":13}],52:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , ITER = require('./$.uid').safe('iter');

require('./$.iter-define')(Number, 'Number', function(iterated){
  $.set(this, ITER, {l: $.toLength(iterated), i: 0});
}, function(){
  var iter = this[ITER]
    , i    = iter.i++
    , done = i >= iter.l;
  return {done: done, value: done ? undefined : i};
});
},{"./$":24,"./$.iter-define":21,"./$.uid":40}],53:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , invoke  = require('./$.invoke')
  , methods = {};

methods.random = function(lim /* = 0 */){
  var a = +this
    , b = lim == undefined ? 0 : +lim
    , m = Math.min(a, b);
  return Math.random() * (Math.max(a, b) - m) + m;
};

if($.FW)$.each.call((
    // ES3:
    'round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' +
    // ES6:
    'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'
  ).split(','), function(key){
    var fn = Math[key];
    if(fn)methods[key] = function(/* ...args */){
      // ie9- dont support strict mode & convert `this` to object -> convert it to number
      var args = [+this]
        , i    = 0;
      while(arguments.length > i)args.push(arguments[i++]);
      return invoke(fn, args);
    };
  }
);

$def($def.P + $def.F, 'Number', methods);
},{"./$":24,"./$.def":13,"./$.invoke":19}],54:[function(require,module,exports){
var $       = require('./$')
  , $def    = require('./$.def')
  , ownKeys = require('./$.own-keys');
function define(target, mixin){
  var keys   = ownKeys($.toObject(mixin))
    , length = keys.length
    , i = 0, key;
  while(length > i)$.setDesc(target, key = keys[i++], $.getDesc(mixin, key));
  return target;
}
$def($def.S + $def.F, 'Object', {
  isObject: $.isObject,
  classof: require('./$.cof').classof,
  define: define,
  make: function(proto, mixin){
    return define($.create(proto), mixin);
  }
});
},{"./$":24,"./$.cof":7,"./$.def":13,"./$.own-keys":27}],55:[function(require,module,exports){
var $def     = require('./$.def')
  , replacer = require('./$.replacer');
var escapeHTMLDict = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
}, unescapeHTMLDict = {}, key;
for(key in escapeHTMLDict)unescapeHTMLDict[escapeHTMLDict[key]] = key;
$def($def.P + $def.F, 'String', {
  escapeHTML:   replacer(/[&<>"']/g, escapeHTMLDict),
  unescapeHTML: replacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
});
},{"./$.def":13,"./$.replacer":30}],56:[function(require,module,exports){
var $                = require('./$')
  , cel              = require('./$.dom-create')
  , cof              = require('./$.cof')
  , $def             = require('./$.def')
  , invoke           = require('./$.invoke')
  , arrayMethod      = require('./$.array-methods')
  , IE_PROTO         = require('./$.uid').safe('__proto__')
  , assert           = require('./$.assert')
  , assertObject     = assert.obj
  , ObjectProto      = Object.prototype
  , html             = $.html
  , A                = []
  , _slice           = A.slice
  , _join            = A.join
  , classof          = cof.classof
  , has              = $.has
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , defineProperties = $.setDescs
  , isFunction       = $.isFunction
  , isObject         = $.isObject
  , toObject         = $.toObject
  , toLength         = $.toLength
  , toIndex          = $.toIndex
  , IE8_DOM_DEFINE   = false
  , $indexOf         = require('./$.array-includes')(false)
  , $forEach         = arrayMethod(0)
  , $map             = arrayMethod(1)
  , $filter          = arrayMethod(2)
  , $some            = arrayMethod(3)
  , $every           = arrayMethod(4);

if(!$.DESC){
  try {
    IE8_DOM_DEFINE = defineProperty(cel('div'), 'x',
      {get: function(){ return 8; }}
    ).x == 8;
  } catch(e){ /* empty */ }
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)assertObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    assertObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !$.DESC, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
function createGetKeys(names, length){
  return function(object){
    var O      = toObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~$indexOf(result, key) || result.push(key);
    }
    return result;
  };
}
function Empty(){}
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = Object(assert.def(O));
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(isFunction(O.constructor) && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = assertObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
  // 19.1.2.17 / 15.2.3.8 Object.seal(O)
  seal: function seal(it){
    return it; // <- cap
  },
  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
  freeze: function freeze(it){
    return it; // <- cap
  },
  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
  preventExtensions: function preventExtensions(it){
    return it; // <- cap
  },
  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
  isSealed: function isSealed(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
  isFrozen: function isFrozen(it){
    return !isObject(it); // <- cap
  },
  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
  isExtensible: function isExtensible(it){
    return isObject(it); // <- cap
  }
});

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function(that /*, args... */){
    var fn       = assert.fn(this)
      , partArgs = _slice.call(arguments, 1);
    function bound(/* args... */){
      var args   = partArgs.concat(_slice.call(arguments))
        , constr = this instanceof bound
        , ctx    = constr ? $.create(fn.prototype) : that
        , result = invoke(fn, args, ctx);
      return constr ? ctx : result;
    }
    if(fn.prototype)bound.prototype = fn.prototype;
    return bound;
  }
});

// Fix for not array-like ES3 string and DOM objects
if(!(0 in Object('z') && 'z'[0] == 'z')){
  $.ES5Object = function(it){
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
}

var buggySlice = true;
try {
  if(html)_slice.call(html);
  buggySlice = false;
} catch(e){ /* empty */ }

$def($def.P + $def.F * buggySlice, 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return _slice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
  join: function join(){
    return _join.apply($.ES5Object(this), arguments);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {
  isArray: function(arg){
    return cof(arg) == 'Array';
  }
});
function createArrayReduce(isRight){
  return function(callbackfn, memo){
    assert.fn(callbackfn);
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
}
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || function forEach(callbackfn/*, that = undefined */){
    return $forEach(this, callbackfn, arguments[1]);
  },
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn/*, that = undefined */){
    return $map(this, callbackfn, arguments[1]);
  },
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn/*, that = undefined */){
    return $filter(this, callbackfn, arguments[1]);
  },
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn/*, that = undefined */){
    return $some(this, callbackfn, arguments[1]);
  },
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn/*, that = undefined */){
    return $every(this, callbackfn, arguments[1]);
  },
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(el /*, fromIndex = 0 */){
    return $indexOf(this, el, arguments[1]);
  },
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, $.toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 21.1.3.25 / 15.5.4.20 String.prototype.trim()
$def($def.P, 'String', {trim: require('./$.replacer')(/^\s*([\s\S]*\S)?\s*$/, '$1')});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function(){
  return +new Date;
}});

function lz(num){
  return num > 9 ? num : '0' + num;
}

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS and old webkit had a broken Date implementation.
var date       = new Date(-5e13 - 1)
  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
      && require('./$.throws')(function(){ new Date(NaN).toISOString(); }));
$def($def.P + $def.F * brokenDate, 'Date', {toISOString: function(){
  if(!isFinite(this))throw RangeError('Invalid time value');
  var d = this
    , y = d.getUTCFullYear()
    , m = d.getUTCMilliseconds()
    , s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
}});

if(classof(function(){ return arguments; }()) == 'Object')cof.classof = function(it){
  var tag = classof(it);
  return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
};
},{"./$":24,"./$.array-includes":3,"./$.array-methods":4,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.dom-create":14,"./$.invoke":19,"./$.replacer":30,"./$.throws":39,"./$.uid":40}],57:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
  copyWithin: function copyWithin(target/* = 0 */, start /* = 0, end = @length */){
    var O     = Object($.assertDefined(this))
      , len   = $.toLength(O.length)
      , to    = toIndex(target, len)
      , from  = toIndex(start, len)
      , end   = arguments[2]
      , fin   = end === undefined ? len : toIndex(end, len)
      , count = Math.min(fin - from, len - to)
      , inc   = 1;
    if(from < to && to < from + count){
      inc  = -1;
      from = from + count - 1;
      to   = to   + count - 1;
    }
    while(count-- > 0){
      if(from in O)O[to] = O[from];
      else delete O[to];
      to   += inc;
      from += inc;
    } return O;
  }
});
require('./$.unscope')('copyWithin');
},{"./$":24,"./$.def":13,"./$.unscope":41}],58:[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
  fill: function fill(value /*, start = 0, end = @length */){
    var O      = Object($.assertDefined(this))
      , length = $.toLength(O.length)
      , index  = toIndex(arguments[1], length)
      , end    = arguments[2]
      , endPos = end === undefined ? length : toIndex(end, length);
    while(endPos > index)O[index++] = value;
    return O;
  }
});
require('./$.unscope')('fill');
},{"./$":24,"./$.def":13,"./$.unscope":41}],59:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var KEY    = 'findIndex'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(6);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":41}],60:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var KEY    = 'find'
  , $def   = require('./$.def')
  , forced = true
  , $find  = require('./$.array-methods')(5);
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$def($def.P + $def.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments[1]);
  }
});
require('./$.unscope')(KEY);
},{"./$.array-methods":4,"./$.def":13,"./$.unscope":41}],61:[function(require,module,exports){
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , call  = require('./$.iter-call');
$def($def.S + $def.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = Object($.assertDefined(arrayLike))
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
      , index   = 0
      , length, result, step, iterator;
    if($iter.is(O)){
      iterator = $iter.get(O);
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result   = new (typeof this == 'function' ? this : Array);
      for(; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, f, [step.value, index], true) : step.value;
      }
    } else {
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
      for(; length > index; index++){
        result[index] = mapping ? f(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$":24,"./$.ctx":12,"./$.def":13,"./$.iter":23,"./$.iter-call":20,"./$.iter-detect":22}],62:[function(require,module,exports){
var $          = require('./$')
  , setUnscope = require('./$.unscope')
  , ITER       = require('./$.uid').safe('iter')
  , $iter      = require('./$.iter')
  , step       = $iter.step
  , Iterators  = $iter.Iterators;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , kind  = iter.k
    , index = iter.i++;
  if(!O || index >= O.length){
    iter.o = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$":24,"./$.iter":23,"./$.iter-define":21,"./$.uid":40,"./$.unscope":41}],63:[function(require,module,exports){
var $def = require('./$.def');
$def($def.S, 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , length = arguments.length
      // strange IE quirks mode bug -> use typeof instead of isFunction
      , result = new (typeof this == 'function' ? this : Array)(length);
    while(length > index)result[index] = arguments[index++];
    result.length = length;
    return result;
  }
});
},{"./$.def":13}],64:[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":34}],65:[function(require,module,exports){
var $             = require('./$')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(!$.isFunction(this) || !$.isObject(O))return false;
  if(!$.isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":24,"./$.wks":42}],66:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , NAME = 'name'
  , setDesc = $.setDesc
  , FunctionProto = Function.prototype;
// 19.2.4.2 name
NAME in FunctionProto || $.FW && $.DESC && setDesc(FunctionProto, NAME, {
  configurable: true,
  get: function(){
    var match = String(this).match(/^\s*function ([^ (]*)/)
      , name  = match ? match[1] : '';
    $.has(this, NAME) || setDesc(this, NAME, $.desc(5, name));
    return name;
  },
  set: function(value){
    $.has(this, NAME) || setDesc(this, NAME, $.desc(0, value));
  }
});
},{"./$":24}],67:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments[0]); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":11,"./$.collection-strong":8}],68:[function(require,module,exports){
var Infinity = 1 / 0
  , $def  = require('./$.def')
  , E     = Math.E
  , pow   = Math.pow
  , abs   = Math.abs
  , exp   = Math.exp
  , log   = Math.log
  , sqrt  = Math.sqrt
  , ceil  = Math.ceil
  , floor = Math.floor
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);
function roundTiesToEven(n){
  return n + 1 / EPSILON - 1 / EPSILON;
}

// 20.2.2.28 Math.sign(x)
function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
}
// 20.2.2.5 Math.asinh(x)
function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
}
// 20.2.2.14 Math.expm1(x)
function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
}

$def($def.S, 'Math', {
  // 20.2.2.3 Math.acosh(x)
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
  },
  // 20.2.2.5 Math.asinh(x)
  asinh: asinh,
  // 20.2.2.7 Math.atanh(x)
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
  },
  // 20.2.2.9 Math.cbrt(x)
  cbrt: function cbrt(x){
    return sign(x = +x) * pow(abs(x), 1 / 3);
  },
  // 20.2.2.11 Math.clz32(x)
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - floor(log(x + 0.5) * Math.LOG2E) : 32;
  },
  // 20.2.2.12 Math.cosh(x)
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  },
  // 20.2.2.14 Math.expm1(x)
  expm1: expm1,
  // 20.2.2.16 Math.fround(x)
  fround: function fround(x){
    var $abs  = abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  },
  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , len  = arguments.length
      , larg = 0
      , arg, div;
    while(i < len){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt(sum);
  },
  // 20.2.2.18 Math.imul(x, y)
  imul: function imul(x, y){
    var UInt16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UInt16 & xn
      , yl = UInt16 & yn;
    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
  },
  // 20.2.2.20 Math.log1p(x)
  log1p: function log1p(x){
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
  },
  // 20.2.2.21 Math.log10(x)
  log10: function log10(x){
    return log(x) / Math.LN10;
  },
  // 20.2.2.22 Math.log2(x)
  log2: function log2(x){
    return log(x) / Math.LN2;
  },
  // 20.2.2.28 Math.sign(x)
  sign: sign,
  // 20.2.2.30 Math.sinh(x)
  sinh: function sinh(x){
    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
  },
  // 20.2.2.33 Math.tanh(x)
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  },
  // 20.2.2.34 Math.trunc(x)
  trunc: function trunc(it){
    return (it > 0 ? floor : ceil)(it);
  }
});
},{"./$.def":13}],69:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , isObject   = $.isObject
  , isFunction = $.isFunction
  , NUMBER     = 'Number'
  , $Number    = $.g[NUMBER]
  , Base       = $Number
  , proto      = $Number.prototype;
function toPrimitive(it){
  var fn, val;
  if(isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))return val;
  if(isFunction(fn = it.toString) && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to number");
}
function toNumber(it){
  if(isObject(it))it = toPrimitive(it);
  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
    var binary = false;
    switch(it.charCodeAt(1)){
      case 66 : case 98  : binary = true;
      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
    }
  } return +it;
}
if($.FW && !($Number('0o1') && $Number('0b1'))){
  $Number = function Number(it){
    return this instanceof $Number ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call($.DESC ? $.getNames(Base) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES6 (in case, if modules with ES6 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), function(key){
      if($.has(Base, key) && !$.has($Number, key)){
        $.setDesc($Number, key, $.getDesc(Base, key));
      }
    }
  );
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redef')($.g, NUMBER, $Number);
}
},{"./$":24,"./$.redef":29}],70:[function(require,module,exports){
var $     = require('./$')
  , $def  = require('./$.def')
  , abs   = Math.abs
  , floor = Math.floor
  , _isFinite = $.g.isFinite
  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991;
function isInteger(it){
  return !$.isObject(it) && _isFinite(it) && floor(it) === it;
}
$def($def.S, 'Number', {
  // 20.1.2.1 Number.EPSILON
  EPSILON: Math.pow(2, -52),
  // 20.1.2.2 Number.isFinite(number)
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  },
  // 20.1.2.3 Number.isInteger(number)
  isInteger: isInteger,
  // 20.1.2.4 Number.isNaN(number)
  isNaN: function isNaN(number){
    return number != number;
  },
  // 20.1.2.5 Number.isSafeInteger(number)
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
  },
  // 20.1.2.6 Number.MAX_SAFE_INTEGER
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
  // 20.1.2.10 Number.MIN_SAFE_INTEGER
  MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
  // 20.1.2.12 Number.parseFloat(string)
  parseFloat: parseFloat,
  // 20.1.2.13 Number.parseInt(string, radix)
  parseInt: parseInt
});
},{"./$":24,"./$.def":13}],71:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":6,"./$.def":13}],72:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: require('./$.same')
});
},{"./$.def":13,"./$.same":31}],73:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":13,"./$.set-proto":32}],74:[function(require,module,exports){
var $        = require('./$')
  , $def     = require('./$.def')
  , isObject = $.isObject
  , toObject = $.toObject;
$.each.call(('freeze,seal,preventExtensions,isFrozen,isSealed,isExtensible,' +
  'getOwnPropertyDescriptor,getPrototypeOf,keys,getOwnPropertyNames').split(',')
, function(KEY, ID){
  var fn     = ($.core.Object || {})[KEY] || Object[KEY]
    , forced = 0
    , method = {};
  method[KEY] = ID == 0 ? function freeze(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 1 ? function seal(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 2 ? function preventExtensions(it){
    return isObject(it) ? fn(it) : it;
  } : ID == 3 ? function isFrozen(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 4 ? function isSealed(it){
    return isObject(it) ? fn(it) : true;
  } : ID == 5 ? function isExtensible(it){
    return isObject(it) ? fn(it) : false;
  } : ID == 6 ? function getOwnPropertyDescriptor(it, key){
    return fn(toObject(it), key);
  } : ID == 7 ? function getPrototypeOf(it){
    return fn(Object($.assertDefined(it)));
  } : ID == 8 ? function keys(it){
    return fn(toObject(it));
  } : require('./$.get-names').get;
  try {
    fn('z');
  } catch(e){
    forced = 1;
  }
  $def($def.S + $def.F * forced, 'Object', method);
});
},{"./$":24,"./$.def":13,"./$.get-names":18}],75:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if(require('./$').FW && cof(tmp) != 'z'){
  require('./$.redef')(Object.prototype, 'toString', function toString(){
    return '[object ' + cof.classof(this) + ']';
  }, true);
}
},{"./$":24,"./$.cof":7,"./$.redef":29,"./$.wks":42}],76:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , cof      = require('./$.cof')
  , $def     = require('./$.def')
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , setProto = require('./$.set-proto').set
  , same     = require('./$.same')
  , species  = require('./$.species')
  , SPECIES  = require('./$.wks')('species')
  , RECORD   = require('./$.uid').safe('record')
  , PROMISE  = 'Promise'
  , global   = $.g
  , process  = global.process
  , isNode   = cof(process) == 'process'
  , asap     = process && process.nextTick || require('./$.task').set
  , P        = global[PROMISE]
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj
  , Wrapper;

function testResolve(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
}

var useNative = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = isFunction(P) && isFunction(P.resolve) && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && $.DESC){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
function isPromise(it){
  return isObject(it) && (useNative ? cof.classof(it) == 'Promise' : RECORD in it);
}
function sameConstructor(a, b){
  // library wrapper special case
  if(!$.FW && a === P && b === Wrapper)return true;
  return same(a, b);
}
function getConstructor(C){
  var S = assertObject(C)[SPECIES];
  return S != undefined ? S : C;
}
function isThenable(it){
  var then;
  if(isObject(it))then = it.then;
  return isFunction(then) ? then : false;
}
function notify(record){
  var chain = record.c;
  // strange IE + webpack dev server bug - use .call(global)
  if(chain.length)asap.call(global, function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    function run(react){
      var cb = ok ? react.ok : react.fail
        , ret, then;
      try {
        if(cb){
          if(!ok)record.h = true;
          ret = cb === true ? value : cb(value);
          if(ret === react.P){
            react.rej(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(ret)){
            then.call(ret, react.res, react.rej);
          } else react.res(ret);
        } else react.rej(value);
      } catch(err){
        react.rej(err);
      }
    }
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
  });
}
function isUnhandled(promise){
  var record = promise[RECORD]
    , chain  = record.a || record.c
    , i      = 0
    , react;
  if(record.h)return false;
  while(chain.length > i){
    react = chain[i++];
    if(react.fail || !isUnhandled(react.P))return false;
  } return true;
}
function $reject(value){
  var record = this
    , promise;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  setTimeout(function(){
    // strange IE + webpack dev server bug - use .call(global)
    asap.call(global, function(){
      if(isUnhandled(promise = record.p)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(global.console && console.error){
          console.error('Unhandled promise rejection', value);
        }
      }
      record.a = undefined;
    });
  }, 1);
  notify(record);
}
function $resolve(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(then = isThenable(value)){
      // strange IE + webpack dev server bug - use .call(global)
      asap.call(global, function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
}

// constructor polyfill
if(!useNative){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    assertFunction(executor);
    var record = {
      p: assert.inst(this, P, PROMISE),       // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false                                // <- handled rejection
    };
    $.hide(this, RECORD, record);
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.mix')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var S = assertObject(assertObject(this).constructor)[SPECIES];
      var react = {
        ok:   isFunction(onFulfilled) ? onFulfilled : true,
        fail: isFunction(onRejected)  ? onRejected  : false
      };
      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
        react.res = assertFunction(res);
        react.rej = assertFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      if(record.a)record.a.push(react);
      if(record.s)notify(record);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

// export
$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
cof.set(P, PROMISE);
species(P);
species(Wrapper = $.core[PROMISE]);

// statics
$def($def.S + $def.F * !useNative, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    return new (getConstructor(this))(function(res, rej){ rej(r); });
  }
});
$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    return isPromise(x) && sameConstructor(x.constructor, this)
      ? x : new this(function(res){ res(x); });
  }
});
$def($def.S + $def.F * !(useNative && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(res, rej){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || res(results);
        }, rej);
      });
      else res(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C = getConstructor(this);
    return new C(function(res, rej){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(res, rej);
      });
    });
  }
});
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.ctx":12,"./$.def":13,"./$.for-of":16,"./$.iter-detect":22,"./$.mix":26,"./$.same":31,"./$.set-proto":32,"./$.species":34,"./$.task":38,"./$.uid":40,"./$.wks":42}],77:[function(require,module,exports){
var $         = require('./$')
  , $def      = require('./$.def')
  , setProto  = require('./$.set-proto')
  , $iter     = require('./$.iter')
  , ITERATOR  = require('./$.wks')('iterator')
  , ITER      = require('./$.uid').safe('iter')
  , step      = $iter.step
  , assert    = require('./$.assert')
  , isObject  = $.isObject
  , getProto  = $.getProto
  , $Reflect  = $.g.Reflect
  , _apply    = Function.apply
  , assertObject = assert.obj
  , _isExtensible = Object.isExtensible || isObject
  , _preventExtensions = Object.preventExtensions
  // IE TP has broken Reflect.enumerate
  , buggyEnumerate = !($Reflect && $Reflect.enumerate && ITERATOR in $Reflect.enumerate({}));

function Enumerate(iterated){
  $.set(this, ITER, {o: iterated, k: undefined, i: 0});
}
$iter.create(Enumerate, 'Object', function(){
  var iter = this[ITER]
    , keys = iter.k
    , key;
  if(keys == undefined){
    iter.k = keys = [];
    for(key in iter.o)keys.push(key);
  }
  do {
    if(iter.i >= keys.length)return step(1);
  } while(!((key = keys[iter.i++]) in iter.o));
  return step(0, key);
});

var reflect = {
  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  },
  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
  construct: function construct(target, argumentsList /*, newTarget*/){
    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = _apply.call(target, instance, argumentsList);
    return isObject(result) ? result : instance;
  },
  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
  defineProperty: function defineProperty(target, propertyKey, attributes){
    assertObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  },
  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = $.getDesc(assertObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  },
  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
  get: function get(target, propertyKey/*, receiver*/){
    var receiver = arguments.length < 3 ? target : arguments[2]
      , desc = $.getDesc(assertObject(target), propertyKey), proto;
    if(desc)return $.has(desc, 'value')
      ? desc.value
      : desc.get === undefined
        ? undefined
        : desc.get.call(receiver);
    return isObject(proto = getProto(target))
      ? get(proto, propertyKey, receiver)
      : undefined;
  },
  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(assertObject(target), propertyKey);
  },
  // 26.1.8 Reflect.getPrototypeOf(target)
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(assertObject(target));
  },
  // 26.1.9 Reflect.has(target, propertyKey)
  has: function has(target, propertyKey){
    return propertyKey in target;
  },
  // 26.1.10 Reflect.isExtensible(target)
  isExtensible: function isExtensible(target){
    return _isExtensible(assertObject(target));
  },
  // 26.1.11 Reflect.ownKeys(target)
  ownKeys: require('./$.own-keys'),
  // 26.1.12 Reflect.preventExtensions(target)
  preventExtensions: function preventExtensions(target){
    assertObject(target);
    try {
      if(_preventExtensions)_preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  },
  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
  set: function set(target, propertyKey, V/*, receiver*/){
    var receiver = arguments.length < 4 ? target : arguments[3]
      , ownDesc  = $.getDesc(assertObject(target), propertyKey)
      , existingDescriptor, proto;
    if(!ownDesc){
      if(isObject(proto = getProto(target))){
        return set(proto, propertyKey, V, receiver);
      }
      ownDesc = $.desc(0);
    }
    if($.has(ownDesc, 'value')){
      if(ownDesc.writable === false || !isObject(receiver))return false;
      existingDescriptor = $.getDesc(receiver, propertyKey) || $.desc(0);
      existingDescriptor.value = V;
      $.setDesc(receiver, propertyKey, existingDescriptor);
      return true;
    }
    return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
  }
};
// 26.1.14 Reflect.setPrototypeOf(target, proto)
if(setProto)reflect.setPrototypeOf = function setPrototypeOf(target, proto){
  setProto.check(target, proto);
  try {
    setProto.set(target, proto);
    return true;
  } catch(e){
    return false;
  }
};

$def($def.G, {Reflect: {}});

$def($def.S + $def.F * buggyEnumerate, 'Reflect', {
  // 26.1.5 Reflect.enumerate(target)
  enumerate: function enumerate(target){
    return new Enumerate(assertObject(target));
  }
});

$def($def.S, 'Reflect', reflect);
},{"./$":24,"./$.assert":5,"./$.def":13,"./$.iter":23,"./$.own-keys":27,"./$.set-proto":32,"./$.uid":40,"./$.wks":42}],78:[function(require,module,exports){
var $       = require('./$')
  , cof     = require('./$.cof')
  , $RegExp = $.g.RegExp
  , Base    = $RegExp
  , proto   = $RegExp.prototype
  , re      = /a/g
  // "new" creates a new object
  , CORRECT_NEW = new $RegExp(re) !== re
  // RegExp allows a regex with flags as the pattern
  , ALLOWS_RE_WITH_FLAGS = function(){
    try {
      return $RegExp(re, 'i') == '/a/i';
    } catch(e){ /* empty */ }
  }();
if($.FW && $.DESC){
  if(!CORRECT_NEW || !ALLOWS_RE_WITH_FLAGS){
    $RegExp = function RegExp(pattern, flags){
      var patternIsRegExp  = cof(pattern) == 'RegExp'
        , flagsIsUndefined = flags === undefined;
      if(!(this instanceof $RegExp) && patternIsRegExp && flagsIsUndefined)return pattern;
      return CORRECT_NEW
        ? new Base(patternIsRegExp && !flagsIsUndefined ? pattern.source : pattern, flags)
        : new Base(patternIsRegExp ? pattern.source : pattern
          , patternIsRegExp && flagsIsUndefined ? pattern.flags : flags);
    };
    $.each.call($.getNames(Base), function(key){
      key in $RegExp || $.setDesc($RegExp, key, {
        configurable: true,
        get: function(){ return Base[key]; },
        set: function(it){ Base[key] = it; }
      });
    });
    proto.constructor = $RegExp;
    $RegExp.prototype = proto;
    require('./$.redef')($.g, 'RegExp', $RegExp);
  }
  // 21.2.5.3 get RegExp.prototype.flags()
  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
    configurable: true,
    get: require('./$.replacer')(/^.*\/(\w*)$/, '$1')
  });
}
require('./$.species')($RegExp);
},{"./$":24,"./$.cof":7,"./$.redef":29,"./$.replacer":30,"./$.species":34}],79:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments[0]); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":11,"./$.collection-strong":8}],80:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(false);
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":35}],81:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def')
  , toLength = $.toLength;

// should throw error on regex
$def($def.P + $def.F * !require('./$.throws')(function(){ 'q'.endsWith(/./); }), 'String', {
  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that = String($.assertDefined(this))
      , endPosition = arguments[1]
      , len = toLength(that.length)
      , end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    searchString += '';
    return that.slice(end - searchString.length, end) === searchString;
  }
});
},{"./$":24,"./$.cof":7,"./$.def":13,"./$.throws":39}],82:[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$').toIndex
  , fromCharCode = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res = []
      , len = arguments.length
      , i   = 0
      , code;
    while(len > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$":24,"./$.def":13}],83:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.7 String.prototype.includes(searchString, position = 0)
  includes: function includes(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
  }
});
},{"./$":24,"./$.cof":7,"./$.def":13}],84:[function(require,module,exports){
var set   = require('./$').set
  , $at   = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step;

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  set(this, ITER, {o: String(iterated), i: 0});
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , index = iter.i
    , point;
  if(index >= O.length)return step(1);
  point = $at(O, index);
  iter.i += point.length;
  return step(0, point);
});
},{"./$":24,"./$.iter":23,"./$.iter-define":21,"./$.string-at":35,"./$.uid":40}],85:[function(require,module,exports){
var $    = require('./$')
  , $def = require('./$.def');

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl = $.toObject(callSite.raw)
      , len = $.toLength(tpl.length)
      , sln = arguments.length
      , res = []
      , i   = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < sln)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./$":24,"./$.def":13}],86:[function(require,module,exports){
var $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.def":13,"./$.string-repeat":37}],87:[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

// should throw error on regex
$def($def.P + $def.F * !require('./$.throws')(function(){ 'q'.startsWith(/./); }), 'String', {
  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
  startsWith: function startsWith(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that  = String($.assertDefined(this))
      , index = $.toLength(Math.min(arguments[1], that.length));
    searchString += '';
    return that.slice(index, index + searchString.length) === searchString;
  }
});
},{"./$":24,"./$.cof":7,"./$.def":13,"./$.throws":39}],88:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , shared   = require('./$.shared')
  , $def     = require('./$.def')
  , $redef   = require('./$.redef')
  , keyOf    = require('./$.keyof')
  , enumKeys = require('./$.enum-keys')
  , assertObject = require('./$.assert').obj
  , ObjectProto = Object.prototype
  , DESC     = $.DESC
  , has      = $.has
  , $create  = $.create
  , getDesc  = $.getDesc
  , setDesc  = $.setDesc
  , desc     = $.desc
  , $names   = require('./$.get-names')
  , getNames = $names.get
  , toObject = $.toObject
  , $Symbol  = $.g.Symbol
  , setter   = false
  , TAG      = uid('tag')
  , HIDDEN   = uid('hidden')
  , _propertyIsEnumerable = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols = shared('symbols')
  , useNative = $.isFunction($Symbol);

var setSymbolDesc = DESC ? function(){ // fallback for old Android
  try {
    return $create(setDesc({}, HIDDEN, {
      get: function(){
        return setDesc(this, HIDDEN, {value: false})[HIDDEN];
      }
    }))[HIDDEN] || setDesc;
  } catch(e){
    return function(it, key, D){
      var protoDesc = getDesc(ObjectProto, key);
      if(protoDesc)delete ObjectProto[key];
      setDesc(it, key, D);
      if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
    };
  }
}() : setDesc;

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($create($Symbol.prototype), TAG, tag);
  DESC && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, desc(1, value));
    }
  });
  return sym;
}

function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, desc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = $create(D, {enumerable: desc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
}
function defineProperties(it, P){
  assertObject(it);
  var keys = enumKeys(P = toObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)defineProperty(it, key = keys[i++], P[key]);
  return it;
}
function create(it, P){
  return P === undefined ? $create(it) : defineProperties($create(it), P);
}
function propertyIsEnumerable(key){
  var E = _propertyIsEnumerable.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
}
function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
}
function getOwnPropertyNames(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
}
function getOwnPropertySymbols(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
}

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments[0]));
  };
  $redef($Symbol.prototype, 'toString', function(){
    return this[TAG];
  });

  $.create     = create;
  $.setDesc    = defineProperty;
  $.getDesc    = getOwnPropertyDescriptor;
  $.setDescs   = defineProperties;
  $.getNames   = $names.get = getOwnPropertyNames;
  $.getSymbols = getOwnPropertySymbols;

  if($.DESC && $.FW)$redef(ObjectProto, 'propertyIsEnumerable', propertyIsEnumerable, true);
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
    'species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), function(it){
    var sym = require('./$.wks')(it);
    symbolStatics[it] = useNative ? sym : wrap(sym);
  }
);

setter = true;

$def($def.G + $def.W, {Symbol: $Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: getOwnPropertySymbols
});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":24,"./$.assert":5,"./$.cof":7,"./$.def":13,"./$.enum-keys":15,"./$.get-names":18,"./$.keyof":25,"./$.redef":29,"./$.shared":33,"./$.uid":40,"./$.wks":42}],89:[function(require,module,exports){
'use strict';
var $         = require('./$')
  , weak      = require('./$.collection-weak')
  , leakStore = weak.leakStore
  , ID        = weak.ID
  , WEAK      = weak.WEAK
  , has       = $.has
  , isObject  = $.isObject
  , isExtensible = Object.isExtensible || isObject
  , tmp       = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments[0]); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return leakStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this[ID]];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    require('./$.redef')(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = leakStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":24,"./$.collection":11,"./$.collection-weak":10,"./$.redef":29}],90:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments[0]); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":11,"./$.collection-weak":10}],91:[function(require,module,exports){
'use strict';
var $def      = require('./$.def')
  , $includes = require('./$.array-includes')(true);
$def($def.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments[1]);
  }
});
require('./$.unscope')('includes');
},{"./$.array-includes":3,"./$.def":13,"./$.unscope":41}],92:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Map');
},{"./$.collection-to-json":9}],93:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $       = require('./$')
  , $def    = require('./$.def')
  , ownKeys = require('./$.own-keys');

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O      = $.toObject(object)
      , result = {};
    $.each.call(ownKeys(O), function(key){
      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
    });
    return result;
  }
});
},{"./$":24,"./$.def":13,"./$.own-keys":27}],94:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $    = require('./$')
  , $def = require('./$.def');
function createObjectToArray(isEntries){
  return function(object){
    var O      = $.toObject(object)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = Array(length)
      , key;
    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
    else while(length > i)result[i] = O[keys[i++]];
    return result;
  };
}
$def($def.S, 'Object', {
  values:  createObjectToArray(false),
  entries: createObjectToArray(true)
});
},{"./$":24,"./$.def":13}],95:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/[\/\\^$*+?.()|[\]{}]/g, '\\$&', true)
});
},{"./$.def":13,"./$.replacer":30}],96:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
require('./$.collection-to-json')('Set');
},{"./$.collection-to-json":9}],97:[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
'use strict';
var $def = require('./$.def')
  , $at  = require('./$.string-at')(true);
$def($def.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.def":13,"./$.string-at":35}],98:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  lpad: function lpad(n){
    return $pad(this, n, arguments[1], true);
  }
});
},{"./$.def":13,"./$.string-pad":36}],99:[function(require,module,exports){
'use strict';
var $def = require('./$.def')
  , $pad = require('./$.string-pad');
$def($def.P, 'String', {
  rpad: function rpad(n){
    return $pad(this, n, arguments[1], false);
  }
});
},{"./$.def":13,"./$.string-pad":36}],100:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $def    = require('./$.def')
  , $Array  = $.core.Array || Array
  , statics = {};
function setStatics(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = require('./$.ctx')(Function.call, [][key], length);
  });
}
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill,turn');
$def($def.S, 'Array', statics);
},{"./$":24,"./$.ctx":12,"./$.def":13}],101:[function(require,module,exports){
require('./es6.array.iterator');
var $           = require('./$')
  , Iterators   = require('./$.iter').Iterators
  , ITERATOR    = require('./$.wks')('iterator')
  , ArrayValues = Iterators.Array
  , NL          = $.g.NodeList
  , HTC         = $.g.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype;
if($.FW){
  if(NL && !(ITERATOR in NLProto))$.hide(NLProto, ITERATOR, ArrayValues);
  if(HTC && !(ITERATOR in HTCProto))$.hide(HTCProto, ITERATOR, ArrayValues);
}
Iterators.NodeList = Iterators.HTMLCollection = ArrayValues;
},{"./$":24,"./$.iter":23,"./$.wks":42,"./es6.array.iterator":62}],102:[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":13,"./$.task":38}],103:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var $         = require('./$')
  , $def      = require('./$.def')
  , invoke    = require('./$.invoke')
  , partial   = require('./$.partial')
  , navigator = $.g.navigator
  , MSIE      = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
function wrap(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      $.isFunction(fn) ? fn : Function(fn)
    ), time);
  } : set;
}
$def($def.G + $def.B + $def.F * MSIE, {
  setTimeout:  wrap($.g.setTimeout),
  setInterval: wrap($.g.setInterval)
});
},{"./$":24,"./$.def":13,"./$.invoke":19,"./$.partial":28}],104:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.statics-accept-primitives');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.statics');
require('./modules/es6.math');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.lpad');
require('./modules/es7.string.rpad');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.to-array');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$').core;

},{"./modules/$":24,"./modules/es5":56,"./modules/es6.array.copy-within":57,"./modules/es6.array.fill":58,"./modules/es6.array.find":60,"./modules/es6.array.find-index":59,"./modules/es6.array.from":61,"./modules/es6.array.iterator":62,"./modules/es6.array.of":63,"./modules/es6.array.species":64,"./modules/es6.function.has-instance":65,"./modules/es6.function.name":66,"./modules/es6.map":67,"./modules/es6.math":68,"./modules/es6.number.constructor":69,"./modules/es6.number.statics":70,"./modules/es6.object.assign":71,"./modules/es6.object.is":72,"./modules/es6.object.set-prototype-of":73,"./modules/es6.object.statics-accept-primitives":74,"./modules/es6.object.to-string":75,"./modules/es6.promise":76,"./modules/es6.reflect":77,"./modules/es6.regexp":78,"./modules/es6.set":79,"./modules/es6.string.code-point-at":80,"./modules/es6.string.ends-with":81,"./modules/es6.string.from-code-point":82,"./modules/es6.string.includes":83,"./modules/es6.string.iterator":84,"./modules/es6.string.raw":85,"./modules/es6.string.repeat":86,"./modules/es6.string.starts-with":87,"./modules/es6.symbol":88,"./modules/es6.weak-map":89,"./modules/es6.weak-set":90,"./modules/es7.array.includes":91,"./modules/es7.map.to-json":92,"./modules/es7.object.get-own-property-descriptors":93,"./modules/es7.object.to-array":94,"./modules/es7.regexp.escape":95,"./modules/es7.set.to-json":96,"./modules/es7.string.at":97,"./modules/es7.string.lpad":98,"./modules/es7.string.rpad":99,"./modules/js.array.statics":100,"./modules/web.dom.iterable":101,"./modules/web.immediate":102,"./modules/web.timers":103}],105:[function(require,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER

exports.glMatrix = require("./gl-matrix/common.js");
exports.mat2 = require("./gl-matrix/mat2.js");
exports.mat2d = require("./gl-matrix/mat2d.js");
exports.mat3 = require("./gl-matrix/mat3.js");
exports.mat4 = require("./gl-matrix/mat4.js");
exports.quat = require("./gl-matrix/quat.js");
exports.vec2 = require("./gl-matrix/vec2.js");
exports.vec3 = require("./gl-matrix/vec3.js");
exports.vec4 = require("./gl-matrix/vec4.js");
},{"./gl-matrix/common.js":106,"./gl-matrix/mat2.js":107,"./gl-matrix/mat2d.js":108,"./gl-matrix/mat3.js":109,"./gl-matrix/mat4.js":110,"./gl-matrix/quat.js":111,"./gl-matrix/vec2.js":112,"./gl-matrix/vec3.js":113,"./gl-matrix/vec4.js":114}],106:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

// Constants
glMatrix.EPSILON = 0.000001;
glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
glMatrix.RANDOM = Math.random;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}

module.exports = glMatrix;

},{}],107:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.fromRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
mat2.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 


module.exports = mat2;

},{"./common.js":106}],108:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
mat2d.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
mat2d.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

module.exports = mat2d;

},{"./common.js":106}],109:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3x3 Matrix
 * @name mat3
 */
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
mat3.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);

    out[0] = c;
    out[1] = s;
    out[2] = 0;

    out[3] = -s;
    out[4] = c;
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
mat3.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;

    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


module.exports = mat3;

},{"./common.js":106}],110:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4x4 Matrix
 * @name mat4
 */
var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
mat4.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.fromRotation = function(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t;
    
    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    
    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromXRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = 1;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromYRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = 0;
    out[2]  = -s;
    out[3]  = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromZRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = s;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScale = function (out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
  // Quaternion math
  var x = q[0], y = q[1], z = q[2], w = q[3],
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,

      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,
      
      sx = s[0],
      sy = s[1],
      sz = s[2],

      ox = o[0],
      oy = o[1],
      oz = o[2];
      
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;
        
  return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
        Math.abs(eyey - centery) < glMatrix.EPSILON &&
        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


module.exports = mat4;

},{"./common.js":106}],111:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");
var mat3 = require("./mat3.js");
var vec3 = require("./vec3.js");
var vec4 = require("./vec4.js");

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();
  
  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
    
    return out;
  };
}());

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

module.exports = quat;

},{"./common.js":106,"./mat3.js":109,"./vec3.js":113,"./vec4.js":114}],112:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

module.exports = vec2;

},{"./common.js":106}],113:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = function (out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = function (out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
vec3.angle = function(a, b) {
   
    var tempA = vec3.fromValues(a[0], a[1], a[2]);
    var tempB = vec3.fromValues(b[0], b[1], b[2]);
 
    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);
 
    var cosine = vec3.dot(tempA, tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }     
};

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

module.exports = vec3;

},{"./common.js":106}],114:[function(require,module,exports){
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = require("./common.js");

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = glMatrix.RANDOM();
    out[1] = glMatrix.RANDOM();
    out[2] = glMatrix.RANDOM();
    out[3] = glMatrix.RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

module.exports = vec4;

},{"./common.js":106}],115:[function(require,module,exports){
(function(){
    "use strict";

    module.exports = require( './picimo' );

})();

},{"./picimo":128}],116:[function(require,module,exports){
/* global requestAnimationFrame */
(function(){
    "use strict";

    var utils  = require( '../utils' );
    var events = require( '../events' );
    var sg     = require( '../sg' );
    var webgl  = require( '../webgl' );

    /**
     * @class Picimo.App
     * @extends Picimo.events.CustomEvent
     *
     * @classdesc
     *   Create a new picimo app. This is your main app controller.
     *
     *   ##### Initialization
     *
     *   Um eine Picimo App Instanz (und einen WebGL Canvas) zu erzeugen, reicht ein einfacher Aufruf:
     *
     *   ```
     *   var app = new Picimo.App({ *options* });
     *   ```
     *
     *   Es wird ein `<canvas>` Element erzeugt und unterhalb des `<body>` Elements der Seite eingehängt.
     *   Mit der Option **appendTo** kann man an Stelle des `<body>` ein anderes Container Element bestimmen.
     *
     *   Möchte man das `<canvas>` Element selbst erzeugen oder ein vorhandenes verwenden, gibt man dieses einfach als ersten Parameter an:
     *
     *   ```
     *   var app = new Picimo.App(document.getElementById('picimo-canvas'));
     *   ```
     *
     *   oder einfach als **canvas** Option:
     *
     *   ```
     *   var app = new Picimo.App({ canvas: document.getElementById('picimo-canvas') });
     *   ```
     *
     *
     * @param {HTMLCanvasElement|object} [canvas]                   - The canvas dom element or the options.
     * @param {object} [options]                                    - The options.
     * @param {boolean} [options.alpha=false]                       - Create a transparent WebGL canvas.
     * @param {boolean} [options.antialias=false]                   - Enable antialiasing.
     * @param {boolean} [options.stats=false]                       - Create the [ mrdoob/stats.js ]( https://github.com/mrdoob/stats.js/ ) widget and append it to the container element.
     * @param {HTMLCanvasElement} [options.canvas]                  - The canvas dom element.
     * @param {HTMLElement} [options.appendTo=document.body]        - Set the container element. The WebGL Canvas (and the stats element) will be appended to this element. The container element also defines the size of the canvas. If this is the body element you will get an fullscreen WebGL canvas. *When the __canvas__ option is used, this option will be ignored.*
     * @param {string|Picimo.utils.Color} [options.bgColor=#000000] - Background color of the WebGL canvas. Use any CSS color format you like.
     * @param {string} [options.assetBaseUrl]                       - Set the base url prefix for all assets (images, json, ..). As an alternative to this option you could define a global var **PICIMO_ASSET_BASE_URL** before creating your Picimo instance. But the preferred way should be using *assetBaseUrl*!
     */

    function App ( canvas, options ) {

        events.eventize( this );

        /**
         * @member {number} Picimo.App#now - The number of seconds from application start.
         */

        this.now = window.performance.now() / 1000.0;

        if ( typeof canvas === 'object' && ! ( 'nodeName' in canvas ) ) {

            options = canvas;
            canvas  = options.canvas;

        } else if ( options == null ) {

            options = {};

        }

        /**
         * @member {HTMLCanvasElement} Picimo.App#canvas
         */

        canvas = canvas !== undefined ? canvas : document.createElement( "canvas" );
        utils.object.definePropertyPublicRO( this, 'canvas', canvas );

        var parentNode = !! options.appendTo ? options.appendTo : document.body;
        parentNode.appendChild( canvas );
        canvas.classList.add( 'picimo' );


        /**
         * @member {WebGlRenderingContext} Picimo.App#gl
         */

        utils.addGlxProperty( this );

        this.glCtxAttrs = {

            alpha     : ( options.alpha === true ),
            antialias : ( options.antialias === true )

        };

        /**
         * @member {WebGlContext} Picimo.App#glx
         */

        this.glx = createWebGlContext( this );
        this.glx.app = this;

        /**
         * @member {Picimo.utils.Color} Picimo.App#backgroundColor
         */

        this.backgroundColor = new utils.Color( options.bgColor !== undefined ? options.bgColor : ( this.glCtxAttrs.alpha ? 'transparent' : "#000000" ) );

        /**
         * @member {Picimo.webgl.ShaderManager} Picimo.App#shader
         */

        this.shader = new webgl.ShaderManager( this );

        /**
         * @member {Picimo.webgl.WebGlRenderer} Picimo.App#renderer
         */

        this.renderer = new webgl.WebGlRenderer( this );

        /**
         * @member {Picimo.App} Picimo.App#assetBaseUrl - The base url for all assets. May be *undefined*.
         */

        this.assetBaseUrl = window.PICIMO_ASSET_BASE_URL || options.assetBaseUrl;

        /**
         * @member {Picimo.sg.Node} Picimo.App#root - The root node of the scene graph.
         */

        utils.object.definePropertyPublicRO( this, 'root', new sg.Node( this ) );

        /**
         * @member {number} Picimo.App#frameNo - The current frame number.
         */

        this.frameNo = 0;


        this.renderer.initGl();
        this.resize();

        window.addEventListener( 'resize', this.resize.bind( this ), false );

        this.onAnimationFrame = this.renderFrame.bind( this );
        requestAnimationFrame( this.onAnimationFrame );

    }

    /**
     * @member {number} Picimo.App#devicePixelRatio - The device pixel ratio.
     */

    utils.object.definePropertyPublicRO( App.prototype, 'devicePixelRatio', ( window.devicePixelRatio || 1 ) );


    /**
     * @method Picimo.App#resize
     */

    App.prototype.resize = function () {

        var w = Math.round( this.canvas.parentNode.clientWidth * this.devicePixelRatio );
        var h = Math.round( this.canvas.parentNode.clientHeight * this.devicePixelRatio );

        if ( this.width !== w || this.height !== h ) {

            /**
             * @member {number} Picimo.App#width - The _real_ device pixel width.
             */

            this.width = w;

            /**
             * @member {number} Picimo.App#height - The _real_ device pixel height.
             */

            this.height = h;

            if ( this.renderer ) {

                this.renderer.resize();

            }

            if ( this.canvas.width !== w || this.canvas.height !== h ) {

                this.canvas.width  = w;
                this.canvas.height = h;

                this.canvas.style.width  = Math.round( w / this.devicePixelRatio ) + "px";
                this.canvas.style.height = Math.round( h / this.devicePixelRatio ) + "px";

                // TODO resize
                //if ( this.root && this.scene.resize ) {
                    //this.scene.resize(this.glx, w, h);
                //}

            }
        }

    };


    /**
     * @method Picimo.App#renderFrame
     */

    App.prototype.renderFrame = function () {

        this.now = window.performance.now() / 1000.0;
        ++this.frameNo;

        this.renderer.beginFrame();

        if ( this.root ) {

            this.root.renderFrame();

        }

        this.renderer.endFrame();

        requestAnimationFrame( this.onAnimationFrame );

    };


    function createWebGlContext ( app ) {

        var gl;

        try {

            gl = app.canvas.getContext( "webgl", app.glCtxAttrs ) ||
                 app.canvas.getContext( "experimental-webgl", app.glCtxAttrs );

        } catch ( err ) {

            console.error( err );

        }

        if ( ! gl ) {

            throw new Error( "Could not initialize the WebGL context!" );

        }

        return new webgl.WebGlContext( gl );

    }


    module.exports = App;

})();

},{"../events":127,"../sg":129,"../utils":139,"../webgl":146}],117:[function(require,module,exports){
(function(){
    "use strict";

    //var vec2 = require( 'gl-matrx' ).vec2;

    /**
     * Represents a 2d axis aligned boundary box.
     * @class Picimo.core.AABB2
     * @param {number} [x0=0] - x0
     * @param {number} [x1=0] - x1
     * @param {number} [y0=0] - y0
     * @param {number} [y1=0] - y1
     */

    function AABB2 ( x0, x1, y0, y1 ) {

        if ( x0 === undefined ) x0 = 0;
        if ( y0 === undefined ) y0 = 0;
        if ( x1 === undefined ) x1 = 0;
        if ( y1 === undefined ) y1 = 0;

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#min_x - Minimum x value
         */

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#max_x - Maximum x value
         */

        if ( x0 < x1 ) {

            this.min_x = x0;
            this.max_x = x1;

        } else {

            this.min_x = x1;
            this.max_x = x0;

        }

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#min_y - Minimum y value
         */

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#max_y - Maximum y value
         */

        if ( y0 < y1 ) {

            this.min_y = y0;
            this.max_y = y1;

        } else {

            this.min_y = y1;
            this.max_y = y0;

        }

        Object.seal( this );

    }


    Object.defineProperties( AABB2.prototype, {

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#width
         * @readonly
         */
        'width': {
            get: function () { return this.max_x - this.min_x + 1; },
            enumerable: true
        },

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#height
         * @readonly
         */
        'height': {
            get: function () { return this.max_y - this.min_y + 1; },
            enumerable: true
        },

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#center_x
         * @readonly
         */
        'center_x': {
            get: function () { return ( this.max_x - this.min_x ) / 2; },
            enumerable: true
        },

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#center_y
         * @readonly
         */
        'center_y': {
            get: function () { return ( this.max_y - this.min_y ) / 2; },
            enumerable: true
        }

    });


    /**
     * Extend the boundary box.
     * @method Picimo.core.AABB2#addPoint
     * @param {number} x - x
     * @param {number} y - y
     */

    AABB2.prototype.addPoint = function ( x, y ) {

        if ( x < this.min_x ) {

            this.min_x = x;

        } else if ( x > this.max_x ) {

            this.max_x = x;

        }

        if ( y < this.min_y ) {

            this.min_y = y;

        } else if ( y > this.max_y ) {

            this.max_y = y;

        }

    };


    /**
     * Determinates wether or the 2d point is inside this AABB.
     * @method Picimo.core.AABB2#isInside
     * @param {number} x - x
     * @param {number} y - y
     * @return {boolean}
     */

    AABB2.prototype.isInside = function ( x, y ) {

        if ( x >= this.min_x && x <= this.max_x &&
             y >= this.min_y && y <= this.max_y ) {

            return true;

        }

        return false;

    };


    /**
     * Determinates wether or not this AABB intersects *aabb*.
     * @method Picimo.core.AABB2#isIntersection
     * @param {AABB2} aabb - aabb
     * @return {boolean}
     */

    AABB2.prototype.isIntersection = function ( aabb ) {

        if ( aabb.max_x < this.min_x || aabb.min_x > this.max_x ||
             aabb.max_y < this.min_y || aabb.min_y > this.max_y ) {

            return false;

        }

        return true;

    };


    module.exports = AABB2;

})();

},{}],118:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.core
     */

    module.exports = {

        AABB2                  : require( './aabb2' ),
        Viewport               : require( './viewport' ),

        Texture                : require( './texture' ),

        VertexArray            : require( './vertex_array' ),
        VertexIndexArray       : require( './vertex_index_array' ),

        VertexObject           : require( './vertex_object' ),
        VertexObjectDescriptor : require( './vertex_object_descriptor' ),
        VertexObjectPool       : require( './vertex_object_pool' )

    };

})();

},{"./aabb2":117,"./texture":119,"./vertex_array":120,"./vertex_index_array":121,"./vertex_object":122,"./vertex_object_descriptor":123,"./vertex_object_pool":124,"./viewport":125}],119:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @class Picimo.core.Texture
     * @param {Picimo.core.Texture} [parent]
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [width]
     * @param {number} [height]
     * @example
     * var t = new Picimo.core.Texture;
     * t.image = document.createElement("canvas")
     * t.width                                       // => 300
     * t.height                                      // => 150
     *
     * var tt = new Picimo.core.Texture( t, 30, 15, 100, 100 )
     * t.width                                       // => 100
     *
     */

    function Texture ( parent, x, y, width, height ) {

        this._parent = parent;
        this._image  = null;
        this._width  = width;
        this._height = height;

        /**
         * @member {number} Picimo.core.Texture#x
         */
        this.x = x != null ? x : 0;

        /**
         * @member {number} Picimo.core.Texture#y
         */
        this.y = y != null ? y : 0;

    }


    Object.defineProperties( Texture.prototype, {

        /**
         * @member {Picimo.core.Texture} Picimo.core.Texture#parent
         */

        parent: {

            get: function () { return this._parent; },

            set: function ( parent ) {

                if ( parent != null && this._image != null ) {

                    throw new Error( "Texture can have a parent or an image but not both!" );

                }

                this._parent = parent;

            },

            enumerable: true

        },

        /**
         * @member {Picimo.core.Texture} Picimo.core.Texture#root
         * @readonly
         */

        root: {

            get: function () {

                return this._parent ? this._parent : this;
            
            },

            enumerable: true

        },

        /**
         * @member {Image|Canvas} Picimo.core.Texture#image
         */

        image: {

            get: function () {

                return this._parent ? this._parent.image : this._image;

            },

            set: function ( image ) {

                if ( image != null && this._parent != null ) {

                    throw new Error( "Texture can have a parent or an image but not both!" );

                }

                this._image = image;

            },

            enumerable: true

        },

        /**
         * @member {number} Picimo.core.Texture#width
         */

        width: {

            get: function () {

                if ( this._width != null ) {

                    return this._width;

                }

                var image = this.image;

                if ( image ) {

                    return image.width;

                }

                return 0;

            },

            set: function ( width ) {

                this._width = width;

            },

            enumerable: true

        },

        /**
         * @member {number} Picimo.core.Texture#height
         */

        height: {

            get: function () {

                if ( this._height != null ) {

                    return this._height;

                }

                var image = this.image;

                if ( image ) {

                    return image.height;

                }

                return 0;

            },

            set: function ( height ) {

                this._height = height;

            },

            enumerable: true

        },

        /**
         * @member {number} Picimo.core.Texture#min_s
         * @readonly
         */

        min_s: {

            get: function () {

                var x = this.x;
                var tex = this;

                while ( ( tex = tex.parent ) != null ) {

                    x += tex.x;

                }

                return x / this.image.width;

            },

            enumerable: true

        },

        /**
         * @member {number} Picimo.core.Texture#min_t
         * @readonly
         */

        min_t: {

            get: function () {

                var y = this.y;
                var tex = this;

                while ( ( tex = tex.parent ) != null ) {

                    y += tex.y;

                }

                return y / this.image.height;

            },

            enumerable: true

        },

        /**
         * @member {number} Picimo.core.Texture#max_s
         * @readonly
         */

        max_s: {

            get: function () {

                var x = this.x + this.width;
                var tex = this;

                while ( ( tex = tex.parent ) != null ) {

                    x += tex.x;

                }

                return x / this.image.width;

            },

            enumerable: true

        },

        /**
         * @member {number} Picimo.core.Texture#max_t
         * @readonly
         */

        max_t: {

            get: function () {

                var y = this.y + this.height;
                var tex = this;

                while ( ( tex = tex.parent ) != null ) {

                    y += tex.y;

                }

                return y / this.image.height;

            },

            enumerable: true

        },

    });


    /**
     * @method Picimo.core.Texture#setTexCoords
     * @param {Object} obj - Any object which has a `.setTexCoords()` method
     */

    Texture.prototype.setTexCoords = function ( obj ) {

        var x0 = this.min_s;
        var y0 = this.min_t;
        var x1 = this.max_s;
        var y1 = this.max_t;

        obj.setTexCoords(
            x0, y0,
            x1, y0,
            x1, y1,
            x0, y1 );
    
    };


    module.exports = Texture;

})();

},{}],120:[function(require,module,exports){
/* global Float32Array */
(function(){
    "use strict";

    /**
     * @class Picimo.core.VertexArray
     * @param {Picimo.core.VertexObjectDescriptor} descriptor - The descriptor.
     * @param {number} capacity - Maximum number of vertex objects
     * @param {Float32Array} [vertices]
     */
    function VertexArray ( descriptor, capacity, vertices ) {

        this.descriptor = descriptor;
        this.capacity   = capacity;

        /**
         * @member {Float32Array} Picimo.core.VertexArray#vertices - The float array buffer.
         */

        if ( vertices !== undefined ) {

            this.vertices = vertices;

        } else {

            this.vertices = new Float32Array( capacity * descriptor.vertexCount * descriptor.vertexAttrCount );

        }

    }

    /**
     * @method Picimo.core.VertexArray#copy
     * @param {Picimo.core.VertexArray} fromVertexArray
     * @param {number} [toOffset=0] - Vertex object offset
     */
    VertexArray.prototype.copy = function ( fromVertexArray, toOffset ) {

        var offset = 0;

        if ( toOffset === undefined ) {

            offset = toOffset * this.descriptor.vertexCount * this.descriptor.vertexAttrCount;

        }

        this.vertices.set( fromVertexArray.vertices, offset );

    };

    /**
     * @method Picimo.core.VertexArray#subarray
     * @param {number} begin - Index of first vertex object
     * @param {number} [size=1] -
     * @return {Picimo.core.VertexArray}
     */
    VertexArray.prototype.subarray = function ( begin, size ) {

        if ( size === undefined ) {

            size = 1;

        }

        var vertices = this.vertices.subarray(
                begin * this.descriptor.vertexCount * this.descriptor.vertexAttrCount,
                (begin + size) * this.descriptor.vertexCount * this.descriptor.vertexAttrCount );

        return new VertexArray( this.descriptor, size, vertices );

    };


    module.exports = VertexArray;

})();

},{}],121:[function(require,module,exports){
/* global Uint32Array */
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.core.VertexIndexArray
     * @param {number} vertexObjectCount - Number of vertex objects
     * @param {number} objectIndexCount - Number of vertex indices per object
     */
    function VertexIndexArray ( vertexObjectCount, objectIndexCount ) {

        var size = vertexObjectCount * objectIndexCount;

        utils.object.definePropertiesPublicRO( this, {
        
            /**
             * @member {number} Picimo.core.VertexIndexArray#vertexObjectCount - Number of vertex objects.
             * @readonly
             */
            vertexObjectCount: vertexObjectCount,

            /**
             * @member {number} Picimo.core.VertexIndexArray#objectIndexCount - Number of vertex indices per object.
             * @readonly
             */
            objectIndexCount: objectIndexCount,

            /**
             * @member {number} Picimo.core.VertexIndexArray#size - Size of array buffer.
             * @readonly
             */
            size: size,

            /**
             * @member {Uint32Array} Picimo.core.VertexIndexArray#indices - The uint index array buffer.
             * @readonly
             */
            indices: new Uint32Array( size )
        
        });

    }


    /**
     * @function Picimo.core.VertexIndexArray.Generate
     * @param {number} vertexObjectCount
     * @param {Array} indices
     * @return {Picimo.core.VertexIndexArray}
     * @example
     * // create a vertex index buffer for ten quads where each quad is constructed of two triangles
     * var quadIndices = Picimo.core.VertexIndexArray.Generate( 10, [ 0,1,2, 0,2,3 ] );
     * quadIndices.size                 // => 60
     * quadIndices.objectIndexCount     // => 6
     *
     */
    VertexIndexArray.Generate = function ( vertexObjectCount, indices ) {

        var arr = new VertexIndexArray( vertexObjectCount, indices.length );
        var i, j;

        for ( i = 0; i < vertexObjectCount; ++i ) {

            for ( j = 0; j < indices.length; ++j ) {

                arr[ ( i * arr.objectIndexCount ) + j ] = indices[ j ] + ( i * arr.objectIndexCount );

            }

        }

        return arr;

    };


    module.exports = VertexIndexArray;

})();

},{"../utils":139}],122:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.core.VertexObject
     * @param {Picimo.core.VertexObjectDescriptor} [descriptor] - Vertex descriptor.
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     */
    function VertexObject ( descriptor, vertexArray ) {

        if ( this.descriptor !== undefined ) return;

        /**
         * @member {Picimo.core.VertexObjectDescriptor} Picimo.core.VertexObject#descriptor - Vertex object descriptor.
         * @readonly
         */

        var _descriptor = ( !! descriptor ) ? descriptor : ( ( !! vertexArray ) ? vertexArray.descriptor : null );
        if ( ! _descriptor ) {

            throw new Error( 'VertexObject.descriptor is null!' );

        }
        utils.object.definePropertyPrivateRO( this, 'descriptor', _descriptor );

        /** @member {Picimo.core.VertexArray} Picimo.core.VertexObject#vertexArray - Vertex array. */
        var _vertexArray = ( !! vertexArray ) ? vertexArray : descriptor.createVertexArray();
        utils.object.definePropertyPrivate( this, 'vertexArray', _vertexArray );

        if ( this.descriptor !== this.vertexArray.descriptor && ( this.descriptor.vertexCount !== this.vertexArray.descriptor.vertexCount || this.descriptor.vertexAttrCount !== this.vertexArray.descriptor.vertexAttrCount) ) {

            throw new Error( 'Incompatible vertex object descriptors!' );

        }

    }

    Object.defineProperties( VertexObject.prototype, {

        'vertices': {
            get: function () {

                return this.vertexArray.vertices;

            }
        }

    });

    module.exports = VertexObject;

})();

},{"../utils":139}],123:[function(require,module,exports){
(function(){
    "use strict";

    //var utils = require( '../utils' );
    var VertexObject = require( './vertex_object' );
    var VertexArray = require( './vertex_array' );

    /**
     * @class Picimo.core.VertexObjectDescriptor
     * @param {function} vertexObjectConstructor - Vertex object constructor function
     * @param {number} vertexCount - Vertex count
     * @param {number} vertexAttrCount - Vertex attribute count
     * @param {Array} attributes - Vertex attribute descriptions
     * @param {Object} [aliases] - Vertex attribute aliases
     * @example
     * var descriptor = new Picimo.core.VertexObjectDescriptor(
     *
     *     null,
     *
     *     4,   // vertexCount
     *     12,  // vertexAttrCount
     *
     *     [    // attributes ..
     *
     *         { name: 'position',  size: 3, attrNames: [ 'x', 'y', 'z' ] },
     *         { name: 'rotate',    size: 1, uniform: true },
     *         { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },
     *         { name: 'translate', size: 2, attrNames: [ 'tx', 'ty' ], uniform: true },
     *         { name: 'scale',     size: 1, uniform: true },
     *         { name: 'opacity',   size: 1, uniform: true }
     *
     *     ],
     *
     *     {   // aliases ..
     *
     *         pos2d: { size: 2, offset: 0 },
     *         posZ:  { size: 1, offset: 2, uniform: true },
     *         uv:    'texCoords'
     *
     *     }
     *
     * );
     *
     * vo.proto.numberOfBeast = function () { return 666; };
     *
     *
     * var vo = descriptor.create();
     *
     * vo.setPosition( 1,2,-1, 4,5,-1, 7,8,-1, 10,11,-1 );
     * vo.x2                // => 7
     * vo.y0                // => 2
     * vo.posZ              // => -1
     * vo.posZ = 23;
     * vo.z1                // => 23
     * vo.numberOfBeast()   // => 666
     *
     */
    function VertexObjectDescriptor ( vertexObjectConstructor, vertexCount, vertexAttrCount, attributes, aliases ) {

        this.vertexObjectConstructor = typeof vertexObjectConstructor === 'function' ? vertexObjectConstructor : ( function () {} );
        this.vertexObjectConstructor.prototype = Object.create( VertexObject.prototype );
        this.vertexObjectConstructor.prototype.constructor = this.vertexObjectConstructor;

        this.vertexCount = parseInt( vertexCount, 10 );
        this.vertexAttrCount = parseInt( vertexAttrCount, 10 );

        // ======= attributes =======

        this.attr = {};

        var offset, attr, i;

        if ( Array.isArray( attributes ) ) {

            offset = 0;

            for ( i = 0; i < attributes.length; ++i ) {

                attr = attributes[ i ];

                if ( attr.size === undefined ) throw new Error( 'vertex object attribute descriptor has no size property!' );

                if ( attr.name !== undefined ) {

                    this.attr[ attr.name ] = new VertexObjectAttrDescriptor( attr.name, attr.size, offset, !! attr.uniform, attr.attrNames );

                }

                offset += attr.size;

            }

            if ( offset > this.vertexAttrCount ) throw new Error( 'vertexAttrCount is too small (offset=' + offset + ')' );

        }

        // ======= aliases =======

        var name;

        if ( aliases !== undefined ) {

            for ( name in aliases ) {

                if ( aliases.hasOwnProperty( name ) ) {

                    attr = aliases[ name ];

                    if ( typeof attr === 'string' ) {

                        attr = this.attr[ attr ];

                        if ( attr !== undefined ) {

                            this.attr[ name ] = attr;

                        }

                    } else {

                        this.attr[ name ] = new VertexObjectAttrDescriptor( name, attr.size, attr.offset, !! attr.uniform, attr.attrNames );

                    }

                }

            }

        }

        // ======= propertiesObject =======

        this.propertiesObject = {};

        for ( name in this.attr ) {

            if ( this.attr.hasOwnProperty( name ) ) {

                attr = this.attr[ name ];

                attr.defineProperties( name, this.propertiesObject, this );

            }

        }

        // ======= vertex object prototype =======

        this.vertexObjectPrototype = Object.create( this.vertexObjectConstructor.prototype, this.propertiesObject );


        // === winterkälte jetzt

        Object.freeze( this.attr );
        Object.freeze( this );

    }

    /**
     * @method Picimo.core.VertexObjectDescriptor#createVertexArray
     * @param {number} [size=1]
     * @return {Picimo.core.VertexArray}
     */
    VertexObjectDescriptor.prototype.createVertexArray = function ( size ) {

        return new VertexArray( this, ( size === undefined ? 1 : size ) );

    };

    /**
     * Create a new vertex object.
     * @method Picimo.core.VertexObjectDescriptor#create
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     * @return {Picimo.core.VertexObject}
     */
    VertexObjectDescriptor.prototype.create = function ( vertexArray ) {

        var vo = Object.create( this.vertexObjectPrototype );
        VertexObject.call( vo, this, vertexArray );

        if ( VertexObject !== this.vertexObjectConstructor ) {

            this.vertexObjectConstructor.call( vo );

        }

        return vo;

    };


    Object.defineProperties( VertexObjectDescriptor.prototype, {

        /**
         * @member {Object} Picimo.core.VertexObjectDescriptor#proto - The prototype object of the vertex object. You should add your own properties and methods here.
         * @readonly
         */

        'proto': {
            get: function () {

                return this.vertexObjectConstructor.prototype;

            },
            enumerable: true
        }

    });


    // =========================================
    // VertexObjectAttrDescriptor
    // =========================================

    function VertexObjectAttrDescriptor ( name, size, offset, uniform, attrNames ) {

        this.name      = name;
        this.size      = size;
        this.offset    = offset;
        this.uniform   = uniform;
        this.attrNames = attrNames;

        Object.freeze( this );

    }

    VertexObjectAttrDescriptor.prototype.getAttrPostfix = function ( name, index ) {

        if ( this.attrNames ) {

            var postfix = this.attrNames[ index ];

            if ( postfix !== undefined ) {

                return postfix;

            }

        }

        return name + '_' + index;

    };

    VertexObjectAttrDescriptor.prototype.defineProperties = function ( name, obj, descriptor ) {

        var i, j, setter;

        if ( this.size === 1 ) {

            if ( this.uniform ) {

                obj[ name ] = {

                    get        : get_v1f_u( this.offset ),
                    set        : set_v1f_u( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                    enumerable : true

                };

            } else {

                obj[ "set" + camelize( name ) ] = {

                    value      : set_v1f_v( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                    enumerable : true

                };

                for ( i = 0; i < descriptor.vertexCount ; ++i ) {

                    obj[ name + i ] = {

                        get        : get_v1f_u( this.offset + ( i * descriptor.vertexAttrCount ) ),
                        set        : set_v1f_v( 1, 0, this.offset + ( i * descriptor.vertexAttrCount ) ),
                        enumerable : true

                    };

                }

            }

        } else if ( this.size >= 2 && this.size <= 4 ) {

            if ( this.uniform ) {

                obj[ "get" + camelize( name ) ] = {

                    value      : get_vNf_u( this.offset ),
                    enumerable : true

                };

                setter = [ set_v2f_u, set_v3f_u, set_v4f_u ][ this.size - 2 ];

                obj[ "set" + camelize( name ) ] = {

                    value      : setter( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                    enumerable : true

                };

                for ( i = 0; i < this.size ; ++i ) {

                    obj[ this.getAttrPostfix( name, i ) ] = {

                        get        : get_v1f_u( this.offset + i ),
                        set        : set_v1f_u( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset + i ),
                        enumerable : true

                    };

                }

            } else {

                setter = [ set_v2f_v, set_v3f_v ][ this.size - 2 ];

                obj[ "set" + camelize( name ) ] = {

                    value      : setter( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                    enumerable : true

                };

                for ( i = 0; i < descriptor.vertexCount ; ++i ) {
                    for ( j = 0; j < this.size ; ++j ) {

                        obj[ this.getAttrPostfix( name, j ) + i ] = {

                            get        : get_v1f_u( this.offset + ( i * descriptor.vertexAttrCount ) + j ),
                            set        : set_v1f_v( 1, 0, this.offset + ( i * descriptor.vertexAttrCount ) + j ),
                            enumerable : true

                        };

                    }
                }

            }

        } else {

            throw new Error( 'Unsupprted vertex attribute size of ' + this.size + ' (should not be greater than 4)' );

        }

    };

    function get_vNf_u ( offset ) {

        return function ( attrIndex ) {

            return this.vertexArray.vertices[ offset + attrIndex ];

        };

    }

    function set_v2f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( v0, v1 ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset     ] = v0;
                _vertices[ ( i * vertexAttrCount ) + offset + 1 ] = v1;

            }

        };

    }

    function set_v3f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( v0, v1, v2 ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset     ] = v0;
                _vertices[ ( i * vertexAttrCount ) + offset + 1 ] = v1;
                _vertices[ ( i * vertexAttrCount ) + offset + 2 ] = v2;

            }

        };

    }

    function set_v4f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( v0, v1, v2, v3 ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset     ] = v0;
                _vertices[ ( i * vertexAttrCount ) + offset + 1 ] = v1;
                _vertices[ ( i * vertexAttrCount ) + offset + 2 ] = v2;
                _vertices[ ( i * vertexAttrCount ) + offset + 3 ] = v3;

            }

        };

    }

    function get_v1f_u ( offset ) {

        return function () {

            return this.vertexArray.vertices[ offset ];

        };

    }

    function set_v1f_v ( vertexCount, vertexAttrCount, offset ) {

        if ( vertexCount === 1 ) {

            return function ( value ) {

                this.vertexArray.vertices[ offset ] = value;

            };

        } else if ( vertexCount === 3 ) {

            return function ( v0, v1, v2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                           = v0;
                _vertices[ vertexAttrCount + offset ]         = v1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ] = v2;

            };

        } else if ( vertexCount === 4 ) {

            return function ( v0, v1, v2, v3 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                           = v0;
                _vertices[ vertexAttrCount + offset ]         = v1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ] = v2;
                _vertices[ ( 3 * vertexAttrCount ) + offset ] = v3;

            };

        } else {

            throw new Error( 'Unsupported vertexCount=' + vertexCount + ' for per vertex attribute (allowed is 1, 3 or 4)' );

        }

    }

    function set_v2f_v ( vertexCount, vertexAttrCount, offset ) {

        if ( vertexCount === 1 ) {

            return function ( value_0, value_1 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]     = value_0;
                _vertices[ offset + 1 ] = value_1;

            };

        } else if ( vertexCount === 3 ) {

            return function ( v0, v1, v0_1, v1_1, v0_2, v1_2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;

            };

        } else if ( vertexCount === 4 ) {

            return function ( v0, v1, v0_1, v1_1, v0_2, v1_2, v0_3, v1_3 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;
                _vertices[ ( 3 * vertexAttrCount ) + offset ]     = v0_3;
                _vertices[ ( 3 * vertexAttrCount ) + offset + 1 ] = v1_3;

            };

        } else {

            throw new Error( 'Unsupported vertexCount=' + vertexCount + ' for per vertex attribute (allowed is 1, 3 or 4)' );

        }

    }

    function set_v3f_v ( vertexCount, vertexAttrCount, offset ) {

        if ( vertexCount === 1 ) {

            return function ( value_0, value_1, value_2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]     = value_0;
                _vertices[ offset + 1 ] = value_1;
                _vertices[ offset + 2 ] = value_2;

            };

        } else if ( vertexCount === 3 ) {

            return function ( v0, v1, v2, v0_1, v1_1, v2_1, v0_2, v1_2, v2_2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ offset + 2 ]                           = v2;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ vertexAttrCount + offset + 2 ]         = v2_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 2 ] = v2_2;

            };

        } else if ( vertexCount === 4 ) {

            return function ( v0, v1, v2, v0_1, v1_1, v2_1, v0_2, v1_2, v2_2, v0_3, v1_3, v2_3 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ offset + 2 ]                           = v2;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ vertexAttrCount + offset + 2 ]         = v2_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 2 ] = v2_2;
                _vertices[ ( 3 * vertexAttrCount ) + offset ]     = v0_3;
                _vertices[ ( 3 * vertexAttrCount ) + offset + 1 ] = v1_3;
                _vertices[ ( 3 * vertexAttrCount ) + offset + 2 ] = v2_3;

            };

        } else {

            throw new Error( 'Unsupported vertexCount=' + vertexCount + ' for per vertex attribute (allowed is 1, 3 or 4)' );

        }

    }

    function set_v1f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( value ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset ] = value;

            }

        };

    }


    function camelize( name ) {

        return name[ 0 ].toUpperCase() + name.substr( 1 );

    }

    module.exports = VertexObjectDescriptor;

})();

},{"./vertex_array":120,"./vertex_object":122}],124:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.core.VertexObjectPool
     * @param {Picimo.core.VertexObjectDescriptor} descriptor - Vertex object descriptor.
     * @param {number} capacity - Maximum number of vertex objects.
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     */

    function VertexObjectPool ( descriptor, capacity, vertexArray ) {

        utils.object.definePropertiesPublicRO( this, {

            /**
             * @member {Picimo.core.VertexObjectDescriptor} Picimo.core.VertexObjectPool#descriptor - Vertex object descriptor.
             * @readonly
             */
            'descriptor' : descriptor,

            /**
             * @member {number} Picimo.core.VertexObjectPool#capacity - Maximum number of vertex objects.
             * @readonly
             */
            'capacity' : capacity,

            /**
             * @member {Picimo.core.VertexArray} Picimo.core.VertexObjectPool#vertexArray - Vertex array.
             * @readonly
             */
            'vertexArray' : ( vertexArray != null ? vertexArray : descriptor.createVertexArray( capacity ) ),

            /**
             * @member {Picimo.core.VertexObject} Picimo.core.VertexObjectPool#ZERO - The *zero* vertex object.
             * @readonly
             */
            'ZERO' : descriptor.create(),

            /**
             * @member {Picimo.core.VertexObject} Picimo.core.VertexObjectPool#NEW - The *new* vertex object.
             * @readonly
             */
            'NEW' : descriptor.create()

        });

        createVertexObjects( this );

    }

    Object.defineProperties( VertexObjectPool.prototype, {

        /**
         * @member {number} Picimo.core.VertexObjectPool#usedCount - Number of in-use vertex objects.
         * @readonly
         */
        'usedCount': {

            get: function () {

                return this.usedVOs.length;

            },

            enumerable: true

        },

        /**
         * @member {number} Picimo.core.VertexObjectPool#availableCount - Number of free and unused vertex objects.
         * @readonly
         */
        'availableCount': {

            get: function () {

                return this.availableVOs.length;

            },

            enumerable: true

        }

    });


    /**
     * @method Picimo.core.VertexObjectPool#alloc
     * @throws Will throw an error if capacity reached and no vertex object is available.
     * @return {Picimo.core.VertexObject}
     */

    VertexObjectPool.prototype.alloc = function () {

        var vo = this.availableVOs.shift();

        if ( vo === undefined ) {

            throw new Error( "VertexObjectPool capacity(=" + this.capacity + ") reached!" );

        }

        this.usedVOs.push( vo );

        vo.vertexArray.copy( this.NEW.vertexArray );

        return vo;

    };


    /**
     * @method Picimo.core.VertexObjectPool#free
     * @param {Picimo.core.VertexObject} vo - The vertex object
     */

    VertexObjectPool.prototype.free = function ( vo ) {

        var idx = this.usedVOs.indexOf( vo );
        
        if ( idx === -1 ) return;

        var lastIdx = this.usedVOs.length - 1;

        if ( idx !== lastIdx ) {

            var last = this.usedVOs[ lastIdx ];
            vo.vertexArray.copy( last.vertexArray );

            var tmp = last.vertexArray;
            last.vertexArray = vo.vertexArray;
            vo.vertexArray = tmp;

            this.usedVOs.splice( idx, 1, last );

        }

        this.usedVOs.pop();
        this.availableVOs.unshift( vo );

        vo.vertexArray.copy( this.ZERO.vertexArray );

    };


    function createVertexObjects( pool ) {

        pool.availableVOs = [];

        var vertexArray, vertexObject;
        var i;

        for ( i = 0; i < pool.capacity; i++ ) {

            vertexArray = pool.vertexArray.subarray( i );
            vertexObject = pool.descriptor.create( vertexArray );

            pool.availableVOs.push( vertexObject );

        }

        pool.usedVOs = [];

    }


    module.exports = VertexObjectPool;

})();

},{"../utils":139}],125:[function(require,module,exports){
(function(){
    "use strict";

    var AABB2 = require( "./aabb2" );

    /**
     * @class Picimo.core.Viewport
     * @extends Picimo.core.AABB2
     * @param {number} x - x
     * @param {number} y - y
     * @param {number} width - width
     * @param {number} height - height
     */

    function Viewport ( x, y, width, height ) {

        var min_x = parseInt( x, 10 );
        var min_y = parseInt( y, 10 );

        AABB2.call( this,
                min_x, ( min_x + parseInt( width, 10 ) - 1 ),
                min_y, ( min_y + parseInt( height, 10 ) - 1 ) );

    }

    Viewport.prototype = Object.create( AABB2.prototype );
    Viewport.prototype.constructor = Viewport;


    Object.defineProperties( Viewport.prototype, {

        /**
         * @member {Picimo.core.Viewport} Picimo.core.Viewport#x
         */

        x: {
            get: function () {

                return this.min_x;

            },
            set: function ( x ) {

                var w = this.width;

                this.min_x = x;
                this.max_x = x + w - 1;

            },
            enumerable: true
        },

        /**
         * @member {Picimo.core.Viewport} Picimo.core.Viewport#y
         */

        y: {
            get: function () {

                return this.min_y;

            },
            set: function ( y ) {

                var h = this.height;

                this.min_y = y;
                this.max_y = y + h - 1;

            },
            enumerable: true
        },

        /**
         * @member {Picimo.core.Viewport} Picimo.core.Viewport#width
         */

        'width': {
            get: function () { return this.max_x - this.min_x + 1; },
            set: function ( w ) {

                this.max_x = this.min_x + w - 1;

            },
            enumerable: true
        },

        /**
         * @member {Picimo.core.Viewport} Picimo.core.Viewport#height
         */

        'height': {
            get: function () { return this.max_y - this.min_y + 1; },
            set: function ( h ) {

                this.max_y = this.min_y + h - 1;

            },
            enumerable: true
        },

    });


    module.exports = Viewport;

})();

},{"./aabb2":117}],126:[function(require,module,exports){
(function() {
    "use strict";

    (function(api) {

        _definePublicPropertyRO(api, 'VERSION', "0.10.2");

        // =====================================================================
        //
        // eventize( object )
        //
        // =====================================================================


        /**
         * @function Picimo.events.eventize
         * @description
         *   Append the *CustomEvent* interface to an object.
         * @param {Object} o - any object
         * @return o
         */

        api.eventize = function(o) {

            /**
             * A simple event interface for objects.
             *
             * @class Picimo.events.CustomEvent
             *
             */

            _defineHiddenPropertyRO(o, '_callbacks', { _id: 0 });

            // -----------------------------------------------------------------
            //
            // object.on( eventName, [ prio, ] callback )
            //
            // -----------------------------------------------------------------


            /**
             * @method Picimo.events.CustomEvent#on
             * @description
             * Execute the given function everytime when the event occurred.
             * @param {string} eventName
             * @param {number} [prio=0]
             * @param {function} fn - The function to execute when the event occurred.
             * @return {number} - A listener id
             */

            o.on = function(eventName, prio, fn) {

                // TODO create own bind() method
                if (arguments.length === 2 && typeof arguments[0] === 'object' && typeof arguments[1] === 'object') {
                    return setListenerFromOptions(this, arguments[0], arguments[1]);
                }

                if (arguments.length === 2) {
                    fn = prio;
                    prio = 0;
                }

                var eventListener = this._callbacks[eventName] || (this._callbacks[eventName] = [])
                  , listenerId = ++this._callbacks._id
                  ;

                var listener = _definePublicPropertiesRO({}, {
                    id: listenerId,
                    fn: fn,
                    prio: (prio||0),
                    isFunction: (typeof fn === 'function')
                });

                eventListener.push(listener);
                eventListener.sort(sortListenerByPrio);

                return listenerId;

            };

            function sortListenerByPrio(a, b) {
                return b.prio - a.prio;
            }

            // -----------------------------------------------------------------
            //
            // object.once( eventName, [ prio, ] callback )
            //
            // -----------------------------------------------------------------

            /**
             * @method Picimo.events.CustomEvent#once
             * @description
             * Execute the given function when the event occurred. *The function will only be called onced*.
             * @param {string} eventName
             * @param {number} [prio=0]
             * @param {function} fn - The function to execute when the event occurred.
             * @return {number} - A listener id
             */

            o.once = function(eventName, prio, fn) {

                if (arguments.length === 2) {
                    fn = prio;
                    prio = 0;
                }

                var lid = o.on(eventName, prio, function() {
                    o.off(lid);
                    return fn.apply(this, arguments);
                });

                return lid;

            };

            // -----------------------------------------------------------------
            //
            // object.off( id )
            //
            // -----------------------------------------------------------------

            /**
             * @method Picimo.events.CustomEvent#off
             * @description
             * Unsubsribe a listener.
             * @param {number} id - listener id
             */

            o.off = function(id) {
                var cb, i, j, _callbacks, keys = Object.keys(this._callbacks);
                for (j = 0; j < keys.length; j++) {
                    _callbacks = this._callbacks[keys[j]];
                    for (i = 0; i < _callbacks.length; i++) {
                        cb = _callbacks[i];
                        if (cb.id === id) {
                            _callbacks.splice(i, 1);
                            return;
                        }
                    }
                }
            };

            // -----------------------------------------------------------------
            //
            // object.emit( eventName [, arguments .. ] )
            //
            // -----------------------------------------------------------------

            /**
             * @method Picimo.events.CustomEvent#emit
             * @description
             * Trigger an event.
             * @param {string} eventName - The event name.
             * @param {...arguments} [...args] - Arguments for the event callback functions.
             */

            o.emit = function(eventName /*, arguments ..*/) {
                var args = Array.prototype.slice.call(arguments, 1);
                var _callbacks = this._callbacks[eventName];
                var i, len, cb;
                if (_callbacks) {
                    len = _callbacks.length;
                    for (i = 0; i < len; i++) {
                        cb = _callbacks[i];
                        if (cb.isFunction) {
                            cb.fn.apply(this, args);
                        } else {
                            cb.fn.emit(eventName, args);
                        }
                    }
                }
            };

            // -----------------------------------------------------------------
            //
            // object.emitReduce( eventName [, arguments .. ] )
            //
            // -----------------------------------------------------------------

            /**
             * @method Picimo.events.CustomEvent#emitReduce
             * @description
             * Trigger an event.
             * @param {string} eventName - The event name.
             * @param {Object} value - This will be the first argument given to all callback functions.
             * @param {...arguments} [...args] - Arguments for the event callback functions.
             */

            o.emitReduce = function(eventName /*, value, [arguments ..] */) {
                var args = Array.prototype.slice.call(arguments, 1);
                var _callbacks = this._callbacks[eventName];
                var i, len, cb;
                if (args.length === 0) {
                    args.push({});
                }
                if (_callbacks) {
                    len = _callbacks.length;
                    for (i = 0; i < len; i++) {
                        cb = _callbacks[i];
                        args[0] = cb.isFunction ? cb.fn.apply(this, args) : cb.fn.emitReduce(eventName, args);
                    }
                }
                return args[0];
            };

            return o;
        };

        // ---------------------------------------------------------------------
        //
        // setListenerFromOptions
        //
        // ---------------------------------------------------------------------

        // .on( options, { onProjectionUpdated: [100, 'projectionUpdated'], onFrame: 'frame', onFrameEnd: 'frameEnd' } )

        function setListenerFromOptions(obj, options, listenerMap) {

            var eventName, listenName, listenFunc, prio;

            for (listenName in listenerMap) {
                if (listenerMap.hasOwnProperty(listenName)) {
                    listenFunc = options[listenName];
                    if (typeof listenFunc === 'function') {
                        eventName = listenerMap[listenName];
                        if (Array.isArray(eventName)) {
                            prio = eventName[0];
                            eventName = eventName[1];
                        } else {
                            prio = 0;
                        }
                        obj.on(eventName, prio, listenFunc);
                    }
                }
            }

        }

        // =====================================================================
        //
        // helper functions
        //
        // =====================================================================

        function _definePublicPropertyRO(obj, name, value) {
            Object.defineProperty(obj, name, {
                value        : value,
                configurable : true,
                enumerable   : true
            });
            return obj;
        }

        function _definePublicPropertiesRO(obj, attrs) {
            var i, keys = Object.keys(attrs);
            for (i = keys.length; i--;) {
                _definePublicPropertyRO(obj, keys[i], attrs[keys[i]]);
            }
            return obj;
        }

        function _defineHiddenPropertyRO(obj, name, value) {
            Object.defineProperty(obj, name, {
                value        : value,
                configurable : true
            });
            return obj;
        }

    })(module.exports);

})();

},{}],127:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.events
     * @summary
     * A simple event library.
     */

    module.exports = require( './custom_event' );

})();

},{"./custom_event":126}],128:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo
     */

    module.exports = {

        App     : require( './app' ),
        sg      : require( './sg' ),
        webgl   : require( './webgl' ),
        utils   : require( './utils' ),
        core    : require( './core' ),
        sprites : require( './sprites' )

    };

})();

},{"./app":116,"./core":118,"./sg":129,"./sprites":132,"./utils":139,"./webgl":146}],129:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.sg
     * @summary
     * Scene-graph related objects and classes.
     */

    module.exports = {

        Node: require( './node' ),
        NodeState: require( './node_state' )

    };

})();

},{"./node":130,"./node_state":131}],130:[function(require,module,exports){
(function(){
    "use strict";

    var utils     = require( '../utils' );
    var events    = require( '../events' );
    var NodeState = require( './node_state' );

    /**
     * @class Picimo.sg.Node
     * @extends Picimo.events.CustomEvent
     *
     * @classdesc
     * The generic base class for all scene graph nodes.
     *
     * ### States and Events
     * <img src="images/node-events.png" srcset="images/node-events.png 1x,images/node-events@2x.png 2x" alt="Node Events and States">
     *
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {boolean} [options.display=true]
     * @param {boolean} [options.ready=true]
     * @param {function} [options.onInit]
     * @param {function} [options.onInitGl]
     * @param {function} [options.onResize]
     * @param {function} [options.onFrame]
     * @param {function} [options.onRenderFrame]
     * @param {function} [options.onFrameEnd]
     * @param {function} [options.onDestroy]
     * @param {function} [options.onDestroyGl]
     *
     */

    function Node ( app, options ) {

        if ( ! app ) throw new Error( '[Picimo.sg.Node] app is null!' );

        /**
         * @member {Picimo.App} Picimo.sg.Node#app - The app instance
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'app', app );

        /**
         * @member {Picimo.sg.NodeState} Picimo.sg.Node#state
         */
        this.state = new NodeState( NodeState.CREATE );

        /**
         * @member {boolean} Picimo.sg.Node#display
         * @description
         * If set to *false* the node won't be rendered. The *frame*, *renderFrame* and *frameEnd* events won't be emitted.
         * BUT initialization will be happen. (If you don't want the node to initialize set the *ready* attribute to *false*).
         */
        this.display = ( ! options ) || ( options.display !== false );

        /**
         * @member {Picimo.App} Picimo.sg.Node#parent - The parent node.
         */

        this._ready = ( ! options ) || options.ready !== false;

        /**
         * @member {Picimo.sg.Node} Picimo.sg.Node#children - The child nodes array.
         */
        this.children = [];

    
        events.eventize( this );

        if ( options !== undefined ) {

            this.on( options, {
                'onInit'       : 'init',
                'onInitGl'     : 'initGl',
                'onResize'     : 'resize',
                'onFrame'      : 'frame',
                'onRenderFrame': 'renderFrame',
                'onFrameEnd'   : 'frameEnd',
                'onDestroyGl'  : 'destroyGl',
                'onDestroy'    : 'destroy',
            });

        }

    }

    /**
     * @method Picimo.sg.Node#addChild
     * @param {Picimo.sg.Node}
     */
    Node.prototype.addChild = function ( node ) {

        this.children.push( node );

        node.parent = this;

        return node;

    };

    Node.prototype.renderFrame = function () {

        if ( ! this.ready ) return;

        if ( this.state.is( NodeState.CREATE ) ) {

            // create -> initialize

            onInit( this );

        }

        if ( this.state.is( NodeState.READY ) ) {

            // initialize -> ready to render

            // TODO resize

            if ( this.display ) {

                try {

                    /**
                     * Is called only if node is *ready* and *display*-able.
                     * @event Picimo.sg.Node#frame
                     * @memberof Picimo.sg.Node
                     */
                    this.emit( 'frame' );

                    /**
                     * Is called just after the *frame* event and before the *frameEnd* event. The *render commands* should be generated here.
                     * @event Picimo.sg.Node#renderFrame
                     * @memberof Picimo.sg.Node
                     */
                    this.emit( 'renderFrame' );

                } catch ( err ) {

                    console.error( '[frame,renderFrame]', err );

                    this.ready = false;
                    return;

                }


                for ( var i = 0; i < this.children.length; ++i ) {

                    this.children[ i ].renderFrame();

                }


                try {

                    /**
                     * Is called after the on *frame* and *renderFrame* events.
                     * @event Picimo.sg.Node#frameEnd
                     * @memberof Picimo.sg.Node
                     */
                    this.emit( 'frameEnd' );

                } catch ( err ) {

                    console.error( '[frameEnd]', err );

                    this.ready = false;

                }

            }

        }

    };

    /**
     * @method Picimo.sg.Node#destroy
     */
    Node.prototype.destroy = function () {

        if ( this.state.is( NodeState.DESTROYED ) ) return;


        for ( var i = 0; i < this.children.length; ++i ) {

            this.children[ i ].destroy();

        }


        this.state.set( NodeState.DESTROYED );

        if ( this._initialized ) {

            try {

                /**
                 * Is only called if the *init* event successfully resolved. *Even if the *initGl* event failed*.
                 * Is called before the *destroy* event.
                 * @event Picimo.sg.Node#destroyGl
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'destroyGl' );

            } catch ( err ) {

                console.error( '[destroyGl]', err );

            }

            try {

                /**
                 * Is only called if the *init* event successfully resolved and just after the *destroyGl* event.
                 * @event Picimo.sg.Node#destroy
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'destroy' );

            } catch ( err ) {

                console.error( '[destroy]', err );

            }

        }

    };

    function onInit ( node ) {

        node.state.set( NodeState.INIT );

        var initPromises = [];

        try {

            /**
             * This is the first event. Is called only once.
             * @event Picimo.sg.Node#init
             * @memberof Picimo.sg.Node
             */
            node.emit( 'init', makeDoneFunc( initPromises, node ) );

            utils.Promise.all( initPromises ).then( onInitGl.bind( node, node ), onFail.bind( node, node ) );

        } catch ( err ) {

            console.error( '[init]', err );

            this.ready = false;

        }

    }

    function onInitGl ( node ) {

        node._initialized = true;

        if ( ! node.ready ) return;

        var initGlPromises = [];

        try {

            /**
             * Is called just after *init*. Should only be used to perform webgl related tasks.
             * @event Picimo.sg.Node#initGl
             * @memberof Picimo.sg.Node
             */
            node.emit( 'initGl', makeDoneFunc( initGlPromises, node ) );

            utils.Promise.all( initGlPromises ).then( onInitDone.bind( node, node ), onFail.bind( node, node ) );

        } catch ( err ) {

            console.error( '[initGl]', err );

            this.ready = false;

        }
    }

    function onInitDone ( node ) {

        if ( node.ready ) {

            node.state.set( NodeState.READY );

        }

    }

    function makeDoneFunc ( arr ) {

        return function ( promise ) {

            if ( promise ) {

                if ( typeof promise === 'function' ) {

                    promise = new utils.Promise( promise );

                }

                arr.push( promise );

            }

        };

    }

    function onFail ( node ) {

        if ( node.ready ) {

            node.state.set( NodeState.ERROR );

        }

    }



    Object.defineProperties( Node.prototype, {

        /**
         * @member {Picimo.sg.Node} Picimo.sg.Node#isRoot - *True* if this node has no parent.
         * @readonly
         */
        'isRoot': {
        
            get: function () { return ! this.parent; },
            enumerable: true

        },

        /**
         * @member {boolean} Picimo.sg.Node#ready
         * @description
         * A node ist *not* ready if ..
         * 1. the state is set to *destroyed* or *error*
         * 3. you explicitly set it to *false* (but default is *true*)
         */
        'ready': {

            get: function () {

                return ( ( !! this._ready ) &&
                        ( ! this.state.is( NodeState.ERROR|NodeState.DESTROYED )) );

            },

            set: function ( ready ) {

                this._ready = !! ready;

            },

            enumerable: true

        }

    });


    module.exports = Node;

})();

},{"../events":127,"../utils":139,"./node_state":131}],131:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.sg.NodeState
     * @param {number} [initialValue=0] - The initial state
     */
    function NodeState ( initialValue ) {

        this.value = initialValue | 0;

        Object.seal( this );

    }

    /**
     * @method Picimo.sg.NodeState#is
     * @param {number} state
     * @return {boolean}
     * @example
     * state.is( NodeState.CREATE | NodeState.INIT )
     */
    NodeState.prototype.is = function ( state ) {

        return ( this.value & ( state | 0 ) ) > 0; //=== state;

    };

    /**
     * @method Picimo.sg.NodeState#set
     * @param {number} state
     * @example
     * state.set( NodeState.READY )
     * @return *self*
     */
    NodeState.prototype.set = function ( state ) {

        this.value = state | 0;
        return this;

    };

    NodeState.prototype.toString = function () {

        var states = [];

        if ( this.is( NodeState.CREATE ) ) states.push( 'CREATE' );
        if ( this.is( NodeState.INIT ) ) states.push( 'INIT' );
        if ( this.is( NodeState.READY ) ) states.push( 'READY' );
        if ( this.is( NodeState.ERROR ) ) states.push( 'ERROR' );
        if ( this.is( NodeState.DESTROYED ) ) states.push( 'DESTROYED' );

        return "[" + states.join( "," ) + "]";

    };


    utils.object.definePropertiesPublicRO( NodeState, {

        /**
         * @memberof Picimo.sg.NodeState
         * @constant
         * @static
         */
        CREATE : 1,

        /**
         * @memberof Picimo.sg.NodeState
         * @constant
         * @static
         */
        INIT : 2,

        /**
         * @memberof Picimo.sg.NodeState
         * @constant
         * @static
         */
        READY : 4,

        /**
         * @memberof Picimo.sg.NodeState
         * @constant
         * @static
         */
        ERROR : 8,

        /**
         * @memberof Picimo.sg.NodeState
         * @constant
         * @static
         */
        DESTROYED : 16

    });


    Object.freeze( NodeState );


    module.exports = NodeState;

})();

},{"../utils":139}],132:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.sprites
     */

    module.exports = {

        Sprite           : require( './sprite' ),
        SpriteDescriptor : require( './sprite_descriptor' )

    };

})();

},{"./sprite":133,"./sprite_descriptor":134}],133:[function(require,module,exports){
(function(){
    "use strict";

    var SpriteDescriptor = require( './sprite_descriptor' );

    /**
     * @class Picimo.sprites.Sprite
     * @extends Picimo.core.VertexObject
     * @classdesc
     * The default sprite class.
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     */

    function Sprite () {

        return SpriteDescriptor.create.apply( SpriteDescriptor, arguments );
    
    }

    Sprite.prototype = SpriteDescriptor.proto;
    Sprite.prototype.constructor = Sprite;

    module.exports = Sprite;

})();

},{"./sprite_descriptor":134}],134:[function(require,module,exports){
(function(){
    "use strict";

    var core = require( "../core" );

    var SpriteDescriptor = new core.VertexObjectDescriptor(

        null,

        4,
        12,

        [

            /**
             * @method Picimo.sprites.Sprite#setPosition
             * @param {number} x0 - x0
             * @param {number} y0 - y0
             * @param {number} z0 - z0
             * @param {number} x1 - x1
             * @param {number} y1 - y1
             * @param {number} z1 - z1
             * @param {number} x2 - x2
             * @param {number} y2 - y2
             * @param {number} z2 - z2
             * @param {number} x3 - x3
             * @param {number} y3 - y3
             * @param {number} z3 - z3
             */

            /** @member {number} Picimo.sprites.Sprite#x0 */
            /** @member {number} Picimo.sprites.Sprite#y0 */
            /** @member {number} Picimo.sprites.Sprite#z0 */
            /** @member {number} Picimo.sprites.Sprite#x1 */
            /** @member {number} Picimo.sprites.Sprite#y1 */
            /** @member {number} Picimo.sprites.Sprite#z1 */
            /** @member {number} Picimo.sprites.Sprite#x2 */
            /** @member {number} Picimo.sprites.Sprite#y2 */
            /** @member {number} Picimo.sprites.Sprite#z2 */
            /** @member {number} Picimo.sprites.Sprite#x3 */
            /** @member {number} Picimo.sprites.Sprite#y3 */
            /** @member {number} Picimo.sprites.Sprite#z3 */

            { name: 'position', size: 3, attrNames: [ 'x', 'y', 'z' ] },

            /**
             * @member {number} Picimo.sprites.Sprite#rotate - rotation (radian)
             */

            { name: 'rotate', size: 1, uniform: true },

            /**
             * @method Picimo.sprites.Sprite#setTexCoords
             * @param {number} s0 - s0
             * @param {number} t0 - t0
             * @param {number} s1 - s1
             * @param {number} t1 - t1
             * @param {number} s2 - s2
             * @param {number} t2 - t2
             * @param {number} s3 - s3
             * @param {number} t3 - t3
             */

            /** @member {number} Picimo.sprites.Sprite#s0 */
            /** @member {number} Picimo.sprites.Sprite#t0 */
            /** @member {number} Picimo.sprites.Sprite#s1 */
            /** @member {number} Picimo.sprites.Sprite#t1 */
            /** @member {number} Picimo.sprites.Sprite#s2 */
            /** @member {number} Picimo.sprites.Sprite#t2 */
            /** @member {number} Picimo.sprites.Sprite#s3 */
            /** @member {number} Picimo.sprites.Sprite#t3 */

            { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },

            /**
             * @method Picimo.sprites.Sprite#setTranslate
             * @param {number} tx - tx
             * @param {number} ty - ty
             */

            /** @member {number} Picimo.sprites.Sprite#tx - translate x */
            /** @member {number} Picimo.sprites.Sprite#ty - translate y */

            { name: 'translate', size: 2, uniform: true, attrNames: [ 'tx', 'ty' ] },

            /**
             * @member {number} Picimo.sprites.Sprite#scale - scale
             */

            { name: 'scale', size: 1, uniform: true },

            /**
             * @member {number} Picimo.sprites.Sprite#opacity - opacity
             */

            { name: 'opacity', size: 1, uniform: true }

        ],

        {

            /**
             * @method Picimo.sprites.Sprite#setPos2d
             * @param {number} x0 - x0
             * @param {number} y0 - y0
             * @param {number} x1 - x1
             * @param {number} y1 - y1
             * @param {number} x2 - x2
             * @param {number} y2 - y2
             * @param {number} x3 - x3
             * @param {number} y3 - y3
             */

            pos2d: { size: 2, offset: 0 },

            /**
             * @member {number} Picimo.sprites.Sprite#posZ
             */

            posZ:  { size: 1, offset: 2, uniform: true },

            uv:    'texCoords'

        }

    );

    require( './sprite_helpers' )( SpriteDescriptor.proto );

    module.exports = SpriteDescriptor;

})();

},{"../core":118,"./sprite_helpers":135}],135:[function(require,module,exports){
(function(){
    "use strict";

    module.exports = function ( Sprite_prototype ) {

        /**
         * @method Picimo.sprites.Sprite#setTexCoordsByViewport
         * @param {Picimo.core.Viewport} viewport - viewport
         * @param {number} textureWidth - texture width
         * @param {number} textureHeight - texture height
         * @param {number} [repeat] - texture repeat factor
         */

        Sprite_prototype.setTexCoordsByViewport = function ( viewport, textureWidth, textureHeight, repeat ) {

            var x0 = viewport.x === 0 ? 0 : ( viewport.x / textureWidth );
            var x1 = ( viewport.x + viewport.width ) / textureWidth;
            var y0 = 1 - ( ( viewport.y + viewport.height ) / textureHeight );
            var y1 = viewport.y === 0 ? 1 : 1 - ( viewport.y / textureHeight );

            if ( repeat !== undefined ) {

                x0 *= repeat;
                x1 *= repeat;
                y0 *= repeat;
                y1 *= repeat;

            }

            this.setTexCoords(
                x0, y0,
                x1, y0,
                x1, y1,
                x0, y1 );

        };


        /**
         * @method Picimo.sprites.Sprite#setPositionBySize
         * @param {number} width - width
         * @param {number} height - height
         */

        Sprite_prototype.setPositionBySize = function ( width, height ) {

            var half_width  = width  * 0.5;
            var half_height = height * 0.5;

            this.setPos2d(
                    -half_width, -half_height,
                     half_width, -half_height,
                     half_width,  half_height,
                    -half_width,  half_height
                    );

        };

        /**
         * @member {number} Picimo.Sprite#rotateDegree - rotation in degree
         */

        Object.defineProperty( Sprite_prototype, 'rotateDegree', {

            get: function () {
                return this.rotate * 180.0 / Math.PI;
            },

            set: function ( degree ) {
                this.rotate = degree * ( Math.PI / 180.0 );
            },

            enumerable: true

        });

    };

})();

},{}],136:[function(require,module,exports){
(function(){
    "use strict";

    module.exports = function addGlxProperty(obj) {

        Object.defineProperties(
            obj, {
                glx: {
                    set: function(glx) {
                        this._glx = glx;
                        Object.defineProperty(this, 'gl', {
                            value: ( typeof glx === 'object' ? glx.gl : undefined ),
                            enumerable: true,
                            configurable: true
                        });
                    },
                    get: function() {
                        return this._glx;
                    },
                    enumerable: true
                }
            });
    };

})();

},{}],137:[function(require,module,exports){
(function(){
    "use strict";

    var object_utils = require( './object_utils' );

    var UID = 0;

    module.exports = function addUid( obj ) {

        object_utils.definePropertyPublicRO( obj, 'uid', ( ++UID ) );

    };

})();

},{"./object_utils":141}],138:[function(require,module,exports){
(function(){
    "use strict";

    var Promise      = require( './promise' );
    var object_utils = require( './object_utils' );

    /**
     * @class Picimo.utils.Deferred
     * @summary
     * A simple and generic deferred interface.
     */

    function Deferred ( obj ) {

        object_utils.definePropertyPrivateRO( this, '_obj', obj );

        this._ready = false;

        var deferred = this;

        /**
         * @member {Picimo.utils.Promise} Picimo.utils.Deferred#promise
         */

        object_utils.definePropertyPublicRO( this, 'promise', new Promise( function ( resolve ) {

            object_utils.definePropertyPrivate( deferred, '_resolve', resolve );

        }));

    }

    Object.defineProperties( Deferred.prototype, {
    
        /**
         * @member {boolean} Picimo.utils.Deferred#ready
         */

        'ready': {

            get: function () { return this._ready; },

            set: function ( ready ) {

                if ( ! this._ready && !! ready ) {
                
                    this._ready = true;
                    
                    if ( this._resolve ) {
                   
                        this._resolve( this._obj );
                        this._resolve = null;

                    }
                
                } else if ( !! this._ready && ! ready ) {
                
                    this._ready = false;
                
                }
            
            }
        
        }
    
    });

    /**
     * @method Picimo.utils.Deferred#then
     * @param {function} callback
     */

    Deferred.prototype.then = function ( callback ) {

        if ( this.ready ) {

            callback( this._obj );

        } else {

            var deferred = this;

            this.promise.then( function () {

                callback( deferred._obj );

            });

        }

    };

    /**
     * @method Picimo.utils.Deferred#forward
     * @param {string} propertyName
     * @param {function} callback
     */

    Deferred.prototype.forward = function ( propertyName, callback ) {

        this.then( function ( self ) {

            callback( self[ propertyName ] );
        
        });

    };


    /**
     * @memberof Picimo.utils.Deferred
     * @function make
     * @static
     * @param {Object} obj
     * @return obj
     */
    Deferred.make = function ( obj ) {

        object_utils.definePropertyPublicRO( obj, 'deferred', new Deferred( obj ) );

        return obj;

    };


    /**
     * @memberof Picimo.utils.Deferred
     * @function then
     * @static
     * @param {Object} obj
     * @param {function} callback
     */
    Deferred.then = function ( obj, callback ) {

        if ( obj.deferred !== undefined ) {

            obj.deferred.then( callback );

        } else {

            callback( obj );

        }

    };


    module.exports = Deferred;

})();

},{"./object_utils":141,"./promise":142}],139:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.utils
     * @summary
     * Helper functions, utilities and 3rd-party libraries.
     */

    module.exports = {

        /**
         * @namespace Picimo.utils.object
         * @summary
         * Common object properties helper functions.
         */
        object : require( './object_utils' ),

        Deferred : require( './deferred' ),

        /**
         * @class Picimo.utils.Map
         *
         * @summary
         *   ES6 Map
         *
         * @description
         *   An ES6 Map Implementation.
         *   This is the *native* Implementation of your javascript environment or the polyfill/shim of the *core-js* library.
         */
        Map : require( './map' ),

        /**
         * @class Picimo.utils.Promise
         *
         * @summary
         *   ES6 Promise
         *
         * @description
         *   An ES6 Promise Implementation.
         *   This is the *native* Implementation of your javascript environment or the polyfill/shim of the *core-js* library.
         */
        Promise : require( './promise' ),

        /**
         * @namespace Picimo.utils.glMatrix
         *
         * @summary
         *   The fantastic <b>gl-matrix</b> library.
         *
         * @see
         * https://github.com/toji/gl-matrix
         *
         */
        glMatrix : require( 'gl-matrix' ),

        /**
         * @class Picimo.utils.Color
         *
         * @summary
         *   The fantastic color management API <b>net.brehaut.Color</b>
         *
         * @see
         * https://github.com/brehaut/color-js
         *
         */
        Color : require( 'color-js' ),

        /**
         * @private
         */
        addGlxProperty : require( './add_glx_property' ),

        /**
         * @private
         */
        addUid : require( './add_uid' )

    };

})();

},{"./add_glx_property":136,"./add_uid":137,"./deferred":138,"./map":140,"./object_utils":141,"./promise":142,"color-js":1,"gl-matrix":105}],140:[function(require,module,exports){
(function(){
    "use strict";

    module.exports = typeof Map === 'undefined' ? require( 'core-js/library' ).Map : Map;

})();

},{"core-js/library":2}],141:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @function Picimo.utils.object.definePropertyPublicRO
     * @description
     *   Define a *read-only* property which is *enumerable* but not *writable* and *configurable*.
     * @param {Object} obj
     * @param {string} name
     * @param value
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     * @return obj
     */
    module.exports.definePropertyPublicRO = function ( obj, name, value ) {

        Object.defineProperty( obj, name, {
            value     : value,
            enumerable: true
        });

        return obj;

    };


    /**
     * @function Picimo.utils.object.definePropertyPrivate
     * @description
     *   Define a property which is NOT *enumerable* and *configurable* BUT *writable*.
     * @param {Object} obj
     * @param {string} name
     * @param value
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     * @return obj
     */
    module.exports.definePropertyPrivate = function ( obj, name, value ) {

        Object.defineProperty( obj, name, {
            value    : value,
            writable : true
        });

        return obj;

    };


    /**
     * @function Picimo.utils.object.definePropertyPrivateRO
     * @description
     *   Define a **read-only** property which is NOT *enumerable*, *configurable* and *writable*.
     * @param {Object} obj
     * @param {string} name
     * @param value
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
     * @return obj
     */
    module.exports.definePropertyPrivateRO = function ( obj, name, value ) {

        Object.defineProperty( obj, name, {
            value : value
        });

        return obj;

    };


    /**
     * @function Picimo.utils.object.definePropertiesPublicRO
     *
     * @description
     * Define *read-only* properties which are *enumerable* but not *writable* and *configurable*.
     *
     * @param {Object} obj
     * @param {Object} The name/value map
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
     *
     * @example
     * Picimo.utils.object.definePropertiesPublicRO( obj, {
     *     FOO: 'foo',
     *     BAR: 'plah!'
     * });
     *
     * @return obj
     */
    module.exports.definePropertiesPublicRO = function ( obj, map ) {

        for ( var key in map ) {

            if ( Object.hasOwnProperty.call( map, key ) ) {

                Object.defineProperty( obj, key, {
                    value     : map[ key ],
                    enumerable: true
                });

            }

        }

        return obj;

    };


    /**
     * @function Picimo.utils.object.definePropertiesPrivateRO
     *
     * @description
     * Define *read-only* properties which are NOT *enumerable*, *writable* or *configurable*.
     *
     * @param {Object} obj
     * @param {Object} The name/value map
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
     *
     * @example
     * Picimo.utils.object.definePropertiesPrivateRO( obj, {
     *     _FOO: 'foo',
     *     _bar: 'plah!'
     * });
     *
     * @return obj
     */
    module.exports.definePropertiesPrivateRO = function ( obj, map ) {

        for ( var key in map ) {

            if ( Object.hasOwnProperty.call( map, key ) ) {

                Object.defineProperty( obj, key, { value: map[ key ] });

            }

        }

        return obj;

    };

})();

},{}],142:[function(require,module,exports){
(function(){
    "use strict";

    module.exports = typeof Promise === 'undefined' ? require( 'core-js/library' ).Promise : Promise;

})();

},{"core-js/library":2}],143:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );


    function Attrib ( program, info ) {
        
        utils.object.definePropertiesPublicRO( this, {
        
            program  : program,
            info     : info,
            location : program.glx.gl.getAttribLocation( program.glProgram, info.name )
        
        });

        //Object.seal( this );

    }


    module.exports = Attrib;

})();

},{"../utils":139}],144:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @class Picimo.webgl.cmd.BlendMode
     * @classdesc
     *   WebGL blend and depth mode state description.
     *
     * @param {boolean} depthTest - Enable or disable depth test.
     * @param {boolean} [depthMask] - Enable or disable depth buffer writes.
     * @param {string} [depthFunc] - Set the depth function.
     * @param {boolean} blend - Enable or disable blending.
     * @param {string} [blendFuncSrc] - Set the source blend function.
     * @param {string} [blendFuncDst] - Set the destination blend function.
     *
     * @example
     * // default settings
     * new Picimo.webgl.cmd.BlendMode( true, true, 'LEQUAL', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' )
     *
     * @example
     * // disable both
     * new Picimo.webgl.cmd.BlendMode( false, false )
     *
     */

    function BlendMode ( depthTest, depthMask, depthFunc, blend, blendFuncSrc, blendFuncDst ) {

        this.depthTest = !! depthTest;

        if ( this.depthTest ) {
        
            this.depthMask = depthMask;
            this.depthFunc = depthFunc;
        
        } else {
        
            blend        = depthMask;
            blendFuncSrc = depthFunc;
            blendFuncDst = blend;
        
        }
    
        this.blend = !! blend;

        if ( this.blend ) {
        
            this.blendFuncSrc = blendFuncSrc;
            this.blendFuncDst = blendFuncDst;
        
        }

        Object.freeze( this );

    }

    /**
     * @member {boolean} Picimo.webgl.cmd.BlendMode#depthTest
     */

    /**
     * @member {boolean} Picimo.webgl.cmd.BlendMode#depthMask
     */

    /**
     * @member {string} Picimo.webgl.cmd.BlendMode#depthFunc
     */

    /**
     * @member {boolean} Picimo.webgl.cmd.BlendMode#blend
     */

    /**
     * @member {string} Picimo.webgl.cmd.BlendMode#blendFuncSrc
     */

    /**
     * @member {string} Picimo.webgl.cmd.BlendMode#blendFuncDst
     */

    /**
     * @method Picimo.webgl.cmd.BlendMode#activate
     * @param {WebGlRenderingContext} gl - gl
     */

    BlendMode.prototype.activate = function ( gl ) {
    
        if ( this.depthTest ) {
        
            gl.enable( gl.DEPTH_TEST );
            gl.depthMask( this.depthMask );
            gl.depthFunc( gl[ this.depthFunc ] );

        } else {
        
            gl.disable( gl.DEPTH_TEST );

        }
    
        if ( this.blend ) {
        
            gl.enable( gl.BLEND );
            gl.blendFunc( gl[ this.blendFuncSrc ], gl[ this.blendFuncDst ] );

        } else {
        
            gl.disable( gl.BLEND );

        }
    
    };


/*
        // good default settings
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);       // enable writing into the depth buffer
        //gl.depthFunc(gl.ALWAYS);  // sprites blending
        gl.depthFunc(gl.LEQUAL);  // iso3d

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // good default
*/



    /**
     * @memberof Picimo.webgl.cmd.BlendMode
     * @constant DEFAULT
     * @static
     */

    BlendMode.DEFAULT = new BlendMode( true, true, 'ALWAYS', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' );

    /**
     * @memberof Picimo.webgl.cmd.BlendMode
     * @constant ISO3D
     * @static
     */

    BlendMode.ISO3D = new BlendMode( true, true, 'LEQUAL', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' );


    module.exports = BlendMode;

})();

},{}],145:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.webgl.cmd
     */

    module.exports = {

        BlendMode : require( './blend_mode' ),

    };

})();

},{"./blend_mode":144}],146:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.webgl
     */

    module.exports = {

        cmd : require( './cmd' ),

        ShaderSource  : require( './shader_source' ),
        ShaderManager : require( './shader_manager' ),
        Program       : require( './program' ),
        WebGlContext  : require( './web_gl_context' ),
        WebGlRenderer : require( './web_gl_renderer' ),
        WebGlProgram  : require( './web_gl_program' )

    };

})();

},{"./cmd":145,"./program":147,"./shader_manager":148,"./shader_source":149,"./web_gl_context":151,"./web_gl_program":152,"./web_gl_renderer":153}],147:[function(require,module,exports){
(function(){
    "use strict";

    var utils        = require( '../utils' );
    var WebGlProgram = require( './web_gl_program' );

    function Program ( name, vertexShaderName, fragmentShaderName ) {
        
        utils.addUid( this );

        utils.object.definePropertiesPublicRO( this, {

            name               : name,
            vertexShaderName   : ( vertexShaderName ? vertexShaderName : name ),
            fragmentShaderName : ( fragmentShaderName ? fragmentShaderName : name ),

        });

    }

    Program.prototype.linkProgram = function ( app ) {

        var glx = app.glx;
        var gl = glx.gl;

        var vertexShader = glx.glShader( app.shader.getVertexShader( this.vertexShaderName ) );
        if ( ! vertexShader ) return;

        var fragmentShader = glx.glShader( app.shader.getFragmentShader( this.fragmentShaderName ) );
        if ( ! fragmentShader ) return;

        var gl_program = gl.createProgram();

        gl.attachShader( gl_program, vertexShader );
        gl.attachShader( gl_program, fragmentShader );

        gl.linkProgram( gl_program );

        if ( ! gl.getProgramParameter( gl_program, gl.LINK_STATUS ) ) {

            throw new Error( "Could not link webgl program: " + this.name );
        
        }

        return new WebGlProgram( this, gl_program, glx );

    };


    module.exports = Program;

})();

},{"../utils":139,"./web_gl_program":152}],148:[function(require,module,exports){
(function(){
    "use strict";

    var utils        = require( '../utils' );
    var ShaderSource = require( './shader_source' );
    var Program      = require( './program' );

    /**
     * @class Picimo.webgl.ShaderManager
     */

    function ShaderManager ( app ) {
        
        utils.object.definePropertyPublicRO( this, 'app', app );

        utils.object.definePropertiesPrivateRO( this, {

            _vertexShader   : new utils.Map(),
            _fragmentShader : new utils.Map(),
            _programs       : new utils.Map(),
        
        });

    }


    /**
     * @method Picimo.webgl.ShaderManager#addProgram
     * @param {string} name
     * @param {string} [vertexShaderName=name]
     * @param {string} [fragmentShaderName=name]
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addProgram = function ( name, vertexShaderName, fragmentShaderName ) {

        this._programs.set( name, new Program( name, vertexShaderName, fragmentShaderName ) );

        return this;
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#getProgram
     * @param {string} name
     * @return {Picimo.webgl.Program} program
     */

    ShaderManager.prototype.getProgram = function ( name ) {

        return this._programs.get( name );
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#addShader
     * @param {Picimo.webgl.ShaderSource} shader
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addShader = function ( shader ) {

        if ( shader.shaderType === ShaderSource.VERTEX_SHADER ) {
        
            this._vertexShader.set( shader.name, shader );
        
        } else if ( shader.shaderType === ShaderSource.FRAGMENT_SHADER ) {
        
            this._fragmentShader.set( shader.name, shader );

        }

        return this;
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#addVertexShader
     * @param {string} name
     * @param {string} shader - The raw shader source string
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addVertexShader = function ( name, source ) {

        return this.addShader( new ShaderSource( ShaderSource.VERTEX_SHADER, name, source ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#addFragmentShader
     * @param {string} name
     * @param {string} shader - The raw shader source string
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.addFragmentShader = function ( name, source ) {

        return this.addShader( new ShaderSource( ShaderSource.FRAGMENT_SHADER, name, source ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#loadVertexShader
     * @param {string} name
     * @param {string} url
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.loadVertexShader = function ( name, url ) {

        return this.addShader( new ShaderSource( ShaderSource.VERTEX_SHADER, name ).load( url ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#loadFragmentShader
     * @param {string} name
     * @param {string} url
     * @return {Picimo.webgl.ShaderManager} self
     */

    ShaderManager.prototype.loadFragmentShader = function ( name, url ) {

        return this.addShader( new ShaderSource( ShaderSource.FRAGMENT_SHADER, name ).load( url ) );

    };


    /**
     * @method Picimo.webgl.ShaderManager#getVertexShader
     * @param {string} name
     * @return {Picimo.webgl.ShaderSource} shader
     */

    ShaderManager.prototype.getVertexShader = function ( name ) {

        return this._vertexShader.get( name );
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#getFragmentShader
     * @param {string} name
     * @return {Picimo.webgl.ShaderSource} shader
     */

    ShaderManager.prototype.getFragmentShader = function ( name ) {

        return this._fragmentShader.get( name );
    
    };


    module.exports = ShaderManager;

})();

},{"../utils":139,"./program":147,"./shader_source":149}],149:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.webgl.ShaderSource
     * @param {string} shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
     * @param {string} name -
     * @param {string} [source]
     */

    function ShaderSource ( shaderType, name, source ) {

        /**
         * @member {number} Picimo.webgl.ShaderSource#uid
         * @readonly
         */
        utils.addUid( this );

        /**
         * @member {Picimo.utils.Deferred} Picimo.webgl.ShaderSource#deferred
         */
        utils.Deferred.make( this );

        /**
         * @member {string} Picimo.webgl.ShaderSource#shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
         */
        this.shaderType = shaderType;

        /**
         * @member {string} Picimo.webgl.ShaderSource#name
         */
        this.name = name;

        /**
         * @member {string} Picimo.webgl.ShaderSource#source - The shader source
         */
        this.source = source;

        /**
         * @member {string} Picimo.webgl.ShaderSource#url
         */
        this.url = null;

    }


    Object.defineProperties( ShaderSource.prototype, {

        'source': {

            get: function () { return this._source; },

            set: function ( source ) {

                this._source = source;
                this.deferred.ready = typeof source === 'string' && source.trim().length !== 0;

            },

            enumerable: true

        }

    });


    /**
     * @method Picimo.webgl.ShaderSource#getSource
     * @param {function} resolve
     */

    ShaderSource.prototype.getSource = function ( resolve ) {

        this.deferred.forward( 'source', resolve );

    };


    /**
     * @method Picimo.webgl.ShaderSource#load
     * @param {string} url
     * @return {Picimo.webgl.ShaderSource} - self
     */

    ShaderSource.prototype.load = function ( url ) {

        var self = this;

        this.url = url;

        var req = new XMLHttpRequest();

        req.open( "GET", url, true );

        req.onreadystatechange = function () {

            if ( req.readyState !== 4 /* DONE */ ) return;

            if ( req.status >= 200 && req.status < 300 ) {

                self.source = req.responseText;

            }

        };

        req.send();

        return this;

    };


    /**
     * @method Picimo.webgl.ShaderSource#compile
     * @param {WebGlRenderingContext} gl
     * @return {WebGLShader} - webgl shader object or *undefined*
     */

    ShaderSource.prototype.compile = function ( gl ) {

        if ( ! this.deferred.ready ) return;

        var shader = gl.createShader( gl[ this.shaderType ] );

        gl.shaderSource( shader, this.source );
        gl.compileShader( shader );

        if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

            throw new Error( gl.getShaderInfoLog( shader ) );

        }

        return shader;

    };


    /**
     * @memberof Picimo.webgl.ShaderSource
     * @constant VERTEX_SHADER
     * @static
     */

    ShaderSource.VERTEX_SHADER = 'VERTEX_SHADER';

    /**
     * @memberof Picimo.webgl.ShaderSource
     * @constant FRAGMENT_SHADER
     * @static
     */

    ShaderSource.FRAGMENT_SHADER = 'FRAGMENT_SHADER';


    module.exports = ShaderSource;

})();

},{"../utils":139}],150:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );


    function Uniform ( program, info ) {
        
        utils.object.definePropertiesPublicRO( this, {
        
            program  : program,
            info     : info,
            location : program.glx.gl.getUniformLocation( program.glProgram, info.name )
        
        });

        //Object.seal( this );

    }


    module.exports = Uniform;

})();

},{"../utils":139}],151:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.webgl.WebGlContext
     */

    function WebGlContext ( gl ) {

        if ( ! gl ) throw new Error( '[new Picimo.webgl.WebGlContext] gl is undefined!' );

        utils.object.definePropertyPublicRO( this, 'gl', gl );

        utils.object.definePropertiesPrivateRO( this, {
            '_boundBuffers' : new utils.Map(),
            '_boundTextures': new utils.Map(),
            '_shaders'      : new utils.Map(),
            '_programs'     : new utils.Map()
        });

        getExtensions( this );
        readWebGlParameters( this );

        this.app           = null;
        this.activeProgram = null;

        Object.seal( this );

    }

    /**
     * @method Picimo.webgl.WebGlContext#bindBuffer
     * @param {number} bufferType - gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
     * @param buffer
     */

    WebGlContext.prototype.bindBuffer = function ( bufferType, buffer ) {

        if ( this._boundBuffers.get( bufferType ) !== buffer ) {

            this._boundBuffers.set( bufferType, buffer );
            this.gl.bindBuffer( bufferType, buffer );

        }

    };

    /**
     * @method Picimo.webgl.WebGlContext#bindArrayBuffer
     * @param buffer
     */

    WebGlContext.prototype.bindArrayBuffer = function ( buffer ) {

        this.bindBuffer( this.gl.ARRAY_BUFFER, buffer );

    };

    /**
     * @method Picimo.webgl.WebGlContext#bindElementArrayBuffer
     * @param buffer
     */

    WebGlContext.prototype.bindElementArrayBuffer = function ( buffer ) {

        this.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, buffer );

    };

    /**
     * @method Picimo.webgl.WebGlContext#glShader
     * @param {Picimo.webgl.ShaderSource} shader
     * @return {WebGLShader} The shader object or *undefined*
     */

    WebGlContext.prototype.glShader = function ( shader ) {

        if ( shader === undefined ) return;

        var glShader = this._shaders.get( shader.uid );

        if ( glShader === undefined ) {

            glShader = shader.compile( this.gl );

            if ( glShader !== undefined ) {

                this._shaders.set( shader.uid, glShader );

            }

        }

        return glShader;

    };

    /**
     * @method Picimo.webgl.WebGlContext#glProgram
     * @param {Picimo.webgl.Program} program
     * @return {Picimo.webgl.WebGlProgram} The program object or *undefined*
     */

    WebGlContext.prototype.glProgram = function ( program ) {

        if ( program === undefined ) return;

        var glProgram = this._programs.get( program.uid );

        if ( glProgram === undefined ) {
        
            glProgram = program.linkProgram( this.app );

            if ( glProgram !== undefined ) {
            
                this._programs.set( program.uid, glProgram );
            
            }
        
        }

        return glProgram;

    };



    function readWebGlParameters( webGlContext ) {

        var gl = webGlContext.gl;

        utils.object.definePropertiesPublicRO( webGlContext, {

            /**
             * @member {number} Picimo.webgl.WebGlContext#MAX_TEXTURE_SIZE - gl.MAX_TEXTURE_SIZE
             */
            MAX_TEXTURE_SIZE : gl.getParameter( gl.MAX_TEXTURE_SIZE ),

            /**
             * @member {number} Picimo.webgl.WebGlContext#MAX_TEXTURE_IMAGE_UNITS - gl.MAX_TEXTURE_IMAGE_UNITS
             */
            MAX_TEXTURE_IMAGE_UNITS : gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS )

        });

    }

    function getExtensions( webGlContext ) {

        webGlContext.OES_element_index_uint = webGlContext.gl.getExtension("OES_element_index_uint");

        if ( ! webGlContext.OES_element_index_uint ) {

            console.error( "WebGL don't support the OES_element_index_uint extension!" );

        }

    }

    module.exports = WebGlContext;

})();

},{"../utils":139}],152:[function(require,module,exports){
(function(){
    "use strict";

    var Uniform = require( './uniform' );
    var Attrib  = require( './attrib' );


    function WebGlProgram ( program, glProgram, glx ) {

        this.program   = program;
        this.glProgram = glProgram;
        this.glx       = glx;
        
        setupUniformsAndAttributes( this );

        Object.freeze( this );

    }

    WebGlProgram.prototype.use = function ( glx ) {

        if ( glx.activeProgram !== this ) {

            glx.activeProgram = this;
            glx.gl.useProgram( this.glProgram );
        
        }
    
    };


    function setupUniformsAndAttributes ( glProgram ) {
    
        var gl          = glProgram.glx.gl;
        var numUniforms = gl.getProgramParameter( glProgram.glProgram, gl.ACTIVE_UNIFORMS );

        glProgram.uniformNames  = [];
        glProgram.uniform       = {};

        var i, uniform;

        for ( i = 0; i < numUniforms ; ++i ) {

            uniform = gl.getActiveUniform( glProgram.glProgram, i );

            glProgram.uniform[ uniform.name ] = new Uniform( glProgram, uniform );
            glProgram.uniformNames.push( uniform.name );
        
        }

        Object.freeze( glProgram.uniform );


        var numAttribs = gl.getProgramParameter( glProgram.glProgram, gl.ACTIVE_ATTRIBUTES );

        glProgram.attribNames = [];
        glProgram.attrib      = {};

        var attr;

        for ( i = 0; i < numAttribs ; ++i ) {

            attr = gl.getActiveAttrib( glProgram.glProgram, i );

            glProgram.attrib[ attr.name ] = new Attrib( glProgram, attr );
            glProgram.attribNames.push( attr.name );
        
        }

        Object.freeze( glProgram.attrib );
    
    }


    module.exports = WebGlProgram;

})();

},{"./attrib":143,"./uniform":150}],153:[function(require,module,exports){
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.webgl.WebGlRenderer
     */

    function WebGlRenderer ( app ) {

        /**
         * @member {Picimo.App} Picimo.webgl.WebGlRenderer#app
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'app', app );

    }


    /**
     * @method Picimo.webgl.WebGlRenderer#beginFrame
     */

    WebGlRenderer.prototype.beginFrame = function () {

        var gl = this.app.gl;
        var bgColor = this.app.backgroundColor;

        gl.clearColor( bgColor.getRed(), bgColor.getGreen(), bgColor.getBlue(), bgColor.getAlpha() );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    };


    /**
     * @method Picimo.webgl.WebGlRenderer#endFrame
     */

    WebGlRenderer.prototype.endFrame = function () {

    };


    /**
     * @method Picimo.webgl.WebGlRenderer#initGl
     */

    WebGlRenderer.prototype.initGl = function () {

        var gl = this.app.gl;

        gl.activeTexture( gl.TEXTURE0 ); // TODO remove

    };


    /**
     * @method Picimo.webgl.WebGlRenderer#resize
     */

    WebGlRenderer.prototype.resize = function () {

        var app = this.app;
        var gl  = this.app.gl;

        gl.viewport( 0, 0, app.width, app.height );

    };


    module.exports = WebGlRenderer;

})();

},{"../utils":139}]},{},[115])(115)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29sb3ItanMvY29sb3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hcnJheS1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXdlYWsuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVmLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmVudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZvci1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZ2V0LW5hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaW52b2tlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubWl4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wYXJ0aWFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWYuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5yZXBsYWNlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNhbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLXBhZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnN0cmluZy1yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGhyb3dzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudW5zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLndrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLiRmb3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5hcnJheS50dXJuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmRlbGF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZGljdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmZ1bmN0aW9uLnBhcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5pdGVyLWhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5sb2cuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5udW1iZXIuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5udW1iZXIubWF0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLm9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLnN0cmluZy5lc2NhcGUtaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5maWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5maW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkub2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmZ1bmN0aW9uLmhhcy1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5tYXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm51bWJlci5zdGF0aWNzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuaXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucmVmbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLnJhdy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi53ZWFrLXNldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuYXJyYXkuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcub2JqZWN0LnRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5yZWdleHAuZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zZXQudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3RyaW5nLmF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zdHJpbmcubHBhZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3RyaW5nLnJwYWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvanMuYXJyYXkuc3RhdGljcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5pbW1lZGlhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLnRpbWVycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC9jb21tb24uanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0cml4L3NyYy9nbC1tYXRyaXgvbWF0Mi5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC9tYXQyZC5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC9tYXQzLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdHJpeC9zcmMvZ2wtbWF0cml4L21hdDQuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0cml4L3NyYy9nbC1tYXRyaXgvcXVhdC5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC92ZWMyLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdHJpeC9zcmMvZ2wtbWF0cml4L3ZlYzMuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0cml4L3NyYy9nbC1tYXRyaXgvdmVjNC5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9waWNpbW8vYXBwL2luZGV4LmpzIiwic3JjL3BpY2ltby9jb3JlL2FhYmIyLmpzIiwic3JjL3BpY2ltby9jb3JlL2luZGV4LmpzIiwic3JjL3BpY2ltby9jb3JlL3RleHR1cmUuanMiLCJzcmMvcGljaW1vL2NvcmUvdmVydGV4X2FycmF5LmpzIiwic3JjL3BpY2ltby9jb3JlL3ZlcnRleF9pbmRleF9hcnJheS5qcyIsInNyYy9waWNpbW8vY29yZS92ZXJ0ZXhfb2JqZWN0LmpzIiwic3JjL3BpY2ltby9jb3JlL3ZlcnRleF9vYmplY3RfZGVzY3JpcHRvci5qcyIsInNyYy9waWNpbW8vY29yZS92ZXJ0ZXhfb2JqZWN0X3Bvb2wuanMiLCJzcmMvcGljaW1vL2NvcmUvdmlld3BvcnQuanMiLCJzcmMvcGljaW1vL2V2ZW50cy9jdXN0b21fZXZlbnQuanMiLCJzcmMvcGljaW1vL2V2ZW50cy9pbmRleC5qcyIsInNyYy9waWNpbW8vaW5kZXguanMiLCJzcmMvcGljaW1vL3NnL2luZGV4LmpzIiwic3JjL3BpY2ltby9zZy9ub2RlLmpzIiwic3JjL3BpY2ltby9zZy9ub2RlX3N0YXRlLmpzIiwic3JjL3BpY2ltby9zcHJpdGVzL2luZGV4LmpzIiwic3JjL3BpY2ltby9zcHJpdGVzL3Nwcml0ZS5qcyIsInNyYy9waWNpbW8vc3ByaXRlcy9zcHJpdGVfZGVzY3JpcHRvci5qcyIsInNyYy9waWNpbW8vc3ByaXRlcy9zcHJpdGVfaGVscGVycy5qcyIsInNyYy9waWNpbW8vdXRpbHMvYWRkX2dseF9wcm9wZXJ0eS5qcyIsInNyYy9waWNpbW8vdXRpbHMvYWRkX3VpZC5qcyIsInNyYy9waWNpbW8vdXRpbHMvZGVmZXJyZWQuanMiLCJzcmMvcGljaW1vL3V0aWxzL2luZGV4LmpzIiwic3JjL3BpY2ltby91dGlscy9tYXAuanMiLCJzcmMvcGljaW1vL3V0aWxzL29iamVjdF91dGlscy5qcyIsInNyYy9waWNpbW8vdXRpbHMvcHJvbWlzZS5qcyIsInNyYy9waWNpbW8vd2ViZ2wvYXR0cmliLmpzIiwic3JjL3BpY2ltby93ZWJnbC9jbWQvYmxlbmRfbW9kZS5qcyIsInNyYy9waWNpbW8vd2ViZ2wvY21kL2luZGV4LmpzIiwic3JjL3BpY2ltby93ZWJnbC9pbmRleC5qcyIsInNyYy9waWNpbW8vd2ViZ2wvcHJvZ3JhbS5qcyIsInNyYy9waWNpbW8vd2ViZ2wvc2hhZGVyX21hbmFnZXIuanMiLCJzcmMvcGljaW1vL3dlYmdsL3NoYWRlcl9zb3VyY2UuanMiLCJzcmMvcGljaW1vL3dlYmdsL3VuaWZvcm0uanMiLCJzcmMvcGljaW1vL3dlYmdsL3dlYl9nbF9jb250ZXh0LmpzIiwic3JjL3BpY2ltby93ZWJnbC93ZWJfZ2xfcHJvZ3JhbS5qcyIsInNyYy9waWNpbW8vd2ViZ2wvd2ViX2dsX3JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3YwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ253Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9sQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCAoYykgMjAwOC0yMDEzLCBBbmRyZXcgQnJlaGF1dCwgVGltIEJhdW1hbm4sIE1hdHQgV2lsc29uLCBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBTaW1vbiBIZWltbGVyLCBNaWNoZWwgVmllbG1ldHRlciBcbi8vXG4vLyBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy9cbi8vIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuLy8gbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4vL1xuLy8gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4vLyAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4vLyAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbi8vICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuLy8gICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbi8vXG4vLyBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuLy8gQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuLy8gSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0Vcbi8vIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRVxuLy8gTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUlxuLy8gQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0Zcbi8vIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTU1xuLy8gSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU5cbi8vIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpXG4vLyBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRVxuLy8gUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG5cbi8vIGNvbG9yLmpzIC0gdmVyc2lvbiAxLjAuMVxuLy9cbi8vIEhTViA8LT4gUkdCIGNvZGUgYmFzZWQgb24gY29kZSBmcm9tIGh0dHA6Ly93d3cuY3Mucml0LmVkdS9+bmNzL2NvbG9yL3RfY29udmVydC5odG1sXG4vLyBvYmplY3QgZnVuY3Rpb24gY3JlYXRlZCBieSBEb3VnbGFzIENyb2NrZm9yZC5cbi8vIENvbG9yIHNjaGVtZSBkZWdyZWVzIHRha2VuIGZyb20gdGhlIGNvbG9yamFjay5jb20gY29sb3JwaWNrZXJcbi8vXG4vLyBIU0wgc3VwcG9ydCBraW5kbHkgcHJvdmlkZWQgYnkgVGltIEJhdW1hbm4gLSBodHRwOi8vZ2l0aHViLmNvbS90aW1qYlxuXG4vLyBjcmVhdGUgbmFtZXNwYWNlc1xuLypnbG9iYWwgbmV0ICovXG5pZiAoXCJ1bmRlZmluZWRcIiA9PSB0eXBlb2YgbmV0KSB7IHZhciBuZXQgPSB7fTsgfVxuaWYgKCFuZXQuYnJlaGF1dCkgeyBuZXQuYnJlaGF1dCA9IHt9OyB9XG5cbi8vIHRoaXMgbW9kdWxlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIG5ldC5icmVoYXV0IGFzICd0aGlzJ1xuKGZ1bmN0aW9uICggKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAvLyBDb25zdGFudHNcblxuICAvLyBjc3NfY29sb3JzIG1hcHMgY29sb3IgbmFtZXMgb250byB0aGVpciBoZXggdmFsdWVzXG4gIC8vIHRoZXNlIG5hbWVzIGFyZSBkZWZpbmVkIGJ5IFczQ1xuICB2YXIgY3NzX2NvbG9ycyA9IHthbGljZWJsdWU6JyNGMEY4RkYnLGFudGlxdWV3aGl0ZTonI0ZBRUJENycsYXF1YTonIzAwRkZGRicsYXF1YW1hcmluZTonIzdGRkZENCcsYXp1cmU6JyNGMEZGRkYnLGJlaWdlOicjRjVGNURDJyxiaXNxdWU6JyNGRkU0QzQnLGJsYWNrOicjMDAwMDAwJyxibGFuY2hlZGFsbW9uZDonI0ZGRUJDRCcsYmx1ZTonIzAwMDBGRicsYmx1ZXZpb2xldDonIzhBMkJFMicsYnJvd246JyNBNTJBMkEnLGJ1cmx5d29vZDonI0RFQjg4NycsY2FkZXRibHVlOicjNUY5RUEwJyxjaGFydHJldXNlOicjN0ZGRjAwJyxjaG9jb2xhdGU6JyNEMjY5MUUnLGNvcmFsOicjRkY3RjUwJyxjb3JuZmxvd2VyYmx1ZTonIzY0OTVFRCcsY29ybnNpbGs6JyNGRkY4REMnLGNyaW1zb246JyNEQzE0M0MnLGN5YW46JyMwMEZGRkYnLGRhcmtibHVlOicjMDAwMDhCJyxkYXJrY3lhbjonIzAwOEI4QicsZGFya2dvbGRlbnJvZDonI0I4ODYwQicsZGFya2dyYXk6JyNBOUE5QTknLGRhcmtncmV5OicjQTlBOUE5JyxkYXJrZ3JlZW46JyMwMDY0MDAnLGRhcmtraGFraTonI0JEQjc2QicsZGFya21hZ2VudGE6JyM4QjAwOEInLGRhcmtvbGl2ZWdyZWVuOicjNTU2QjJGJyxkYXJrb3JhbmdlOicjRkY4QzAwJyxkYXJrb3JjaGlkOicjOTkzMkNDJyxkYXJrcmVkOicjOEIwMDAwJyxkYXJrc2FsbW9uOicjRTk5NjdBJyxkYXJrc2VhZ3JlZW46JyM4RkJDOEYnLGRhcmtzbGF0ZWJsdWU6JyM0ODNEOEInLGRhcmtzbGF0ZWdyYXk6JyMyRjRGNEYnLGRhcmtzbGF0ZWdyZXk6JyMyRjRGNEYnLGRhcmt0dXJxdW9pc2U6JyMwMENFRDEnLGRhcmt2aW9sZXQ6JyM5NDAwRDMnLGRlZXBwaW5rOicjRkYxNDkzJyxkZWVwc2t5Ymx1ZTonIzAwQkZGRicsZGltZ3JheTonIzY5Njk2OScsZGltZ3JleTonIzY5Njk2OScsZG9kZ2VyYmx1ZTonIzFFOTBGRicsZmlyZWJyaWNrOicjQjIyMjIyJyxmbG9yYWx3aGl0ZTonI0ZGRkFGMCcsZm9yZXN0Z3JlZW46JyMyMjhCMjInLGZ1Y2hzaWE6JyNGRjAwRkYnLGdhaW5zYm9ybzonI0RDRENEQycsZ2hvc3R3aGl0ZTonI0Y4RjhGRicsZ29sZDonI0ZGRDcwMCcsZ29sZGVucm9kOicjREFBNTIwJyxncmF5OicjODA4MDgwJyxncmV5OicjODA4MDgwJyxncmVlbjonIzAwODAwMCcsZ3JlZW55ZWxsb3c6JyNBREZGMkYnLGhvbmV5ZGV3OicjRjBGRkYwJyxob3RwaW5rOicjRkY2OUI0JyxpbmRpYW5yZWQ6JyNDRDVDNUMnLGluZGlnbzonIzRCMDA4MicsaXZvcnk6JyNGRkZGRjAnLGtoYWtpOicjRjBFNjhDJyxsYXZlbmRlcjonI0U2RTZGQScsbGF2ZW5kZXJibHVzaDonI0ZGRjBGNScsbGF3bmdyZWVuOicjN0NGQzAwJyxsZW1vbmNoaWZmb246JyNGRkZBQ0QnLGxpZ2h0Ymx1ZTonI0FERDhFNicsbGlnaHRjb3JhbDonI0YwODA4MCcsbGlnaHRjeWFuOicjRTBGRkZGJyxsaWdodGdvbGRlbnJvZHllbGxvdzonI0ZBRkFEMicsbGlnaHRncmF5OicjRDNEM0QzJyxsaWdodGdyZXk6JyNEM0QzRDMnLGxpZ2h0Z3JlZW46JyM5MEVFOTAnLGxpZ2h0cGluazonI0ZGQjZDMScsbGlnaHRzYWxtb246JyNGRkEwN0EnLGxpZ2h0c2VhZ3JlZW46JyMyMEIyQUEnLGxpZ2h0c2t5Ymx1ZTonIzg3Q0VGQScsbGlnaHRzbGF0ZWdyYXk6JyM3Nzg4OTknLGxpZ2h0c2xhdGVncmV5OicjNzc4ODk5JyxsaWdodHN0ZWVsYmx1ZTonI0IwQzRERScsbGlnaHR5ZWxsb3c6JyNGRkZGRTAnLGxpbWU6JyMwMEZGMDAnLGxpbWVncmVlbjonIzMyQ0QzMicsbGluZW46JyNGQUYwRTYnLG1hZ2VudGE6JyNGRjAwRkYnLG1hcm9vbjonIzgwMDAwMCcsbWVkaXVtYXF1YW1hcmluZTonIzY2Q0RBQScsbWVkaXVtYmx1ZTonIzAwMDBDRCcsbWVkaXVtb3JjaGlkOicjQkE1NUQzJyxtZWRpdW1wdXJwbGU6JyM5MzcwRDgnLG1lZGl1bXNlYWdyZWVuOicjM0NCMzcxJyxtZWRpdW1zbGF0ZWJsdWU6JyM3QjY4RUUnLG1lZGl1bXNwcmluZ2dyZWVuOicjMDBGQTlBJyxtZWRpdW10dXJxdW9pc2U6JyM0OEQxQ0MnLG1lZGl1bXZpb2xldHJlZDonI0M3MTU4NScsbWlkbmlnaHRibHVlOicjMTkxOTcwJyxtaW50Y3JlYW06JyNGNUZGRkEnLG1pc3R5cm9zZTonI0ZGRTRFMScsbW9jY2FzaW46JyNGRkU0QjUnLG5hdmFqb3doaXRlOicjRkZERUFEJyxuYXZ5OicjMDAwMDgwJyxvbGRsYWNlOicjRkRGNUU2JyxvbGl2ZTonIzgwODAwMCcsb2xpdmVkcmFiOicjNkI4RTIzJyxvcmFuZ2U6JyNGRkE1MDAnLG9yYW5nZXJlZDonI0ZGNDUwMCcsb3JjaGlkOicjREE3MEQ2JyxwYWxlZ29sZGVucm9kOicjRUVFOEFBJyxwYWxlZ3JlZW46JyM5OEZCOTgnLHBhbGV0dXJxdW9pc2U6JyNBRkVFRUUnLHBhbGV2aW9sZXRyZWQ6JyNEODcwOTMnLHBhcGF5YXdoaXA6JyNGRkVGRDUnLHBlYWNocHVmZjonI0ZGREFCOScscGVydTonI0NEODUzRicscGluazonI0ZGQzBDQicscGx1bTonI0REQTBERCcscG93ZGVyYmx1ZTonI0IwRTBFNicscHVycGxlOicjODAwMDgwJyxyZWJlY2NhcHVycGxlOicjNjYzMzk5JyxyZWQ6JyNGRjAwMDAnLHJvc3licm93bjonI0JDOEY4Ricscm95YWxibHVlOicjNDE2OUUxJyxzYWRkbGVicm93bjonIzhCNDUxMycsc2FsbW9uOicjRkE4MDcyJyxzYW5keWJyb3duOicjRjRBNDYwJyxzZWFncmVlbjonIzJFOEI1Nycsc2Vhc2hlbGw6JyNGRkY1RUUnLHNpZW5uYTonI0EwNTIyRCcsc2lsdmVyOicjQzBDMEMwJyxza3libHVlOicjODdDRUVCJyxzbGF0ZWJsdWU6JyM2QTVBQ0QnLHNsYXRlZ3JheTonIzcwODA5MCcsc2xhdGVncmV5OicjNzA4MDkwJyxzbm93OicjRkZGQUZBJyxzcHJpbmdncmVlbjonIzAwRkY3Ricsc3RlZWxibHVlOicjNDY4MkI0Jyx0YW46JyNEMkI0OEMnLHRlYWw6JyMwMDgwODAnLHRoaXN0bGU6JyNEOEJGRDgnLHRvbWF0bzonI0ZGNjM0NycsdHVycXVvaXNlOicjNDBFMEQwJyx2aW9sZXQ6JyNFRTgyRUUnLHdoZWF0OicjRjVERUIzJyx3aGl0ZTonI0ZGRkZGRicsd2hpdGVzbW9rZTonI0Y1RjVGNScseWVsbG93OicjRkZGRjAwJyx5ZWxsb3dncmVlbjonIzlBQ0QzMid9O1xuXG4gIC8vIENTUyB2YWx1ZSByZWdleGVzLCBhY2NvcmRpbmcgdG8gaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy12YWx1ZXMvXG4gIHZhciBjc3NfaW50ZWdlciA9ICcoPzpcXFxcK3wtKT9cXFxcZCsnO1xuICB2YXIgY3NzX2Zsb2F0ID0gJyg/OlxcXFwrfC0pP1xcXFxkKlxcXFwuXFxcXGQrJztcbiAgdmFyIGNzc19udW1iZXIgPSAnKD86JyArIGNzc19pbnRlZ2VyICsgJyl8KD86JyArIGNzc19mbG9hdCArICcpJztcbiAgY3NzX2ludGVnZXIgPSAnKCcgKyBjc3NfaW50ZWdlciArICcpJztcbiAgY3NzX2Zsb2F0ID0gJygnICsgY3NzX2Zsb2F0ICsgJyknO1xuICBjc3NfbnVtYmVyID0gJygnICsgY3NzX251bWJlciArICcpJztcbiAgdmFyIGNzc19wZXJjZW50YWdlID0gY3NzX251bWJlciArICclJztcbiAgdmFyIGNzc193aGl0ZXNwYWNlID0gJ1xcXFxzKj8nO1xuXG4gIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDMvQ1ItY3NzMy1jb2xvci0yMDAzMDUxNC9cbiAgdmFyIGhzbF9oc2xhX3JlZ2V4ID0gbmV3IFJlZ0V4cChbXG4gICAgJ15oc2woYT8pXFxcXCgnLCBjc3NfbnVtYmVyLCAnLCcsIGNzc19wZXJjZW50YWdlLCAnLCcsIGNzc19wZXJjZW50YWdlLCAnKCwoJywgY3NzX251bWJlciwgJykpP1xcXFwpJCdcbiAgXS5qb2luKGNzc193aGl0ZXNwYWNlKSApO1xuICB2YXIgcmdiX3JnYmFfaW50ZWdlcl9yZWdleCA9IG5ldyBSZWdFeHAoW1xuICAgICdecmdiKGE/KVxcXFwoJywgY3NzX2ludGVnZXIsICcsJywgY3NzX2ludGVnZXIsICcsJywgY3NzX2ludGVnZXIsICcoLCgnLCBjc3NfbnVtYmVyLCAnKSk/XFxcXCkkJ1xuICBdLmpvaW4oY3NzX3doaXRlc3BhY2UpICk7XG4gIHZhciByZ2JfcmdiYV9wZXJjZW50YWdlX3JlZ2V4ID0gbmV3IFJlZ0V4cChbXG4gICAgJ15yZ2IoYT8pXFxcXCgnLCBjc3NfcGVyY2VudGFnZSwgJywnLCBjc3NfcGVyY2VudGFnZSwgJywnLCBjc3NfcGVyY2VudGFnZSwgJygsKCcsIGNzc19udW1iZXIsICcpKT9cXFxcKSQnXG4gIF0uam9pbihjc3Nfd2hpdGVzcGFjZSkgKTtcblxuICAvLyBQYWNrYWdlIHdpZGUgdmFyaWFibGVzXG5cbiAgLy8gYmVjb21lcyB0aGUgdG9wIGxldmVsIHByb3RvdHlwZSBvYmplY3RcbiAgdmFyIGNvbG9yO1xuXG4gIC8qIHJlZ2lzdGVyZWRfbW9kZWxzIGNvbnRhaW5zIHRoZSB0ZW1wbGF0ZSBvYmplY3RzIGZvciBhbGwgdGhlXG4gICAqIG1vZGVscyB0aGF0IGhhdmUgYmVlbiByZWdpc3RlcmVkIGZvciB0aGUgY29sb3IgY2xhc3MuXG4gICAqL1xuICB2YXIgcmVnaXN0ZXJlZF9tb2RlbHMgPSBbXTtcblxuXG4gIC8qIGZhY3RvcmllcyBjb250YWlucyBtZXRob2RzIHRvIGNyZWF0ZSBuZXcgaW5zdGFuY2Ugb2ZcbiAgICogZGlmZmVyZW50IGNvbG9yIG1vZGVscyB0aGF0IGhhdmUgYmVlbiByZWdpc3RlcmVkLlxuICAgKi9cbiAgdmFyIGZhY3RvcmllcyA9IHt9O1xuXG4gIC8vIFV0aWxpdHkgZnVuY3Rpb25zXG5cbiAgLyogb2JqZWN0IGlzIERvdWdsYXMgQ3JvY2tmb3JkcyBvYmplY3QgZnVuY3Rpb24gZm9yIHByb3RvdHlwYWxcbiAgICogaW5oZXJpdGFuY2UuXG4gICAqL1xuICBpZiAoIXRoaXMub2JqZWN0KSB7XG4gICAgdGhpcy5vYmplY3QgPSBmdW5jdGlvbiAobykge1xuICAgICAgZnVuY3Rpb24gRiAoKSB7IH1cbiAgICAgIEYucHJvdG90eXBlID0gbztcbiAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH07XG4gIH1cbiAgdmFyIG9iamVjdCA9IHRoaXMub2JqZWN0O1xuXG4gIC8qIHRha2VzIGEgdmFsdWUsIGNvbnZlcnRzIHRvIHN0cmluZyBpZiBuZWVkIGJlLCB0aGVuIHBhZHMgaXRcbiAgICogdG8gYSBtaW5pbXVtIGxlbmd0aC5cbiAgICovXG4gIGZ1bmN0aW9uIHBhZCAoIHZhbCwgbGVuICkge1xuICAgIHZhbCA9IHZhbC50b1N0cmluZygpO1xuICAgIHZhciBwYWRkZWQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5tYXgoIGxlbiAtIHZhbC5sZW5ndGgsIDApOyBpIDwgajsgaSsrKSB7XG4gICAgICBwYWRkZWQucHVzaCgnMCcpO1xuICAgIH1cblxuICAgIHBhZGRlZC5wdXNoKHZhbCk7XG4gICAgcmV0dXJuIHBhZGRlZC5qb2luKCcnKTtcbiAgfVxuXG5cbiAgLyogdGFrZXMgYSBzdHJpbmcgYW5kIHJldHVybnMgYSBuZXcgc3RyaW5nIHdpdGggdGhlIGZpcnN0IGxldHRlclxuICAgKiBjYXBpdGFsaXNlZFxuICAgKi9cbiAgZnVuY3Rpb24gY2FwaXRhbGlzZSAoIHMgKSB7XG4gICAgcmV0dXJuIHMuc2xpY2UoMCwxKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbiAgfVxuXG4gIC8qIHJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZVxuICAgKi9cbiAgZnVuY3Rpb24gdHJpbSAoIHN0ciApIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgfVxuXG4gIC8qIHVzZWQgdG8gYXBwbHkgYSBtZXRob2QgdG8gb2JqZWN0IG5vbi1kZXN0cnVjdGl2ZWx5IGJ5XG4gICAqIGNsb25pbmcgdGhlIG9iamVjdCBhbmQgdGhlbiBhcHBseSB0aGUgbWV0aG9kIHRvIHRoYXRcbiAgICogbmV3IG9iamVjdFxuICAgKi9cbiAgZnVuY3Rpb24gY2xvbmVPbkFwcGx5KCBtZXRoICkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoICkge1xuICAgICAgdmFyIGNsb25lZCA9IHRoaXMuY2xvbmUoKTtcbiAgICAgIG1ldGguYXBwbHkoY2xvbmVkLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9O1xuICB9XG5cblxuICAvKiByZWdpc3Rlck1vZGVsIGlzIHVzZWQgdG8gYWRkIGFkZGl0aW9uYWwgcmVwcmVzZW50YXRpb25zXG4gICAqIHRvIHRoZSBjb2xvciBjb2RlLCBhbmQgZXh0ZW5kIHRoZSBjb2xvciBBUEkgd2l0aCB0aGUgbmV3XG4gICAqIG9wZXJhdGlvbiB0aGF0IG1vZGVsIHByb3ZpZGVzLiBzZWUgYmVmb3JlIGZvciBleGFtcGxlc1xuICAgKi9cbiAgZnVuY3Rpb24gcmVnaXN0ZXJNb2RlbCggbmFtZSwgbW9kZWwgKSB7XG4gICAgdmFyIHByb3RvID0gb2JqZWN0KGNvbG9yKTtcbiAgICB2YXIgZmllbGRzID0gW107IC8vIHVzZWQgZm9yIGNsb25pbmcgYW5kIGdlbmVyYXRpbmcgYWNjZXNzb3JzXG5cbiAgICB2YXIgdG9fbWV0aCA9ICd0bycrIGNhcGl0YWxpc2UobmFtZSk7XG5cbiAgICBmdW5jdGlvbiBjb252ZXJ0QW5kQXBwbHkoIG1ldGggKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCApIHtcbiAgICAgICAgcmV0dXJuIG1ldGguYXBwbHkodGhpc1t0b19tZXRoXSgpLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gbW9kZWwpIGlmIChtb2RlbC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBwcm90b1trZXldID0gbW9kZWxba2V5XTtcbiAgICAgIHZhciBwcm9wID0gcHJvdG9ba2V5XTtcblxuICAgICAgaWYgKGtleS5zbGljZSgwLDEpID09ICdfJykgeyBjb250aW51ZTsgfVxuICAgICAgaWYgKCEoa2V5IGluIGNvbG9yKSAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIHByb3ApIHtcbiAgICAgICAgLy8gdGhlIG1ldGhvZCBmb3VuZCBvbiB0aGlzIG9iamVjdCBpcyBhKSBwdWJsaWMgYW5kIGIpIG5vdFxuICAgICAgICAvLyBjdXJyZW50bHkgc3VwcG9ydGVkIGJ5IHRoZSBjb2xvciBvYmplY3QuIENyZWF0ZSBhbiBpbXBsIHRoYXRcbiAgICAgICAgLy8gY2FsbHMgdGhlIHRvTW9kZWwgZnVuY3Rpb24gYW5kIHBhc3NlcyB0aGF0IG5ldyBvYmplY3RcbiAgICAgICAgLy8gb250byB0aGUgY29ycmVjdCBtZXRob2Qgd2l0aCB0aGUgYXJncy5cbiAgICAgICAgY29sb3Jba2V5XSA9IGNvbnZlcnRBbmRBcHBseShwcm9wKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKFwiZnVuY3Rpb25cIiAhPSB0eXBlb2YgcHJvcCkge1xuICAgICAgICAvLyB3ZSBoYXZlIGZvdW5kIGEgcHVibGljIHByb3BlcnR5LiBjcmVhdGUgYWNjZXNzb3IgbWV0aG9kc1xuICAgICAgICAvLyBhbmQgYmluZCB0aGVtIHVwIGNvcnJlY3RseVxuICAgICAgICBmaWVsZHMucHVzaChrZXkpO1xuICAgICAgICB2YXIgZ2V0dGVyID0gJ2dldCcrY2FwaXRhbGlzZShrZXkpO1xuICAgICAgICB2YXIgc2V0dGVyID0gJ3NldCcrY2FwaXRhbGlzZShrZXkpO1xuXG4gICAgICAgIGNvbG9yW2dldHRlcl0gPSBjb252ZXJ0QW5kQXBwbHkoXG4gICAgICAgICAgcHJvdG9bZ2V0dGVyXSA9IChmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoICkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSgga2V5IClcbiAgICAgICAgKTtcblxuICAgICAgICBjb2xvcltzZXR0ZXJdID0gY29udmVydEFuZEFwcGx5KFxuICAgICAgICAgIHByb3RvW3NldHRlcl0gPSAoZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICAgICAgICAgIHZhciBjbG9uZWQgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgICAgICAgIGNsb25lZFtrZXldID0gdmFsO1xuICAgICAgICAgICAgICByZXR1cm4gY2xvbmVkO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSgga2V5IClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IC8vIGVuZCBvZiBmb3Igb3ZlciBtb2RlbFxuXG4gICAgLy8gYSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IG9iamVjdCAtIGxhcmdlbHkgc28gcHJvdG90eXBlIGNoYWlucyBkb250XG4gICAgLy8gZ2V0IGluc2FuZS4gVGhpcyB1c2VzIGFuIHVucm9sbGVkICdvYmplY3QnIHNvIHRoYXQgRiBpcyBjYWNoZWRcbiAgICAvLyBmb3IgbGF0ZXIgdXNlLiB0aGlzIGlzIGFwcHJveCBhIDI1JSBzcGVlZCBpbXByb3ZlbWVudFxuICAgIGZ1bmN0aW9uIEYgKCkgeyB9XG4gICAgRi5wcm90b3R5cGUgPSBwcm90bztcbiAgICBmdW5jdGlvbiBmYWN0b3J5ICggKSB7XG4gICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9XG4gICAgZmFjdG9yaWVzW25hbWVdID0gZmFjdG9yeTtcblxuICAgIHByb3RvLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNsb25lZCA9IGZhY3RvcnkoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZmllbGRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gZmllbGRzW2ldO1xuICAgICAgICBjbG9uZWRba2V5XSA9IHRoaXNba2V5XTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbG9uZWQ7XG4gICAgfTtcblxuICAgIGNvbG9yW3RvX21ldGhdID0gZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCk7XG4gICAgfTtcblxuICAgIHJlZ2lzdGVyZWRfbW9kZWxzLnB1c2gocHJvdG8pO1xuXG4gICAgcmV0dXJuIHByb3RvO1xuICB9Ly8gZW5kIG9mIHJlZ2lzdGVyTW9kZWxcblxuICAvLyBUZW1wbGF0ZSBPYmplY3RzXG5cbiAgLyogY29sb3IgaXMgdGhlIHJvb3Qgb2JqZWN0IGluIHRoZSBjb2xvciBoaWVyYXJjaHkuIEl0IHN0YXJ0c1xuICAgKiBsaWZlIGFzIGEgdmVyeSBzaW1wbGUgb2JqZWN0LCBidXQgYXMgY29sb3IgbW9kZWxzIGFyZVxuICAgKiByZWdpc3RlcmVkIGl0IGhhcyBtZXRob2RzIHByb2dyYW1tYXRpY2FsbHkgYWRkZWQgdG8gbWFuYWdlXG4gICAqIGNvbnZlcnNpb25zIGFzIG5lZWRlZC5cbiAgICovXG4gIGNvbG9yID0ge1xuICAgIC8qIGZyb21PYmplY3QgdGFrZXMgYW4gYXJndW1lbnQgYW5kIGRlbGVnYXRlcyB0byB0aGUgaW50ZXJuYWxcbiAgICAgKiBjb2xvciBtb2RlbHMgdG8gdHJ5IHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmcm9tT2JqZWN0OiBmdW5jdGlvbiAoIG8gKSB7XG4gICAgICBpZiAoIW8pIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdChjb2xvcik7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gcmVnaXN0ZXJlZF9tb2RlbHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIHZhciBudSA9IHJlZ2lzdGVyZWRfbW9kZWxzW2ldLmZyb21PYmplY3Qobyk7XG4gICAgICAgIGlmIChudSkge1xuICAgICAgICAgIHJldHVybiBudTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0KGNvbG9yKTtcbiAgICB9LFxuXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0NTUygpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgdHJhbnNwYXJlbnQgPSBudWxsOyAvLyBkZWZpbmVkIHdpdGggYW4gUkdCIGxhdGVyLlxuXG4gIC8qIFJHQiBpcyB0aGUgcmVkIGdyZWVuIGJsdWUgbW9kZWwuIFRoaXMgZGVmaW5pdGlvbiBpcyBjb252ZXJ0ZWRcbiAgICogdG8gYSB0ZW1wbGF0ZSBvYmplY3QgYnkgcmVnaXN0ZXJNb2RlbC5cbiAgICovXG4gIHJlZ2lzdGVyTW9kZWwoJ1JHQicsIHtcbiAgICByZWQ6ICAgIDAsXG4gICAgZ3JlZW46ICAwLFxuICAgIGJsdWU6ICAgMCxcbiAgICBhbHBoYTogIDAsXG5cbiAgICAvKiBnZXRMdW1pbmFuY2UgcmV0dXJucyBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgdGhpcyBpcyB0aGVcbiAgICAgKiBsdW1pbmFuY2UgY2FsY3VhdGVkIGFjY29yZGluZyB0b1xuICAgICAqIGh0dHA6Ly93d3cucG95bnRvbi5jb20vbm90ZXMvY29sb3VyX2FuZF9nYW1tYS9Db2xvckZBUS5odG1sI1JURlRvQzlcbiAgICAgKi9cbiAgICBnZXRMdW1pbmFuY2U6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gKHRoaXMucmVkICogMC4yMTI2KSArICh0aGlzLmdyZWVuICogMC43MTUyKSArICh0aGlzLmJsdWUgKiAwLjA3MjIpO1xuICAgIH0sXG5cbiAgICAvKiBkb2VzIGFuIGFscGhhIGJhc2VkIGJsZW5kIG9mIGNvbG9yIG9udG8gdGhpcy4gYWxwaGEgaXMgdGhlXG4gICAgICogYW1vdW50IG9mICdjb2xvcicgdG8gdXNlLiAoMCB0byAxKVxuICAgICAqL1xuICAgIGJsZW5kOiBmdW5jdGlvbiAoIGNvbG9yICwgYWxwaGEgKSB7XG4gICAgICBjb2xvciA9IGNvbG9yLnRvUkdCKCk7XG4gICAgICBhbHBoYSA9IE1hdGgubWluKE1hdGgubWF4KGFscGhhLCAwKSwgMSk7XG4gICAgICB2YXIgcmdiID0gdGhpcy5jbG9uZSgpOyAgICAgXG5cbiAgICAgIHJnYi5yZWQgPSAocmdiLnJlZCAqICgxIC0gYWxwaGEpKSArIChjb2xvci5yZWQgKiBhbHBoYSk7XG4gICAgICByZ2IuZ3JlZW4gPSAocmdiLmdyZWVuICogKDEgLSBhbHBoYSkpICsgKGNvbG9yLmdyZWVuICogYWxwaGEpO1xuICAgICAgcmdiLmJsdWUgPSAocmdiLmJsdWUgKiAoMSAtIGFscGhhKSkgKyAoY29sb3IuYmx1ZSAqIGFscGhhKTtcbiAgICAgIHJnYi5hbHBoYSA9IChyZ2IuYWxwaGEgKiAoMSAtIGFscGhhKSkgKyAoY29sb3IuYWxwaGEgKiBhbHBoYSk7XG5cbiAgICAgIHJldHVybiByZ2I7XG4gICAgfSxcblxuICAgIC8qIGZyb21PYmplY3QgYXR0ZW1wdHMgdG8gY29udmVydCBhbiBvYmplY3QgbyB0byBhbmQgUkdCXG4gICAgICogaW5zdGFuY2UuIFRoaXMgYWNjZXB0cyBhbiBvYmplY3Qgd2l0aCByZWQsIGdyZWVuIGFuZCBibHVlXG4gICAgICogbWVtYmVycyBvciBhIHN0cmluZy4gSWYgdGhlIHN0cmluZyBpcyBhIGtub3duIENTUyBjb2xvciBuYW1lXG4gICAgICogb3IgYSBoZXhkZWNpbWFsIHN0cmluZyBpdCB3aWxsIGFjY2VwdCBpdC5cbiAgICAgKi9cbiAgICBmcm9tT2JqZWN0OiBmdW5jdGlvbiAoIG8gKSB7XG4gICAgICBpZiAobyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tUkdCQXJyYXkgKCBvICk7XG4gICAgICB9XG4gICAgICBpZiAoXCJzdHJpbmdcIiA9PSB0eXBlb2Ygbykge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJvbUNTUyggdHJpbSggbyApICk7XG4gICAgICB9XG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eSgncmVkJykgJiZcbiAgICAgICAgICBvLmhhc093blByb3BlcnR5KCdncmVlbicpICYmXG4gICAgICAgICAgby5oYXNPd25Qcm9wZXJ0eSgnYmx1ZScpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tUkdCICggbyApO1xuICAgICAgfVxuICAgICAgLy8gbm90aGluZyBtYXRjaHMsIG5vdCBhbiBSR0Igb2JqZWN0XG4gICAgfSxcblxuICAgIF9zdHJpbmdQYXJzZXJzOiBbXG4gICAgICAgIC8vIENTUyBSR0IoQSkgbGl0ZXJhbDpcbiAgICAgICAgZnVuY3Rpb24gKCBjc3MgKSB7XG4gICAgICAgICAgY3NzID0gdHJpbShjc3MpO1xuXG4gICAgICAgICAgdmFyIHdpdGhJbnRlZ2VyID0gbWF0Y2gocmdiX3JnYmFfaW50ZWdlcl9yZWdleCwgMjU1KTtcbiAgICAgICAgICBpZih3aXRoSW50ZWdlcikge1xuICAgICAgICAgICAgcmV0dXJuIHdpdGhJbnRlZ2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWF0Y2gocmdiX3JnYmFfcGVyY2VudGFnZV9yZWdleCwgMTAwKTtcblxuICAgICAgICAgIGZ1bmN0aW9uIG1hdGNoKHJlZ2V4LCBtYXhfdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBjb2xvckdyb3VwcyA9IGNzcy5tYXRjaCggcmVnZXggKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gXCJhXCIgYWZ0ZXIgXCJyZ2JcIiwgdGhlcmUgbXVzdCBiZSBhIGZvdXJ0aCBwYXJhbWV0ZXIgYW5kIHRoZSBvdGhlciB3YXkgcm91bmRcbiAgICAgICAgICAgIGlmICghY29sb3JHcm91cHMgfHwgKCEhY29sb3JHcm91cHNbMV0gKyAhIWNvbG9yR3JvdXBzWzVdID09PSAxKSkge1xuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJnYiA9IGZhY3Rvcmllcy5SR0IoKTtcbiAgICAgICAgICAgIHJnYi5yZWQgICA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIGNvbG9yR3JvdXBzWzJdIC8gbWF4X3ZhbHVlKSk7XG4gICAgICAgICAgICByZ2IuZ3JlZW4gPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCBjb2xvckdyb3Vwc1szXSAvIG1heF92YWx1ZSkpO1xuICAgICAgICAgICAgcmdiLmJsdWUgID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgY29sb3JHcm91cHNbNF0gLyBtYXhfdmFsdWUpKTtcbiAgICAgICAgICAgIHJnYi5hbHBoYSA9ICEhY29sb3JHcm91cHNbNV0gPyBNYXRoLm1pbihNYXRoLm1heChwYXJzZUZsb2F0KGNvbG9yR3JvdXBzWzZdKSwgMCksIDEpIDogMTtcblxuICAgICAgICAgICAgcmV0dXJuIHJnYjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZnVuY3Rpb24gKCBjc3MgKSB7XG4gICAgICAgICAgICB2YXIgbG93ZXIgPSBjc3MudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChsb3dlciBpbiBjc3NfY29sb3JzKSB7XG4gICAgICAgICAgICAgIGNzcyA9IGNzc19jb2xvcnNbbG93ZXJdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNzcy5tYXRjaCgvXiMoWzAtOWEtZkEtRl17M318WzAtOWEtZkEtRl17Nn0pJC8pKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3NzID0gY3NzLnJlcGxhY2UoL14jLywnJyk7XG5cbiAgICAgICAgICAgIHZhciBieXRlcyA9IGNzcy5sZW5ndGggLyAzO1xuXG4gICAgICAgICAgICB2YXIgbWF4ID0gTWF0aC5wb3coMTYsIGJ5dGVzKSAtIDE7XG5cbiAgICAgICAgICAgIHZhciByZ2IgPSBmYWN0b3JpZXMuUkdCKCk7XG4gICAgICAgICAgICByZ2IucmVkID0gICBwYXJzZUludChjc3Muc2xpY2UoMCwgYnl0ZXMpLCAxNikgLyBtYXg7XG4gICAgICAgICAgICByZ2IuZ3JlZW4gPSBwYXJzZUludChjc3Muc2xpY2UoYnl0ZXMgKiAxLGJ5dGVzICogMiksIDE2KSAvIG1heDtcbiAgICAgICAgICAgIHJnYi5ibHVlID0gIHBhcnNlSW50KGNzcy5zbGljZShieXRlcyAqIDIpLCAxNikgLyBtYXg7XG4gICAgICAgICAgICByZ2IuYWxwaGEgPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHJnYjtcbiAgICAgICAgfSxcblxuICAgICAgICBmdW5jdGlvbiAoIGNzcyApIHtcbiAgICAgICAgICAgIGlmIChjc3MudG9Mb3dlckNhc2UoKSAhPT0gJ3RyYW5zcGFyZW50JykgcmV0dXJuO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJhbnNwYXJlbnQ7XG4gICAgICAgIH1cbiAgICBdLFxuXG4gICAgX2Zyb21DU1M6IGZ1bmN0aW9uICggY3NzICkge1xuICAgICAgdmFyIGNvbG9yID0gbnVsbDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdGhpcy5fc3RyaW5nUGFyc2Vycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBjb2xvciA9IHRoaXMuX3N0cmluZ1BhcnNlcnNbaV0oY3NzKTtcbiAgICAgICAgICBpZiAoY29sb3IpIHJldHVybiBjb2xvcjtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Zyb21SR0I6IGZ1bmN0aW9uICggUkdCICkge1xuICAgICAgdmFyIG5ld1JHQiA9IGZhY3Rvcmllcy5SR0IoKTtcblxuICAgICAgbmV3UkdCLnJlZCA9IFJHQi5yZWQ7XG4gICAgICBuZXdSR0IuZ3JlZW4gPSBSR0IuZ3JlZW47XG4gICAgICBuZXdSR0IuYmx1ZSA9IFJHQi5ibHVlO1xuICAgICAgbmV3UkdCLmFscGhhID0gUkdCLmhhc093blByb3BlcnR5KCdhbHBoYScpID8gUkdCLmFscGhhIDogMTtcblxuICAgICAgcmV0dXJuIG5ld1JHQjtcbiAgICB9LFxuXG4gICAgX2Zyb21SR0JBcnJheTogZnVuY3Rpb24gKCBSR0IgKSB7XG4gICAgICB2YXIgbmV3UkdCID0gZmFjdG9yaWVzLlJHQigpO1xuXG4gICAgICBuZXdSR0IucmVkID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgUkdCWzBdIC8gMjU1KSk7XG4gICAgICBuZXdSR0IuZ3JlZW4gPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBSR0JbMV0gLyAyNTUpKTtcbiAgICAgIG5ld1JHQi5ibHVlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgUkdCWzJdIC8gMjU1KSk7XG4gICAgICBuZXdSR0IuYWxwaGEgPSBSR0JbM10gIT09IHVuZGVmaW5lZCA/IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIFJHQlszXSkpIDogMTtcblxuICAgICAgcmV0dXJuIG5ld1JHQjtcbiAgICB9LFxuXG4gICAgLy8gY29udmVydCB0byBhIENTUyBzdHJpbmcuIGRlZmF1bHRzIHRvIHR3byBieXRlcyBhIHZhbHVlXG4gICAgdG9DU1NIZXg6IGZ1bmN0aW9uICggYnl0ZXMgKSB7XG4gICAgICAgIGJ5dGVzID0gYnl0ZXMgfHwgMjtcblxuICAgICAgICB2YXIgbWF4ID0gTWF0aC5wb3coMTYsIGJ5dGVzKSAtIDE7XG4gICAgICAgIHZhciBjc3MgPSBbXG4gICAgICAgICAgXCIjXCIsXG4gICAgICAgICAgcGFkICggTWF0aC5yb3VuZCh0aGlzLnJlZCAqIG1heCkudG9TdHJpbmcoIDE2ICkudG9VcHBlckNhc2UoKSwgYnl0ZXMgKSxcbiAgICAgICAgICBwYWQgKCBNYXRoLnJvdW5kKHRoaXMuZ3JlZW4gKiBtYXgpLnRvU3RyaW5nKCAxNiApLnRvVXBwZXJDYXNlKCksIGJ5dGVzICksXG4gICAgICAgICAgcGFkICggTWF0aC5yb3VuZCh0aGlzLmJsdWUgKiBtYXgpLnRvU3RyaW5nKCAxNiApLnRvVXBwZXJDYXNlKCksIGJ5dGVzIClcbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gY3NzLmpvaW4oJycpO1xuICAgIH0sICAgIFxuICAgIFxuICAgIHRvQ1NTOiBmdW5jdGlvbiAoIGJ5dGVzICkge1xuICAgICAgaWYgKHRoaXMuYWxwaGEgPT09IDEpIHJldHVybiB0aGlzLnRvQ1NTSGV4KGJ5dGVzKTsgXG5cbiAgICAgIHZhciBtYXggPSAyNTU7XG4gICAgICBcbiAgICAgIHZhciBjb21wb25lbnRzID0gW1xuICAgICAgICAncmdiYSgnLFxuICAgICAgICBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXgsIE1hdGgucm91bmQodGhpcy5yZWQgKiBtYXgpKSksICcsJyxcbiAgICAgICAgTWF0aC5tYXgoMCwgTWF0aC5taW4obWF4LCBNYXRoLnJvdW5kKHRoaXMuZ3JlZW4gKiBtYXgpKSksICcsJywgXG4gICAgICAgIE1hdGgubWF4KDAsIE1hdGgubWluKG1heCwgTWF0aC5yb3VuZCh0aGlzLmJsdWUgKiBtYXgpKSksICcsJyxcbiAgICAgICAgTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdGhpcy5hbHBoYSkpLCBcbiAgICAgICAgJyknXG4gICAgICBdO1xuXG4gICAgICByZXR1cm4gY29tcG9uZW50cy5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgdG9IU1Y6IGZ1bmN0aW9uICggKSB7XG4gICAgICB2YXIgaHN2ID0gZmFjdG9yaWVzLkhTVigpO1xuICAgICAgdmFyIG1pbiwgbWF4LCBkZWx0YTtcblxuICAgICAgbWluID0gTWF0aC5taW4odGhpcy5yZWQsIHRoaXMuZ3JlZW4sIHRoaXMuYmx1ZSk7XG4gICAgICBtYXggPSBNYXRoLm1heCh0aGlzLnJlZCwgdGhpcy5ncmVlbiwgdGhpcy5ibHVlKTtcbiAgICAgIGhzdi52YWx1ZSA9IG1heDsgLy8gdlxuXG4gICAgICBkZWx0YSA9IG1heCAtIG1pbjtcblxuICAgICAgaWYoIGRlbHRhID09IDAgKSB7IC8vIHdoaXRlLCBncmV5LCBibGFja1xuICAgICAgICBoc3YuaHVlID0gaHN2LnNhdHVyYXRpb24gPSAwO1xuICAgICAgfVxuICAgICAgZWxzZSB7IC8vIGNocm9tYVxuICAgICAgICBoc3Yuc2F0dXJhdGlvbiA9IGRlbHRhIC8gbWF4O1xuXG4gICAgICAgIGlmKCB0aGlzLnJlZCA9PSBtYXggKSB7XG4gICAgICAgICAgaHN2Lmh1ZSA9ICggdGhpcy5ncmVlbiAtIHRoaXMuYmx1ZSApIC8gZGVsdGE7IC8vIGJldHdlZW4geWVsbG93ICYgbWFnZW50YVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIHRoaXMuZ3JlZW4gID09IG1heCApIHtcbiAgICAgICAgICBoc3YuaHVlID0gMiArICggdGhpcy5ibHVlIC0gdGhpcy5yZWQgKSAvIGRlbHRhOyAvLyBiZXR3ZWVuIGN5YW4gJiB5ZWxsb3dcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBoc3YuaHVlID0gNCArICggdGhpcy5yZWQgLSB0aGlzLmdyZWVuICkgLyBkZWx0YTsgLy8gYmV0d2VlbiBtYWdlbnRhICYgY3lhblxuICAgICAgICB9XG5cbiAgICAgICAgaHN2Lmh1ZSA9ICgoaHN2Lmh1ZSAqIDYwKSArIDM2MCkgJSAzNjA7IC8vIGRlZ3JlZXNcbiAgICAgIH1cblxuICAgICAgaHN2LmFscGhhID0gdGhpcy5hbHBoYTtcblxuICAgICAgcmV0dXJuIGhzdjtcbiAgICB9LFxuICAgIHRvSFNMOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMudG9IU1YoKS50b0hTTCgpO1xuICAgIH0sXG5cbiAgICB0b1JHQjogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCk7XG4gICAgfVxuICB9KTtcblxuICB0cmFuc3BhcmVudCA9IGNvbG9yLmZyb21PYmplY3Qoe3JlZDogMCwgYmx1ZTogMCwgZ3JlZW46IDAsIGFscGhhOiAwfSk7XG5cblxuICAvKiBMaWtlIFJHQiBhYm92ZSwgdGhpcyBvYmplY3QgZGVzY3JpYmVzIHdoYXQgd2lsbCBiZWNvbWUgdGhlIEhTVlxuICAgKiB0ZW1wbGF0ZSBvYmplY3QuIFRoaXMgbW9kZWwgaGFuZGxlcyBodWUsIHNhdHVyYXRpb24gYW5kIHZhbHVlLlxuICAgKiBodWUgaXMgdGhlIG51bWJlciBvZiBkZWdyZWVzIGFyb3VuZCB0aGUgY29sb3Igd2hlZWwsIHNhdHVyYXRpb25cbiAgICogZGVzY3JpYmVzIGhvdyBtdWNoIGNvbG9yIHRoZWlyIGlzIGFuZCB2YWx1ZSBpcyB0aGUgYnJpZ2h0bmVzcy5cbiAgICovXG4gIHJlZ2lzdGVyTW9kZWwoJ0hTVicsIHtcbiAgICBodWU6IDAsXG4gICAgc2F0dXJhdGlvbjogMCxcbiAgICB2YWx1ZTogMSxcbiAgICBhbHBoYTogMSxcblxuICAgIHNoaWZ0SHVlOiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCBkZWdyZWVzICkge1xuICAgICAgdmFyIGh1ZSA9ICh0aGlzLmh1ZSArIGRlZ3JlZXMpICUgMzYwO1xuICAgICAgaWYgKGh1ZSA8IDApIHtcbiAgICAgICAgaHVlID0gKDM2MCArIGh1ZSkgJSAzNjA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaHVlID0gaHVlO1xuICAgIH0pLFxuXG4gICAgZGV2YWx1ZUJ5QW1vdW50OiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4oMSwgTWF0aC5tYXgodGhpcy52YWx1ZSAtIHZhbCwgMCkpO1xuICAgIH0pLFxuXG4gICAgZGV2YWx1ZUJ5UmF0aW86IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLnZhbHVlICogKDEgLSB2YWwpLCAwKSk7XG4gICAgfSksXG5cbiAgICB2YWx1ZUJ5QW1vdW50OiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4oMSwgTWF0aC5tYXgodGhpcy52YWx1ZSArIHZhbCwgMCkpO1xuICAgIH0pLFxuXG4gICAgdmFsdWVCeVJhdGlvOiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4oMSwgTWF0aC5tYXgodGhpcy52YWx1ZSAqICgxICsgdmFsKSwgMCkpO1xuICAgIH0pLFxuXG4gICAgZGVzYXR1cmF0ZUJ5QW1vdW50OiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICB0aGlzLnNhdHVyYXRpb24gPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLnNhdHVyYXRpb24gLSB2YWwsIDApKTtcbiAgICB9KSxcblxuICAgIGRlc2F0dXJhdGVCeVJhdGlvOiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICB0aGlzLnNhdHVyYXRpb24gPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLnNhdHVyYXRpb24gKiAoMSAtIHZhbCksIDApKTtcbiAgICB9KSxcblxuICAgIHNhdHVyYXRlQnlBbW91bnQ6IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMuc2F0dXJhdGlvbiA9IE1hdGgubWluKDEsIE1hdGgubWF4KHRoaXMuc2F0dXJhdGlvbiArIHZhbCwgMCkpO1xuICAgIH0pLFxuXG4gICAgc2F0dXJhdGVCeVJhdGlvOiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICB0aGlzLnNhdHVyYXRpb24gPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLnNhdHVyYXRpb24gKiAoMSArIHZhbCksIDApKTtcbiAgICB9KSxcblxuICAgIHNjaGVtZUZyb21EZWdyZWVzOiBmdW5jdGlvbiAoIGRlZ3JlZXMgKSB7XG4gICAgICB2YXIgbmV3Q29sb3JzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGRlZ3JlZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIHZhciBjb2wgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIGNvbC5odWUgPSAodGhpcy5odWUgKyBkZWdyZWVzW2ldKSAlIDM2MDtcbiAgICAgICAgbmV3Q29sb3JzLnB1c2goY29sKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXdDb2xvcnM7XG4gICAgfSxcblxuICAgIGNvbXBsZW1lbnRhcnlTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCwxODBdKTtcbiAgICB9LFxuXG4gICAgc3BsaXRDb21wbGVtZW50YXJ5U2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsMTUwLDMyMF0pO1xuICAgIH0sXG5cbiAgICBzcGxpdENvbXBsZW1lbnRhcnlDV1NjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDE1MCwzMDBdKTtcbiAgICB9LFxuXG4gICAgc3BsaXRDb21wbGVtZW50YXJ5Q0NXU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsNjAsMjEwXSk7XG4gICAgfSxcblxuICAgIHRyaWFkaWNTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCwxMjAsMjQwXSk7XG4gICAgfSxcblxuICAgIGNsYXNoU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsOTAsMjcwXSk7XG4gICAgfSxcblxuICAgIHRldHJhZGljU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsOTAsMTgwLDI3MF0pO1xuICAgIH0sXG5cbiAgICBmb3VyVG9uZUNXU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsNjAsMTgwLDI0MF0pO1xuICAgIH0sXG5cbiAgICBmb3VyVG9uZUNDV1NjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDEyMCwxODAsMzAwXSk7XG4gICAgfSxcblxuICAgIGZpdmVUb25lQVNjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDExNSwxNTUsMjA1LDI0NV0pO1xuICAgIH0sXG5cbiAgICBmaXZlVG9uZUJTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCw0MCw5MCwxMzAsMjQ1XSk7XG4gICAgfSxcblxuICAgIGZpdmVUb25lQ1NjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDUwLDkwLDIwNSwzMjBdKTtcbiAgICB9LFxuXG4gICAgZml2ZVRvbmVEU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsNDAsMTU1LDI3MCwzMTBdKTtcbiAgICB9LFxuXG4gICAgZml2ZVRvbmVFU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsMTE1LDIzMCwyNzAsMzIwXSk7XG4gICAgfSxcblxuICAgIHNpeFRvbmVDV1NjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDMwLDEyMCwxNTAsMjQwLDI3MF0pO1xuICAgIH0sXG5cbiAgICBzaXhUb25lQ0NXU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsOTAsMTIwLDIxMCwyNDAsMzMwXSk7XG4gICAgfSxcblxuICAgIG5ldXRyYWxTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCwxNSwzMCw0NSw2MCw3NV0pO1xuICAgIH0sXG5cbiAgICBhbmFsb2dvdXNTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCwzMCw2MCw5MCwxMjAsMTUwXSk7XG4gICAgfSxcblxuICAgIGZyb21PYmplY3Q6IGZ1bmN0aW9uICggbyApIHtcbiAgICAgIGlmIChvLmhhc093blByb3BlcnR5KCdodWUnKSAmJlxuICAgICAgICAgIG8uaGFzT3duUHJvcGVydHkoJ3NhdHVyYXRpb24nKSAmJlxuICAgICAgICAgIG8uaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcbiAgICAgICAgdmFyIGhzdiA9IGZhY3Rvcmllcy5IU1YoKTtcblxuICAgICAgICBoc3YuaHVlID0gby5odWU7XG4gICAgICAgIGhzdi5zYXR1cmF0aW9uID0gby5zYXR1cmF0aW9uO1xuICAgICAgICBoc3YudmFsdWUgPSBvLnZhbHVlO1xuICAgICAgICBoc3YuYWxwaGEgPSBvLmhhc093blByb3BlcnR5KCdhbHBoYScpID8gby5hbHBoYSA6IDE7XG5cbiAgICAgICAgcmV0dXJuIGhzdjtcbiAgICAgIH1cbiAgICAgIC8vIG5vdGhpbmcgbWF0Y2hlcywgbm90IGFuIEhTViBvYmplY3RcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBfbm9ybWFsaXNlOiBmdW5jdGlvbiAoICkge1xuICAgICAgIHRoaXMuaHVlICU9IDM2MDtcbiAgICAgICB0aGlzLnNhdHVyYXRpb24gPSBNYXRoLm1pbihNYXRoLm1heCgwLCB0aGlzLnNhdHVyYXRpb24pLCAxKTtcbiAgICAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgdGhpcy52YWx1ZSkpO1xuICAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB0aGlzLmFscGhhKSk7XG4gICAgfSxcblxuICAgIHRvUkdCOiBmdW5jdGlvbiAoICkge1xuICAgICAgdGhpcy5fbm9ybWFsaXNlKCk7XG5cbiAgICAgIHZhciByZ2IgPSBmYWN0b3JpZXMuUkdCKCk7XG4gICAgICB2YXIgaTtcbiAgICAgIHZhciBmLCBwLCBxLCB0O1xuXG4gICAgICBpZiggdGhpcy5zYXR1cmF0aW9uID09PSAwICkge1xuICAgICAgICAvLyBhY2hyb21hdGljIChncmV5KVxuICAgICAgICByZ2IucmVkID0gdGhpcy52YWx1ZTtcbiAgICAgICAgcmdiLmdyZWVuID0gdGhpcy52YWx1ZTtcbiAgICAgICAgcmdiLmJsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICByZ2IuYWxwaGEgPSB0aGlzLmFscGhhO1xuICAgICAgICByZXR1cm4gcmdiO1xuICAgICAgfVxuXG4gICAgICB2YXIgaCA9IHRoaXMuaHVlIC8gNjA7XHRcdFx0Ly8gc2VjdG9yIDAgdG8gNVxuICAgICAgaSA9IE1hdGguZmxvb3IoIGggKTtcbiAgICAgIGYgPSBoIC0gaTtcdFx0XHQvLyBmYWN0b3JpYWwgcGFydCBvZiBoXG4gICAgICBwID0gdGhpcy52YWx1ZSAqICggMSAtIHRoaXMuc2F0dXJhdGlvbiApO1xuICAgICAgcSA9IHRoaXMudmFsdWUgKiAoIDEgLSB0aGlzLnNhdHVyYXRpb24gKiBmICk7XG4gICAgICB0ID0gdGhpcy52YWx1ZSAqICggMSAtIHRoaXMuc2F0dXJhdGlvbiAqICggMSAtIGYgKSApO1xuXG4gICAgICBzd2l0Y2goIGkgKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICByZ2IucmVkID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICByZ2IuZ3JlZW4gPSB0O1xuICAgICAgICAgIHJnYi5ibHVlID0gcDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHJnYi5yZWQgPSBxO1xuICAgICAgICAgIHJnYi5ncmVlbiA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgcmdiLmJsdWUgPSBwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgcmdiLnJlZCA9IHA7XG4gICAgICAgICAgcmdiLmdyZWVuID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICByZ2IuYmx1ZSA9IHQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICByZ2IucmVkID0gcDtcbiAgICAgICAgICByZ2IuZ3JlZW4gPSBxO1xuICAgICAgICAgIHJnYi5ibHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHJnYi5yZWQgPSB0O1xuICAgICAgICAgIHJnYi5ncmVlbiA9IHA7XG4gICAgICAgICAgcmdiLmJsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0Olx0XHQvLyBjYXNlIDU6XG4gICAgICAgICAgcmdiLnJlZCA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgcmdiLmdyZWVuID0gcDtcbiAgICAgICAgICByZ2IuYmx1ZSA9IHE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHJnYi5hbHBoYSA9IHRoaXMuYWxwaGE7XG5cbiAgICAgIHJldHVybiByZ2I7XG4gICAgfSxcbiAgICB0b0hTTDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9ub3JtYWxpc2UoKTtcblxuICAgICAgdmFyIGhzbCA9IGZhY3Rvcmllcy5IU0woKTtcblxuICAgICAgaHNsLmh1ZSA9IHRoaXMuaHVlO1xuICAgICAgdmFyIGwgPSAoMiAtIHRoaXMuc2F0dXJhdGlvbikgKiB0aGlzLnZhbHVlLFxuICAgICAgICAgIHMgPSB0aGlzLnNhdHVyYXRpb24gKiB0aGlzLnZhbHVlO1xuICAgICAgaWYobCAmJiAyIC0gbCkge1xuICAgICAgICBzIC89IChsIDw9IDEpID8gbCA6IDIgLSBsO1xuICAgICAgfVxuICAgICAgbCAvPSAyO1xuICAgICAgaHNsLnNhdHVyYXRpb24gPSBzO1xuICAgICAgaHNsLmxpZ2h0bmVzcyA9IGw7XG4gICAgICBoc2wuYWxwaGEgPSB0aGlzLmFscGhhO1xuXG4gICAgICByZXR1cm4gaHNsO1xuICAgIH0sXG5cbiAgICB0b0hTVjogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCk7XG4gICAgfVxuICB9KTtcblxuICByZWdpc3Rlck1vZGVsKCdIU0wnLCB7XG4gICAgaHVlOiAwLFxuICAgIHNhdHVyYXRpb246IDAsXG4gICAgbGlnaHRuZXNzOiAwLFxuICAgIGFscGhhOiAxLFxuXG4gICAgZGFya2VuQnlBbW91bnQ6IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMubGlnaHRuZXNzID0gTWF0aC5taW4oMSwgTWF0aC5tYXgodGhpcy5saWdodG5lc3MgLSB2YWwsIDApKTtcbiAgICB9KSxcblxuICAgIGRhcmtlbkJ5UmF0aW86IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMubGlnaHRuZXNzID0gTWF0aC5taW4oMSwgTWF0aC5tYXgodGhpcy5saWdodG5lc3MgKiAoMSAtIHZhbCksIDApKTtcbiAgICB9KSxcblxuICAgIGxpZ2h0ZW5CeUFtb3VudDogY2xvbmVPbkFwcGx5KGZ1bmN0aW9uICggdmFsICkge1xuICAgICAgdGhpcy5saWdodG5lc3MgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLmxpZ2h0bmVzcyArIHZhbCwgMCkpO1xuICAgIH0pLFxuXG4gICAgbGlnaHRlbkJ5UmF0aW86IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMubGlnaHRuZXNzID0gTWF0aC5taW4oMSwgTWF0aC5tYXgodGhpcy5saWdodG5lc3MgKiAoMSArIHZhbCksIDApKTtcbiAgICB9KSxcblxuICAgIGZyb21PYmplY3Q6IGZ1bmN0aW9uICggbyApIHtcbiAgICAgIGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBvKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tQ1NTKCBvICk7XG4gICAgICB9XG4gICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eSgnaHVlJykgJiZcbiAgICAgICAgICBvLmhhc093blByb3BlcnR5KCdzYXR1cmF0aW9uJykgJiZcbiAgICAgICAgICBvLmhhc093blByb3BlcnR5KCdsaWdodG5lc3MnKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJvbUhTTCAoIG8gKTtcbiAgICAgIH1cbiAgICAgIC8vIG5vdGhpbmcgbWF0Y2hzLCBub3QgYW4gUkdCIG9iamVjdFxuICAgIH0sXG5cbiAgICBfZnJvbUNTUzogZnVuY3Rpb24gKCBjc3MgKSB7XG4gICAgICB2YXIgY29sb3JHcm91cHMgPSB0cmltKCBjc3MgKS5tYXRjaCggaHNsX2hzbGFfcmVnZXggKTtcblxuICAgICAgLy8gaWYgdGhlcmUgaXMgYW4gXCJhXCIgYWZ0ZXIgXCJoc2xcIiwgdGhlcmUgbXVzdCBiZSBhIGZvdXJ0aCBwYXJhbWV0ZXIgYW5kIHRoZSBvdGhlciB3YXkgcm91bmRcbiAgICAgIGlmICghY29sb3JHcm91cHMgfHwgKCEhY29sb3JHcm91cHNbMV0gKyAhIWNvbG9yR3JvdXBzWzVdID09PSAxKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGhzbCA9IGZhY3Rvcmllcy5IU0woKTtcbiAgICAgIGhzbC5odWUgICAgICAgID0gKGNvbG9yR3JvdXBzWzJdICUgMzYwICsgMzYwKSAlIDM2MDtcbiAgICAgIGhzbC5zYXR1cmF0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ocGFyc2VJbnQoY29sb3JHcm91cHNbM10sIDEwKSAvIDEwMCwgMSkpO1xuICAgICAgaHNsLmxpZ2h0bmVzcyAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihwYXJzZUludChjb2xvckdyb3Vwc1s0XSwgMTApIC8gMTAwLCAxKSk7XG4gICAgICBoc2wuYWxwaGEgICAgICA9ICEhY29sb3JHcm91cHNbNV0gPyBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBwYXJzZUZsb2F0KGNvbG9yR3JvdXBzWzZdKSkpIDogMTtcblxuICAgICAgcmV0dXJuIGhzbDtcbiAgICB9LFxuXG4gICAgX2Zyb21IU0w6IGZ1bmN0aW9uICggSFNMICkge1xuICAgICAgdmFyIG5ld0hTTCA9IGZhY3Rvcmllcy5IU0woKTtcblxuICAgICAgbmV3SFNMLmh1ZSA9IEhTTC5odWU7XG4gICAgICBuZXdIU0wuc2F0dXJhdGlvbiA9IEhTTC5zYXR1cmF0aW9uO1xuICAgICAgbmV3SFNMLmxpZ2h0bmVzcyA9IEhTTC5saWdodG5lc3M7XG5cbiAgICAgIG5ld0hTTC5hbHBoYSA9IEhTTC5oYXNPd25Qcm9wZXJ0eSgnYWxwaGEnKSA/IEhTTC5hbHBoYSA6IDE7XG5cbiAgICAgIHJldHVybiBuZXdIU0w7XG4gICAgfSxcblxuICAgIF9ub3JtYWxpc2U6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgdGhpcy5odWUgPSAodGhpcy5odWUgJSAzNjAgKyAzNjApICUgMzYwO1xuICAgICAgIHRoaXMuc2F0dXJhdGlvbiA9IE1hdGgubWluKE1hdGgubWF4KDAsIHRoaXMuc2F0dXJhdGlvbiksIDEpO1xuICAgICAgIHRoaXMubGlnaHRuZXNzID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgdGhpcy5saWdodG5lc3MpKTtcbiAgICAgICB0aGlzLmFscGhhID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdGhpcy5hbHBoYSkpO1xuICAgIH0sXG5cbiAgICB0b0hTTDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xuICAgIH0sXG4gICAgdG9IU1Y6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fbm9ybWFsaXNlKCk7XG5cbiAgICAgIHZhciBoc3YgPSBmYWN0b3JpZXMuSFNWKCk7XG5cbiAgICAgIC8vIGh0dHA6Ly9hcml5YS5ibG9nc3BvdC5jb20vMjAwOC8wNy9jb252ZXJ0aW5nLWJldHdlZW4taHNsLWFuZC1oc3YuaHRtbFxuICAgICAgaHN2Lmh1ZSA9IHRoaXMuaHVlOyAvLyBIXG4gICAgICB2YXIgbCA9IDIgKiB0aGlzLmxpZ2h0bmVzcyxcbiAgICAgICAgICBzID0gdGhpcy5zYXR1cmF0aW9uICogKChsIDw9IDEpID8gbCA6IDIgLSBsKTtcbiAgICAgIGhzdi52YWx1ZSA9IChsICsgcykgLyAyOyAvLyBWXG4gICAgICBoc3Yuc2F0dXJhdGlvbiA9ICgoMiAqIHMpIC8gKGwgKyBzKSkgfHwgMDsgLy8gU1xuICAgICAgaHN2LmFscGhhID0gdGhpcy5hbHBoYTtcblxuICAgICAgcmV0dXJuIGhzdjtcbiAgICB9LFxuICAgIHRvUkdCOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvSFNWKCkudG9SR0IoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFBhY2thZ2Ugc3BlY2lmaWMgZXhwb3J0c1xuXG4gIC8qIHRoZSBDb2xvciBmdW5jdGlvbiBpcyBhIGZhY3RvcnkgZm9yIG5ldyBjb2xvciBvYmplY3RzLlxuICAgKi9cbiAgZnVuY3Rpb24gQ29sb3IoIG8gKSB7XG4gICAgcmV0dXJuIGNvbG9yLmZyb21PYmplY3QoIG8gKTtcbiAgfVxuICBDb2xvci5pc1ZhbGlkID0gZnVuY3Rpb24oIHN0ciApIHtcbiAgICB2YXIga2V5LCBjID0gQ29sb3IoIHN0ciApO1xuXG4gICAgdmFyIGxlbmd0aCA9IDA7XG4gICAgZm9yKGtleSBpbiBjKSB7XG4gICAgICBpZihjLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgbGVuZ3RoKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlbmd0aCA+IDA7XG4gIH07XG4gIG5ldC5icmVoYXV0LkNvbG9yID0gQ29sb3I7XG59KS5jYWxsKG5ldC5icmVoYXV0KTtcblxuLyogRXhwb3J0IHRvIENvbW1vbkpTXG4qL1xuaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBuZXQuYnJlaGF1dC5Db2xvcjtcbn1cbiIsInJlcXVpcmUoJy4vc2hpbScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUuZGljdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUuaXRlci1oZWxwZXJzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS4kZm9yJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5kZWxheScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUuZnVuY3Rpb24ucGFydCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUub2JqZWN0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5hcnJheS50dXJuJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5udW1iZXIuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLm51bWJlci5tYXRoJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5zdHJpbmcuZXNjYXBlLWh0bWwnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLmRhdGUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLmdsb2JhbCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUubG9nJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbW9kdWxlcy8kJykuY29yZTsiLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAkLnRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciAkICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCA9IHJlcXVpcmUoJy4vJC5jdHgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVFlQRSl7XG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXG4gICAgLCBJU19GSUxURVIgICAgID0gVFlQRSA9PSAyXG4gICAgLCBJU19TT01FICAgICAgID0gVFlQRSA9PSAzXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XG4gICAgLCBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2XG4gICAgLCBOT19IT0xFUyAgICAgID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCl7XG4gICAgdmFyIE8gICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQoJHRoaXMpKVxuICAgICAgLCBzZWxmICAgPSAkLkVTNU9iamVjdChPKVxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcbiAgICAgICwgbGVuZ3RoID0gJC50b0xlbmd0aChzZWxmLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMFxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgPyBBcnJheShsZW5ndGgpIDogSVNfRklMVEVSID8gW10gOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnMSwgbXNnMil7XG4gIGlmKCFjb25kaXRpb24pdGhyb3cgVHlwZUVycm9yKG1zZzIgPyBtc2cxICsgbXNnMiA6IG1zZzEpO1xufVxuYXNzZXJ0LmRlZiA9ICQuYXNzZXJ0RGVmaW5lZDtcbmFzc2VydC5mbiA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoISQuaXNGdW5jdGlvbihpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbmFzc2VydC5vYmogPSBmdW5jdGlvbihpdCl7XG4gIGlmKCEkLmlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG5hc3NlcnQuaW5zdCA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGFzc2VydDsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGVudW1LZXlzID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2Upe1xuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICB2YXIgVCA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGFyZ2V0KSlcbiAgICAsIGwgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBpID0gMTtcbiAgd2hpbGUobCA+IGkpe1xuICAgIHZhciBTICAgICAgPSAkLkVTNU9iamVjdChhcmd1bWVudHNbaSsrXSlcbiAgICAgICwga2V5cyAgID0gZW51bUtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailUW2tleSA9IGtleXNbaisrXV0gPSBTW2tleV07XG4gIH1cbiAgcmV0dXJuIFQ7XG59OyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgVEFHICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLCB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuZnVuY3Rpb24gY29mKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn1cbmNvZi5jbGFzc29mID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVDtcbiAgcmV0dXJuIGl0ID09IHVuZGVmaW5lZCA/IGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6ICdOdWxsJ1xuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFQgOiBjb2YoTyk7XG59O1xuY29mLnNldCA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhJC5oYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpJC5oaWRlKGl0LCBUQUcsIHRhZyk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBjb2Y7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIHNhZmUgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcbiAgLCBhc3NlcnQgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGZvck9mICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgc3RlcCAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpLnN0ZXBcbiAgLCAkaGFzICAgICA9ICQuaGFzXG4gICwgc2V0ICAgICAgPSAkLnNldFxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxuICAsIGhpZGUgICAgID0gJC5oaWRlXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIElEICAgICAgID0gc2FmZSgnaWQnKVxuICAsIE8xICAgICAgID0gc2FmZSgnTzEnKVxuICAsIExBU1QgICAgID0gc2FmZSgnbGFzdCcpXG4gICwgRklSU1QgICAgPSBzYWZlKCdmaXJzdCcpXG4gICwgSVRFUiAgICAgPSBzYWZlKCdpdGVyJylcbiAgLCBTSVpFICAgICA9ICQuREVTQyA/IHNhZmUoJ3NpemUnKSA6ICdzaXplJ1xuICAsIGlkICAgICAgID0gMDtcblxuZnVuY3Rpb24gZmFzdEtleShpdCwgY3JlYXRlKXtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmKCEkaGFzKGl0LCBJRCkpe1xuICAgIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcbiAgICBoaWRlKGl0LCBJRCwgKytpZCk7XG4gIC8vIHJldHVybiBvYmplY3QgaWQgd2l0aCBwcmVmaXhcbiAgfSByZXR1cm4gJ08nICsgaXRbSURdO1xufVxuXG5mdW5jdGlvbiBnZXRFbnRyeSh0aGF0LCBrZXkpe1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpLCBlbnRyeTtcbiAgaWYoaW5kZXggIT09ICdGJylyZXR1cm4gdGhhdFtPMV1baW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yKGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpe1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbih0aGF0LCBpdGVyYWJsZSl7XG4gICAgICBhc3NlcnQuaW5zdCh0aGF0LCBDLCBOQU1FKTtcbiAgICAgIHNldCh0aGF0LCBPMSwgJC5jcmVhdGUobnVsbCkpO1xuICAgICAgc2V0KHRoYXQsIFNJWkUsIDApO1xuICAgICAgc2V0KHRoYXQsIExBU1QsIHVuZGVmaW5lZCk7XG4gICAgICBzZXQodGhhdCwgRklSU1QsIHVuZGVmaW5lZCk7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlcXVpcmUoJy4vJC5taXgnKShDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0W0ZJUlNUXSA9IHRoYXRbTEFTVF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYoZW50cnkpe1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdFtPMV1bZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0W0ZJUlNUXSA9PSBlbnRyeSl0aGF0W0ZJUlNUXSA9IG5leHQ7XG4gICAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXNbRklSU1RdKXtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlKGVudHJ5ICYmIGVudHJ5LnIpZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmKCQuREVTQykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gYXNzZXJ0LmRlZih0aGlzW1NJWkVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXG4gICAgICAsIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmKGVudHJ5KXtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0W0xBU1RdLCAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmKCF0aGF0W0ZJUlNUXSl0aGF0W0ZJUlNUXSA9IGVudHJ5O1xuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYoaW5kZXggIT09ICdGJyl0aGF0W08xXVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gIHNldEl0ZXI6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAgICAgc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgazoga2luZH0pO1xuICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXG4gICAgICAgICwga2luZCAgPSBpdGVyLmtcbiAgICAgICAgLCBlbnRyeSA9IGl0ZXIubDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIWl0ZXIubyB8fCAhKGl0ZXIubCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogaXRlci5vW0ZJUlNUXSkpe1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgZm9yT2YgPSByZXF1aXJlKCcuLyQuZm9yLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUpe1xuICAkZGVmKCRkZWYuUCwgTkFNRSwge1xuICAgIHRvSlNPTjogZnVuY3Rpb24gdG9KU09OKCl7XG4gICAgICB2YXIgYXJyID0gW107XG4gICAgICBmb3JPZih0aGlzLCBmYWxzZSwgYXJyLnB1c2gsIGFycik7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHNhZmUgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlXG4gICwgYXNzZXJ0ICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgZm9yT2YgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgJGhhcyAgICAgID0gJC5oYXNcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XG4gICwgaGlkZSAgICAgID0gJC5oaWRlXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIGlkICAgICAgICA9IDBcbiAgLCBJRCAgICAgICAgPSBzYWZlKCdpZCcpXG4gICwgV0VBSyAgICAgID0gc2FmZSgnd2VhaycpXG4gICwgTEVBSyAgICAgID0gc2FmZSgnbGVhaycpXG4gICwgbWV0aG9kICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxuICAsIGZpbmQgICAgICA9IG1ldGhvZCg1KVxuICAsIGZpbmRJbmRleCA9IG1ldGhvZCg2KTtcbmZ1bmN0aW9uIGZpbmRGcm96ZW4oc3RvcmUsIGtleSl7XG4gIHJldHVybiBmaW5kKHN0b3JlLmFycmF5LCBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gIH0pO1xufVxuLy8gZmFsbGJhY2sgZm9yIGZyb3plbiBrZXlzXG5mdW5jdGlvbiBsZWFrU3RvcmUodGhhdCl7XG4gIHJldHVybiB0aGF0W0xFQUtdIHx8IGhpZGUodGhhdCwgTEVBSywge1xuICAgIGFycmF5OiBbXSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSl7XG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gICAgICBpZihlbnRyeSlyZXR1cm4gZW50cnlbMV07XG4gICAgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XG4gICAgICByZXR1cm4gISFmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgdmFyIGVudHJ5ID0gZmluZEZyb3plbih0aGlzLCBrZXkpO1xuICAgICAgaWYoZW50cnkpZW50cnlbMV0gPSB2YWx1ZTtcbiAgICAgIGVsc2UgdGhpcy5hcnJheS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgfSxcbiAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleCh0aGlzLmFycmF5LCBmdW5jdGlvbihpdCl7XG4gICAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgICBpZih+aW5kZXgpdGhpcy5hcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgcmV0dXJuICEhfmluZGV4O1xuICAgIH1cbiAgfSlbTEVBS107XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgICQuc2V0KGFzc2VydC5pbnN0KHRoYXQsIEMsIE5BTUUpLCBJRCwgaWQrKyk7XG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlcXVpcmUoJy4vJC5taXgnKShDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMy4zLjIgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjQuMy4zIFdlYWtTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICBpZighaXNPYmplY3Qoa2V5KSlyZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmKCFpc0V4dGVuc2libGUoa2V5KSlyZXR1cm4gbGVha1N0b3JlKHRoaXMpWydkZWxldGUnXShrZXkpO1xuICAgICAgICByZXR1cm4gJGhhcyhrZXksIFdFQUspICYmICRoYXMoa2V5W1dFQUtdLCB0aGlzW0lEXSkgJiYgZGVsZXRlIGtleVtXRUFLXVt0aGlzW0lEXV07XG4gICAgICB9LFxuICAgICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjQuMy40IFdlYWtTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIWlzRXh0ZW5zaWJsZShrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuaGFzKGtleSk7XG4gICAgICAgIHJldHVybiAkaGFzKGtleSwgV0VBSykgJiYgJGhhcyhrZXlbV0VBS10sIHRoaXNbSURdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICBpZighaXNFeHRlbnNpYmxlKGFzc2VydC5vYmooa2V5KSkpe1xuICAgICAgbGVha1N0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGhhcyhrZXksIFdFQUspIHx8IGhpZGUoa2V5LCBXRUFLLCB7fSk7XG4gICAgICBrZXlbV0VBS11bdGhhdFtJRF1dID0gdmFsdWU7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgbGVha1N0b3JlOiBsZWFrU3RvcmUsXG4gIFdFQUs6IFdFQUssXG4gIElEOiBJRFxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgQlVHR1kgPSAkaXRlci5CVUdHWVxuICAsIGZvck9mID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgYXNzZXJ0SW5zdGFuY2UgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuaW5zdFxuICAsIElOVEVSTkFMID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2ludGVybmFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xuICB2YXIgQmFzZSAgPSAkLmdbTkFNRV1cbiAgICAsIEMgICAgID0gQmFzZVxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXG4gICAgLCBwcm90byA9IEMgJiYgQy5wcm90b3R5cGVcbiAgICAsIE8gICAgID0ge307XG4gIGlmKCEkLkRFU0MgfHwgISQuaXNGdW5jdGlvbihDKSB8fCAhKElTX1dFQUsgfHwgIUJVR0dZICYmIHByb3RvLmZvckVhY2ggJiYgcHJvdG8uZW50cmllcykpe1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZXF1aXJlKCcuLyQubWl4JykoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRhcmdldCwgaXRlcmFibGUpe1xuICAgICAgYXNzZXJ0SW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FKTtcbiAgICAgIHRhcmdldFtJTlRFUk5BTF0gPSBuZXcgQmFzZTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0YXJnZXRbQURERVJdLCB0YXJnZXQpO1xuICAgIH0pO1xuICAgICQuZWFjaC5jYWxsKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcycuc3BsaXQoJywnKSxmdW5jdGlvbihLRVkpe1xuICAgICAgdmFyIGNoYWluID0gS0VZID09ICdhZGQnIHx8IEtFWSA9PSAnc2V0JztcbiAgICAgIGlmKEtFWSBpbiBwcm90bykkLmhpZGUoQy5wcm90b3R5cGUsIEtFWSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzW0lOVEVSTkFMXVtLRVldKGEgPT09IDAgPyAwIDogYSwgYik7XG4gICAgICAgIHJldHVybiBjaGFpbiA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZignc2l6ZScgaW4gcHJvdG8pJC5zZXREZXNjKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXNbSU5URVJOQUxdLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXF1aXJlKCcuLyQuY29mJykuc2V0KEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiwgTyk7XG4gIHJlcXVpcmUoJy4vJC5zcGVjaWVzJykoQyk7XG5cbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldEl0ZXIoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwiLy8gT3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYXNzZXJ0RnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuZm47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhc3NlcnRGdW5jdGlvbihmbik7XG4gIGlmKH5sZW5ndGggJiYgdGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH0gcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGdsb2JhbCAgICAgPSAkLmdcbiAgLCBjb3JlICAgICAgID0gJC5jb3JlXG4gICwgaXNGdW5jdGlvbiA9ICQuaXNGdW5jdGlvbjtcbmZ1bmN0aW9uIGN0eChmbiwgdGhhdCl7XG4gIHJldHVybiBmdW5jdGlvbigpe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufVxuLy8gdHlwZSBiaXRtYXBcbiRkZWYuRiA9IDE7ICAvLyBmb3JjZWRcbiRkZWYuRyA9IDI7ICAvLyBnbG9iYWxcbiRkZWYuUyA9IDQ7ICAvLyBzdGF0aWNcbiRkZWYuUCA9IDg7ICAvLyBwcm90b1xuJGRlZi5CID0gMTY7IC8vIGJpbmRcbiRkZWYuVyA9IDMyOyAvLyB3cmFwXG5mdW5jdGlvbiAkZGVmKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcbiAgICAsIGlzR2xvYmFsID0gdHlwZSAmICRkZWYuR1xuICAgICwgaXNQcm90byAgPSB0eXBlICYgJGRlZi5QXG4gICAgLCB0YXJnZXQgICA9IGlzR2xvYmFsID8gZ2xvYmFsIDogdHlwZSAmICRkZWYuU1xuICAgICAgICA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pLnByb3RvdHlwZVxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICBpZihpc0dsb2JhbClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gISh0eXBlICYgJGRlZi5GKSAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGlmKGlzR2xvYmFsICYmICFpc0Z1bmN0aW9uKHRhcmdldFtrZXldKSlleHAgPSBzb3VyY2Vba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGVsc2UgaWYodHlwZSAmICRkZWYuQiAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIGVsc2UgaWYodHlwZSAmICRkZWYuVyAmJiB0YXJnZXRba2V5XSA9PSBvdXQpIWZ1bmN0aW9uKEMpe1xuICAgICAgZXhwID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIEMgPyBuZXcgQyhwYXJhbSkgOiBDKHBhcmFtKTtcbiAgICAgIH07XG4gICAgICBleHAucHJvdG90eXBlID0gQy5wcm90b3R5cGU7XG4gICAgfShvdXQpO1xuICAgIGVsc2UgZXhwID0gaXNQcm90byAmJiBpc0Z1bmN0aW9uKG91dCkgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnRcbiAgICBleHBvcnRzW2tleV0gPSBleHA7XG4gICAgaWYoaXNQcm90bykoZXhwb3J0cy5wcm90b3R5cGUgfHwgKGV4cG9ydHMucHJvdG90eXBlID0ge30pKVtrZXldID0gb3V0O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9ICRkZWY7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBkb2N1bWVudCA9ICQuZy5kb2N1bWVudFxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXRLZXlzKGl0KVxuICAgICwgZ2V0RGVzYyAgICA9ICQuZ2V0RGVzY1xuICAgICwgZ2V0U3ltYm9scyA9ICQuZ2V0U3ltYm9scztcbiAgaWYoZ2V0U3ltYm9scykkLmVhY2guY2FsbChnZXRTeW1ib2xzKGl0KSwgZnVuY3Rpb24oa2V5KXtcbiAgICBpZihnZXREZXNjKGl0LCBrZXkpLmVudW1lcmFibGUpa2V5cy5wdXNoKGtleSk7XG4gIH0pO1xuICByZXR1cm4ga2V5cztcbn07IiwidmFyIGN0eCAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBnZXQgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5nZXRcbiAgLCBjYWxsID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQpe1xuICB2YXIgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpXG4gICAgLCBmICAgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgc3RlcDtcbiAgd2hpbGUoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKXtcbiAgICBpZihjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKSA9PT0gZmFsc2Upe1xuICAgICAgcmV0dXJuIGNhbGwuY2xvc2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCQpe1xuICAkLkZXICAgPSBmYWxzZTtcbiAgJC5wYXRoID0gJC5jb3JlO1xuICByZXR1cm4gJDtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xyXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCB0b1N0cmluZyA9IHt9LnRvU3RyaW5nXHJcbiAgLCBnZXROYW1lcyA9ICQuZ2V0TmFtZXM7XHJcblxyXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXHJcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XHJcblxyXG5mdW5jdGlvbiBnZXRXaW5kb3dOYW1lcyhpdCl7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBnZXROYW1lcyhpdCk7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XHJcbiAgaWYod2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScpcmV0dXJuIGdldFdpbmRvd05hbWVzKGl0KTtcclxuICByZXR1cm4gZ2V0TmFtZXMoJC50b09iamVjdChpdCkpO1xyXG59OyIsIi8vIEZhc3QgYXBwbHlcbi8vIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgICBjYXNlIDU6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10sIGFyZ3NbNF0pO1xuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XG59OyIsInZhciBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqO1xuZnVuY3Rpb24gY2xvc2UoaXRlcmF0b3Ipe1xuICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICBpZihyZXQgIT09IHVuZGVmaW5lZClhc3NlcnRPYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbn1cbmZ1bmN0aW9uIGNhbGwoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhc3NlcnRPYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIH0gY2F0Y2goZSl7XG4gICAgY2xvc2UoaXRlcmF0b3IpO1xuICAgIHRocm93IGU7XG4gIH1cbn1cbmNhbGwuY2xvc2UgPSBjbG9zZTtcbm1vZHVsZS5leHBvcnRzID0gY2FsbDsiLCJ2YXIgJGRlZiAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJHJlZGVmICAgICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmJylcbiAgLCAkICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRpdGVyICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBGRl9JVEVSQVRPUiAgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICAgPSAndmFsdWVzJ1xuICAsIEl0ZXJhdG9ycyAgICAgICA9ICRpdGVyLkl0ZXJhdG9ycztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0Upe1xuICAkaXRlci5jcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICBmdW5jdGlvbiBjcmVhdGVNZXRob2Qoa2luZCl7XG4gICAgZnVuY3Rpb24gJCQodGhhdCl7XG4gICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoYXQsIGtpbmQpO1xuICAgIH1cbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiAkJCh0aGlzKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkJCh0aGlzKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiAkJCh0aGlzKTsgfTtcbiAgfVxuICB2YXIgVEFHICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIHByb3RvICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsIF9uYXRpdmUgID0gcHJvdG9bU1lNQk9MX0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgX2RlZmF1bHQgPSBfbmF0aXZlIHx8IGNyZWF0ZU1ldGhvZChERUZBVUxUKVxuICAgICwgbWV0aG9kcywga2V5O1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKF9uYXRpdmUpe1xuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9ICQuZ2V0UHJvdG8oX2RlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xuICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICBjb2Yuc2V0KEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgIC8vIEZGIGZpeFxuICAgIGlmKCQuRlcgJiYgJC5oYXMocHJvdG8sIEZGX0lURVJBVE9SKSkkaXRlci5zZXQoSXRlcmF0b3JQcm90b3R5cGUsICQudGhhdCk7XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCQuRlcgfHwgRk9SQ0UpJGl0ZXIuc2V0KHByb3RvLCBfZGVmYXVsdCk7XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gX2RlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9ICQudGhhdDtcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgICAgICAgID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoS0VZUyksXG4gICAgICB2YWx1ZXM6ICBERUZBVUxUID09IFZBTFVFUyA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKFZBTFVFUyksXG4gICAgICBlbnRyaWVzOiBERUZBVUxUICE9IFZBTFVFUyA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKCdlbnRyaWVzJylcbiAgICB9O1xuICAgIGlmKEZPUkNFKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpJHJlZGVmKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRkZWYoJGRlZi5QICsgJGRlZi5GICogJGl0ZXIuQlVHR1ksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG59OyIsInZhciBTWU1CT0xfSVRFUkFUT1IgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgICAgPSBmYWxzZTtcbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtTWU1CT0xfSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgaWYoIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltTWU1CT0xfSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgc2FmZSA9IHRydWU7IH07XG4gICAgYXJyW1NZTUJPTF9JVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCBjbGFzc29mICAgICAgICAgICA9IGNvZi5jbGFzc29mXG4gICwgYXNzZXJ0ICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCBhc3NlcnRPYmplY3QgICAgICA9IGFzc2VydC5vYmpcbiAgLCBTWU1CT0xfSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEZGX0lURVJBVE9SICAgICAgID0gJ0BAaXRlcmF0b3InXG4gICwgSXRlcmF0b3JzICAgICAgICAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJykoJ2l0ZXJhdG9ycycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5zZXRJdGVyYXRvcihJdGVyYXRvclByb3RvdHlwZSwgJC50aGF0KTtcbmZ1bmN0aW9uIHNldEl0ZXJhdG9yKE8sIHZhbHVlKXtcbiAgJC5oaWRlKE8sIFNZTUJPTF9JVEVSQVRPUiwgdmFsdWUpO1xuICAvLyBBZGQgaXRlcmF0b3IgZm9yIEZGIGl0ZXJhdG9yIHByb3RvY29sXG4gIGlmKEZGX0lURVJBVE9SIGluIFtdKSQuaGlkZShPLCBGRl9JVEVSQVRPUiwgdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICBCVUdHWTogJ2tleXMnIGluIFtdICYmICEoJ25leHQnIGluIFtdLmtleXMoKSksXG4gIEl0ZXJhdG9yczogSXRlcmF0b3JzLFxuICBzdGVwOiBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gICAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG4gIH0sXG4gIGlzOiBmdW5jdGlvbihpdCl7XG4gICAgdmFyIE8gICAgICA9IE9iamVjdChpdClcbiAgICAgICwgU3ltYm9sID0gJC5nLlN5bWJvbDtcbiAgICByZXR1cm4gKFN5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgRkZfSVRFUkFUT1IpIGluIE9cbiAgICAgIHx8IFNZTUJPTF9JVEVSQVRPUiBpbiBPXG4gICAgICB8fCAkLmhhcyhJdGVyYXRvcnMsIGNsYXNzb2YoTykpO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uKGl0KXtcbiAgICB2YXIgU3ltYm9sID0gJC5nLlN5bWJvbFxuICAgICAgLCBnZXRJdGVyO1xuICAgIGlmKGl0ICE9IHVuZGVmaW5lZCl7XG4gICAgICBnZXRJdGVyID0gaXRbU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvciB8fCBGRl9JVEVSQVRPUl1cbiAgICAgICAgfHwgaXRbU1lNQk9MX0lURVJBVE9SXVxuICAgICAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xuICAgIH1cbiAgICBhc3NlcnQoJC5pc0Z1bmN0aW9uKGdldEl0ZXIpLCBpdCwgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gICAgcmV0dXJuIGFzc2VydE9iamVjdChnZXRJdGVyLmNhbGwoaXQpKTtcbiAgfSxcbiAgc2V0OiBzZXRJdGVyYXRvcixcbiAgY3JlYXRlOiBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCwgcHJvdG8pe1xuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQuY3JlYXRlKHByb3RvIHx8IEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogJC5kZXNjKDEsIG5leHQpfSk7XG4gICAgY29mLnNldChDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKVxuICAsIGNvcmUgICA9IHt9XG4gICwgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcbiAgLCBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5XG4gICwgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcbiAgLCBtYXggICA9IE1hdGgubWF4XG4gICwgbWluICAgPSBNYXRoLm1pbjtcbi8vIFRoZSBlbmdpbmUgd29ya3MgZmluZSB3aXRoIGRlc2NyaXB0b3JzPyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5LlxudmFyIERFU0MgPSAhIWZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiAyOyB9fSkuYSA9PSAyO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59KCk7XG52YXIgaGlkZSA9IGNyZWF0ZURlZmluZXIoMSk7XG4vLyA3LjEuNCBUb0ludGVnZXJcbmZ1bmN0aW9uIHRvSW50ZWdlcihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufVxuZnVuY3Rpb24gZGVzYyhiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59XG5mdW5jdGlvbiBzaW1wbGVTZXQob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURlZmluZXIoYml0bWFwKXtcbiAgcmV0dXJuIERFU0MgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICAgIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGRlc2MoYml0bWFwLCB2YWx1ZSkpO1xuICB9IDogc2ltcGxlU2V0O1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChpdCl7XG4gIHJldHVybiBpdCAhPT0gbnVsbCAmJiAodHlwZW9mIGl0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nKTtcbn1cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBhc3NlcnREZWZpbmVkKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufVxuXG52YXIgJCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmZ3Jykoe1xuICBnOiBnbG9iYWwsXG4gIGNvcmU6IGNvcmUsXG4gIGh0bWw6IGdsb2JhbC5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2NvcmUtanMtaXNvYmplY3RcbiAgaXNPYmplY3Q6ICAgaXNPYmplY3QsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIHRoYXQ6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8vIDcuMS40IFRvSW50ZWdlclxuICB0b0ludGVnZXI6IHRvSW50ZWdlcixcbiAgLy8gNy4xLjE1IFRvTGVuZ3RoXG4gIHRvTGVuZ3RoOiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbiAgfSxcbiAgdG9JbmRleDogZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gICAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICAgIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xuICB9LFxuICBoYXM6IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xuICB9LFxuICBjcmVhdGU6ICAgICBPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICBPYmplY3QuZ2V0UHJvdG90eXBlT2YsXG4gIERFU0M6ICAgICAgIERFU0MsXG4gIGRlc2M6ICAgICAgIGRlc2MsXG4gIGdldERlc2M6ICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgIGRlZmluZVByb3BlcnR5LFxuICBzZXREZXNjczogICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgT2JqZWN0LmtleXMsXG4gIGdldE5hbWVzOiAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICBnZXRTeW1ib2xzOiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBhc3NlcnREZWZpbmVkOiBhc3NlcnREZWZpbmVkLFxuICAvLyBEdW1teSwgZml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nIGluIGVzNSBtb2R1bGVcbiAgRVM1T2JqZWN0OiBPYmplY3QsXG4gIHRvT2JqZWN0OiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuICQuRVM1T2JqZWN0KGFzc2VydERlZmluZWQoaXQpKTtcbiAgfSxcbiAgaGlkZTogaGlkZSxcbiAgZGVmOiBjcmVhdGVEZWZpbmVyKDApLFxuICBzZXQ6IGdsb2JhbC5TeW1ib2wgPyBzaW1wbGVTZXQgOiBoaWRlLFxuICBlYWNoOiBbXS5mb3JFYWNoXG59KTtcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5pZih0eXBlb2YgX19lICE9ICd1bmRlZmluZWQnKV9fZSA9IGNvcmU7XG5pZih0eXBlb2YgX19nICE9ICd1bmRlZmluZWQnKV9fZyA9IGdsb2JhbDsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGVsKXtcbiAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gJC5nZXRLZXlzKE8pXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaW5kZXggID0gMFxuICAgICwga2V5O1xuICB3aGlsZShsZW5ndGggPiBpbmRleClpZihPW2tleSA9IGtleXNbaW5kZXgrK11dID09PSBlbClyZXR1cm4ga2V5O1xufTsiLCJ2YXIgJHJlZGVmID0gcmVxdWlyZSgnLi8kLnJlZGVmJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xyXG4gIGZvcih2YXIga2V5IGluIHNyYykkcmVkZWYodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcclxuICByZXR1cm4gdGFyZ2V0O1xyXG59OyIsInZhciAkICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGFzc2VydE9iamVjdCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmo7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG93bktleXMoaXQpe1xuICBhc3NlcnRPYmplY3QoaXQpO1xuICB2YXIga2V5cyAgICAgICA9ICQuZ2V0TmFtZXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xuICByZXR1cm4gZ2V0U3ltYm9scyA/IGtleXMuY29uY2F0KGdldFN5bWJvbHMoaXQpKSA6IGtleXM7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGludm9rZSA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigvKiAuLi5wYXJncyAqLyl7XG4gIHZhciBmbiAgICAgPSBhc3NlcnRGdW5jdGlvbih0aGlzKVxuICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgcGFyZ3MgID0gQXJyYXkobGVuZ3RoKVxuICAgICwgaSAgICAgID0gMFxuICAgICwgXyAgICAgID0gJC5wYXRoLl9cbiAgICAsIGhvbGRlciA9IGZhbHNlO1xuICB3aGlsZShsZW5ndGggPiBpKWlmKChwYXJnc1tpXSA9IGFyZ3VtZW50c1tpKytdKSA9PT0gXylob2xkZXIgPSB0cnVlO1xuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgdmFyIHRoYXQgICAgPSB0aGlzXG4gICAgICAsIF9sZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIGogPSAwLCBrID0gMCwgYXJncztcbiAgICBpZighaG9sZGVyICYmICFfbGVuZ3RoKXJldHVybiBpbnZva2UoZm4sIHBhcmdzLCB0aGF0KTtcbiAgICBhcmdzID0gcGFyZ3Muc2xpY2UoKTtcbiAgICBpZihob2xkZXIpZm9yKDtsZW5ndGggPiBqOyBqKyspaWYoYXJnc1tqXSA9PT0gXylhcmdzW2pdID0gYXJndW1lbnRzW2srK107XG4gICAgd2hpbGUoX2xlbmd0aCA+IGspYXJncy5wdXNoKGFyZ3VtZW50c1trKytdKTtcbiAgICByZXR1cm4gaW52b2tlKGZuLCBhcmdzLCB0aGF0KTtcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQnKS5oaWRlOyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmVnRXhwLCByZXBsYWNlLCBpc1N0YXRpYyl7XG4gIHZhciByZXBsYWNlciA9IHJlcGxhY2UgPT09IE9iamVjdChyZXBsYWNlKSA/IGZ1bmN0aW9uKHBhcnQpe1xuICAgIHJldHVybiByZXBsYWNlW3BhcnRdO1xuICB9IDogcmVwbGFjZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gU3RyaW5nKGlzU3RhdGljID8gaXQgOiB0aGlzKS5yZXBsYWNlKHJlZ0V4cCwgcmVwbGFjZXIpO1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5pcyB8fCBmdW5jdGlvbiBpcyh4LCB5KXtcclxuICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcclxufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBhc3NlcnQgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jyk7XG5mdW5jdGlvbiBjaGVjayhPLCBwcm90byl7XG4gIGFzc2VydC5vYmooTyk7XG4gIGFzc2VydChwcm90byA9PT0gbnVsbCB8fCAkLmlzT2JqZWN0KHByb3RvKSwgcHJvdG8sIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgID8gZnVuY3Rpb24oYnVnZ3ksIHNldCl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi8kLmN0eCcpKEZ1bmN0aW9uLmNhbGwsICQuZ2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgICBzZXQoe30sIFtdKTtcbiAgICAgICAgfSBjYXRjaChlKXsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICAgIGlmKGJ1Z2d5KU8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICAgIHJldHVybiBPO1xuICAgICAgICB9O1xuICAgICAgfSgpXG4gICAgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwidmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xyXG4gICwgc3RvcmUgID0gJC5nW1NIQVJFRF0gfHwgKCQuZ1tTSEFSRURdID0ge30pO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XHJcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XHJcbn07IiwidmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIFNQRUNJRVMgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQyl7XG4gIGlmKCQuREVTQyAmJiAhKFNQRUNJRVMgaW4gQykpJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiAkLnRoYXRcbiAgfSk7XG59OyIsIi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSAkLnRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsXG4gICAgICB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsIi8vIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPXN0cmF3bWFuOnN0cmluZ19wYWRkaW5nXG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCByZXBlYXQgPSByZXF1aXJlKCcuLyQuc3RyaW5nLXJlcGVhdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRoYXQsIG1pbkxlbmd0aCwgZmlsbENoYXIsIGxlZnQpe1xuICAvLyAxLiBMZXQgTyBiZSBDaGVja09iamVjdENvZXJjaWJsZSh0aGlzIHZhbHVlKS5cbiAgLy8gMi4gTGV0IFMgYmUgVG9TdHJpbmcoTykuXG4gIHZhciBTID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGF0KSk7XG4gIC8vIDQuIElmIGludE1pbkxlbmd0aCBpcyB1bmRlZmluZWQsIHJldHVybiBTLlxuICBpZihtaW5MZW5ndGggPT09IHVuZGVmaW5lZClyZXR1cm4gUztcbiAgLy8gNC4gTGV0IGludE1pbkxlbmd0aCBiZSBUb0ludGVnZXIobWluTGVuZ3RoKS5cbiAgdmFyIGludE1pbkxlbmd0aCA9ICQudG9JbnRlZ2VyKG1pbkxlbmd0aCk7XG4gIC8vIDUuIExldCBmaWxsTGVuIGJlIHRoZSBudW1iZXIgb2YgY2hhcmFjdGVycyBpbiBTIG1pbnVzIGludE1pbkxlbmd0aC5cbiAgdmFyIGZpbGxMZW4gPSBpbnRNaW5MZW5ndGggLSBTLmxlbmd0aDtcbiAgLy8gNi4gSWYgZmlsbExlbiA8IDAsIHRoZW4gdGhyb3cgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbi5cbiAgLy8gNy4gSWYgZmlsbExlbiBpcyAr4oieLCB0aGVuIHRocm93IGEgUmFuZ2VFcnJvciBleGNlcHRpb24uXG4gIGlmKGZpbGxMZW4gPCAwIHx8IGZpbGxMZW4gPT09IEluZmluaXR5KXtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQ2Fubm90IHNhdGlzZnkgc3RyaW5nIGxlbmd0aCAnICsgbWluTGVuZ3RoICsgJyBmb3Igc3RyaW5nOiAnICsgUyk7XG4gIH1cbiAgLy8gOC4gTGV0IHNGaWxsU3RyIGJlIHRoZSBzdHJpbmcgcmVwcmVzZW50ZWQgYnkgZmlsbFN0ci5cbiAgLy8gOS4gSWYgc0ZpbGxTdHIgaXMgdW5kZWZpbmVkLCBsZXQgc0ZpbGxTdHIgYmUgYSBzcGFjZSBjaGFyYWN0ZXIuXG4gIHZhciBzRmlsbFN0ciA9IGZpbGxDaGFyID09PSB1bmRlZmluZWQgPyAnICcgOiBTdHJpbmcoZmlsbENoYXIpO1xuICAvLyAxMC4gTGV0IHNGaWxsVmFsIGJlIGEgU3RyaW5nIG1hZGUgb2Ygc0ZpbGxTdHIsIHJlcGVhdGVkIHVudGlsIGZpbGxMZW4gaXMgbWV0LlxuICB2YXIgc0ZpbGxWYWwgPSByZXBlYXQuY2FsbChzRmlsbFN0ciwgTWF0aC5jZWlsKGZpbGxMZW4gLyBzRmlsbFN0ci5sZW5ndGgpKTtcbiAgLy8gdHJ1bmNhdGUgaWYgd2Ugb3ZlcmZsb3dlZFxuICBpZihzRmlsbFZhbC5sZW5ndGggPiBmaWxsTGVuKXNGaWxsVmFsID0gbGVmdFxuICAgID8gc0ZpbGxWYWwuc2xpY2Uoc0ZpbGxWYWwubGVuZ3RoIC0gZmlsbExlbilcbiAgICA6IHNGaWxsVmFsLnNsaWNlKDAsIGZpbGxMZW4pO1xuICAvLyAxMS4gUmV0dXJuIGEgc3RyaW5nIG1hZGUgZnJvbSBzRmlsbFZhbCwgZm9sbG93ZWQgYnkgUy5cbiAgLy8gMTEuIFJldHVybiBhIFN0cmluZyBtYWRlIGZyb20gUywgZm9sbG93ZWQgYnkgc0ZpbGxWYWwuXG4gIHJldHVybiBsZWZ0ID8gc0ZpbGxWYWwuY29uY2F0KFMpIDogUy5jb25jYXQoc0ZpbGxWYWwpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJlcGVhdChjb3VudCl7XG4gIHZhciBzdHIgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxuICAgICwgcmVzID0gJydcbiAgICAsIG4gICA9ICQudG9JbnRlZ2VyKGNvdW50KTtcbiAgaWYobiA8IDAgfHwgbiA9PSBJbmZpbml0eSl0aHJvdyBSYW5nZUVycm9yKFwiQ291bnQgY2FuJ3QgYmUgbmVnYXRpdmVcIik7XG4gIGZvcig7biA+IDA7IChuID4+Pj0gMSkgJiYgKHN0ciArPSBzdHIpKWlmKG4gJiAxKXJlcyArPSBzdHI7XG4gIHJldHVybiByZXM7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNvZiAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIGludm9rZSA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIGNlbCAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSAkLmdcbiAgLCBpc0Z1bmN0aW9uICAgICAgICAgPSAkLmlzRnVuY3Rpb25cbiAgLCBodG1sICAgICAgICAgICAgICAgPSAkLmh0bWxcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xuZnVuY3Rpb24gcnVuKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZigkLmhhcyhxdWV1ZSwgaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59XG5mdW5jdGlvbiBsaXN0bmVyKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighaXNGdW5jdGlvbihzZXRUYXNrKSB8fCAhaXNGdW5jdGlvbihjbGVhclRhc2spKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgYXJncyA9IFtdLCBpID0gMTtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbigpe1xuICAgICAgaW52b2tlKGlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uKGlkKXtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYoY29mKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gTW9kZXJuIGJyb3dzZXJzLCBza2lwIGltcGxlbWVudGF0aW9uIGZvciBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzIG9iamVjdFxuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgaXNGdW5jdGlvbihnbG9iYWwucG9zdE1lc3NhZ2UpICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RuZXIsIGZhbHNlKTtcbiAgLy8gV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoaXNGdW5jdGlvbihNZXNzYWdlQ2hhbm5lbCkpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0bmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZihPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbigpe1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogICBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgc2lkID0gMDtcbmZ1bmN0aW9uIHVpZChrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytzaWQgKyBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNikpO1xufVxudWlkLnNhZmUgPSByZXF1aXJlKCcuLyQnKS5nLlN5bWJvbCB8fCB1aWQ7XG5tb2R1bGUuZXhwb3J0cyA9IHVpZDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJCcpLmdcbiAgLCBzdG9yZSAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJykoJ3drcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgZ2xvYmFsLlN5bWJvbCAmJiBnbG9iYWwuU3ltYm9sW25hbWVdIHx8IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBzYWZlICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJGl0ZXIgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBmb3JPZiAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgRU5UUklFUyA9IHNhZmUoJ2VudHJpZXMnKVxuICAsIEZOICAgICAgPSBzYWZlKCdmbicpXG4gICwgSVRFUiAgICA9IHNhZmUoJ2l0ZXInKVxuICAsIGNhbGwgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJylcbiAgLCBnZXRJdGVyYXRvciAgICA9ICRpdGVyLmdldFxuICAsIHNldEl0ZXJhdG9yICAgID0gJGl0ZXIuc2V0XG4gICwgY3JlYXRlSXRlcmF0b3IgPSAkaXRlci5jcmVhdGU7XG5mdW5jdGlvbiAkZm9yKGl0ZXJhYmxlLCBlbnRyaWVzKXtcbiAgaWYoISh0aGlzIGluc3RhbmNlb2YgJGZvcikpcmV0dXJuIG5ldyAkZm9yKGl0ZXJhYmxlLCBlbnRyaWVzKTtcbiAgdGhpc1tJVEVSXSAgICA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcbiAgdGhpc1tFTlRSSUVTXSA9ICEhZW50cmllcztcbn1cblxuY3JlYXRlSXRlcmF0b3IoJGZvciwgJ1dyYXBwZXInLCBmdW5jdGlvbigpe1xuICByZXR1cm4gdGhpc1tJVEVSXS5uZXh0KCk7XG59KTtcbnZhciAkZm9yUHJvdG8gPSAkZm9yLnByb3RvdHlwZTtcbnNldEl0ZXJhdG9yKCRmb3JQcm90bywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRoaXNbSVRFUl07IC8vIHVud3JhcFxufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNoYWluSXRlcmF0b3IobmV4dCl7XG4gIGZ1bmN0aW9uIEl0ZXJhdG9yKGl0ZXIsIGZuLCB0aGF0KXtcbiAgICB0aGlzW0lURVJdICAgID0gZ2V0SXRlcmF0b3IoaXRlcik7XG4gICAgdGhpc1tFTlRSSUVTXSA9IGl0ZXJbRU5UUklFU107XG4gICAgdGhpc1tGTl0gICAgICA9IGN0eChmbiwgdGhhdCwgaXRlcltFTlRSSUVTXSA/IDIgOiAxKTtcbiAgfVxuICBjcmVhdGVJdGVyYXRvcihJdGVyYXRvciwgJ0NoYWluJywgbmV4dCwgJGZvclByb3RvKTtcbiAgc2V0SXRlcmF0b3IoSXRlcmF0b3IucHJvdG90eXBlLCAkLnRoYXQpOyAvLyBvdmVycmlkZSAkZm9yUHJvdG8gaXRlcmF0b3JcbiAgcmV0dXJuIEl0ZXJhdG9yO1xufVxuXG52YXIgTWFwSXRlciA9IGNyZWF0ZUNoYWluSXRlcmF0b3IoZnVuY3Rpb24oKXtcbiAgdmFyIHN0ZXAgPSB0aGlzW0lURVJdLm5leHQoKTtcbiAgcmV0dXJuIHN0ZXAuZG9uZVxuICAgID8gc3RlcFxuICAgIDogJGl0ZXIuc3RlcCgwLCBjYWxsKHRoaXNbSVRFUl0sIHRoaXNbRk5dLCBzdGVwLnZhbHVlLCB0aGlzW0VOVFJJRVNdKSk7XG59KTtcblxudmFyIEZpbHRlckl0ZXIgPSBjcmVhdGVDaGFpbkl0ZXJhdG9yKGZ1bmN0aW9uKCl7XG4gIGZvcig7Oyl7XG4gICAgdmFyIHN0ZXAgPSB0aGlzW0lURVJdLm5leHQoKTtcbiAgICBpZihzdGVwLmRvbmUgfHwgY2FsbCh0aGlzW0lURVJdLCB0aGlzW0ZOXSwgc3RlcC52YWx1ZSwgdGhpc1tFTlRSSUVTXSkpcmV0dXJuIHN0ZXA7XG4gIH1cbn0pO1xuXG5yZXF1aXJlKCcuLyQubWl4JykoJGZvclByb3RvLCB7XG4gIG9mOiBmdW5jdGlvbihmbiwgdGhhdCl7XG4gICAgZm9yT2YodGhpcywgdGhpc1tFTlRSSUVTXSwgZm4sIHRoYXQpO1xuICB9LFxuICBhcnJheTogZnVuY3Rpb24oZm4sIHRoYXQpe1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3JPZihmbiAhPSB1bmRlZmluZWQgPyB0aGlzLm1hcChmbiwgdGhhdCkgOiB0aGlzLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgZmlsdGVyOiBmdW5jdGlvbihmbiwgdGhhdCl7XG4gICAgcmV0dXJuIG5ldyBGaWx0ZXJJdGVyKHRoaXMsIGZuLCB0aGF0KTtcbiAgfSxcbiAgbWFwOiBmdW5jdGlvbihmbiwgdGhhdCl7XG4gICAgcmV0dXJuIG5ldyBNYXBJdGVyKHRoaXMsIGZuLCB0aGF0KTtcbiAgfVxufSk7XG5cbiRmb3IuaXNJdGVyYWJsZSAgPSAkaXRlci5pcztcbiRmb3IuZ2V0SXRlcmF0b3IgPSBnZXRJdGVyYXRvcjtcblxuJGRlZigkZGVmLkcgKyAkZGVmLkYsIHskZm9yOiAkZm9yfSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGFzc2VydEZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLmZuO1xuJGRlZigkZGVmLlAgKyAkZGVmLkYsICdBcnJheScsIHtcbiAgdHVybjogZnVuY3Rpb24oZm4sIHRhcmdldCAvKiA9IFtdICovKXtcbiAgICBhc3NlcnRGdW5jdGlvbihmbik7XG4gICAgdmFyIG1lbW8gICA9IHRhcmdldCA9PSB1bmRlZmluZWQgPyBbXSA6IE9iamVjdCh0YXJnZXQpXG4gICAgICAsIE8gICAgICA9ICQuRVM1T2JqZWN0KHRoaXMpXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IDA7XG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoZm4obWVtbywgT1tpbmRleF0sIGluZGV4KyssIHRoaXMpID09PSBmYWxzZSlicmVhaztcbiAgICByZXR1cm4gbWVtbztcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCd0dXJuJyk7IiwidmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgY29yZSAgICAgICAgID0gJC5jb3JlXG4gICwgZm9ybWF0UmVnRXhwID0gL1xcYlxcd1xcdz9cXGIvZ1xuICAsIGZsZXhpb1JlZ0V4cCA9IC86KC4qKVxcfCguKikkL1xuICAsIGxvY2FsZXMgICAgICA9IHt9XG4gICwgY3VycmVudCAgICAgID0gJ2VuJ1xuICAsIFNFQ09ORFMgICAgICA9ICdTZWNvbmRzJ1xuICAsIE1JTlVURVMgICAgICA9ICdNaW51dGVzJ1xuICAsIEhPVVJTICAgICAgICA9ICdIb3VycydcbiAgLCBEQVRFICAgICAgICAgPSAnRGF0ZSdcbiAgLCBNT05USCAgICAgICAgPSAnTW9udGgnXG4gICwgWUVBUiAgICAgICAgID0gJ0Z1bGxZZWFyJztcbmZ1bmN0aW9uIGx6KG51bSl7XG4gIHJldHVybiBudW0gPiA5ID8gbnVtIDogJzAnICsgbnVtO1xufVxuZnVuY3Rpb24gY3JlYXRlRm9ybWF0KHByZWZpeCl7XG4gIHJldHVybiBmdW5jdGlvbih0ZW1wbGF0ZSwgbG9jYWxlIC8qID0gY3VycmVudCAqLyl7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAsIGRpY3QgPSBsb2NhbGVzWyQuaGFzKGxvY2FsZXMsIGxvY2FsZSkgPyBsb2NhbGUgOiBjdXJyZW50XTtcbiAgICBmdW5jdGlvbiBnZXQodW5pdCl7XG4gICAgICByZXR1cm4gdGhhdFtwcmVmaXggKyB1bml0XSgpO1xuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nKHRlbXBsYXRlKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24ocGFydCl7XG4gICAgICBzd2l0Y2gocGFydCl7XG4gICAgICAgIGNhc2UgJ3MnICA6IHJldHVybiBnZXQoU0VDT05EUyk7ICAgICAgICAgICAgICAgICAgLy8gU2Vjb25kcyA6IDAtNTlcbiAgICAgICAgY2FzZSAnc3MnIDogcmV0dXJuIGx6KGdldChTRUNPTkRTKSk7ICAgICAgICAgICAgICAvLyBTZWNvbmRzIDogMDAtNTlcbiAgICAgICAgY2FzZSAnbScgIDogcmV0dXJuIGdldChNSU5VVEVTKTsgICAgICAgICAgICAgICAgICAvLyBNaW51dGVzIDogMC01OVxuICAgICAgICBjYXNlICdtbScgOiByZXR1cm4gbHooZ2V0KE1JTlVURVMpKTsgICAgICAgICAgICAgIC8vIE1pbnV0ZXMgOiAwMC01OVxuICAgICAgICBjYXNlICdoJyAgOiByZXR1cm4gZ2V0KEhPVVJTKTsgICAgICAgICAgICAgICAgICAgIC8vIEhvdXJzICAgOiAwLTIzXG4gICAgICAgIGNhc2UgJ2hoJyA6IHJldHVybiBseihnZXQoSE9VUlMpKTsgICAgICAgICAgICAgICAgLy8gSG91cnMgICA6IDAwLTIzXG4gICAgICAgIGNhc2UgJ0QnICA6IHJldHVybiBnZXQoREFURSk7ICAgICAgICAgICAgICAgICAgICAgLy8gRGF0ZSAgICA6IDEtMzFcbiAgICAgICAgY2FzZSAnREQnIDogcmV0dXJuIGx6KGdldChEQVRFKSk7ICAgICAgICAgICAgICAgICAvLyBEYXRlICAgIDogMDEtMzFcbiAgICAgICAgY2FzZSAnVycgIDogcmV0dXJuIGRpY3RbMF1bZ2V0KCdEYXknKV07ICAgICAgICAgICAvLyBEYXkgICAgIDog0J/QvtC90LXQtNC10LvRjNC90LjQulxuICAgICAgICBjYXNlICdOJyAgOiByZXR1cm4gZ2V0KE1PTlRIKSArIDE7ICAgICAgICAgICAgICAgIC8vIE1vbnRoICAgOiAxLTEyXG4gICAgICAgIGNhc2UgJ05OJyA6IHJldHVybiBseihnZXQoTU9OVEgpICsgMSk7ICAgICAgICAgICAgLy8gTW9udGggICA6IDAxLTEyXG4gICAgICAgIGNhc2UgJ00nICA6IHJldHVybiBkaWN0WzJdW2dldChNT05USCldOyAgICAgICAgICAgLy8gTW9udGggICA6INCv0L3QstCw0YDRjFxuICAgICAgICBjYXNlICdNTScgOiByZXR1cm4gZGljdFsxXVtnZXQoTU9OVEgpXTsgICAgICAgICAgIC8vIE1vbnRoICAgOiDQr9C90LLQsNGA0Y9cbiAgICAgICAgY2FzZSAnWScgIDogcmV0dXJuIGdldChZRUFSKTsgICAgICAgICAgICAgICAgICAgICAvLyBZZWFyICAgIDogMjAxNFxuICAgICAgICBjYXNlICdZWScgOiByZXR1cm4gbHooZ2V0KFlFQVIpICUgMTAwKTsgICAgICAgICAgIC8vIFllYXIgICAgOiAxNFxuICAgICAgfSByZXR1cm4gcGFydDtcbiAgICB9KTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGFkZExvY2FsZShsYW5nLCBsb2NhbGUpe1xuICBmdW5jdGlvbiBzcGxpdChpbmRleCl7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICQuZWFjaC5jYWxsKGxvY2FsZS5tb250aHMuc3BsaXQoJywnKSwgZnVuY3Rpb24oaXQpe1xuICAgICAgcmVzdWx0LnB1c2goaXQucmVwbGFjZShmbGV4aW9SZWdFeHAsICckJyArIGluZGV4KSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBsb2NhbGVzW2xhbmddID0gW2xvY2FsZS53ZWVrZGF5cy5zcGxpdCgnLCcpLCBzcGxpdCgxKSwgc3BsaXQoMildO1xuICByZXR1cm4gY29yZTtcbn1cbiRkZWYoJGRlZi5QICsgJGRlZi5GLCBEQVRFLCB7XG4gIGZvcm1hdDogICAgY3JlYXRlRm9ybWF0KCdnZXQnKSxcbiAgZm9ybWF0VVRDOiBjcmVhdGVGb3JtYXQoJ2dldFVUQycpXG59KTtcbmFkZExvY2FsZShjdXJyZW50LCB7XG4gIHdlZWtkYXlzOiAnU3VuZGF5LE1vbmRheSxUdWVzZGF5LFdlZG5lc2RheSxUaHVyc2RheSxGcmlkYXksU2F0dXJkYXknLFxuICBtb250aHM6ICdKYW51YXJ5LEZlYnJ1YXJ5LE1hcmNoLEFwcmlsLE1heSxKdW5lLEp1bHksQXVndXN0LFNlcHRlbWJlcixPY3RvYmVyLE5vdmVtYmVyLERlY2VtYmVyJ1xufSk7XG5hZGRMb2NhbGUoJ3J1Jywge1xuICB3ZWVrZGF5czogJ9CS0L7RgdC60YDQtdGB0LXQvdGM0LUs0J/QvtC90LXQtNC10LvRjNC90LjQuizQktGC0L7RgNC90LjQuizQodGA0LXQtNCwLNCn0LXRgtCy0LXRgNCzLNCf0Y/RgtC90LjRhtCwLNCh0YPQsdCx0L7RgtCwJyxcbiAgbW9udGhzOiAn0K/QvdCy0LDRgDrRj3zRjCzQpNC10LLRgNCw0Ls60Y980Yws0JzQsNGA0YI60LB8LNCQ0L/RgNC10Ls60Y980Yws0JzQsDrRj3zQuSzQmNGO0L060Y980YwsJyArXG4gICAgICAgICAgJ9CY0Y7QuzrRj3zRjCzQkNCy0LPRg9GB0YI60LB8LNCh0LXQvdGC0Y/QsdGAOtGPfNGMLNCe0LrRgtGP0LHRgDrRj3zRjCzQndC+0Y/QsdGAOtGPfNGMLNCU0LXQutCw0LHRgDrRj3zRjCdcbn0pO1xuY29yZS5sb2NhbGUgPSBmdW5jdGlvbihsb2NhbGUpe1xuICByZXR1cm4gJC5oYXMobG9jYWxlcywgbG9jYWxlKSA/IGN1cnJlbnQgPSBsb2NhbGUgOiBjdXJyZW50O1xufTtcbmNvcmUuYWRkTG9jYWxlID0gYWRkTG9jYWxlOyIsInZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgcGFydGlhbCA9IHJlcXVpcmUoJy4vJC5wYXJ0aWFsJyk7XG4vLyBodHRwczovL2VzZGlzY3Vzcy5vcmcvdG9waWMvcHJvbWlzZS1yZXR1cm5pbmctZGVsYXktZnVuY3Rpb25cbiRkZWYoJGRlZi5HICsgJGRlZi5GLCB7XG4gIGRlbGF5OiBmdW5jdGlvbih0aW1lKXtcbiAgICByZXR1cm4gbmV3ICgkLmNvcmUuUHJvbWlzZSB8fCAkLmcuUHJvbWlzZSkoZnVuY3Rpb24ocmVzb2x2ZSl7XG4gICAgICBzZXRUaW1lb3V0KHBhcnRpYWwuY2FsbChyZXNvbHZlLCB0cnVlKSwgdGltZSk7XG4gICAgfSk7XG4gIH1cbn0pOyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGFzc2lnbiAgID0gcmVxdWlyZSgnLi8kLmFzc2lnbicpXG4gICwga2V5T2YgICAgPSByZXF1aXJlKCcuLyQua2V5b2YnKVxuICAsIElURVIgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgJGl0ZXIgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzdGVwICAgICA9ICRpdGVyLnN0ZXBcbiAgLCBnZXRLZXlzICA9ICQuZ2V0S2V5c1xuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdFxuICAsIGhhcyAgICAgID0gJC5oYXM7XG5cbmZ1bmN0aW9uIERpY3QoaXRlcmFibGUpe1xuICB2YXIgZGljdCA9ICQuY3JlYXRlKG51bGwpO1xuICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpe1xuICAgIGlmKCRpdGVyLmlzKGl0ZXJhYmxlKSl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgdHJ1ZSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgICAgIGRpY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGFzc2lnbihkaWN0LCBpdGVyYWJsZSk7XG4gIH1cbiAgcmV0dXJuIGRpY3Q7XG59XG5EaWN0LnByb3RvdHlwZSA9IG51bGw7XG5cbmZ1bmN0aW9uIERpY3RJdGVyYXRvcihpdGVyYXRlZCwga2luZCl7XG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiB0b09iamVjdChpdGVyYXRlZCksIGE6IGdldEtleXMoaXRlcmF0ZWQpLCBpOiAwLCBrOiBraW5kfSk7XG59XG4kaXRlci5jcmVhdGUoRGljdEl0ZXJhdG9yLCAnRGljdCcsIGZ1bmN0aW9uKCl7XG4gIHZhciBpdGVyID0gdGhpc1tJVEVSXVxuICAgICwgTyAgICA9IGl0ZXIub1xuICAgICwga2V5cyA9IGl0ZXIuYVxuICAgICwga2luZCA9IGl0ZXIua1xuICAgICwga2V5O1xuICBkbyB7XG4gICAgaWYoaXRlci5pID49IGtleXMubGVuZ3RoKXtcbiAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgIH1cbiAgfSB3aGlsZSghaGFzKE8sIGtleSA9IGtleXNbaXRlci5pKytdKSk7XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwga2V5KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2tleV0pO1xuICByZXR1cm4gc3RlcCgwLCBba2V5LCBPW2tleV1dKTtcbn0pO1xuZnVuY3Rpb24gY3JlYXRlRGljdEl0ZXIoa2luZCl7XG4gIHJldHVybiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIG5ldyBEaWN0SXRlcmF0b3IoaXQsIGtpbmQpO1xuICB9O1xufVxuZnVuY3Rpb24gZ2VuZXJpYyhBLCBCKXtcbiAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cbiAgcmV0dXJuIHR5cGVvZiBBID09ICdmdW5jdGlvbicgPyBBIDogQjtcbn1cblxuLy8gMCAtPiBEaWN0LmZvckVhY2hcbi8vIDEgLT4gRGljdC5tYXBcbi8vIDIgLT4gRGljdC5maWx0ZXJcbi8vIDMgLT4gRGljdC5zb21lXG4vLyA0IC0+IERpY3QuZXZlcnlcbi8vIDUgLT4gRGljdC5maW5kXG4vLyA2IC0+IERpY3QuZmluZEtleVxuLy8gNyAtPiBEaWN0Lm1hcFBhaXJzXG5mdW5jdGlvbiBjcmVhdGVEaWN0TWV0aG9kKFRZUEUpe1xuICB2YXIgSVNfTUFQICAgPSBUWVBFID09IDFcbiAgICAsIElTX0VWRVJZID0gVFlQRSA9PSA0O1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBjYWxsYmFja2ZuLCB0aGF0IC8qID0gdW5kZWZpbmVkICovKXtcbiAgICB2YXIgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXG4gICAgICAsIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcbiAgICAgICwgcmVzdWx0ID0gSVNfTUFQIHx8IFRZUEUgPT0gNyB8fCBUWVBFID09IDIgPyBuZXcgKGdlbmVyaWModGhpcywgRGljdCkpIDogdW5kZWZpbmVkXG4gICAgICAsIGtleSwgdmFsLCByZXM7XG4gICAgZm9yKGtleSBpbiBPKWlmKGhhcyhPLCBrZXkpKXtcbiAgICAgIHZhbCA9IE9ba2V5XTtcbiAgICAgIHJlcyA9IGYodmFsLCBrZXksIG9iamVjdCk7XG4gICAgICBpZihUWVBFKXtcbiAgICAgICAgaWYoSVNfTUFQKXJlc3VsdFtrZXldID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHRba2V5XSA9IHZhbDsgYnJlYWs7ICAgICAvLyBmaWx0ZXJcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBrZXk7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRLZXlcbiAgICAgICAgICBjYXNlIDc6IHJlc3VsdFtyZXNbMF1dID0gcmVzWzFdOyAgICAgIC8vIG1hcFBhaXJzXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gVFlQRSA9PSAzIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59XG5cbi8vIHRydWUgIC0+IERpY3QudHVyblxuLy8gZmFsc2UgLT4gRGljdC5yZWR1Y2VcbmZ1bmN0aW9uIGNyZWF0ZURpY3RSZWR1Y2UoSVNfVFVSTil7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIG1hcGZuLCBpbml0KXtcbiAgICBhc3NlcnQuZm4obWFwZm4pO1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXG4gICAgICAsIGtleXMgICA9IGdldEtleXMoTylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaSAgICAgID0gMFxuICAgICAgLCBtZW1vLCBrZXksIHJlc3VsdDtcbiAgICBpZihJU19UVVJOKXtcbiAgICAgIG1lbW8gPSBpbml0ID09IHVuZGVmaW5lZCA/IG5ldyAoZ2VuZXJpYyh0aGlzLCBEaWN0KSkgOiBPYmplY3QoaW5pdCk7XG4gICAgfSBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPCAzKXtcbiAgICAgIGFzc2VydChsZW5ndGgsICdSZWR1Y2Ugb2YgZW1wdHkgb2JqZWN0IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgbWVtbyA9IE9ba2V5c1tpKytdXTtcbiAgICB9IGVsc2UgbWVtbyA9IE9iamVjdChpbml0KTtcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBrZXlzW2krK10pKXtcbiAgICAgIHJlc3VsdCA9IG1hcGZuKG1lbW8sIE9ba2V5XSwga2V5LCBvYmplY3QpO1xuICAgICAgaWYoSVNfVFVSTil7XG4gICAgICAgIGlmKHJlc3VsdCA9PT0gZmFsc2UpYnJlYWs7XG4gICAgICB9IGVsc2UgbWVtbyA9IHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59XG52YXIgZmluZEtleSA9IGNyZWF0ZURpY3RNZXRob2QoNik7XG5cbiRkZWYoJGRlZi5HICsgJGRlZi5GLCB7RGljdDogRGljdH0pO1xuXG4kZGVmKCRkZWYuUywgJ0RpY3QnLCB7XG4gIGtleXM6ICAgICBjcmVhdGVEaWN0SXRlcigna2V5cycpLFxuICB2YWx1ZXM6ICAgY3JlYXRlRGljdEl0ZXIoJ3ZhbHVlcycpLFxuICBlbnRyaWVzOiAgY3JlYXRlRGljdEl0ZXIoJ2VudHJpZXMnKSxcbiAgZm9yRWFjaDogIGNyZWF0ZURpY3RNZXRob2QoMCksXG4gIG1hcDogICAgICBjcmVhdGVEaWN0TWV0aG9kKDEpLFxuICBmaWx0ZXI6ICAgY3JlYXRlRGljdE1ldGhvZCgyKSxcbiAgc29tZTogICAgIGNyZWF0ZURpY3RNZXRob2QoMyksXG4gIGV2ZXJ5OiAgICBjcmVhdGVEaWN0TWV0aG9kKDQpLFxuICBmaW5kOiAgICAgY3JlYXRlRGljdE1ldGhvZCg1KSxcbiAgZmluZEtleTogIGZpbmRLZXksXG4gIG1hcFBhaXJzOiBjcmVhdGVEaWN0TWV0aG9kKDcpLFxuICByZWR1Y2U6ICAgY3JlYXRlRGljdFJlZHVjZShmYWxzZSksXG4gIHR1cm46ICAgICBjcmVhdGVEaWN0UmVkdWNlKHRydWUpLFxuICBrZXlPZjogICAga2V5T2YsXG4gIGluY2x1ZGVzOiBmdW5jdGlvbihvYmplY3QsIGVsKXtcbiAgICByZXR1cm4gKGVsID09IGVsID8ga2V5T2Yob2JqZWN0LCBlbCkgOiBmaW5kS2V5KG9iamVjdCwgZnVuY3Rpb24oaXQpe1xuICAgICAgcmV0dXJuIGl0ICE9IGl0O1xuICAgIH0pKSAhPT0gdW5kZWZpbmVkO1xuICB9LFxuICAvLyBIYXMgLyBnZXQgLyBzZXQgb3duIHByb3BlcnR5XG4gIGhhczogaGFzLFxuICBnZXQ6IGZ1bmN0aW9uKG9iamVjdCwga2V5KXtcbiAgICBpZihoYXMob2JqZWN0LCBrZXkpKXJldHVybiBvYmplY3Rba2V5XTtcbiAgfSxcbiAgc2V0OiAkLmRlZixcbiAgaXNEaWN0OiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuICQuaXNPYmplY3QoaXQpICYmICQuZ2V0UHJvdG8oaXQpID09PSBEaWN0LnByb3RvdHlwZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5cbi8vIFBsYWNlaG9sZGVyXG4kLmNvcmUuXyA9ICQucGF0aC5fID0gJC5wYXRoLl8gfHwge307XG5cbiRkZWYoJGRlZi5QICsgJGRlZi5GLCAnRnVuY3Rpb24nLCB7XG4gIHBhcnQ6IHJlcXVpcmUoJy4vJC5wYXJ0aWFsJylcbn0pOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLkcgKyAkZGVmLkYsIHtnbG9iYWw6IHJlcXVpcmUoJy4vJCcpLmd9KTsiLCJ2YXIgY29yZSAgPSByZXF1aXJlKCcuLyQnKS5jb3JlXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpO1xuY29yZS5pc0l0ZXJhYmxlICA9ICRpdGVyLmlzO1xuY29yZS5nZXRJdGVyYXRvciA9ICRpdGVyLmdldDsiLCJ2YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGxvZyAgPSB7fVxuICAsIGVuYWJsZWQgPSB0cnVlO1xuLy8gTWV0aG9kcyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9EZXZlbG9wZXJUb29sc1dHL2NvbnNvbGUtb2JqZWN0L2Jsb2IvbWFzdGVyL2FwaS5tZFxuJC5lYWNoLmNhbGwoKCdhc3NlcnQsY2xlYXIsY291bnQsZGVidWcsZGlyLGRpcnhtbCxlcnJvcixleGNlcHRpb24sJyArXG4gICAgJ2dyb3VwLGdyb3VwQ29sbGFwc2VkLGdyb3VwRW5kLGluZm8saXNJbmRlcGVuZGVudGx5Q29tcG9zZWQsbG9nLCcgK1xuICAgICdtYXJrVGltZWxpbmUscHJvZmlsZSxwcm9maWxlRW5kLHRhYmxlLHRpbWUsdGltZUVuZCx0aW1lbGluZSwnICtcbiAgICAndGltZWxpbmVFbmQsdGltZVN0YW1wLHRyYWNlLHdhcm4nKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihrZXkpe1xuICBsb2dba2V5XSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYoZW5hYmxlZCAmJiAkLmcuY29uc29sZSAmJiAkLmlzRnVuY3Rpb24oY29uc29sZVtrZXldKSl7XG4gICAgICByZXR1cm4gRnVuY3Rpb24uYXBwbHkuY2FsbChjb25zb2xlW2tleV0sIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufSk7XG4kZGVmKCRkZWYuRyArICRkZWYuRiwge2xvZzogcmVxdWlyZSgnLi8kLmFzc2lnbicpKGxvZy5sb2csIGxvZywge1xuICBlbmFibGU6IGZ1bmN0aW9uKCl7XG4gICAgZW5hYmxlZCA9IHRydWU7XG4gIH0sXG4gIGRpc2FibGU6IGZ1bmN0aW9uKCl7XG4gICAgZW5hYmxlZCA9IGZhbHNlO1xuICB9XG59KX0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBJVEVSID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKTtcblxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoTnVtYmVyLCAnTnVtYmVyJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICAkLnNldCh0aGlzLCBJVEVSLCB7bDogJC50b0xlbmd0aChpdGVyYXRlZCksIGk6IDB9KTtcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBpdGVyID0gdGhpc1tJVEVSXVxuICAgICwgaSAgICA9IGl0ZXIuaSsrXG4gICAgLCBkb25lID0gaSA+PSBpdGVyLmw7XG4gIHJldHVybiB7ZG9uZTogZG9uZSwgdmFsdWU6IGRvbmUgPyB1bmRlZmluZWQgOiBpfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgaW52b2tlICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIG1ldGhvZHMgPSB7fTtcblxubWV0aG9kcy5yYW5kb20gPSBmdW5jdGlvbihsaW0gLyogPSAwICovKXtcbiAgdmFyIGEgPSArdGhpc1xuICAgICwgYiA9IGxpbSA9PSB1bmRlZmluZWQgPyAwIDogK2xpbVxuICAgICwgbSA9IE1hdGgubWluKGEsIGIpO1xuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChNYXRoLm1heChhLCBiKSAtIG0pICsgbTtcbn07XG5cbmlmKCQuRlcpJC5lYWNoLmNhbGwoKFxuICAgIC8vIEVTMzpcbiAgICAncm91bmQsZmxvb3IsY2VpbCxhYnMsc2luLGFzaW4sY29zLGFjb3MsdGFuLGF0YW4sZXhwLHNxcnQsbWF4LG1pbixwb3csYXRhbjIsJyArXG4gICAgLy8gRVM2OlxuICAgICdhY29zaCxhc2luaCxhdGFuaCxjYnJ0LGNsejMyLGNvc2gsZXhwbTEsaHlwb3QsaW11bCxsb2cxcCxsb2cxMCxsb2cyLHNpZ24sc2luaCx0YW5oLHRydW5jJ1xuICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XG4gICAgdmFyIGZuID0gTWF0aFtrZXldO1xuICAgIGlmKGZuKW1ldGhvZHNba2V5XSA9IGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgICAgLy8gaWU5LSBkb250IHN1cHBvcnQgc3RyaWN0IG1vZGUgJiBjb252ZXJ0IGB0aGlzYCB0byBvYmplY3QgLT4gY29udmVydCBpdCB0byBudW1iZXJcbiAgICAgIHZhciBhcmdzID0gWyt0aGlzXVxuICAgICAgICAsIGkgICAgPSAwO1xuICAgICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MpO1xuICAgIH07XG4gIH1cbik7XG5cbiRkZWYoJGRlZi5QICsgJGRlZi5GLCAnTnVtYmVyJywgbWV0aG9kcyk7IiwidmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBvd25LZXlzID0gcmVxdWlyZSgnLi8kLm93bi1rZXlzJyk7XG5mdW5jdGlvbiBkZWZpbmUodGFyZ2V0LCBtaXhpbil7XG4gIHZhciBrZXlzICAgPSBvd25LZXlzKCQudG9PYmplY3QobWl4aW4pKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGkpJC5zZXREZXNjKHRhcmdldCwga2V5ID0ga2V5c1tpKytdLCAkLmdldERlc2MobWl4aW4sIGtleSkpO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuJGRlZigkZGVmLlMgKyAkZGVmLkYsICdPYmplY3QnLCB7XG4gIGlzT2JqZWN0OiAkLmlzT2JqZWN0LFxuICBjbGFzc29mOiByZXF1aXJlKCcuLyQuY29mJykuY2xhc3NvZixcbiAgZGVmaW5lOiBkZWZpbmUsXG4gIG1ha2U6IGZ1bmN0aW9uKHByb3RvLCBtaXhpbil7XG4gICAgcmV0dXJuIGRlZmluZSgkLmNyZWF0ZShwcm90byksIG1peGluKTtcbiAgfVxufSk7IiwidmFyICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgcmVwbGFjZXIgPSByZXF1aXJlKCcuLyQucmVwbGFjZXInKTtcbnZhciBlc2NhcGVIVE1MRGljdCA9IHtcbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0OycsXG4gICdcIic6ICcmcXVvdDsnLFxuICBcIidcIjogJyZhcG9zOydcbn0sIHVuZXNjYXBlSFRNTERpY3QgPSB7fSwga2V5O1xuZm9yKGtleSBpbiBlc2NhcGVIVE1MRGljdCl1bmVzY2FwZUhUTUxEaWN0W2VzY2FwZUhUTUxEaWN0W2tleV1dID0ga2V5O1xuJGRlZigkZGVmLlAgKyAkZGVmLkYsICdTdHJpbmcnLCB7XG4gIGVzY2FwZUhUTUw6ICAgcmVwbGFjZXIoL1smPD5cIiddL2csIGVzY2FwZUhUTUxEaWN0KSxcbiAgdW5lc2NhcGVIVE1MOiByZXBsYWNlcigvJig/OmFtcHxsdHxndHxxdW90fGFwb3MpOy9nLCB1bmVzY2FwZUhUTUxEaWN0KVxufSk7IiwidmFyICQgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNlbCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZG9tLWNyZWF0ZScpXG4gICwgY29mICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRkZWYgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBpbnZva2UgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgYXJyYXlNZXRob2QgICAgICA9IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJylcbiAgLCBJRV9QUk9UTyAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ19fcHJvdG9fXycpXG4gICwgYXNzZXJ0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGFzc2VydE9iamVjdCAgICAgPSBhc3NlcnQub2JqXG4gICwgT2JqZWN0UHJvdG8gICAgICA9IE9iamVjdC5wcm90b3R5cGVcbiAgLCBodG1sICAgICAgICAgICAgID0gJC5odG1sXG4gICwgQSAgICAgICAgICAgICAgICA9IFtdXG4gICwgX3NsaWNlICAgICAgICAgICA9IEEuc2xpY2VcbiAgLCBfam9pbiAgICAgICAgICAgID0gQS5qb2luXG4gICwgY2xhc3NvZiAgICAgICAgICA9IGNvZi5jbGFzc29mXG4gICwgaGFzICAgICAgICAgICAgICA9ICQuaGFzXG4gICwgZGVmaW5lUHJvcGVydHkgICA9ICQuc2V0RGVzY1xuICAsIGdldE93bkRlc2NyaXB0b3IgPSAkLmdldERlc2NcbiAgLCBkZWZpbmVQcm9wZXJ0aWVzID0gJC5zZXREZXNjc1xuICAsIGlzRnVuY3Rpb24gICAgICAgPSAkLmlzRnVuY3Rpb25cbiAgLCBpc09iamVjdCAgICAgICAgID0gJC5pc09iamVjdFxuICAsIHRvT2JqZWN0ICAgICAgICAgPSAkLnRvT2JqZWN0XG4gICwgdG9MZW5ndGggICAgICAgICA9ICQudG9MZW5ndGhcbiAgLCB0b0luZGV4ICAgICAgICAgID0gJC50b0luZGV4XG4gICwgSUU4X0RPTV9ERUZJTkUgICA9IGZhbHNlXG4gICwgJGluZGV4T2YgICAgICAgICA9IHJlcXVpcmUoJy4vJC5hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxuICAsICRmb3JFYWNoICAgICAgICAgPSBhcnJheU1ldGhvZCgwKVxuICAsICRtYXAgICAgICAgICAgICAgPSBhcnJheU1ldGhvZCgxKVxuICAsICRmaWx0ZXIgICAgICAgICAgPSBhcnJheU1ldGhvZCgyKVxuICAsICRzb21lICAgICAgICAgICAgPSBhcnJheU1ldGhvZCgzKVxuICAsICRldmVyeSAgICAgICAgICAgPSBhcnJheU1ldGhvZCg0KTtcblxuaWYoISQuREVTQyl7XG4gIHRyeSB7XG4gICAgSUU4X0RPTV9ERUZJTkUgPSBkZWZpbmVQcm9wZXJ0eShjZWwoJ2RpdicpLCAneCcsXG4gICAgICB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gODsgfX1cbiAgICApLnggPT0gODtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICAkLnNldERlc2MgPSBmdW5jdGlvbihPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xuICAgIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpYXNzZXJ0T2JqZWN0KE8pW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgICByZXR1cm4gTztcbiAgfTtcbiAgJC5nZXREZXNjID0gZnVuY3Rpb24oTywgUCl7XG4gICAgaWYoSUU4X0RPTV9ERUZJTkUpdHJ5IHtcbiAgICAgIHJldHVybiBnZXRPd25EZXNjcmlwdG9yKE8sIFApO1xuICAgIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgICBpZihoYXMoTywgUCkpcmV0dXJuICQuZGVzYyghT2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChPLCBQKSwgT1tQXSk7XG4gIH07XG4gICQuc2V0RGVzY3MgPSBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oTywgUHJvcGVydGllcyl7XG4gICAgYXNzZXJ0T2JqZWN0KE8pO1xuICAgIHZhciBrZXlzICAgPSAkLmdldEtleXMoUHJvcGVydGllcylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaSA9IDBcbiAgICAgICwgUDtcbiAgICB3aGlsZShsZW5ndGggPiBpKSQuc2V0RGVzYyhPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgICByZXR1cm4gTztcbiAgfTtcbn1cbiRkZWYoJGRlZi5TICsgJGRlZi5GICogISQuREVTQywgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjYgLyAxNS4yLjMuMyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJC5nZXREZXNjLFxuICAvLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJC5zZXREZXNjLFxuICAvLyAxOS4xLjIuMyAvIDE1LjIuMy43IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6IGRlZmluZVByb3BlcnRpZXNcbn0pO1xuXG4gIC8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbnZhciBrZXlzMSA9ICgnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSwnICtcbiAgICAgICAgICAgICd0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJykuc3BsaXQoJywnKVxuICAvLyBBZGRpdGlvbmFsIGtleXMgZm9yIGdldE93blByb3BlcnR5TmFtZXNcbiAgLCBrZXlzMiA9IGtleXMxLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpXG4gICwga2V5c0xlbjEgPSBrZXlzMS5sZW5ndGg7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSBjZWwoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBrZXlzTGVuMVxuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGh0bWwuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUoJzxzY3JpcHQ+ZG9jdW1lbnQuRj1PYmplY3Q8L3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3QucHJvdG90eXBlW2tleXMxW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5mdW5jdGlvbiBjcmVhdGVHZXRLZXlzKG5hbWVzLCBsZW5ndGgpe1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxuICAgICAgLCBpICAgICAgPSAwXG4gICAgICAsIHJlc3VsdCA9IFtdXG4gICAgICAsIGtleTtcbiAgICBmb3Ioa2V5IGluIE8paWYoa2V5ICE9IElFX1BST1RPKWhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICAgIHdoaWxlKGxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICAgIH4kaW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbmZ1bmN0aW9uIEVtcHR5KCl7fVxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG4gIGdldFByb3RvdHlwZU9mOiAkLmdldFByb3RvID0gJC5nZXRQcm90byB8fCBmdW5jdGlvbihPKXtcbiAgICBPID0gT2JqZWN0KGFzc2VydC5kZWYoTykpO1xuICAgIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICAgIGlmKGlzRnVuY3Rpb24oTy5jb25zdHJ1Y3RvcikgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICAgIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG4gIH0sXG4gIC8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJC5nZXROYW1lcyA9ICQuZ2V0TmFtZXMgfHwgY3JlYXRlR2V0S2V5cyhrZXlzMiwga2V5czIubGVuZ3RoLCB0cnVlKSxcbiAgLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJC5jcmVhdGUgPSAkLmNyZWF0ZSB8fCBmdW5jdGlvbihPLCAvKj8qL1Byb3BlcnRpZXMpe1xuICAgIHZhciByZXN1bHQ7XG4gICAgaWYoTyAhPT0gbnVsbCl7XG4gICAgICBFbXB0eS5wcm90b3R5cGUgPSBhc3NlcnRPYmplY3QoTyk7XG4gICAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XG4gICAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHNoaW1cbiAgICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICAgIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gICAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbiAgfSxcbiAgLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG4gIGtleXM6ICQuZ2V0S2V5cyA9ICQuZ2V0S2V5cyB8fCBjcmVhdGVHZXRLZXlzKGtleXMxLCBrZXlzTGVuMSwgZmFsc2UpLFxuICAvLyAxOS4xLjIuMTcgLyAxNS4yLjMuOCBPYmplY3Quc2VhbChPKVxuICBzZWFsOiBmdW5jdGlvbiBzZWFsKGl0KXtcbiAgICByZXR1cm4gaXQ7IC8vIDwtIGNhcFxuICB9LFxuICAvLyAxOS4xLjIuNSAvIDE1LjIuMy45IE9iamVjdC5mcmVlemUoTylcbiAgZnJlZXplOiBmdW5jdGlvbiBmcmVlemUoaXQpe1xuICAgIHJldHVybiBpdDsgLy8gPC0gY2FwXG4gIH0sXG4gIC8vIDE5LjEuMi4xNSAvIDE1LjIuMy4xMCBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoTylcbiAgcHJldmVudEV4dGVuc2lvbnM6IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKGl0KXtcbiAgICByZXR1cm4gaXQ7IC8vIDwtIGNhcFxuICB9LFxuICAvLyAxOS4xLjIuMTMgLyAxNS4yLjMuMTEgT2JqZWN0LmlzU2VhbGVkKE8pXG4gIGlzU2VhbGVkOiBmdW5jdGlvbiBpc1NlYWxlZChpdCl7XG4gICAgcmV0dXJuICFpc09iamVjdChpdCk7IC8vIDwtIGNhcFxuICB9LFxuICAvLyAxOS4xLjIuMTIgLyAxNS4yLjMuMTIgT2JqZWN0LmlzRnJvemVuKE8pXG4gIGlzRnJvemVuOiBmdW5jdGlvbiBpc0Zyb3plbihpdCl7XG4gICAgcmV0dXJuICFpc09iamVjdChpdCk7IC8vIDwtIGNhcFxuICB9LFxuICAvLyAxOS4xLjIuMTEgLyAxNS4yLjMuMTMgT2JqZWN0LmlzRXh0ZW5zaWJsZShPKVxuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZShpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KTsgLy8gPC0gY2FwXG4gIH1cbn0pO1xuXG4vLyAxOS4yLjMuMiAvIDE1LjMuNC41IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKHRoaXNBcmcsIGFyZ3MuLi4pXG4kZGVmKCRkZWYuUCwgJ0Z1bmN0aW9uJywge1xuICBiaW5kOiBmdW5jdGlvbih0aGF0IC8qLCBhcmdzLi4uICovKXtcbiAgICB2YXIgZm4gICAgICAgPSBhc3NlcnQuZm4odGhpcylcbiAgICAgICwgcGFydEFyZ3MgPSBfc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGZ1bmN0aW9uIGJvdW5kKC8qIGFyZ3MuLi4gKi8pe1xuICAgICAgdmFyIGFyZ3MgICA9IHBhcnRBcmdzLmNvbmNhdChfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAsIGNvbnN0ciA9IHRoaXMgaW5zdGFuY2VvZiBib3VuZFxuICAgICAgICAsIGN0eCAgICA9IGNvbnN0ciA/ICQuY3JlYXRlKGZuLnByb3RvdHlwZSkgOiB0aGF0XG4gICAgICAgICwgcmVzdWx0ID0gaW52b2tlKGZuLCBhcmdzLCBjdHgpO1xuICAgICAgcmV0dXJuIGNvbnN0ciA/IGN0eCA6IHJlc3VsdDtcbiAgICB9XG4gICAgaWYoZm4ucHJvdG90eXBlKWJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH1cbn0pO1xuXG4vLyBGaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgYW5kIERPTSBvYmplY3RzXG5pZighKDAgaW4gT2JqZWN0KCd6JykgJiYgJ3onWzBdID09ICd6Jykpe1xuICAkLkVTNU9iamVjdCA9IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG4gIH07XG59XG5cbnZhciBidWdneVNsaWNlID0gdHJ1ZTtcbnRyeSB7XG4gIGlmKGh0bWwpX3NsaWNlLmNhbGwoaHRtbCk7XG4gIGJ1Z2d5U2xpY2UgPSBmYWxzZTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBidWdneVNsaWNlLCAnQXJyYXknLCB7XG4gIHNsaWNlOiBmdW5jdGlvbiBzbGljZShiZWdpbiwgZW5kKXtcbiAgICB2YXIgbGVuICAgPSB0b0xlbmd0aCh0aGlzLmxlbmd0aClcbiAgICAgICwga2xhc3MgPSBjb2YodGhpcyk7XG4gICAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiBlbmQ7XG4gICAgaWYoa2xhc3MgPT0gJ0FycmF5JylyZXR1cm4gX3NsaWNlLmNhbGwodGhpcywgYmVnaW4sIGVuZCk7XG4gICAgdmFyIHN0YXJ0ICA9IHRvSW5kZXgoYmVnaW4sIGxlbilcbiAgICAgICwgdXBUbyAgID0gdG9JbmRleChlbmQsIGxlbilcbiAgICAgICwgc2l6ZSAgID0gdG9MZW5ndGgodXBUbyAtIHN0YXJ0KVxuICAgICAgLCBjbG9uZWQgPSBBcnJheShzaXplKVxuICAgICAgLCBpICAgICAgPSAwO1xuICAgIGZvcig7IGkgPCBzaXplOyBpKyspY2xvbmVkW2ldID0ga2xhc3MgPT0gJ1N0cmluZydcbiAgICAgID8gdGhpcy5jaGFyQXQoc3RhcnQgKyBpKVxuICAgICAgOiB0aGlzW3N0YXJ0ICsgaV07XG4gICAgcmV0dXJuIGNsb25lZDtcbiAgfVxufSk7XG5cbiRkZWYoJGRlZi5QICsgJGRlZi5GICogKCQuRVM1T2JqZWN0ICE9IE9iamVjdCksICdBcnJheScsIHtcbiAgam9pbjogZnVuY3Rpb24gam9pbigpe1xuICAgIHJldHVybiBfam9pbi5hcHBseSgkLkVTNU9iamVjdCh0aGlzKSwgYXJndW1lbnRzKTtcbiAgfVxufSk7XG5cbi8vIDIyLjEuMi4yIC8gMTUuNC4zLjIgQXJyYXkuaXNBcnJheShhcmcpXG4kZGVmKCRkZWYuUywgJ0FycmF5Jywge1xuICBpc0FycmF5OiBmdW5jdGlvbihhcmcpe1xuICAgIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xuICB9XG59KTtcbmZ1bmN0aW9uIGNyZWF0ZUFycmF5UmVkdWNlKGlzUmlnaHQpe1xuICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2tmbiwgbWVtbyl7XG4gICAgYXNzZXJ0LmZuKGNhbGxiYWNrZm4pO1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdCh0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gaXNSaWdodCA/IGxlbmd0aCAtIDEgOiAwXG4gICAgICAsIGkgICAgICA9IGlzUmlnaHQgPyAtMSA6IDE7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDIpZm9yKDs7KXtcbiAgICAgIGlmKGluZGV4IGluIE8pe1xuICAgICAgICBtZW1vID0gT1tpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXggKz0gaTtcbiAgICAgIGFzc2VydChpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4LCAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgIH1cbiAgICBmb3IoO2lzUmlnaHQgPyBpbmRleCA+PSAwIDogbGVuZ3RoID4gaW5kZXg7IGluZGV4ICs9IGkpaWYoaW5kZXggaW4gTyl7XG4gICAgICBtZW1vID0gY2FsbGJhY2tmbihtZW1vLCBPW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcbn1cbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xMCAvIDE1LjQuNC4xOCBBcnJheS5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBmb3JFYWNoOiAkLmVhY2ggPSAkLmVhY2ggfHwgZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZm9yRWFjaCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuMTUgLyAxNS40LjQuMTkgQXJyYXkucHJvdG90eXBlLm1hcChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBtYXA6IGZ1bmN0aW9uIG1hcChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkbWFwKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy43IC8gMTUuNC40LjIwIEFycmF5LnByb3RvdHlwZS5maWx0ZXIoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbHRlcih0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuMjMgLyAxNS40LjQuMTcgQXJyYXkucHJvdG90eXBlLnNvbWUoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgc29tZTogZnVuY3Rpb24gc29tZShjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkc29tZSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuNSAvIDE1LjQuNC4xNiBBcnJheS5wcm90b3R5cGUuZXZlcnkoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgZXZlcnk6IGZ1bmN0aW9uIGV2ZXJ5KGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRldmVyeSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9LFxuICAvLyAyMi4xLjMuMTggLyAxNS40LjQuMjEgQXJyYXkucHJvdG90eXBlLnJlZHVjZShjYWxsYmFja2ZuIFssIGluaXRpYWxWYWx1ZV0pXG4gIHJlZHVjZTogY3JlYXRlQXJyYXlSZWR1Y2UoZmFsc2UpLFxuICAvLyAyMi4xLjMuMTkgLyAxNS40LjQuMjIgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcbiAgcmVkdWNlUmlnaHQ6IGNyZWF0ZUFycmF5UmVkdWNlKHRydWUpLFxuICAvLyAyMi4xLjMuMTEgLyAxNS40LjQuMTQgQXJyYXkucHJvdG90eXBlLmluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKGVsIC8qLCBmcm9tSW5kZXggPSAwICovKXtcbiAgICByZXR1cm4gJGluZGV4T2YodGhpcywgZWwsIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy4xNCAvIDE1LjQuNC4xNSBBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBsYXN0SW5kZXhPZjogZnVuY3Rpb24oZWwsIGZyb21JbmRleCAvKiA9IEBbKi0xXSAqLyl7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSBsZW5ndGggLSAxO1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKWluZGV4ID0gTWF0aC5taW4oaW5kZXgsICQudG9JbnRlZ2VyKGZyb21JbmRleCkpO1xuICAgIGlmKGluZGV4IDwgMClpbmRleCA9IHRvTGVuZ3RoKGxlbmd0aCArIGluZGV4KTtcbiAgICBmb3IoO2luZGV4ID49IDA7IGluZGV4LS0paWYoaW5kZXggaW4gTylpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIGluZGV4O1xuICAgIHJldHVybiAtMTtcbiAgfVxufSk7XG5cbi8vIDIxLjEuMy4yNSAvIDE1LjUuNC4yMCBTdHJpbmcucHJvdG90eXBlLnRyaW0oKVxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7dHJpbTogcmVxdWlyZSgnLi8kLnJlcGxhY2VyJykoL15cXHMqKFtcXHNcXFNdKlxcUyk/XFxzKiQvLCAnJDEnKX0pO1xuXG4vLyAyMC4zLjMuMSAvIDE1LjkuNC40IERhdGUubm93KClcbiRkZWYoJGRlZi5TLCAnRGF0ZScsIHtub3c6IGZ1bmN0aW9uKCl7XG4gIHJldHVybiArbmV3IERhdGU7XG59fSk7XG5cbmZ1bmN0aW9uIGx6KG51bSl7XG4gIHJldHVybiBudW0gPiA5ID8gbnVtIDogJzAnICsgbnVtO1xufVxuXG4vLyAyMC4zLjQuMzYgLyAxNS45LjUuNDMgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcoKVxuLy8gUGhhbnRvbUpTIGFuZCBvbGQgd2Via2l0IGhhZCBhIGJyb2tlbiBEYXRlIGltcGxlbWVudGF0aW9uLlxudmFyIGRhdGUgICAgICAgPSBuZXcgRGF0ZSgtNWUxMyAtIDEpXG4gICwgYnJva2VuRGF0ZSA9ICEoZGF0ZS50b0lTT1N0cmluZyAmJiBkYXRlLnRvSVNPU3RyaW5nKCkgPT0gJzAzODUtMDctMjVUMDc6MDY6MzkuOTk5WidcbiAgICAgICYmIHJlcXVpcmUoJy4vJC50aHJvd3MnKShmdW5jdGlvbigpeyBuZXcgRGF0ZShOYU4pLnRvSVNPU3RyaW5nKCk7IH0pKTtcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogYnJva2VuRGF0ZSwgJ0RhdGUnLCB7dG9JU09TdHJpbmc6IGZ1bmN0aW9uKCl7XG4gIGlmKCFpc0Zpbml0ZSh0aGlzKSl0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIHRpbWUgdmFsdWUnKTtcbiAgdmFyIGQgPSB0aGlzXG4gICAgLCB5ID0gZC5nZXRVVENGdWxsWWVhcigpXG4gICAgLCBtID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKVxuICAgICwgcyA9IHkgPCAwID8gJy0nIDogeSA+IDk5OTkgPyAnKycgOiAnJztcbiAgcmV0dXJuIHMgKyAoJzAwMDAwJyArIE1hdGguYWJzKHkpKS5zbGljZShzID8gLTYgOiAtNCkgK1xuICAgICctJyArIGx6KGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgbHooZC5nZXRVVENEYXRlKCkpICtcbiAgICAnVCcgKyBseihkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgbHooZC5nZXRVVENNaW51dGVzKCkpICtcbiAgICAnOicgKyBseihkLmdldFVUQ1NlY29uZHMoKSkgKyAnLicgKyAobSA+IDk5ID8gbSA6ICcwJyArIGx6KG0pKSArICdaJztcbn19KTtcblxuaWYoY2xhc3NvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdPYmplY3QnKWNvZi5jbGFzc29mID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGFnID0gY2xhc3NvZihpdCk7XG4gIHJldHVybiB0YWcgPT0gJ09iamVjdCcgJiYgaXNGdW5jdGlvbihpdC5jYWxsZWUpID8gJ0FyZ3VtZW50cycgOiB0YWc7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgdG9JbmRleCA9ICQudG9JbmRleDtcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxuICBjb3B5V2l0aGluOiBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldC8qID0gMCAqLywgc3RhcnQgLyogPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcbiAgICB2YXIgTyAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxuICAgICAgLCBsZW4gICA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIHRvICAgID0gdG9JbmRleCh0YXJnZXQsIGxlbilcbiAgICAgICwgZnJvbSAgPSB0b0luZGV4KHN0YXJ0LCBsZW4pXG4gICAgICAsIGVuZCAgID0gYXJndW1lbnRzWzJdXG4gICAgICAsIGZpbiAgID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0luZGV4KGVuZCwgbGVuKVxuICAgICAgLCBjb3VudCA9IE1hdGgubWluKGZpbiAtIGZyb20sIGxlbiAtIHRvKVxuICAgICAgLCBpbmMgICA9IDE7XG4gICAgaWYoZnJvbSA8IHRvICYmIHRvIDwgZnJvbSArIGNvdW50KXtcbiAgICAgIGluYyAgPSAtMTtcbiAgICAgIGZyb20gPSBmcm9tICsgY291bnQgLSAxO1xuICAgICAgdG8gICA9IHRvICAgKyBjb3VudCAtIDE7XG4gICAgfVxuICAgIHdoaWxlKGNvdW50LS0gPiAwKXtcbiAgICAgIGlmKGZyb20gaW4gTylPW3RvXSA9IE9bZnJvbV07XG4gICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcbiAgICAgIHRvICAgKz0gaW5jO1xuICAgICAgZnJvbSArPSBpbmM7XG4gICAgfSByZXR1cm4gTztcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdjb3B5V2l0aGluJyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCB0b0luZGV4ID0gJC50b0luZGV4O1xuJGRlZigkZGVmLlAsICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG4gIGZpbGw6IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyosIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XG4gICAgdmFyIE8gICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGhpcykpXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoYXJndW1lbnRzWzFdLCBsZW5ndGgpXG4gICAgICAsIGVuZCAgICA9IGFyZ3VtZW50c1syXVxuICAgICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xuICAgIHdoaWxlKGVuZFBvcyA+IGluZGV4KU9baW5kZXgrK10gPSB2YWx1ZTtcbiAgICByZXR1cm4gTztcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdmaWxsJyk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjIuMS4zLjkgQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgS0VZICAgID0gJ2ZpbmRJbmRleCdcbiAgLCAkZGVmICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBmb3JjZWQgPSB0cnVlXG4gICwgJGZpbmQgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKSg2KTtcbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XG4kZGVmKCRkZWYuUCArICRkZWYuRiAqIGZvcmNlZCwgJ0FycmF5Jywge1xuICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoS0VZKTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMi4xLjMuOCBBcnJheS5wcm90b3R5cGUuZmluZChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgS0VZICAgID0gJ2ZpbmQnXG4gICwgJGRlZiAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgZm9yY2VkID0gdHJ1ZVxuICAsICRmaW5kICA9IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJykoNSk7XG4vLyBTaG91bGRuJ3Qgc2tpcCBob2xlc1xuaWYoS0VZIGluIFtdKUFycmF5KDEpW0tFWV0oZnVuY3Rpb24oKXsgZm9yY2VkID0gZmFsc2U7IH0pO1xuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBmb3JjZWQsICdBcnJheScsIHtcbiAgZmluZDogZnVuY3Rpb24gZmluZChjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZmluZCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoS0VZKTsiLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkaXRlciA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBjYWxsICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKTtcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogIXJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xuICAgIHZhciBPICAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZChhcnJheUxpa2UpKVxuICAgICAgLCBtYXBmbiAgID0gYXJndW1lbnRzWzFdXG4gICAgICAsIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkXG4gICAgICAsIGYgICAgICAgPSBtYXBwaW5nID8gY3R4KG1hcGZuLCBhcmd1bWVudHNbMl0sIDIpIDogdW5kZWZpbmVkXG4gICAgICAsIGluZGV4ICAgPSAwXG4gICAgICAsIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZigkaXRlci5pcyhPKSl7XG4gICAgICBpdGVyYXRvciA9ICRpdGVyLmdldChPKTtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXG4gICAgICByZXN1bHQgICA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSk7XG4gICAgICBmb3IoOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4Kyspe1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIGYsIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cbiAgICAgIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkobGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aCkpO1xuICAgICAgZm9yKDsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IGYoT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHNldFVuc2NvcGUgPSByZXF1aXJlKCcuLyQudW5zY29wZScpXG4gICwgSVRFUiAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcbiAgLCAkaXRlciAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIHN0ZXAgICAgICAgPSAkaXRlci5zdGVwXG4gICwgSXRlcmF0b3JzICA9ICRpdGVyLkl0ZXJhdG9ycztcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgJC5zZXQodGhpcywgSVRFUiwge286ICQudG9PYmplY3QoaXRlcmF0ZWQpLCBpOiAwLCBrOiBraW5kfSk7XG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cbiAgICAsIE8gICAgID0gaXRlci5vXG4gICAgLCBraW5kICA9IGl0ZXIua1xuICAgICwgaW5kZXggPSBpdGVyLmkrKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuc2V0VW5zY29wZSgna2V5cycpO1xuc2V0VW5zY29wZSgndmFsdWVzJyk7XG5zZXRVbnNjb3BlKCdlbnRyaWVzJyk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXG4gIG9mOiBmdW5jdGlvbiBvZigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgaW5kZXggID0gMFxuICAgICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxuICAgICAgLCByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGxlbmd0aCk7XG4gICAgd2hpbGUobGVuZ3RoID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9IGFyZ3VtZW50c1tpbmRleCsrXTtcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsInJlcXVpcmUoJy4vJC5zcGVjaWVzJykoQXJyYXkpOyIsInZhciAkICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBIQVNfSU5TVEFOQ0UgID0gcmVxdWlyZSgnLi8kLndrcycpKCdoYXNJbnN0YW5jZScpXG4gICwgRnVuY3Rpb25Qcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbi8vIDE5LjIuMy42IEZ1bmN0aW9uLnByb3RvdHlwZVtAQGhhc0luc3RhbmNlXShWKVxuaWYoIShIQVNfSU5TVEFOQ0UgaW4gRnVuY3Rpb25Qcm90bykpJC5zZXREZXNjKEZ1bmN0aW9uUHJvdG8sIEhBU19JTlNUQU5DRSwge3ZhbHVlOiBmdW5jdGlvbihPKXtcbiAgaWYoISQuaXNGdW5jdGlvbih0aGlzKSB8fCAhJC5pc09iamVjdChPKSlyZXR1cm4gZmFsc2U7XG4gIGlmKCEkLmlzT2JqZWN0KHRoaXMucHJvdG90eXBlKSlyZXR1cm4gTyBpbnN0YW5jZW9mIHRoaXM7XG4gIC8vIGZvciBlbnZpcm9ubWVudCB3L28gbmF0aXZlIGBAQGhhc0luc3RhbmNlYCBsb2dpYyBlbm91Z2ggYGluc3RhbmNlb2ZgLCBidXQgYWRkIHRoaXM6XG4gIHdoaWxlKE8gPSAkLmdldFByb3RvKE8pKWlmKHRoaXMucHJvdG90eXBlID09PSBPKXJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59fSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIE5BTUUgPSAnbmFtZSdcbiAgLCBzZXREZXNjID0gJC5zZXREZXNjXG4gICwgRnVuY3Rpb25Qcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbi8vIDE5LjIuNC4yIG5hbWVcbk5BTUUgaW4gRnVuY3Rpb25Qcm90byB8fCAkLkZXICYmICQuREVTQyAmJiBzZXREZXNjKEZ1bmN0aW9uUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG1hdGNoID0gU3RyaW5nKHRoaXMpLm1hdGNoKC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLylcbiAgICAgICwgbmFtZSAgPSBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XG4gICAgJC5oYXModGhpcywgTkFNRSkgfHwgc2V0RGVzYyh0aGlzLCBOQU1FLCAkLmRlc2MoNSwgbmFtZSkpO1xuICAgIHJldHVybiBuYW1lO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAkLmhhcyh0aGlzLCBOQU1FKSB8fCBzZXREZXNjKHRoaXMsIE5BTUUsICQuZGVzYygwLCB2YWx1ZSkpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ01hcCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHNbMF0pOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTsiLCJ2YXIgSW5maW5pdHkgPSAxIC8gMFxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgRSAgICAgPSBNYXRoLkVcbiAgLCBwb3cgICA9IE1hdGgucG93XG4gICwgYWJzICAgPSBNYXRoLmFic1xuICAsIGV4cCAgID0gTWF0aC5leHBcbiAgLCBsb2cgICA9IE1hdGgubG9nXG4gICwgc3FydCAgPSBNYXRoLnNxcnRcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vclxuICAsIEVQU0lMT04gICA9IHBvdygyLCAtNTIpXG4gICwgRVBTSUxPTjMyID0gcG93KDIsIC0yMylcbiAgLCBNQVgzMiAgICAgPSBwb3coMiwgMTI3KSAqICgyIC0gRVBTSUxPTjMyKVxuICAsIE1JTjMyICAgICA9IHBvdygyLCAtMTI2KTtcbmZ1bmN0aW9uIHJvdW5kVGllc1RvRXZlbihuKXtcbiAgcmV0dXJuIG4gKyAxIC8gRVBTSUxPTiAtIDEgLyBFUFNJTE9OO1xufVxuXG4vLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXG5mdW5jdGlvbiBzaWduKHgpe1xuICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XG59XG4vLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXG5mdW5jdGlvbiBhc2luaCh4KXtcbiAgcmV0dXJuICFpc0Zpbml0ZSh4ID0gK3gpIHx8IHggPT0gMCA/IHggOiB4IDwgMCA/IC1hc2luaCgteCkgOiBsb2coeCArIHNxcnQoeCAqIHggKyAxKSk7XG59XG4vLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxuZnVuY3Rpb24gZXhwbTEoeCl7XG4gIHJldHVybiAoeCA9ICt4KSA9PSAwID8geCA6IHggPiAtMWUtNiAmJiB4IDwgMWUtNiA/IHggKyB4ICogeCAvIDIgOiBleHAoeCkgLSAxO1xufVxuXG4kZGVmKCRkZWYuUywgJ01hdGgnLCB7XG4gIC8vIDIwLjIuMi4zIE1hdGguYWNvc2goeClcbiAgYWNvc2g6IGZ1bmN0aW9uIGFjb3NoKHgpe1xuICAgIHJldHVybiAoeCA9ICt4KSA8IDEgPyBOYU4gOiBpc0Zpbml0ZSh4KSA/IGxvZyh4IC8gRSArIHNxcnQoeCArIDEpICogc3FydCh4IC0gMSkgLyBFKSArIDEgOiB4O1xuICB9LFxuICAvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXG4gIGFzaW5oOiBhc2luaCxcbiAgLy8gMjAuMi4yLjcgTWF0aC5hdGFuaCh4KVxuICBhdGFuaDogZnVuY3Rpb24gYXRhbmgoeCl7XG4gICAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogbG9nKCgxICsgeCkgLyAoMSAtIHgpKSAvIDI7XG4gIH0sXG4gIC8vIDIwLjIuMi45IE1hdGguY2JydCh4KVxuICBjYnJ0OiBmdW5jdGlvbiBjYnJ0KHgpe1xuICAgIHJldHVybiBzaWduKHggPSAreCkgKiBwb3coYWJzKHgpLCAxIC8gMyk7XG4gIH0sXG4gIC8vIDIwLjIuMi4xMSBNYXRoLmNsejMyKHgpXG4gIGNsejMyOiBmdW5jdGlvbiBjbHozMih4KXtcbiAgICByZXR1cm4gKHggPj4+PSAwKSA/IDMxIC0gZmxvb3IobG9nKHggKyAwLjUpICogTWF0aC5MT0cyRSkgOiAzMjtcbiAgfSxcbiAgLy8gMjAuMi4yLjEyIE1hdGguY29zaCh4KVxuICBjb3NoOiBmdW5jdGlvbiBjb3NoKHgpe1xuICAgIHJldHVybiAoZXhwKHggPSAreCkgKyBleHAoLXgpKSAvIDI7XG4gIH0sXG4gIC8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXG4gIGV4cG0xOiBleHBtMSxcbiAgLy8gMjAuMi4yLjE2IE1hdGguZnJvdW5kKHgpXG4gIGZyb3VuZDogZnVuY3Rpb24gZnJvdW5kKHgpe1xuICAgIHZhciAkYWJzICA9IGFicyh4KVxuICAgICAgLCAkc2lnbiA9IHNpZ24oeClcbiAgICAgICwgYSwgcmVzdWx0O1xuICAgIGlmKCRhYnMgPCBNSU4zMilyZXR1cm4gJHNpZ24gKiByb3VuZFRpZXNUb0V2ZW4oJGFicyAvIE1JTjMyIC8gRVBTSUxPTjMyKSAqIE1JTjMyICogRVBTSUxPTjMyO1xuICAgIGEgPSAoMSArIEVQU0lMT04zMiAvIEVQU0lMT04pICogJGFicztcbiAgICByZXN1bHQgPSBhIC0gKGEgLSAkYWJzKTtcbiAgICBpZihyZXN1bHQgPiBNQVgzMiB8fCByZXN1bHQgIT0gcmVzdWx0KXJldHVybiAkc2lnbiAqIEluZmluaXR5O1xuICAgIHJldHVybiAkc2lnbiAqIHJlc3VsdDtcbiAgfSxcbiAgLy8gMjAuMi4yLjE3IE1hdGguaHlwb3QoW3ZhbHVlMVssIHZhbHVlMlssIOKApiBdXV0pXG4gIGh5cG90OiBmdW5jdGlvbiBoeXBvdCh2YWx1ZTEsIHZhbHVlMil7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgc3VtICA9IDBcbiAgICAgICwgaSAgICA9IDBcbiAgICAgICwgbGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgbGFyZyA9IDBcbiAgICAgICwgYXJnLCBkaXY7XG4gICAgd2hpbGUoaSA8IGxlbil7XG4gICAgICBhcmcgPSBhYnMoYXJndW1lbnRzW2krK10pO1xuICAgICAgaWYobGFyZyA8IGFyZyl7XG4gICAgICAgIGRpdiAgPSBsYXJnIC8gYXJnO1xuICAgICAgICBzdW0gID0gc3VtICogZGl2ICogZGl2ICsgMTtcbiAgICAgICAgbGFyZyA9IGFyZztcbiAgICAgIH0gZWxzZSBpZihhcmcgPiAwKXtcbiAgICAgICAgZGl2ICA9IGFyZyAvIGxhcmc7XG4gICAgICAgIHN1bSArPSBkaXYgKiBkaXY7XG4gICAgICB9IGVsc2Ugc3VtICs9IGFyZztcbiAgICB9XG4gICAgcmV0dXJuIGxhcmcgPT09IEluZmluaXR5ID8gSW5maW5pdHkgOiBsYXJnICogc3FydChzdW0pO1xuICB9LFxuICAvLyAyMC4yLjIuMTggTWF0aC5pbXVsKHgsIHkpXG4gIGltdWw6IGZ1bmN0aW9uIGltdWwoeCwgeSl7XG4gICAgdmFyIFVJbnQxNiA9IDB4ZmZmZlxuICAgICAgLCB4biA9ICt4XG4gICAgICAsIHluID0gK3lcbiAgICAgICwgeGwgPSBVSW50MTYgJiB4blxuICAgICAgLCB5bCA9IFVJbnQxNiAmIHluO1xuICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUludDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUludDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XG4gIH0sXG4gIC8vIDIwLjIuMi4yMCBNYXRoLmxvZzFwKHgpXG4gIGxvZzFwOiBmdW5jdGlvbiBsb2cxcCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPiAtMWUtOCAmJiB4IDwgMWUtOCA/IHggLSB4ICogeCAvIDIgOiBsb2coMSArIHgpO1xuICB9LFxuICAvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxuICBsb2cxMDogZnVuY3Rpb24gbG9nMTAoeCl7XG4gICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4xMDtcbiAgfSxcbiAgLy8gMjAuMi4yLjIyIE1hdGgubG9nMih4KVxuICBsb2cyOiBmdW5jdGlvbiBsb2cyKHgpe1xuICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMjtcbiAgfSxcbiAgLy8gMjAuMi4yLjI4IE1hdGguc2lnbih4KVxuICBzaWduOiBzaWduLFxuICAvLyAyMC4yLjIuMzAgTWF0aC5zaW5oKHgpXG4gIHNpbmg6IGZ1bmN0aW9uIHNpbmgoeCl7XG4gICAgcmV0dXJuIGFicyh4ID0gK3gpIDwgMSA/IChleHBtMSh4KSAtIGV4cG0xKC14KSkgLyAyIDogKGV4cCh4IC0gMSkgLSBleHAoLXggLSAxKSkgKiAoRSAvIDIpO1xuICB9LFxuICAvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXG4gIHRhbmg6IGZ1bmN0aW9uIHRhbmgoeCl7XG4gICAgdmFyIGEgPSBleHBtMSh4ID0gK3gpXG4gICAgICAsIGIgPSBleHBtMSgteCk7XG4gICAgcmV0dXJuIGEgPT0gSW5maW5pdHkgPyAxIDogYiA9PSBJbmZpbml0eSA/IC0xIDogKGEgLSBiKSAvIChleHAoeCkgKyBleHAoLXgpKTtcbiAgfSxcbiAgLy8gMjAuMi4yLjM0IE1hdGgudHJ1bmMoeClcbiAgdHJ1bmM6IGZ1bmN0aW9uIHRydW5jKGl0KXtcbiAgICByZXR1cm4gKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaXNPYmplY3QgICA9ICQuaXNPYmplY3RcbiAgLCBpc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uXG4gICwgTlVNQkVSICAgICA9ICdOdW1iZXInXG4gICwgJE51bWJlciAgICA9ICQuZ1tOVU1CRVJdXG4gICwgQmFzZSAgICAgICA9ICROdW1iZXJcbiAgLCBwcm90byAgICAgID0gJE51bWJlci5wcm90b3R5cGU7XG5mdW5jdGlvbiB0b1ByaW1pdGl2ZShpdCl7XG4gIHZhciBmbiwgdmFsO1xuICBpZihpc0Z1bmN0aW9uKGZuID0gaXQudmFsdWVPZikgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZihpc0Z1bmN0aW9uKGZuID0gaXQudG9TdHJpbmcpICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gbnVtYmVyXCIpO1xufVxuZnVuY3Rpb24gdG9OdW1iZXIoaXQpe1xuICBpZihpc09iamVjdChpdCkpaXQgPSB0b1ByaW1pdGl2ZShpdCk7XG4gIGlmKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyAmJiBpdC5sZW5ndGggPiAyICYmIGl0LmNoYXJDb2RlQXQoMCkgPT0gNDgpe1xuICAgIHZhciBiaW5hcnkgPSBmYWxzZTtcbiAgICBzd2l0Y2goaXQuY2hhckNvZGVBdCgxKSl7XG4gICAgICBjYXNlIDY2IDogY2FzZSA5OCAgOiBiaW5hcnkgPSB0cnVlO1xuICAgICAgY2FzZSA3OSA6IGNhc2UgMTExIDogcmV0dXJuIHBhcnNlSW50KGl0LnNsaWNlKDIpLCBiaW5hcnkgPyAyIDogOCk7XG4gICAgfVxuICB9IHJldHVybiAraXQ7XG59XG5pZigkLkZXICYmICEoJE51bWJlcignMG8xJykgJiYgJE51bWJlcignMGIxJykpKXtcbiAgJE51bWJlciA9IGZ1bmN0aW9uIE51bWJlcihpdCl7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiAkTnVtYmVyID8gbmV3IEJhc2UodG9OdW1iZXIoaXQpKSA6IHRvTnVtYmVyKGl0KTtcbiAgfTtcbiAgJC5lYWNoLmNhbGwoJC5ERVNDID8gJC5nZXROYW1lcyhCYXNlKSA6IChcbiAgICAgIC8vIEVTMzpcbiAgICAgICdNQVhfVkFMVUUsTUlOX1ZBTFVFLE5hTixORUdBVElWRV9JTkZJTklUWSxQT1NJVElWRV9JTkZJTklUWSwnICtcbiAgICAgIC8vIEVTNiAoaW4gY2FzZSwgaWYgbW9kdWxlcyB3aXRoIEVTNiBOdW1iZXIgc3RhdGljcyByZXF1aXJlZCBiZWZvcmUpOlxuICAgICAgJ0VQU0lMT04saXNGaW5pdGUsaXNJbnRlZ2VyLGlzTmFOLGlzU2FmZUludGVnZXIsTUFYX1NBRkVfSU5URUdFUiwnICtcbiAgICAgICdNSU5fU0FGRV9JTlRFR0VSLHBhcnNlRmxvYXQscGFyc2VJbnQsaXNJbnRlZ2VyJ1xuICAgICkuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcbiAgICAgIGlmKCQuaGFzKEJhc2UsIGtleSkgJiYgISQuaGFzKCROdW1iZXIsIGtleSkpe1xuICAgICAgICAkLnNldERlc2MoJE51bWJlciwga2V5LCAkLmdldERlc2MoQmFzZSwga2V5KSk7XG4gICAgICB9XG4gICAgfVxuICApO1xuICAkTnVtYmVyLnByb3RvdHlwZSA9IHByb3RvO1xuICBwcm90by5jb25zdHJ1Y3RvciA9ICROdW1iZXI7XG4gIHJlcXVpcmUoJy4vJC5yZWRlZicpKCQuZywgTlVNQkVSLCAkTnVtYmVyKTtcbn0iLCJ2YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgYWJzICAgPSBNYXRoLmFic1xuICAsIGZsb29yID0gTWF0aC5mbG9vclxuICAsIF9pc0Zpbml0ZSA9ICQuZy5pc0Zpbml0ZVxuICAsIE1BWF9TQUZFX0lOVEVHRVIgPSAweDFmZmZmZmZmZmZmZmZmOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxO1xuZnVuY3Rpb24gaXNJbnRlZ2VyKGl0KXtcbiAgcmV0dXJuICEkLmlzT2JqZWN0KGl0KSAmJiBfaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XG59XG4kZGVmKCRkZWYuUywgJ051bWJlcicsIHtcbiAgLy8gMjAuMS4yLjEgTnVtYmVyLkVQU0lMT05cbiAgRVBTSUxPTjogTWF0aC5wb3coMiwgLTUyKSxcbiAgLy8gMjAuMS4yLjIgTnVtYmVyLmlzRmluaXRlKG51bWJlcilcbiAgaXNGaW5pdGU6IGZ1bmN0aW9uIGlzRmluaXRlKGl0KXtcbiAgICByZXR1cm4gdHlwZW9mIGl0ID09ICdudW1iZXInICYmIF9pc0Zpbml0ZShpdCk7XG4gIH0sXG4gIC8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxuICBpc0ludGVnZXI6IGlzSW50ZWdlcixcbiAgLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcbiAgaXNOYU46IGZ1bmN0aW9uIGlzTmFOKG51bWJlcil7XG4gICAgcmV0dXJuIG51bWJlciAhPSBudW1iZXI7XG4gIH0sXG4gIC8vIDIwLjEuMi41IE51bWJlci5pc1NhZmVJbnRlZ2VyKG51bWJlcilcbiAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24gaXNTYWZlSW50ZWdlcihudW1iZXIpe1xuICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xuICB9LFxuICAvLyAyMC4xLjIuNiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxuICBNQVhfU0FGRV9JTlRFR0VSOiBNQVhfU0FGRV9JTlRFR0VSLFxuICAvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcbiAgTUlOX1NBRkVfSU5URUdFUjogLU1BWF9TQUZFX0lOVEVHRVIsXG4gIC8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXG4gIHBhcnNlRmxvYXQ6IHBhcnNlRmxvYXQsXG4gIC8vIDIwLjEuMi4xMyBOdW1iZXIucGFyc2VJbnQoc3RyaW5nLCByYWRpeClcbiAgcGFyc2VJbnQ6IHBhcnNlSW50XG59KTsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vJC5hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge1xuICBpczogcmVxdWlyZSgnLi8kLnNhbWUnKVxufSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXR9KTsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XG4gICwgdG9PYmplY3QgPSAkLnRvT2JqZWN0O1xuJC5lYWNoLmNhbGwoKCdmcmVlemUsc2VhbCxwcmV2ZW50RXh0ZW5zaW9ucyxpc0Zyb3plbixpc1NlYWxlZCxpc0V4dGVuc2libGUsJyArXG4gICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsZ2V0UHJvdG90eXBlT2Ysa2V5cyxnZXRPd25Qcm9wZXJ0eU5hbWVzJykuc3BsaXQoJywnKVxuLCBmdW5jdGlvbihLRVksIElEKXtcbiAgdmFyIGZuICAgICA9ICgkLmNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldXG4gICAgLCBmb3JjZWQgPSAwXG4gICAgLCBtZXRob2QgPSB7fTtcbiAgbWV0aG9kW0tFWV0gPSBJRCA9PSAwID8gZnVuY3Rpb24gZnJlZXplKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XG4gIH0gOiBJRCA9PSAxID8gZnVuY3Rpb24gc2VhbChpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGl0O1xuICB9IDogSUQgPT0gMiA/IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XG4gIH0gOiBJRCA9PSAzID8gZnVuY3Rpb24gaXNGcm96ZW4oaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xuICB9IDogSUQgPT0gNCA/IGZ1bmN0aW9uIGlzU2VhbGVkKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogdHJ1ZTtcbiAgfSA6IElEID09IDUgPyBmdW5jdGlvbiBpc0V4dGVuc2libGUoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBmYWxzZTtcbiAgfSA6IElEID09IDYgPyBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSwga2V5KTtcbiAgfSA6IElEID09IDcgPyBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCl7XG4gICAgcmV0dXJuIGZuKE9iamVjdCgkLmFzc2VydERlZmluZWQoaXQpKSk7XG4gIH0gOiBJRCA9PSA4ID8gZnVuY3Rpb24ga2V5cyhpdCl7XG4gICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSk7XG4gIH0gOiByZXF1aXJlKCcuLyQuZ2V0LW5hbWVzJykuZ2V0O1xuICB0cnkge1xuICAgIGZuKCd6Jyk7XG4gIH0gY2F0Y2goZSl7XG4gICAgZm9yY2VkID0gMTtcbiAgfVxuICAkZGVmKCRkZWYuUyArICRkZWYuRiAqIGZvcmNlZCwgJ09iamVjdCcsIG1ldGhvZCk7XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCB0bXAgPSB7fTtcbnRtcFtyZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyldID0gJ3onO1xuaWYocmVxdWlyZSgnLi8kJykuRlcgJiYgY29mKHRtcCkgIT0gJ3onKXtcbiAgcmVxdWlyZSgnLi8kLnJlZGVmJykoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gJ1tvYmplY3QgJyArIGNvZi5jbGFzc29mKHRoaXMpICsgJ10nO1xuICB9LCB0cnVlKTtcbn0iLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY29mICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzZXRQcm90byA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXRcbiAgLCBzYW1lICAgICA9IHJlcXVpcmUoJy4vJC5zYW1lJylcbiAgLCBzcGVjaWVzICA9IHJlcXVpcmUoJy4vJC5zcGVjaWVzJylcbiAgLCBTUEVDSUVTICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXG4gICwgUkVDT1JEICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgncmVjb3JkJylcbiAgLCBQUk9NSVNFICA9ICdQcm9taXNlJ1xuICAsIGdsb2JhbCAgID0gJC5nXG4gICwgcHJvY2VzcyAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgID0gY29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGFzYXAgICAgID0gcHJvY2VzcyAmJiBwcm9jZXNzLm5leHRUaWNrIHx8IHJlcXVpcmUoJy4vJC50YXNrJykuc2V0XG4gICwgUCAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBpc0Z1bmN0aW9uICAgICA9ICQuaXNGdW5jdGlvblxuICAsIGlzT2JqZWN0ICAgICAgID0gJC5pc09iamVjdFxuICAsIGFzc2VydEZ1bmN0aW9uID0gYXNzZXJ0LmZuXG4gICwgYXNzZXJ0T2JqZWN0ICAgPSBhc3NlcnQub2JqXG4gICwgV3JhcHBlcjtcblxuZnVuY3Rpb24gdGVzdFJlc29sdmUoc3ViKXtcbiAgdmFyIHRlc3QgPSBuZXcgUChmdW5jdGlvbigpe30pO1xuICBpZihzdWIpdGVzdC5jb25zdHJ1Y3RvciA9IE9iamVjdDtcbiAgcmV0dXJuIFAucmVzb2x2ZSh0ZXN0KSA9PT0gdGVzdDtcbn1cblxudmFyIHVzZU5hdGl2ZSA9IGZ1bmN0aW9uKCl7XG4gIHZhciB3b3JrcyA9IGZhbHNlO1xuICBmdW5jdGlvbiBQMih4KXtcbiAgICB2YXIgc2VsZiA9IG5ldyBQKHgpO1xuICAgIHNldFByb3RvKHNlbGYsIFAyLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgdHJ5IHtcbiAgICB3b3JrcyA9IGlzRnVuY3Rpb24oUCkgJiYgaXNGdW5jdGlvbihQLnJlc29sdmUpICYmIHRlc3RSZXNvbHZlKCk7XG4gICAgc2V0UHJvdG8oUDIsIFApO1xuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFAyLnJlc29sdmUoNSkudGhlbihmdW5jdGlvbigpe30pIGluc3RhbmNlb2YgUDIpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGFjdHVhbCBWOCBidWcsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTYyXG4gICAgaWYod29ya3MgJiYgJC5ERVNDKXtcbiAgICAgIHZhciB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSBmYWxzZTtcbiAgICAgIFAucmVzb2x2ZSgkLnNldERlc2Moe30sICd0aGVuJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRoZW5hYmxlVGhlbkdvdHRlbiA9IHRydWU7IH1cbiAgICAgIH0pKTtcbiAgICAgIHdvcmtzID0gdGhlbmFibGVUaGVuR290dGVuO1xuICAgIH1cbiAgfSBjYXRjaChlKXsgd29ya3MgPSBmYWxzZTsgfVxuICByZXR1cm4gd29ya3M7XG59KCk7XG5cbi8vIGhlbHBlcnNcbmZ1bmN0aW9uIGlzUHJvbWlzZShpdCl7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKHVzZU5hdGl2ZSA/IGNvZi5jbGFzc29mKGl0KSA9PSAnUHJvbWlzZScgOiBSRUNPUkQgaW4gaXQpO1xufVxuZnVuY3Rpb24gc2FtZUNvbnN0cnVjdG9yKGEsIGIpe1xuICAvLyBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIGlmKCEkLkZXICYmIGEgPT09IFAgJiYgYiA9PT0gV3JhcHBlcilyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIHNhbWUoYSwgYik7XG59XG5mdW5jdGlvbiBnZXRDb25zdHJ1Y3RvcihDKXtcbiAgdmFyIFMgPSBhc3NlcnRPYmplY3QoQylbU1BFQ0lFU107XG4gIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xufVxuZnVuY3Rpb24gaXNUaGVuYWJsZShpdCl7XG4gIHZhciB0aGVuO1xuICBpZihpc09iamVjdChpdCkpdGhlbiA9IGl0LnRoZW47XG4gIHJldHVybiBpc0Z1bmN0aW9uKHRoZW4pID8gdGhlbiA6IGZhbHNlO1xufVxuZnVuY3Rpb24gbm90aWZ5KHJlY29yZCl7XG4gIHZhciBjaGFpbiA9IHJlY29yZC5jO1xuICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gIGlmKGNoYWluLmxlbmd0aClhc2FwLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XG4gICAgICAsIG9rICAgID0gcmVjb3JkLnMgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgZnVuY3Rpb24gcnVuKHJlYWN0KXtcbiAgICAgIHZhciBjYiA9IG9rID8gcmVhY3Qub2sgOiByZWFjdC5mYWlsXG4gICAgICAgICwgcmV0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoY2Ipe1xuICAgICAgICAgIGlmKCFvaylyZWNvcmQuaCA9IHRydWU7XG4gICAgICAgICAgcmV0ID0gY2IgPT09IHRydWUgPyB2YWx1ZSA6IGNiKHZhbHVlKTtcbiAgICAgICAgICBpZihyZXQgPT09IHJlYWN0LlApe1xuICAgICAgICAgICAgcmVhY3QucmVqKFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmV0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmV0LCByZWFjdC5yZXMsIHJlYWN0LnJlaik7XG4gICAgICAgICAgfSBlbHNlIHJlYWN0LnJlcyhyZXQpO1xuICAgICAgICB9IGVsc2UgcmVhY3QucmVqKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICAgcmVhY3QucmVqKGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIGNoYWluLmxlbmd0aCA9IDA7XG4gIH0pO1xufVxuZnVuY3Rpb24gaXNVbmhhbmRsZWQocHJvbWlzZSl7XG4gIHZhciByZWNvcmQgPSBwcm9taXNlW1JFQ09SRF1cbiAgICAsIGNoYWluICA9IHJlY29yZC5hIHx8IHJlY29yZC5jXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZWFjdDtcbiAgaWYocmVjb3JkLmgpcmV0dXJuIGZhbHNlO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdCA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3QuZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3QuUCkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gJHJlamVjdCh2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzXG4gICAgLCBwcm9taXNlO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgcmVjb3JkLnMgPSAyO1xuICByZWNvcmQuYSA9IHJlY29yZC5jLnNsaWNlKCk7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgYXNhcC5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICAgIGlmKGlzVW5oYW5kbGVkKHByb21pc2UgPSByZWNvcmQucCkpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoZ2xvYmFsLmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZWNvcmQuYSA9IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfSwgMSk7XG4gIG5vdGlmeShyZWNvcmQpO1xufVxuZnVuY3Rpb24gJHJlc29sdmUodmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpc1xuICAgICwgdGhlbjtcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIGFzYXAuY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB3cmFwcGVyID0ge3I6IHJlY29yZCwgZDogZmFsc2V9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY29yZC52ID0gdmFsdWU7XG4gICAgICByZWNvcmQucyA9IDE7XG4gICAgICBub3RpZnkocmVjb3JkKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufVxuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIXVzZU5hdGl2ZSl7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gIFAgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKXtcbiAgICBhc3NlcnRGdW5jdGlvbihleGVjdXRvcik7XG4gICAgdmFyIHJlY29yZCA9IHtcbiAgICAgIHA6IGFzc2VydC5pbnN0KHRoaXMsIFAsIFBST01JU0UpLCAgICAgICAvLyA8LSBwcm9taXNlXG4gICAgICBjOiBbXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgICBhOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICAgIHY6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgaDogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXG4gICAgfTtcbiAgICAkLmhpZGUodGhpcywgUkVDT1JELCByZWNvcmQpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHJlY29yZCwgMSksIGN0eCgkcmVqZWN0LCByZWNvcmQsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwocmVjb3JkLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgcmVxdWlyZSgnLi8kLm1peCcpKFAucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciBTID0gYXNzZXJ0T2JqZWN0KGFzc2VydE9iamVjdCh0aGlzKS5jb25zdHJ1Y3RvcilbU1BFQ0lFU107XG4gICAgICB2YXIgcmVhY3QgPSB7XG4gICAgICAgIG9rOiAgIGlzRnVuY3Rpb24ob25GdWxmaWxsZWQpID8gb25GdWxmaWxsZWQgOiB0cnVlLFxuICAgICAgICBmYWlsOiBpc0Z1bmN0aW9uKG9uUmVqZWN0ZWQpICA/IG9uUmVqZWN0ZWQgIDogZmFsc2VcbiAgICAgIH07XG4gICAgICB2YXIgcHJvbWlzZSA9IHJlYWN0LlAgPSBuZXcgKFMgIT0gdW5kZWZpbmVkID8gUyA6IFApKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgICAgcmVhY3QucmVzID0gYXNzZXJ0RnVuY3Rpb24ocmVzKTtcbiAgICAgICAgcmVhY3QucmVqID0gYXNzZXJ0RnVuY3Rpb24ocmVqKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHJlY29yZCA9IHRoaXNbUkVDT1JEXTtcbiAgICAgIHJlY29yZC5jLnB1c2gocmVhY3QpO1xuICAgICAgaWYocmVjb3JkLmEpcmVjb3JkLmEucHVzaChyZWFjdCk7XG4gICAgICBpZihyZWNvcmQucylub3RpZnkocmVjb3JkKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBleHBvcnRcbiRkZWYoJGRlZi5HICsgJGRlZi5XICsgJGRlZi5GICogIXVzZU5hdGl2ZSwge1Byb21pc2U6IFB9KTtcbmNvZi5zZXQoUCwgUFJPTUlTRSk7XG5zcGVjaWVzKFApO1xuc3BlY2llcyhXcmFwcGVyID0gJC5jb3JlW1BST01JU0VdKTtcblxuLy8gc3RhdGljc1xuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHJldHVybiBuZXcgKGdldENvbnN0cnVjdG9yKHRoaXMpKShmdW5jdGlvbihyZXMsIHJlail7IHJlaihyKTsgfSk7XG4gIH1cbn0pO1xuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAoIXVzZU5hdGl2ZSB8fCB0ZXN0UmVzb2x2ZSh0cnVlKSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCl7XG4gICAgcmV0dXJuIGlzUHJvbWlzZSh4KSAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcylcbiAgICAgID8geCA6IG5ldyB0aGlzKGZ1bmN0aW9uKHJlcyl7IHJlcyh4KTsgfSk7XG4gIH1cbn0pO1xuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhKHVzZU5hdGl2ZSAmJiByZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgUC5hbGwoaXRlcilbJ2NhdGNoJ10oZnVuY3Rpb24oKXt9KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxuICAgICAgLCB2YWx1ZXMgPSBbXTtcbiAgICByZXR1cm4gbmV3IEMoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCB2YWx1ZXMucHVzaCwgdmFsdWVzKTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB2YWx1ZXMubGVuZ3RoXG4gICAgICAgICwgcmVzdWx0cyAgID0gQXJyYXkocmVtYWluaW5nKTtcbiAgICAgIGlmKHJlbWFpbmluZykkLmVhY2guY2FsbCh2YWx1ZXMsIGZ1bmN0aW9uKHByb21pc2UsIGluZGV4KXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzKHJlc3VsdHMpO1xuICAgICAgICB9LCByZWopO1xuICAgICAgfSk7XG4gICAgICBlbHNlIHJlcyhyZXN1bHRzKTtcbiAgICB9KTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyA9IGdldENvbnN0cnVjdG9yKHRoaXMpO1xuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXMsIHJlail7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihyZXMsIHJlaik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7IiwidmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgc2V0UHJvdG8gID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpXG4gICwgJGl0ZXIgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIElURVIgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcbiAgLCBzdGVwICAgICAgPSAkaXRlci5zdGVwXG4gICwgYXNzZXJ0ICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgaXNPYmplY3QgID0gJC5pc09iamVjdFxuICAsIGdldFByb3RvICA9ICQuZ2V0UHJvdG9cbiAgLCAkUmVmbGVjdCAgPSAkLmcuUmVmbGVjdFxuICAsIF9hcHBseSAgICA9IEZ1bmN0aW9uLmFwcGx5XG4gICwgYXNzZXJ0T2JqZWN0ID0gYXNzZXJ0Lm9ialxuICAsIF9pc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgX3ByZXZlbnRFeHRlbnNpb25zID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zXG4gIC8vIElFIFRQIGhhcyBicm9rZW4gUmVmbGVjdC5lbnVtZXJhdGVcbiAgLCBidWdneUVudW1lcmF0ZSA9ICEoJFJlZmxlY3QgJiYgJFJlZmxlY3QuZW51bWVyYXRlICYmIElURVJBVE9SIGluICRSZWZsZWN0LmVudW1lcmF0ZSh7fSkpO1xuXG5mdW5jdGlvbiBFbnVtZXJhdGUoaXRlcmF0ZWQpe1xuICAkLnNldCh0aGlzLCBJVEVSLCB7bzogaXRlcmF0ZWQsIGs6IHVuZGVmaW5lZCwgaTogMH0pO1xufVxuJGl0ZXIuY3JlYXRlKEVudW1lcmF0ZSwgJ09iamVjdCcsIGZ1bmN0aW9uKCl7XG4gIHZhciBpdGVyID0gdGhpc1tJVEVSXVxuICAgICwga2V5cyA9IGl0ZXIua1xuICAgICwga2V5O1xuICBpZihrZXlzID09IHVuZGVmaW5lZCl7XG4gICAgaXRlci5rID0ga2V5cyA9IFtdO1xuICAgIGZvcihrZXkgaW4gaXRlci5vKWtleXMucHVzaChrZXkpO1xuICB9XG4gIGRvIHtcbiAgICBpZihpdGVyLmkgPj0ga2V5cy5sZW5ndGgpcmV0dXJuIHN0ZXAoMSk7XG4gIH0gd2hpbGUoISgoa2V5ID0ga2V5c1tpdGVyLmkrK10pIGluIGl0ZXIubykpO1xuICByZXR1cm4gc3RlcCgwLCBrZXkpO1xufSk7XG5cbnZhciByZWZsZWN0ID0ge1xuICAvLyAyNi4xLjEgUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdClcbiAgYXBwbHk6IGZ1bmN0aW9uIGFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KXtcbiAgICByZXR1cm4gX2FwcGx5LmNhbGwodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpO1xuICB9LFxuICAvLyAyNi4xLjIgUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IFssIG5ld1RhcmdldF0pXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCAvKiwgbmV3VGFyZ2V0Ki8pe1xuICAgIHZhciBwcm90byAgICA9IGFzc2VydC5mbihhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXSkucHJvdG90eXBlXG4gICAgICAsIGluc3RhbmNlID0gJC5jcmVhdGUoaXNPYmplY3QocHJvdG8pID8gcHJvdG8gOiBPYmplY3QucHJvdG90eXBlKVxuICAgICAgLCByZXN1bHQgICA9IF9hcHBseS5jYWxsKHRhcmdldCwgaW5zdGFuY2UsIGFyZ3VtZW50c0xpc3QpO1xuICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogaW5zdGFuY2U7XG4gIH0sXG4gIC8vIDI2LjEuMyBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKXtcbiAgICBhc3NlcnRPYmplY3QodGFyZ2V0KTtcbiAgICB0cnkge1xuICAgICAgJC5zZXREZXNjKHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIC8vIDI2LjEuNCBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpXG4gIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5KXtcbiAgICB2YXIgZGVzYyA9ICQuZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xuICAgIHJldHVybiBkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSA/IGZhbHNlIDogZGVsZXRlIHRhcmdldFtwcm9wZXJ0eUtleV07XG4gIH0sXG4gIC8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQodGFyZ2V0LCBwcm9wZXJ0eUtleS8qLCByZWNlaXZlciovKXtcbiAgICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXVxuICAgICAgLCBkZXNjID0gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSksIHByb3RvO1xuICAgIGlmKGRlc2MpcmV0dXJuICQuaGFzKGRlc2MsICd2YWx1ZScpXG4gICAgICA/IGRlc2MudmFsdWVcbiAgICAgIDogZGVzYy5nZXQgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICA6IGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICAgIHJldHVybiBpc09iamVjdChwcm90byA9IGdldFByb3RvKHRhcmdldCkpXG4gICAgICA/IGdldChwcm90bywgcHJvcGVydHlLZXksIHJlY2VpdmVyKVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH0sXG4gIC8vIDI2LjEuNyBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KXtcbiAgICByZXR1cm4gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XG4gIH0sXG4gIC8vIDI2LjEuOCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClcbiAgZ2V0UHJvdG90eXBlT2Y6IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKHRhcmdldCl7XG4gICAgcmV0dXJuIGdldFByb3RvKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcbiAgfSxcbiAgLy8gMjYuMS45IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpXG4gIGhhczogZnVuY3Rpb24gaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHJldHVybiBwcm9wZXJ0eUtleSBpbiB0YXJnZXQ7XG4gIH0sXG4gIC8vIDI2LjEuMTAgUmVmbGVjdC5pc0V4dGVuc2libGUodGFyZ2V0KVxuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZSh0YXJnZXQpe1xuICAgIHJldHVybiBfaXNFeHRlbnNpYmxlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcbiAgfSxcbiAgLy8gMjYuMS4xMSBSZWZsZWN0Lm93bktleXModGFyZ2V0KVxuICBvd25LZXlzOiByZXF1aXJlKCcuLyQub3duLWtleXMnKSxcbiAgLy8gMjYuMS4xMiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldClcbiAgcHJldmVudEV4dGVuc2lvbnM6IGZ1bmN0aW9uIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCl7XG4gICAgYXNzZXJ0T2JqZWN0KHRhcmdldCk7XG4gICAgdHJ5IHtcbiAgICAgIGlmKF9wcmV2ZW50RXh0ZW5zaW9ucylfcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuICAvLyAyNi4xLjEzIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgWywgcmVjZWl2ZXJdKVxuICBzZXQ6IGZ1bmN0aW9uIHNldCh0YXJnZXQsIHByb3BlcnR5S2V5LCBWLyosIHJlY2VpdmVyKi8pe1xuICAgIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCA0ID8gdGFyZ2V0IDogYXJndW1lbnRzWzNdXG4gICAgICAsIG93bkRlc2MgID0gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSlcbiAgICAgICwgZXhpc3RpbmdEZXNjcmlwdG9yLCBwcm90bztcbiAgICBpZighb3duRGVzYyl7XG4gICAgICBpZihpc09iamVjdChwcm90byA9IGdldFByb3RvKHRhcmdldCkpKXtcbiAgICAgICAgcmV0dXJuIHNldChwcm90bywgcHJvcGVydHlLZXksIFYsIHJlY2VpdmVyKTtcbiAgICAgIH1cbiAgICAgIG93bkRlc2MgPSAkLmRlc2MoMCk7XG4gICAgfVxuICAgIGlmKCQuaGFzKG93bkRlc2MsICd2YWx1ZScpKXtcbiAgICAgIGlmKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlIHx8ICFpc09iamVjdChyZWNlaXZlcikpcmV0dXJuIGZhbHNlO1xuICAgICAgZXhpc3RpbmdEZXNjcmlwdG9yID0gJC5nZXREZXNjKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSkgfHwgJC5kZXNjKDApO1xuICAgICAgZXhpc3RpbmdEZXNjcmlwdG9yLnZhbHVlID0gVjtcbiAgICAgICQuc2V0RGVzYyhyZWNlaXZlciwgcHJvcGVydHlLZXksIGV4aXN0aW5nRGVzY3JpcHRvcik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG93bkRlc2Muc2V0ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IChvd25EZXNjLnNldC5jYWxsKHJlY2VpdmVyLCBWKSwgdHJ1ZSk7XG4gIH1cbn07XG4vLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcbmlmKHNldFByb3RvKXJlZmxlY3Quc2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKXtcbiAgc2V0UHJvdG8uY2hlY2sodGFyZ2V0LCBwcm90byk7XG4gIHRyeSB7XG4gICAgc2V0UHJvdG8uc2V0KHRhcmdldCwgcHJvdG8pO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuJGRlZigkZGVmLkcsIHtSZWZsZWN0OiB7fX0pO1xuXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqIGJ1Z2d5RW51bWVyYXRlLCAnUmVmbGVjdCcsIHtcbiAgLy8gMjYuMS41IFJlZmxlY3QuZW51bWVyYXRlKHRhcmdldClcbiAgZW51bWVyYXRlOiBmdW5jdGlvbiBlbnVtZXJhdGUodGFyZ2V0KXtcbiAgICByZXR1cm4gbmV3IEVudW1lcmF0ZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XG4gIH1cbn0pO1xuXG4kZGVmKCRkZWYuUywgJ1JlZmxlY3QnLCByZWZsZWN0KTsiLCJ2YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRSZWdFeHAgPSAkLmcuUmVnRXhwXG4gICwgQmFzZSAgICA9ICRSZWdFeHBcbiAgLCBwcm90byAgID0gJFJlZ0V4cC5wcm90b3R5cGVcbiAgLCByZSAgICAgID0gL2EvZ1xuICAvLyBcIm5ld1wiIGNyZWF0ZXMgYSBuZXcgb2JqZWN0XG4gICwgQ09SUkVDVF9ORVcgPSBuZXcgJFJlZ0V4cChyZSkgIT09IHJlXG4gIC8vIFJlZ0V4cCBhbGxvd3MgYSByZWdleCB3aXRoIGZsYWdzIGFzIHRoZSBwYXR0ZXJuXG4gICwgQUxMT1dTX1JFX1dJVEhfRkxBR1MgPSBmdW5jdGlvbigpe1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gJFJlZ0V4cChyZSwgJ2knKSA9PSAnL2EvaSc7XG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICB9KCk7XG5pZigkLkZXICYmICQuREVTQyl7XG4gIGlmKCFDT1JSRUNUX05FVyB8fCAhQUxMT1dTX1JFX1dJVEhfRkxBR1Mpe1xuICAgICRSZWdFeHAgPSBmdW5jdGlvbiBSZWdFeHAocGF0dGVybiwgZmxhZ3Mpe1xuICAgICAgdmFyIHBhdHRlcm5Jc1JlZ0V4cCAgPSBjb2YocGF0dGVybikgPT0gJ1JlZ0V4cCdcbiAgICAgICAgLCBmbGFnc0lzVW5kZWZpbmVkID0gZmxhZ3MgPT09IHVuZGVmaW5lZDtcbiAgICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mICRSZWdFeHApICYmIHBhdHRlcm5Jc1JlZ0V4cCAmJiBmbGFnc0lzVW5kZWZpbmVkKXJldHVybiBwYXR0ZXJuO1xuICAgICAgcmV0dXJuIENPUlJFQ1RfTkVXXG4gICAgICAgID8gbmV3IEJhc2UocGF0dGVybklzUmVnRXhwICYmICFmbGFnc0lzVW5kZWZpbmVkID8gcGF0dGVybi5zb3VyY2UgOiBwYXR0ZXJuLCBmbGFncylcbiAgICAgICAgOiBuZXcgQmFzZShwYXR0ZXJuSXNSZWdFeHAgPyBwYXR0ZXJuLnNvdXJjZSA6IHBhdHRlcm5cbiAgICAgICAgICAsIHBhdHRlcm5Jc1JlZ0V4cCAmJiBmbGFnc0lzVW5kZWZpbmVkID8gcGF0dGVybi5mbGFncyA6IGZsYWdzKTtcbiAgICB9O1xuICAgICQuZWFjaC5jYWxsKCQuZ2V0TmFtZXMoQmFzZSksIGZ1bmN0aW9uKGtleSl7XG4gICAgICBrZXkgaW4gJFJlZ0V4cCB8fCAkLnNldERlc2MoJFJlZ0V4cCwga2V5LCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gQmFzZVtrZXldOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGl0KXsgQmFzZVtrZXldID0gaXQ7IH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByb3RvLmNvbnN0cnVjdG9yID0gJFJlZ0V4cDtcbiAgICAkUmVnRXhwLnByb3RvdHlwZSA9IHByb3RvO1xuICAgIHJlcXVpcmUoJy4vJC5yZWRlZicpKCQuZywgJ1JlZ0V4cCcsICRSZWdFeHApO1xuICB9XG4gIC8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzKClcbiAgaWYoLy4vZy5mbGFncyAhPSAnZycpJC5zZXREZXNjKHByb3RvLCAnZmxhZ3MnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogcmVxdWlyZSgnLi8kLnJlcGxhY2VyJykoL14uKlxcLyhcXHcqKSQvLCAnJDEnKVxuICB9KTtcbn1cbnJlcXVpcmUoJy4vJC5zcGVjaWVzJykoJFJlZ0V4cCk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzWzBdKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkYXQgID0gcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKGZhbHNlKTtcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMyBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KHBvcylcbiAgY29kZVBvaW50QXQ6IGZ1bmN0aW9uIGNvZGVQb2ludEF0KHBvcyl7XG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCB0b0xlbmd0aCA9ICQudG9MZW5ndGg7XG5cbi8vIHNob3VsZCB0aHJvdyBlcnJvciBvbiByZWdleFxuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAhcmVxdWlyZSgnLi8kLnRocm93cycpKGZ1bmN0aW9uKCl7ICdxJy5lbmRzV2l0aCgvLi8pOyB9KSwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjYgU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aChzZWFyY2hTdHJpbmcgWywgZW5kUG9zaXRpb25dKVxuICBlbmRzV2l0aDogZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoU3RyaW5nIC8qLCBlbmRQb3NpdGlvbiA9IEBsZW5ndGggKi8pe1xuICAgIGlmKGNvZihzZWFyY2hTdHJpbmcpID09ICdSZWdFeHAnKXRocm93IFR5cGVFcnJvcigpO1xuICAgIHZhciB0aGF0ID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcbiAgICAgICwgZW5kUG9zaXRpb24gPSBhcmd1bWVudHNbMV1cbiAgICAgICwgbGVuID0gdG9MZW5ndGgodGhhdC5sZW5ndGgpXG4gICAgICAsIGVuZCA9IGVuZFBvc2l0aW9uID09PSB1bmRlZmluZWQgPyBsZW4gOiBNYXRoLm1pbih0b0xlbmd0aChlbmRQb3NpdGlvbiksIGxlbik7XG4gICAgc2VhcmNoU3RyaW5nICs9ICcnO1xuICAgIHJldHVybiB0aGF0LnNsaWNlKGVuZCAtIHNlYXJjaFN0cmluZy5sZW5ndGgsIGVuZCkgPT09IHNlYXJjaFN0cmluZztcbiAgfVxufSk7IiwidmFyICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCB0b0luZGV4ID0gcmVxdWlyZSgnLi8kJykudG9JbmRleFxuICAsIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGVcbiAgLCAkZnJvbUNvZGVQb2ludCA9IFN0cmluZy5mcm9tQ29kZVBvaW50O1xuXG4vLyBsZW5ndGggc2hvdWxkIGJlIDEsIG9sZCBGRiBwcm9ibGVtXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICghISRmcm9tQ29kZVBvaW50ICYmICRmcm9tQ29kZVBvaW50Lmxlbmd0aCAhPSAxKSwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcbiAgZnJvbUNvZGVQb2ludDogZnVuY3Rpb24gZnJvbUNvZGVQb2ludCh4KXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciByZXMgPSBbXVxuICAgICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIGkgICA9IDBcbiAgICAgICwgY29kZTtcbiAgICB3aGlsZShsZW4gPiBpKXtcbiAgICAgIGNvZGUgPSArYXJndW1lbnRzW2krK107XG4gICAgICBpZih0b0luZGV4KGNvZGUsIDB4MTBmZmZmKSAhPT0gY29kZSl0aHJvdyBSYW5nZUVycm9yKGNvZGUgKyAnIGlzIG5vdCBhIHZhbGlkIGNvZGUgcG9pbnQnKTtcbiAgICAgIHJlcy5wdXNoKGNvZGUgPCAweDEwMDAwXG4gICAgICAgID8gZnJvbUNoYXJDb2RlKGNvZGUpXG4gICAgICAgIDogZnJvbUNoYXJDb2RlKCgoY29kZSAtPSAweDEwMDAwKSA+PiAxMCkgKyAweGQ4MDAsIGNvZGUgJSAweDQwMCArIDB4ZGMwMClcbiAgICAgICk7XG4gICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5cbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuNyBTdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzKHNlYXJjaFN0cmluZywgcG9zaXRpb24gPSAwKVxuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xuICAgIGlmKGNvZihzZWFyY2hTdHJpbmcpID09ICdSZWdFeHAnKXRocm93IFR5cGVFcnJvcigpO1xuICAgIHJldHVybiAhIX5TdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKS5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7IiwidmFyIHNldCAgID0gcmVxdWlyZSgnLi8kJykuc2V0XG4gICwgJGF0ICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSlcbiAgLCBJVEVSICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcbiAgLCAkaXRlciA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBzdGVwICA9ICRpdGVyLnN0ZXA7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgc2V0KHRoaXMsIElURVIsIHtvOiBTdHJpbmcoaXRlcmF0ZWQpLCBpOiAwfSk7XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXG4gICAgLCBPICAgICA9IGl0ZXIub1xuICAgICwgaW5kZXggPSBpdGVyLmlcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4gc3RlcCgxKTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICBpdGVyLmkgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4gc3RlcCgwLCBwb2ludCk7XG59KTsiLCJ2YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcblxuJGRlZigkZGVmLlMsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMi40IFN0cmluZy5yYXcoY2FsbFNpdGUsIC4uLnN1YnN0aXR1dGlvbnMpXG4gIHJhdzogZnVuY3Rpb24gcmF3KGNhbGxTaXRlKXtcbiAgICB2YXIgdHBsID0gJC50b09iamVjdChjYWxsU2l0ZS5yYXcpXG4gICAgICAsIGxlbiA9ICQudG9MZW5ndGgodHBsLmxlbmd0aClcbiAgICAgICwgc2xuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCByZXMgPSBbXVxuICAgICAgLCBpICAgPSAwO1xuICAgIHdoaWxlKGxlbiA+IGkpe1xuICAgICAgcmVzLnB1c2goU3RyaW5nKHRwbFtpKytdKSk7XG4gICAgICBpZihpIDwgc2xuKXJlcy5wdXNoKFN0cmluZyhhcmd1bWVudHNbaV0pKTtcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XG4gIH1cbn0pOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjEzIFN0cmluZy5wcm90b3R5cGUucmVwZWF0KGNvdW50KVxuICByZXBlYXQ6IHJlcXVpcmUoJy4vJC5zdHJpbmctcmVwZWF0Jylcbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcblxuLy8gc2hvdWxkIHRocm93IGVycm9yIG9uIHJlZ2V4XG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQudGhyb3dzJykoZnVuY3Rpb24oKXsgJ3EnLnN0YXJ0c1dpdGgoLy4vKTsgfSksICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4xOCBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIFssIHBvc2l0aW9uIF0pXG4gIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xuICAgIGlmKGNvZihzZWFyY2hTdHJpbmcpID09ICdSZWdFeHAnKXRocm93IFR5cGVFcnJvcigpO1xuICAgIHZhciB0aGF0ICA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXG4gICAgICAsIGluZGV4ID0gJC50b0xlbmd0aChNYXRoLm1pbihhcmd1bWVudHNbMV0sIHRoYXQubGVuZ3RoKSk7XG4gICAgc2VhcmNoU3RyaW5nICs9ICcnO1xuICAgIHJldHVybiB0aGF0LnNsaWNlKGluZGV4LCBpbmRleCArIHNlYXJjaFN0cmluZy5sZW5ndGgpID09PSBzZWFyY2hTdHJpbmc7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgc2V0VGFnICAgPSByZXF1aXJlKCcuLyQuY29mJykuc2V0XG4gICwgdWlkICAgICAgPSByZXF1aXJlKCcuLyQudWlkJylcbiAgLCBzaGFyZWQgICA9IHJlcXVpcmUoJy4vJC5zaGFyZWQnKVxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJHJlZGVmICAgPSByZXF1aXJlKCcuLyQucmVkZWYnKVxuICAsIGtleU9mICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcbiAgLCBlbnVtS2V5cyA9IHJlcXVpcmUoJy4vJC5lbnVtLWtleXMnKVxuICAsIGFzc2VydE9iamVjdCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmpcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGVcbiAgLCBERVNDICAgICA9ICQuREVTQ1xuICAsIGhhcyAgICAgID0gJC5oYXNcbiAgLCAkY3JlYXRlICA9ICQuY3JlYXRlXG4gICwgZ2V0RGVzYyAgPSAkLmdldERlc2NcbiAgLCBzZXREZXNjICA9ICQuc2V0RGVzY1xuICAsIGRlc2MgICAgID0gJC5kZXNjXG4gICwgJG5hbWVzICAgPSByZXF1aXJlKCcuLyQuZ2V0LW5hbWVzJylcbiAgLCBnZXROYW1lcyA9ICRuYW1lcy5nZXRcbiAgLCB0b09iamVjdCA9ICQudG9PYmplY3RcbiAgLCAkU3ltYm9sICA9ICQuZy5TeW1ib2xcbiAgLCBzZXR0ZXIgICA9IGZhbHNlXG4gICwgVEFHICAgICAgPSB1aWQoJ3RhZycpXG4gICwgSElEREVOICAgPSB1aWQoJ2hpZGRlbicpXG4gICwgX3Byb3BlcnR5SXNFbnVtZXJhYmxlID0ge30ucHJvcGVydHlJc0VudW1lcmFibGVcbiAgLCBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5JylcbiAgLCBBbGxTeW1ib2xzID0gc2hhcmVkKCdzeW1ib2xzJylcbiAgLCB1c2VOYXRpdmUgPSAkLmlzRnVuY3Rpb24oJFN5bWJvbCk7XG5cbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQyA/IGZ1bmN0aW9uKCl7IC8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZFxuICB0cnkge1xuICAgIHJldHVybiAkY3JlYXRlKHNldERlc2Moe30sIEhJRERFTiwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gc2V0RGVzYyh0aGlzLCBISURERU4sIHt2YWx1ZTogZmFsc2V9KVtISURERU5dO1xuICAgICAgfVxuICAgIH0pKVtISURERU5dIHx8IHNldERlc2M7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICAgICAgdmFyIHByb3RvRGVzYyA9IGdldERlc2MoT2JqZWN0UHJvdG8sIGtleSk7XG4gICAgICBpZihwcm90b0Rlc2MpZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gICAgICBzZXREZXNjKGl0LCBrZXksIEQpO1xuICAgICAgaWYocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bylzZXREZXNjKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG4gICAgfTtcbiAgfVxufSgpIDogc2V0RGVzYztcblxuZnVuY3Rpb24gd3JhcCh0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gJC5zZXQoJGNyZWF0ZSgkU3ltYm9sLnByb3RvdHlwZSksIFRBRywgdGFnKTtcbiAgREVTQyAmJiBzZXR0ZXIgJiYgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGRlc2MoMSwgdmFsdWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3ltO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSl7XG4gICAgaWYoIUQuZW51bWVyYWJsZSl7XG4gICAgICBpZighaGFzKGl0LCBISURERU4pKXNldERlc2MoaXQsIEhJRERFTiwgZGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSAkY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBkZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIHNldERlc2MoaXQsIGtleSwgRCk7XG59XG5mdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYXNzZXJ0T2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9PYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKWRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyAkY3JlYXRlKGl0KSA6IGRlZmluZVByb3BlcnRpZXMoJGNyZWF0ZShpdCksIFApO1xufVxuZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBfcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0aGlzLCBrZXkpO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldXG4gICAgPyBFIDogdHJ1ZTtcbn1cbmZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgdmFyIEQgPSBnZXREZXNjKGl0ID0gdG9PYmplY3QoaXQpLCBrZXkpO1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59XG5mdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOKXJlc3VsdC5wdXNoKGtleSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZighdXNlTmF0aXZlKXtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpe1xuICAgIGlmKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG4gICAgcmV0dXJuIHdyYXAodWlkKGFyZ3VtZW50c1swXSkpO1xuICB9O1xuICAkcmVkZWYoJFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXNbVEFHXTtcbiAgfSk7XG5cbiAgJC5jcmVhdGUgICAgID0gY3JlYXRlO1xuICAkLnNldERlc2MgICAgPSBkZWZpbmVQcm9wZXJ0eTtcbiAgJC5nZXREZXNjICAgID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkLnNldERlc2NzICAgPSBkZWZpbmVQcm9wZXJ0aWVzO1xuICAkLmdldE5hbWVzICAgPSAkbmFtZXMuZ2V0ID0gZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgJC5nZXRTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmKCQuREVTQyAmJiAkLkZXKSRyZWRlZihPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xufVxuXG52YXIgc3ltYm9sU3RhdGljcyA9IHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICByZXR1cm4ga2V5T2YoU3ltYm9sUmVnaXN0cnksIGtleSk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufTtcbi8vIDE5LjQuMi4yIFN5bWJvbC5oYXNJbnN0YW5jZVxuLy8gMTkuNC4yLjMgU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZVxuLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXG4vLyAxOS40LjIuNiBTeW1ib2wubWF0Y2hcbi8vIDE5LjQuMi44IFN5bWJvbC5yZXBsYWNlXG4vLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXG4vLyAxOS40LjIuMTAgU3ltYm9sLnNwZWNpZXNcbi8vIDE5LjQuMi4xMSBTeW1ib2wuc3BsaXRcbi8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcbi8vIDE5LjQuMi4xMyBTeW1ib2wudG9TdHJpbmdUYWdcbi8vIDE5LjQuMi4xNCBTeW1ib2wudW5zY29wYWJsZXNcbiQuZWFjaC5jYWxsKChcbiAgICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLCcgK1xuICAgICdzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGl0KXtcbiAgICB2YXIgc3ltID0gcmVxdWlyZSgnLi8kLndrcycpKGl0KTtcbiAgICBzeW1ib2xTdGF0aWNzW2l0XSA9IHVzZU5hdGl2ZSA/IHN5bSA6IHdyYXAoc3ltKTtcbiAgfVxuKTtcblxuc2V0dGVyID0gdHJ1ZTtcblxuJGRlZigkZGVmLkcgKyAkZGVmLlcsIHtTeW1ib2w6ICRTeW1ib2x9KTtcblxuJGRlZigkZGVmLlMsICdTeW1ib2wnLCBzeW1ib2xTdGF0aWNzKTtcblxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6IGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiBkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiBnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRhZygkLmcuSlNPTiwgJ0pTT04nLCB0cnVlKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCB3ZWFrICAgICAgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi13ZWFrJylcbiAgLCBsZWFrU3RvcmUgPSB3ZWFrLmxlYWtTdG9yZVxuICAsIElEICAgICAgICA9IHdlYWsuSURcbiAgLCBXRUFLICAgICAgPSB3ZWFrLldFQUtcbiAgLCBoYXMgICAgICAgPSAkLmhhc1xuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgdG1wICAgICAgID0ge307XG5cbi8vIDIzLjMgV2Vha01hcCBPYmplY3RzXG52YXIgJFdlYWtNYXAgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdXZWFrTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFdlYWtNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHNbMF0pOyB9O1xufSwge1xuICAvLyAyMy4zLjMuMyBXZWFrTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIGlmKGlzT2JqZWN0KGtleSkpe1xuICAgICAgaWYoIWlzRXh0ZW5zaWJsZShrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuZ2V0KGtleSk7XG4gICAgICBpZihoYXMoa2V5LCBXRUFLKSlyZXR1cm4ga2V5W1dFQUtdW3RoaXNbSURdXTtcbiAgICB9XG4gIH0sXG4gIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHdlYWssIHRydWUsIHRydWUpO1xuXG4vLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XG5pZihuZXcgJFdlYWtNYXAoKS5zZXQoKE9iamVjdC5mcmVlemUgfHwgT2JqZWN0KSh0bXApLCA3KS5nZXQodG1wKSAhPSA3KXtcbiAgJC5lYWNoLmNhbGwoWydkZWxldGUnLCAnaGFzJywgJ2dldCcsICdzZXQnXSwgZnVuY3Rpb24oa2V5KXtcbiAgICB2YXIgcHJvdG8gID0gJFdlYWtNYXAucHJvdG90eXBlXG4gICAgICAsIG1ldGhvZCA9IHByb3RvW2tleV07XG4gICAgcmVxdWlyZSgnLi8kLnJlZGVmJykocHJvdG8sIGtleSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAvLyBzdG9yZSBmcm96ZW4gb2JqZWN0cyBvbiBsZWFreSBtYXBcbiAgICAgIGlmKGlzT2JqZWN0KGEpICYmICFpc0V4dGVuc2libGUoYSkpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gbGVha1N0b3JlKHRoaXMpW2tleV0oYSwgYik7XG4gICAgICAgIHJldHVybiBrZXkgPT0gJ3NldCcgPyB0aGlzIDogcmVzdWx0O1xuICAgICAgLy8gc3RvcmUgYWxsIHRoZSByZXN0IG9uIG5hdGl2ZSB3ZWFrbWFwXG4gICAgICB9IHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBhLCBiKTtcbiAgICB9KTtcbiAgfSk7XG59IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHdlYWsgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi13ZWFrJyk7XG5cbi8vIDIzLjQgV2Vha1NldCBPYmplY3RzXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdXZWFrU2V0JywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFdlYWtTZXQoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHNbMF0pOyB9O1xufSwge1xuICAvLyAyMy40LjMuMSBXZWFrU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKXtcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywgdmFsdWUsIHRydWUpO1xuICB9XG59LCB3ZWFrLCBmYWxzZSwgdHJ1ZSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWYgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRpbmNsdWRlcyA9IHJlcXVpcmUoJy4vJC5hcnJheS1pbmNsdWRlcycpKHRydWUpO1xuJGRlZigkZGVmLlAsICdBcnJheScsIHtcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvbWVuaWMvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XG4gICAgcmV0dXJuICRpbmNsdWRlcyh0aGlzLCBlbCwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdpbmNsdWRlcycpOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJyk7IiwiLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vV2ViUmVmbGVjdGlvbi85MzUzNzgxXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIG93bktleXMgPSByZXF1aXJlKCcuLyQub3duLWtleXMnKTtcblxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnM6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqZWN0KXtcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXG4gICAgICAsIHJlc3VsdCA9IHt9O1xuICAgICQuZWFjaC5jYWxsKG93bktleXMoTyksIGZ1bmN0aW9uKGtleSl7XG4gICAgICAkLnNldERlc2MocmVzdWx0LCBrZXksICQuZGVzYygwLCAkLmdldERlc2MoTywga2V5KSkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsIi8vIGh0dHA6Ly9nb28uZ2wvWGtCcmpEXG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdFRvQXJyYXkoaXNFbnRyaWVzKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxuICAgICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaSAgICAgID0gMFxuICAgICAgLCByZXN1bHQgPSBBcnJheShsZW5ndGgpXG4gICAgICAsIGtleTtcbiAgICBpZihpc0VudHJpZXMpd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBba2V5ID0ga2V5c1tpKytdLCBPW2tleV1dO1xuICAgIGVsc2Ugd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBPW2tleXNbaSsrXV07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge1xuICB2YWx1ZXM6ICBjcmVhdGVPYmplY3RUb0FycmF5KGZhbHNlKSxcbiAgZW50cmllczogY3JlYXRlT2JqZWN0VG9BcnJheSh0cnVlKVxufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2JlbmphbWluZ3IvUmV4RXhwLmVzY2FwZVxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ1JlZ0V4cCcsIHtcbiAgZXNjYXBlOiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvW1xcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnLCB0cnVlKVxufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdTZXQnKTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4ndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcbiAgYXQ6IGZ1bmN0aW9uIGF0KHBvcyl7XG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRwYWQgPSByZXF1aXJlKCcuLyQuc3RyaW5nLXBhZCcpO1xuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIGxwYWQ6IGZ1bmN0aW9uIGxwYWQobil7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbiwgYXJndW1lbnRzWzFdLCB0cnVlKTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcGFkID0gcmVxdWlyZSgnLi8kLnN0cmluZy1wYWQnKTtcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICBycGFkOiBmdW5jdGlvbiBycGFkKG4pe1xuICAgIHJldHVybiAkcGFkKHRoaXMsIG4sIGFyZ3VtZW50c1sxXSwgZmFsc2UpO1xuICB9XG59KTsiLCIvLyBKYXZhU2NyaXB0IDEuNiAvIFN0cmF3bWFuIGFycmF5IHN0YXRpY3Mgc2hpbVxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkQXJyYXkgID0gJC5jb3JlLkFycmF5IHx8IEFycmF5XG4gICwgc3RhdGljcyA9IHt9O1xuZnVuY3Rpb24gc2V0U3RhdGljcyhrZXlzLCBsZW5ndGgpe1xuICAkLmVhY2guY2FsbChrZXlzLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XG4gICAgaWYobGVuZ3RoID09IHVuZGVmaW5lZCAmJiBrZXkgaW4gJEFycmF5KXN0YXRpY3Nba2V5XSA9ICRBcnJheVtrZXldO1xuICAgIGVsc2UgaWYoa2V5IGluIFtdKXN0YXRpY3Nba2V5XSA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBbXVtrZXldLCBsZW5ndGgpO1xuICB9KTtcbn1cbnNldFN0YXRpY3MoJ3BvcCxyZXZlcnNlLHNoaWZ0LGtleXMsdmFsdWVzLGVudHJpZXMnLCAxKTtcbnNldFN0YXRpY3MoJ2luZGV4T2YsZXZlcnksc29tZSxmb3JFYWNoLG1hcCxmaWx0ZXIsZmluZCxmaW5kSW5kZXgsaW5jbHVkZXMnLCAzKTtcbnNldFN0YXRpY3MoJ2pvaW4sc2xpY2UsY29uY2F0LHB1c2gsc3BsaWNlLHVuc2hpZnQsc29ydCxsYXN0SW5kZXhPZiwnICtcbiAgICAgICAgICAgJ3JlZHVjZSxyZWR1Y2VSaWdodCxjb3B5V2l0aGluLGZpbGwsdHVybicpO1xuJGRlZigkZGVmLlMsICdBcnJheScsIHN0YXRpY3MpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIEl0ZXJhdG9ycyAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5JdGVyYXRvcnNcbiAgLCBJVEVSQVRPUiAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5XG4gICwgTkwgICAgICAgICAgPSAkLmcuTm9kZUxpc3RcbiAgLCBIVEMgICAgICAgICA9ICQuZy5IVE1MQ29sbGVjdGlvblxuICAsIE5MUHJvdG8gICAgID0gTkwgJiYgTkwucHJvdG90eXBlXG4gICwgSFRDUHJvdG8gICAgPSBIVEMgJiYgSFRDLnByb3RvdHlwZTtcbmlmKCQuRlcpe1xuICBpZihOTCAmJiAhKElURVJBVE9SIGluIE5MUHJvdG8pKSQuaGlkZShOTFByb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICBpZihIVEMgJiYgIShJVEVSQVRPUiBpbiBIVENQcm90bykpJC5oaWRlKEhUQ1Byb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xufVxuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gQXJyYXlWYWx1ZXM7IiwidmFyICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJHRhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpO1xuJGRlZigkZGVmLkcgKyAkZGVmLkIsIHtcbiAgc2V0SW1tZWRpYXRlOiAgICR0YXNrLnNldCxcbiAgY2xlYXJJbW1lZGlhdGU6ICR0YXNrLmNsZWFyXG59KTsiLCIvLyBpZTktIHNldFRpbWVvdXQgJiBzZXRJbnRlcnZhbCBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgZml4XG52YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBpbnZva2UgICAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcbiAgLCBwYXJ0aWFsICAgPSByZXF1aXJlKCcuLyQucGFydGlhbCcpXG4gICwgbmF2aWdhdG9yID0gJC5nLm5hdmlnYXRvclxuICAsIE1TSUUgICAgICA9ICEhbmF2aWdhdG9yICYmIC9NU0lFIC5cXC4vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8vIDwtIGRpcnR5IGllOS0gY2hlY2tcbmZ1bmN0aW9uIHdyYXAoc2V0KXtcbiAgcmV0dXJuIE1TSUUgPyBmdW5jdGlvbihmbiwgdGltZSAvKiwgLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIHNldChpbnZva2UoXG4gICAgICBwYXJ0aWFsLFxuICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgICAgJC5pc0Z1bmN0aW9uKGZuKSA/IGZuIDogRnVuY3Rpb24oZm4pXG4gICAgKSwgdGltZSk7XG4gIH0gOiBzZXQ7XG59XG4kZGVmKCRkZWYuRyArICRkZWYuQiArICRkZWYuRiAqIE1TSUUsIHtcbiAgc2V0VGltZW91dDogIHdyYXAoJC5nLnNldFRpbWVvdXQpLFxuICBzZXRJbnRlcnZhbDogd3JhcCgkLmcuc2V0SW50ZXJ2YWwpXG59KTsiLCJyZXF1aXJlKCcuL21vZHVsZXMvZXM1Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5pcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5zdGF0aWNzLWFjY2VwdC1wcmltaXRpdmVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuZnVuY3Rpb24uaGFzLWluc3RhbmNlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5jb25zdHJ1Y3RvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuc3RhdGljcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5mcm9tLWNvZGUtcG9pbnQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnJhdycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmNvZGUtcG9pbnQtYXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmVuZHMtd2l0aCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5vZicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5zcGVjaWVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbGwnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmluZCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZ2V4cCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zZXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYud2Vhay1tYXAnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYud2Vhay1zZXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5hcnJheS5pbmNsdWRlcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcuYXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLmxwYWQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLnJwYWQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcucmVnZXhwLmVzY2FwZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5vYmplY3QudG8tYXJyYXknKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc2V0LnRvLWpzb24nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9qcy5hcnJheS5zdGF0aWNzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLnRpbWVycycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5pbW1lZGlhdGUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbW9kdWxlcy8kJykuY29yZTtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBnbC1tYXRyaXggLSBIaWdoIHBlcmZvcm1hbmNlIG1hdHJpeCBhbmQgdmVjdG9yIG9wZXJhdGlvbnNcbiAqIEBhdXRob3IgQnJhbmRvbiBKb25lc1xuICogQGF1dGhvciBDb2xpbiBNYWNLZW56aWUgSVZcbiAqIEB2ZXJzaW9uIDIuMy4wXG4gKi9cblxuLyogQ29weXJpZ2h0IChjKSAyMDE1LCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cbi8vIEVORCBIRUFERVJcblxuZXhwb3J0cy5nbE1hdHJpeCA9IHJlcXVpcmUoXCIuL2dsLW1hdHJpeC9jb21tb24uanNcIik7XG5leHBvcnRzLm1hdDIgPSByZXF1aXJlKFwiLi9nbC1tYXRyaXgvbWF0Mi5qc1wiKTtcbmV4cG9ydHMubWF0MmQgPSByZXF1aXJlKFwiLi9nbC1tYXRyaXgvbWF0MmQuanNcIik7XG5leHBvcnRzLm1hdDMgPSByZXF1aXJlKFwiLi9nbC1tYXRyaXgvbWF0My5qc1wiKTtcbmV4cG9ydHMubWF0NCA9IHJlcXVpcmUoXCIuL2dsLW1hdHJpeC9tYXQ0LmpzXCIpO1xuZXhwb3J0cy5xdWF0ID0gcmVxdWlyZShcIi4vZ2wtbWF0cml4L3F1YXQuanNcIik7XG5leHBvcnRzLnZlYzIgPSByZXF1aXJlKFwiLi9nbC1tYXRyaXgvdmVjMi5qc1wiKTtcbmV4cG9ydHMudmVjMyA9IHJlcXVpcmUoXCIuL2dsLW1hdHJpeC92ZWMzLmpzXCIpO1xuZXhwb3J0cy52ZWM0ID0gcmVxdWlyZShcIi4vZ2wtbWF0cml4L3ZlYzQuanNcIik7IiwiLyogQ29weXJpZ2h0IChjKSAyMDE1LCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cblxuLyoqXG4gKiBAY2xhc3MgQ29tbW9uIHV0aWxpdGllc1xuICogQG5hbWUgZ2xNYXRyaXhcbiAqL1xudmFyIGdsTWF0cml4ID0ge307XG5cbi8vIENvbnN0YW50c1xuZ2xNYXRyaXguRVBTSUxPTiA9IDAuMDAwMDAxO1xuZ2xNYXRyaXguQVJSQVlfVFlQRSA9ICh0eXBlb2YgRmxvYXQzMkFycmF5ICE9PSAndW5kZWZpbmVkJykgPyBGbG9hdDMyQXJyYXkgOiBBcnJheTtcbmdsTWF0cml4LlJBTkRPTSA9IE1hdGgucmFuZG9tO1xuXG4vKipcbiAqIFNldHMgdGhlIHR5cGUgb2YgYXJyYXkgdXNlZCB3aGVuIGNyZWF0aW5nIG5ldyB2ZWN0b3JzIGFuZCBtYXRyaWNlc1xuICpcbiAqIEBwYXJhbSB7VHlwZX0gdHlwZSBBcnJheSB0eXBlLCBzdWNoIGFzIEZsb2F0MzJBcnJheSBvciBBcnJheVxuICovXG5nbE1hdHJpeC5zZXRNYXRyaXhBcnJheVR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgR0xNQVRfQVJSQVlfVFlQRSA9IHR5cGU7XG59XG5cbnZhciBkZWdyZWUgPSBNYXRoLlBJIC8gMTgwO1xuXG4vKipcbiogQ29udmVydCBEZWdyZWUgVG8gUmFkaWFuXG4qXG4qIEBwYXJhbSB7TnVtYmVyfSBBbmdsZSBpbiBEZWdyZWVzXG4qL1xuZ2xNYXRyaXgudG9SYWRpYW4gPSBmdW5jdGlvbihhKXtcbiAgICAgcmV0dXJuIGEgKiBkZWdyZWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xNYXRyaXg7XG4iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuXG52YXIgZ2xNYXRyaXggPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG5cbi8qKlxuICogQGNsYXNzIDJ4MiBNYXRyaXhcbiAqIEBuYW1lIG1hdDJcbiAqL1xudmFyIG1hdDIgPSB7fTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGlkZW50aXR5IG1hdDJcbiAqXG4gKiBAcmV0dXJucyB7bWF0Mn0gYSBuZXcgMngyIG1hdHJpeFxuICovXG5tYXQyLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSg0KTtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0MiBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gYSBtYXRyaXggdG8gY2xvbmVcbiAqIEByZXR1cm5zIHttYXQyfSBhIG5ldyAyeDIgbWF0cml4XG4gKi9cbm1hdDIuY2xvbmUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIG1hdDIgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5jb3B5ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgYSBtYXQyIHRvIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHJldHVybnMge21hdDJ9IG91dFxuICovXG5tYXQyLmlkZW50aXR5ID0gZnVuY3Rpb24ob3V0KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDJcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIudHJhbnNwb3NlID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgLy8gSWYgd2UgYXJlIHRyYW5zcG9zaW5nIG91cnNlbHZlcyB3ZSBjYW4gc2tpcCBhIGZldyBzdGVwcyBidXQgaGF2ZSB0byBjYWNoZSBzb21lIHZhbHVlc1xuICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgdmFyIGExID0gYVsxXTtcbiAgICAgICAgb3V0WzFdID0gYVsyXTtcbiAgICAgICAgb3V0WzJdID0gYTE7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3V0WzBdID0gYVswXTtcbiAgICAgICAgb3V0WzFdID0gYVsyXTtcbiAgICAgICAgb3V0WzJdID0gYVsxXTtcbiAgICAgICAgb3V0WzNdID0gYVszXTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogSW52ZXJ0cyBhIG1hdDJcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIuaW52ZXJ0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSxcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIGRldCA9IGEwICogYTMgLSBhMiAqIGExO1xuXG4gICAgaWYgKCFkZXQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGRldCA9IDEuMCAvIGRldDtcbiAgICBcbiAgICBvdXRbMF0gPSAgYTMgKiBkZXQ7XG4gICAgb3V0WzFdID0gLWExICogZGV0O1xuICAgIG91dFsyXSA9IC1hMiAqIGRldDtcbiAgICBvdXRbM10gPSAgYTAgKiBkZXQ7XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdDJcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIuYWRqb2ludCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIC8vIENhY2hpbmcgdGhpcyB2YWx1ZSBpcyBuZXNzZWNhcnkgaWYgb3V0ID09IGFcbiAgICB2YXIgYTAgPSBhWzBdO1xuICAgIG91dFswXSA9ICBhWzNdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIG91dFsyXSA9IC1hWzJdO1xuICAgIG91dFszXSA9ICBhMDtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICovXG5tYXQyLmRldGVybWluYW50ID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gYVswXSAqIGFbM10gLSBhWzJdICogYVsxXTtcbn07XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gbWF0MidzXG4gKlxuICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0Mn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHttYXQyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge21hdDJ9IG91dFxuICovXG5tYXQyLm11bHRpcGx5ID0gZnVuY3Rpb24gKG91dCwgYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM107XG4gICAgdmFyIGIwID0gYlswXSwgYjEgPSBiWzFdLCBiMiA9IGJbMl0sIGIzID0gYlszXTtcbiAgICBvdXRbMF0gPSBhMCAqIGIwICsgYTIgKiBiMTtcbiAgICBvdXRbMV0gPSBhMSAqIGIwICsgYTMgKiBiMTtcbiAgICBvdXRbMl0gPSBhMCAqIGIyICsgYTIgKiBiMztcbiAgICBvdXRbM10gPSBhMSAqIGIyICsgYTMgKiBiMztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDIubXVsdGlwbHl9XG4gKiBAZnVuY3Rpb25cbiAqL1xubWF0Mi5tdWwgPSBtYXQyLm11bHRpcGx5O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXQyIGJ5IHRoZSBnaXZlbiBhbmdsZVxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIucm90YXRlID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSxcbiAgICAgICAgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGEwICogIGMgKyBhMiAqIHM7XG4gICAgb3V0WzFdID0gYTEgKiAgYyArIGEzICogcztcbiAgICBvdXRbMl0gPSBhMCAqIC1zICsgYTIgKiBjO1xuICAgIG91dFszXSA9IGExICogLXMgKyBhMyAqIGM7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2NhbGVzIHRoZSBtYXQyIGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMyXG4gKlxuICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0Mn0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHt2ZWMyfSB2IHRoZSB2ZWMyIHRvIHNjYWxlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqKi9cbm1hdDIuc2NhbGUgPSBmdW5jdGlvbihvdXQsIGEsIHYpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLFxuICAgICAgICB2MCA9IHZbMF0sIHYxID0gdlsxXTtcbiAgICBvdXRbMF0gPSBhMCAqIHYwO1xuICAgIG91dFsxXSA9IGExICogdjA7XG4gICAgb3V0WzJdID0gYTIgKiB2MTtcbiAgICBvdXRbM10gPSBhMyAqIHYxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIGdpdmVuIGFuZ2xlXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0Mi5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQyLnJvdGF0ZShkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IG1hdDIgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIuZnJvbVJvdGF0aW9uID0gZnVuY3Rpb24ob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGM7XG4gICAgb3V0WzFdID0gcztcbiAgICBvdXRbMl0gPSAtcztcbiAgICBvdXRbM10gPSBjO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHNjYWxpbmdcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQyLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDIuc2NhbGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCBtYXQyIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3ZlYzJ9IHYgU2NhbGluZyB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5mcm9tU2NhbGluZyA9IGZ1bmN0aW9uKG91dCwgdikge1xuICAgIG91dFswXSA9IHZbMF07XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IHZbMV07XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gbWF0IG1hdHJpeCB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gKi9cbm1hdDIuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ21hdDIoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIGFbM10gKyAnKSc7XG59O1xuXG4vKipcbiAqIFJldHVybnMgRnJvYmVuaXVzIG5vcm0gb2YgYSBtYXQyXG4gKlxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBGcm9iZW5pdXMgbm9ybVxuICovXG5tYXQyLmZyb2IgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybihNYXRoLnNxcnQoTWF0aC5wb3coYVswXSwgMikgKyBNYXRoLnBvdyhhWzFdLCAyKSArIE1hdGgucG93KGFbMl0sIDIpICsgTWF0aC5wb3coYVszXSwgMikpKVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIEwsIEQgYW5kIFUgbWF0cmljZXMgKExvd2VyIHRyaWFuZ3VsYXIsIERpYWdvbmFsIGFuZCBVcHBlciB0cmlhbmd1bGFyKSBieSBmYWN0b3JpemluZyB0aGUgaW5wdXQgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IEwgdGhlIGxvd2VyIHRyaWFuZ3VsYXIgbWF0cml4IFxuICogQHBhcmFtIHttYXQyfSBEIHRoZSBkaWFnb25hbCBtYXRyaXggXG4gKiBAcGFyYW0ge21hdDJ9IFUgdGhlIHVwcGVyIHRyaWFuZ3VsYXIgbWF0cml4IFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBpbnB1dCBtYXRyaXggdG8gZmFjdG9yaXplXG4gKi9cblxubWF0Mi5MRFUgPSBmdW5jdGlvbiAoTCwgRCwgVSwgYSkgeyBcbiAgICBMWzJdID0gYVsyXS9hWzBdOyBcbiAgICBVWzBdID0gYVswXTsgXG4gICAgVVsxXSA9IGFbMV07IFxuICAgIFVbM10gPSBhWzNdIC0gTFsyXSAqIFVbMV07IFxuICAgIHJldHVybiBbTCwgRCwgVV07ICAgICAgIFxufTsgXG5cblxubW9kdWxlLmV4cG9ydHMgPSBtYXQyO1xuIiwiLyogQ29weXJpZ2h0IChjKSAyMDE1LCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cblxudmFyIGdsTWF0cml4ID0gcmVxdWlyZShcIi4vY29tbW9uLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyAyeDMgTWF0cml4XG4gKiBAbmFtZSBtYXQyZFxuICogXG4gKiBAZGVzY3JpcHRpb24gXG4gKiBBIG1hdDJkIGNvbnRhaW5zIHNpeCBlbGVtZW50cyBkZWZpbmVkIGFzOlxuICogPHByZT5cbiAqIFthLCBjLCB0eCxcbiAqICBiLCBkLCB0eV1cbiAqIDwvcHJlPlxuICogVGhpcyBpcyBhIHNob3J0IGZvcm0gZm9yIHRoZSAzeDMgbWF0cml4OlxuICogPHByZT5cbiAqIFthLCBjLCB0eCxcbiAqICBiLCBkLCB0eSxcbiAqICAwLCAwLCAxXVxuICogPC9wcmU+XG4gKiBUaGUgbGFzdCByb3cgaXMgaWdub3JlZCBzbyB0aGUgYXJyYXkgaXMgc2hvcnRlciBhbmQgb3BlcmF0aW9ucyBhcmUgZmFzdGVyLlxuICovXG52YXIgbWF0MmQgPSB7fTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGlkZW50aXR5IG1hdDJkXG4gKlxuICogQHJldHVybnMge21hdDJkfSBhIG5ldyAyeDMgbWF0cml4XG4gKi9cbm1hdDJkLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSg2KTtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG1hdDJkIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQyZH0gYSBtYXRyaXggdG8gY2xvbmVcbiAqIEByZXR1cm5zIHttYXQyZH0gYSBuZXcgMngzIG1hdHJpeFxuICovXG5tYXQyZC5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoNik7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICBvdXRbNF0gPSBhWzRdO1xuICAgIG91dFs1XSA9IGFbNV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIG1hdDJkIHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKi9cbm1hdDJkLmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgYSBtYXQyZCB0byB0aGUgaWRlbnRpdHkgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICovXG5tYXQyZC5pZGVudGl0eSA9IGZ1bmN0aW9uKG91dCkge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEludmVydHMgYSBtYXQyZFxuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqL1xubWF0MmQuaW52ZXJ0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIGFhID0gYVswXSwgYWIgPSBhWzFdLCBhYyA9IGFbMl0sIGFkID0gYVszXSxcbiAgICAgICAgYXR4ID0gYVs0XSwgYXR5ID0gYVs1XTtcblxuICAgIHZhciBkZXQgPSBhYSAqIGFkIC0gYWIgKiBhYztcbiAgICBpZighZGV0KXtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgIG91dFswXSA9IGFkICogZGV0O1xuICAgIG91dFsxXSA9IC1hYiAqIGRldDtcbiAgICBvdXRbMl0gPSAtYWMgKiBkZXQ7XG4gICAgb3V0WzNdID0gYWEgKiBkZXQ7XG4gICAgb3V0WzRdID0gKGFjICogYXR5IC0gYWQgKiBhdHgpICogZGV0O1xuICAgIG91dFs1XSA9IChhYiAqIGF0eCAtIGFhICogYXR5KSAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdDJkXG4gKlxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICovXG5tYXQyZC5kZXRlcm1pbmFudCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBhWzNdIC0gYVsxXSAqIGFbMl07XG59O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIG1hdDJkJ3NcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7bWF0MmR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICovXG5tYXQyZC5tdWx0aXBseSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLCBhNCA9IGFbNF0sIGE1ID0gYVs1XSxcbiAgICAgICAgYjAgPSBiWzBdLCBiMSA9IGJbMV0sIGIyID0gYlsyXSwgYjMgPSBiWzNdLCBiNCA9IGJbNF0sIGI1ID0gYls1XTtcbiAgICBvdXRbMF0gPSBhMCAqIGIwICsgYTIgKiBiMTtcbiAgICBvdXRbMV0gPSBhMSAqIGIwICsgYTMgKiBiMTtcbiAgICBvdXRbMl0gPSBhMCAqIGIyICsgYTIgKiBiMztcbiAgICBvdXRbM10gPSBhMSAqIGIyICsgYTMgKiBiMztcbiAgICBvdXRbNF0gPSBhMCAqIGI0ICsgYTIgKiBiNSArIGE0O1xuICAgIG91dFs1XSA9IGExICogYjQgKyBhMyAqIGI1ICsgYTU7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayBtYXQyZC5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5tYXQyZC5tdWwgPSBtYXQyZC5tdWx0aXBseTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0MmQgYnkgdGhlIGdpdmVuIGFuZ2xlXG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqL1xubWF0MmQucm90YXRlID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSwgYTQgPSBhWzRdLCBhNSA9IGFbNV0sXG4gICAgICAgIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKTtcbiAgICBvdXRbMF0gPSBhMCAqICBjICsgYTIgKiBzO1xuICAgIG91dFsxXSA9IGExICogIGMgKyBhMyAqIHM7XG4gICAgb3V0WzJdID0gYTAgKiAtcyArIGEyICogYztcbiAgICBvdXRbM10gPSBhMSAqIC1zICsgYTMgKiBjO1xuICAgIG91dFs0XSA9IGE0O1xuICAgIG91dFs1XSA9IGE1O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyB0aGUgbWF0MmQgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzJcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIG1hdHJpeCB0byB0cmFuc2xhdGVcbiAqIEBwYXJhbSB7dmVjMn0gdiB0aGUgdmVjMiB0byBzY2FsZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICoqL1xubWF0MmQuc2NhbGUgPSBmdW5jdGlvbihvdXQsIGEsIHYpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLCBhNCA9IGFbNF0sIGE1ID0gYVs1XSxcbiAgICAgICAgdjAgPSB2WzBdLCB2MSA9IHZbMV07XG4gICAgb3V0WzBdID0gYTAgKiB2MDtcbiAgICBvdXRbMV0gPSBhMSAqIHYwO1xuICAgIG91dFsyXSA9IGEyICogdjE7XG4gICAgb3V0WzNdID0gYTMgKiB2MTtcbiAgICBvdXRbNF0gPSBhNDtcbiAgICBvdXRbNV0gPSBhNTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2xhdGVzIHRoZSBtYXQyZCBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjMlxuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICogQHBhcmFtIHt2ZWMyfSB2IHRoZSB2ZWMyIHRvIHRyYW5zbGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICoqL1xubWF0MmQudHJhbnNsYXRlID0gZnVuY3Rpb24ob3V0LCBhLCB2KSB7XG4gICAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXSwgYTQgPSBhWzRdLCBhNSA9IGFbNV0sXG4gICAgICAgIHYwID0gdlswXSwgdjEgPSB2WzFdO1xuICAgIG91dFswXSA9IGEwO1xuICAgIG91dFsxXSA9IGExO1xuICAgIG91dFsyXSA9IGEyO1xuICAgIG91dFszXSA9IGEzO1xuICAgIG91dFs0XSA9IGEwICogdjAgKyBhMiAqIHYxICsgYTQ7XG4gICAgb3V0WzVdID0gYTEgKiB2MCArIGEzICogdjEgKyBhNTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZVxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDJkLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDJkLnJvdGF0ZShkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCBtYXQyZCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKi9cbm1hdDJkLmZyb21Sb3RhdGlvbiA9IGZ1bmN0aW9uKG91dCwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpLCBjID0gTWF0aC5jb3MocmFkKTtcbiAgICBvdXRbMF0gPSBjO1xuICAgIG91dFsxXSA9IHM7XG4gICAgb3V0WzJdID0gLXM7XG4gICAgb3V0WzNdID0gYztcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB2ZWN0b3Igc2NhbGluZ1xuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDJkLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDJkLnNjYWxlKGRlc3QsIGRlc3QsIHZlYyk7XG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IG1hdDJkIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3ZlYzJ9IHYgU2NhbGluZyB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKi9cbm1hdDJkLmZyb21TY2FsaW5nID0gZnVuY3Rpb24ob3V0LCB2KSB7XG4gICAgb3V0WzBdID0gdlswXTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gdlsxXTtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB2ZWN0b3IgdHJhbnNsYXRpb25cbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQyZC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQyZC50cmFuc2xhdGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgbWF0MmQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7dmVjMn0gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKi9cbm1hdDJkLmZyb21UcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKG91dCwgdikge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgb3V0WzRdID0gdlswXTtcbiAgICBvdXRbNV0gPSB2WzFdO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIG1hdDJkXG4gKlxuICogQHBhcmFtIHttYXQyZH0gYSBtYXRyaXggdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeFxuICovXG5tYXQyZC5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAnbWF0MmQoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIFxuICAgICAgICAgICAgICAgICAgICBhWzNdICsgJywgJyArIGFbNF0gKyAnLCAnICsgYVs1XSArICcpJztcbn07XG5cbi8qKlxuICogUmV0dXJucyBGcm9iZW5pdXMgbm9ybSBvZiBhIG1hdDJkXG4gKlxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgbWF0cml4IHRvIGNhbGN1bGF0ZSBGcm9iZW5pdXMgbm9ybSBvZlxuICogQHJldHVybnMge051bWJlcn0gRnJvYmVuaXVzIG5vcm1cbiAqL1xubWF0MmQuZnJvYiA9IGZ1bmN0aW9uIChhKSB7IFxuICAgIHJldHVybihNYXRoLnNxcnQoTWF0aC5wb3coYVswXSwgMikgKyBNYXRoLnBvdyhhWzFdLCAyKSArIE1hdGgucG93KGFbMl0sIDIpICsgTWF0aC5wb3coYVszXSwgMikgKyBNYXRoLnBvdyhhWzRdLCAyKSArIE1hdGgucG93KGFbNV0sIDIpICsgMSkpXG59OyBcblxubW9kdWxlLmV4cG9ydHMgPSBtYXQyZDtcbiIsIi8qIENvcHlyaWdodCAoYykgMjAxNSwgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuICovXG5cbnZhciBnbE1hdHJpeCA9IHJlcXVpcmUoXCIuL2NvbW1vbi5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgM3gzIE1hdHJpeFxuICogQG5hbWUgbWF0M1xuICovXG52YXIgbWF0MyA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0M1xuICpcbiAqIEByZXR1cm5zIHttYXQzfSBhIG5ldyAzeDMgbWF0cml4XG4gKi9cbm1hdDMuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDkpO1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMTtcbiAgICBvdXRbNV0gPSAwO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvcGllcyB0aGUgdXBwZXItbGVmdCAzeDMgdmFsdWVzIGludG8gdGhlIGdpdmVuIG1hdDMuXG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyAzeDMgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgICB0aGUgc291cmNlIDR4NCBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My5mcm9tTWF0NCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbNF07XG4gICAgb3V0WzRdID0gYVs1XTtcbiAgICBvdXRbNV0gPSBhWzZdO1xuICAgIG91dFs2XSA9IGFbOF07XG4gICAgb3V0WzddID0gYVs5XTtcbiAgICBvdXRbOF0gPSBhWzEwXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG1hdDMgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyBtYXRyaXhcbiAqXG4gKiBAcGFyYW0ge21hdDN9IGEgbWF0cml4IHRvIGNsb25lXG4gKiBAcmV0dXJucyB7bWF0M30gYSBuZXcgM3gzIG1hdHJpeFxuICovXG5tYXQzLmNsb25lID0gZnVuY3Rpb24oYSkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSg5KTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbWF0MyB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0M30gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgYSBtYXQzIHRvIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLmlkZW50aXR5ID0gZnVuY3Rpb24ob3V0KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAxO1xuICAgIG91dFs1XSA9IDA7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHJhbnNwb3NlIHRoZSB2YWx1ZXMgb2YgYSBtYXQzXG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0M30gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIC8vIElmIHdlIGFyZSB0cmFuc3Bvc2luZyBvdXJzZWx2ZXMgd2UgY2FuIHNraXAgYSBmZXcgc3RlcHMgYnV0IGhhdmUgdG8gY2FjaGUgc29tZSB2YWx1ZXNcbiAgICBpZiAob3V0ID09PSBhKSB7XG4gICAgICAgIHZhciBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMTIgPSBhWzVdO1xuICAgICAgICBvdXRbMV0gPSBhWzNdO1xuICAgICAgICBvdXRbMl0gPSBhWzZdO1xuICAgICAgICBvdXRbM10gPSBhMDE7XG4gICAgICAgIG91dFs1XSA9IGFbN107XG4gICAgICAgIG91dFs2XSA9IGEwMjtcbiAgICAgICAgb3V0WzddID0gYTEyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG91dFswXSA9IGFbMF07XG4gICAgICAgIG91dFsxXSA9IGFbM107XG4gICAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICAgIG91dFszXSA9IGFbMV07XG4gICAgICAgIG91dFs0XSA9IGFbNF07XG4gICAgICAgIG91dFs1XSA9IGFbN107XG4gICAgICAgIG91dFs2XSA9IGFbMl07XG4gICAgICAgIG91dFs3XSA9IGFbNV07XG4gICAgICAgIG91dFs4XSA9IGFbOF07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEludmVydHMgYSBtYXQzXG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0M30gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLmludmVydCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLFxuICAgICAgICBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLFxuICAgICAgICBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLFxuXG4gICAgICAgIGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMSxcbiAgICAgICAgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMCxcbiAgICAgICAgYjIxID0gYTIxICogYTEwIC0gYTExICogYTIwLFxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICAgICAgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xuXG4gICAgaWYgKCFkZXQpIHsgXG4gICAgICAgIHJldHVybiBudWxsOyBcbiAgICB9XG4gICAgZGV0ID0gMS4wIC8gZGV0O1xuXG4gICAgb3V0WzBdID0gYjAxICogZGV0O1xuICAgIG91dFsxXSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGRldDtcbiAgICBvdXRbMl0gPSAoYTEyICogYTAxIC0gYTAyICogYTExKSAqIGRldDtcbiAgICBvdXRbM10gPSBiMTEgKiBkZXQ7XG4gICAgb3V0WzRdID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBkZXQ7XG4gICAgb3V0WzVdID0gKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApICogZGV0O1xuICAgIG91dFs2XSA9IGIyMSAqIGRldDtcbiAgICBvdXRbN10gPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBkZXQ7XG4gICAgb3V0WzhdID0gKGExMSAqIGEwMCAtIGEwMSAqIGExMCkgKiBkZXQ7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgYWRqdWdhdGUgb2YgYSBtYXQzXG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0M30gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLmFkam9pbnQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSxcbiAgICAgICAgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSxcbiAgICAgICAgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XTtcblxuICAgIG91dFswXSA9IChhMTEgKiBhMjIgLSBhMTIgKiBhMjEpO1xuICAgIG91dFsxXSA9IChhMDIgKiBhMjEgLSBhMDEgKiBhMjIpO1xuICAgIG91dFsyXSA9IChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpO1xuICAgIG91dFszXSA9IChhMTIgKiBhMjAgLSBhMTAgKiBhMjIpO1xuICAgIG91dFs0XSA9IChhMDAgKiBhMjIgLSBhMDIgKiBhMjApO1xuICAgIG91dFs1XSA9IChhMDIgKiBhMTAgLSBhMDAgKiBhMTIpO1xuICAgIG91dFs2XSA9IChhMTAgKiBhMjEgLSBhMTEgKiBhMjApO1xuICAgIG91dFs3XSA9IChhMDEgKiBhMjAgLSBhMDAgKiBhMjEpO1xuICAgIG91dFs4XSA9IChhMDAgKiBhMTEgLSBhMDEgKiBhMTApO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0M1xuICpcbiAqIEBwYXJhbSB7bWF0M30gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICovXG5tYXQzLmRldGVybWluYW50ID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSxcbiAgICAgICAgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSxcbiAgICAgICAgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XTtcblxuICAgIHJldHVybiBhMDAgKiAoYTIyICogYTExIC0gYTEyICogYTIxKSArIGEwMSAqICgtYTIyICogYTEwICsgYTEyICogYTIwKSArIGEwMiAqIChhMjEgKiBhMTAgLSBhMTEgKiBhMjApO1xufTtcblxuLyoqXG4gKiBNdWx0aXBsaWVzIHR3byBtYXQzJ3NcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge21hdDN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMubXVsdGlwbHkgPSBmdW5jdGlvbiAob3V0LCBhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sXG4gICAgICAgIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sXG4gICAgICAgIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sXG5cbiAgICAgICAgYjAwID0gYlswXSwgYjAxID0gYlsxXSwgYjAyID0gYlsyXSxcbiAgICAgICAgYjEwID0gYlszXSwgYjExID0gYls0XSwgYjEyID0gYls1XSxcbiAgICAgICAgYjIwID0gYls2XSwgYjIxID0gYls3XSwgYjIyID0gYls4XTtcblxuICAgIG91dFswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcbiAgICBvdXRbMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XG4gICAgb3V0WzJdID0gYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyO1xuXG4gICAgb3V0WzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xuICAgIG91dFs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcbiAgICBvdXRbNV0gPSBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjI7XG5cbiAgICBvdXRbNl0gPSBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjA7XG4gICAgb3V0WzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xuICAgIG91dFs4XSA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDMubXVsdGlwbHl9XG4gKiBAZnVuY3Rpb25cbiAqL1xubWF0My5tdWwgPSBtYXQzLm11bHRpcGx5O1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIG1hdDMgYnkgdGhlIGdpdmVuIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIG1hdHJpeCB0byB0cmFuc2xhdGVcbiAqIEBwYXJhbSB7dmVjMn0gdiB2ZWN0b3IgdG8gdHJhbnNsYXRlIGJ5XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMudHJhbnNsYXRlID0gZnVuY3Rpb24ob3V0LCBhLCB2KSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sXG4gICAgICAgIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sXG4gICAgICAgIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sXG4gICAgICAgIHggPSB2WzBdLCB5ID0gdlsxXTtcblxuICAgIG91dFswXSA9IGEwMDtcbiAgICBvdXRbMV0gPSBhMDE7XG4gICAgb3V0WzJdID0gYTAyO1xuXG4gICAgb3V0WzNdID0gYTEwO1xuICAgIG91dFs0XSA9IGExMTtcbiAgICBvdXRbNV0gPSBhMTI7XG5cbiAgICBvdXRbNl0gPSB4ICogYTAwICsgeSAqIGExMCArIGEyMDtcbiAgICBvdXRbN10gPSB4ICogYTAxICsgeSAqIGExMSArIGEyMTtcbiAgICBvdXRbOF0gPSB4ICogYTAyICsgeSAqIGExMiArIGEyMjtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0MyBieSB0aGUgZ2l2ZW4gYW5nbGVcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLnJvdGF0ZSA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLFxuICAgICAgICBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLFxuICAgICAgICBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdLFxuXG4gICAgICAgIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKTtcblxuICAgIG91dFswXSA9IGMgKiBhMDAgKyBzICogYTEwO1xuICAgIG91dFsxXSA9IGMgKiBhMDEgKyBzICogYTExO1xuICAgIG91dFsyXSA9IGMgKiBhMDIgKyBzICogYTEyO1xuXG4gICAgb3V0WzNdID0gYyAqIGExMCAtIHMgKiBhMDA7XG4gICAgb3V0WzRdID0gYyAqIGExMSAtIHMgKiBhMDE7XG4gICAgb3V0WzVdID0gYyAqIGExMiAtIHMgKiBhMDI7XG5cbiAgICBvdXRbNl0gPSBhMjA7XG4gICAgb3V0WzddID0gYTIxO1xuICAgIG91dFs4XSA9IGEyMjtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTY2FsZXMgdGhlIG1hdDMgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzJcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge3ZlYzJ9IHYgdGhlIHZlYzIgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDN9IG91dFxuICoqL1xubWF0My5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgdikge1xuICAgIHZhciB4ID0gdlswXSwgeSA9IHZbMV07XG5cbiAgICBvdXRbMF0gPSB4ICogYVswXTtcbiAgICBvdXRbMV0gPSB4ICogYVsxXTtcbiAgICBvdXRbMl0gPSB4ICogYVsyXTtcblxuICAgIG91dFszXSA9IHkgKiBhWzNdO1xuICAgIG91dFs0XSA9IHkgKiBhWzRdO1xuICAgIG91dFs1XSA9IHkgKiBhWzVdO1xuXG4gICAgb3V0WzZdID0gYVs2XTtcbiAgICBvdXRbN10gPSBhWzddO1xuICAgIG91dFs4XSA9IGFbOF07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHRyYW5zbGF0aW9uXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0My5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQzLnRyYW5zbGF0ZShkZXN0LCBkZXN0LCB2ZWMpO1xuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IG1hdDMgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7dmVjMn0gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My5mcm9tVHJhbnNsYXRpb24gPSBmdW5jdGlvbihvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDE7XG4gICAgb3V0WzVdID0gMDtcbiAgICBvdXRbNl0gPSB2WzBdO1xuICAgIG91dFs3XSA9IHZbMV07XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIGdpdmVuIGFuZ2xlXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0My5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQzLnJvdGF0ZShkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IG1hdDMgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuZnJvbVJvdGF0aW9uID0gZnVuY3Rpb24ob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgb3V0WzBdID0gYztcbiAgICBvdXRbMV0gPSBzO1xuICAgIG91dFsyXSA9IDA7XG5cbiAgICBvdXRbM10gPSAtcztcbiAgICBvdXRbNF0gPSBjO1xuICAgIG91dFs1XSA9IDA7XG5cbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHZlY3RvciBzY2FsaW5nXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0My5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQzLnNjYWxlKGRlc3QsIGRlc3QsIHZlYyk7XG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgbWF0MyByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHt2ZWMyfSB2IFNjYWxpbmcgdmVjdG9yXG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuZnJvbVNjYWxpbmcgPSBmdW5jdGlvbihvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSB2WzBdO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcblxuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gdlsxXTtcbiAgICBvdXRbNV0gPSAwO1xuXG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBmcm9tIGEgbWF0MmQgaW50byBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgbWF0cml4IHRvIGNvcHlcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqKi9cbm1hdDMuZnJvbU1hdDJkID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IDA7XG5cbiAgICBvdXRbM10gPSBhWzJdO1xuICAgIG91dFs0XSA9IGFbM107XG4gICAgb3V0WzVdID0gMDtcblxuICAgIG91dFs2XSA9IGFbNF07XG4gICAgb3V0WzddID0gYVs1XTtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiogQ2FsY3VsYXRlcyBhIDN4MyBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gcXVhdGVybmlvblxuKlxuKiBAcGFyYW0ge21hdDN9IG91dCBtYXQzIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4qIEBwYXJhbSB7cXVhdH0gcSBRdWF0ZXJuaW9uIHRvIGNyZWF0ZSBtYXRyaXggZnJvbVxuKlxuKiBAcmV0dXJucyB7bWF0M30gb3V0XG4qL1xubWF0My5mcm9tUXVhdCA9IGZ1bmN0aW9uIChvdXQsIHEpIHtcbiAgICB2YXIgeCA9IHFbMF0sIHkgPSBxWzFdLCB6ID0gcVsyXSwgdyA9IHFbM10sXG4gICAgICAgIHgyID0geCArIHgsXG4gICAgICAgIHkyID0geSArIHksXG4gICAgICAgIHoyID0geiArIHosXG5cbiAgICAgICAgeHggPSB4ICogeDIsXG4gICAgICAgIHl4ID0geSAqIHgyLFxuICAgICAgICB5eSA9IHkgKiB5MixcbiAgICAgICAgenggPSB6ICogeDIsXG4gICAgICAgIHp5ID0geiAqIHkyLFxuICAgICAgICB6eiA9IHogKiB6MixcbiAgICAgICAgd3ggPSB3ICogeDIsXG4gICAgICAgIHd5ID0gdyAqIHkyLFxuICAgICAgICB3eiA9IHcgKiB6MjtcblxuICAgIG91dFswXSA9IDEgLSB5eSAtIHp6O1xuICAgIG91dFszXSA9IHl4IC0gd3o7XG4gICAgb3V0WzZdID0genggKyB3eTtcblxuICAgIG91dFsxXSA9IHl4ICsgd3o7XG4gICAgb3V0WzRdID0gMSAtIHh4IC0geno7XG4gICAgb3V0WzddID0genkgLSB3eDtcblxuICAgIG91dFsyXSA9IHp4IC0gd3k7XG4gICAgb3V0WzVdID0genkgKyB3eDtcbiAgICBvdXRbOF0gPSAxIC0geHggLSB5eTtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiogQ2FsY3VsYXRlcyBhIDN4MyBub3JtYWwgbWF0cml4ICh0cmFuc3Bvc2UgaW52ZXJzZSkgZnJvbSB0aGUgNHg0IG1hdHJpeFxuKlxuKiBAcGFyYW0ge21hdDN9IG91dCBtYXQzIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4qIEBwYXJhbSB7bWF0NH0gYSBNYXQ0IHRvIGRlcml2ZSB0aGUgbm9ybWFsIG1hdHJpeCBmcm9tXG4qXG4qIEByZXR1cm5zIHttYXQzfSBvdXRcbiovXG5tYXQzLm5vcm1hbEZyb21NYXQ0ID0gZnVuY3Rpb24gKG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLCBhMTEgPSBhWzVdLCBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICBhMjAgPSBhWzhdLCBhMjEgPSBhWzldLCBhMjIgPSBhWzEwXSwgYTIzID0gYVsxMV0sXG4gICAgICAgIGEzMCA9IGFbMTJdLCBhMzEgPSBhWzEzXSwgYTMyID0gYVsxNF0sIGEzMyA9IGFbMTVdLFxuXG4gICAgICAgIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMCxcbiAgICAgICAgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwLFxuICAgICAgICBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTAsXG4gICAgICAgIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMSxcbiAgICAgICAgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExLFxuICAgICAgICBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTIsXG4gICAgICAgIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMCxcbiAgICAgICAgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwLFxuICAgICAgICBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzAsXG4gICAgICAgIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMSxcbiAgICAgICAgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxLFxuICAgICAgICBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzIsXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG5cbiAgICBpZiAoIWRldCkgeyBcbiAgICAgICAgcmV0dXJuIG51bGw7IFxuICAgIH1cbiAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICBvdXRbMF0gPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldDtcbiAgICBvdXRbMV0gPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldDtcbiAgICBvdXRbMl0gPSAoYTEwICogYjEwIC0gYTExICogYjA4ICsgYTEzICogYjA2KSAqIGRldDtcblxuICAgIG91dFszXSA9IChhMDIgKiBiMTAgLSBhMDEgKiBiMTEgLSBhMDMgKiBiMDkpICogZGV0O1xuICAgIG91dFs0XSA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xuICAgIG91dFs1XSA9IChhMDEgKiBiMDggLSBhMDAgKiBiMTAgLSBhMDMgKiBiMDYpICogZGV0O1xuXG4gICAgb3V0WzZdID0gKGEzMSAqIGIwNSAtIGEzMiAqIGIwNCArIGEzMyAqIGIwMykgKiBkZXQ7XG4gICAgb3V0WzddID0gKGEzMiAqIGIwMiAtIGEzMCAqIGIwNSAtIGEzMyAqIGIwMSkgKiBkZXQ7XG4gICAgb3V0WzhdID0gKGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMCkgKiBkZXQ7XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0M1xuICpcbiAqIEBwYXJhbSB7bWF0M30gbWF0IG1hdHJpeCB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gKi9cbm1hdDMuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ21hdDMoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIFxuICAgICAgICAgICAgICAgICAgICBhWzNdICsgJywgJyArIGFbNF0gKyAnLCAnICsgYVs1XSArICcsICcgKyBcbiAgICAgICAgICAgICAgICAgICAgYVs2XSArICcsICcgKyBhWzddICsgJywgJyArIGFbOF0gKyAnKSc7XG59O1xuXG4vKipcbiAqIFJldHVybnMgRnJvYmVuaXVzIG5vcm0gb2YgYSBtYXQzXG4gKlxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBGcm9iZW5pdXMgbm9ybVxuICovXG5tYXQzLmZyb2IgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybihNYXRoLnNxcnQoTWF0aC5wb3coYVswXSwgMikgKyBNYXRoLnBvdyhhWzFdLCAyKSArIE1hdGgucG93KGFbMl0sIDIpICsgTWF0aC5wb3coYVszXSwgMikgKyBNYXRoLnBvdyhhWzRdLCAyKSArIE1hdGgucG93KGFbNV0sIDIpICsgTWF0aC5wb3coYVs2XSwgMikgKyBNYXRoLnBvdyhhWzddLCAyKSArIE1hdGgucG93KGFbOF0sIDIpKSlcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBtYXQzO1xuIiwiLyogQ29weXJpZ2h0IChjKSAyMDE1LCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cblxudmFyIGdsTWF0cml4ID0gcmVxdWlyZShcIi4vY29tbW9uLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyA0eDQgTWF0cml4XG4gKiBAbmFtZSBtYXQ0XG4gKi9cbnZhciBtYXQ0ID0ge307XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBpZGVudGl0eSBtYXQ0XG4gKlxuICogQHJldHVybnMge21hdDR9IGEgbmV3IDR4NCBtYXRyaXhcbiAqL1xubWF0NC5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMTYpO1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAxO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDE7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBtYXQ0IGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQ0fSBhIG1hdHJpeCB0byBjbG9uZVxuICogQHJldHVybnMge21hdDR9IGEgbmV3IDR4NCBtYXRyaXhcbiAqL1xubWF0NC5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMTYpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIG91dFs5XSA9IGFbOV07XG4gICAgb3V0WzEwXSA9IGFbMTBdO1xuICAgIG91dFsxMV0gPSBhWzExXTtcbiAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIG1hdDQgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5jb3B5ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICBvdXRbNF0gPSBhWzRdO1xuICAgIG91dFs1XSA9IGFbNV07XG4gICAgb3V0WzZdID0gYVs2XTtcbiAgICBvdXRbN10gPSBhWzddO1xuICAgIG91dFs4XSA9IGFbOF07XG4gICAgb3V0WzldID0gYVs5XTtcbiAgICBvdXRbMTBdID0gYVsxMF07XG4gICAgb3V0WzExXSA9IGFbMTFdO1xuICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICBvdXRbMTNdID0gYVsxM107XG4gICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgYSBtYXQ0IHRvIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmlkZW50aXR5ID0gZnVuY3Rpb24ob3V0KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDE7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQudHJhbnNwb3NlID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgLy8gSWYgd2UgYXJlIHRyYW5zcG9zaW5nIG91cnNlbHZlcyB3ZSBjYW4gc2tpcCBhIGZldyBzdGVwcyBidXQgaGF2ZSB0byBjYWNoZSBzb21lIHZhbHVlc1xuICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgdmFyIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgICAgICBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICAgICAgYTIzID0gYVsxMV07XG5cbiAgICAgICAgb3V0WzFdID0gYVs0XTtcbiAgICAgICAgb3V0WzJdID0gYVs4XTtcbiAgICAgICAgb3V0WzNdID0gYVsxMl07XG4gICAgICAgIG91dFs0XSA9IGEwMTtcbiAgICAgICAgb3V0WzZdID0gYVs5XTtcbiAgICAgICAgb3V0WzddID0gYVsxM107XG4gICAgICAgIG91dFs4XSA9IGEwMjtcbiAgICAgICAgb3V0WzldID0gYTEyO1xuICAgICAgICBvdXRbMTFdID0gYVsxNF07XG4gICAgICAgIG91dFsxMl0gPSBhMDM7XG4gICAgICAgIG91dFsxM10gPSBhMTM7XG4gICAgICAgIG91dFsxNF0gPSBhMjM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3V0WzBdID0gYVswXTtcbiAgICAgICAgb3V0WzFdID0gYVs0XTtcbiAgICAgICAgb3V0WzJdID0gYVs4XTtcbiAgICAgICAgb3V0WzNdID0gYVsxMl07XG4gICAgICAgIG91dFs0XSA9IGFbMV07XG4gICAgICAgIG91dFs1XSA9IGFbNV07XG4gICAgICAgIG91dFs2XSA9IGFbOV07XG4gICAgICAgIG91dFs3XSA9IGFbMTNdO1xuICAgICAgICBvdXRbOF0gPSBhWzJdO1xuICAgICAgICBvdXRbOV0gPSBhWzZdO1xuICAgICAgICBvdXRbMTBdID0gYVsxMF07XG4gICAgICAgIG91dFsxMV0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzEyXSA9IGFbM107XG4gICAgICAgIG91dFsxM10gPSBhWzddO1xuICAgICAgICBvdXRbMTRdID0gYVsxMV07XG4gICAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogSW52ZXJ0cyBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuaW52ZXJ0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sIGExMSA9IGFbNV0sIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sIGEyMSA9IGFbOV0sIGEyMiA9IGFbMTBdLCBhMjMgPSBhWzExXSxcbiAgICAgICAgYTMwID0gYVsxMl0sIGEzMSA9IGFbMTNdLCBhMzIgPSBhWzE0XSwgYTMzID0gYVsxNV0sXG5cbiAgICAgICAgYjAwID0gYTAwICogYTExIC0gYTAxICogYTEwLFxuICAgICAgICBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTAsXG4gICAgICAgIGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMCxcbiAgICAgICAgYjAzID0gYTAxICogYTEyIC0gYTAyICogYTExLFxuICAgICAgICBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTEsXG4gICAgICAgIGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMixcbiAgICAgICAgYjA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwLFxuICAgICAgICBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzAsXG4gICAgICAgIGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMCxcbiAgICAgICAgYjA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxLFxuICAgICAgICBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzEsXG4gICAgICAgIGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMixcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcblxuICAgIGlmICghZGV0KSB7IFxuICAgICAgICByZXR1cm4gbnVsbDsgXG4gICAgfVxuICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgIG91dFswXSA9IChhMTEgKiBiMTEgLSBhMTIgKiBiMTAgKyBhMTMgKiBiMDkpICogZGV0O1xuICAgIG91dFsxXSA9IChhMDIgKiBiMTAgLSBhMDEgKiBiMTEgLSBhMDMgKiBiMDkpICogZGV0O1xuICAgIG91dFsyXSA9IChhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMpICogZGV0O1xuICAgIG91dFszXSA9IChhMjIgKiBiMDQgLSBhMjEgKiBiMDUgLSBhMjMgKiBiMDMpICogZGV0O1xuICAgIG91dFs0XSA9IChhMTIgKiBiMDggLSBhMTAgKiBiMTEgLSBhMTMgKiBiMDcpICogZGV0O1xuICAgIG91dFs1XSA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xuICAgIG91dFs2XSA9IChhMzIgKiBiMDIgLSBhMzAgKiBiMDUgLSBhMzMgKiBiMDEpICogZGV0O1xuICAgIG91dFs3XSA9IChhMjAgKiBiMDUgLSBhMjIgKiBiMDIgKyBhMjMgKiBiMDEpICogZGV0O1xuICAgIG91dFs4XSA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xuICAgIG91dFs5XSA9IChhMDEgKiBiMDggLSBhMDAgKiBiMTAgLSBhMDMgKiBiMDYpICogZGV0O1xuICAgIG91dFsxMF0gPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcbiAgICBvdXRbMTFdID0gKGEyMSAqIGIwMiAtIGEyMCAqIGIwNCAtIGEyMyAqIGIwMCkgKiBkZXQ7XG4gICAgb3V0WzEyXSA9IChhMTEgKiBiMDcgLSBhMTAgKiBiMDkgLSBhMTIgKiBiMDYpICogZGV0O1xuICAgIG91dFsxM10gPSAoYTAwICogYjA5IC0gYTAxICogYjA3ICsgYTAyICogYjA2KSAqIGRldDtcbiAgICBvdXRbMTRdID0gKGEzMSAqIGIwMSAtIGEzMCAqIGIwMyAtIGEzMiAqIGIwMCkgKiBkZXQ7XG4gICAgb3V0WzE1XSA9IChhMjAgKiBiMDMgLSBhMjEgKiBiMDEgKyBhMjIgKiBiMDApICogZGV0O1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgYWRqdWdhdGUgb2YgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmFkam9pbnQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTAzID0gYVszXSxcbiAgICAgICAgYTEwID0gYVs0XSwgYTExID0gYVs1XSwgYTEyID0gYVs2XSwgYTEzID0gYVs3XSxcbiAgICAgICAgYTIwID0gYVs4XSwgYTIxID0gYVs5XSwgYTIyID0gYVsxMF0sIGEyMyA9IGFbMTFdLFxuICAgICAgICBhMzAgPSBhWzEyXSwgYTMxID0gYVsxM10sIGEzMiA9IGFbMTRdLCBhMzMgPSBhWzE1XTtcblxuICAgIG91dFswXSAgPSAgKGExMSAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIxICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgKyBhMzEgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSk7XG4gICAgb3V0WzFdICA9IC0oYTAxICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjEgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMSAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpKTtcbiAgICBvdXRbMl0gID0gIChhMDEgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSAtIGExMSAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMxICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgIG91dFszXSAgPSAtKGEwMSAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpIC0gYTExICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikgKyBhMjEgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgb3V0WzRdICA9IC0oYTEwICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSArIGEzMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpKTtcbiAgICBvdXRbNV0gID0gIChhMDAgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikpO1xuICAgIG91dFs2XSAgPSAtKGEwMCAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpIC0gYTEwICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzAgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgb3V0WzddICA9ICAoYTAwICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikgLSBhMTAgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSArIGEyMCAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICBvdXRbOF0gID0gIChhMTAgKiAoYTIxICogYTMzIC0gYTIzICogYTMxKSAtIGEyMCAqIChhMTEgKiBhMzMgLSBhMTMgKiBhMzEpICsgYTMwICogKGExMSAqIGEyMyAtIGExMyAqIGEyMSkpO1xuICAgIG91dFs5XSAgPSAtKGEwMCAqIChhMjEgKiBhMzMgLSBhMjMgKiBhMzEpIC0gYTIwICogKGEwMSAqIGEzMyAtIGEwMyAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTIzIC0gYTAzICogYTIxKSk7XG4gICAgb3V0WzEwXSA9ICAoYTAwICogKGExMSAqIGEzMyAtIGExMyAqIGEzMSkgLSBhMTAgKiAoYTAxICogYTMzIC0gYTAzICogYTMxKSArIGEzMCAqIChhMDEgKiBhMTMgLSBhMDMgKiBhMTEpKTtcbiAgICBvdXRbMTFdID0gLShhMDAgKiAoYTExICogYTIzIC0gYTEzICogYTIxKSAtIGExMCAqIChhMDEgKiBhMjMgLSBhMDMgKiBhMjEpICsgYTIwICogKGEwMSAqIGExMyAtIGEwMyAqIGExMSkpO1xuICAgIG91dFsxMl0gPSAtKGExMCAqIChhMjEgKiBhMzIgLSBhMjIgKiBhMzEpIC0gYTIwICogKGExMSAqIGEzMiAtIGExMiAqIGEzMSkgKyBhMzAgKiAoYTExICogYTIyIC0gYTEyICogYTIxKSk7XG4gICAgb3V0WzEzXSA9ICAoYTAwICogKGEyMSAqIGEzMiAtIGEyMiAqIGEzMSkgLSBhMjAgKiAoYTAxICogYTMyIC0gYTAyICogYTMxKSArIGEzMCAqIChhMDEgKiBhMjIgLSBhMDIgKiBhMjEpKTtcbiAgICBvdXRbMTRdID0gLShhMDAgKiAoYTExICogYTMyIC0gYTEyICogYTMxKSAtIGExMCAqIChhMDEgKiBhMzIgLSBhMDIgKiBhMzEpICsgYTMwICogKGEwMSAqIGExMiAtIGEwMiAqIGExMSkpO1xuICAgIG91dFsxNV0gPSAgKGEwMCAqIChhMTEgKiBhMjIgLSBhMTIgKiBhMjEpIC0gYTEwICogKGEwMSAqIGEyMiAtIGEwMiAqIGEyMSkgKyBhMjAgKiAoYTAxICogYTEyIC0gYTAyICogYTExKSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXG4gKi9cbm1hdDQuZGV0ZXJtaW5hbnQgPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLCBhMTEgPSBhWzVdLCBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICBhMjAgPSBhWzhdLCBhMjEgPSBhWzldLCBhMjIgPSBhWzEwXSwgYTIzID0gYVsxMV0sXG4gICAgICAgIGEzMCA9IGFbMTJdLCBhMzEgPSBhWzEzXSwgYTMyID0gYVsxNF0sIGEzMyA9IGFbMTVdLFxuXG4gICAgICAgIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMCxcbiAgICAgICAgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwLFxuICAgICAgICBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTAsXG4gICAgICAgIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMSxcbiAgICAgICAgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExLFxuICAgICAgICBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTIsXG4gICAgICAgIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMCxcbiAgICAgICAgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwLFxuICAgICAgICBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzAsXG4gICAgICAgIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMSxcbiAgICAgICAgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxLFxuICAgICAgICBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzI7XG5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgcmV0dXJuIGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcbn07XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gbWF0NCdzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHttYXQ0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0Lm11bHRpcGx5ID0gZnVuY3Rpb24gKG91dCwgYSwgYikge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLCBhMTEgPSBhWzVdLCBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICBhMjAgPSBhWzhdLCBhMjEgPSBhWzldLCBhMjIgPSBhWzEwXSwgYTIzID0gYVsxMV0sXG4gICAgICAgIGEzMCA9IGFbMTJdLCBhMzEgPSBhWzEzXSwgYTMyID0gYVsxNF0sIGEzMyA9IGFbMTVdO1xuXG4gICAgLy8gQ2FjaGUgb25seSB0aGUgY3VycmVudCBsaW5lIG9mIHRoZSBzZWNvbmQgbWF0cml4XG4gICAgdmFyIGIwICA9IGJbMF0sIGIxID0gYlsxXSwgYjIgPSBiWzJdLCBiMyA9IGJbM107ICBcbiAgICBvdXRbMF0gPSBiMCphMDAgKyBiMSphMTAgKyBiMiphMjAgKyBiMyphMzA7XG4gICAgb3V0WzFdID0gYjAqYTAxICsgYjEqYTExICsgYjIqYTIxICsgYjMqYTMxO1xuICAgIG91dFsyXSA9IGIwKmEwMiArIGIxKmExMiArIGIyKmEyMiArIGIzKmEzMjtcbiAgICBvdXRbM10gPSBiMCphMDMgKyBiMSphMTMgKyBiMiphMjMgKyBiMyphMzM7XG5cbiAgICBiMCA9IGJbNF07IGIxID0gYls1XTsgYjIgPSBiWzZdOyBiMyA9IGJbN107XG4gICAgb3V0WzRdID0gYjAqYTAwICsgYjEqYTEwICsgYjIqYTIwICsgYjMqYTMwO1xuICAgIG91dFs1XSA9IGIwKmEwMSArIGIxKmExMSArIGIyKmEyMSArIGIzKmEzMTtcbiAgICBvdXRbNl0gPSBiMCphMDIgKyBiMSphMTIgKyBiMiphMjIgKyBiMyphMzI7XG4gICAgb3V0WzddID0gYjAqYTAzICsgYjEqYTEzICsgYjIqYTIzICsgYjMqYTMzO1xuXG4gICAgYjAgPSBiWzhdOyBiMSA9IGJbOV07IGIyID0gYlsxMF07IGIzID0gYlsxMV07XG4gICAgb3V0WzhdID0gYjAqYTAwICsgYjEqYTEwICsgYjIqYTIwICsgYjMqYTMwO1xuICAgIG91dFs5XSA9IGIwKmEwMSArIGIxKmExMSArIGIyKmEyMSArIGIzKmEzMTtcbiAgICBvdXRbMTBdID0gYjAqYTAyICsgYjEqYTEyICsgYjIqYTIyICsgYjMqYTMyO1xuICAgIG91dFsxMV0gPSBiMCphMDMgKyBiMSphMTMgKyBiMiphMjMgKyBiMyphMzM7XG5cbiAgICBiMCA9IGJbMTJdOyBiMSA9IGJbMTNdOyBiMiA9IGJbMTRdOyBiMyA9IGJbMTVdO1xuICAgIG91dFsxMl0gPSBiMCphMDAgKyBiMSphMTAgKyBiMiphMjAgKyBiMyphMzA7XG4gICAgb3V0WzEzXSA9IGIwKmEwMSArIGIxKmExMSArIGIyKmEyMSArIGIzKmEzMTtcbiAgICBvdXRbMTRdID0gYjAqYTAyICsgYjEqYTEyICsgYjIqYTIyICsgYjMqYTMyO1xuICAgIG91dFsxNV0gPSBiMCphMDMgKyBiMSphMTMgKyBiMiphMjMgKyBiMyphMzM7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayBtYXQ0Lm11bHRpcGx5fVxuICogQGZ1bmN0aW9uXG4gKi9cbm1hdDQubXVsID0gbWF0NC5tdWx0aXBseTtcblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBtYXQ0IGJ5IHRoZSBnaXZlbiB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gdHJhbnNsYXRlXG4gKiBAcGFyYW0ge3ZlYzN9IHYgdmVjdG9yIHRvIHRyYW5zbGF0ZSBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LnRyYW5zbGF0ZSA9IGZ1bmN0aW9uIChvdXQsIGEsIHYpIHtcbiAgICB2YXIgeCA9IHZbMF0sIHkgPSB2WzFdLCB6ID0gdlsyXSxcbiAgICAgICAgYTAwLCBhMDEsIGEwMiwgYTAzLFxuICAgICAgICBhMTAsIGExMSwgYTEyLCBhMTMsXG4gICAgICAgIGEyMCwgYTIxLCBhMjIsIGEyMztcblxuICAgIGlmIChhID09PSBvdXQpIHtcbiAgICAgICAgb3V0WzEyXSA9IGFbMF0gKiB4ICsgYVs0XSAqIHkgKyBhWzhdICogeiArIGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYVsxXSAqIHggKyBhWzVdICogeSArIGFbOV0gKiB6ICsgYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhWzJdICogeCArIGFbNl0gKiB5ICsgYVsxMF0gKiB6ICsgYVsxNF07XG4gICAgICAgIG91dFsxNV0gPSBhWzNdICogeCArIGFbN10gKiB5ICsgYVsxMV0gKiB6ICsgYVsxNV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYTAwID0gYVswXTsgYTAxID0gYVsxXTsgYTAyID0gYVsyXTsgYTAzID0gYVszXTtcbiAgICAgICAgYTEwID0gYVs0XTsgYTExID0gYVs1XTsgYTEyID0gYVs2XTsgYTEzID0gYVs3XTtcbiAgICAgICAgYTIwID0gYVs4XTsgYTIxID0gYVs5XTsgYTIyID0gYVsxMF07IGEyMyA9IGFbMTFdO1xuXG4gICAgICAgIG91dFswXSA9IGEwMDsgb3V0WzFdID0gYTAxOyBvdXRbMl0gPSBhMDI7IG91dFszXSA9IGEwMztcbiAgICAgICAgb3V0WzRdID0gYTEwOyBvdXRbNV0gPSBhMTE7IG91dFs2XSA9IGExMjsgb3V0WzddID0gYTEzO1xuICAgICAgICBvdXRbOF0gPSBhMjA7IG91dFs5XSA9IGEyMTsgb3V0WzEwXSA9IGEyMjsgb3V0WzExXSA9IGEyMztcblxuICAgICAgICBvdXRbMTJdID0gYTAwICogeCArIGExMCAqIHkgKyBhMjAgKiB6ICsgYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhMDEgKiB4ICsgYTExICogeSArIGEyMSAqIHogKyBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGEwMiAqIHggKyBhMTIgKiB5ICsgYTIyICogeiArIGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYTAzICogeCArIGExMyAqIHkgKyBhMjMgKiB6ICsgYVsxNV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2NhbGVzIHRoZSBtYXQ0IGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHNjYWxlXG4gKiBAcGFyYW0ge3ZlYzN9IHYgdGhlIHZlYzMgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICoqL1xubWF0NC5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgdikge1xuICAgIHZhciB4ID0gdlswXSwgeSA9IHZbMV0sIHogPSB2WzJdO1xuXG4gICAgb3V0WzBdID0gYVswXSAqIHg7XG4gICAgb3V0WzFdID0gYVsxXSAqIHg7XG4gICAgb3V0WzJdID0gYVsyXSAqIHg7XG4gICAgb3V0WzNdID0gYVszXSAqIHg7XG4gICAgb3V0WzRdID0gYVs0XSAqIHk7XG4gICAgb3V0WzVdID0gYVs1XSAqIHk7XG4gICAgb3V0WzZdID0gYVs2XSAqIHk7XG4gICAgb3V0WzddID0gYVs3XSAqIHk7XG4gICAgb3V0WzhdID0gYVs4XSAqIHo7XG4gICAgb3V0WzldID0gYVs5XSAqIHo7XG4gICAgb3V0WzEwXSA9IGFbMTBdICogejtcbiAgICBvdXRbMTFdID0gYVsxMV0gKiB6O1xuICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICBvdXRbMTNdID0gYVsxM107XG4gICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0NCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBnaXZlbiBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEBwYXJhbSB7dmVjM30gYXhpcyB0aGUgYXhpcyB0byByb3RhdGUgYXJvdW5kXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQucm90YXRlID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkLCBheGlzKSB7XG4gICAgdmFyIHggPSBheGlzWzBdLCB5ID0gYXhpc1sxXSwgeiA9IGF4aXNbMl0sXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopLFxuICAgICAgICBzLCBjLCB0LFxuICAgICAgICBhMDAsIGEwMSwgYTAyLCBhMDMsXG4gICAgICAgIGExMCwgYTExLCBhMTIsIGExMyxcbiAgICAgICAgYTIwLCBhMjEsIGEyMiwgYTIzLFxuICAgICAgICBiMDAsIGIwMSwgYjAyLFxuICAgICAgICBiMTAsIGIxMSwgYjEyLFxuICAgICAgICBiMjAsIGIyMSwgYjIyO1xuXG4gICAgaWYgKE1hdGguYWJzKGxlbikgPCBnbE1hdHJpeC5FUFNJTE9OKSB7IHJldHVybiBudWxsOyB9XG4gICAgXG4gICAgbGVuID0gMSAvIGxlbjtcbiAgICB4ICo9IGxlbjtcbiAgICB5ICo9IGxlbjtcbiAgICB6ICo9IGxlbjtcblxuICAgIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIHQgPSAxIC0gYztcblxuICAgIGEwMCA9IGFbMF07IGEwMSA9IGFbMV07IGEwMiA9IGFbMl07IGEwMyA9IGFbM107XG4gICAgYTEwID0gYVs0XTsgYTExID0gYVs1XTsgYTEyID0gYVs2XTsgYTEzID0gYVs3XTtcbiAgICBhMjAgPSBhWzhdOyBhMjEgPSBhWzldOyBhMjIgPSBhWzEwXTsgYTIzID0gYVsxMV07XG5cbiAgICAvLyBDb25zdHJ1Y3QgdGhlIGVsZW1lbnRzIG9mIHRoZSByb3RhdGlvbiBtYXRyaXhcbiAgICBiMDAgPSB4ICogeCAqIHQgKyBjOyBiMDEgPSB5ICogeCAqIHQgKyB6ICogczsgYjAyID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgYjEwID0geCAqIHkgKiB0IC0geiAqIHM7IGIxMSA9IHkgKiB5ICogdCArIGM7IGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xuICAgIGIyMCA9IHggKiB6ICogdCArIHkgKiBzOyBiMjEgPSB5ICogeiAqIHQgLSB4ICogczsgYjIyID0geiAqIHogKiB0ICsgYztcblxuICAgIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyO1xuICAgIG91dFsxXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMjtcbiAgICBvdXRbMl0gPSBhMDIgKiBiMDAgKyBhMTIgKiBiMDEgKyBhMjIgKiBiMDI7XG4gICAgb3V0WzNdID0gYTAzICogYjAwICsgYTEzICogYjAxICsgYTIzICogYjAyO1xuICAgIG91dFs0XSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMjtcbiAgICBvdXRbNV0gPSBhMDEgKiBiMTAgKyBhMTEgKiBiMTEgKyBhMjEgKiBiMTI7XG4gICAgb3V0WzZdID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyO1xuICAgIG91dFs3XSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMjtcbiAgICBvdXRbOF0gPSBhMDAgKiBiMjAgKyBhMTAgKiBiMjEgKyBhMjAgKiBiMjI7XG4gICAgb3V0WzldID0gYTAxICogYjIwICsgYTExICogYjIxICsgYTIxICogYjIyO1xuICAgIG91dFsxMF0gPSBhMDIgKiBiMjAgKyBhMTIgKiBiMjEgKyBhMjIgKiBiMjI7XG4gICAgb3V0WzExXSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMjtcblxuICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcbiAgICAgICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFggYXhpc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQucm90YXRlWCA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgIGExMCA9IGFbNF0sXG4gICAgICAgIGExMSA9IGFbNV0sXG4gICAgICAgIGExMiA9IGFbNl0sXG4gICAgICAgIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sXG4gICAgICAgIGEyMSA9IGFbOV0sXG4gICAgICAgIGEyMiA9IGFbMTBdLFxuICAgICAgICBhMjMgPSBhWzExXTtcblxuICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgICAgICBvdXRbMF0gID0gYVswXTtcbiAgICAgICAgb3V0WzFdICA9IGFbMV07XG4gICAgICAgIG91dFsyXSAgPSBhWzJdO1xuICAgICAgICBvdXRbM10gID0gYVszXTtcbiAgICAgICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cblxuICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICBvdXRbNF0gPSBhMTAgKiBjICsgYTIwICogcztcbiAgICBvdXRbNV0gPSBhMTEgKiBjICsgYTIxICogcztcbiAgICBvdXRbNl0gPSBhMTIgKiBjICsgYTIyICogcztcbiAgICBvdXRbN10gPSBhMTMgKiBjICsgYTIzICogcztcbiAgICBvdXRbOF0gPSBhMjAgKiBjIC0gYTEwICogcztcbiAgICBvdXRbOV0gPSBhMjEgKiBjIC0gYTExICogcztcbiAgICBvdXRbMTBdID0gYTIyICogYyAtIGExMiAqIHM7XG4gICAgb3V0WzExXSA9IGEyMyAqIGMgLSBhMTMgKiBzO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXRyaXggYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWSBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5yb3RhdGVZID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKSxcbiAgICAgICAgYTAwID0gYVswXSxcbiAgICAgICAgYTAxID0gYVsxXSxcbiAgICAgICAgYTAyID0gYVsyXSxcbiAgICAgICAgYTAzID0gYVszXSxcbiAgICAgICAgYTIwID0gYVs4XSxcbiAgICAgICAgYTIxID0gYVs5XSxcbiAgICAgICAgYTIyID0gYVsxMF0sXG4gICAgICAgIGEyMyA9IGFbMTFdO1xuXG4gICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgICAgIG91dFs0XSAgPSBhWzRdO1xuICAgICAgICBvdXRbNV0gID0gYVs1XTtcbiAgICAgICAgb3V0WzZdICA9IGFbNl07XG4gICAgICAgIG91dFs3XSAgPSBhWzddO1xuICAgICAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSA9IGEwMCAqIGMgLSBhMjAgKiBzO1xuICAgIG91dFsxXSA9IGEwMSAqIGMgLSBhMjEgKiBzO1xuICAgIG91dFsyXSA9IGEwMiAqIGMgLSBhMjIgKiBzO1xuICAgIG91dFszXSA9IGEwMyAqIGMgLSBhMjMgKiBzO1xuICAgIG91dFs4XSA9IGEwMCAqIHMgKyBhMjAgKiBjO1xuICAgIG91dFs5XSA9IGEwMSAqIHMgKyBhMjEgKiBjO1xuICAgIG91dFsxMF0gPSBhMDIgKiBzICsgYTIyICogYztcbiAgICBvdXRbMTFdID0gYTAzICogcyArIGEyMyAqIGM7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlcyBhIG1hdHJpeCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LnJvdGF0ZVogPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxuICAgICAgICBhMDAgPSBhWzBdLFxuICAgICAgICBhMDEgPSBhWzFdLFxuICAgICAgICBhMDIgPSBhWzJdLFxuICAgICAgICBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLFxuICAgICAgICBhMTEgPSBhWzVdLFxuICAgICAgICBhMTIgPSBhWzZdLFxuICAgICAgICBhMTMgPSBhWzddO1xuXG4gICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCBsYXN0IHJvd1xuICAgICAgICBvdXRbOF0gID0gYVs4XTtcbiAgICAgICAgb3V0WzldICA9IGFbOV07XG4gICAgICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICAgICAgb3V0WzExXSA9IGFbMTFdO1xuICAgICAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSA9IGEwMCAqIGMgKyBhMTAgKiBzO1xuICAgIG91dFsxXSA9IGEwMSAqIGMgKyBhMTEgKiBzO1xuICAgIG91dFsyXSA9IGEwMiAqIGMgKyBhMTIgKiBzO1xuICAgIG91dFszXSA9IGEwMyAqIGMgKyBhMTMgKiBzO1xuICAgIG91dFs0XSA9IGExMCAqIGMgLSBhMDAgKiBzO1xuICAgIG91dFs1XSA9IGExMSAqIGMgLSBhMDEgKiBzO1xuICAgIG91dFs2XSA9IGExMiAqIGMgLSBhMDIgKiBzO1xuICAgIG91dFs3XSA9IGExMyAqIGMgLSBhMDMgKiBzO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHZlY3RvciB0cmFuc2xhdGlvblxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3ZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVRyYW5zbGF0aW9uID0gZnVuY3Rpb24ob3V0LCB2KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDE7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gdlswXTtcbiAgICBvdXRbMTNdID0gdlsxXTtcbiAgICBvdXRbMTRdID0gdlsyXTtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHZlY3RvciBzY2FsaW5nXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnNjYWxlKGRlc3QsIGRlc3QsIHZlYyk7XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHt2ZWMzfSB2IFNjYWxpbmcgdmVjdG9yXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVNjYWxpbmcgPSBmdW5jdGlvbihvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSB2WzBdO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gdlsxXTtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSB2WzJdO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgZ2l2ZW4gYW5nbGUgYXJvdW5kIGEgZ2l2ZW4gYXhpc1xuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC5yb3RhdGUoZGVzdCwgZGVzdCwgcmFkLCBheGlzKTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHBhcmFtIHt2ZWMzfSBheGlzIHRoZSBheGlzIHRvIHJvdGF0ZSBhcm91bmRcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5mcm9tUm90YXRpb24gPSBmdW5jdGlvbihvdXQsIHJhZCwgYXhpcykge1xuICAgIHZhciB4ID0gYXhpc1swXSwgeSA9IGF4aXNbMV0sIHogPSBheGlzWzJdLFxuICAgICAgICBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KSxcbiAgICAgICAgcywgYywgdDtcbiAgICBcbiAgICBpZiAoTWF0aC5hYnMobGVuKSA8IGdsTWF0cml4LkVQU0lMT04pIHsgcmV0dXJuIG51bGw7IH1cbiAgICBcbiAgICBsZW4gPSAxIC8gbGVuO1xuICAgIHggKj0gbGVuO1xuICAgIHkgKj0gbGVuO1xuICAgIHogKj0gbGVuO1xuICAgIFxuICAgIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIHQgPSAxIC0gYztcbiAgICBcbiAgICAvLyBQZXJmb3JtIHJvdGF0aW9uLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSA9IHggKiB4ICogdCArIGM7XG4gICAgb3V0WzFdID0geSAqIHggKiB0ICsgeiAqIHM7XG4gICAgb3V0WzJdID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSB4ICogeSAqIHQgLSB6ICogcztcbiAgICBvdXRbNV0gPSB5ICogeSAqIHQgKyBjO1xuICAgIG91dFs2XSA9IHogKiB5ICogdCArIHggKiBzO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geCAqIHogKiB0ICsgeSAqIHM7XG4gICAgb3V0WzldID0geSAqIHogKiB0IC0geCAqIHM7XG4gICAgb3V0WzEwXSA9IHogKiB6ICogdCArIGM7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWCBheGlzXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnJvdGF0ZVgoZGVzdCwgZGVzdCwgcmFkKTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmZyb21YUm90YXRpb24gPSBmdW5jdGlvbihvdXQsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgXG4gICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSAgPSAxO1xuICAgIG91dFsxXSAgPSAwO1xuICAgIG91dFsyXSAgPSAwO1xuICAgIG91dFszXSAgPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gYztcbiAgICBvdXRbNl0gPSBzO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAtcztcbiAgICBvdXRbMTBdID0gYztcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBZIGF4aXNcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQucm90YXRlWShkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVlSb3RhdGlvbiA9IGZ1bmN0aW9uKG91dCwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKTtcbiAgICBcbiAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdICA9IGM7XG4gICAgb3V0WzFdICA9IDA7XG4gICAgb3V0WzJdICA9IC1zO1xuICAgIG91dFszXSAgPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMTtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gcztcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSBjO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFogYXhpc1xuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC5yb3RhdGVaKGRlc3QsIGRlc3QsIHJhZCk7XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5mcm9tWlJvdGF0aW9uID0gZnVuY3Rpb24ob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIFxuICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICBvdXRbMF0gID0gYztcbiAgICBvdXRbMV0gID0gcztcbiAgICBvdXRbMl0gID0gMDtcbiAgICBvdXRbM10gID0gMDtcbiAgICBvdXRbNF0gPSAtcztcbiAgICBvdXRbNV0gPSBjO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDE7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uIGFuZCB2ZWN0b3IgdHJhbnNsYXRpb25cbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIHZlYyk7XG4gKiAgICAgdmFyIHF1YXRNYXQgPSBtYXQ0LmNyZWF0ZSgpO1xuICogICAgIHF1YXQ0LnRvTWF0NChxdWF0LCBxdWF0TWF0KTtcbiAqICAgICBtYXQ0Lm11bHRpcGx5KGRlc3QsIHF1YXRNYXQpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdDR9IHEgUm90YXRpb24gcXVhdGVybmlvblxuICogQHBhcmFtIHt2ZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmZyb21Sb3RhdGlvblRyYW5zbGF0aW9uID0gZnVuY3Rpb24gKG91dCwgcSwgdikge1xuICAgIC8vIFF1YXRlcm5pb24gbWF0aFxuICAgIHZhciB4ID0gcVswXSwgeSA9IHFbMV0sIHogPSBxWzJdLCB3ID0gcVszXSxcbiAgICAgICAgeDIgPSB4ICsgeCxcbiAgICAgICAgeTIgPSB5ICsgeSxcbiAgICAgICAgejIgPSB6ICsgeixcblxuICAgICAgICB4eCA9IHggKiB4MixcbiAgICAgICAgeHkgPSB4ICogeTIsXG4gICAgICAgIHh6ID0geCAqIHoyLFxuICAgICAgICB5eSA9IHkgKiB5MixcbiAgICAgICAgeXogPSB5ICogejIsXG4gICAgICAgIHp6ID0geiAqIHoyLFxuICAgICAgICB3eCA9IHcgKiB4MixcbiAgICAgICAgd3kgPSB3ICogeTIsXG4gICAgICAgIHd6ID0gdyAqIHoyO1xuXG4gICAgb3V0WzBdID0gMSAtICh5eSArIHp6KTtcbiAgICBvdXRbMV0gPSB4eSArIHd6O1xuICAgIG91dFsyXSA9IHh6IC0gd3k7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSB4eSAtIHd6O1xuICAgIG91dFs1XSA9IDEgLSAoeHggKyB6eik7XG4gICAgb3V0WzZdID0geXogKyB3eDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IHh6ICsgd3k7XG4gICAgb3V0WzldID0geXogLSB3eDtcbiAgICBvdXRbMTBdID0gMSAtICh4eCArIHl5KTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gdlswXTtcbiAgICBvdXRbMTNdID0gdlsxXTtcbiAgICBvdXRbMTRdID0gdlsyXTtcbiAgICBvdXRbMTVdID0gMTtcbiAgICBcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uLCB2ZWN0b3IgdHJhbnNsYXRpb24gYW5kIHZlY3RvciBzY2FsZVxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcbiAqICAgICB2YXIgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XG4gKiAgICAgcXVhdDQudG9NYXQ0KHF1YXQsIHF1YXRNYXQpO1xuICogICAgIG1hdDQubXVsdGlwbHkoZGVzdCwgcXVhdE1hdCk7XG4gKiAgICAgbWF0NC5zY2FsZShkZXN0LCBzY2FsZSlcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3F1YXQ0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7dmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gcyBTY2FsaW5nIHZlY3RvclxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmZyb21Sb3RhdGlvblRyYW5zbGF0aW9uU2NhbGUgPSBmdW5jdGlvbiAob3V0LCBxLCB2LCBzKSB7XG4gICAgLy8gUXVhdGVybmlvbiBtYXRoXG4gICAgdmFyIHggPSBxWzBdLCB5ID0gcVsxXSwgeiA9IHFbMl0sIHcgPSBxWzNdLFxuICAgICAgICB4MiA9IHggKyB4LFxuICAgICAgICB5MiA9IHkgKyB5LFxuICAgICAgICB6MiA9IHogKyB6LFxuXG4gICAgICAgIHh4ID0geCAqIHgyLFxuICAgICAgICB4eSA9IHggKiB5MixcbiAgICAgICAgeHogPSB4ICogejIsXG4gICAgICAgIHl5ID0geSAqIHkyLFxuICAgICAgICB5eiA9IHkgKiB6MixcbiAgICAgICAgenogPSB6ICogejIsXG4gICAgICAgIHd4ID0gdyAqIHgyLFxuICAgICAgICB3eSA9IHcgKiB5MixcbiAgICAgICAgd3ogPSB3ICogejIsXG4gICAgICAgIHN4ID0gc1swXSxcbiAgICAgICAgc3kgPSBzWzFdLFxuICAgICAgICBzeiA9IHNbMl07XG5cbiAgICBvdXRbMF0gPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcbiAgICBvdXRbMV0gPSAoeHkgKyB3eikgKiBzeDtcbiAgICBvdXRbMl0gPSAoeHogLSB3eSkgKiBzeDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9ICh4eSAtIHd6KSAqIHN5O1xuICAgIG91dFs1XSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xuICAgIG91dFs2XSA9ICh5eiArIHd4KSAqIHN5O1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gKHh6ICsgd3kpICogc3o7XG4gICAgb3V0WzldID0gKHl6IC0gd3gpICogc3o7XG4gICAgb3V0WzEwXSA9ICgxIC0gKHh4ICsgeXkpKSAqIHN6O1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSB2WzBdO1xuICAgIG91dFsxM10gPSB2WzFdO1xuICAgIG91dFsxNF0gPSB2WzJdO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIFxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24sIHZlY3RvciB0cmFuc2xhdGlvbiBhbmQgdmVjdG9yIHNjYWxlLCByb3RhdGluZyBhbmQgc2NhbGluZyBhcm91bmQgdGhlIGdpdmVuIG9yaWdpblxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCBvcmlnaW4pO1xuICogICAgIHZhciBxdWF0TWF0ID0gbWF0NC5jcmVhdGUoKTtcbiAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XG4gKiAgICAgbWF0NC5tdWx0aXBseShkZXN0LCBxdWF0TWF0KTtcbiAqICAgICBtYXQ0LnNjYWxlKGRlc3QsIHNjYWxlKVxuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIG5lZ2F0aXZlT3JpZ2luKTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3F1YXQ0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7dmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gcyBTY2FsaW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBvIFRoZSBvcmlnaW4gdmVjdG9yIGFyb3VuZCB3aGljaCB0byBzY2FsZSBhbmQgcm90YXRlXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZU9yaWdpbiA9IGZ1bmN0aW9uIChvdXQsIHEsIHYsIHMsIG8pIHtcbiAgLy8gUXVhdGVybmlvbiBtYXRoXG4gIHZhciB4ID0gcVswXSwgeSA9IHFbMV0sIHogPSBxWzJdLCB3ID0gcVszXSxcbiAgICAgIHgyID0geCArIHgsXG4gICAgICB5MiA9IHkgKyB5LFxuICAgICAgejIgPSB6ICsgeixcblxuICAgICAgeHggPSB4ICogeDIsXG4gICAgICB4eSA9IHggKiB5MixcbiAgICAgIHh6ID0geCAqIHoyLFxuICAgICAgeXkgPSB5ICogeTIsXG4gICAgICB5eiA9IHkgKiB6MixcbiAgICAgIHp6ID0geiAqIHoyLFxuICAgICAgd3ggPSB3ICogeDIsXG4gICAgICB3eSA9IHcgKiB5MixcbiAgICAgIHd6ID0gdyAqIHoyLFxuICAgICAgXG4gICAgICBzeCA9IHNbMF0sXG4gICAgICBzeSA9IHNbMV0sXG4gICAgICBzeiA9IHNbMl0sXG5cbiAgICAgIG94ID0gb1swXSxcbiAgICAgIG95ID0gb1sxXSxcbiAgICAgIG96ID0gb1syXTtcbiAgICAgIFxuICBvdXRbMF0gPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcbiAgb3V0WzFdID0gKHh5ICsgd3opICogc3g7XG4gIG91dFsyXSA9ICh4eiAtIHd5KSAqIHN4O1xuICBvdXRbM10gPSAwO1xuICBvdXRbNF0gPSAoeHkgLSB3eikgKiBzeTtcbiAgb3V0WzVdID0gKDEgLSAoeHggKyB6eikpICogc3k7XG4gIG91dFs2XSA9ICh5eiArIHd4KSAqIHN5O1xuICBvdXRbN10gPSAwO1xuICBvdXRbOF0gPSAoeHogKyB3eSkgKiBzejtcbiAgb3V0WzldID0gKHl6IC0gd3gpICogc3o7XG4gIG91dFsxMF0gPSAoMSAtICh4eCArIHl5KSkgKiBzejtcbiAgb3V0WzExXSA9IDA7XG4gIG91dFsxMl0gPSB2WzBdICsgb3ggLSAob3V0WzBdICogb3ggKyBvdXRbNF0gKiBveSArIG91dFs4XSAqIG96KTtcbiAgb3V0WzEzXSA9IHZbMV0gKyBveSAtIChvdXRbMV0gKiBveCArIG91dFs1XSAqIG95ICsgb3V0WzldICogb3opO1xuICBvdXRbMTRdID0gdlsyXSArIG96IC0gKG91dFsyXSAqIG94ICsgb3V0WzZdICogb3kgKyBvdXRbMTBdICogb3opO1xuICBvdXRbMTVdID0gMTtcbiAgICAgICAgXG4gIHJldHVybiBvdXQ7XG59O1xuXG5tYXQ0LmZyb21RdWF0ID0gZnVuY3Rpb24gKG91dCwgcSkge1xuICAgIHZhciB4ID0gcVswXSwgeSA9IHFbMV0sIHogPSBxWzJdLCB3ID0gcVszXSxcbiAgICAgICAgeDIgPSB4ICsgeCxcbiAgICAgICAgeTIgPSB5ICsgeSxcbiAgICAgICAgejIgPSB6ICsgeixcblxuICAgICAgICB4eCA9IHggKiB4MixcbiAgICAgICAgeXggPSB5ICogeDIsXG4gICAgICAgIHl5ID0geSAqIHkyLFxuICAgICAgICB6eCA9IHogKiB4MixcbiAgICAgICAgenkgPSB6ICogeTIsXG4gICAgICAgIHp6ID0geiAqIHoyLFxuICAgICAgICB3eCA9IHcgKiB4MixcbiAgICAgICAgd3kgPSB3ICogeTIsXG4gICAgICAgIHd6ID0gdyAqIHoyO1xuXG4gICAgb3V0WzBdID0gMSAtIHl5IC0geno7XG4gICAgb3V0WzFdID0geXggKyB3ejtcbiAgICBvdXRbMl0gPSB6eCAtIHd5O1xuICAgIG91dFszXSA9IDA7XG5cbiAgICBvdXRbNF0gPSB5eCAtIHd6O1xuICAgIG91dFs1XSA9IDEgLSB4eCAtIHp6O1xuICAgIG91dFs2XSA9IHp5ICsgd3g7XG4gICAgb3V0WzddID0gMDtcblxuICAgIG91dFs4XSA9IHp4ICsgd3k7XG4gICAgb3V0WzldID0genkgLSB3eDtcbiAgICBvdXRbMTBdID0gMSAtIHh4IC0geXk7XG4gICAgb3V0WzExXSA9IDA7XG5cbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGZydXN0dW0gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZWZ0IExlZnQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IGJvdHRvbSBCb3R0b20gYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSB0b3AgVG9wIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gZmFyIEZhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmZydXN0dW0gPSBmdW5jdGlvbiAob3V0LCBsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikge1xuICAgIHZhciBybCA9IDEgLyAocmlnaHQgLSBsZWZ0KSxcbiAgICAgICAgdGIgPSAxIC8gKHRvcCAtIGJvdHRvbSksXG4gICAgICAgIG5mID0gMSAvIChuZWFyIC0gZmFyKTtcbiAgICBvdXRbMF0gPSAobmVhciAqIDIpICogcmw7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAobmVhciAqIDIpICogdGI7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IChyaWdodCArIGxlZnQpICogcmw7XG4gICAgb3V0WzldID0gKHRvcCArIGJvdHRvbSkgKiB0YjtcbiAgICBvdXRbMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgb3V0WzExXSA9IC0xO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAoZmFyICogbmVhciAqIDIpICogbmY7XG4gICAgb3V0WzE1XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgcGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gYm91bmRzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHtudW1iZXJ9IGZvdnkgVmVydGljYWwgZmllbGQgb2YgdmlldyBpbiByYWRpYW5zXG4gKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IEFzcGVjdCByYXRpby4gdHlwaWNhbGx5IHZpZXdwb3J0IHdpZHRoL2hlaWdodFxuICogQHBhcmFtIHtudW1iZXJ9IG5lYXIgTmVhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5wZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uIChvdXQsIGZvdnksIGFzcGVjdCwgbmVhciwgZmFyKSB7XG4gICAgdmFyIGYgPSAxLjAgLyBNYXRoLnRhbihmb3Z5IC8gMiksXG4gICAgICAgIG5mID0gMSAvIChuZWFyIC0gZmFyKTtcbiAgICBvdXRbMF0gPSBmIC8gYXNwZWN0O1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gZjtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICBvdXRbMTFdID0gLTE7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9ICgyICogZmFyICogbmVhcikgKiBuZjtcbiAgICBvdXRbMTVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBmaWVsZCBvZiB2aWV3LlxuICogVGhpcyBpcyBwcmltYXJpbHkgdXNlZnVsIGZvciBnZW5lcmF0aW5nIHByb2plY3Rpb24gbWF0cmljZXMgdG8gYmUgdXNlZFxuICogd2l0aCB0aGUgc3RpbGwgZXhwZXJpZW1lbnRhbCBXZWJWUiBBUEkuXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHtudW1iZXJ9IGZvdiBPYmplY3QgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIHZhbHVlczogdXBEZWdyZWVzLCBkb3duRGVncmVlcywgbGVmdERlZ3JlZXMsIHJpZ2h0RGVncmVlc1xuICogQHBhcmFtIHtudW1iZXJ9IG5lYXIgTmVhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5wZXJzcGVjdGl2ZUZyb21GaWVsZE9mVmlldyA9IGZ1bmN0aW9uIChvdXQsIGZvdiwgbmVhciwgZmFyKSB7XG4gICAgdmFyIHVwVGFuID0gTWF0aC50YW4oZm92LnVwRGVncmVlcyAqIE1hdGguUEkvMTgwLjApLFxuICAgICAgICBkb3duVGFuID0gTWF0aC50YW4oZm92LmRvd25EZWdyZWVzICogTWF0aC5QSS8xODAuMCksXG4gICAgICAgIGxlZnRUYW4gPSBNYXRoLnRhbihmb3YubGVmdERlZ3JlZXMgKiBNYXRoLlBJLzE4MC4wKSxcbiAgICAgICAgcmlnaHRUYW4gPSBNYXRoLnRhbihmb3YucmlnaHREZWdyZWVzICogTWF0aC5QSS8xODAuMCksXG4gICAgICAgIHhTY2FsZSA9IDIuMCAvIChsZWZ0VGFuICsgcmlnaHRUYW4pLFxuICAgICAgICB5U2NhbGUgPSAyLjAgLyAodXBUYW4gKyBkb3duVGFuKTtcblxuICAgIG91dFswXSA9IHhTY2FsZTtcbiAgICBvdXRbMV0gPSAwLjA7XG4gICAgb3V0WzJdID0gMC4wO1xuICAgIG91dFszXSA9IDAuMDtcbiAgICBvdXRbNF0gPSAwLjA7XG4gICAgb3V0WzVdID0geVNjYWxlO1xuICAgIG91dFs2XSA9IDAuMDtcbiAgICBvdXRbN10gPSAwLjA7XG4gICAgb3V0WzhdID0gLSgobGVmdFRhbiAtIHJpZ2h0VGFuKSAqIHhTY2FsZSAqIDAuNSk7XG4gICAgb3V0WzldID0gKCh1cFRhbiAtIGRvd25UYW4pICogeVNjYWxlICogMC41KTtcbiAgICBvdXRbMTBdID0gZmFyIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFsxMV0gPSAtMS4wO1xuICAgIG91dFsxMl0gPSAwLjA7XG4gICAgb3V0WzEzXSA9IDAuMDtcbiAgICBvdXRbMTRdID0gKGZhciAqIG5lYXIpIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFsxNV0gPSAwLjA7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBvcnRob2dvbmFsIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IExlZnQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSByaWdodCBSaWdodCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IGJvdHRvbSBCb3R0b20gYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgVG9wIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gZmFyIEZhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0Lm9ydGhvID0gZnVuY3Rpb24gKG91dCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgbHIgPSAxIC8gKGxlZnQgLSByaWdodCksXG4gICAgICAgIGJ0ID0gMSAvIChib3R0b20gLSB0b3ApLFxuICAgICAgICBuZiA9IDEgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzBdID0gLTIgKiBscjtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IC0yICogYnQ7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMiAqIG5mO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAobGVmdCArIHJpZ2h0KSAqIGxyO1xuICAgIG91dFsxM10gPSAodG9wICsgYm90dG9tKSAqIGJ0O1xuICAgIG91dFsxNF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBsb29rLWF0IG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBleWUgcG9zaXRpb24sIGZvY2FsIHBvaW50LCBhbmQgdXAgYXhpc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7dmVjM30gZXllIFBvc2l0aW9uIG9mIHRoZSB2aWV3ZXJcbiAqIEBwYXJhbSB7dmVjM30gY2VudGVyIFBvaW50IHRoZSB2aWV3ZXIgaXMgbG9va2luZyBhdFxuICogQHBhcmFtIHt2ZWMzfSB1cCB2ZWMzIHBvaW50aW5nIHVwXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQubG9va0F0ID0gZnVuY3Rpb24gKG91dCwgZXllLCBjZW50ZXIsIHVwKSB7XG4gICAgdmFyIHgwLCB4MSwgeDIsIHkwLCB5MSwgeTIsIHowLCB6MSwgejIsIGxlbixcbiAgICAgICAgZXlleCA9IGV5ZVswXSxcbiAgICAgICAgZXlleSA9IGV5ZVsxXSxcbiAgICAgICAgZXlleiA9IGV5ZVsyXSxcbiAgICAgICAgdXB4ID0gdXBbMF0sXG4gICAgICAgIHVweSA9IHVwWzFdLFxuICAgICAgICB1cHogPSB1cFsyXSxcbiAgICAgICAgY2VudGVyeCA9IGNlbnRlclswXSxcbiAgICAgICAgY2VudGVyeSA9IGNlbnRlclsxXSxcbiAgICAgICAgY2VudGVyeiA9IGNlbnRlclsyXTtcblxuICAgIGlmIChNYXRoLmFicyhleWV4IC0gY2VudGVyeCkgPCBnbE1hdHJpeC5FUFNJTE9OICYmXG4gICAgICAgIE1hdGguYWJzKGV5ZXkgLSBjZW50ZXJ5KSA8IGdsTWF0cml4LkVQU0lMT04gJiZcbiAgICAgICAgTWF0aC5hYnMoZXlleiAtIGNlbnRlcnopIDwgZ2xNYXRyaXguRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gbWF0NC5pZGVudGl0eShvdXQpO1xuICAgIH1cblxuICAgIHowID0gZXlleCAtIGNlbnRlcng7XG4gICAgejEgPSBleWV5IC0gY2VudGVyeTtcbiAgICB6MiA9IGV5ZXogLSBjZW50ZXJ6O1xuXG4gICAgbGVuID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xuICAgIHowICo9IGxlbjtcbiAgICB6MSAqPSBsZW47XG4gICAgejIgKj0gbGVuO1xuXG4gICAgeDAgPSB1cHkgKiB6MiAtIHVweiAqIHoxO1xuICAgIHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcbiAgICB4MiA9IHVweCAqIHoxIC0gdXB5ICogejA7XG4gICAgbGVuID0gTWF0aC5zcXJ0KHgwICogeDAgKyB4MSAqIHgxICsgeDIgKiB4Mik7XG4gICAgaWYgKCFsZW4pIHtcbiAgICAgICAgeDAgPSAwO1xuICAgICAgICB4MSA9IDA7XG4gICAgICAgIHgyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB4MCAqPSBsZW47XG4gICAgICAgIHgxICo9IGxlbjtcbiAgICAgICAgeDIgKj0gbGVuO1xuICAgIH1cblxuICAgIHkwID0gejEgKiB4MiAtIHoyICogeDE7XG4gICAgeTEgPSB6MiAqIHgwIC0gejAgKiB4MjtcbiAgICB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgbGVuID0gTWF0aC5zcXJ0KHkwICogeTAgKyB5MSAqIHkxICsgeTIgKiB5Mik7XG4gICAgaWYgKCFsZW4pIHtcbiAgICAgICAgeTAgPSAwO1xuICAgICAgICB5MSA9IDA7XG4gICAgICAgIHkyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZW4gPSAxIC8gbGVuO1xuICAgICAgICB5MCAqPSBsZW47XG4gICAgICAgIHkxICo9IGxlbjtcbiAgICAgICAgeTIgKj0gbGVuO1xuICAgIH1cblxuICAgIG91dFswXSA9IHgwO1xuICAgIG91dFsxXSA9IHkwO1xuICAgIG91dFsyXSA9IHowO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0geDE7XG4gICAgb3V0WzVdID0geTE7XG4gICAgb3V0WzZdID0gejE7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSB4MjtcbiAgICBvdXRbOV0gPSB5MjtcbiAgICBvdXRbMTBdID0gejI7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IC0oeDAgKiBleWV4ICsgeDEgKiBleWV5ICsgeDIgKiBleWV6KTtcbiAgICBvdXRbMTNdID0gLSh5MCAqIGV5ZXggKyB5MSAqIGV5ZXkgKyB5MiAqIGV5ZXopO1xuICAgIG91dFsxNF0gPSAtKHowICogZXlleCArIHoxICogZXlleSArIHoyICogZXlleik7XG4gICAgb3V0WzE1XSA9IDE7XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gbWF0IG1hdHJpeCB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gKi9cbm1hdDQuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ21hdDQoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIGFbM10gKyAnLCAnICtcbiAgICAgICAgICAgICAgICAgICAgYVs0XSArICcsICcgKyBhWzVdICsgJywgJyArIGFbNl0gKyAnLCAnICsgYVs3XSArICcsICcgK1xuICAgICAgICAgICAgICAgICAgICBhWzhdICsgJywgJyArIGFbOV0gKyAnLCAnICsgYVsxMF0gKyAnLCAnICsgYVsxMV0gKyAnLCAnICsgXG4gICAgICAgICAgICAgICAgICAgIGFbMTJdICsgJywgJyArIGFbMTNdICsgJywgJyArIGFbMTRdICsgJywgJyArIGFbMTVdICsgJyknO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIEZyb2Jlbml1cyBub3JtIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIGNhbGN1bGF0ZSBGcm9iZW5pdXMgbm9ybSBvZlxuICogQHJldHVybnMge051bWJlcn0gRnJvYmVuaXVzIG5vcm1cbiAqL1xubWF0NC5mcm9iID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4oTWF0aC5zcXJ0KE1hdGgucG93KGFbMF0sIDIpICsgTWF0aC5wb3coYVsxXSwgMikgKyBNYXRoLnBvdyhhWzJdLCAyKSArIE1hdGgucG93KGFbM10sIDIpICsgTWF0aC5wb3coYVs0XSwgMikgKyBNYXRoLnBvdyhhWzVdLCAyKSArIE1hdGgucG93KGFbNl0sIDIpICsgTWF0aC5wb3coYVs3XSwgMikgKyBNYXRoLnBvdyhhWzhdLCAyKSArIE1hdGgucG93KGFbOV0sIDIpICsgTWF0aC5wb3coYVsxMF0sIDIpICsgTWF0aC5wb3coYVsxMV0sIDIpICsgTWF0aC5wb3coYVsxMl0sIDIpICsgTWF0aC5wb3coYVsxM10sIDIpICsgTWF0aC5wb3coYVsxNF0sIDIpICsgTWF0aC5wb3coYVsxNV0sIDIpICkpXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbWF0NDtcbiIsIi8qIENvcHlyaWdodCAoYykgMjAxNSwgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuICovXG5cbnZhciBnbE1hdHJpeCA9IHJlcXVpcmUoXCIuL2NvbW1vbi5qc1wiKTtcbnZhciBtYXQzID0gcmVxdWlyZShcIi4vbWF0My5qc1wiKTtcbnZhciB2ZWMzID0gcmVxdWlyZShcIi4vdmVjMy5qc1wiKTtcbnZhciB2ZWM0ID0gcmVxdWlyZShcIi4vdmVjNC5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgUXVhdGVybmlvblxuICogQG5hbWUgcXVhdFxuICovXG52YXIgcXVhdCA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgcXVhdFxuICpcbiAqIEByZXR1cm5zIHtxdWF0fSBhIG5ldyBxdWF0ZXJuaW9uXG4gKi9cbnF1YXQuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IDA7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2V0cyBhIHF1YXRlcm5pb24gdG8gcmVwcmVzZW50IHRoZSBzaG9ydGVzdCByb3RhdGlvbiBmcm9tIG9uZVxuICogdmVjdG9yIHRvIGFub3RoZXIuXG4gKlxuICogQm90aCB2ZWN0b3JzIGFyZSBhc3N1bWVkIHRvIGJlIHVuaXQgbGVuZ3RoLlxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvbi5cbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgaW5pdGlhbCB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgZGVzdGluYXRpb24gdmVjdG9yXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQucm90YXRpb25UbyA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgdG1wdmVjMyA9IHZlYzMuY3JlYXRlKCk7XG4gICAgdmFyIHhVbml0VmVjMyA9IHZlYzMuZnJvbVZhbHVlcygxLDAsMCk7XG4gICAgdmFyIHlVbml0VmVjMyA9IHZlYzMuZnJvbVZhbHVlcygwLDEsMCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgICAgIHZhciBkb3QgPSB2ZWMzLmRvdChhLCBiKTtcbiAgICAgICAgaWYgKGRvdCA8IC0wLjk5OTk5OSkge1xuICAgICAgICAgICAgdmVjMy5jcm9zcyh0bXB2ZWMzLCB4VW5pdFZlYzMsIGEpO1xuICAgICAgICAgICAgaWYgKHZlYzMubGVuZ3RoKHRtcHZlYzMpIDwgMC4wMDAwMDEpXG4gICAgICAgICAgICAgICAgdmVjMy5jcm9zcyh0bXB2ZWMzLCB5VW5pdFZlYzMsIGEpO1xuICAgICAgICAgICAgdmVjMy5ub3JtYWxpemUodG1wdmVjMywgdG1wdmVjMyk7XG4gICAgICAgICAgICBxdWF0LnNldEF4aXNBbmdsZShvdXQsIHRtcHZlYzMsIE1hdGguUEkpO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfSBlbHNlIGlmIChkb3QgPiAwLjk5OTk5OSkge1xuICAgICAgICAgICAgb3V0WzBdID0gMDtcbiAgICAgICAgICAgIG91dFsxXSA9IDA7XG4gICAgICAgICAgICBvdXRbMl0gPSAwO1xuICAgICAgICAgICAgb3V0WzNdID0gMTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2ZWMzLmNyb3NzKHRtcHZlYzMsIGEsIGIpO1xuICAgICAgICAgICAgb3V0WzBdID0gdG1wdmVjM1swXTtcbiAgICAgICAgICAgIG91dFsxXSA9IHRtcHZlYzNbMV07XG4gICAgICAgICAgICBvdXRbMl0gPSB0bXB2ZWMzWzJdO1xuICAgICAgICAgICAgb3V0WzNdID0gMSArIGRvdDtcbiAgICAgICAgICAgIHJldHVybiBxdWF0Lm5vcm1hbGl6ZShvdXQsIG91dCk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBzcGVjaWZpZWQgcXVhdGVybmlvbiB3aXRoIHZhbHVlcyBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlblxuICogYXhlcy4gRWFjaCBheGlzIGlzIGEgdmVjMyBhbmQgaXMgZXhwZWN0ZWQgdG8gYmUgdW5pdCBsZW5ndGggYW5kXG4gKiBwZXJwZW5kaWN1bGFyIHRvIGFsbCBvdGhlciBzcGVjaWZpZWQgYXhlcy5cbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IHZpZXcgIHRoZSB2ZWN0b3IgcmVwcmVzZW50aW5nIHRoZSB2aWV3aW5nIGRpcmVjdGlvblxuICogQHBhcmFtIHt2ZWMzfSByaWdodCB0aGUgdmVjdG9yIHJlcHJlc2VudGluZyB0aGUgbG9jYWwgXCJyaWdodFwiIGRpcmVjdGlvblxuICogQHBhcmFtIHt2ZWMzfSB1cCAgICB0aGUgdmVjdG9yIHJlcHJlc2VudGluZyB0aGUgbG9jYWwgXCJ1cFwiIGRpcmVjdGlvblxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LnNldEF4ZXMgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1hdHIgPSBtYXQzLmNyZWF0ZSgpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG91dCwgdmlldywgcmlnaHQsIHVwKSB7XG4gICAgICAgIG1hdHJbMF0gPSByaWdodFswXTtcbiAgICAgICAgbWF0clszXSA9IHJpZ2h0WzFdO1xuICAgICAgICBtYXRyWzZdID0gcmlnaHRbMl07XG5cbiAgICAgICAgbWF0clsxXSA9IHVwWzBdO1xuICAgICAgICBtYXRyWzRdID0gdXBbMV07XG4gICAgICAgIG1hdHJbN10gPSB1cFsyXTtcblxuICAgICAgICBtYXRyWzJdID0gLXZpZXdbMF07XG4gICAgICAgIG1hdHJbNV0gPSAtdmlld1sxXTtcbiAgICAgICAgbWF0cls4XSA9IC12aWV3WzJdO1xuXG4gICAgICAgIHJldHVybiBxdWF0Lm5vcm1hbGl6ZShvdXQsIHF1YXQuZnJvbU1hdDMob3V0LCBtYXRyKSk7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBxdWF0IGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgcXVhdGVybmlvblxuICpcbiAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0ZXJuaW9uIHRvIGNsb25lXG4gKiBAcmV0dXJucyB7cXVhdH0gYSBuZXcgcXVhdGVybmlvblxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuY2xvbmUgPSB2ZWM0LmNsb25lO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcXVhdCBpbml0aWFsaXplZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFogY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0gdyBXIGNvbXBvbmVudFxuICogQHJldHVybnMge3F1YXR9IGEgbmV3IHF1YXRlcm5pb25cbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LmZyb21WYWx1ZXMgPSB2ZWM0LmZyb21WYWx1ZXM7XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHF1YXQgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHRoZSBzb3VyY2UgcXVhdGVybmlvblxuICogQHJldHVybnMge3F1YXR9IG91dFxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuY29weSA9IHZlYzQuY29weTtcblxuLyoqXG4gKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSBxdWF0IHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB3IFcgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5zZXQgPSB2ZWM0LnNldDtcblxuLyoqXG4gKiBTZXQgYSBxdWF0IHRvIHRoZSBpZGVudGl0eSBxdWF0ZXJuaW9uXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQuaWRlbnRpdHkgPSBmdW5jdGlvbihvdXQpIHtcbiAgICBvdXRbMF0gPSAwO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldHMgYSBxdWF0IGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFuZCByb3RhdGlvbiBheGlzLFxuICogdGhlbiByZXR1cm5zIGl0LlxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHt2ZWMzfSBheGlzIHRoZSBheGlzIGFyb3VuZCB3aGljaCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIGluIHJhZGlhbnNcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqKi9cbnF1YXQuc2V0QXhpc0FuZ2xlID0gZnVuY3Rpb24ob3V0LCBheGlzLCByYWQpIHtcbiAgICByYWQgPSByYWQgKiAwLjU7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIG91dFswXSA9IHMgKiBheGlzWzBdO1xuICAgIG91dFsxXSA9IHMgKiBheGlzWzFdO1xuICAgIG91dFsyXSA9IHMgKiBheGlzWzJdO1xuICAgIG91dFszXSA9IE1hdGguY29zKHJhZCk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWRkcyB0d28gcXVhdCdzXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LmFkZCA9IHZlYzQuYWRkO1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIHF1YXQnc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQubXVsdGlwbHkgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICB2YXIgYXggPSBhWzBdLCBheSA9IGFbMV0sIGF6ID0gYVsyXSwgYXcgPSBhWzNdLFxuICAgICAgICBieCA9IGJbMF0sIGJ5ID0gYlsxXSwgYnogPSBiWzJdLCBidyA9IGJbM107XG5cbiAgICBvdXRbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xuICAgIG91dFsxXSA9IGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYno7XG4gICAgb3V0WzJdID0gYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieDtcbiAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgcXVhdC5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5xdWF0Lm11bCA9IHF1YXQubXVsdGlwbHk7XG5cbi8qKlxuICogU2NhbGVzIGEgcXVhdCBieSBhIHNjYWxhciBudW1iZXJcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHtxdWF0fSBhIHRoZSB2ZWN0b3IgdG8gc2NhbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgdmVjdG9yIGJ5XG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5zY2FsZSA9IHZlYzQuc2NhbGU7XG5cbi8qKlxuICogUm90YXRlcyBhIHF1YXRlcm5pb24gYnkgdGhlIGdpdmVuIGFuZ2xlIGFib3V0IHRoZSBYIGF4aXNcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCBxdWF0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byByb3RhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWQgYW5nbGUgKGluIHJhZGlhbnMpIHRvIHJvdGF0ZVxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LnJvdGF0ZVggPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICByYWQgKj0gMC41OyBcblxuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLCBhdyA9IGFbM10sXG4gICAgICAgIGJ4ID0gTWF0aC5zaW4ocmFkKSwgYncgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgb3V0WzBdID0gYXggKiBidyArIGF3ICogYng7XG4gICAgb3V0WzFdID0gYXkgKiBidyArIGF6ICogYng7XG4gICAgb3V0WzJdID0gYXogKiBidyAtIGF5ICogYng7XG4gICAgb3V0WzNdID0gYXcgKiBidyAtIGF4ICogYng7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlcyBhIHF1YXRlcm5pb24gYnkgdGhlIGdpdmVuIGFuZ2xlIGFib3V0IHRoZSBZIGF4aXNcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCBxdWF0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byByb3RhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWQgYW5nbGUgKGluIHJhZGlhbnMpIHRvIHJvdGF0ZVxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LnJvdGF0ZVkgPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICByYWQgKj0gMC41OyBcblxuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLCBhdyA9IGFbM10sXG4gICAgICAgIGJ5ID0gTWF0aC5zaW4ocmFkKSwgYncgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgb3V0WzBdID0gYXggKiBidyAtIGF6ICogYnk7XG4gICAgb3V0WzFdID0gYXkgKiBidyArIGF3ICogYnk7XG4gICAgb3V0WzJdID0gYXogKiBidyArIGF4ICogYnk7XG4gICAgb3V0WzNdID0gYXcgKiBidyAtIGF5ICogYnk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlcyBhIHF1YXRlcm5pb24gYnkgdGhlIGdpdmVuIGFuZ2xlIGFib3V0IHRoZSBaIGF4aXNcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCBxdWF0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byByb3RhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWQgYW5nbGUgKGluIHJhZGlhbnMpIHRvIHJvdGF0ZVxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LnJvdGF0ZVogPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICByYWQgKj0gMC41OyBcblxuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLCBhdyA9IGFbM10sXG4gICAgICAgIGJ6ID0gTWF0aC5zaW4ocmFkKSwgYncgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgb3V0WzBdID0gYXggKiBidyArIGF5ICogYno7XG4gICAgb3V0WzFdID0gYXkgKiBidyAtIGF4ICogYno7XG4gICAgb3V0WzJdID0gYXogKiBidyArIGF3ICogYno7XG4gICAgb3V0WzNdID0gYXcgKiBidyAtIGF6ICogYno7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgVyBjb21wb25lbnQgb2YgYSBxdWF0IGZyb20gdGhlIFgsIFksIGFuZCBaIGNvbXBvbmVudHMuXG4gKiBBc3N1bWVzIHRoYXQgcXVhdGVybmlvbiBpcyAxIHVuaXQgaW4gbGVuZ3RoLlxuICogQW55IGV4aXN0aW5nIFcgY29tcG9uZW50IHdpbGwgYmUgaWdub3JlZC5cbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIGNhbGN1bGF0ZSBXIGNvbXBvbmVudCBvZlxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LmNhbGN1bGF0ZVcgPSBmdW5jdGlvbiAob3V0LCBhKSB7XG4gICAgdmFyIHggPSBhWzBdLCB5ID0gYVsxXSwgeiA9IGFbMl07XG5cbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICBvdXRbM10gPSBNYXRoLnNxcnQoTWF0aC5hYnMoMS4wIC0geCAqIHggLSB5ICogeSAtIHogKiB6KSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHF1YXQnc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZG90IHByb2R1Y3Qgb2YgYSBhbmQgYlxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuZG90ID0gdmVjNC5kb3Q7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBxdWF0J3NcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICogQHJldHVybnMge3F1YXR9IG91dFxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQubGVycCA9IHZlYzQubGVycDtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIHNwaGVyaWNhbCBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBxdWF0XG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50IGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5zbGVycCA9IGZ1bmN0aW9uIChvdXQsIGEsIGIsIHQpIHtcbiAgICAvLyBiZW5jaG1hcmtzOlxuICAgIC8vICAgIGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tc2xlcnAtaW1wbGVtZW50YXRpb25zXG5cbiAgICB2YXIgYXggPSBhWzBdLCBheSA9IGFbMV0sIGF6ID0gYVsyXSwgYXcgPSBhWzNdLFxuICAgICAgICBieCA9IGJbMF0sIGJ5ID0gYlsxXSwgYnogPSBiWzJdLCBidyA9IGJbM107XG5cbiAgICB2YXIgICAgICAgIG9tZWdhLCBjb3NvbSwgc2lub20sIHNjYWxlMCwgc2NhbGUxO1xuXG4gICAgLy8gY2FsYyBjb3NpbmVcbiAgICBjb3NvbSA9IGF4ICogYnggKyBheSAqIGJ5ICsgYXogKiBieiArIGF3ICogYnc7XG4gICAgLy8gYWRqdXN0IHNpZ25zIChpZiBuZWNlc3NhcnkpXG4gICAgaWYgKCBjb3NvbSA8IDAuMCApIHtcbiAgICAgICAgY29zb20gPSAtY29zb207XG4gICAgICAgIGJ4ID0gLSBieDtcbiAgICAgICAgYnkgPSAtIGJ5O1xuICAgICAgICBieiA9IC0gYno7XG4gICAgICAgIGJ3ID0gLSBidztcbiAgICB9XG4gICAgLy8gY2FsY3VsYXRlIGNvZWZmaWNpZW50c1xuICAgIGlmICggKDEuMCAtIGNvc29tKSA+IDAuMDAwMDAxICkge1xuICAgICAgICAvLyBzdGFuZGFyZCBjYXNlIChzbGVycClcbiAgICAgICAgb21lZ2EgID0gTWF0aC5hY29zKGNvc29tKTtcbiAgICAgICAgc2lub20gID0gTWF0aC5zaW4ob21lZ2EpO1xuICAgICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbTtcbiAgICAgICAgc2NhbGUxID0gTWF0aC5zaW4odCAqIG9tZWdhKSAvIHNpbm9tO1xuICAgIH0gZWxzZSB7ICAgICAgICBcbiAgICAgICAgLy8gXCJmcm9tXCIgYW5kIFwidG9cIiBxdWF0ZXJuaW9ucyBhcmUgdmVyeSBjbG9zZSBcbiAgICAgICAgLy8gIC4uLiBzbyB3ZSBjYW4gZG8gYSBsaW5lYXIgaW50ZXJwb2xhdGlvblxuICAgICAgICBzY2FsZTAgPSAxLjAgLSB0O1xuICAgICAgICBzY2FsZTEgPSB0O1xuICAgIH1cbiAgICAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzXG4gICAgb3V0WzBdID0gc2NhbGUwICogYXggKyBzY2FsZTEgKiBieDtcbiAgICBvdXRbMV0gPSBzY2FsZTAgKiBheSArIHNjYWxlMSAqIGJ5O1xuICAgIG91dFsyXSA9IHNjYWxlMCAqIGF6ICsgc2NhbGUxICogYno7XG4gICAgb3V0WzNdID0gc2NhbGUwICogYXcgKyBzY2FsZTEgKiBidztcbiAgICBcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIHNwaGVyaWNhbCBsaW5lYXIgaW50ZXJwb2xhdGlvbiB3aXRoIHR3byBjb250cm9sIHBvaW50c1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge3F1YXR9IGMgdGhlIHRoaXJkIG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gZCB0aGUgZm91cnRoIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50XG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQuc3FsZXJwID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRlbXAxID0gcXVhdC5jcmVhdGUoKTtcbiAgdmFyIHRlbXAyID0gcXVhdC5jcmVhdGUoKTtcbiAgXG4gIHJldHVybiBmdW5jdGlvbiAob3V0LCBhLCBiLCBjLCBkLCB0KSB7XG4gICAgcXVhdC5zbGVycCh0ZW1wMSwgYSwgZCwgdCk7XG4gICAgcXVhdC5zbGVycCh0ZW1wMiwgYiwgYywgdCk7XG4gICAgcXVhdC5zbGVycChvdXQsIHRlbXAxLCB0ZW1wMiwgMiAqIHQgKiAoMSAtIHQpKTtcbiAgICBcbiAgICByZXR1cm4gb3V0O1xuICB9O1xufSgpKTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBpbnZlcnNlIG9mIGEgcXVhdFxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXQgdG8gY2FsY3VsYXRlIGludmVyc2Ugb2ZcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5pbnZlcnQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLFxuICAgICAgICBkb3QgPSBhMCphMCArIGExKmExICsgYTIqYTIgKyBhMyphMyxcbiAgICAgICAgaW52RG90ID0gZG90ID8gMS4wL2RvdCA6IDA7XG4gICAgXG4gICAgLy8gVE9ETzogV291bGQgYmUgZmFzdGVyIHRvIHJldHVybiBbMCwwLDAsMF0gaW1tZWRpYXRlbHkgaWYgZG90ID09IDBcblxuICAgIG91dFswXSA9IC1hMCppbnZEb3Q7XG4gICAgb3V0WzFdID0gLWExKmludkRvdDtcbiAgICBvdXRbMl0gPSAtYTIqaW52RG90O1xuICAgIG91dFszXSA9IGEzKmludkRvdDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBjb25qdWdhdGUgb2YgYSBxdWF0XG4gKiBJZiB0aGUgcXVhdGVybmlvbiBpcyBub3JtYWxpemVkLCB0aGlzIGZ1bmN0aW9uIGlzIGZhc3RlciB0aGFuIHF1YXQuaW52ZXJzZSBhbmQgcHJvZHVjZXMgdGhlIHNhbWUgcmVzdWx0LlxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXQgdG8gY2FsY3VsYXRlIGNvbmp1Z2F0ZSBvZlxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LmNvbmp1Z2F0ZSA9IGZ1bmN0aW9uIChvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICBvdXRbMl0gPSAtYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHF1YXRcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5sZW5ndGggPSB2ZWM0Lmxlbmd0aDtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHF1YXQubGVuZ3RofVxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQubGVuID0gcXVhdC5sZW5ndGg7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgYSBxdWF0XG4gKlxuICogQHBhcmFtIHtxdWF0fSBhIHZlY3RvciB0byBjYWxjdWxhdGUgc3F1YXJlZCBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgbGVuZ3RoIG9mIGFcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LnNxdWFyZWRMZW5ndGggPSB2ZWM0LnNxdWFyZWRMZW5ndGg7XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayBxdWF0LnNxdWFyZWRMZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5zcXJMZW4gPSBxdWF0LnNxdWFyZWRMZW5ndGg7XG5cbi8qKlxuICogTm9ybWFsaXplIGEgcXVhdFxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXRlcm5pb24gdG8gbm9ybWFsaXplXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5ub3JtYWxpemUgPSB2ZWM0Lm5vcm1hbGl6ZTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgcXVhdGVybmlvbiBmcm9tIHRoZSBnaXZlbiAzeDMgcm90YXRpb24gbWF0cml4LlxuICpcbiAqIE5PVEU6IFRoZSByZXN1bHRhbnQgcXVhdGVybmlvbiBpcyBub3Qgbm9ybWFsaXplZCwgc28geW91IHNob3VsZCBiZSBzdXJlXG4gKiB0byByZW5vcm1hbGl6ZSB0aGUgcXVhdGVybmlvbiB5b3Vyc2VsZiB3aGVyZSBuZWNlc3NhcnkuXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge21hdDN9IG0gcm90YXRpb24gbWF0cml4XG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5mcm9tTWF0MyA9IGZ1bmN0aW9uKG91dCwgbSkge1xuICAgIC8vIEFsZ29yaXRobSBpbiBLZW4gU2hvZW1ha2UncyBhcnRpY2xlIGluIDE5ODcgU0lHR1JBUEggY291cnNlIG5vdGVzXG4gICAgLy8gYXJ0aWNsZSBcIlF1YXRlcm5pb24gQ2FsY3VsdXMgYW5kIEZhc3QgQW5pbWF0aW9uXCIuXG4gICAgdmFyIGZUcmFjZSA9IG1bMF0gKyBtWzRdICsgbVs4XTtcbiAgICB2YXIgZlJvb3Q7XG5cbiAgICBpZiAoIGZUcmFjZSA+IDAuMCApIHtcbiAgICAgICAgLy8gfHd8ID4gMS8yLCBtYXkgYXMgd2VsbCBjaG9vc2UgdyA+IDEvMlxuICAgICAgICBmUm9vdCA9IE1hdGguc3FydChmVHJhY2UgKyAxLjApOyAgLy8gMndcbiAgICAgICAgb3V0WzNdID0gMC41ICogZlJvb3Q7XG4gICAgICAgIGZSb290ID0gMC41L2ZSb290OyAgLy8gMS8oNHcpXG4gICAgICAgIG91dFswXSA9IChtWzVdLW1bN10pKmZSb290O1xuICAgICAgICBvdXRbMV0gPSAobVs2XS1tWzJdKSpmUm9vdDtcbiAgICAgICAgb3V0WzJdID0gKG1bMV0tbVszXSkqZlJvb3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gfHd8IDw9IDEvMlxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGlmICggbVs0XSA+IG1bMF0gKVxuICAgICAgICAgIGkgPSAxO1xuICAgICAgICBpZiAoIG1bOF0gPiBtW2kqMytpXSApXG4gICAgICAgICAgaSA9IDI7XG4gICAgICAgIHZhciBqID0gKGkrMSklMztcbiAgICAgICAgdmFyIGsgPSAoaSsyKSUzO1xuICAgICAgICBcbiAgICAgICAgZlJvb3QgPSBNYXRoLnNxcnQobVtpKjMraV0tbVtqKjMral0tbVtrKjMra10gKyAxLjApO1xuICAgICAgICBvdXRbaV0gPSAwLjUgKiBmUm9vdDtcbiAgICAgICAgZlJvb3QgPSAwLjUgLyBmUm9vdDtcbiAgICAgICAgb3V0WzNdID0gKG1baiozK2tdIC0gbVtrKjMral0pICogZlJvb3Q7XG4gICAgICAgIG91dFtqXSA9IChtW2oqMytpXSArIG1baSozK2pdKSAqIGZSb290O1xuICAgICAgICBvdXRba10gPSAobVtrKjMraV0gKyBtW2kqMytrXSkgKiBmUm9vdDtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHF1YXRlbmlvblxuICpcbiAqIEBwYXJhbSB7cXVhdH0gdmVjIHZlY3RvciB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gKi9cbnF1YXQuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ3F1YXQoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIGFbM10gKyAnKSc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YXQ7XG4iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuXG52YXIgZ2xNYXRyaXggPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG5cbi8qKlxuICogQGNsYXNzIDIgRGltZW5zaW9uYWwgVmVjdG9yXG4gKiBAbmFtZSB2ZWMyXG4gKi9cbnZhciB2ZWMyID0ge307XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldywgZW1wdHkgdmVjMlxuICpcbiAqIEByZXR1cm5zIHt2ZWMyfSBhIG5ldyAyRCB2ZWN0b3JcbiAqL1xudmVjMi5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMik7XG4gICAgb3V0WzBdID0gMDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdmVjMiBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gY2xvbmVcbiAqIEByZXR1cm5zIHt2ZWMyfSBhIG5ldyAyRCB2ZWN0b3JcbiAqL1xudmVjMi5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMik7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdmVjMiBpbml0aWFsaXplZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAqIEByZXR1cm5zIHt2ZWMyfSBhIG5ldyAyRCB2ZWN0b3JcbiAqL1xudmVjMi5mcm9tVmFsdWVzID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgyKTtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHZlYzIgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHNvdXJjZSB2ZWN0b3JcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5jb3B5ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzIgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5zZXQgPSBmdW5jdGlvbihvdXQsIHgsIHkpIHtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWRkcyB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLmFkZCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0cyB2ZWN0b3IgYiBmcm9tIHZlY3RvciBhXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnN1YnRyYWN0ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAtIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLnN1YnRyYWN0fVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzIuc3ViID0gdmVjMi5zdWJ0cmFjdDtcblxuLyoqXG4gKiBNdWx0aXBsaWVzIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIubXVsdGlwbHkgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICogYlsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIubXVsdGlwbHl9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5tdWwgPSB2ZWMyLm11bHRpcGx5O1xuXG4vKipcbiAqIERpdmlkZXMgdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5kaXZpZGUgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC8gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC8gYlsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuZGl2aWRlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzIuZGl2ID0gdmVjMi5kaXZpZGU7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWluaW11bSBvZiB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLm1pbiA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWluKGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWluKGFbMV0sIGJbMV0pO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1heGltdW0gb2YgdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5tYXggPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBNYXRoLm1heChhWzBdLCBiWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLm1heChhWzFdLCBiWzFdKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTY2FsZXMgYSB2ZWMyIGJ5IGEgc2NhbGFyIG51bWJlclxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byBzY2FsZVxuICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSB2ZWN0b3IgYnlcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFkZHMgdHdvIHZlYzIncyBhZnRlciBzY2FsaW5nIHRoZSBzZWNvbmQgb3BlcmFuZCBieSBhIHNjYWxhciB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSB0aGUgYW1vdW50IHRvIHNjYWxlIGIgYnkgYmVmb3JlIGFkZGluZ1xuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnNjYWxlQW5kQWRkID0gZnVuY3Rpb24ob3V0LCBhLCBiLCBzY2FsZSkge1xuICAgIG91dFswXSA9IGFbMF0gKyAoYlswXSAqIHNjYWxlKTtcbiAgICBvdXRbMV0gPSBhWzFdICsgKGJbMV0gKiBzY2FsZSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cbnZlYzIuZGlzdGFuY2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXSxcbiAgICAgICAgeSA9IGJbMV0gLSBhWzFdO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCp4ICsgeSp5KTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLmRpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzIuZGlzdCA9IHZlYzIuZGlzdGFuY2U7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICovXG52ZWMyLnNxdWFyZWREaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdLFxuICAgICAgICB5ID0gYlsxXSAtIGFbMV07XG4gICAgcmV0dXJuIHgqeCArIHkqeTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLnNxdWFyZWREaXN0YW5jZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLnNxckRpc3QgPSB2ZWMyLnNxdWFyZWREaXN0YW5jZTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgYSB2ZWMyXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBhIHZlY3RvciB0byBjYWxjdWxhdGUgbGVuZ3RoIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBsZW5ndGggb2YgYVxuICovXG52ZWMyLmxlbmd0aCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCArIHkqeSk7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMi5sZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5sZW4gPSB2ZWMyLmxlbmd0aDtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiBhIHZlYzJcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBzcXVhcmVkIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBsZW5ndGggb2YgYVxuICovXG52ZWMyLnNxdWFyZWRMZW5ndGggPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV07XG4gICAgcmV0dXJuIHgqeCArIHkqeTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLnNxdWFyZWRMZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5zcXJMZW4gPSB2ZWMyLnNxdWFyZWRMZW5ndGg7XG5cbi8qKlxuICogTmVnYXRlcyB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzJcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHZlY3RvciB0byBuZWdhdGVcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5uZWdhdGUgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMlxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGludmVydFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLmludmVyc2UgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgb3V0WzBdID0gMS4wIC8gYVswXTtcbiAgb3V0WzFdID0gMS4wIC8gYVsxXTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIGEgdmVjMlxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIG5vcm1hbGl6ZVxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV07XG4gICAgdmFyIGxlbiA9IHgqeCArIHkqeTtcbiAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAvL1RPRE86IGV2YWx1YXRlIHVzZSBvZiBnbG1faW52c3FydCBoZXJlP1xuICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XG4gICAgICAgIG91dFswXSA9IGFbMF0gKiBsZW47XG4gICAgICAgIG91dFsxXSA9IGFbMV0gKiBsZW47XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGRvdCBwcm9kdWN0IG9mIGEgYW5kIGJcbiAqL1xudmVjMi5kb3QgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdO1xufTtcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjMidzXG4gKiBOb3RlIHRoYXQgdGhlIGNyb3NzIHByb2R1Y3QgbXVzdCBieSBkZWZpbml0aW9uIHByb2R1Y2UgYSAzRCB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzIuY3Jvc3MgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICB2YXIgeiA9IGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF07XG4gICAgb3V0WzBdID0gb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSB6O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgbGluZWFyIGludGVycG9sYXRpb24gYmV0d2VlbiB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLmxlcnAgPSBmdW5jdGlvbiAob3V0LCBhLCBiLCB0KSB7XG4gICAgdmFyIGF4ID0gYVswXSxcbiAgICAgICAgYXkgPSBhWzFdO1xuICAgIG91dFswXSA9IGF4ICsgdCAqIChiWzBdIC0gYXgpO1xuICAgIG91dFsxXSA9IGF5ICsgdCAqIChiWzFdIC0gYXkpO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHJhbmRvbSB2ZWN0b3Igd2l0aCB0aGUgZ2l2ZW4gc2NhbGVcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHtOdW1iZXJ9IFtzY2FsZV0gTGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgdmVjdG9yLiBJZiBvbW1pdHRlZCwgYSB1bml0IHZlY3RvciB3aWxsIGJlIHJldHVybmVkXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIucmFuZG9tID0gZnVuY3Rpb24gKG91dCwgc2NhbGUpIHtcbiAgICBzY2FsZSA9IHNjYWxlIHx8IDEuMDtcbiAgICB2YXIgciA9IGdsTWF0cml4LlJBTkRPTSgpICogMi4wICogTWF0aC5QSTtcbiAgICBvdXRbMF0gPSBNYXRoLmNvcyhyKSAqIHNjYWxlO1xuICAgIG91dFsxXSA9IE1hdGguc2luKHIpICogc2NhbGU7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgdmVjMiB3aXRoIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0Mn0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi50cmFuc2Zvcm1NYXQyID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICBvdXRbMF0gPSBtWzBdICogeCArIG1bMl0gKiB5O1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVszXSAqIHk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgdmVjMiB3aXRoIGEgbWF0MmRcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0ge21hdDJkfSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnRyYW5zZm9ybU1hdDJkID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICBvdXRbMF0gPSBtWzBdICogeCArIG1bMl0gKiB5ICsgbVs0XTtcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bM10gKiB5ICsgbVs1XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMyIHdpdGggYSBtYXQzXG4gKiAzcmQgdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcxJ1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0M30gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi50cmFuc2Zvcm1NYXQzID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICBvdXRbMF0gPSBtWzBdICogeCArIG1bM10gKiB5ICsgbVs2XTtcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bNF0gKiB5ICsgbVs3XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMyIHdpdGggYSBtYXQ0XG4gKiAzcmQgdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcwJ1xuICogNHRoIHZlY3RvciBjb21wb25lbnQgaXMgaW1wbGljaXRseSAnMSdcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0ge21hdDR9IG0gbWF0cml4IHRvIHRyYW5zZm9ybSB3aXRoXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIudHJhbnNmb3JtTWF0NCA9IGZ1bmN0aW9uKG91dCwgYSwgbSkge1xuICAgIHZhciB4ID0gYVswXSwgXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzEyXTtcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVsxM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGVyZm9ybSBzb21lIG9wZXJhdGlvbiBvdmVyIGFuIGFycmF5IG9mIHZlYzJzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGFycmF5IG9mIHZlY3RvcnMgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIE51bWJlciBvZiBlbGVtZW50cyBiZXR3ZWVuIHRoZSBzdGFydCBvZiBlYWNoIHZlYzIuIElmIDAgYXNzdW1lcyB0aWdodGx5IHBhY2tlZFxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCBOdW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IE51bWJlciBvZiB2ZWMycyB0byBpdGVyYXRlIG92ZXIuIElmIDAgaXRlcmF0ZXMgb3ZlciBlbnRpcmUgYXJyYXlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdmVjdG9yIGluIHRoZSBhcnJheVxuICogQHBhcmFtIHtPYmplY3R9IFthcmddIGFkZGl0aW9uYWwgYXJndW1lbnQgdG8gcGFzcyB0byBmblxuICogQHJldHVybnMge0FycmF5fSBhXG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5mb3JFYWNoID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ZWMgPSB2ZWMyLmNyZWF0ZSgpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGEsIHN0cmlkZSwgb2Zmc2V0LCBjb3VudCwgZm4sIGFyZykge1xuICAgICAgICB2YXIgaSwgbDtcbiAgICAgICAgaWYoIXN0cmlkZSkge1xuICAgICAgICAgICAgc3RyaWRlID0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFvZmZzZXQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKGNvdW50KSB7XG4gICAgICAgICAgICBsID0gTWF0aC5taW4oKGNvdW50ICogc3RyaWRlKSArIG9mZnNldCwgYS5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IGEubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGkgPSBvZmZzZXQ7IGkgPCBsOyBpICs9IHN0cmlkZSkge1xuICAgICAgICAgICAgdmVjWzBdID0gYVtpXTsgdmVjWzFdID0gYVtpKzFdO1xuICAgICAgICAgICAgZm4odmVjLCB2ZWMsIGFyZyk7XG4gICAgICAgICAgICBhW2ldID0gdmVjWzBdOyBhW2krMV0gPSB2ZWNbMV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBhO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IHZlYyB2ZWN0b3IgdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3RvclxuICovXG52ZWMyLnN0ciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuICd2ZWMyKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnKSc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZlYzI7XG4iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuXG52YXIgZ2xNYXRyaXggPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG5cbi8qKlxuICogQGNsYXNzIDMgRGltZW5zaW9uYWwgVmVjdG9yXG4gKiBAbmFtZSB2ZWMzXG4gKi9cbnZhciB2ZWMzID0ge307XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldywgZW1wdHkgdmVjM1xuICpcbiAqIEByZXR1cm5zIHt2ZWMzfSBhIG5ldyAzRCB2ZWN0b3JcbiAqL1xudmVjMy5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMyk7XG4gICAgb3V0WzBdID0gMDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB2ZWMzIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgdmVjdG9yXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBjbG9uZVxuICogQHJldHVybnMge3ZlYzN9IGEgbmV3IDNEIHZlY3RvclxuICovXG52ZWMzLmNsb25lID0gZnVuY3Rpb24oYSkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgzKTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHZlYzMgaW5pdGlhbGl6ZWQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geiBaIGNvbXBvbmVudFxuICogQHJldHVybnMge3ZlYzN9IGEgbmV3IDNEIHZlY3RvclxuICovXG52ZWMzLmZyb21WYWx1ZXMgPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDMpO1xuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICBvdXRbMl0gPSB6O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSB2ZWMzIHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBzb3VyY2UgdmVjdG9yXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuY29weSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzMgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFogY29tcG9uZW50XG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuc2V0ID0gZnVuY3Rpb24ob3V0LCB4LCB5LCB6KSB7XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIG91dFsyXSA9IHo7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWRkcyB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLmFkZCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gKyBiWzJdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0cyB2ZWN0b3IgYiBmcm9tIHZlY3RvciBhXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnN1YnRyYWN0ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAtIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAtIGJbMl07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLnN1YnRyYWN0fVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMuc3ViID0gdmVjMy5zdWJ0cmFjdDtcblxuLyoqXG4gKiBNdWx0aXBsaWVzIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMubXVsdGlwbHkgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICogYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICogYlsyXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMubXVsdGlwbHl9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5tdWwgPSB2ZWMzLm11bHRpcGx5O1xuXG4vKipcbiAqIERpdmlkZXMgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5kaXZpZGUgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC8gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC8gYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdIC8gYlsyXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMuZGl2aWRlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMuZGl2ID0gdmVjMy5kaXZpZGU7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWluaW11bSBvZiB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLm1pbiA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWluKGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWluKGFbMV0sIGJbMV0pO1xuICAgIG91dFsyXSA9IE1hdGgubWluKGFbMl0sIGJbMl0pO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1heGltdW0gb2YgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5tYXggPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBNYXRoLm1heChhWzBdLCBiWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLm1heChhWzFdLCBiWzFdKTtcbiAgICBvdXRbMl0gPSBNYXRoLm1heChhWzJdLCBiWzJdKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTY2FsZXMgYSB2ZWMzIGJ5IGEgc2NhbGFyIG51bWJlclxuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIHZlY3RvciB0byBzY2FsZVxuICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSB2ZWN0b3IgYnlcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFkZHMgdHdvIHZlYzMncyBhZnRlciBzY2FsaW5nIHRoZSBzZWNvbmQgb3BlcmFuZCBieSBhIHNjYWxhciB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSB0aGUgYW1vdW50IHRvIHNjYWxlIGIgYnkgYmVmb3JlIGFkZGluZ1xuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnNjYWxlQW5kQWRkID0gZnVuY3Rpb24ob3V0LCBhLCBiLCBzY2FsZSkge1xuICAgIG91dFswXSA9IGFbMF0gKyAoYlswXSAqIHNjYWxlKTtcbiAgICBvdXRbMV0gPSBhWzFdICsgKGJbMV0gKiBzY2FsZSk7XG4gICAgb3V0WzJdID0gYVsyXSArIChiWzJdICogc2NhbGUpO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICovXG52ZWMzLmRpc3RhbmNlID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciB4ID0gYlswXSAtIGFbMF0sXG4gICAgICAgIHkgPSBiWzFdIC0gYVsxXSxcbiAgICAgICAgeiA9IGJbMl0gLSBhWzJdO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCp4ICsgeSp5ICsgeip6KTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLmRpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMuZGlzdCA9IHZlYzMuZGlzdGFuY2U7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICovXG52ZWMzLnNxdWFyZWREaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdLFxuICAgICAgICB5ID0gYlsxXSAtIGFbMV0sXG4gICAgICAgIHogPSBiWzJdIC0gYVsyXTtcbiAgICByZXR1cm4geCp4ICsgeSp5ICsgeip6O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMuc3F1YXJlZERpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMuc3FyRGlzdCA9IHZlYzMuc3F1YXJlZERpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHZlYzNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gKi9cbnZlYzMubGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeik7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5sZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5sZW4gPSB2ZWMzLmxlbmd0aDtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiBhIHZlYzNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBzcXVhcmVkIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBsZW5ndGggb2YgYVxuICovXG52ZWMzLnNxdWFyZWRMZW5ndGggPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdO1xuICAgIHJldHVybiB4KnggKyB5KnkgKyB6Kno7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5zcXVhcmVkTGVuZ3RofVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMuc3FyTGVuID0gdmVjMy5zcXVhcmVkTGVuZ3RoO1xuXG4vKipcbiAqIE5lZ2F0ZXMgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB2ZWN0b3IgdG8gbmVnYXRlXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMubmVnYXRlID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gLWFbMF07XG4gICAgb3V0WzFdID0gLWFbMV07XG4gICAgb3V0WzJdID0gLWFbMl07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaW52ZXJzZSBvZiB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBpbnZlcnRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5pbnZlcnNlID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gIG91dFswXSA9IDEuMCAvIGFbMF07XG4gIG91dFsxXSA9IDEuMCAvIGFbMV07XG4gIG91dFsyXSA9IDEuMCAvIGFbMl07XG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIHZlYzNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBub3JtYWxpemVcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5ub3JtYWxpemUgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXTtcbiAgICB2YXIgbGVuID0geCp4ICsgeSp5ICsgeip6O1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIC8vVE9ETzogZXZhbHVhdGUgdXNlIG9mIGdsbV9pbnZzcXJ0IGhlcmU/XG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgb3V0WzBdID0gYVswXSAqIGxlbjtcbiAgICAgICAgb3V0WzFdID0gYVsxXSAqIGxlbjtcbiAgICAgICAgb3V0WzJdID0gYVsyXSAqIGxlbjtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZG90IHByb2R1Y3Qgb2YgYSBhbmQgYlxuICovXG52ZWMzLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV0gKyBhWzJdICogYlsyXTtcbn07XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5jcm9zcyA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLFxuICAgICAgICBieCA9IGJbMF0sIGJ5ID0gYlsxXSwgYnogPSBiWzJdO1xuXG4gICAgb3V0WzBdID0gYXkgKiBieiAtIGF6ICogYnk7XG4gICAgb3V0WzFdID0gYXogKiBieCAtIGF4ICogYno7XG4gICAgb3V0WzJdID0gYXggKiBieSAtIGF5ICogYng7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMubGVycCA9IGZ1bmN0aW9uIChvdXQsIGEsIGIsIHQpIHtcbiAgICB2YXIgYXggPSBhWzBdLFxuICAgICAgICBheSA9IGFbMV0sXG4gICAgICAgIGF6ID0gYVsyXTtcbiAgICBvdXRbMF0gPSBheCArIHQgKiAoYlswXSAtIGF4KTtcbiAgICBvdXRbMV0gPSBheSArIHQgKiAoYlsxXSAtIGF5KTtcbiAgICBvdXRbMl0gPSBheiArIHQgKiAoYlsyXSAtIGF6KTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGhlcm1pdGUgaW50ZXJwb2xhdGlvbiB3aXRoIHR3byBjb250cm9sIHBvaW50c1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYyB0aGUgdGhpcmQgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBkIHRoZSBmb3VydGggb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLmhlcm1pdGUgPSBmdW5jdGlvbiAob3V0LCBhLCBiLCBjLCBkLCB0KSB7XG4gIHZhciBmYWN0b3JUaW1lczIgPSB0ICogdCxcbiAgICAgIGZhY3RvcjEgPSBmYWN0b3JUaW1lczIgKiAoMiAqIHQgLSAzKSArIDEsXG4gICAgICBmYWN0b3IyID0gZmFjdG9yVGltZXMyICogKHQgLSAyKSArIHQsXG4gICAgICBmYWN0b3IzID0gZmFjdG9yVGltZXMyICogKHQgLSAxKSxcbiAgICAgIGZhY3RvcjQgPSBmYWN0b3JUaW1lczIgKiAoMyAtIDIgKiB0KTtcbiAgXG4gIG91dFswXSA9IGFbMF0gKiBmYWN0b3IxICsgYlswXSAqIGZhY3RvcjIgKyBjWzBdICogZmFjdG9yMyArIGRbMF0gKiBmYWN0b3I0O1xuICBvdXRbMV0gPSBhWzFdICogZmFjdG9yMSArIGJbMV0gKiBmYWN0b3IyICsgY1sxXSAqIGZhY3RvcjMgKyBkWzFdICogZmFjdG9yNDtcbiAgb3V0WzJdID0gYVsyXSAqIGZhY3RvcjEgKyBiWzJdICogZmFjdG9yMiArIGNbMl0gKiBmYWN0b3IzICsgZFsyXSAqIGZhY3RvcjQ7XG4gIFxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGJlemllciBpbnRlcnBvbGF0aW9uIHdpdGggdHdvIGNvbnRyb2wgcG9pbnRzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBjIHRoZSB0aGlyZCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGQgdGhlIGZvdXJ0aCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuYmV6aWVyID0gZnVuY3Rpb24gKG91dCwgYSwgYiwgYywgZCwgdCkge1xuICB2YXIgaW52ZXJzZUZhY3RvciA9IDEgLSB0LFxuICAgICAgaW52ZXJzZUZhY3RvclRpbWVzVHdvID0gaW52ZXJzZUZhY3RvciAqIGludmVyc2VGYWN0b3IsXG4gICAgICBmYWN0b3JUaW1lczIgPSB0ICogdCxcbiAgICAgIGZhY3RvcjEgPSBpbnZlcnNlRmFjdG9yVGltZXNUd28gKiBpbnZlcnNlRmFjdG9yLFxuICAgICAgZmFjdG9yMiA9IDMgKiB0ICogaW52ZXJzZUZhY3RvclRpbWVzVHdvLFxuICAgICAgZmFjdG9yMyA9IDMgKiBmYWN0b3JUaW1lczIgKiBpbnZlcnNlRmFjdG9yLFxuICAgICAgZmFjdG9yNCA9IGZhY3RvclRpbWVzMiAqIHQ7XG4gIFxuICBvdXRbMF0gPSBhWzBdICogZmFjdG9yMSArIGJbMF0gKiBmYWN0b3IyICsgY1swXSAqIGZhY3RvcjMgKyBkWzBdICogZmFjdG9yNDtcbiAgb3V0WzFdID0gYVsxXSAqIGZhY3RvcjEgKyBiWzFdICogZmFjdG9yMiArIGNbMV0gKiBmYWN0b3IzICsgZFsxXSAqIGZhY3RvcjQ7XG4gIG91dFsyXSA9IGFbMl0gKiBmYWN0b3IxICsgYlsyXSAqIGZhY3RvcjIgKyBjWzJdICogZmFjdG9yMyArIGRbMl0gKiBmYWN0b3I0O1xuICBcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIHZlY3RvciB3aXRoIHRoZSBnaXZlbiBzY2FsZVxuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXSBMZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3IuIElmIG9tbWl0dGVkLCBhIHVuaXQgdmVjdG9yIHdpbGwgYmUgcmV0dXJuZWRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5yYW5kb20gPSBmdW5jdGlvbiAob3V0LCBzY2FsZSkge1xuICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xuXG4gICAgdmFyIHIgPSBnbE1hdHJpeC5SQU5ET00oKSAqIDIuMCAqIE1hdGguUEk7XG4gICAgdmFyIHogPSAoZ2xNYXRyaXguUkFORE9NKCkgKiAyLjApIC0gMS4wO1xuICAgIHZhciB6U2NhbGUgPSBNYXRoLnNxcnQoMS4wLXoqeikgKiBzY2FsZTtcblxuICAgIG91dFswXSA9IE1hdGguY29zKHIpICogelNjYWxlO1xuICAgIG91dFsxXSA9IE1hdGguc2luKHIpICogelNjYWxlO1xuICAgIG91dFsyXSA9IHogKiBzY2FsZTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMzIHdpdGggYSBtYXQ0LlxuICogNHRoIHZlY3RvciBjb21wb25lbnQgaXMgaW1wbGljaXRseSAnMSdcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0ge21hdDR9IG0gbWF0cml4IHRvIHRyYW5zZm9ybSB3aXRoXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMudHJhbnNmb3JtTWF0NCA9IGZ1bmN0aW9uKG91dCwgYSwgbSkge1xuICAgIHZhciB4ID0gYVswXSwgeSA9IGFbMV0sIHogPSBhWzJdLFxuICAgICAgICB3ID0gbVszXSAqIHggKyBtWzddICogeSArIG1bMTFdICogeiArIG1bMTVdO1xuICAgIHcgPSB3IHx8IDEuMDtcbiAgICBvdXRbMF0gPSAobVswXSAqIHggKyBtWzRdICogeSArIG1bOF0gKiB6ICsgbVsxMl0pIC8gdztcbiAgICBvdXRbMV0gPSAobVsxXSAqIHggKyBtWzVdICogeSArIG1bOV0gKiB6ICsgbVsxM10pIC8gdztcbiAgICBvdXRbMl0gPSAobVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdKSAvIHc7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgdmVjMyB3aXRoIGEgbWF0My5cbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0ge21hdDR9IG0gdGhlIDN4MyBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy50cmFuc2Zvcm1NYXQzID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLCB5ID0gYVsxXSwgeiA9IGFbMl07XG4gICAgb3V0WzBdID0geCAqIG1bMF0gKyB5ICogbVszXSArIHogKiBtWzZdO1xuICAgIG91dFsxXSA9IHggKiBtWzFdICsgeSAqIG1bNF0gKyB6ICogbVs3XTtcbiAgICBvdXRbMl0gPSB4ICogbVsyXSArIHkgKiBtWzVdICsgeiAqIG1bOF07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgdmVjMyB3aXRoIGEgcXVhdFxuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7cXVhdH0gcSBxdWF0ZXJuaW9uIHRvIHRyYW5zZm9ybSB3aXRoXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMudHJhbnNmb3JtUXVhdCA9IGZ1bmN0aW9uKG91dCwgYSwgcSkge1xuICAgIC8vIGJlbmNobWFya3M6IGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tdHJhbnNmb3JtLXZlYzMtaW1wbGVtZW50YXRpb25zXG5cbiAgICB2YXIgeCA9IGFbMF0sIHkgPSBhWzFdLCB6ID0gYVsyXSxcbiAgICAgICAgcXggPSBxWzBdLCBxeSA9IHFbMV0sIHF6ID0gcVsyXSwgcXcgPSBxWzNdLFxuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXG4gICAgICAgIGl4ID0gcXcgKiB4ICsgcXkgKiB6IC0gcXogKiB5LFxuICAgICAgICBpeSA9IHF3ICogeSArIHF6ICogeCAtIHF4ICogeixcbiAgICAgICAgaXogPSBxdyAqIHogKyBxeCAqIHkgLSBxeSAqIHgsXG4gICAgICAgIGl3ID0gLXF4ICogeCAtIHF5ICogeSAtIHF6ICogejtcblxuICAgIC8vIGNhbGN1bGF0ZSByZXN1bHQgKiBpbnZlcnNlIHF1YXRcbiAgICBvdXRbMF0gPSBpeCAqIHF3ICsgaXcgKiAtcXggKyBpeSAqIC1xeiAtIGl6ICogLXF5O1xuICAgIG91dFsxXSA9IGl5ICogcXcgKyBpdyAqIC1xeSArIGl6ICogLXF4IC0gaXggKiAtcXo7XG4gICAgb3V0WzJdID0gaXogKiBxdyArIGl3ICogLXF6ICsgaXggKiAtcXkgLSBpeSAqIC1xeDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGUgYSAzRCB2ZWN0b3IgYXJvdW5kIHRoZSB4LWF4aXNcbiAqIEBwYXJhbSB7dmVjM30gb3V0IFRoZSByZWNlaXZpbmcgdmVjM1xuICogQHBhcmFtIHt2ZWMzfSBhIFRoZSB2ZWMzIHBvaW50IHRvIHJvdGF0ZVxuICogQHBhcmFtIHt2ZWMzfSBiIFRoZSBvcmlnaW4gb2YgdGhlIHJvdGF0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gYyBUaGUgYW5nbGUgb2Ygcm90YXRpb25cbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5yb3RhdGVYID0gZnVuY3Rpb24ob3V0LCBhLCBiLCBjKXtcbiAgIHZhciBwID0gW10sIHI9W107XG5cdCAgLy9UcmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxuXHQgIHBbMF0gPSBhWzBdIC0gYlswXTtcblx0ICBwWzFdID0gYVsxXSAtIGJbMV07XG4gIFx0cFsyXSA9IGFbMl0gLSBiWzJdO1xuXG5cdCAgLy9wZXJmb3JtIHJvdGF0aW9uXG5cdCAgclswXSA9IHBbMF07XG5cdCAgclsxXSA9IHBbMV0qTWF0aC5jb3MoYykgLSBwWzJdKk1hdGguc2luKGMpO1xuXHQgIHJbMl0gPSBwWzFdKk1hdGguc2luKGMpICsgcFsyXSpNYXRoLmNvcyhjKTtcblxuXHQgIC8vdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cblx0ICBvdXRbMF0gPSByWzBdICsgYlswXTtcblx0ICBvdXRbMV0gPSByWzFdICsgYlsxXTtcblx0ICBvdXRbMl0gPSByWzJdICsgYlsyXTtcblxuICBcdHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZSBhIDNEIHZlY3RvciBhcm91bmQgdGhlIHktYXhpc1xuICogQHBhcmFtIHt2ZWMzfSBvdXQgVGhlIHJlY2VpdmluZyB2ZWMzXG4gKiBAcGFyYW0ge3ZlYzN9IGEgVGhlIHZlYzMgcG9pbnQgdG8gcm90YXRlXG4gKiBAcGFyYW0ge3ZlYzN9IGIgVGhlIG9yaWdpbiBvZiB0aGUgcm90YXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBjIFRoZSBhbmdsZSBvZiByb3RhdGlvblxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnJvdGF0ZVkgPSBmdW5jdGlvbihvdXQsIGEsIGIsIGMpe1xuICBcdHZhciBwID0gW10sIHI9W107XG4gIFx0Ly9UcmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxuICBcdHBbMF0gPSBhWzBdIC0gYlswXTtcbiAgXHRwWzFdID0gYVsxXSAtIGJbMV07XG4gIFx0cFsyXSA9IGFbMl0gLSBiWzJdO1xuICBcbiAgXHQvL3BlcmZvcm0gcm90YXRpb25cbiAgXHRyWzBdID0gcFsyXSpNYXRoLnNpbihjKSArIHBbMF0qTWF0aC5jb3MoYyk7XG4gIFx0clsxXSA9IHBbMV07XG4gIFx0clsyXSA9IHBbMl0qTWF0aC5jb3MoYykgLSBwWzBdKk1hdGguc2luKGMpO1xuICBcbiAgXHQvL3RyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gIFx0b3V0WzBdID0gclswXSArIGJbMF07XG4gIFx0b3V0WzFdID0gclsxXSArIGJbMV07XG4gIFx0b3V0WzJdID0gclsyXSArIGJbMl07XG4gIFxuICBcdHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZSBhIDNEIHZlY3RvciBhcm91bmQgdGhlIHotYXhpc1xuICogQHBhcmFtIHt2ZWMzfSBvdXQgVGhlIHJlY2VpdmluZyB2ZWMzXG4gKiBAcGFyYW0ge3ZlYzN9IGEgVGhlIHZlYzMgcG9pbnQgdG8gcm90YXRlXG4gKiBAcGFyYW0ge3ZlYzN9IGIgVGhlIG9yaWdpbiBvZiB0aGUgcm90YXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBjIFRoZSBhbmdsZSBvZiByb3RhdGlvblxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnJvdGF0ZVogPSBmdW5jdGlvbihvdXQsIGEsIGIsIGMpe1xuICBcdHZhciBwID0gW10sIHI9W107XG4gIFx0Ly9UcmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxuICBcdHBbMF0gPSBhWzBdIC0gYlswXTtcbiAgXHRwWzFdID0gYVsxXSAtIGJbMV07XG4gIFx0cFsyXSA9IGFbMl0gLSBiWzJdO1xuICBcbiAgXHQvL3BlcmZvcm0gcm90YXRpb25cbiAgXHRyWzBdID0gcFswXSpNYXRoLmNvcyhjKSAtIHBbMV0qTWF0aC5zaW4oYyk7XG4gIFx0clsxXSA9IHBbMF0qTWF0aC5zaW4oYykgKyBwWzFdKk1hdGguY29zKGMpO1xuICBcdHJbMl0gPSBwWzJdO1xuICBcbiAgXHQvL3RyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXG4gIFx0b3V0WzBdID0gclswXSArIGJbMF07XG4gIFx0b3V0WzFdID0gclsxXSArIGJbMV07XG4gIFx0b3V0WzJdID0gclsyXSArIGJbMl07XG4gIFxuICBcdHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBlcmZvcm0gc29tZSBvcGVyYXRpb24gb3ZlciBhbiBhcnJheSBvZiB2ZWMzcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhIHRoZSBhcnJheSBvZiB2ZWN0b3JzIHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSBOdW1iZXIgb2YgZWxlbWVudHMgYmV0d2VlbiB0aGUgc3RhcnQgb2YgZWFjaCB2ZWMzLiBJZiAwIGFzc3VtZXMgdGlnaHRseSBwYWNrZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgTnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXlcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudCBOdW1iZXIgb2YgdmVjM3MgdG8gaXRlcmF0ZSBvdmVyLiBJZiAwIGl0ZXJhdGVzIG92ZXIgZW50aXJlIGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHZlY3RvciBpbiB0aGUgYXJyYXlcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYXJnXSBhZGRpdGlvbmFsIGFyZ3VtZW50IHRvIHBhc3MgdG8gZm5cbiAqIEByZXR1cm5zIHtBcnJheX0gYVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMuZm9yRWFjaCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgdmVjID0gdmVjMy5jcmVhdGUoKTtcblxuICAgIHJldHVybiBmdW5jdGlvbihhLCBzdHJpZGUsIG9mZnNldCwgY291bnQsIGZuLCBhcmcpIHtcbiAgICAgICAgdmFyIGksIGw7XG4gICAgICAgIGlmKCFzdHJpZGUpIHtcbiAgICAgICAgICAgIHN0cmlkZSA9IDM7XG4gICAgICAgIH1cblxuICAgICAgICBpZighb2Zmc2V0KSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihjb3VudCkge1xuICAgICAgICAgICAgbCA9IE1hdGgubWluKChjb3VudCAqIHN0cmlkZSkgKyBvZmZzZXQsIGEubGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSBhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihpID0gb2Zmc2V0OyBpIDwgbDsgaSArPSBzdHJpZGUpIHtcbiAgICAgICAgICAgIHZlY1swXSA9IGFbaV07IHZlY1sxXSA9IGFbaSsxXTsgdmVjWzJdID0gYVtpKzJdO1xuICAgICAgICAgICAgZm4odmVjLCB2ZWMsIGFyZyk7XG4gICAgICAgICAgICBhW2ldID0gdmVjWzBdOyBhW2krMV0gPSB2ZWNbMV07IGFbaSsyXSA9IHZlY1syXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogR2V0IHRoZSBhbmdsZSBiZXR3ZWVuIHR3byAzRCB2ZWN0b3JzXG4gKiBAcGFyYW0ge3ZlYzN9IGEgVGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiBUaGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBhbmdsZSBpbiByYWRpYW5zXG4gKi9cbnZlYzMuYW5nbGUgPSBmdW5jdGlvbihhLCBiKSB7XG4gICBcbiAgICB2YXIgdGVtcEEgPSB2ZWMzLmZyb21WYWx1ZXMoYVswXSwgYVsxXSwgYVsyXSk7XG4gICAgdmFyIHRlbXBCID0gdmVjMy5mcm9tVmFsdWVzKGJbMF0sIGJbMV0sIGJbMl0pO1xuIFxuICAgIHZlYzMubm9ybWFsaXplKHRlbXBBLCB0ZW1wQSk7XG4gICAgdmVjMy5ub3JtYWxpemUodGVtcEIsIHRlbXBCKTtcbiBcbiAgICB2YXIgY29zaW5lID0gdmVjMy5kb3QodGVtcEEsIHRlbXBCKTtcblxuICAgIGlmKGNvc2luZSA+IDEuMCl7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLmFjb3MoY29zaW5lKTtcbiAgICB9ICAgICBcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjM30gdmVjIHZlY3RvciB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gKi9cbnZlYzMuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ3ZlYzMoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJyknO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB2ZWMzO1xuIiwiLyogQ29weXJpZ2h0IChjKSAyMDE1LCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cblxudmFyIGdsTWF0cml4ID0gcmVxdWlyZShcIi4vY29tbW9uLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyA0IERpbWVuc2lvbmFsIFZlY3RvclxuICogQG5hbWUgdmVjNFxuICovXG52YXIgdmVjNCA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcsIGVtcHR5IHZlYzRcbiAqXG4gKiBAcmV0dXJucyB7dmVjNH0gYSBuZXcgNEQgdmVjdG9yXG4gKi9cbnZlYzQuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IDA7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB2ZWM0IGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgdmVjdG9yXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBjbG9uZVxuICogQHJldHVybnMge3ZlYzR9IGEgbmV3IDREIHZlY3RvclxuICovXG52ZWM0LmNsb25lID0gZnVuY3Rpb24oYSkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSg0KTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdmVjNCBpbml0aWFsaXplZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFogY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0gdyBXIGNvbXBvbmVudFxuICogQHJldHVybnMge3ZlYzR9IGEgbmV3IDREIHZlY3RvclxuICovXG52ZWM0LmZyb21WYWx1ZXMgPSBmdW5jdGlvbih4LCB5LCB6LCB3KSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICBvdXRbMl0gPSB6O1xuICAgIG91dFszXSA9IHc7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHZlYzQgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIHNvdXJjZSB2ZWN0b3JcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5jb3B5ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWM0IHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geiBaIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHcgVyBjb21wb25lbnRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5zZXQgPSBmdW5jdGlvbihvdXQsIHgsIHksIHosIHcpIHtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICBvdXRbM10gPSB3O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFkZHMgdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5hZGQgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICsgYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdICsgYlszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdHMgdmVjdG9yIGIgZnJvbSB2ZWN0b3IgYVxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5zdWJ0cmFjdCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLSBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gLSBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gLSBiWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5zdWJ0cmFjdH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWM0LnN1YiA9IHZlYzQuc3VidHJhY3Q7XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0Lm11bHRpcGx5ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAqIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAqIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSAqIGJbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWM0Lm11bHRpcGx5fVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQubXVsID0gdmVjNC5tdWx0aXBseTtcblxuLyoqXG4gKiBEaXZpZGVzIHR3byB2ZWM0J3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQuZGl2aWRlID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAvIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAvIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAvIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSAvIGJbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LmRpdmlkZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWM0LmRpdiA9IHZlYzQuZGl2aWRlO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1pbmltdW0gb2YgdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5taW4gPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBNYXRoLm1pbihhWzBdLCBiWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLm1pbihhWzFdLCBiWzFdKTtcbiAgICBvdXRbMl0gPSBNYXRoLm1pbihhWzJdLCBiWzJdKTtcbiAgICBvdXRbM10gPSBNYXRoLm1pbihhWzNdLCBiWzNdKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXhpbXVtIG9mIHR3byB2ZWM0J3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQubWF4ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5tYXgoYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5tYXgoYVsyXSwgYlsyXSk7XG4gICAgb3V0WzNdID0gTWF0aC5tYXgoYVszXSwgYlszXSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2NhbGVzIGEgdmVjNCBieSBhIHNjYWxhciBudW1iZXJcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSB2ZWN0b3IgdG8gc2NhbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgdmVjdG9yIGJ5XG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQuc2NhbGUgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYjtcbiAgICBvdXRbMV0gPSBhWzFdICogYjtcbiAgICBvdXRbMl0gPSBhWzJdICogYjtcbiAgICBvdXRbM10gPSBhWzNdICogYjtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBZGRzIHR3byB2ZWM0J3MgYWZ0ZXIgc2NhbGluZyB0aGUgc2Vjb25kIG9wZXJhbmQgYnkgYSBzY2FsYXIgdmFsdWVcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIGFtb3VudCB0byBzY2FsZSBiIGJ5IGJlZm9yZSBhZGRpbmdcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5zY2FsZUFuZEFkZCA9IGZ1bmN0aW9uKG91dCwgYSwgYiwgc2NhbGUpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgKGJbMF0gKiBzY2FsZSk7XG4gICAgb3V0WzFdID0gYVsxXSArIChiWzFdICogc2NhbGUpO1xuICAgIG91dFsyXSA9IGFbMl0gKyAoYlsyXSAqIHNjYWxlKTtcbiAgICBvdXRbM10gPSBhWzNdICsgKGJbM10gKiBzY2FsZSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cbnZlYzQuZGlzdGFuY2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXSxcbiAgICAgICAgeSA9IGJbMV0gLSBhWzFdLFxuICAgICAgICB6ID0gYlsyXSAtIGFbMl0sXG4gICAgICAgIHcgPSBiWzNdIC0gYVszXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeiArIHcqdyk7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5kaXN0YW5jZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWM0LmRpc3QgPSB2ZWM0LmRpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xudmVjNC5zcXVhcmVkRGlzdGFuY2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXSxcbiAgICAgICAgeSA9IGJbMV0gLSBhWzFdLFxuICAgICAgICB6ID0gYlsyXSAtIGFbMl0sXG4gICAgICAgIHcgPSBiWzNdIC0gYVszXTtcbiAgICByZXR1cm4geCp4ICsgeSp5ICsgeip6ICsgdyp3O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQuc3F1YXJlZERpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQuc3FyRGlzdCA9IHZlYzQuc3F1YXJlZERpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHZlYzRcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gKi9cbnZlYzQubGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXSxcbiAgICAgICAgdyA9IGFbM107XG4gICAgcmV0dXJuIE1hdGguc3FydCh4KnggKyB5KnkgKyB6KnogKyB3KncpO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQubGVuZ3RofVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQubGVuID0gdmVjNC5sZW5ndGg7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgYSB2ZWM0XG4gKlxuICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBjYWxjdWxhdGUgc3F1YXJlZCBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgbGVuZ3RoIG9mIGFcbiAqL1xudmVjNC5zcXVhcmVkTGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXSxcbiAgICAgICAgdyA9IGFbM107XG4gICAgcmV0dXJuIHgqeCArIHkqeSArIHoqeiArIHcqdztcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LnNxdWFyZWRMZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5zcXJMZW4gPSB2ZWM0LnNxdWFyZWRMZW5ndGg7XG5cbi8qKlxuICogTmVnYXRlcyB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzRcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBuZWdhdGVcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5uZWdhdGUgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICBvdXRbMl0gPSAtYVsyXTtcbiAgICBvdXRbM10gPSAtYVszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjNFxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGludmVydFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LmludmVyc2UgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgb3V0WzBdID0gMS4wIC8gYVswXTtcbiAgb3V0WzFdID0gMS4wIC8gYVsxXTtcbiAgb3V0WzJdID0gMS4wIC8gYVsyXTtcbiAgb3V0WzNdID0gMS4wIC8gYVszXTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIGEgdmVjNFxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIG5vcm1hbGl6ZVxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0Lm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdLFxuICAgICAgICB3ID0gYVszXTtcbiAgICB2YXIgbGVuID0geCp4ICsgeSp5ICsgeip6ICsgdyp3O1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgb3V0WzBdID0geCAqIGxlbjtcbiAgICAgICAgb3V0WzFdID0geSAqIGxlbjtcbiAgICAgICAgb3V0WzJdID0geiAqIGxlbjtcbiAgICAgICAgb3V0WzNdID0gdyAqIGxlbjtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZG90IHByb2R1Y3Qgb2YgYSBhbmQgYlxuICovXG52ZWM0LmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV0gKyBhWzJdICogYlsyXSArIGFbM10gKiBiWzNdO1xufTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50IGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5sZXJwID0gZnVuY3Rpb24gKG91dCwgYSwgYiwgdCkge1xuICAgIHZhciBheCA9IGFbMF0sXG4gICAgICAgIGF5ID0gYVsxXSxcbiAgICAgICAgYXogPSBhWzJdLFxuICAgICAgICBhdyA9IGFbM107XG4gICAgb3V0WzBdID0gYXggKyB0ICogKGJbMF0gLSBheCk7XG4gICAgb3V0WzFdID0gYXkgKyB0ICogKGJbMV0gLSBheSk7XG4gICAgb3V0WzJdID0gYXogKyB0ICogKGJbMl0gLSBheik7XG4gICAgb3V0WzNdID0gYXcgKyB0ICogKGJbM10gLSBhdyk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIHZlY3RvciB3aXRoIHRoZSBnaXZlbiBzY2FsZVxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXSBMZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3IuIElmIG9tbWl0dGVkLCBhIHVuaXQgdmVjdG9yIHdpbGwgYmUgcmV0dXJuZWRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5yYW5kb20gPSBmdW5jdGlvbiAob3V0LCBzY2FsZSkge1xuICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xuXG4gICAgLy9UT0RPOiBUaGlzIGlzIGEgcHJldHR5IGF3ZnVsIHdheSBvZiBkb2luZyB0aGlzLiBGaW5kIHNvbWV0aGluZyBiZXR0ZXIuXG4gICAgb3V0WzBdID0gZ2xNYXRyaXguUkFORE9NKCk7XG4gICAgb3V0WzFdID0gZ2xNYXRyaXguUkFORE9NKCk7XG4gICAgb3V0WzJdID0gZ2xNYXRyaXguUkFORE9NKCk7XG4gICAgb3V0WzNdID0gZ2xNYXRyaXguUkFORE9NKCk7XG4gICAgdmVjNC5ub3JtYWxpemUob3V0LCBvdXQpO1xuICAgIHZlYzQuc2NhbGUob3V0LCBvdXQsIHNjYWxlKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWM0IHdpdGggYSBtYXQ0LlxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC50cmFuc2Zvcm1NYXQ0ID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLCB5ID0gYVsxXSwgeiA9IGFbMl0sIHcgPSBhWzNdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzhdICogeiArIG1bMTJdICogdztcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVs5XSAqIHogKyBtWzEzXSAqIHc7XG4gICAgb3V0WzJdID0gbVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdICogdztcbiAgICBvdXRbM10gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzQgd2l0aCBhIHF1YXRcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0ge3F1YXR9IHEgcXVhdGVybmlvbiB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnRyYW5zZm9ybVF1YXQgPSBmdW5jdGlvbihvdXQsIGEsIHEpIHtcbiAgICB2YXIgeCA9IGFbMF0sIHkgPSBhWzFdLCB6ID0gYVsyXSxcbiAgICAgICAgcXggPSBxWzBdLCBxeSA9IHFbMV0sIHF6ID0gcVsyXSwgcXcgPSBxWzNdLFxuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXG4gICAgICAgIGl4ID0gcXcgKiB4ICsgcXkgKiB6IC0gcXogKiB5LFxuICAgICAgICBpeSA9IHF3ICogeSArIHF6ICogeCAtIHF4ICogeixcbiAgICAgICAgaXogPSBxdyAqIHogKyBxeCAqIHkgLSBxeSAqIHgsXG4gICAgICAgIGl3ID0gLXF4ICogeCAtIHF5ICogeSAtIHF6ICogejtcblxuICAgIC8vIGNhbGN1bGF0ZSByZXN1bHQgKiBpbnZlcnNlIHF1YXRcbiAgICBvdXRbMF0gPSBpeCAqIHF3ICsgaXcgKiAtcXggKyBpeSAqIC1xeiAtIGl6ICogLXF5O1xuICAgIG91dFsxXSA9IGl5ICogcXcgKyBpdyAqIC1xeSArIGl6ICogLXF4IC0gaXggKiAtcXo7XG4gICAgb3V0WzJdID0gaXogKiBxdyArIGl3ICogLXF6ICsgaXggKiAtcXkgLSBpeSAqIC1xeDtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBlcmZvcm0gc29tZSBvcGVyYXRpb24gb3ZlciBhbiBhcnJheSBvZiB2ZWM0cy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhIHRoZSBhcnJheSBvZiB2ZWN0b3JzIHRvIGl0ZXJhdGUgb3ZlclxuICogQHBhcmFtIHtOdW1iZXJ9IHN0cmlkZSBOdW1iZXIgb2YgZWxlbWVudHMgYmV0d2VlbiB0aGUgc3RhcnQgb2YgZWFjaCB2ZWM0LiBJZiAwIGFzc3VtZXMgdGlnaHRseSBwYWNrZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgTnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXlcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudCBOdW1iZXIgb2YgdmVjNHMgdG8gaXRlcmF0ZSBvdmVyLiBJZiAwIGl0ZXJhdGVzIG92ZXIgZW50aXJlIGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBjYWxsIGZvciBlYWNoIHZlY3RvciBpbiB0aGUgYXJyYXlcbiAqIEBwYXJhbSB7T2JqZWN0fSBbYXJnXSBhZGRpdGlvbmFsIGFyZ3VtZW50IHRvIHBhc3MgdG8gZm5cbiAqIEByZXR1cm5zIHtBcnJheX0gYVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQuZm9yRWFjaCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgdmVjID0gdmVjNC5jcmVhdGUoKTtcblxuICAgIHJldHVybiBmdW5jdGlvbihhLCBzdHJpZGUsIG9mZnNldCwgY291bnQsIGZuLCBhcmcpIHtcbiAgICAgICAgdmFyIGksIGw7XG4gICAgICAgIGlmKCFzdHJpZGUpIHtcbiAgICAgICAgICAgIHN0cmlkZSA9IDQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZighb2Zmc2V0KSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihjb3VudCkge1xuICAgICAgICAgICAgbCA9IE1hdGgubWluKChjb3VudCAqIHN0cmlkZSkgKyBvZmZzZXQsIGEubGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGwgPSBhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihpID0gb2Zmc2V0OyBpIDwgbDsgaSArPSBzdHJpZGUpIHtcbiAgICAgICAgICAgIHZlY1swXSA9IGFbaV07IHZlY1sxXSA9IGFbaSsxXTsgdmVjWzJdID0gYVtpKzJdOyB2ZWNbM10gPSBhW2krM107XG4gICAgICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgICAgIGFbaV0gPSB2ZWNbMF07IGFbaSsxXSA9IHZlY1sxXTsgYVtpKzJdID0gdmVjWzJdOyBhW2krM10gPSB2ZWNbM107XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBhO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IHZlYyB2ZWN0b3IgdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHZlY3RvclxuICovXG52ZWM0LnN0ciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuICd2ZWM0KCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBhWzNdICsgJyknO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB2ZWM0O1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoICcuL3BpY2ltbycgKTtcblxufSkoKTtcbiIsIi8qIGdsb2JhbCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKi9cbihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHV0aWxzICA9IHJlcXVpcmUoICcuLi91dGlscycgKTtcbiAgICB2YXIgZXZlbnRzID0gcmVxdWlyZSggJy4uL2V2ZW50cycgKTtcbiAgICB2YXIgc2cgICAgID0gcmVxdWlyZSggJy4uL3NnJyApO1xuICAgIHZhciB3ZWJnbCAgPSByZXF1aXJlKCAnLi4vd2ViZ2wnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLkFwcFxuICAgICAqIEBleHRlbmRzIFBpY2ltby5ldmVudHMuQ3VzdG9tRXZlbnRcbiAgICAgKlxuICAgICAqIEBjbGFzc2Rlc2NcbiAgICAgKiAgIENyZWF0ZSBhIG5ldyBwaWNpbW8gYXBwLiBUaGlzIGlzIHlvdXIgbWFpbiBhcHAgY29udHJvbGxlci5cbiAgICAgKlxuICAgICAqICAgIyMjIyMgSW5pdGlhbGl6YXRpb25cbiAgICAgKlxuICAgICAqICAgVW0gZWluZSBQaWNpbW8gQXBwIEluc3RhbnogKHVuZCBlaW5lbiBXZWJHTCBDYW52YXMpIHp1IGVyemV1Z2VuLCByZWljaHQgZWluIGVpbmZhY2hlciBBdWZydWY6XG4gICAgICpcbiAgICAgKiAgIGBgYFxuICAgICAqICAgdmFyIGFwcCA9IG5ldyBQaWNpbW8uQXBwKHsgKm9wdGlvbnMqIH0pO1xuICAgICAqICAgYGBgXG4gICAgICpcbiAgICAgKiAgIEVzIHdpcmQgZWluIGA8Y2FudmFzPmAgRWxlbWVudCBlcnpldWd0IHVuZCB1bnRlcmhhbGIgZGVzIGA8Ym9keT5gIEVsZW1lbnRzIGRlciBTZWl0ZSBlaW5nZWjDpG5ndC5cbiAgICAgKiAgIE1pdCBkZXIgT3B0aW9uICoqYXBwZW5kVG8qKiBrYW5uIG1hbiBhbiBTdGVsbGUgZGVzIGA8Ym9keT5gIGVpbiBhbmRlcmVzIENvbnRhaW5lciBFbGVtZW50IGJlc3RpbW1lbi5cbiAgICAgKlxuICAgICAqICAgTcO2Y2h0ZSBtYW4gZGFzIGA8Y2FudmFzPmAgRWxlbWVudCBzZWxic3QgZXJ6ZXVnZW4gb2RlciBlaW4gdm9yaGFuZGVuZXMgdmVyd2VuZGVuLCBnaWJ0IG1hbiBkaWVzZXMgZWluZmFjaCBhbHMgZXJzdGVuIFBhcmFtZXRlciBhbjpcbiAgICAgKlxuICAgICAqICAgYGBgXG4gICAgICogICB2YXIgYXBwID0gbmV3IFBpY2ltby5BcHAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BpY2ltby1jYW52YXMnKSk7XG4gICAgICogICBgYGBcbiAgICAgKlxuICAgICAqICAgb2RlciBlaW5mYWNoIGFscyAqKmNhbnZhcyoqIE9wdGlvbjpcbiAgICAgKlxuICAgICAqICAgYGBgXG4gICAgICogICB2YXIgYXBwID0gbmV3IFBpY2ltby5BcHAoeyBjYW52YXM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwaWNpbW8tY2FudmFzJykgfSk7XG4gICAgICogICBgYGBcbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MQ2FudmFzRWxlbWVudHxvYmplY3R9IFtjYW52YXNdICAgICAgICAgICAgICAgICAgIC0gVGhlIGNhbnZhcyBkb20gZWxlbWVudCBvciB0aGUgb3B0aW9ucy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgb3B0aW9ucy5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmFscGhhPWZhbHNlXSAgICAgICAgICAgICAgICAgICAgICAgLSBDcmVhdGUgYSB0cmFuc3BhcmVudCBXZWJHTCBjYW52YXMuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5hbnRpYWxpYXM9ZmFsc2VdICAgICAgICAgICAgICAgICAgIC0gRW5hYmxlIGFudGlhbGlhc2luZy5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnN0YXRzPWZhbHNlXSAgICAgICAgICAgICAgICAgICAgICAgLSBDcmVhdGUgdGhlIFsgbXJkb29iL3N0YXRzLmpzIF0oIGh0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanMvICkgd2lkZ2V0IGFuZCBhcHBlbmQgaXQgdG8gdGhlIGNvbnRhaW5lciBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR9IFtvcHRpb25zLmNhbnZhc10gICAgICAgICAgICAgICAgICAtIFRoZSBjYW52YXMgZG9tIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW29wdGlvbnMuYXBwZW5kVG89ZG9jdW1lbnQuYm9keV0gICAgICAgIC0gU2V0IHRoZSBjb250YWluZXIgZWxlbWVudC4gVGhlIFdlYkdMIENhbnZhcyAoYW5kIHRoZSBzdGF0cyBlbGVtZW50KSB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoaXMgZWxlbWVudC4gVGhlIGNvbnRhaW5lciBlbGVtZW50IGFsc28gZGVmaW5lcyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLiBJZiB0aGlzIGlzIHRoZSBib2R5IGVsZW1lbnQgeW91IHdpbGwgZ2V0IGFuIGZ1bGxzY3JlZW4gV2ViR0wgY2FudmFzLiAqV2hlbiB0aGUgX19jYW52YXNfXyBvcHRpb24gaXMgdXNlZCwgdGhpcyBvcHRpb24gd2lsbCBiZSBpZ25vcmVkLipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xQaWNpbW8udXRpbHMuQ29sb3J9IFtvcHRpb25zLmJnQ29sb3I9IzAwMDAwMF0gLSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBXZWJHTCBjYW52YXMuIFVzZSBhbnkgQ1NTIGNvbG9yIGZvcm1hdCB5b3UgbGlrZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYXNzZXRCYXNlVXJsXSAgICAgICAgICAgICAgICAgICAgICAgLSBTZXQgdGhlIGJhc2UgdXJsIHByZWZpeCBmb3IgYWxsIGFzc2V0cyAoaW1hZ2VzLCBqc29uLCAuLikuIEFzIGFuIGFsdGVybmF0aXZlIHRvIHRoaXMgb3B0aW9uIHlvdSBjb3VsZCBkZWZpbmUgYSBnbG9iYWwgdmFyICoqUElDSU1PX0FTU0VUX0JBU0VfVVJMKiogYmVmb3JlIGNyZWF0aW5nIHlvdXIgUGljaW1vIGluc3RhbmNlLiBCdXQgdGhlIHByZWZlcnJlZCB3YXkgc2hvdWxkIGJlIHVzaW5nICphc3NldEJhc2VVcmwqIVxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gQXBwICggY2FudmFzLCBvcHRpb25zICkge1xuXG4gICAgICAgIGV2ZW50cy5ldmVudGl6ZSggdGhpcyApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5BcHAjbm93IC0gVGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gYXBwbGljYXRpb24gc3RhcnQuXG4gICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMubm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMC4wO1xuXG4gICAgICAgIGlmICggdHlwZW9mIGNhbnZhcyA9PT0gJ29iamVjdCcgJiYgISAoICdub2RlTmFtZScgaW4gY2FudmFzICkgKSB7XG5cbiAgICAgICAgICAgIG9wdGlvbnMgPSBjYW52YXM7XG4gICAgICAgICAgICBjYW52YXMgID0gb3B0aW9ucy5jYW52YXM7XG5cbiAgICAgICAgfSBlbHNlIGlmICggb3B0aW9ucyA9PSBudWxsICkge1xuXG4gICAgICAgICAgICBvcHRpb25zID0ge307XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtIVE1MQ2FudmFzRWxlbWVudH0gUGljaW1vLkFwcCNjYW52YXNcbiAgICAgICAgICovXG5cbiAgICAgICAgY2FudmFzID0gY2FudmFzICE9PSB1bmRlZmluZWQgPyBjYW52YXMgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImNhbnZhc1wiICk7XG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPKCB0aGlzLCAnY2FudmFzJywgY2FudmFzICk7XG5cbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSAhISBvcHRpb25zLmFwcGVuZFRvID8gb3B0aW9ucy5hcHBlbmRUbyA6IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIGNhbnZhcyApO1xuICAgICAgICBjYW52YXMuY2xhc3NMaXN0LmFkZCggJ3BpY2ltbycgKTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtXZWJHbFJlbmRlcmluZ0NvbnRleHR9IFBpY2ltby5BcHAjZ2xcbiAgICAgICAgICovXG5cbiAgICAgICAgdXRpbHMuYWRkR2x4UHJvcGVydHkoIHRoaXMgKTtcblxuICAgICAgICB0aGlzLmdsQ3R4QXR0cnMgPSB7XG5cbiAgICAgICAgICAgIGFscGhhICAgICA6ICggb3B0aW9ucy5hbHBoYSA9PT0gdHJ1ZSApLFxuICAgICAgICAgICAgYW50aWFsaWFzIDogKCBvcHRpb25zLmFudGlhbGlhcyA9PT0gdHJ1ZSApXG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7V2ViR2xDb250ZXh0fSBQaWNpbW8uQXBwI2dseFxuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmdseCA9IGNyZWF0ZVdlYkdsQ29udGV4dCggdGhpcyApO1xuICAgICAgICB0aGlzLmdseC5hcHAgPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8udXRpbHMuQ29sb3J9IFBpY2ltby5BcHAjYmFja2dyb3VuZENvbG9yXG4gICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZENvbG9yID0gbmV3IHV0aWxzLkNvbG9yKCBvcHRpb25zLmJnQ29sb3IgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuYmdDb2xvciA6ICggdGhpcy5nbEN0eEF0dHJzLmFscGhhID8gJ3RyYW5zcGFyZW50JyA6IFwiIzAwMDAwMFwiICkgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IFBpY2ltby5BcHAjc2hhZGVyXG4gICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMuc2hhZGVyID0gbmV3IHdlYmdsLlNoYWRlck1hbmFnZXIoIHRoaXMgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLndlYmdsLldlYkdsUmVuZGVyZXJ9IFBpY2ltby5BcHAjcmVuZGVyZXJcbiAgICAgICAgICovXG5cbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyB3ZWJnbC5XZWJHbFJlbmRlcmVyKCB0aGlzICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5BcHB9IFBpY2ltby5BcHAjYXNzZXRCYXNlVXJsIC0gVGhlIGJhc2UgdXJsIGZvciBhbGwgYXNzZXRzLiBNYXkgYmUgKnVuZGVmaW5lZCouXG4gICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMuYXNzZXRCYXNlVXJsID0gd2luZG93LlBJQ0lNT19BU1NFVF9CQVNFX1VSTCB8fCBvcHRpb25zLmFzc2V0QmFzZVVybDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLnNnLk5vZGV9IFBpY2ltby5BcHAjcm9vdCAtIFRoZSByb290IG5vZGUgb2YgdGhlIHNjZW5lIGdyYXBoLlxuICAgICAgICAgKi9cblxuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyggdGhpcywgJ3Jvb3QnLCBuZXcgc2cuTm9kZSggdGhpcyApICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLkFwcCNmcmFtZU5vIC0gVGhlIGN1cnJlbnQgZnJhbWUgbnVtYmVyLlxuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmZyYW1lTm8gPSAwO1xuXG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5pbml0R2woKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIHRoaXMucmVzaXplLmJpbmQoIHRoaXMgKSwgZmFsc2UgKTtcblxuICAgICAgICB0aGlzLm9uQW5pbWF0aW9uRnJhbWUgPSB0aGlzLnJlbmRlckZyYW1lLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLm9uQW5pbWF0aW9uRnJhbWUgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLkFwcCNkZXZpY2VQaXhlbFJhdGlvIC0gVGhlIGRldmljZSBwaXhlbCByYXRpby5cbiAgICAgKi9cblxuICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPKCBBcHAucHJvdG90eXBlLCAnZGV2aWNlUGl4ZWxSYXRpbycsICggd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSApICk7XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLkFwcCNyZXNpemVcbiAgICAgKi9cblxuICAgIEFwcC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciB3ID0gTWF0aC5yb3VuZCggdGhpcy5jYW52YXMucGFyZW50Tm9kZS5jbGllbnRXaWR0aCAqIHRoaXMuZGV2aWNlUGl4ZWxSYXRpbyApO1xuICAgICAgICB2YXIgaCA9IE1hdGgucm91bmQoIHRoaXMuY2FudmFzLnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0ICogdGhpcy5kZXZpY2VQaXhlbFJhdGlvICk7XG5cbiAgICAgICAgaWYgKCB0aGlzLndpZHRoICE9PSB3IHx8IHRoaXMuaGVpZ2h0ICE9PSBoICkge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLkFwcCN3aWR0aCAtIFRoZSBfcmVhbF8gZGV2aWNlIHBpeGVsIHdpZHRoLlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLkFwcCNoZWlnaHQgLSBUaGUgX3JlYWxfIGRldmljZSBwaXhlbCBoZWlnaHQuXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoO1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMucmVuZGVyZXIgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlc2l6ZSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdGhpcy5jYW52YXMud2lkdGggIT09IHcgfHwgdGhpcy5jYW52YXMuaGVpZ2h0ICE9PSBoICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggID0gdztcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBoO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggID0gTWF0aC5yb3VuZCggdyAvIHRoaXMuZGV2aWNlUGl4ZWxSYXRpbyApICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IE1hdGgucm91bmQoIGggLyB0aGlzLmRldmljZVBpeGVsUmF0aW8gKSArIFwicHhcIjtcblxuICAgICAgICAgICAgICAgIC8vIFRPRE8gcmVzaXplXG4gICAgICAgICAgICAgICAgLy9pZiAoIHRoaXMucm9vdCAmJiB0aGlzLnNjZW5lLnJlc2l6ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLnNjZW5lLnJlc2l6ZSh0aGlzLmdseCwgdywgaCk7XG4gICAgICAgICAgICAgICAgLy99XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8uQXBwI3JlbmRlckZyYW1lXG4gICAgICovXG5cbiAgICBBcHAucHJvdG90eXBlLnJlbmRlckZyYW1lID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMubm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMC4wO1xuICAgICAgICArK3RoaXMuZnJhbWVObztcblxuICAgICAgICB0aGlzLnJlbmRlcmVyLmJlZ2luRnJhbWUoKTtcblxuICAgICAgICBpZiAoIHRoaXMucm9vdCApIHtcblxuICAgICAgICAgICAgdGhpcy5yb290LnJlbmRlckZyYW1lKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuZW5kRnJhbWUoKTtcblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHRoaXMub25BbmltYXRpb25GcmFtZSApO1xuXG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gY3JlYXRlV2ViR2xDb250ZXh0ICggYXBwICkge1xuXG4gICAgICAgIHZhciBnbDtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBnbCA9IGFwcC5jYW52YXMuZ2V0Q29udGV4dCggXCJ3ZWJnbFwiLCBhcHAuZ2xDdHhBdHRycyApIHx8XG4gICAgICAgICAgICAgICAgIGFwcC5jYW52YXMuZ2V0Q29udGV4dCggXCJleHBlcmltZW50YWwtd2ViZ2xcIiwgYXBwLmdsQ3R4QXR0cnMgKTtcblxuICAgICAgICB9IGNhdGNoICggZXJyICkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBlcnIgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAhIGdsICkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiQ291bGQgbm90IGluaXRpYWxpemUgdGhlIFdlYkdMIGNvbnRleHQhXCIgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyB3ZWJnbC5XZWJHbENvbnRleHQoIGdsICk7XG5cbiAgICB9XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gQXBwO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvL3ZhciB2ZWMyID0gcmVxdWlyZSggJ2dsLW1hdHJ4JyApLnZlYzI7XG5cbiAgICAvKipcbiAgICAgKiBSZXByZXNlbnRzIGEgMmQgYXhpcyBhbGlnbmVkIGJvdW5kYXJ5IGJveC5cbiAgICAgKiBAY2xhc3MgUGljaW1vLmNvcmUuQUFCQjJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3gwPTBdIC0geDBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3gxPTBdIC0geDFcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3kwPTBdIC0geTBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3kxPTBdIC0geTFcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIEFBQkIyICggeDAsIHgxLCB5MCwgeTEgKSB7XG5cbiAgICAgICAgaWYgKCB4MCA9PT0gdW5kZWZpbmVkICkgeDAgPSAwO1xuICAgICAgICBpZiAoIHkwID09PSB1bmRlZmluZWQgKSB5MCA9IDA7XG4gICAgICAgIGlmICggeDEgPT09IHVuZGVmaW5lZCApIHgxID0gMDtcbiAgICAgICAgaWYgKCB5MSA9PT0gdW5kZWZpbmVkICkgeTEgPSAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5BQUJCMn0gUGljaW1vLmNvcmUuQUFCQjIjbWluX3ggLSBNaW5pbXVtIHggdmFsdWVcbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLkFBQkIyfSBQaWNpbW8uY29yZS5BQUJCMiNtYXhfeCAtIE1heGltdW0geCB2YWx1ZVxuICAgICAgICAgKi9cblxuICAgICAgICBpZiAoIHgwIDwgeDEgKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWluX3ggPSB4MDtcbiAgICAgICAgICAgIHRoaXMubWF4X3ggPSB4MTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLm1pbl94ID0geDE7XG4gICAgICAgICAgICB0aGlzLm1heF94ID0geDA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5BQUJCMn0gUGljaW1vLmNvcmUuQUFCQjIjbWluX3kgLSBNaW5pbXVtIHkgdmFsdWVcbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLkFBQkIyfSBQaWNpbW8uY29yZS5BQUJCMiNtYXhfeSAtIE1heGltdW0geSB2YWx1ZVxuICAgICAgICAgKi9cblxuICAgICAgICBpZiAoIHkwIDwgeTEgKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWluX3kgPSB5MDtcbiAgICAgICAgICAgIHRoaXMubWF4X3kgPSB5MTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLm1pbl95ID0geTE7XG4gICAgICAgICAgICB0aGlzLm1heF95ID0geTA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5zZWFsKCB0aGlzICk7XG5cbiAgICB9XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBBQUJCMi5wcm90b3R5cGUsIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuQUFCQjJ9IFBpY2ltby5jb3JlLkFBQkIyI3dpZHRoXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgJ3dpZHRoJzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm1heF94IC0gdGhpcy5taW5feCArIDE7IH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLkFBQkIyfSBQaWNpbW8uY29yZS5BQUJCMiNoZWlnaHRcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICAnaGVpZ2h0Jzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm1heF95IC0gdGhpcy5taW5feSArIDE7IH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLkFBQkIyfSBQaWNpbW8uY29yZS5BQUJCMiNjZW50ZXJfeFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgICdjZW50ZXJfeCc6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gKCB0aGlzLm1heF94IC0gdGhpcy5taW5feCApIC8gMjsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuQUFCQjJ9IFBpY2ltby5jb3JlLkFBQkIyI2NlbnRlcl95XG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgJ2NlbnRlcl95Jzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiAoIHRoaXMubWF4X3kgLSB0aGlzLm1pbl95ICkgLyAyOyB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG4gICAgLyoqXG4gICAgICogRXh0ZW5kIHRoZSBib3VuZGFyeSBib3guXG4gICAgICogQG1ldGhvZCBQaWNpbW8uY29yZS5BQUJCMiNhZGRQb2ludFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0geVxuICAgICAqL1xuXG4gICAgQUFCQjIucHJvdG90eXBlLmFkZFBvaW50ID0gZnVuY3Rpb24gKCB4LCB5ICkge1xuXG4gICAgICAgIGlmICggeCA8IHRoaXMubWluX3ggKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWluX3ggPSB4O1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHggPiB0aGlzLm1heF94ICkge1xuXG4gICAgICAgICAgICB0aGlzLm1heF94ID0geDtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB5IDwgdGhpcy5taW5feSApIHtcblxuICAgICAgICAgICAgdGhpcy5taW5feSA9IHk7XG5cbiAgICAgICAgfSBlbHNlIGlmICggeSA+IHRoaXMubWF4X3kgKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWF4X3kgPSB5O1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIERldGVybWluYXRlcyB3ZXRoZXIgb3IgdGhlIDJkIHBvaW50IGlzIGluc2lkZSB0aGlzIEFBQkIuXG4gICAgICogQG1ldGhvZCBQaWNpbW8uY29yZS5BQUJCMiNpc0luc2lkZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0geVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cbiAgICBBQUJCMi5wcm90b3R5cGUuaXNJbnNpZGUgPSBmdW5jdGlvbiAoIHgsIHkgKSB7XG5cbiAgICAgICAgaWYgKCB4ID49IHRoaXMubWluX3ggJiYgeCA8PSB0aGlzLm1heF94ICYmXG4gICAgICAgICAgICAgeSA+PSB0aGlzLm1pbl95ICYmIHkgPD0gdGhpcy5tYXhfeSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIERldGVybWluYXRlcyB3ZXRoZXIgb3Igbm90IHRoaXMgQUFCQiBpbnRlcnNlY3RzICphYWJiKi5cbiAgICAgKiBAbWV0aG9kIFBpY2ltby5jb3JlLkFBQkIyI2lzSW50ZXJzZWN0aW9uXG4gICAgICogQHBhcmFtIHtBQUJCMn0gYWFiYiAtIGFhYmJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG4gICAgQUFCQjIucHJvdG90eXBlLmlzSW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gKCBhYWJiICkge1xuXG4gICAgICAgIGlmICggYWFiYi5tYXhfeCA8IHRoaXMubWluX3ggfHwgYWFiYi5taW5feCA+IHRoaXMubWF4X3ggfHxcbiAgICAgICAgICAgICBhYWJiLm1heF95IDwgdGhpcy5taW5feSB8fCBhYWJiLm1pbl95ID4gdGhpcy5tYXhfeSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH07XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gQUFCQjI7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgUGljaW1vLmNvcmVcbiAgICAgKi9cblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIEFBQkIyICAgICAgICAgICAgICAgICAgOiByZXF1aXJlKCAnLi9hYWJiMicgKSxcbiAgICAgICAgVmlld3BvcnQgICAgICAgICAgICAgICA6IHJlcXVpcmUoICcuL3ZpZXdwb3J0JyApLFxuXG4gICAgICAgIFRleHR1cmUgICAgICAgICAgICAgICAgOiByZXF1aXJlKCAnLi90ZXh0dXJlJyApLFxuXG4gICAgICAgIFZlcnRleEFycmF5ICAgICAgICAgICAgOiByZXF1aXJlKCAnLi92ZXJ0ZXhfYXJyYXknICksXG4gICAgICAgIFZlcnRleEluZGV4QXJyYXkgICAgICAgOiByZXF1aXJlKCAnLi92ZXJ0ZXhfaW5kZXhfYXJyYXknICksXG5cbiAgICAgICAgVmVydGV4T2JqZWN0ICAgICAgICAgICA6IHJlcXVpcmUoICcuL3ZlcnRleF9vYmplY3QnICksXG4gICAgICAgIFZlcnRleE9iamVjdERlc2NyaXB0b3IgOiByZXF1aXJlKCAnLi92ZXJ0ZXhfb2JqZWN0X2Rlc2NyaXB0b3InICksXG4gICAgICAgIFZlcnRleE9iamVjdFBvb2wgICAgICAgOiByZXF1aXJlKCAnLi92ZXJ0ZXhfb2JqZWN0X3Bvb2wnIClcblxuICAgIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8uY29yZS5UZXh0dXJlXG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5UZXh0dXJlfSBbcGFyZW50XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbd2lkdGhdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtoZWlnaHRdXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdCA9IG5ldyBQaWNpbW8uY29yZS5UZXh0dXJlO1xuICAgICAqIHQuaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG4gICAgICogdC53aWR0aCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vID0+IDMwMFxuICAgICAqIHQuaGVpZ2h0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA9PiAxNTBcbiAgICAgKlxuICAgICAqIHZhciB0dCA9IG5ldyBQaWNpbW8uY29yZS5UZXh0dXJlKCB0LCAzMCwgMTUsIDEwMCwgMTAwIClcbiAgICAgKiB0LndpZHRoICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPT4gMTAwXG4gICAgICpcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIFRleHR1cmUgKCBwYXJlbnQsIHgsIHksIHdpZHRoLCBoZWlnaHQgKSB7XG5cbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9pbWFnZSAgPSBudWxsO1xuICAgICAgICB0aGlzLl93aWR0aCAgPSB3aWR0aDtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlRleHR1cmUjeFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy54ID0geCAhPSBudWxsID8geCA6IDA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVGV4dHVyZSN5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnkgPSB5ICE9IG51bGwgPyB5IDogMDtcblxuICAgIH1cblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIFRleHR1cmUucHJvdG90eXBlLCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLlRleHR1cmV9IFBpY2ltby5jb3JlLlRleHR1cmUjcGFyZW50XG4gICAgICAgICAqL1xuXG4gICAgICAgIHBhcmVudDoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX3BhcmVudDsgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoIHBhcmVudCApIHtcblxuICAgICAgICAgICAgICAgIGlmICggcGFyZW50ICE9IG51bGwgJiYgdGhpcy5faW1hZ2UgIT0gbnVsbCApIHtcblxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVGV4dHVyZSBjYW4gaGF2ZSBhIHBhcmVudCBvciBhbiBpbWFnZSBidXQgbm90IGJvdGghXCIgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLlRleHR1cmV9IFBpY2ltby5jb3JlLlRleHR1cmUjcm9vdFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG5cbiAgICAgICAgcm9vdDoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQgOiB0aGlzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7SW1hZ2V8Q2FudmFzfSBQaWNpbW8uY29yZS5UZXh0dXJlI2ltYWdlXG4gICAgICAgICAqL1xuXG4gICAgICAgIGltYWdlOiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5pbWFnZSA6IHRoaXMuX2ltYWdlO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggaW1hZ2UgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGltYWdlICE9IG51bGwgJiYgdGhpcy5fcGFyZW50ICE9IG51bGwgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlRleHR1cmUgY2FuIGhhdmUgYSBwYXJlbnQgb3IgYW4gaW1hZ2UgYnV0IG5vdCBib3RoIVwiICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZSA9IGltYWdlO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5UZXh0dXJlI3dpZHRoXG4gICAgICAgICAqL1xuXG4gICAgICAgIHdpZHRoOiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLl93aWR0aCAhPSBudWxsICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHRoaXMuaW1hZ2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGltYWdlICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZS53aWR0aDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggd2lkdGggKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5UZXh0dXJlI2hlaWdodFxuICAgICAgICAgKi9cblxuICAgICAgICBoZWlnaHQ6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuX2hlaWdodCAhPSBudWxsICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB0aGlzLmltYWdlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBpbWFnZSApIHtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW1hZ2UuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCBoZWlnaHQgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlRleHR1cmUjbWluX3NcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuXG4gICAgICAgIG1pbl9zOiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgICAgICAgICAgdmFyIHRleCA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoICggdGV4ID0gdGV4LnBhcmVudCApICE9IG51bGwgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgeCArPSB0ZXgueDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB4IC8gdGhpcy5pbWFnZS53aWR0aDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVGV4dHVyZSNtaW5fdFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG5cbiAgICAgICAgbWluX3Q6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgICAgICAgICB2YXIgdGV4ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHdoaWxlICggKCB0ZXggPSB0ZXgucGFyZW50ICkgIT0gbnVsbCApIHtcblxuICAgICAgICAgICAgICAgICAgICB5ICs9IHRleC55O1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHkgLyB0aGlzLmltYWdlLmhlaWdodDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVGV4dHVyZSNtYXhfc1xuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG5cbiAgICAgICAgbWF4X3M6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgeCA9IHRoaXMueCArIHRoaXMud2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIHRleCA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoICggdGV4ID0gdGV4LnBhcmVudCApICE9IG51bGwgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgeCArPSB0ZXgueDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB4IC8gdGhpcy5pbWFnZS53aWR0aDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVGV4dHVyZSNtYXhfdFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG5cbiAgICAgICAgbWF4X3Q6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMueSArIHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKCAoIHRleCA9IHRleC5wYXJlbnQgKSAhPSBudWxsICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHkgKz0gdGV4Lnk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4geSAvIHRoaXMuaW1hZ2UuaGVpZ2h0O1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgIH0pO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby5jb3JlLlRleHR1cmUjc2V0VGV4Q29vcmRzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIEFueSBvYmplY3Qgd2hpY2ggaGFzIGEgYC5zZXRUZXhDb29yZHMoKWAgbWV0aG9kXG4gICAgICovXG5cbiAgICBUZXh0dXJlLnByb3RvdHlwZS5zZXRUZXhDb29yZHMgPSBmdW5jdGlvbiAoIG9iaiApIHtcblxuICAgICAgICB2YXIgeDAgPSB0aGlzLm1pbl9zO1xuICAgICAgICB2YXIgeTAgPSB0aGlzLm1pbl90O1xuICAgICAgICB2YXIgeDEgPSB0aGlzLm1heF9zO1xuICAgICAgICB2YXIgeTEgPSB0aGlzLm1heF90O1xuXG4gICAgICAgIG9iai5zZXRUZXhDb29yZHMoXG4gICAgICAgICAgICB4MCwgeTAsXG4gICAgICAgICAgICB4MSwgeTAsXG4gICAgICAgICAgICB4MSwgeTEsXG4gICAgICAgICAgICB4MCwgeTEgKTtcbiAgICBcbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFRleHR1cmU7XG5cbn0pKCk7XG4iLCIvKiBnbG9iYWwgRmxvYXQzMkFycmF5ICovXG4oZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheVxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvcn0gZGVzY3JpcHRvciAtIFRoZSBkZXNjcmlwdG9yLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjYXBhY2l0eSAtIE1heGltdW0gbnVtYmVyIG9mIHZlcnRleCBvYmplY3RzXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXl9IFt2ZXJ0aWNlc11cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBWZXJ0ZXhBcnJheSAoIGRlc2NyaXB0b3IsIGNhcGFjaXR5LCB2ZXJ0aWNlcyApIHtcblxuICAgICAgICB0aGlzLmRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yO1xuICAgICAgICB0aGlzLmNhcGFjaXR5ICAgPSBjYXBhY2l0eTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7RmxvYXQzMkFycmF5fSBQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheSN2ZXJ0aWNlcyAtIFRoZSBmbG9hdCBhcnJheSBidWZmZXIuXG4gICAgICAgICAqL1xuXG4gICAgICAgIGlmICggdmVydGljZXMgIT09IHVuZGVmaW5lZCApIHtcblxuICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMudmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KCBjYXBhY2l0eSAqIGRlc2NyaXB0b3IudmVydGV4Q291bnQgKiBkZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuVmVydGV4QXJyYXkjY29weVxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmVydGV4QXJyYXl9IGZyb21WZXJ0ZXhBcnJheVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdG9PZmZzZXQ9MF0gLSBWZXJ0ZXggb2JqZWN0IG9mZnNldFxuICAgICAqL1xuICAgIFZlcnRleEFycmF5LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCBmcm9tVmVydGV4QXJyYXksIHRvT2Zmc2V0ICkge1xuXG4gICAgICAgIHZhciBvZmZzZXQgPSAwO1xuXG4gICAgICAgIGlmICggdG9PZmZzZXQgPT09IHVuZGVmaW5lZCApIHtcblxuICAgICAgICAgICAgb2Zmc2V0ID0gdG9PZmZzZXQgKiB0aGlzLmRlc2NyaXB0b3IudmVydGV4Q291bnQgKiB0aGlzLmRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50O1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZlcnRpY2VzLnNldCggZnJvbVZlcnRleEFycmF5LnZlcnRpY2VzLCBvZmZzZXQgKTtcblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby5jb3JlLlZlcnRleEFycmF5I3N1YmFycmF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJlZ2luIC0gSW5kZXggb2YgZmlyc3QgdmVydGV4IG9iamVjdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc2l6ZT0xXSAtXG4gICAgICogQHJldHVybiB7UGljaW1vLmNvcmUuVmVydGV4QXJyYXl9XG4gICAgICovXG4gICAgVmVydGV4QXJyYXkucHJvdG90eXBlLnN1YmFycmF5ID0gZnVuY3Rpb24gKCBiZWdpbiwgc2l6ZSApIHtcblxuICAgICAgICBpZiAoIHNpemUgPT09IHVuZGVmaW5lZCApIHtcblxuICAgICAgICAgICAgc2l6ZSA9IDE7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2ZXJ0aWNlcyA9IHRoaXMudmVydGljZXMuc3ViYXJyYXkoXG4gICAgICAgICAgICAgICAgYmVnaW4gKiB0aGlzLmRlc2NyaXB0b3IudmVydGV4Q291bnQgKiB0aGlzLmRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50LFxuICAgICAgICAgICAgICAgIChiZWdpbiArIHNpemUpICogdGhpcy5kZXNjcmlwdG9yLnZlcnRleENvdW50ICogdGhpcy5kZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCApO1xuXG4gICAgICAgIHJldHVybiBuZXcgVmVydGV4QXJyYXkoIHRoaXMuZGVzY3JpcHRvciwgc2l6ZSwgdmVydGljZXMgKTtcblxuICAgIH07XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4QXJyYXk7XG5cbn0pKCk7XG4iLCIvKiBnbG9iYWwgVWludDMyQXJyYXkgKi9cbihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby5jb3JlLlZlcnRleEluZGV4QXJyYXlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmVydGV4T2JqZWN0Q291bnQgLSBOdW1iZXIgb2YgdmVydGV4IG9iamVjdHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2JqZWN0SW5kZXhDb3VudCAtIE51bWJlciBvZiB2ZXJ0ZXggaW5kaWNlcyBwZXIgb2JqZWN0XG4gICAgICovXG4gICAgZnVuY3Rpb24gVmVydGV4SW5kZXhBcnJheSAoIHZlcnRleE9iamVjdENvdW50LCBvYmplY3RJbmRleENvdW50ICkge1xuXG4gICAgICAgIHZhciBzaXplID0gdmVydGV4T2JqZWN0Q291bnQgKiBvYmplY3RJbmRleENvdW50O1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHVibGljUk8oIHRoaXMsIHtcbiAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVmVydGV4SW5kZXhBcnJheSN2ZXJ0ZXhPYmplY3RDb3VudCAtIE51bWJlciBvZiB2ZXJ0ZXggb2JqZWN0cy5cbiAgICAgICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2ZXJ0ZXhPYmplY3RDb3VudDogdmVydGV4T2JqZWN0Q291bnQsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5WZXJ0ZXhJbmRleEFycmF5I29iamVjdEluZGV4Q291bnQgLSBOdW1iZXIgb2YgdmVydGV4IGluZGljZXMgcGVyIG9iamVjdC5cbiAgICAgICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvYmplY3RJbmRleENvdW50OiBvYmplY3RJbmRleENvdW50LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVmVydGV4SW5kZXhBcnJheSNzaXplIC0gU2l6ZSBvZiBhcnJheSBidWZmZXIuXG4gICAgICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2l6ZTogc2l6ZSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtVaW50MzJBcnJheX0gUGljaW1vLmNvcmUuVmVydGV4SW5kZXhBcnJheSNpbmRpY2VzIC0gVGhlIHVpbnQgaW5kZXggYXJyYXkgYnVmZmVyLlxuICAgICAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGluZGljZXM6IG5ldyBVaW50MzJBcnJheSggc2l6ZSApXG4gICAgICAgIFxuICAgICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIFBpY2ltby5jb3JlLlZlcnRleEluZGV4QXJyYXkuR2VuZXJhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmVydGV4T2JqZWN0Q291bnRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBpbmRpY2VzXG4gICAgICogQHJldHVybiB7UGljaW1vLmNvcmUuVmVydGV4SW5kZXhBcnJheX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIGNyZWF0ZSBhIHZlcnRleCBpbmRleCBidWZmZXIgZm9yIHRlbiBxdWFkcyB3aGVyZSBlYWNoIHF1YWQgaXMgY29uc3RydWN0ZWQgb2YgdHdvIHRyaWFuZ2xlc1xuICAgICAqIHZhciBxdWFkSW5kaWNlcyA9IFBpY2ltby5jb3JlLlZlcnRleEluZGV4QXJyYXkuR2VuZXJhdGUoIDEwLCBbIDAsMSwyLCAwLDIsMyBdICk7XG4gICAgICogcXVhZEluZGljZXMuc2l6ZSAgICAgICAgICAgICAgICAgLy8gPT4gNjBcbiAgICAgKiBxdWFkSW5kaWNlcy5vYmplY3RJbmRleENvdW50ICAgICAvLyA9PiA2XG4gICAgICpcbiAgICAgKi9cbiAgICBWZXJ0ZXhJbmRleEFycmF5LkdlbmVyYXRlID0gZnVuY3Rpb24gKCB2ZXJ0ZXhPYmplY3RDb3VudCwgaW5kaWNlcyApIHtcblxuICAgICAgICB2YXIgYXJyID0gbmV3IFZlcnRleEluZGV4QXJyYXkoIHZlcnRleE9iamVjdENvdW50LCBpbmRpY2VzLmxlbmd0aCApO1xuICAgICAgICB2YXIgaSwgajtcblxuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHZlcnRleE9iamVjdENvdW50OyArK2kgKSB7XG5cbiAgICAgICAgICAgIGZvciAoIGogPSAwOyBqIDwgaW5kaWNlcy5sZW5ndGg7ICsraiApIHtcblxuICAgICAgICAgICAgICAgIGFyclsgKCBpICogYXJyLm9iamVjdEluZGV4Q291bnQgKSArIGogXSA9IGluZGljZXNbIGogXSArICggaSAqIGFyci5vYmplY3RJbmRleENvdW50ICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycjtcblxuICAgIH07XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4SW5kZXhBcnJheTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvcn0gW2Rlc2NyaXB0b3JdIC0gVmVydGV4IGRlc2NyaXB0b3IuXG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheX0gW3ZlcnRleEFycmF5XSAtIFZlcnRleCBhcnJheS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBWZXJ0ZXhPYmplY3QgKCBkZXNjcmlwdG9yLCB2ZXJ0ZXhBcnJheSApIHtcblxuICAgICAgICBpZiAoIHRoaXMuZGVzY3JpcHRvciAhPT0gdW5kZWZpbmVkICkgcmV0dXJuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yfSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3QjZGVzY3JpcHRvciAtIFZlcnRleCBvYmplY3QgZGVzY3JpcHRvci5cbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuXG4gICAgICAgIHZhciBfZGVzY3JpcHRvciA9ICggISEgZGVzY3JpcHRvciApID8gZGVzY3JpcHRvciA6ICggKCAhISB2ZXJ0ZXhBcnJheSApID8gdmVydGV4QXJyYXkuZGVzY3JpcHRvciA6IG51bGwgKTtcbiAgICAgICAgaWYgKCAhIF9kZXNjcmlwdG9yICkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdWZXJ0ZXhPYmplY3QuZGVzY3JpcHRvciBpcyBudWxsIScgKTtcblxuICAgICAgICB9XG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVByaXZhdGVSTyggdGhpcywgJ2Rlc2NyaXB0b3InLCBfZGVzY3JpcHRvciApO1xuXG4gICAgICAgIC8qKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheX0gUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0I3ZlcnRleEFycmF5IC0gVmVydGV4IGFycmF5LiAqL1xuICAgICAgICB2YXIgX3ZlcnRleEFycmF5ID0gKCAhISB2ZXJ0ZXhBcnJheSApID8gdmVydGV4QXJyYXkgOiBkZXNjcmlwdG9yLmNyZWF0ZVZlcnRleEFycmF5KCk7XG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVByaXZhdGUoIHRoaXMsICd2ZXJ0ZXhBcnJheScsIF92ZXJ0ZXhBcnJheSApO1xuXG4gICAgICAgIGlmICggdGhpcy5kZXNjcmlwdG9yICE9PSB0aGlzLnZlcnRleEFycmF5LmRlc2NyaXB0b3IgJiYgKCB0aGlzLmRlc2NyaXB0b3IudmVydGV4Q291bnQgIT09IHRoaXMudmVydGV4QXJyYXkuZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCB8fCB0aGlzLmRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50ICE9PSB0aGlzLnZlcnRleEFycmF5LmRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50KSApIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnSW5jb21wYXRpYmxlIHZlcnRleCBvYmplY3QgZGVzY3JpcHRvcnMhJyApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBWZXJ0ZXhPYmplY3QucHJvdG90eXBlLCB7XG5cbiAgICAgICAgJ3ZlcnRpY2VzJzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4T2JqZWN0O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvL3ZhciB1dGlscyA9IHJlcXVpcmUoICcuLi91dGlscycgKTtcbiAgICB2YXIgVmVydGV4T2JqZWN0ID0gcmVxdWlyZSggJy4vdmVydGV4X29iamVjdCcgKTtcbiAgICB2YXIgVmVydGV4QXJyYXkgPSByZXF1aXJlKCAnLi92ZXJ0ZXhfYXJyYXknICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHZlcnRleE9iamVjdENvbnN0cnVjdG9yIC0gVmVydGV4IG9iamVjdCBjb25zdHJ1Y3RvciBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2ZXJ0ZXhDb3VudCAtIFZlcnRleCBjb3VudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2ZXJ0ZXhBdHRyQ291bnQgLSBWZXJ0ZXggYXR0cmlidXRlIGNvdW50XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXR0cmlidXRlcyAtIFZlcnRleCBhdHRyaWJ1dGUgZGVzY3JpcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFthbGlhc2VzXSAtIFZlcnRleCBhdHRyaWJ1dGUgYWxpYXNlc1xuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGRlc2NyaXB0b3IgPSBuZXcgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvcihcbiAgICAgKlxuICAgICAqICAgICBudWxsLFxuICAgICAqXG4gICAgICogICAgIDQsICAgLy8gdmVydGV4Q291bnRcbiAgICAgKiAgICAgMTIsICAvLyB2ZXJ0ZXhBdHRyQ291bnRcbiAgICAgKlxuICAgICAqICAgICBbICAgIC8vIGF0dHJpYnV0ZXMgLi5cbiAgICAgKlxuICAgICAqICAgICAgICAgeyBuYW1lOiAncG9zaXRpb24nLCAgc2l6ZTogMywgYXR0ck5hbWVzOiBbICd4JywgJ3knLCAneicgXSB9LFxuICAgICAqICAgICAgICAgeyBuYW1lOiAncm90YXRlJywgICAgc2l6ZTogMSwgdW5pZm9ybTogdHJ1ZSB9LFxuICAgICAqICAgICAgICAgeyBuYW1lOiAndGV4Q29vcmRzJywgc2l6ZTogMiwgYXR0ck5hbWVzOiBbICdzJywgJ3QnIF0gfSxcbiAgICAgKiAgICAgICAgIHsgbmFtZTogJ3RyYW5zbGF0ZScsIHNpemU6IDIsIGF0dHJOYW1lczogWyAndHgnLCAndHknIF0sIHVuaWZvcm06IHRydWUgfSxcbiAgICAgKiAgICAgICAgIHsgbmFtZTogJ3NjYWxlJywgICAgIHNpemU6IDEsIHVuaWZvcm06IHRydWUgfSxcbiAgICAgKiAgICAgICAgIHsgbmFtZTogJ29wYWNpdHknLCAgIHNpemU6IDEsIHVuaWZvcm06IHRydWUgfVxuICAgICAqXG4gICAgICogICAgIF0sXG4gICAgICpcbiAgICAgKiAgICAgeyAgIC8vIGFsaWFzZXMgLi5cbiAgICAgKlxuICAgICAqICAgICAgICAgcG9zMmQ6IHsgc2l6ZTogMiwgb2Zmc2V0OiAwIH0sXG4gICAgICogICAgICAgICBwb3NaOiAgeyBzaXplOiAxLCBvZmZzZXQ6IDIsIHVuaWZvcm06IHRydWUgfSxcbiAgICAgKiAgICAgICAgIHV2OiAgICAndGV4Q29vcmRzJ1xuICAgICAqXG4gICAgICogICAgIH1cbiAgICAgKlxuICAgICAqICk7XG4gICAgICpcbiAgICAgKiB2by5wcm90by5udW1iZXJPZkJlYXN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNjY2OyB9O1xuICAgICAqXG4gICAgICpcbiAgICAgKiB2YXIgdm8gPSBkZXNjcmlwdG9yLmNyZWF0ZSgpO1xuICAgICAqXG4gICAgICogdm8uc2V0UG9zaXRpb24oIDEsMiwtMSwgNCw1LC0xLCA3LDgsLTEsIDEwLDExLC0xICk7XG4gICAgICogdm8ueDIgICAgICAgICAgICAgICAgLy8gPT4gN1xuICAgICAqIHZvLnkwICAgICAgICAgICAgICAgIC8vID0+IDJcbiAgICAgKiB2by5wb3NaICAgICAgICAgICAgICAvLyA9PiAtMVxuICAgICAqIHZvLnBvc1ogPSAyMztcbiAgICAgKiB2by56MSAgICAgICAgICAgICAgICAvLyA9PiAyM1xuICAgICAqIHZvLm51bWJlck9mQmVhc3QoKSAgIC8vID0+IDY2NlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gVmVydGV4T2JqZWN0RGVzY3JpcHRvciAoIHZlcnRleE9iamVjdENvbnN0cnVjdG9yLCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBhdHRyaWJ1dGVzLCBhbGlhc2VzICkge1xuXG4gICAgICAgIHRoaXMudmVydGV4T2JqZWN0Q29uc3RydWN0b3IgPSB0eXBlb2YgdmVydGV4T2JqZWN0Q29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgPyB2ZXJ0ZXhPYmplY3RDb25zdHJ1Y3RvciA6ICggZnVuY3Rpb24gKCkge30gKTtcbiAgICAgICAgdGhpcy52ZXJ0ZXhPYmplY3RDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBWZXJ0ZXhPYmplY3QucHJvdG90eXBlICk7XG4gICAgICAgIHRoaXMudmVydGV4T2JqZWN0Q29uc3RydWN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gdGhpcy52ZXJ0ZXhPYmplY3RDb25zdHJ1Y3RvcjtcblxuICAgICAgICB0aGlzLnZlcnRleENvdW50ID0gcGFyc2VJbnQoIHZlcnRleENvdW50LCAxMCApO1xuICAgICAgICB0aGlzLnZlcnRleEF0dHJDb3VudCA9IHBhcnNlSW50KCB2ZXJ0ZXhBdHRyQ291bnQsIDEwICk7XG5cbiAgICAgICAgLy8gPT09PT09PSBhdHRyaWJ1dGVzID09PT09PT1cblxuICAgICAgICB0aGlzLmF0dHIgPSB7fTtcblxuICAgICAgICB2YXIgb2Zmc2V0LCBhdHRyLCBpO1xuXG4gICAgICAgIGlmICggQXJyYXkuaXNBcnJheSggYXR0cmlidXRlcyApICkge1xuXG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyArK2kgKSB7XG5cbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cmlidXRlc1sgaSBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBhdHRyLnNpemUgPT09IHVuZGVmaW5lZCApIHRocm93IG5ldyBFcnJvciggJ3ZlcnRleCBvYmplY3QgYXR0cmlidXRlIGRlc2NyaXB0b3IgaGFzIG5vIHNpemUgcHJvcGVydHkhJyApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBhdHRyLm5hbWUgIT09IHVuZGVmaW5lZCApIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJbIGF0dHIubmFtZSBdID0gbmV3IFZlcnRleE9iamVjdEF0dHJEZXNjcmlwdG9yKCBhdHRyLm5hbWUsIGF0dHIuc2l6ZSwgb2Zmc2V0LCAhISBhdHRyLnVuaWZvcm0sIGF0dHIuYXR0ck5hbWVzICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gYXR0ci5zaXplO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggb2Zmc2V0ID4gdGhpcy52ZXJ0ZXhBdHRyQ291bnQgKSB0aHJvdyBuZXcgRXJyb3IoICd2ZXJ0ZXhBdHRyQ291bnQgaXMgdG9vIHNtYWxsIChvZmZzZXQ9JyArIG9mZnNldCArICcpJyApO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09IGFsaWFzZXMgPT09PT09PVxuXG4gICAgICAgIHZhciBuYW1lO1xuXG4gICAgICAgIGlmICggYWxpYXNlcyAhPT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICBmb3IgKCBuYW1lIGluIGFsaWFzZXMgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGFsaWFzZXMuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApIHtcblxuICAgICAgICAgICAgICAgICAgICBhdHRyID0gYWxpYXNlc1sgbmFtZSBdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIGF0dHIgPT09ICdzdHJpbmcnICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyID0gdGhpcy5hdHRyWyBhdHRyIF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggYXR0ciAhPT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRyWyBuYW1lIF0gPSBhdHRyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRyWyBuYW1lIF0gPSBuZXcgVmVydGV4T2JqZWN0QXR0ckRlc2NyaXB0b3IoIG5hbWUsIGF0dHIuc2l6ZSwgYXR0ci5vZmZzZXQsICEhIGF0dHIudW5pZm9ybSwgYXR0ci5hdHRyTmFtZXMgKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PSBwcm9wZXJ0aWVzT2JqZWN0ID09PT09PT1cblxuICAgICAgICB0aGlzLnByb3BlcnRpZXNPYmplY3QgPSB7fTtcblxuICAgICAgICBmb3IgKCBuYW1lIGluIHRoaXMuYXR0ciApIHtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLmF0dHIuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApIHtcblxuICAgICAgICAgICAgICAgIGF0dHIgPSB0aGlzLmF0dHJbIG5hbWUgXTtcblxuICAgICAgICAgICAgICAgIGF0dHIuZGVmaW5lUHJvcGVydGllcyggbmFtZSwgdGhpcy5wcm9wZXJ0aWVzT2JqZWN0LCB0aGlzICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PSB2ZXJ0ZXggb2JqZWN0IHByb3RvdHlwZSA9PT09PT09XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhPYmplY3RQcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCB0aGlzLnZlcnRleE9iamVjdENvbnN0cnVjdG9yLnByb3RvdHlwZSwgdGhpcy5wcm9wZXJ0aWVzT2JqZWN0ICk7XG5cblxuICAgICAgICAvLyA9PT0gd2ludGVya8OkbHRlIGpldHp0XG5cbiAgICAgICAgT2JqZWN0LmZyZWV6ZSggdGhpcy5hdHRyICk7XG4gICAgICAgIE9iamVjdC5mcmVlemUoIHRoaXMgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvciNjcmVhdGVWZXJ0ZXhBcnJheVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc2l6ZT0xXVxuICAgICAqIEByZXR1cm4ge1BpY2ltby5jb3JlLlZlcnRleEFycmF5fVxuICAgICAqL1xuICAgIFZlcnRleE9iamVjdERlc2NyaXB0b3IucHJvdG90eXBlLmNyZWF0ZVZlcnRleEFycmF5ID0gZnVuY3Rpb24gKCBzaXplICkge1xuXG4gICAgICAgIHJldHVybiBuZXcgVmVydGV4QXJyYXkoIHRoaXMsICggc2l6ZSA9PT0gdW5kZWZpbmVkID8gMSA6IHNpemUgKSApO1xuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyB2ZXJ0ZXggb2JqZWN0LlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvciNjcmVhdGVcbiAgICAgKiBAcGFyYW0ge1BpY2ltby5jb3JlLlZlcnRleEFycmF5fSBbdmVydGV4QXJyYXldIC0gVmVydGV4IGFycmF5LlxuICAgICAqIEByZXR1cm4ge1BpY2ltby5jb3JlLlZlcnRleE9iamVjdH1cbiAgICAgKi9cbiAgICBWZXJ0ZXhPYmplY3REZXNjcmlwdG9yLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoIHZlcnRleEFycmF5ICkge1xuXG4gICAgICAgIHZhciB2byA9IE9iamVjdC5jcmVhdGUoIHRoaXMudmVydGV4T2JqZWN0UHJvdG90eXBlICk7XG4gICAgICAgIFZlcnRleE9iamVjdC5jYWxsKCB2bywgdGhpcywgdmVydGV4QXJyYXkgKTtcblxuICAgICAgICBpZiAoIFZlcnRleE9iamVjdCAhPT0gdGhpcy52ZXJ0ZXhPYmplY3RDb25zdHJ1Y3RvciApIHtcblxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhPYmplY3RDb25zdHJ1Y3Rvci5jYWxsKCB2byApO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdm87XG5cbiAgICB9O1xuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggVmVydGV4T2JqZWN0RGVzY3JpcHRvci5wcm90b3R5cGUsIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7T2JqZWN0fSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yI3Byb3RvIC0gVGhlIHByb3RvdHlwZSBvYmplY3Qgb2YgdGhlIHZlcnRleCBvYmplY3QuIFlvdSBzaG91bGQgYWRkIHlvdXIgb3duIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgaGVyZS5cbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuXG4gICAgICAgICdwcm90byc6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVydGV4T2JqZWN0Q29uc3RydWN0b3IucHJvdG90eXBlO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBWZXJ0ZXhPYmplY3RBdHRyRGVzY3JpcHRvclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBmdW5jdGlvbiBWZXJ0ZXhPYmplY3RBdHRyRGVzY3JpcHRvciAoIG5hbWUsIHNpemUsIG9mZnNldCwgdW5pZm9ybSwgYXR0ck5hbWVzICkge1xuXG4gICAgICAgIHRoaXMubmFtZSAgICAgID0gbmFtZTtcbiAgICAgICAgdGhpcy5zaXplICAgICAgPSBzaXplO1xuICAgICAgICB0aGlzLm9mZnNldCAgICA9IG9mZnNldDtcbiAgICAgICAgdGhpcy51bmlmb3JtICAgPSB1bmlmb3JtO1xuICAgICAgICB0aGlzLmF0dHJOYW1lcyA9IGF0dHJOYW1lcztcblxuICAgICAgICBPYmplY3QuZnJlZXplKCB0aGlzICk7XG5cbiAgICB9XG5cbiAgICBWZXJ0ZXhPYmplY3RBdHRyRGVzY3JpcHRvci5wcm90b3R5cGUuZ2V0QXR0clBvc3RmaXggPSBmdW5jdGlvbiAoIG5hbWUsIGluZGV4ICkge1xuXG4gICAgICAgIGlmICggdGhpcy5hdHRyTmFtZXMgKSB7XG5cbiAgICAgICAgICAgIHZhciBwb3N0Zml4ID0gdGhpcy5hdHRyTmFtZXNbIGluZGV4IF07XG5cbiAgICAgICAgICAgIGlmICggcG9zdGZpeCAhPT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvc3RmaXg7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5hbWUgKyAnXycgKyBpbmRleDtcblxuICAgIH07XG5cbiAgICBWZXJ0ZXhPYmplY3RBdHRyRGVzY3JpcHRvci5wcm90b3R5cGUuZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uICggbmFtZSwgb2JqLCBkZXNjcmlwdG9yICkge1xuXG4gICAgICAgIHZhciBpLCBqLCBzZXR0ZXI7XG5cbiAgICAgICAgaWYgKCB0aGlzLnNpemUgPT09IDEgKSB7XG5cbiAgICAgICAgICAgIGlmICggdGhpcy51bmlmb3JtICkge1xuXG4gICAgICAgICAgICAgICAgb2JqWyBuYW1lIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZ2V0ICAgICAgICA6IGdldF92MWZfdSggdGhpcy5vZmZzZXQgKSxcbiAgICAgICAgICAgICAgICAgICAgc2V0ICAgICAgICA6IHNldF92MWZfdSggZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCwgZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQsIHRoaXMub2Zmc2V0ICksXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlXG5cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgb2JqWyBcInNldFwiICsgY2FtZWxpemUoIG5hbWUgKSBdID0ge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlICAgICAgOiBzZXRfdjFmX3YoIGRlc2NyaXB0b3IudmVydGV4Q291bnQsIGRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50LCB0aGlzLm9mZnNldCApLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlIDogdHJ1ZVxuXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZvciAoIGkgPSAwOyBpIDwgZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCA7ICsraSApIHtcblxuICAgICAgICAgICAgICAgICAgICBvYmpbIG5hbWUgKyBpIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdldCAgICAgICAgOiBnZXRfdjFmX3UoIHRoaXMub2Zmc2V0ICsgKCBpICogZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQgKSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0ICAgICAgICA6IHNldF92MWZfdiggMSwgMCwgdGhpcy5vZmZzZXQgKyAoIGkgKiBkZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCApICksXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlIDogdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLnNpemUgPj0gMiAmJiB0aGlzLnNpemUgPD0gNCApIHtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLnVuaWZvcm0gKSB7XG5cbiAgICAgICAgICAgICAgICBvYmpbIFwiZ2V0XCIgKyBjYW1lbGl6ZSggbmFtZSApIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgICAgICA6IGdldF92TmZfdSggdGhpcy5vZmZzZXQgKSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZSA6IHRydWVcblxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBzZXR0ZXIgPSBbIHNldF92MmZfdSwgc2V0X3YzZl91LCBzZXRfdjRmX3UgXVsgdGhpcy5zaXplIC0gMiBdO1xuXG4gICAgICAgICAgICAgICAgb2JqWyBcInNldFwiICsgY2FtZWxpemUoIG5hbWUgKSBdID0ge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlICAgICAgOiBzZXR0ZXIoIGRlc2NyaXB0b3IudmVydGV4Q291bnQsIGRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50LCB0aGlzLm9mZnNldCApLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlIDogdHJ1ZVxuXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZvciAoIGkgPSAwOyBpIDwgdGhpcy5zaXplIDsgKytpICkge1xuXG4gICAgICAgICAgICAgICAgICAgIG9ialsgdGhpcy5nZXRBdHRyUG9zdGZpeCggbmFtZSwgaSApIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdldCAgICAgICAgOiBnZXRfdjFmX3UoIHRoaXMub2Zmc2V0ICsgaSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0ICAgICAgICA6IHNldF92MWZfdSggZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCwgZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQsIHRoaXMub2Zmc2V0ICsgaSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZSA6IHRydWVcblxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgc2V0dGVyID0gWyBzZXRfdjJmX3YsIHNldF92M2ZfdiBdWyB0aGlzLnNpemUgLSAyIF07XG5cbiAgICAgICAgICAgICAgICBvYmpbIFwic2V0XCIgKyBjYW1lbGl6ZSggbmFtZSApIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgICAgICA6IHNldHRlciggZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCwgZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQsIHRoaXMub2Zmc2V0ICksXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlXG5cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZm9yICggaSA9IDA7IGkgPCBkZXNjcmlwdG9yLnZlcnRleENvdW50IDsgKytpICkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKCBqID0gMDsgaiA8IHRoaXMuc2l6ZSA7ICsraiApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqWyB0aGlzLmdldEF0dHJQb3N0Zml4KCBuYW1lLCBqICkgKyBpIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXQgICAgICAgIDogZ2V0X3YxZl91KCB0aGlzLm9mZnNldCArICggaSAqIGRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50ICkgKyBqICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0ICAgICAgICA6IHNldF92MWZfdiggMSwgMCwgdGhpcy5vZmZzZXQgKyAoIGkgKiBkZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCApICsgaiApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggJ1Vuc3VwcHJ0ZWQgdmVydGV4IGF0dHJpYnV0ZSBzaXplIG9mICcgKyB0aGlzLnNpemUgKyAnIChzaG91bGQgbm90IGJlIGdyZWF0ZXIgdGhhbiA0KScgKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0X3ZOZl91ICggb2Zmc2V0ICkge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoIGF0dHJJbmRleCApIHtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVydGV4QXJyYXkudmVydGljZXNbIG9mZnNldCArIGF0dHJJbmRleCBdO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRfdjJmX3UgKCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBvZmZzZXQgKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdjAsIHYxICkge1xuXG4gICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdmVydGV4Q291bnQ7ICsraSApIHtcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCBpICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgICAgIF0gPSB2MDtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggaSAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMSBdID0gdjE7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0X3YzZl91ICggdmVydGV4Q291bnQsIHZlcnRleEF0dHJDb3VudCwgb2Zmc2V0ICkge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHYwLCB2MSwgdjIgKSB7XG5cbiAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgKytpICkge1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIGkgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCAgICAgXSA9IHYwO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCBpICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAxIF0gPSB2MTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggaSAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMiBdID0gdjI7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0X3Y0Zl91ICggdmVydGV4Q291bnQsIHZlcnRleEF0dHJDb3VudCwgb2Zmc2V0ICkge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHYwLCB2MSwgdjIsIHYzICkge1xuXG4gICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdmVydGV4Q291bnQ7ICsraSApIHtcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCBpICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgICAgIF0gPSB2MDtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggaSAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMSBdID0gdjE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIGkgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDIgXSA9IHYyO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCBpICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAzIF0gPSB2MztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRfdjFmX3UgKCBvZmZzZXQgKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmVydGV4QXJyYXkudmVydGljZXNbIG9mZnNldCBdO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRfdjFmX3YgKCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBvZmZzZXQgKSB7XG5cbiAgICAgICAgaWYgKCB2ZXJ0ZXhDb3VudCA9PT0gMSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdmFsdWUgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzWyBvZmZzZXQgXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHZlcnRleENvdW50ID09PSAzICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2MCwgdjEsIHYyICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIF92ZXJ0aWNlcyA9IHRoaXMudmVydGV4QXJyYXkudmVydGljZXM7XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCBdICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MDtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCBdICAgICAgICAgPSB2MTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0IF0gPSB2MjtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKCB2ZXJ0ZXhDb3VudCA9PT0gNCApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdjAsIHYxLCB2MiwgdjMgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0IF0gICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYwO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0IF0gICAgICAgICA9IHYxO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgXSA9IHYyO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAzICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgXSA9IHYzO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggJ1Vuc3VwcG9ydGVkIHZlcnRleENvdW50PScgKyB2ZXJ0ZXhDb3VudCArICcgZm9yIHBlciB2ZXJ0ZXggYXR0cmlidXRlIChhbGxvd2VkIGlzIDEsIDMgb3IgNCknICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0X3YyZl92ICggdmVydGV4Q291bnQsIHZlcnRleEF0dHJDb3VudCwgb2Zmc2V0ICkge1xuXG4gICAgICAgIGlmICggdmVydGV4Q291bnQgPT09IDEgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHZhbHVlXzAsIHZhbHVlXzEgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0IF0gICAgID0gdmFsdWVfMDtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCArIDEgXSA9IHZhbHVlXzE7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmICggdmVydGV4Q291bnQgPT09IDMgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHYwLCB2MSwgdjBfMSwgdjFfMSwgdjBfMiwgdjFfMiApIHtcblxuICAgICAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYwO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0ICsgMSBdICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCBdICAgICAgICAgICAgID0gdjBfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCArIDEgXSAgICAgICAgID0gdjFfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0IF0gICAgID0gdjBfMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMSBdID0gdjFfMjtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKCB2ZXJ0ZXhDb3VudCA9PT0gNCApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdjAsIHYxLCB2MF8xLCB2MV8xLCB2MF8yLCB2MV8yLCB2MF8zLCB2MV8zICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIF92ZXJ0aWNlcyA9IHRoaXMudmVydGV4QXJyYXkudmVydGljZXM7XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCBdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjA7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgKyAxIF0gICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYxO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0IF0gICAgICAgICAgICAgPSB2MF8xO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0ICsgMSBdICAgICAgICAgPSB2MV8xO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgXSAgICAgPSB2MF8yO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAxIF0gPSB2MV8yO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAzICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgXSAgICAgPSB2MF8zO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAzICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAxIF0gPSB2MV8zO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggJ1Vuc3VwcG9ydGVkIHZlcnRleENvdW50PScgKyB2ZXJ0ZXhDb3VudCArICcgZm9yIHBlciB2ZXJ0ZXggYXR0cmlidXRlIChhbGxvd2VkIGlzIDEsIDMgb3IgNCknICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0X3YzZl92ICggdmVydGV4Q291bnQsIHZlcnRleEF0dHJDb3VudCwgb2Zmc2V0ICkge1xuXG4gICAgICAgIGlmICggdmVydGV4Q291bnQgPT09IDEgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHZhbHVlXzAsIHZhbHVlXzEsIHZhbHVlXzIgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0IF0gICAgID0gdmFsdWVfMDtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCArIDEgXSA9IHZhbHVlXzE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgKyAyIF0gPSB2YWx1ZV8yO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHZlcnRleENvdW50ID09PSAzICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2MCwgdjEsIHYyLCB2MF8xLCB2MV8xLCB2Ml8xLCB2MF8yLCB2MV8yLCB2Ml8yICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIF92ZXJ0aWNlcyA9IHRoaXMudmVydGV4QXJyYXkudmVydGljZXM7XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCBdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjA7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgKyAxIF0gICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYxO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0ICsgMiBdICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCBdICAgICAgICAgICAgID0gdjBfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCArIDEgXSAgICAgICAgID0gdjFfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCArIDIgXSAgICAgICAgID0gdjJfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0IF0gICAgID0gdjBfMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMSBdID0gdjFfMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMiBdID0gdjJfMjtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKCB2ZXJ0ZXhDb3VudCA9PT0gNCApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdjAsIHYxLCB2MiwgdjBfMSwgdjFfMSwgdjJfMSwgdjBfMiwgdjFfMiwgdjJfMiwgdjBfMywgdjFfMywgdjJfMyApIHtcblxuICAgICAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYwO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0ICsgMSBdICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCArIDIgXSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyB2ZXJ0ZXhBdHRyQ291bnQgKyBvZmZzZXQgXSAgICAgICAgICAgICA9IHYwXzE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyB2ZXJ0ZXhBdHRyQ291bnQgKyBvZmZzZXQgKyAxIF0gICAgICAgICA9IHYxXzE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyB2ZXJ0ZXhBdHRyQ291bnQgKyBvZmZzZXQgKyAyIF0gICAgICAgICA9IHYyXzE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDIgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCBdICAgICA9IHYwXzI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDIgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDEgXSA9IHYxXzI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDIgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDIgXSA9IHYyXzI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDMgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCBdICAgICA9IHYwXzM7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDMgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDEgXSA9IHYxXzM7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDMgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDIgXSA9IHYyXzM7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnVW5zdXBwb3J0ZWQgdmVydGV4Q291bnQ9JyArIHZlcnRleENvdW50ICsgJyBmb3IgcGVyIHZlcnRleCBhdHRyaWJ1dGUgKGFsbG93ZWQgaXMgMSwgMyBvciA0KScgKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRfdjFmX3UgKCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBvZmZzZXQgKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdmFsdWUgKSB7XG5cbiAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgKytpICkge1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIGkgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCBdID0gdmFsdWU7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBjYW1lbGl6ZSggbmFtZSApIHtcblxuICAgICAgICByZXR1cm4gbmFtZVsgMCBdLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0ciggMSApO1xuXG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhPYmplY3REZXNjcmlwdG9yO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0UG9vbFxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvcn0gZGVzY3JpcHRvciAtIFZlcnRleCBvYmplY3QgZGVzY3JpcHRvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY2FwYWNpdHkgLSBNYXhpbXVtIG51bWJlciBvZiB2ZXJ0ZXggb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge1BpY2ltby5jb3JlLlZlcnRleEFycmF5fSBbdmVydGV4QXJyYXldIC0gVmVydGV4IGFycmF5LlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gVmVydGV4T2JqZWN0UG9vbCAoIGRlc2NyaXB0b3IsIGNhcGFjaXR5LCB2ZXJ0ZXhBcnJheSApIHtcblxuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydGllc1B1YmxpY1JPKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvcn0gUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0UG9vbCNkZXNjcmlwdG9yIC0gVmVydGV4IG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICdkZXNjcmlwdG9yJyA6IGRlc2NyaXB0b3IsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sI2NhcGFjaXR5IC0gTWF4aW11bSBudW1iZXIgb2YgdmVydGV4IG9iamVjdHMuXG4gICAgICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJ2NhcGFjaXR5JyA6IGNhcGFjaXR5LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLlZlcnRleEFycmF5fSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sI3ZlcnRleEFycmF5IC0gVmVydGV4IGFycmF5LlxuICAgICAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICd2ZXJ0ZXhBcnJheScgOiAoIHZlcnRleEFycmF5ICE9IG51bGwgPyB2ZXJ0ZXhBcnJheSA6IGRlc2NyaXB0b3IuY3JlYXRlVmVydGV4QXJyYXkoIGNhcGFjaXR5ICkgKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3R9IFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFBvb2wjWkVSTyAtIFRoZSAqemVybyogdmVydGV4IG9iamVjdC5cbiAgICAgICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAnWkVSTycgOiBkZXNjcmlwdG9yLmNyZWF0ZSgpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLlZlcnRleE9iamVjdH0gUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0UG9vbCNORVcgLSBUaGUgKm5ldyogdmVydGV4IG9iamVjdC5cbiAgICAgICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAnTkVXJyA6IGRlc2NyaXB0b3IuY3JlYXRlKClcblxuICAgICAgICB9KTtcblxuICAgICAgICBjcmVhdGVWZXJ0ZXhPYmplY3RzKCB0aGlzICk7XG5cbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggVmVydGV4T2JqZWN0UG9vbC5wcm90b3R5cGUsIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sI3VzZWRDb3VudCAtIE51bWJlciBvZiBpbi11c2UgdmVydGV4IG9iamVjdHMuXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgJ3VzZWRDb3VudCc6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51c2VkVk9zLmxlbmd0aDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0UG9vbCNhdmFpbGFibGVDb3VudCAtIE51bWJlciBvZiBmcmVlIGFuZCB1bnVzZWQgdmVydGV4IG9iamVjdHMuXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgJ2F2YWlsYWJsZUNvdW50Jzoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZVZPcy5sZW5ndGg7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sI2FsbG9jXG4gICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGNhcGFjaXR5IHJlYWNoZWQgYW5kIG5vIHZlcnRleCBvYmplY3QgaXMgYXZhaWxhYmxlLlxuICAgICAqIEByZXR1cm4ge1BpY2ltby5jb3JlLlZlcnRleE9iamVjdH1cbiAgICAgKi9cblxuICAgIFZlcnRleE9iamVjdFBvb2wucHJvdG90eXBlLmFsbG9jID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciB2byA9IHRoaXMuYXZhaWxhYmxlVk9zLnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKCB2byA9PT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVmVydGV4T2JqZWN0UG9vbCBjYXBhY2l0eSg9XCIgKyB0aGlzLmNhcGFjaXR5ICsgXCIpIHJlYWNoZWQhXCIgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VkVk9zLnB1c2goIHZvICk7XG5cbiAgICAgICAgdm8udmVydGV4QXJyYXkuY29weSggdGhpcy5ORVcudmVydGV4QXJyYXkgKTtcblxuICAgICAgICByZXR1cm4gdm87XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFBvb2wjZnJlZVxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0fSB2byAtIFRoZSB2ZXJ0ZXggb2JqZWN0XG4gICAgICovXG5cbiAgICBWZXJ0ZXhPYmplY3RQb29sLnByb3RvdHlwZS5mcmVlID0gZnVuY3Rpb24gKCB2byApIHtcblxuICAgICAgICB2YXIgaWR4ID0gdGhpcy51c2VkVk9zLmluZGV4T2YoIHZvICk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIGlkeCA9PT0gLTEgKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGxhc3RJZHggPSB0aGlzLnVzZWRWT3MubGVuZ3RoIC0gMTtcblxuICAgICAgICBpZiAoIGlkeCAhPT0gbGFzdElkeCApIHtcblxuICAgICAgICAgICAgdmFyIGxhc3QgPSB0aGlzLnVzZWRWT3NbIGxhc3RJZHggXTtcbiAgICAgICAgICAgIHZvLnZlcnRleEFycmF5LmNvcHkoIGxhc3QudmVydGV4QXJyYXkgKTtcblxuICAgICAgICAgICAgdmFyIHRtcCA9IGxhc3QudmVydGV4QXJyYXk7XG4gICAgICAgICAgICBsYXN0LnZlcnRleEFycmF5ID0gdm8udmVydGV4QXJyYXk7XG4gICAgICAgICAgICB2by52ZXJ0ZXhBcnJheSA9IHRtcDtcblxuICAgICAgICAgICAgdGhpcy51c2VkVk9zLnNwbGljZSggaWR4LCAxLCBsYXN0ICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXNlZFZPcy5wb3AoKTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVWT3MudW5zaGlmdCggdm8gKTtcblxuICAgICAgICB2by52ZXJ0ZXhBcnJheS5jb3B5KCB0aGlzLlpFUk8udmVydGV4QXJyYXkgKTtcblxuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVZlcnRleE9iamVjdHMoIHBvb2wgKSB7XG5cbiAgICAgICAgcG9vbC5hdmFpbGFibGVWT3MgPSBbXTtcblxuICAgICAgICB2YXIgdmVydGV4QXJyYXksIHZlcnRleE9iamVjdDtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCBwb29sLmNhcGFjaXR5OyBpKysgKSB7XG5cbiAgICAgICAgICAgIHZlcnRleEFycmF5ID0gcG9vbC52ZXJ0ZXhBcnJheS5zdWJhcnJheSggaSApO1xuICAgICAgICAgICAgdmVydGV4T2JqZWN0ID0gcG9vbC5kZXNjcmlwdG9yLmNyZWF0ZSggdmVydGV4QXJyYXkgKTtcblxuICAgICAgICAgICAgcG9vbC5hdmFpbGFibGVWT3MucHVzaCggdmVydGV4T2JqZWN0ICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHBvb2wudXNlZFZPcyA9IFtdO1xuXG4gICAgfVxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleE9iamVjdFBvb2w7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBQUJCMiA9IHJlcXVpcmUoIFwiLi9hYWJiMlwiICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLmNvcmUuVmlld3BvcnRcbiAgICAgKiBAZXh0ZW5kcyBQaWNpbW8uY29yZS5BQUJCMlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0geVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIHdpZHRoXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIGhlaWdodFxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gVmlld3BvcnQgKCB4LCB5LCB3aWR0aCwgaGVpZ2h0ICkge1xuXG4gICAgICAgIHZhciBtaW5feCA9IHBhcnNlSW50KCB4LCAxMCApO1xuICAgICAgICB2YXIgbWluX3kgPSBwYXJzZUludCggeSwgMTAgKTtcblxuICAgICAgICBBQUJCMi5jYWxsKCB0aGlzLFxuICAgICAgICAgICAgICAgIG1pbl94LCAoIG1pbl94ICsgcGFyc2VJbnQoIHdpZHRoLCAxMCApIC0gMSApLFxuICAgICAgICAgICAgICAgIG1pbl95LCAoIG1pbl95ICsgcGFyc2VJbnQoIGhlaWdodCwgMTAgKSAtIDEgKSApO1xuXG4gICAgfVxuXG4gICAgVmlld3BvcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggQUFCQjIucHJvdG90eXBlICk7XG4gICAgVmlld3BvcnQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVmlld3BvcnQ7XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBWaWV3cG9ydC5wcm90b3R5cGUsIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuVmlld3BvcnR9IFBpY2ltby5jb3JlLlZpZXdwb3J0I3hcbiAgICAgICAgICovXG5cbiAgICAgICAgeDoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5taW5feDtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCB4ICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHcgPSB0aGlzLndpZHRoO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5taW5feCA9IHg7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhfeCA9IHggKyB3IC0gMTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuVmlld3BvcnR9IFBpY2ltby5jb3JlLlZpZXdwb3J0I3lcbiAgICAgICAgICovXG5cbiAgICAgICAgeToge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5taW5feTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCB5ICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGggPSB0aGlzLmhlaWdodDtcblxuICAgICAgICAgICAgICAgIHRoaXMubWluX3kgPSB5O1xuICAgICAgICAgICAgICAgIHRoaXMubWF4X3kgPSB5ICsgaCAtIDE7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLlZpZXdwb3J0fSBQaWNpbW8uY29yZS5WaWV3cG9ydCN3aWR0aFxuICAgICAgICAgKi9cblxuICAgICAgICAnd2lkdGgnOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMubWF4X3ggLSB0aGlzLm1pbl94ICsgMTsgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCB3ICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tYXhfeCA9IHRoaXMubWluX3ggKyB3IC0gMTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuVmlld3BvcnR9IFBpY2ltby5jb3JlLlZpZXdwb3J0I2hlaWdodFxuICAgICAgICAgKi9cblxuICAgICAgICAnaGVpZ2h0Jzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLm1heF95IC0gdGhpcy5taW5feSArIDE7IH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggaCApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMubWF4X3kgPSB0aGlzLm1pbl95ICsgaCAtIDE7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICB9KTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWaWV3cG9ydDtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIChmdW5jdGlvbihhcGkpIHtcblxuICAgICAgICBfZGVmaW5lUHVibGljUHJvcGVydHlSTyhhcGksICdWRVJTSU9OJywgXCIwLjEwLjJcIik7XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vXG4gICAgICAgIC8vIGV2ZW50aXplKCBvYmplY3QgKVxuICAgICAgICAvL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZnVuY3Rpb24gUGljaW1vLmV2ZW50cy5ldmVudGl6ZVxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogICBBcHBlbmQgdGhlICpDdXN0b21FdmVudCogaW50ZXJmYWNlIHRvIGFuIG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG8gLSBhbnkgb2JqZWN0XG4gICAgICAgICAqIEByZXR1cm4gb1xuICAgICAgICAgKi9cblxuICAgICAgICBhcGkuZXZlbnRpemUgPSBmdW5jdGlvbihvKSB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQSBzaW1wbGUgZXZlbnQgaW50ZXJmYWNlIGZvciBvYmplY3RzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBjbGFzcyBQaWNpbW8uZXZlbnRzLkN1c3RvbUV2ZW50XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIF9kZWZpbmVIaWRkZW5Qcm9wZXJ0eVJPKG8sICdfY2FsbGJhY2tzJywgeyBfaWQ6IDAgfSk7XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gb2JqZWN0Lm9uKCBldmVudE5hbWUsIFsgcHJpbywgXSBjYWxsYmFjayApXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgUGljaW1vLmV2ZW50cy5DdXN0b21FdmVudCNvblxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBFeGVjdXRlIHRoZSBnaXZlbiBmdW5jdGlvbiBldmVyeXRpbWUgd2hlbiB0aGUgZXZlbnQgb2NjdXJyZWQuXG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ByaW89MF1cbiAgICAgICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgb2NjdXJyZWQuXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gQSBsaXN0ZW5lciBpZFxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIG8ub24gPSBmdW5jdGlvbihldmVudE5hbWUsIHByaW8sIGZuKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPIGNyZWF0ZSBvd24gYmluZCgpIG1ldGhvZFxuICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXRMaXN0ZW5lckZyb21PcHRpb25zKHRoaXMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBmbiA9IHByaW87XG4gICAgICAgICAgICAgICAgICAgIHByaW8gPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBldmVudExpc3RlbmVyID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50TmFtZV0gfHwgKHRoaXMuX2NhbGxiYWNrc1tldmVudE5hbWVdID0gW10pXG4gICAgICAgICAgICAgICAgICAsIGxpc3RlbmVySWQgPSArK3RoaXMuX2NhbGxiYWNrcy5faWRcbiAgICAgICAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IF9kZWZpbmVQdWJsaWNQcm9wZXJ0aWVzUk8oe30sIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGxpc3RlbmVySWQsXG4gICAgICAgICAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgICAgICAgICAgcHJpbzogKHByaW98fDApLFxuICAgICAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uOiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lci5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBldmVudExpc3RlbmVyLnNvcnQoc29ydExpc3RlbmVyQnlQcmlvKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lcklkO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzb3J0TGlzdGVuZXJCeVByaW8oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBiLnByaW8gLSBhLnByaW87XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gb2JqZWN0Lm9uY2UoIGV2ZW50TmFtZSwgWyBwcmlvLCBdIGNhbGxiYWNrIClcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgUGljaW1vLmV2ZW50cy5DdXN0b21FdmVudCNvbmNlXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIEV4ZWN1dGUgdGhlIGdpdmVuIGZ1bmN0aW9uIHdoZW4gdGhlIGV2ZW50IG9jY3VycmVkLiAqVGhlIGZ1bmN0aW9uIHdpbGwgb25seSBiZSBjYWxsZWQgb25jZWQqLlxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IFtwcmlvPTBdXG4gICAgICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IG9jY3VycmVkLlxuICAgICAgICAgICAgICogQHJldHVybiB7bnVtYmVyfSAtIEEgbGlzdGVuZXIgaWRcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBvLm9uY2UgPSBmdW5jdGlvbihldmVudE5hbWUsIHByaW8sIGZuKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBmbiA9IHByaW87XG4gICAgICAgICAgICAgICAgICAgIHByaW8gPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBsaWQgPSBvLm9uKGV2ZW50TmFtZSwgcHJpbywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG8ub2ZmKGxpZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpZDtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBvYmplY3Qub2ZmKCBpZCApXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIFBpY2ltby5ldmVudHMuQ3VzdG9tRXZlbnQjb2ZmXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAqIFVuc3Vic3JpYmUgYSBsaXN0ZW5lci5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIGxpc3RlbmVyIGlkXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgby5vZmYgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgIHZhciBjYiwgaSwgaiwgX2NhbGxiYWNrcywga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX2NhbGxiYWNrcyk7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1trZXlzW2pdXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IF9jYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiID0gX2NhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYi5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIG9iamVjdC5lbWl0KCBldmVudE5hbWUgWywgYXJndW1lbnRzIC4uIF0gKVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBQaWNpbW8uZXZlbnRzLkN1c3RvbUV2ZW50I2VtaXRcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAgICogVHJpZ2dlciBhbiBldmVudC5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgLSBUaGUgZXZlbnQgbmFtZS5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7Li4uYXJndW1lbnRzfSBbLi4uYXJnc10gLSBBcmd1bWVudHMgZm9yIHRoZSBldmVudCBjYWxsYmFjayBmdW5jdGlvbnMuXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgby5lbWl0ID0gZnVuY3Rpb24oZXZlbnROYW1lIC8qLCBhcmd1bWVudHMgLi4qLykge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICB2YXIgX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIHZhciBpLCBsZW4sIGNiO1xuICAgICAgICAgICAgICAgIGlmIChfY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbiA9IF9jYWxsYmFja3MubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiID0gX2NhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYi5pc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLmZuLmVtaXQoZXZlbnROYW1lLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gb2JqZWN0LmVtaXRSZWR1Y2UoIGV2ZW50TmFtZSBbLCBhcmd1bWVudHMgLi4gXSApXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIFBpY2ltby5ldmVudHMuQ3VzdG9tRXZlbnQjZW1pdFJlZHVjZVxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgKiBUcmlnZ2VyIGFuIGV2ZW50LlxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIFRoZSBldmVudCBuYW1lLlxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIC0gVGhpcyB3aWxsIGJlIHRoZSBmaXJzdCBhcmd1bWVudCBnaXZlbiB0byBhbGwgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICAgICAgICAgICAgICogQHBhcmFtIHsuLi5hcmd1bWVudHN9IFsuLi5hcmdzXSAtIEFyZ3VtZW50cyBmb3IgdGhlIGV2ZW50IGNhbGxiYWNrIGZ1bmN0aW9ucy5cbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBvLmVtaXRSZWR1Y2UgPSBmdW5jdGlvbihldmVudE5hbWUgLyosIHZhbHVlLCBbYXJndW1lbnRzIC4uXSAqLykge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICB2YXIgX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIHZhciBpLCBsZW4sIGNiO1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2goe30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoX2NhbGxiYWNrcykge1xuICAgICAgICAgICAgICAgICAgICBsZW4gPSBfY2FsbGJhY2tzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYiA9IF9jYWxsYmFja3NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzWzBdID0gY2IuaXNGdW5jdGlvbiA/IGNiLmZuLmFwcGx5KHRoaXMsIGFyZ3MpIDogY2IuZm4uZW1pdFJlZHVjZShldmVudE5hbWUsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vXG4gICAgICAgIC8vIHNldExpc3RlbmVyRnJvbU9wdGlvbnNcbiAgICAgICAgLy9cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLy8gLm9uKCBvcHRpb25zLCB7IG9uUHJvamVjdGlvblVwZGF0ZWQ6IFsxMDAsICdwcm9qZWN0aW9uVXBkYXRlZCddLCBvbkZyYW1lOiAnZnJhbWUnLCBvbkZyYW1lRW5kOiAnZnJhbWVFbmQnIH0gKVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldExpc3RlbmVyRnJvbU9wdGlvbnMob2JqLCBvcHRpb25zLCBsaXN0ZW5lck1hcCkge1xuXG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lLCBsaXN0ZW5OYW1lLCBsaXN0ZW5GdW5jLCBwcmlvO1xuXG4gICAgICAgICAgICBmb3IgKGxpc3Rlbk5hbWUgaW4gbGlzdGVuZXJNYXApIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJNYXAuaGFzT3duUHJvcGVydHkobGlzdGVuTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuRnVuYyA9IG9wdGlvbnNbbGlzdGVuTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbGlzdGVuRnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lID0gbGlzdGVuZXJNYXBbbGlzdGVuTmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbyA9IGV2ZW50TmFtZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBldmVudE5hbWVbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2XCoHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5vbihldmVudE5hbWUsIHByaW8sIGxpc3RlbkZ1bmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gaGVscGVyIGZ1bmN0aW9uc1xuICAgICAgICAvL1xuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBmdW5jdGlvbiBfZGVmaW5lUHVibGljUHJvcGVydHlSTyhvYmosIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgdmFsdWUgICAgICAgIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlICAgOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfZGVmaW5lUHVibGljUHJvcGVydGllc1JPKG9iaiwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciBpLCBrZXlzID0gT2JqZWN0LmtleXMoYXR0cnMpO1xuICAgICAgICAgICAgZm9yIChpID0ga2V5cy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICBfZGVmaW5lUHVibGljUHJvcGVydHlSTyhvYmosIGtleXNbaV0sIGF0dHJzW2tleXNbaV1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfZGVmaW5lSGlkZGVuUHJvcGVydHlSTyhvYmosIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgdmFsdWUgICAgICAgIDogdmFsdWUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlIDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICB9KShtb2R1bGUuZXhwb3J0cyk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgUGljaW1vLmV2ZW50c1xuICAgICAqIEBzdW1tYXJ5XG4gICAgICogQSBzaW1wbGUgZXZlbnQgbGlicmFyeS5cbiAgICAgKi9cblxuICAgIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vY3VzdG9tX2V2ZW50JyApO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFBpY2ltb1xuICAgICAqL1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgQXBwICAgICA6IHJlcXVpcmUoICcuL2FwcCcgKSxcbiAgICAgICAgc2cgICAgICA6IHJlcXVpcmUoICcuL3NnJyApLFxuICAgICAgICB3ZWJnbCAgIDogcmVxdWlyZSggJy4vd2ViZ2wnICksXG4gICAgICAgIHV0aWxzICAgOiByZXF1aXJlKCAnLi91dGlscycgKSxcbiAgICAgICAgY29yZSAgICA6IHJlcXVpcmUoICcuL2NvcmUnICksXG4gICAgICAgIHNwcml0ZXMgOiByZXF1aXJlKCAnLi9zcHJpdGVzJyApXG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFBpY2ltby5zZ1xuICAgICAqIEBzdW1tYXJ5XG4gICAgICogU2NlbmUtZ3JhcGggcmVsYXRlZCBvYmplY3RzIGFuZCBjbGFzc2VzLlxuICAgICAqL1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgTm9kZTogcmVxdWlyZSggJy4vbm9kZScgKSxcbiAgICAgICAgTm9kZVN0YXRlOiByZXF1aXJlKCAnLi9ub2RlX3N0YXRlJyApXG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgICAgID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuICAgIHZhciBldmVudHMgICAgPSByZXF1aXJlKCAnLi4vZXZlbnRzJyApO1xuICAgIHZhciBOb2RlU3RhdGUgPSByZXF1aXJlKCAnLi9ub2RlX3N0YXRlJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby5zZy5Ob2RlXG4gICAgICogQGV4dGVuZHMgUGljaW1vLmV2ZW50cy5DdXN0b21FdmVudFxuICAgICAqXG4gICAgICogQGNsYXNzZGVzY1xuICAgICAqIFRoZSBnZW5lcmljIGJhc2UgY2xhc3MgZm9yIGFsbCBzY2VuZSBncmFwaCBub2Rlcy5cbiAgICAgKlxuICAgICAqICMjIyBTdGF0ZXMgYW5kIEV2ZW50c1xuICAgICAqIDxpbWcgc3JjPVwiaW1hZ2VzL25vZGUtZXZlbnRzLnBuZ1wiIHNyY3NldD1cImltYWdlcy9ub2RlLWV2ZW50cy5wbmcgMXgsaW1hZ2VzL25vZGUtZXZlbnRzQDJ4LnBuZyAyeFwiIGFsdD1cIk5vZGUgRXZlbnRzIGFuZCBTdGF0ZXNcIj5cbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQaWNpbW8uQXBwfSBhcHAgLSBUaGUgYXBwIGluc3RhbmNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIFRoZSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5kaXNwbGF5PXRydWVdXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5yZWFkeT10cnVlXVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLm9uSW5pdF1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5vbkluaXRHbF1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5vblJlc2l6ZV1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5vbkZyYW1lXVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLm9uUmVuZGVyRnJhbWVdXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMub25GcmFtZUVuZF1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5vbkRlc3Ryb3ldXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMub25EZXN0cm95R2xdXG4gICAgICpcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIE5vZGUgKCBhcHAsIG9wdGlvbnMgKSB7XG5cbiAgICAgICAgaWYgKCAhIGFwcCApIHRocm93IG5ldyBFcnJvciggJ1tQaWNpbW8uc2cuTm9kZV0gYXBwIGlzIG51bGwhJyApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uQXBwfSBQaWNpbW8uc2cuTm9kZSNhcHAgLSBUaGUgYXBwIGluc3RhbmNlXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnR5UHVibGljUk8oIHRoaXMsICdhcHAnLCBhcHAgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLnNnLk5vZGVTdGF0ZX0gUGljaW1vLnNnLk5vZGUjc3RhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgTm9kZVN0YXRlKCBOb2RlU3RhdGUuQ1JFQVRFICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge2Jvb2xlYW59IFBpY2ltby5zZy5Ob2RlI2Rpc3BsYXlcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIElmIHNldCB0byAqZmFsc2UqIHRoZSBub2RlIHdvbid0IGJlIHJlbmRlcmVkLiBUaGUgKmZyYW1lKiwgKnJlbmRlckZyYW1lKiBhbmQgKmZyYW1lRW5kKiBldmVudHMgd29uJ3QgYmUgZW1pdHRlZC5cbiAgICAgICAgICogQlVUIGluaXRpYWxpemF0aW9uIHdpbGwgYmUgaGFwcGVuLiAoSWYgeW91IGRvbid0IHdhbnQgdGhlIG5vZGUgdG8gaW5pdGlhbGl6ZSBzZXQgdGhlICpyZWFkeSogYXR0cmlidXRlIHRvICpmYWxzZSopLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gKCAhIG9wdGlvbnMgKSB8fCAoIG9wdGlvbnMuZGlzcGxheSAhPT0gZmFsc2UgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLkFwcH0gUGljaW1vLnNnLk5vZGUjcGFyZW50IC0gVGhlIHBhcmVudCBub2RlLlxuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLl9yZWFkeSA9ICggISBvcHRpb25zICkgfHwgb3B0aW9ucy5yZWFkeSAhPT0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5zZy5Ob2RlfSBQaWNpbW8uc2cuTm9kZSNjaGlsZHJlbiAtIFRoZSBjaGlsZCBub2RlcyBhcnJheS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcblxuICAgIFxuICAgICAgICBldmVudHMuZXZlbnRpemUoIHRoaXMgKTtcblxuICAgICAgICBpZiAoIG9wdGlvbnMgIT09IHVuZGVmaW5lZCApIHtcblxuICAgICAgICAgICAgdGhpcy5vbiggb3B0aW9ucywge1xuICAgICAgICAgICAgICAgICdvbkluaXQnICAgICAgIDogJ2luaXQnLFxuICAgICAgICAgICAgICAgICdvbkluaXRHbCcgICAgIDogJ2luaXRHbCcsXG4gICAgICAgICAgICAgICAgJ29uUmVzaXplJyAgICAgOiAncmVzaXplJyxcbiAgICAgICAgICAgICAgICAnb25GcmFtZScgICAgICA6ICdmcmFtZScsXG4gICAgICAgICAgICAgICAgJ29uUmVuZGVyRnJhbWUnOiAncmVuZGVyRnJhbWUnLFxuICAgICAgICAgICAgICAgICdvbkZyYW1lRW5kJyAgIDogJ2ZyYW1lRW5kJyxcbiAgICAgICAgICAgICAgICAnb25EZXN0cm95R2wnICA6ICdkZXN0cm95R2wnLFxuICAgICAgICAgICAgICAgICdvbkRlc3Ryb3knICAgIDogJ2Rlc3Ryb3knLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8uc2cuTm9kZSNhZGRDaGlsZFxuICAgICAqIEBwYXJhbSB7UGljaW1vLnNnLk5vZGV9XG4gICAgICovXG4gICAgTm9kZS5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoIG5vZGUgKSB7XG5cbiAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKCBub2RlICk7XG5cbiAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBub2RlO1xuXG4gICAgfTtcblxuICAgIE5vZGUucHJvdG90eXBlLnJlbmRlckZyYW1lID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlmICggISB0aGlzLnJlYWR5ICkgcmV0dXJuO1xuXG4gICAgICAgIGlmICggdGhpcy5zdGF0ZS5pcyggTm9kZVN0YXRlLkNSRUFURSApICkge1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgLT4gaW5pdGlhbGl6ZVxuXG4gICAgICAgICAgICBvbkluaXQoIHRoaXMgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0aGlzLnN0YXRlLmlzKCBOb2RlU3RhdGUuUkVBRFkgKSApIHtcblxuICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSAtPiByZWFkeSB0byByZW5kZXJcblxuICAgICAgICAgICAgLy8gVE9ETyByZXNpemVcblxuICAgICAgICAgICAgaWYgKCB0aGlzLmRpc3BsYXkgKSB7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJcyBjYWxsZWQgb25seSBpZiBub2RlIGlzICpyZWFkeSogYW5kICpkaXNwbGF5Ki1hYmxlLlxuICAgICAgICAgICAgICAgICAgICAgKiBAZXZlbnQgUGljaW1vLnNnLk5vZGUjZnJhbWVcbiAgICAgICAgICAgICAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoICdmcmFtZScgKTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSXMgY2FsbGVkIGp1c3QgYWZ0ZXIgdGhlICpmcmFtZSogZXZlbnQgYW5kIGJlZm9yZSB0aGUgKmZyYW1lRW5kKiBldmVudC4gVGhlICpyZW5kZXIgY29tbWFuZHMqIHNob3VsZCBiZSBnZW5lcmF0ZWQgaGVyZS5cbiAgICAgICAgICAgICAgICAgICAgICogQGV2ZW50IFBpY2ltby5zZy5Ob2RlI3JlbmRlckZyYW1lXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCAncmVuZGVyRnJhbWUnICk7XG5cbiAgICAgICAgICAgICAgICB9IGNhdGNoICggZXJyICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoICdbZnJhbWUscmVuZGVyRnJhbWVdJywgZXJyICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlblsgaSBdLnJlbmRlckZyYW1lKCk7XG5cbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElzIGNhbGxlZCBhZnRlciB0aGUgb24gKmZyYW1lKiBhbmQgKnJlbmRlckZyYW1lKiBldmVudHMuXG4gICAgICAgICAgICAgICAgICAgICAqIEBldmVudCBQaWNpbW8uc2cuTm9kZSNmcmFtZUVuZFxuICAgICAgICAgICAgICAgICAgICAgKiBAbWVtYmVyb2YgUGljaW1vLnNnLk5vZGVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCggJ2ZyYW1lRW5kJyApO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoIGVyciApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCAnW2ZyYW1lRW5kXScsIGVyciApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby5zZy5Ob2RlI2Rlc3Ryb3lcbiAgICAgKi9cbiAgICBOb2RlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlmICggdGhpcy5zdGF0ZS5pcyggTm9kZVN0YXRlLkRFU1RST1lFRCApICkgcmV0dXJuO1xuXG5cbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7ICsraSApIHtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblsgaSBdLmRlc3Ryb3koKTtcblxuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLnN0YXRlLnNldCggTm9kZVN0YXRlLkRFU1RST1lFRCApO1xuXG4gICAgICAgIGlmICggdGhpcy5faW5pdGlhbGl6ZWQgKSB7XG5cbiAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJcyBvbmx5IGNhbGxlZCBpZiB0aGUgKmluaXQqIGV2ZW50IHN1Y2Nlc3NmdWxseSByZXNvbHZlZC4gKkV2ZW4gaWYgdGhlICppbml0R2wqIGV2ZW50IGZhaWxlZCouXG4gICAgICAgICAgICAgICAgICogSXMgY2FsbGVkIGJlZm9yZSB0aGUgKmRlc3Ryb3kqIGV2ZW50LlxuICAgICAgICAgICAgICAgICAqIEBldmVudCBQaWNpbW8uc2cuTm9kZSNkZXN0cm95R2xcbiAgICAgICAgICAgICAgICAgKiBAbWVtYmVyb2YgUGljaW1vLnNnLk5vZGVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoICdkZXN0cm95R2wnICk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKCBlcnIgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCAnW2Rlc3Ryb3lHbF0nLCBlcnIgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSXMgb25seSBjYWxsZWQgaWYgdGhlICppbml0KiBldmVudCBzdWNjZXNzZnVsbHkgcmVzb2x2ZWQgYW5kIGp1c3QgYWZ0ZXIgdGhlICpkZXN0cm95R2wqIGV2ZW50LlxuICAgICAgICAgICAgICAgICAqIEBldmVudCBQaWNpbW8uc2cuTm9kZSNkZXN0cm95XG4gICAgICAgICAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCAnZGVzdHJveScgKTtcblxuICAgICAgICAgICAgfSBjYXRjaCAoIGVyciApIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoICdbZGVzdHJveV0nLCBlcnIgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBvbkluaXQgKCBub2RlICkge1xuXG4gICAgICAgIG5vZGUuc3RhdGUuc2V0KCBOb2RlU3RhdGUuSU5JVCApO1xuXG4gICAgICAgIHZhciBpbml0UHJvbWlzZXMgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFRoaXMgaXMgdGhlIGZpcnN0IGV2ZW50LiBJcyBjYWxsZWQgb25seSBvbmNlLlxuICAgICAgICAgICAgICogQGV2ZW50IFBpY2ltby5zZy5Ob2RlI2luaXRcbiAgICAgICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBub2RlLmVtaXQoICdpbml0JywgbWFrZURvbmVGdW5jKCBpbml0UHJvbWlzZXMsIG5vZGUgKSApO1xuXG4gICAgICAgICAgICB1dGlscy5Qcm9taXNlLmFsbCggaW5pdFByb21pc2VzICkudGhlbiggb25Jbml0R2wuYmluZCggbm9kZSwgbm9kZSApLCBvbkZhaWwuYmluZCggbm9kZSwgbm9kZSApICk7XG5cbiAgICAgICAgfSBjYXRjaCAoIGVyciApIHtcblxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggJ1tpbml0XScsIGVyciApO1xuXG4gICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Jbml0R2wgKCBub2RlICkge1xuXG4gICAgICAgIG5vZGUuX2luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoICEgbm9kZS5yZWFkeSApIHJldHVybjtcblxuICAgICAgICB2YXIgaW5pdEdsUHJvbWlzZXMgPSBbXTtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElzIGNhbGxlZCBqdXN0IGFmdGVyICppbml0Ki4gU2hvdWxkIG9ubHkgYmUgdXNlZCB0byBwZXJmb3JtIHdlYmdsIHJlbGF0ZWQgdGFza3MuXG4gICAgICAgICAgICAgKiBAZXZlbnQgUGljaW1vLnNnLk5vZGUjaW5pdEdsXG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgUGljaW1vLnNnLk5vZGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbm9kZS5lbWl0KCAnaW5pdEdsJywgbWFrZURvbmVGdW5jKCBpbml0R2xQcm9taXNlcywgbm9kZSApICk7XG5cbiAgICAgICAgICAgIHV0aWxzLlByb21pc2UuYWxsKCBpbml0R2xQcm9taXNlcyApLnRoZW4oIG9uSW5pdERvbmUuYmluZCggbm9kZSwgbm9kZSApLCBvbkZhaWwuYmluZCggbm9kZSwgbm9kZSApICk7XG5cbiAgICAgICAgfSBjYXRjaCAoIGVyciApIHtcblxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggJ1tpbml0R2xdJywgZXJyICk7XG5cbiAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Jbml0RG9uZSAoIG5vZGUgKSB7XG5cbiAgICAgICAgaWYgKCBub2RlLnJlYWR5ICkge1xuXG4gICAgICAgICAgICBub2RlLnN0YXRlLnNldCggTm9kZVN0YXRlLlJFQURZICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURvbmVGdW5jICggYXJyICkge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHByb21pc2UgKSB7XG5cbiAgICAgICAgICAgIGlmICggcHJvbWlzZSApIHtcblxuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHByb21pc2UgPT09ICdmdW5jdGlvbicgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZSA9IG5ldyB1dGlscy5Qcm9taXNlKCBwcm9taXNlICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhcnIucHVzaCggcHJvbWlzZSApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uRmFpbCAoIG5vZGUgKSB7XG5cbiAgICAgICAgaWYgKCBub2RlLnJlYWR5ICkge1xuXG4gICAgICAgICAgICBub2RlLnN0YXRlLnNldCggTm9kZVN0YXRlLkVSUk9SICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBOb2RlLnByb3RvdHlwZSwge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uc2cuTm9kZX0gUGljaW1vLnNnLk5vZGUjaXNSb290IC0gKlRydWUqIGlmIHRoaXMgbm9kZSBoYXMgbm8gcGFyZW50LlxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgICdpc1Jvb3QnOiB7XG4gICAgICAgIFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiAhIHRoaXMucGFyZW50OyB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge2Jvb2xlYW59IFBpY2ltby5zZy5Ob2RlI3JlYWR5XG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBBIG5vZGUgaXN0ICpub3QqIHJlYWR5IGlmIC4uXG4gICAgICAgICAqIDEuIHRoZSBzdGF0ZSBpcyBzZXQgdG8gKmRlc3Ryb3llZCogb3IgKmVycm9yKlxuICAgICAgICAgKiAzLiB5b3UgZXhwbGljaXRseSBzZXQgaXQgdG8gKmZhbHNlKiAoYnV0IGRlZmF1bHQgaXMgKnRydWUqKVxuICAgICAgICAgKi9cbiAgICAgICAgJ3JlYWR5Jzoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoICggISEgdGhpcy5fcmVhZHkgKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCAhIHRoaXMuc3RhdGUuaXMoIE5vZGVTdGF0ZS5FUlJPUnxOb2RlU3RhdGUuREVTVFJPWUVEICkpICk7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCByZWFkeSApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3JlYWR5ID0gISEgcmVhZHk7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9XG5cbiAgICB9KTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLnNnLk5vZGVTdGF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbaW5pdGlhbFZhbHVlPTBdIC0gVGhlIGluaXRpYWwgc3RhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBOb2RlU3RhdGUgKCBpbml0aWFsVmFsdWUgKSB7XG5cbiAgICAgICAgdGhpcy52YWx1ZSA9IGluaXRpYWxWYWx1ZSB8IDA7XG5cbiAgICAgICAgT2JqZWN0LnNlYWwoIHRoaXMgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLnNnLk5vZGVTdGF0ZSNpc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0ZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBzdGF0ZS5pcyggTm9kZVN0YXRlLkNSRUFURSB8IE5vZGVTdGF0ZS5JTklUIClcbiAgICAgKi9cbiAgICBOb2RlU3RhdGUucHJvdG90eXBlLmlzID0gZnVuY3Rpb24gKCBzdGF0ZSApIHtcblxuICAgICAgICByZXR1cm4gKCB0aGlzLnZhbHVlICYgKCBzdGF0ZSB8IDAgKSApID4gMDsgLy89PT0gc3RhdGU7XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8uc2cuTm9kZVN0YXRlI3NldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGF0ZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogc3RhdGUuc2V0KCBOb2RlU3RhdGUuUkVBRFkgKVxuICAgICAqIEByZXR1cm4gKnNlbGYqXG4gICAgICovXG4gICAgTm9kZVN0YXRlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoIHN0YXRlICkge1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSBzdGF0ZSB8IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgIE5vZGVTdGF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHN0YXRlcyA9IFtdO1xuXG4gICAgICAgIGlmICggdGhpcy5pcyggTm9kZVN0YXRlLkNSRUFURSApICkgc3RhdGVzLnB1c2goICdDUkVBVEUnICk7XG4gICAgICAgIGlmICggdGhpcy5pcyggTm9kZVN0YXRlLklOSVQgKSApIHN0YXRlcy5wdXNoKCAnSU5JVCcgKTtcbiAgICAgICAgaWYgKCB0aGlzLmlzKCBOb2RlU3RhdGUuUkVBRFkgKSApIHN0YXRlcy5wdXNoKCAnUkVBRFknICk7XG4gICAgICAgIGlmICggdGhpcy5pcyggTm9kZVN0YXRlLkVSUk9SICkgKSBzdGF0ZXMucHVzaCggJ0VSUk9SJyApO1xuICAgICAgICBpZiAoIHRoaXMuaXMoIE5vZGVTdGF0ZS5ERVNUUk9ZRUQgKSApIHN0YXRlcy5wdXNoKCAnREVTVFJPWUVEJyApO1xuXG4gICAgICAgIHJldHVybiBcIltcIiArIHN0YXRlcy5qb2luKCBcIixcIiApICsgXCJdXCI7XG5cbiAgICB9O1xuXG5cbiAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydGllc1B1YmxpY1JPKCBOb2RlU3RhdGUsIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlU3RhdGVcbiAgICAgICAgICogQGNvbnN0YW50XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIENSRUFURSA6IDEsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVN0YXRlXG4gICAgICAgICAqIEBjb25zdGFudFxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqL1xuICAgICAgICBJTklUIDogMixcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlU3RhdGVcbiAgICAgICAgICogQGNvbnN0YW50XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIFJFQURZIDogNCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlU3RhdGVcbiAgICAgICAgICogQGNvbnN0YW50XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIEVSUk9SIDogOCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlU3RhdGVcbiAgICAgICAgICogQGNvbnN0YW50XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIERFU1RST1lFRCA6IDE2XG5cbiAgICB9KTtcblxuXG4gICAgT2JqZWN0LmZyZWV6ZSggTm9kZVN0YXRlICk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gTm9kZVN0YXRlO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFBpY2ltby5zcHJpdGVzXG4gICAgICovXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICBTcHJpdGUgICAgICAgICAgIDogcmVxdWlyZSggJy4vc3ByaXRlJyApLFxuICAgICAgICBTcHJpdGVEZXNjcmlwdG9yIDogcmVxdWlyZSggJy4vc3ByaXRlX2Rlc2NyaXB0b3InIClcblxuICAgIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTcHJpdGVEZXNjcmlwdG9yID0gcmVxdWlyZSggJy4vc3ByaXRlX2Rlc2NyaXB0b3InICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLnNwcml0ZXMuU3ByaXRlXG4gICAgICogQGV4dGVuZHMgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0XG4gICAgICogQGNsYXNzZGVzY1xuICAgICAqIFRoZSBkZWZhdWx0IHNwcml0ZSBjbGFzcy5cbiAgICAgKiBAcGFyYW0ge1BpY2ltby5jb3JlLlZlcnRleEFycmF5fSBbdmVydGV4QXJyYXldIC0gVmVydGV4IGFycmF5LlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gU3ByaXRlICgpIHtcblxuICAgICAgICByZXR1cm4gU3ByaXRlRGVzY3JpcHRvci5jcmVhdGUuYXBwbHkoIFNwcml0ZURlc2NyaXB0b3IsIGFyZ3VtZW50cyApO1xuICAgIFxuICAgIH1cblxuICAgIFNwcml0ZS5wcm90b3R5cGUgPSBTcHJpdGVEZXNjcmlwdG9yLnByb3RvO1xuICAgIFNwcml0ZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTcHJpdGU7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGNvcmUgPSByZXF1aXJlKCBcIi4uL2NvcmVcIiApO1xuXG4gICAgdmFyIFNwcml0ZURlc2NyaXB0b3IgPSBuZXcgY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yKFxuXG4gICAgICAgIG51bGwsXG5cbiAgICAgICAgNCxcbiAgICAgICAgMTIsXG5cbiAgICAgICAgW1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgUGljaW1vLnNwcml0ZXMuU3ByaXRlI3NldFBvc2l0aW9uXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geDAgLSB4MFxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHkwIC0geTBcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6MCAtIHowXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geDEgLSB4MVxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHkxIC0geTFcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6MSAtIHoxXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geDIgLSB4MlxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHkyIC0geTJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6MiAtIHoyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geDMgLSB4M1xuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHkzIC0geTNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6MyAtIHozXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3gwICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjeTAgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN6MCAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3gxICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjeTEgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN6MSAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3gyICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjeTIgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN6MiAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3gzICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjeTMgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN6MyAqL1xuXG4gICAgICAgICAgICB7IG5hbWU6ICdwb3NpdGlvbicsIHNpemU6IDMsIGF0dHJOYW1lczogWyAneCcsICd5JywgJ3onIF0gfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSNyb3RhdGUgLSByb3RhdGlvbiAocmFkaWFuKVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHsgbmFtZTogJ3JvdGF0ZScsIHNpemU6IDEsIHVuaWZvcm06IHRydWUgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzZXRUZXhDb29yZHNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzMCAtIHMwXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdDAgLSB0MFxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHMxIC0gczFcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0MSAtIHQxXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gczIgLSBzMlxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHQyIC0gdDJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzMyAtIHMzXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdDMgLSB0M1xuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzMCAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3QwICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjczEgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN0MSAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3MyICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjdDIgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzMyAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3QzICovXG5cbiAgICAgICAgICAgIHsgbmFtZTogJ3RleENvb3JkcycsIHNpemU6IDIsIGF0dHJOYW1lczogWyAncycsICd0JyBdIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjc2V0VHJhbnNsYXRlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdHggLSB0eFxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHR5IC0gdHlcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjdHggLSB0cmFuc2xhdGUgeCAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3R5IC0gdHJhbnNsYXRlIHkgKi9cblxuICAgICAgICAgICAgeyBuYW1lOiAndHJhbnNsYXRlJywgc2l6ZTogMiwgdW5pZm9ybTogdHJ1ZSwgYXR0ck5hbWVzOiBbICd0eCcsICd0eScgXSB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3NjYWxlIC0gc2NhbGVcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICB7IG5hbWU6ICdzY2FsZScsIHNpemU6IDEsIHVuaWZvcm06IHRydWUgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSNvcGFjaXR5IC0gb3BhY2l0eVxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHsgbmFtZTogJ29wYWNpdHknLCBzaXplOiAxLCB1bmlmb3JtOiB0cnVlIH1cblxuICAgICAgICBdLFxuXG4gICAgICAgIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzZXRQb3MyZFxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHgwIC0geDBcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MCAtIHkwXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geDEgLSB4MVxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHkxIC0geTFcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIHgyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geTIgLSB5MlxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHgzIC0geDNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MyAtIHkzXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgcG9zMmQ6IHsgc2l6ZTogMiwgb2Zmc2V0OiAwIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjcG9zWlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHBvc1o6ICB7IHNpemU6IDEsIG9mZnNldDogMiwgdW5pZm9ybTogdHJ1ZSB9LFxuXG4gICAgICAgICAgICB1djogICAgJ3RleENvb3JkcydcblxuICAgICAgICB9XG5cbiAgICApO1xuXG4gICAgcmVxdWlyZSggJy4vc3ByaXRlX2hlbHBlcnMnICkoIFNwcml0ZURlc2NyaXB0b3IucHJvdG8gKTtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gU3ByaXRlRGVzY3JpcHRvcjtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIFNwcml0ZV9wcm90b3R5cGUgKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgUGljaW1vLnNwcml0ZXMuU3ByaXRlI3NldFRleENvb3Jkc0J5Vmlld3BvcnRcbiAgICAgICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WaWV3cG9ydH0gdmlld3BvcnQgLSB2aWV3cG9ydFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdGV4dHVyZVdpZHRoIC0gdGV4dHVyZSB3aWR0aFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdGV4dHVyZUhlaWdodCAtIHRleHR1cmUgaGVpZ2h0XG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbcmVwZWF0XSAtIHRleHR1cmUgcmVwZWF0IGZhY3RvclxuICAgICAgICAgKi9cblxuICAgICAgICBTcHJpdGVfcHJvdG90eXBlLnNldFRleENvb3Jkc0J5Vmlld3BvcnQgPSBmdW5jdGlvbiAoIHZpZXdwb3J0LCB0ZXh0dXJlV2lkdGgsIHRleHR1cmVIZWlnaHQsIHJlcGVhdCApIHtcblxuICAgICAgICAgICAgdmFyIHgwID0gdmlld3BvcnQueCA9PT0gMCA/IDAgOiAoIHZpZXdwb3J0LnggLyB0ZXh0dXJlV2lkdGggKTtcbiAgICAgICAgICAgIHZhciB4MSA9ICggdmlld3BvcnQueCArIHZpZXdwb3J0LndpZHRoICkgLyB0ZXh0dXJlV2lkdGg7XG4gICAgICAgICAgICB2YXIgeTAgPSAxIC0gKCAoIHZpZXdwb3J0LnkgKyB2aWV3cG9ydC5oZWlnaHQgKSAvIHRleHR1cmVIZWlnaHQgKTtcbiAgICAgICAgICAgIHZhciB5MSA9IHZpZXdwb3J0LnkgPT09IDAgPyAxIDogMSAtICggdmlld3BvcnQueSAvIHRleHR1cmVIZWlnaHQgKTtcblxuICAgICAgICAgICAgaWYgKCByZXBlYXQgIT09IHVuZGVmaW5lZCApIHtcblxuICAgICAgICAgICAgICAgIHgwICo9IHJlcGVhdDtcbiAgICAgICAgICAgICAgICB4MSAqPSByZXBlYXQ7XG4gICAgICAgICAgICAgICAgeTAgKj0gcmVwZWF0O1xuICAgICAgICAgICAgICAgIHkxICo9IHJlcGVhdDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldFRleENvb3JkcyhcbiAgICAgICAgICAgICAgICB4MCwgeTAsXG4gICAgICAgICAgICAgICAgeDEsIHkwLFxuICAgICAgICAgICAgICAgIHgxLCB5MSxcbiAgICAgICAgICAgICAgICB4MCwgeTEgKTtcblxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZXRob2QgUGljaW1vLnNwcml0ZXMuU3ByaXRlI3NldFBvc2l0aW9uQnlTaXplXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIHdpZHRoXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBoZWlnaHRcbiAgICAgICAgICovXG5cbiAgICAgICAgU3ByaXRlX3Byb3RvdHlwZS5zZXRQb3NpdGlvbkJ5U2l6ZSA9IGZ1bmN0aW9uICggd2lkdGgsIGhlaWdodCApIHtcblxuICAgICAgICAgICAgdmFyIGhhbGZfd2lkdGggID0gd2lkdGggICogMC41O1xuICAgICAgICAgICAgdmFyIGhhbGZfaGVpZ2h0ID0gaGVpZ2h0ICogMC41O1xuXG4gICAgICAgICAgICB0aGlzLnNldFBvczJkKFxuICAgICAgICAgICAgICAgICAgICAtaGFsZl93aWR0aCwgLWhhbGZfaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgaGFsZl93aWR0aCwgLWhhbGZfaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgaGFsZl93aWR0aCwgIGhhbGZfaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAtaGFsZl93aWR0aCwgIGhhbGZfaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uU3ByaXRlI3JvdGF0ZURlZ3JlZSAtIHJvdGF0aW9uIGluIGRlZ3JlZVxuICAgICAgICAgKi9cblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIFNwcml0ZV9wcm90b3R5cGUsICdyb3RhdGVEZWdyZWUnLCB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJvdGF0ZSAqIDE4MC4wIC8gTWF0aC5QSTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCBkZWdyZWUgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3RhdGUgPSBkZWdyZWUgKiAoIE1hdGguUEkgLyAxODAuMCApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRHbHhQcm9wZXJ0eShvYmopIHtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgICAgIG9iaiwge1xuICAgICAgICAgICAgICAgIGdseDoge1xuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGdseCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2x4ID0gZ2x4O1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdnbCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogKCB0eXBlb2YgZ2x4ID09PSAnb2JqZWN0JyA/IGdseC5nbCA6IHVuZGVmaW5lZCApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nbHg7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgb2JqZWN0X3V0aWxzID0gcmVxdWlyZSggJy4vb2JqZWN0X3V0aWxzJyApO1xuXG4gICAgdmFyIFVJRCA9IDA7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGFkZFVpZCggb2JqICkge1xuXG4gICAgICAgIG9iamVjdF91dGlscy5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPKCBvYmosICd1aWQnLCAoICsrVUlEICkgKTtcblxuICAgIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQcm9taXNlICAgICAgPSByZXF1aXJlKCAnLi9wcm9taXNlJyApO1xuICAgIHZhciBvYmplY3RfdXRpbHMgPSByZXF1aXJlKCAnLi9vYmplY3RfdXRpbHMnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLnV0aWxzLkRlZmVycmVkXG4gICAgICogQHN1bW1hcnlcbiAgICAgKiBBIHNpbXBsZSBhbmQgZ2VuZXJpYyBkZWZlcnJlZCBpbnRlcmZhY2UuXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBEZWZlcnJlZCAoIG9iaiApIHtcblxuICAgICAgICBvYmplY3RfdXRpbHMuZGVmaW5lUHJvcGVydHlQcml2YXRlUk8oIHRoaXMsICdfb2JqJywgb2JqICk7XG5cbiAgICAgICAgdGhpcy5fcmVhZHkgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSB0aGlzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8udXRpbHMuUHJvbWlzZX0gUGljaW1vLnV0aWxzLkRlZmVycmVkI3Byb21pc2VcbiAgICAgICAgICovXG5cbiAgICAgICAgb2JqZWN0X3V0aWxzLmRlZmluZVByb3BlcnR5UHVibGljUk8oIHRoaXMsICdwcm9taXNlJywgbmV3IFByb21pc2UoIGZ1bmN0aW9uICggcmVzb2x2ZSApIHtcblxuICAgICAgICAgICAgb2JqZWN0X3V0aWxzLmRlZmluZVByb3BlcnR5UHJpdmF0ZSggZGVmZXJyZWQsICdfcmVzb2x2ZScsIHJlc29sdmUgKTtcblxuICAgICAgICB9KSk7XG5cbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggRGVmZXJyZWQucHJvdG90eXBlLCB7XG4gICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtib29sZWFufSBQaWNpbW8udXRpbHMuRGVmZXJyZWQjcmVhZHlcbiAgICAgICAgICovXG5cbiAgICAgICAgJ3JlYWR5Jzoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX3JlYWR5OyB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggcmVhZHkgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICEgdGhpcy5fcmVhZHkgJiYgISEgcmVhZHkgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICggdGhpcy5fcmVzb2x2ZSApIHtcbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUoIHRoaXMuX29iaiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICEhIHRoaXMuX3JlYWR5ICYmICEgcmVhZHkgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB9XG4gICAgXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby51dGlscy5EZWZlcnJlZCN0aGVuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cblxuICAgIERlZmVycmVkLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcblxuICAgICAgICBpZiAoIHRoaXMucmVhZHkgKSB7XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKCB0aGlzLl9vYmogKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnByb21pc2UudGhlbiggZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soIGRlZmVycmVkLl9vYmogKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLnV0aWxzLkRlZmVycmVkI2ZvcndhcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlOYW1lXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cblxuICAgIERlZmVycmVkLnByb3RvdHlwZS5mb3J3YXJkID0gZnVuY3Rpb24gKCBwcm9wZXJ0eU5hbWUsIGNhbGxiYWNrICkge1xuXG4gICAgICAgIHRoaXMudGhlbiggZnVuY3Rpb24gKCBzZWxmICkge1xuXG4gICAgICAgICAgICBjYWxsYmFjayggc2VsZlsgcHJvcGVydHlOYW1lIF0gKTtcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIFBpY2ltby51dGlscy5EZWZlcnJlZFxuICAgICAqIEBmdW5jdGlvbiBtYWtlXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgKiBAcmV0dXJuIG9ialxuICAgICAqL1xuICAgIERlZmVycmVkLm1ha2UgPSBmdW5jdGlvbiAoIG9iaiApIHtcblxuICAgICAgICBvYmplY3RfdXRpbHMuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyggb2JqLCAnZGVmZXJyZWQnLCBuZXcgRGVmZXJyZWQoIG9iaiApICk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBQaWNpbW8udXRpbHMuRGVmZXJyZWRcbiAgICAgKiBAZnVuY3Rpb24gdGhlblxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBEZWZlcnJlZC50aGVuID0gZnVuY3Rpb24gKCBvYmosIGNhbGxiYWNrICkge1xuXG4gICAgICAgIGlmICggb2JqLmRlZmVycmVkICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgIG9iai5kZWZlcnJlZC50aGVuKCBjYWxsYmFjayApO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKCBvYmogKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IERlZmVycmVkO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFBpY2ltby51dGlsc1xuICAgICAqIEBzdW1tYXJ5XG4gICAgICogSGVscGVyIGZ1bmN0aW9ucywgdXRpbGl0aWVzIGFuZCAzcmQtcGFydHkgbGlicmFyaWVzLlxuICAgICAqL1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lc3BhY2UgUGljaW1vLnV0aWxzLm9iamVjdFxuICAgICAgICAgKiBAc3VtbWFyeVxuICAgICAgICAgKiBDb21tb24gb2JqZWN0IHByb3BlcnRpZXMgaGVscGVyIGZ1bmN0aW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIG9iamVjdCA6IHJlcXVpcmUoICcuL29iamVjdF91dGlscycgKSxcblxuICAgICAgICBEZWZlcnJlZCA6IHJlcXVpcmUoICcuL2RlZmVycmVkJyApLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY2xhc3MgUGljaW1vLnV0aWxzLk1hcFxuICAgICAgICAgKlxuICAgICAgICAgKiBAc3VtbWFyeVxuICAgICAgICAgKiAgIEVTNiBNYXBcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqICAgQW4gRVM2IE1hcCBJbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICogICBUaGlzIGlzIHRoZSAqbmF0aXZlKiBJbXBsZW1lbnRhdGlvbiBvZiB5b3VyIGphdmFzY3JpcHQgZW52aXJvbm1lbnQgb3IgdGhlIHBvbHlmaWxsL3NoaW0gb2YgdGhlICpjb3JlLWpzKiBsaWJyYXJ5LlxuICAgICAgICAgKi9cbiAgICAgICAgTWFwIDogcmVxdWlyZSggJy4vbWFwJyApLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAY2xhc3MgUGljaW1vLnV0aWxzLlByb21pc2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHN1bW1hcnlcbiAgICAgICAgICogICBFUzYgUHJvbWlzZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogICBBbiBFUzYgUHJvbWlzZSBJbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICogICBUaGlzIGlzIHRoZSAqbmF0aXZlKiBJbXBsZW1lbnRhdGlvbiBvZiB5b3VyIGphdmFzY3JpcHQgZW52aXJvbm1lbnQgb3IgdGhlIHBvbHlmaWxsL3NoaW0gb2YgdGhlICpjb3JlLWpzKiBsaWJyYXJ5LlxuICAgICAgICAgKi9cbiAgICAgICAgUHJvbWlzZSA6IHJlcXVpcmUoICcuL3Byb21pc2UnICksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lc3BhY2UgUGljaW1vLnV0aWxzLmdsTWF0cml4XG4gICAgICAgICAqXG4gICAgICAgICAqIEBzdW1tYXJ5XG4gICAgICAgICAqICAgVGhlIGZhbnRhc3RpYyA8Yj5nbC1tYXRyaXg8L2I+IGxpYnJhcnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzZWVcbiAgICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL3RvamkvZ2wtbWF0cml4XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBnbE1hdHJpeCA6IHJlcXVpcmUoICdnbC1tYXRyaXgnICksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjbGFzcyBQaWNpbW8udXRpbHMuQ29sb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHN1bW1hcnlcbiAgICAgICAgICogICBUaGUgZmFudGFzdGljIGNvbG9yIG1hbmFnZW1lbnQgQVBJIDxiPm5ldC5icmVoYXV0LkNvbG9yPC9iPlxuICAgICAgICAgKlxuICAgICAgICAgKiBAc2VlXG4gICAgICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9icmVoYXV0L2NvbG9yLWpzXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBDb2xvciA6IHJlcXVpcmUoICdjb2xvci1qcycgKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGFkZEdseFByb3BlcnR5IDogcmVxdWlyZSggJy4vYWRkX2dseF9wcm9wZXJ0eScgKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGFkZFVpZCA6IHJlcXVpcmUoICcuL2FkZF91aWQnIClcblxuICAgIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIE1hcCA9PT0gJ3VuZGVmaW5lZCcgPyByZXF1aXJlKCAnY29yZS1qcy9saWJyYXJ5JyApLk1hcCA6IE1hcDtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIFBpY2ltby51dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydHlQdWJsaWNST1xuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqICAgRGVmaW5lIGEgKnJlYWQtb25seSogcHJvcGVydHkgd2hpY2ggaXMgKmVudW1lcmFibGUqIGJ1dCBub3QgKndyaXRhYmxlKiBhbmQgKmNvbmZpZ3VyYWJsZSouXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvZGVmaW5lUHJvcGVydHlcbiAgICAgKiBAcmV0dXJuIG9ialxuICAgICAqL1xuICAgIG1vZHVsZS5leHBvcnRzLmRlZmluZVByb3BlcnR5UHVibGljUk8gPSBmdW5jdGlvbiAoIG9iaiwgbmFtZSwgdmFsdWUgKSB7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIG5hbWUsIHtcbiAgICAgICAgICAgIHZhbHVlICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIFBpY2ltby51dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydHlQcml2YXRlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogICBEZWZpbmUgYSBwcm9wZXJ0eSB3aGljaCBpcyBOT1QgKmVudW1lcmFibGUqIGFuZCAqY29uZmlndXJhYmxlKiBCVVQgKndyaXRhYmxlKi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9kZWZpbmVQcm9wZXJ0eVxuICAgICAqIEByZXR1cm4gb2JqXG4gICAgICovXG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmaW5lUHJvcGVydHlQcml2YXRlID0gZnVuY3Rpb24gKCBvYmosIG5hbWUsIHZhbHVlICkge1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZSAgICA6IHZhbHVlLFxuICAgICAgICAgICAgd3JpdGFibGUgOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gUGljaW1vLnV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVByaXZhdGVST1xuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqICAgRGVmaW5lIGEgKipyZWFkLW9ubHkqKiBwcm9wZXJ0eSB3aGljaCBpcyBOT1QgKmVudW1lcmFibGUqLCAqY29uZmlndXJhYmxlKiBhbmQgKndyaXRhYmxlKi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9kZWZpbmVQcm9wZXJ0eVxuICAgICAqIEByZXR1cm4gb2JqXG4gICAgICovXG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmaW5lUHJvcGVydHlQcml2YXRlUk8gPSBmdW5jdGlvbiAoIG9iaiwgbmFtZSwgdmFsdWUgKSB7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIG5hbWUsIHtcbiAgICAgICAgICAgIHZhbHVlIDogdmFsdWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBQaWNpbW8udXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnRpZXNQdWJsaWNST1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogRGVmaW5lICpyZWFkLW9ubHkqIHByb3BlcnRpZXMgd2hpY2ggYXJlICplbnVtZXJhYmxlKiBidXQgbm90ICp3cml0YWJsZSogYW5kICpjb25maWd1cmFibGUqLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBUaGUgbmFtZS92YWx1ZSBtYXBcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2RlZmluZVByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogUGljaW1vLnV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHVibGljUk8oIG9iaiwge1xuICAgICAqICAgICBGT086ICdmb28nLFxuICAgICAqICAgICBCQVI6ICdwbGFoISdcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIEByZXR1cm4gb2JqXG4gICAgICovXG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmaW5lUHJvcGVydGllc1B1YmxpY1JPID0gZnVuY3Rpb24gKCBvYmosIG1hcCApIHtcblxuICAgICAgICBmb3IgKCB2YXIga2V5IGluIG1hcCApIHtcblxuICAgICAgICAgICAgaWYgKCBPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCggbWFwLCBrZXkgKSApIHtcblxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgICAgIDogbWFwWyBrZXkgXSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmo7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gUGljaW1vLnV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHJpdmF0ZVJPXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBEZWZpbmUgKnJlYWQtb25seSogcHJvcGVydGllcyB3aGljaCBhcmUgTk9UICplbnVtZXJhYmxlKiwgKndyaXRhYmxlKiBvciAqY29uZmlndXJhYmxlKi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gVGhlIG5hbWUvdmFsdWUgbWFwXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9kZWZpbmVQcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFBpY2ltby51dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydGllc1ByaXZhdGVSTyggb2JqLCB7XG4gICAgICogICAgIF9GT086ICdmb28nLFxuICAgICAqICAgICBfYmFyOiAncGxhaCEnXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIG9ialxuICAgICAqL1xuICAgIG1vZHVsZS5leHBvcnRzLmRlZmluZVByb3BlcnRpZXNQcml2YXRlUk8gPSBmdW5jdGlvbiAoIG9iaiwgbWFwICkge1xuXG4gICAgICAgIGZvciAoIHZhciBrZXkgaW4gbWFwICkge1xuXG4gICAgICAgICAgICBpZiAoIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBtYXAsIGtleSApICkge1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwgeyB2YWx1ZTogbWFwWyBrZXkgXSB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqO1xuXG4gICAgfTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgUHJvbWlzZSA9PT0gJ3VuZGVmaW5lZCcgPyByZXF1aXJlKCAnY29yZS1qcy9saWJyYXJ5JyApLlByb21pc2UgOiBQcm9taXNlO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cblxuICAgIGZ1bmN0aW9uIEF0dHJpYiAoIHByb2dyYW0sIGluZm8gKSB7XG4gICAgICAgIFxuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydGllc1B1YmxpY1JPKCB0aGlzLCB7XG4gICAgICAgIFxuICAgICAgICAgICAgcHJvZ3JhbSAgOiBwcm9ncmFtLFxuICAgICAgICAgICAgaW5mbyAgICAgOiBpbmZvLFxuICAgICAgICAgICAgbG9jYXRpb24gOiBwcm9ncmFtLmdseC5nbC5nZXRBdHRyaWJMb2NhdGlvbiggcHJvZ3JhbS5nbFByb2dyYW0sIGluZm8ubmFtZSApXG4gICAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICAvL09iamVjdC5zZWFsKCB0aGlzICk7XG5cbiAgICB9XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gQXR0cmliO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLndlYmdsLmNtZC5CbGVuZE1vZGVcbiAgICAgKiBAY2xhc3NkZXNjXG4gICAgICogICBXZWJHTCBibGVuZCBhbmQgZGVwdGggbW9kZSBzdGF0ZSBkZXNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGVwdGhUZXN0IC0gRW5hYmxlIG9yIGRpc2FibGUgZGVwdGggdGVzdC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtkZXB0aE1hc2tdIC0gRW5hYmxlIG9yIGRpc2FibGUgZGVwdGggYnVmZmVyIHdyaXRlcy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2RlcHRoRnVuY10gLSBTZXQgdGhlIGRlcHRoIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYmxlbmQgLSBFbmFibGUgb3IgZGlzYWJsZSBibGVuZGluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2JsZW5kRnVuY1NyY10gLSBTZXQgdGhlIHNvdXJjZSBibGVuZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2JsZW5kRnVuY0RzdF0gLSBTZXQgdGhlIGRlc3RpbmF0aW9uIGJsZW5kIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBkZWZhdWx0IHNldHRpbmdzXG4gICAgICogbmV3IFBpY2ltby53ZWJnbC5jbWQuQmxlbmRNb2RlKCB0cnVlLCB0cnVlLCAnTEVRVUFMJywgdHJ1ZSwgJ1NSQ19BTFBIQScsICdPTkVfTUlOVVNfU1JDX0FMUEhBJyApXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIGRpc2FibGUgYm90aFxuICAgICAqIG5ldyBQaWNpbW8ud2ViZ2wuY21kLkJsZW5kTW9kZSggZmFsc2UsIGZhbHNlIClcbiAgICAgKlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gQmxlbmRNb2RlICggZGVwdGhUZXN0LCBkZXB0aE1hc2ssIGRlcHRoRnVuYywgYmxlbmQsIGJsZW5kRnVuY1NyYywgYmxlbmRGdW5jRHN0ICkge1xuXG4gICAgICAgIHRoaXMuZGVwdGhUZXN0ID0gISEgZGVwdGhUZXN0O1xuXG4gICAgICAgIGlmICggdGhpcy5kZXB0aFRlc3QgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5kZXB0aE1hc2sgPSBkZXB0aE1hc2s7XG4gICAgICAgICAgICB0aGlzLmRlcHRoRnVuYyA9IGRlcHRoRnVuYztcbiAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIFxuICAgICAgICAgICAgYmxlbmQgICAgICAgID0gZGVwdGhNYXNrO1xuICAgICAgICAgICAgYmxlbmRGdW5jU3JjID0gZGVwdGhGdW5jO1xuICAgICAgICAgICAgYmxlbmRGdW5jRHN0ID0gYmxlbmQ7XG4gICAgICAgIFxuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMuYmxlbmQgPSAhISBibGVuZDtcblxuICAgICAgICBpZiAoIHRoaXMuYmxlbmQgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5ibGVuZEZ1bmNTcmMgPSBibGVuZEZ1bmNTcmM7XG4gICAgICAgICAgICB0aGlzLmJsZW5kRnVuY0RzdCA9IGJsZW5kRnVuY0RzdDtcbiAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZnJlZXplKCB0aGlzICk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtib29sZWFufSBQaWNpbW8ud2ViZ2wuY21kLkJsZW5kTW9kZSNkZXB0aFRlc3RcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge2Jvb2xlYW59IFBpY2ltby53ZWJnbC5jbWQuQmxlbmRNb2RlI2RlcHRoTWFza1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBQaWNpbW8ud2ViZ2wuY21kLkJsZW5kTW9kZSNkZXB0aEZ1bmNcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge2Jvb2xlYW59IFBpY2ltby53ZWJnbC5jbWQuQmxlbmRNb2RlI2JsZW5kXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IFBpY2ltby53ZWJnbC5jbWQuQmxlbmRNb2RlI2JsZW5kRnVuY1NyY1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBQaWNpbW8ud2ViZ2wuY21kLkJsZW5kTW9kZSNibGVuZEZ1bmNEc3RcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLmNtZC5CbGVuZE1vZGUjYWN0aXZhdGVcbiAgICAgKiBAcGFyYW0ge1dlYkdsUmVuZGVyaW5nQ29udGV4dH0gZ2wgLSBnbFxuICAgICAqL1xuXG4gICAgQmxlbmRNb2RlLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uICggZ2wgKSB7XG4gICAgXG4gICAgICAgIGlmICggdGhpcy5kZXB0aFRlc3QgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgZ2wuZW5hYmxlKCBnbC5ERVBUSF9URVNUICk7XG4gICAgICAgICAgICBnbC5kZXB0aE1hc2soIHRoaXMuZGVwdGhNYXNrICk7XG4gICAgICAgICAgICBnbC5kZXB0aEZ1bmMoIGdsWyB0aGlzLmRlcHRoRnVuYyBdICk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgXG4gICAgICAgICAgICBnbC5kaXNhYmxlKCBnbC5ERVBUSF9URVNUICk7XG5cbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpZiAoIHRoaXMuYmxlbmQgKSB7XG4gICAgICAgIFxuICAgICAgICAgICAgZ2wuZW5hYmxlKCBnbC5CTEVORCApO1xuICAgICAgICAgICAgZ2wuYmxlbmRGdW5jKCBnbFsgdGhpcy5ibGVuZEZ1bmNTcmMgXSwgZ2xbIHRoaXMuYmxlbmRGdW5jRHN0IF0gKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgICAgIGdsLmRpc2FibGUoIGdsLkJMRU5EICk7XG5cbiAgICAgICAgfVxuICAgIFxuICAgIH07XG5cblxuLypcbiAgICAgICAgLy8gZ29vZCBkZWZhdWx0IHNldHRpbmdzXG4gICAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcbiAgICAgICAgZ2wuZGVwdGhNYXNrKHRydWUpOyAgICAgICAvLyBlbmFibGUgd3JpdGluZyBpbnRvIHRoZSBkZXB0aCBidWZmZXJcbiAgICAgICAgLy9nbC5kZXB0aEZ1bmMoZ2wuQUxXQVlTKTsgIC8vIHNwcml0ZXMgYmxlbmRpbmdcbiAgICAgICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7ICAvLyBpc28zZFxuXG4gICAgICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpOyAgLy8gZ29vZCBkZWZhdWx0XG4qL1xuXG5cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBQaWNpbW8ud2ViZ2wuY21kLkJsZW5kTW9kZVxuICAgICAqIEBjb25zdGFudCBERUZBVUxUXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuXG4gICAgQmxlbmRNb2RlLkRFRkFVTFQgPSBuZXcgQmxlbmRNb2RlKCB0cnVlLCB0cnVlLCAnQUxXQVlTJywgdHJ1ZSwgJ1NSQ19BTFBIQScsICdPTkVfTUlOVVNfU1JDX0FMUEhBJyApO1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlcm9mIFBpY2ltby53ZWJnbC5jbWQuQmxlbmRNb2RlXG4gICAgICogQGNvbnN0YW50IElTTzNEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuXG4gICAgQmxlbmRNb2RlLklTTzNEID0gbmV3IEJsZW5kTW9kZSggdHJ1ZSwgdHJ1ZSwgJ0xFUVVBTCcsIHRydWUsICdTUkNfQUxQSEEnLCAnT05FX01JTlVTX1NSQ19BTFBIQScgKTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBCbGVuZE1vZGU7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgUGljaW1vLndlYmdsLmNtZFxuICAgICAqL1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgQmxlbmRNb2RlIDogcmVxdWlyZSggJy4vYmxlbmRfbW9kZScgKSxcblxuICAgIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgUGljaW1vLndlYmdsXG4gICAgICovXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICBjbWQgOiByZXF1aXJlKCAnLi9jbWQnICksXG5cbiAgICAgICAgU2hhZGVyU291cmNlICA6IHJlcXVpcmUoICcuL3NoYWRlcl9zb3VyY2UnICksXG4gICAgICAgIFNoYWRlck1hbmFnZXIgOiByZXF1aXJlKCAnLi9zaGFkZXJfbWFuYWdlcicgKSxcbiAgICAgICAgUHJvZ3JhbSAgICAgICA6IHJlcXVpcmUoICcuL3Byb2dyYW0nICksXG4gICAgICAgIFdlYkdsQ29udGV4dCAgOiByZXF1aXJlKCAnLi93ZWJfZ2xfY29udGV4dCcgKSxcbiAgICAgICAgV2ViR2xSZW5kZXJlciA6IHJlcXVpcmUoICcuL3dlYl9nbF9yZW5kZXJlcicgKSxcbiAgICAgICAgV2ViR2xQcm9ncmFtICA6IHJlcXVpcmUoICcuL3dlYl9nbF9wcm9ncmFtJyApXG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgICAgICAgID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuICAgIHZhciBXZWJHbFByb2dyYW0gPSByZXF1aXJlKCAnLi93ZWJfZ2xfcHJvZ3JhbScgKTtcblxuICAgIGZ1bmN0aW9uIFByb2dyYW0gKCBuYW1lLCB2ZXJ0ZXhTaGFkZXJOYW1lLCBmcmFnbWVudFNoYWRlck5hbWUgKSB7XG4gICAgICAgIFxuICAgICAgICB1dGlscy5hZGRVaWQoIHRoaXMgKTtcblxuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydGllc1B1YmxpY1JPKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIG5hbWUgICAgICAgICAgICAgICA6IG5hbWUsXG4gICAgICAgICAgICB2ZXJ0ZXhTaGFkZXJOYW1lICAgOiAoIHZlcnRleFNoYWRlck5hbWUgPyB2ZXJ0ZXhTaGFkZXJOYW1lIDogbmFtZSApLFxuICAgICAgICAgICAgZnJhZ21lbnRTaGFkZXJOYW1lIDogKCBmcmFnbWVudFNoYWRlck5hbWUgPyBmcmFnbWVudFNoYWRlck5hbWUgOiBuYW1lICksXG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBQcm9ncmFtLnByb3RvdHlwZS5saW5rUHJvZ3JhbSA9IGZ1bmN0aW9uICggYXBwICkge1xuXG4gICAgICAgIHZhciBnbHggPSBhcHAuZ2x4O1xuICAgICAgICB2YXIgZ2wgPSBnbHguZ2w7XG5cbiAgICAgICAgdmFyIHZlcnRleFNoYWRlciA9IGdseC5nbFNoYWRlciggYXBwLnNoYWRlci5nZXRWZXJ0ZXhTaGFkZXIoIHRoaXMudmVydGV4U2hhZGVyTmFtZSApICk7XG4gICAgICAgIGlmICggISB2ZXJ0ZXhTaGFkZXIgKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGZyYWdtZW50U2hhZGVyID0gZ2x4LmdsU2hhZGVyKCBhcHAuc2hhZGVyLmdldEZyYWdtZW50U2hhZGVyKCB0aGlzLmZyYWdtZW50U2hhZGVyTmFtZSApICk7XG4gICAgICAgIGlmICggISBmcmFnbWVudFNoYWRlciApIHJldHVybjtcblxuICAgICAgICB2YXIgZ2xfcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoIGdsX3Byb2dyYW0sIHZlcnRleFNoYWRlciApO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoIGdsX3Byb2dyYW0sIGZyYWdtZW50U2hhZGVyICk7XG5cbiAgICAgICAgZ2wubGlua1Byb2dyYW0oIGdsX3Byb2dyYW0gKTtcblxuICAgICAgICBpZiAoICEgZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlciggZ2xfcHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMgKSApIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIkNvdWxkIG5vdCBsaW5rIHdlYmdsIHByb2dyYW06IFwiICsgdGhpcy5uYW1lICk7XG4gICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXZWJHbFByb2dyYW0oIHRoaXMsIGdsX3Byb2dyYW0sIGdseCApO1xuXG4gICAgfTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBQcm9ncmFtO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgICAgICAgID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuICAgIHZhciBTaGFkZXJTb3VyY2UgPSByZXF1aXJlKCAnLi9zaGFkZXJfc291cmNlJyApO1xuICAgIHZhciBQcm9ncmFtICAgICAgPSByZXF1aXJlKCAnLi9wcm9ncmFtJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBTaGFkZXJNYW5hZ2VyICggYXBwICkge1xuICAgICAgICBcbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnR5UHVibGljUk8oIHRoaXMsICdhcHAnLCBhcHAgKTtcblxuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydGllc1ByaXZhdGVSTyggdGhpcywge1xuXG4gICAgICAgICAgICBfdmVydGV4U2hhZGVyICAgOiBuZXcgdXRpbHMuTWFwKCksXG4gICAgICAgICAgICBfZnJhZ21lbnRTaGFkZXIgOiBuZXcgdXRpbHMuTWFwKCksXG4gICAgICAgICAgICBfcHJvZ3JhbXMgICAgICAgOiBuZXcgdXRpbHMuTWFwKCksXG4gICAgICAgIFxuICAgICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuU2hhZGVyTWFuYWdlciNhZGRQcm9ncmFtXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZlcnRleFNoYWRlck5hbWU9bmFtZV1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2ZyYWdtZW50U2hhZGVyTmFtZT1uYW1lXVxuICAgICAqIEByZXR1cm4ge1BpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyfSBzZWxmXG4gICAgICovXG5cbiAgICBTaGFkZXJNYW5hZ2VyLnByb3RvdHlwZS5hZGRQcm9ncmFtID0gZnVuY3Rpb24gKCBuYW1lLCB2ZXJ0ZXhTaGFkZXJOYW1lLCBmcmFnbWVudFNoYWRlck5hbWUgKSB7XG5cbiAgICAgICAgdGhpcy5fcHJvZ3JhbXMuc2V0KCBuYW1lLCBuZXcgUHJvZ3JhbSggbmFtZSwgdmVydGV4U2hhZGVyTmFtZSwgZnJhZ21lbnRTaGFkZXJOYW1lICkgKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICBcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2dldFByb2dyYW1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm4ge1BpY2ltby53ZWJnbC5Qcm9ncmFtfSBwcm9ncmFtXG4gICAgICovXG5cbiAgICBTaGFkZXJNYW5hZ2VyLnByb3RvdHlwZS5nZXRQcm9ncmFtID0gZnVuY3Rpb24gKCBuYW1lICkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmFtcy5nZXQoIG5hbWUgKTtcbiAgICBcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2FkZFNoYWRlclxuICAgICAqIEBwYXJhbSB7UGljaW1vLndlYmdsLlNoYWRlclNvdXJjZX0gc2hhZGVyXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmFkZFNoYWRlciA9IGZ1bmN0aW9uICggc2hhZGVyICkge1xuXG4gICAgICAgIGlmICggc2hhZGVyLnNoYWRlclR5cGUgPT09IFNoYWRlclNvdXJjZS5WRVJURVhfU0hBREVSICkge1xuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRleFNoYWRlci5zZXQoIHNoYWRlci5uYW1lLCBzaGFkZXIgKTtcbiAgICAgICAgXG4gICAgICAgIH0gZWxzZSBpZiAoIHNoYWRlci5zaGFkZXJUeXBlID09PSBTaGFkZXJTb3VyY2UuRlJBR01FTlRfU0hBREVSICkge1xuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2ZyYWdtZW50U2hhZGVyLnNldCggc2hhZGVyLm5hbWUsIHNoYWRlciApO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICBcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2FkZFZlcnRleFNoYWRlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNoYWRlciAtIFRoZSByYXcgc2hhZGVyIHNvdXJjZSBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQaWNpbW8ud2ViZ2wuU2hhZGVyTWFuYWdlcn0gc2VsZlxuICAgICAqL1xuXG4gICAgU2hhZGVyTWFuYWdlci5wcm90b3R5cGUuYWRkVmVydGV4U2hhZGVyID0gZnVuY3Rpb24gKCBuYW1lLCBzb3VyY2UgKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2hhZGVyKCBuZXcgU2hhZGVyU291cmNlKCBTaGFkZXJTb3VyY2UuVkVSVEVYX1NIQURFUiwgbmFtZSwgc291cmNlICkgKTtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXIjYWRkRnJhZ21lbnRTaGFkZXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaGFkZXIgLSBUaGUgcmF3IHNoYWRlciBzb3VyY2Ugc3RyaW5nXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmFkZEZyYWdtZW50U2hhZGVyID0gZnVuY3Rpb24gKCBuYW1lLCBzb3VyY2UgKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2hhZGVyKCBuZXcgU2hhZGVyU291cmNlKCBTaGFkZXJTb3VyY2UuRlJBR01FTlRfU0hBREVSLCBuYW1lLCBzb3VyY2UgKSApO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuU2hhZGVyTWFuYWdlciNsb2FkVmVydGV4U2hhZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmxvYWRWZXJ0ZXhTaGFkZXIgPSBmdW5jdGlvbiAoIG5hbWUsIHVybCApIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTaGFkZXIoIG5ldyBTaGFkZXJTb3VyY2UoIFNoYWRlclNvdXJjZS5WRVJURVhfU0hBREVSLCBuYW1lICkubG9hZCggdXJsICkgKTtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXIjbG9hZEZyYWdtZW50U2hhZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmxvYWRGcmFnbWVudFNoYWRlciA9IGZ1bmN0aW9uICggbmFtZSwgdXJsICkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNoYWRlciggbmV3IFNoYWRlclNvdXJjZSggU2hhZGVyU291cmNlLkZSQUdNRU5UX1NIQURFUiwgbmFtZSApLmxvYWQoIHVybCApICk7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2dldFZlcnRleFNoYWRlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlclNvdXJjZX0gc2hhZGVyXG4gICAgICovXG5cbiAgICBTaGFkZXJNYW5hZ2VyLnByb3RvdHlwZS5nZXRWZXJ0ZXhTaGFkZXIgPSBmdW5jdGlvbiAoIG5hbWUgKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRleFNoYWRlci5nZXQoIG5hbWUgKTtcbiAgICBcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2dldEZyYWdtZW50U2hhZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcmV0dXJuIHtQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlfSBzaGFkZXJcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmdldEZyYWdtZW50U2hhZGVyID0gZnVuY3Rpb24gKCBuYW1lICkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9mcmFnbWVudFNoYWRlci5nZXQoIG5hbWUgKTtcbiAgICBcbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNoYWRlck1hbmFnZXI7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoICcuLi91dGlscycgKTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNoYWRlclR5cGUgLSAnVkVSVEVYX1NIQURFUicgb3IgJ0ZSQUdNRU5UX1NIQURFUidcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzb3VyY2VdXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBTaGFkZXJTb3VyY2UgKCBzaGFkZXJUeXBlLCBuYW1lLCBzb3VyY2UgKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZSN1aWRcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICB1dGlscy5hZGRVaWQoIHRoaXMgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLnV0aWxzLkRlZmVycmVkfSBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI2RlZmVycmVkXG4gICAgICAgICAqL1xuICAgICAgICB1dGlscy5EZWZlcnJlZC5tYWtlKCB0aGlzICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZSNzaGFkZXJUeXBlIC0gJ1ZFUlRFWF9TSEFERVInIG9yICdGUkFHTUVOVF9TSEFERVInXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNoYWRlclR5cGUgPSBzaGFkZXJUeXBlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IFBpY2ltby53ZWJnbC5TaGFkZXJTb3VyY2UjbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI3NvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI3VybFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51cmwgPSBudWxsO1xuXG4gICAgfVxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggU2hhZGVyU291cmNlLnByb3RvdHlwZSwge1xuXG4gICAgICAgICdzb3VyY2UnOiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc291cmNlOyB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggc291cmNlICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmZXJyZWQucmVhZHkgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyAmJiBzb3VyY2UudHJpbSgpLmxlbmd0aCAhPT0gMDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJTb3VyY2UjZ2V0U291cmNlXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZVxuICAgICAqL1xuXG4gICAgU2hhZGVyU291cmNlLnByb3RvdHlwZS5nZXRTb3VyY2UgPSBmdW5jdGlvbiAoIHJlc29sdmUgKSB7XG5cbiAgICAgICAgdGhpcy5kZWZlcnJlZC5mb3J3YXJkKCAnc291cmNlJywgcmVzb2x2ZSApO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI2xvYWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlclNvdXJjZX0gLSBzZWxmXG4gICAgICovXG5cbiAgICBTaGFkZXJTb3VyY2UucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoIHVybCApIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG5cbiAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgIHJlcS5vcGVuKCBcIkdFVFwiLCB1cmwsIHRydWUgKTtcblxuICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAoIHJlcS5yZWFkeVN0YXRlICE9PSA0IC8qIERPTkUgKi8gKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICggcmVxLnN0YXR1cyA+PSAyMDAgJiYgcmVxLnN0YXR1cyA8IDMwMCApIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuc291cmNlID0gcmVxLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxLnNlbmQoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZSNjb21waWxlXG4gICAgICogQHBhcmFtIHtXZWJHbFJlbmRlcmluZ0NvbnRleHR9IGdsXG4gICAgICogQHJldHVybiB7V2ViR0xTaGFkZXJ9IC0gd2ViZ2wgc2hhZGVyIG9iamVjdCBvciAqdW5kZWZpbmVkKlxuICAgICAqL1xuXG4gICAgU2hhZGVyU291cmNlLnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKCBnbCApIHtcblxuICAgICAgICBpZiAoICEgdGhpcy5kZWZlcnJlZC5yZWFkeSApIHJldHVybjtcblxuICAgICAgICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKCBnbFsgdGhpcy5zaGFkZXJUeXBlIF0gKTtcblxuICAgICAgICBnbC5zaGFkZXJTb3VyY2UoIHNoYWRlciwgdGhpcy5zb3VyY2UgKTtcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlciggc2hhZGVyICk7XG5cbiAgICAgICAgaWYgKCAhIGdsLmdldFNoYWRlclBhcmFtZXRlciggc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyApICkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIGdsLmdldFNoYWRlckluZm9Mb2coIHNoYWRlciApICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaGFkZXI7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZVxuICAgICAqIEBjb25zdGFudCBWRVJURVhfU0hBREVSXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuXG4gICAgU2hhZGVyU291cmNlLlZFUlRFWF9TSEFERVIgPSAnVkVSVEVYX1NIQURFUic7XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZVxuICAgICAqIEBjb25zdGFudCBGUkFHTUVOVF9TSEFERVJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG5cbiAgICBTaGFkZXJTb3VyY2UuRlJBR01FTlRfU0hBREVSID0gJ0ZSQUdNRU5UX1NIQURFUic7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gU2hhZGVyU291cmNlO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cblxuICAgIGZ1bmN0aW9uIFVuaWZvcm0gKCBwcm9ncmFtLCBpbmZvICkge1xuICAgICAgICBcbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnRpZXNQdWJsaWNSTyggdGhpcywge1xuICAgICAgICBcbiAgICAgICAgICAgIHByb2dyYW0gIDogcHJvZ3JhbSxcbiAgICAgICAgICAgIGluZm8gICAgIDogaW5mbyxcbiAgICAgICAgICAgIGxvY2F0aW9uIDogcHJvZ3JhbS5nbHguZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKCBwcm9ncmFtLmdsUHJvZ3JhbSwgaW5mby5uYW1lIClcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vT2JqZWN0LnNlYWwoIHRoaXMgKTtcblxuICAgIH1cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBVbmlmb3JtO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLndlYmdsLldlYkdsQ29udGV4dFxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gV2ViR2xDb250ZXh0ICggZ2wgKSB7XG5cbiAgICAgICAgaWYgKCAhIGdsICkgdGhyb3cgbmV3IEVycm9yKCAnW25ldyBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0XSBnbCBpcyB1bmRlZmluZWQhJyApO1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPKCB0aGlzLCAnZ2wnLCBnbCApO1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHJpdmF0ZVJPKCB0aGlzLCB7XG4gICAgICAgICAgICAnX2JvdW5kQnVmZmVycycgOiBuZXcgdXRpbHMuTWFwKCksXG4gICAgICAgICAgICAnX2JvdW5kVGV4dHVyZXMnOiBuZXcgdXRpbHMuTWFwKCksXG4gICAgICAgICAgICAnX3NoYWRlcnMnICAgICAgOiBuZXcgdXRpbHMuTWFwKCksXG4gICAgICAgICAgICAnX3Byb2dyYW1zJyAgICAgOiBuZXcgdXRpbHMuTWFwKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZ2V0RXh0ZW5zaW9ucyggdGhpcyApO1xuICAgICAgICByZWFkV2ViR2xQYXJhbWV0ZXJzKCB0aGlzICk7XG5cbiAgICAgICAgdGhpcy5hcHAgICAgICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5hY3RpdmVQcm9ncmFtID0gbnVsbDtcblxuICAgICAgICBPYmplY3Quc2VhbCggdGhpcyApO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0I2JpbmRCdWZmZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnVmZmVyVHlwZSAtIGdsLkFSUkFZX0JVRkZFUiBvciBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUlxuICAgICAqIEBwYXJhbSBidWZmZXJcbiAgICAgKi9cblxuICAgIFdlYkdsQ29udGV4dC5wcm90b3R5cGUuYmluZEJ1ZmZlciA9IGZ1bmN0aW9uICggYnVmZmVyVHlwZSwgYnVmZmVyICkge1xuXG4gICAgICAgIGlmICggdGhpcy5fYm91bmRCdWZmZXJzLmdldCggYnVmZmVyVHlwZSApICE9PSBidWZmZXIgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2JvdW5kQnVmZmVycy5zZXQoIGJ1ZmZlclR5cGUsIGJ1ZmZlciApO1xuICAgICAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKCBidWZmZXJUeXBlLCBidWZmZXIgKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0I2JpbmRBcnJheUJ1ZmZlclxuICAgICAqIEBwYXJhbSBidWZmZXJcbiAgICAgKi9cblxuICAgIFdlYkdsQ29udGV4dC5wcm90b3R5cGUuYmluZEFycmF5QnVmZmVyID0gZnVuY3Rpb24gKCBidWZmZXIgKSB7XG5cbiAgICAgICAgdGhpcy5iaW5kQnVmZmVyKCB0aGlzLmdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyICk7XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0I2JpbmRFbGVtZW50QXJyYXlCdWZmZXJcbiAgICAgKiBAcGFyYW0gYnVmZmVyXG4gICAgICovXG5cbiAgICBXZWJHbENvbnRleHQucHJvdG90eXBlLmJpbmRFbGVtZW50QXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoIGJ1ZmZlciApIHtcblxuICAgICAgICB0aGlzLmJpbmRCdWZmZXIoIHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ1ZmZlciApO1xuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLldlYkdsQ29udGV4dCNnbFNoYWRlclxuICAgICAqIEBwYXJhbSB7UGljaW1vLndlYmdsLlNoYWRlclNvdXJjZX0gc2hhZGVyXG4gICAgICogQHJldHVybiB7V2ViR0xTaGFkZXJ9IFRoZSBzaGFkZXIgb2JqZWN0IG9yICp1bmRlZmluZWQqXG4gICAgICovXG5cbiAgICBXZWJHbENvbnRleHQucHJvdG90eXBlLmdsU2hhZGVyID0gZnVuY3Rpb24gKCBzaGFkZXIgKSB7XG5cbiAgICAgICAgaWYgKCBzaGFkZXIgPT09IHVuZGVmaW5lZCApIHJldHVybjtcblxuICAgICAgICB2YXIgZ2xTaGFkZXIgPSB0aGlzLl9zaGFkZXJzLmdldCggc2hhZGVyLnVpZCApO1xuXG4gICAgICAgIGlmICggZ2xTaGFkZXIgPT09IHVuZGVmaW5lZCApIHtcblxuICAgICAgICAgICAgZ2xTaGFkZXIgPSBzaGFkZXIuY29tcGlsZSggdGhpcy5nbCApO1xuXG4gICAgICAgICAgICBpZiAoIGdsU2hhZGVyICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFkZXJzLnNldCggc2hhZGVyLnVpZCwgZ2xTaGFkZXIgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xTaGFkZXI7XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0I2dsUHJvZ3JhbVxuICAgICAqIEBwYXJhbSB7UGljaW1vLndlYmdsLlByb2dyYW19IHByb2dyYW1cbiAgICAgKiBAcmV0dXJuIHtQaWNpbW8ud2ViZ2wuV2ViR2xQcm9ncmFtfSBUaGUgcHJvZ3JhbSBvYmplY3Qgb3IgKnVuZGVmaW5lZCpcbiAgICAgKi9cblxuICAgIFdlYkdsQ29udGV4dC5wcm90b3R5cGUuZ2xQcm9ncmFtID0gZnVuY3Rpb24gKCBwcm9ncmFtICkge1xuXG4gICAgICAgIGlmICggcHJvZ3JhbSA9PT0gdW5kZWZpbmVkICkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBnbFByb2dyYW0gPSB0aGlzLl9wcm9ncmFtcy5nZXQoIHByb2dyYW0udWlkICk7XG5cbiAgICAgICAgaWYgKCBnbFByb2dyYW0gPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgXG4gICAgICAgICAgICBnbFByb2dyYW0gPSBwcm9ncmFtLmxpbmtQcm9ncmFtKCB0aGlzLmFwcCApO1xuXG4gICAgICAgICAgICBpZiAoIGdsUHJvZ3JhbSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvZ3JhbXMuc2V0KCBwcm9ncmFtLnVpZCwgZ2xQcm9ncmFtICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xQcm9ncmFtO1xuXG4gICAgfTtcblxuXG5cbiAgICBmdW5jdGlvbiByZWFkV2ViR2xQYXJhbWV0ZXJzKCB3ZWJHbENvbnRleHQgKSB7XG5cbiAgICAgICAgdmFyIGdsID0gd2ViR2xDb250ZXh0LmdsO1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHVibGljUk8oIHdlYkdsQ29udGV4dCwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLndlYmdsLldlYkdsQ29udGV4dCNNQVhfVEVYVFVSRV9TSVpFIC0gZ2wuTUFYX1RFWFRVUkVfU0laRVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBNQVhfVEVYVFVSRV9TSVpFIDogZ2wuZ2V0UGFyYW1ldGVyKCBnbC5NQVhfVEVYVFVSRV9TSVpFICksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0I01BWF9URVhUVVJFX0lNQUdFX1VOSVRTIC0gZ2wuTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMgOiBnbC5nZXRQYXJhbWV0ZXIoIGdsLk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTIClcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEV4dGVuc2lvbnMoIHdlYkdsQ29udGV4dCApIHtcblxuICAgICAgICB3ZWJHbENvbnRleHQuT0VTX2VsZW1lbnRfaW5kZXhfdWludCA9IHdlYkdsQ29udGV4dC5nbC5nZXRFeHRlbnNpb24oXCJPRVNfZWxlbWVudF9pbmRleF91aW50XCIpO1xuXG4gICAgICAgIGlmICggISB3ZWJHbENvbnRleHQuT0VTX2VsZW1lbnRfaW5kZXhfdWludCApIHtcblxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJXZWJHTCBkb24ndCBzdXBwb3J0IHRoZSBPRVNfZWxlbWVudF9pbmRleF91aW50IGV4dGVuc2lvbiFcIiApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzID0gV2ViR2xDb250ZXh0O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgVW5pZm9ybSA9IHJlcXVpcmUoICcuL3VuaWZvcm0nICk7XG4gICAgdmFyIEF0dHJpYiAgPSByZXF1aXJlKCAnLi9hdHRyaWInICk7XG5cblxuICAgIGZ1bmN0aW9uIFdlYkdsUHJvZ3JhbSAoIHByb2dyYW0sIGdsUHJvZ3JhbSwgZ2x4ICkge1xuXG4gICAgICAgIHRoaXMucHJvZ3JhbSAgID0gcHJvZ3JhbTtcbiAgICAgICAgdGhpcy5nbFByb2dyYW0gPSBnbFByb2dyYW07XG4gICAgICAgIHRoaXMuZ2x4ICAgICAgID0gZ2x4O1xuICAgICAgICBcbiAgICAgICAgc2V0dXBVbmlmb3Jtc0FuZEF0dHJpYnV0ZXMoIHRoaXMgKTtcblxuICAgICAgICBPYmplY3QuZnJlZXplKCB0aGlzICk7XG5cbiAgICB9XG5cbiAgICBXZWJHbFByb2dyYW0ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uICggZ2x4ICkge1xuXG4gICAgICAgIGlmICggZ2x4LmFjdGl2ZVByb2dyYW0gIT09IHRoaXMgKSB7XG5cbiAgICAgICAgICAgIGdseC5hY3RpdmVQcm9ncmFtID0gdGhpcztcbiAgICAgICAgICAgIGdseC5nbC51c2VQcm9ncmFtKCB0aGlzLmdsUHJvZ3JhbSApO1xuICAgICAgICBcbiAgICAgICAgfVxuICAgIFxuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIHNldHVwVW5pZm9ybXNBbmRBdHRyaWJ1dGVzICggZ2xQcm9ncmFtICkge1xuICAgIFxuICAgICAgICB2YXIgZ2wgICAgICAgICAgPSBnbFByb2dyYW0uZ2x4LmdsO1xuICAgICAgICB2YXIgbnVtVW5pZm9ybXMgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKCBnbFByb2dyYW0uZ2xQcm9ncmFtLCBnbC5BQ1RJVkVfVU5JRk9STVMgKTtcblxuICAgICAgICBnbFByb2dyYW0udW5pZm9ybU5hbWVzICA9IFtdO1xuICAgICAgICBnbFByb2dyYW0udW5pZm9ybSAgICAgICA9IHt9O1xuXG4gICAgICAgIHZhciBpLCB1bmlmb3JtO1xuXG4gICAgICAgIGZvciAoIGkgPSAwOyBpIDwgbnVtVW5pZm9ybXMgOyArK2kgKSB7XG5cbiAgICAgICAgICAgIHVuaWZvcm0gPSBnbC5nZXRBY3RpdmVVbmlmb3JtKCBnbFByb2dyYW0uZ2xQcm9ncmFtLCBpICk7XG5cbiAgICAgICAgICAgIGdsUHJvZ3JhbS51bmlmb3JtWyB1bmlmb3JtLm5hbWUgXSA9IG5ldyBVbmlmb3JtKCBnbFByb2dyYW0sIHVuaWZvcm0gKTtcbiAgICAgICAgICAgIGdsUHJvZ3JhbS51bmlmb3JtTmFtZXMucHVzaCggdW5pZm9ybS5uYW1lICk7XG4gICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmZyZWV6ZSggZ2xQcm9ncmFtLnVuaWZvcm0gKTtcblxuXG4gICAgICAgIHZhciBudW1BdHRyaWJzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlciggZ2xQcm9ncmFtLmdsUHJvZ3JhbSwgZ2wuQUNUSVZFX0FUVFJJQlVURVMgKTtcblxuICAgICAgICBnbFByb2dyYW0uYXR0cmliTmFtZXMgPSBbXTtcbiAgICAgICAgZ2xQcm9ncmFtLmF0dHJpYiAgICAgID0ge307XG5cbiAgICAgICAgdmFyIGF0dHI7XG5cbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCBudW1BdHRyaWJzIDsgKytpICkge1xuXG4gICAgICAgICAgICBhdHRyID0gZ2wuZ2V0QWN0aXZlQXR0cmliKCBnbFByb2dyYW0uZ2xQcm9ncmFtLCBpICk7XG5cbiAgICAgICAgICAgIGdsUHJvZ3JhbS5hdHRyaWJbIGF0dHIubmFtZSBdID0gbmV3IEF0dHJpYiggZ2xQcm9ncmFtLCBhdHRyICk7XG4gICAgICAgICAgICBnbFByb2dyYW0uYXR0cmliTmFtZXMucHVzaCggYXR0ci5uYW1lICk7XG4gICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmZyZWV6ZSggZ2xQcm9ncmFtLmF0dHJpYiApO1xuICAgIFxuICAgIH1cblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBXZWJHbFByb2dyYW07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoICcuLi91dGlscycgKTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8ud2ViZ2wuV2ViR2xSZW5kZXJlclxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gV2ViR2xSZW5kZXJlciAoIGFwcCApIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLkFwcH0gUGljaW1vLndlYmdsLldlYkdsUmVuZGVyZXIjYXBwXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnR5UHVibGljUk8oIHRoaXMsICdhcHAnLCBhcHAgKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuV2ViR2xSZW5kZXJlciNiZWdpbkZyYW1lXG4gICAgICovXG5cbiAgICBXZWJHbFJlbmRlcmVyLnByb3RvdHlwZS5iZWdpbkZyYW1lID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBnbCA9IHRoaXMuYXBwLmdsO1xuICAgICAgICB2YXIgYmdDb2xvciA9IHRoaXMuYXBwLmJhY2tncm91bmRDb2xvcjtcblxuICAgICAgICBnbC5jbGVhckNvbG9yKCBiZ0NvbG9yLmdldFJlZCgpLCBiZ0NvbG9yLmdldEdyZWVuKCksIGJnQ29sb3IuZ2V0Qmx1ZSgpLCBiZ0NvbG9yLmdldEFscGhhKCkgKTtcbiAgICAgICAgZ2wuY2xlYXIoIGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUICk7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5XZWJHbFJlbmRlcmVyI2VuZEZyYW1lXG4gICAgICovXG5cbiAgICBXZWJHbFJlbmRlcmVyLnByb3RvdHlwZS5lbmRGcmFtZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLldlYkdsUmVuZGVyZXIjaW5pdEdsXG4gICAgICovXG5cbiAgICBXZWJHbFJlbmRlcmVyLnByb3RvdHlwZS5pbml0R2wgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGdsID0gdGhpcy5hcHAuZ2w7XG5cbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZSggZ2wuVEVYVFVSRTAgKTsgLy8gVE9ETyByZW1vdmVcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLldlYkdsUmVuZGVyZXIjcmVzaXplXG4gICAgICovXG5cbiAgICBXZWJHbFJlbmRlcmVyLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGFwcCA9IHRoaXMuYXBwO1xuICAgICAgICB2YXIgZ2wgID0gdGhpcy5hcHAuZ2w7XG5cbiAgICAgICAgZ2wudmlld3BvcnQoIDAsIDAsIGFwcC53aWR0aCwgYXBwLmhlaWdodCApO1xuXG4gICAgfTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBXZWJHbFJlbmRlcmVyO1xuXG59KSgpO1xuIl19
