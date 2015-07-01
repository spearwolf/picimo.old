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

},{"./picimo":126}],116:[function(require,module,exports){
/* global requestAnimationFrame */
(function(){
    "use strict";

    var utils = require( '../utils' );
    var sg    = require( '../sg' );
    var webgl = require( '../webgl' );

    /**
     * @class Picimo.App
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

        utils.custom_event.eventize( this );

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

},{"../sg":127,"../utils":138,"../webgl":142}],117:[function(require,module,exports){
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

},{"../utils":138}],122:[function(require,module,exports){
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

},{"../utils":138}],123:[function(require,module,exports){
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

},{"../utils":138}],125:[function(require,module,exports){
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

},{"./app":116,"./core":118,"./sg":127,"./sprites":130,"./utils":138,"./webgl":142}],127:[function(require,module,exports){
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

},{"./node":128,"./node_state":129}],128:[function(require,module,exports){
(function(){
    "use strict";

    var utils     = require( '../utils' );
    var NodeState = require( './node_state' );

    /**
     * @class Picimo.sg.Node
     * @classdesc
     * The generic base class for all scene graph nodes.
     *
     * ### States and Events
     * <img src="images/node-events.png" srcset="images/node-events.png 1x,images/node-events@2x.png 2x" alt="Node Events and States">
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

    
        utils.custom_event.eventize( this );

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

},{"../utils":138,"./node_state":129}],129:[function(require,module,exports){
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

},{"../utils":138}],130:[function(require,module,exports){
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

},{"./sprite":131,"./sprite_descriptor":132}],131:[function(require,module,exports){
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

},{"./sprite_descriptor":132}],132:[function(require,module,exports){
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

},{"../core":118,"./sprite_helpers":133}],133:[function(require,module,exports){
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

},{}],134:[function(require,module,exports){
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

},{}],135:[function(require,module,exports){
(function(){
    "use strict";

    var object_utils = require( './object_utils' );

    var UID = 0;

    module.exports = function addUid( obj ) {

        object_utils.definePropertyPublicRO( obj, 'uid', ( ++UID ) );

    };

})();

},{"./object_utils":140}],136:[function(require,module,exports){
(function() {
    "use strict";

    (function(api) {

        _definePublicPropertyRO(api, 'VERSION', "0.10.2");

        // =====================================================================
        //
        // eventize( object )
        //
        // =====================================================================

        api.eventize = function(o) {

            _defineHiddenPropertyRO(o, '_callbacks', { _id: 0 });

            // -----------------------------------------------------------------
            //
            // object.on( eventName, [ prio, ] callback )
            //
            // -----------------------------------------------------------------

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

},{}],137:[function(require,module,exports){
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

},{"./object_utils":140,"./promise":141}],138:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.utils
     * @summary
     * Helper functions, utilities and 3rd-party libraries.
     */

    module.exports = {

        custom_event : require( './custom_event' ),

        /**
         * @namespace Picimo.utils.object
         * @summary
         * Generic object and properties helper functions.
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
         *   The fantastic gl-matrix library.
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
         *   The fantastic color management API net.brehaut.Color
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

},{"./add_glx_property":134,"./add_uid":135,"./custom_event":136,"./deferred":137,"./map":139,"./object_utils":140,"./promise":141,"color-js":1,"gl-matrix":105}],139:[function(require,module,exports){
(function(){
    "use strict";

    module.exports = typeof Map === 'undefined' ? require( 'core-js/library' ).Map : Map;

})();

},{"core-js/library":2}],140:[function(require,module,exports){
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

},{}],141:[function(require,module,exports){
(function(){
    "use strict";

    module.exports = typeof Promise === 'undefined' ? require( 'core-js/library' ).Promise : Promise;

})();

},{"core-js/library":2}],142:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * @namespace Picimo.webgl
     */

    module.exports = {

        ShaderSource  : require( './shader_source' ),
        ShaderManager : require( './shader_manager' ),
        WebGlContext  : require( './web_gl_context' ),
        WebGlRenderer : require( './web_gl_renderer' )

    };

})();

},{"./shader_manager":143,"./shader_source":144,"./web_gl_context":145,"./web_gl_renderer":146}],143:[function(require,module,exports){
(function(){
    "use strict";

    var utils        = require( '../utils' );
    var ShaderSource = require( './shader_source' );

    /**
     * @class Picimo.webgl.ShaderManager
     */

    function ShaderManager ( app ) {
        
        utils.object.definePropertyPublicRO( this, 'app', app );

        utils.object.definePropertiesPrivateRO( this, {

            _vertexShader   : new utils.Map(),
            _fragmentShader : new utils.Map(),
        
        });

    }


    /**
     * @method Picimo.webgl.ShaderManager#addShader
     * @param {Picimo.ShaderSource} shader
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
     * @return {Picimo.ShaderSource} shader
     */

    ShaderManager.prototype.getVertexShader = function ( name ) {

        return this._vertexShader.get( name );
    
    };


    /**
     * @method Picimo.webgl.ShaderManager#getFragmentShader
     * @param {string} name
     * @return {Picimo.ShaderSource} shader
     */

    ShaderManager.prototype.getFragmentShader = function ( name ) {

        return this._fragmentShader.get( name );
    
    };


    module.exports = ShaderManager;

})();

},{"../utils":138,"./shader_source":144}],144:[function(require,module,exports){
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
     * @return {number} - *gl id* or 0
     */

    ShaderSource.prototype.compile = function ( gl ) {

        if ( ! this.deferred.ready ) return;

        var id = gl.createShader( gl[ this.shaderType ] );

        gl.shaderSource( id, this.source );
        gl.compileShader( id );

        if ( ! gl.getShaderParameter( id, gl.COMPILE_STATUS ) ) {

            throw new Error( gl.getShaderInfoLog( id ) );

        }

        return id;

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

},{"../utils":138}],145:[function(require,module,exports){
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
            '_boundTextures': new utils.Map()
        });

        getExtensions( this );
        readWebGlParameters( this );

        Object.seal( this );

    }

    /**
     * @method Picimo.webgl.WebGlContext#glBindBuffer
     * @param bufferType
     * @param buffer
     */

    WebGlContext.prototype.glBindBuffer = function ( bufferType, buffer ) {

        if ( this._boundBuffers.get( bufferType ) !== buffer ) {

            this._boundBuffers.set( bufferType, buffer );
            this.gl.bindBuffer( bufferType, buffer );

        }

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

},{"../utils":138}],146:[function(require,module,exports){
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

},{"../utils":138}]},{},[115])(115)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29sb3ItanMvY29sb3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hcnJheS1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLXdlYWsuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVmLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmVudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZvci1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZ2V0LW5hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaW52b2tlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubWl4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wYXJ0aWFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWYuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5yZXBsYWNlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNhbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLXBhZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnN0cmluZy1yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGhyb3dzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudW5zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLndrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLiRmb3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5hcnJheS50dXJuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmRlbGF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZGljdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmZ1bmN0aW9uLnBhcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5pdGVyLWhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5sb2cuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5udW1iZXIuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5udW1iZXIubWF0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLm9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLnN0cmluZy5lc2NhcGUtaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5LmNvcHktd2l0aGluLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5maWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5maW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkub2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmZ1bmN0aW9uLmhhcy1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5tYXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm51bWJlci5zdGF0aWNzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuaXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc3RhdGljcy1hY2NlcHQtcHJpbWl0aXZlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucmVmbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLnJhdy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi53ZWFrLXNldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuYXJyYXkuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcub2JqZWN0LnRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5yZWdleHAuZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zZXQudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3RyaW5nLmF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zdHJpbmcubHBhZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3RyaW5nLnJwYWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvanMuYXJyYXkuc3RhdGljcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5pbW1lZGlhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLnRpbWVycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC9jb21tb24uanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0cml4L3NyYy9nbC1tYXRyaXgvbWF0Mi5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC9tYXQyZC5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC9tYXQzLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdHJpeC9zcmMvZ2wtbWF0cml4L21hdDQuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0cml4L3NyYy9nbC1tYXRyaXgvcXVhdC5qcyIsIm5vZGVfbW9kdWxlcy9nbC1tYXRyaXgvc3JjL2dsLW1hdHJpeC92ZWMyLmpzIiwibm9kZV9tb2R1bGVzL2dsLW1hdHJpeC9zcmMvZ2wtbWF0cml4L3ZlYzMuanMiLCJub2RlX21vZHVsZXMvZ2wtbWF0cml4L3NyYy9nbC1tYXRyaXgvdmVjNC5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9waWNpbW8vYXBwL2luZGV4LmpzIiwic3JjL3BpY2ltby9jb3JlL2FhYmIyLmpzIiwic3JjL3BpY2ltby9jb3JlL2luZGV4LmpzIiwic3JjL3BpY2ltby9jb3JlL3RleHR1cmUuanMiLCJzcmMvcGljaW1vL2NvcmUvdmVydGV4X2FycmF5LmpzIiwic3JjL3BpY2ltby9jb3JlL3ZlcnRleF9pbmRleF9hcnJheS5qcyIsInNyYy9waWNpbW8vY29yZS92ZXJ0ZXhfb2JqZWN0LmpzIiwic3JjL3BpY2ltby9jb3JlL3ZlcnRleF9vYmplY3RfZGVzY3JpcHRvci5qcyIsInNyYy9waWNpbW8vY29yZS92ZXJ0ZXhfb2JqZWN0X3Bvb2wuanMiLCJzcmMvcGljaW1vL2NvcmUvdmlld3BvcnQuanMiLCJzcmMvcGljaW1vL2luZGV4LmpzIiwic3JjL3BpY2ltby9zZy9pbmRleC5qcyIsInNyYy9waWNpbW8vc2cvbm9kZS5qcyIsInNyYy9waWNpbW8vc2cvbm9kZV9zdGF0ZS5qcyIsInNyYy9waWNpbW8vc3ByaXRlcy9pbmRleC5qcyIsInNyYy9waWNpbW8vc3ByaXRlcy9zcHJpdGUuanMiLCJzcmMvcGljaW1vL3Nwcml0ZXMvc3ByaXRlX2Rlc2NyaXB0b3IuanMiLCJzcmMvcGljaW1vL3Nwcml0ZXMvc3ByaXRlX2hlbHBlcnMuanMiLCJzcmMvcGljaW1vL3V0aWxzL2FkZF9nbHhfcHJvcGVydHkuanMiLCJzcmMvcGljaW1vL3V0aWxzL2FkZF91aWQuanMiLCJzcmMvcGljaW1vL3V0aWxzL2N1c3RvbV9ldmVudC5qcyIsInNyYy9waWNpbW8vdXRpbHMvZGVmZXJyZWQuanMiLCJzcmMvcGljaW1vL3V0aWxzL2luZGV4LmpzIiwic3JjL3BpY2ltby91dGlscy9tYXAuanMiLCJzcmMvcGljaW1vL3V0aWxzL29iamVjdF91dGlscy5qcyIsInNyYy9waWNpbW8vdXRpbHMvcHJvbWlzZS5qcyIsInNyYy9waWNpbW8vd2ViZ2wvaW5kZXguanMiLCJzcmMvcGljaW1vL3dlYmdsL3NoYWRlcl9tYW5hZ2VyLmpzIiwic3JjL3BpY2ltby93ZWJnbC9zaGFkZXJfc291cmNlLmpzIiwic3JjL3BpY2ltby93ZWJnbC93ZWJfZ2xfY29udGV4dC5qcyIsInNyYy9waWNpbW8vd2ViZ2wvd2ViX2dsX3JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3YwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ253Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTMsIEFuZHJldyBCcmVoYXV0LCBUaW0gQmF1bWFubiwgTWF0dCBXaWxzb24sIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFNpbW9uIEhlaW1sZXIsIE1pY2hlbCBWaWVsbWV0dGVyIFxuLy9cbi8vIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vL1xuLy8gUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4vLyBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbi8vXG4vLyAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbi8vICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbi8vICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuLy8gICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4vLyAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuLy9cbi8vIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4vLyBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4vLyBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuLy8gQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFXG4vLyBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXG4vLyBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRlxuLy8gU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTXG4vLyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTlxuLy8gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSlcbi8vIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFXG4vLyBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cblxuLy8gY29sb3IuanMgLSB2ZXJzaW9uIDEuMC4xXG4vL1xuLy8gSFNWIDwtPiBSR0IgY29kZSBiYXNlZCBvbiBjb2RlIGZyb20gaHR0cDovL3d3dy5jcy5yaXQuZWR1L35uY3MvY29sb3IvdF9jb252ZXJ0Lmh0bWxcbi8vIG9iamVjdCBmdW5jdGlvbiBjcmVhdGVkIGJ5IERvdWdsYXMgQ3JvY2tmb3JkLlxuLy8gQ29sb3Igc2NoZW1lIGRlZ3JlZXMgdGFrZW4gZnJvbSB0aGUgY29sb3JqYWNrLmNvbSBjb2xvcnBpY2tlclxuLy9cbi8vIEhTTCBzdXBwb3J0IGtpbmRseSBwcm92aWRlZCBieSBUaW0gQmF1bWFubiAtIGh0dHA6Ly9naXRodWIuY29tL3RpbWpiXG5cbi8vIGNyZWF0ZSBuYW1lc3BhY2VzXG4vKmdsb2JhbCBuZXQgKi9cbmlmIChcInVuZGVmaW5lZFwiID09IHR5cGVvZiBuZXQpIHsgdmFyIG5ldCA9IHt9OyB9XG5pZiAoIW5ldC5icmVoYXV0KSB7IG5ldC5icmVoYXV0ID0ge307IH1cblxuLy8gdGhpcyBtb2R1bGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggbmV0LmJyZWhhdXQgYXMgJ3RoaXMnXG4oZnVuY3Rpb24gKCApIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIC8vIENvbnN0YW50c1xuXG4gIC8vIGNzc19jb2xvcnMgbWFwcyBjb2xvciBuYW1lcyBvbnRvIHRoZWlyIGhleCB2YWx1ZXNcbiAgLy8gdGhlc2UgbmFtZXMgYXJlIGRlZmluZWQgYnkgVzNDXG4gIHZhciBjc3NfY29sb3JzID0ge2FsaWNlYmx1ZTonI0YwRjhGRicsYW50aXF1ZXdoaXRlOicjRkFFQkQ3JyxhcXVhOicjMDBGRkZGJyxhcXVhbWFyaW5lOicjN0ZGRkQ0JyxhenVyZTonI0YwRkZGRicsYmVpZ2U6JyNGNUY1REMnLGJpc3F1ZTonI0ZGRTRDNCcsYmxhY2s6JyMwMDAwMDAnLGJsYW5jaGVkYWxtb25kOicjRkZFQkNEJyxibHVlOicjMDAwMEZGJyxibHVldmlvbGV0OicjOEEyQkUyJyxicm93bjonI0E1MkEyQScsYnVybHl3b29kOicjREVCODg3JyxjYWRldGJsdWU6JyM1RjlFQTAnLGNoYXJ0cmV1c2U6JyM3RkZGMDAnLGNob2NvbGF0ZTonI0QyNjkxRScsY29yYWw6JyNGRjdGNTAnLGNvcm5mbG93ZXJibHVlOicjNjQ5NUVEJyxjb3Juc2lsazonI0ZGRjhEQycsY3JpbXNvbjonI0RDMTQzQycsY3lhbjonIzAwRkZGRicsZGFya2JsdWU6JyMwMDAwOEInLGRhcmtjeWFuOicjMDA4QjhCJyxkYXJrZ29sZGVucm9kOicjQjg4NjBCJyxkYXJrZ3JheTonI0E5QTlBOScsZGFya2dyZXk6JyNBOUE5QTknLGRhcmtncmVlbjonIzAwNjQwMCcsZGFya2toYWtpOicjQkRCNzZCJyxkYXJrbWFnZW50YTonIzhCMDA4QicsZGFya29saXZlZ3JlZW46JyM1NTZCMkYnLGRhcmtvcmFuZ2U6JyNGRjhDMDAnLGRhcmtvcmNoaWQ6JyM5OTMyQ0MnLGRhcmtyZWQ6JyM4QjAwMDAnLGRhcmtzYWxtb246JyNFOTk2N0EnLGRhcmtzZWFncmVlbjonIzhGQkM4RicsZGFya3NsYXRlYmx1ZTonIzQ4M0Q4QicsZGFya3NsYXRlZ3JheTonIzJGNEY0RicsZGFya3NsYXRlZ3JleTonIzJGNEY0RicsZGFya3R1cnF1b2lzZTonIzAwQ0VEMScsZGFya3Zpb2xldDonIzk0MDBEMycsZGVlcHBpbms6JyNGRjE0OTMnLGRlZXBza3libHVlOicjMDBCRkZGJyxkaW1ncmF5OicjNjk2OTY5JyxkaW1ncmV5OicjNjk2OTY5Jyxkb2RnZXJibHVlOicjMUU5MEZGJyxmaXJlYnJpY2s6JyNCMjIyMjInLGZsb3JhbHdoaXRlOicjRkZGQUYwJyxmb3Jlc3RncmVlbjonIzIyOEIyMicsZnVjaHNpYTonI0ZGMDBGRicsZ2FpbnNib3JvOicjRENEQ0RDJyxnaG9zdHdoaXRlOicjRjhGOEZGJyxnb2xkOicjRkZENzAwJyxnb2xkZW5yb2Q6JyNEQUE1MjAnLGdyYXk6JyM4MDgwODAnLGdyZXk6JyM4MDgwODAnLGdyZWVuOicjMDA4MDAwJyxncmVlbnllbGxvdzonI0FERkYyRicsaG9uZXlkZXc6JyNGMEZGRjAnLGhvdHBpbms6JyNGRjY5QjQnLGluZGlhbnJlZDonI0NENUM1QycsaW5kaWdvOicjNEIwMDgyJyxpdm9yeTonI0ZGRkZGMCcsa2hha2k6JyNGMEU2OEMnLGxhdmVuZGVyOicjRTZFNkZBJyxsYXZlbmRlcmJsdXNoOicjRkZGMEY1JyxsYXduZ3JlZW46JyM3Q0ZDMDAnLGxlbW9uY2hpZmZvbjonI0ZGRkFDRCcsbGlnaHRibHVlOicjQUREOEU2JyxsaWdodGNvcmFsOicjRjA4MDgwJyxsaWdodGN5YW46JyNFMEZGRkYnLGxpZ2h0Z29sZGVucm9keWVsbG93OicjRkFGQUQyJyxsaWdodGdyYXk6JyNEM0QzRDMnLGxpZ2h0Z3JleTonI0QzRDNEMycsbGlnaHRncmVlbjonIzkwRUU5MCcsbGlnaHRwaW5rOicjRkZCNkMxJyxsaWdodHNhbG1vbjonI0ZGQTA3QScsbGlnaHRzZWFncmVlbjonIzIwQjJBQScsbGlnaHRza3libHVlOicjODdDRUZBJyxsaWdodHNsYXRlZ3JheTonIzc3ODg5OScsbGlnaHRzbGF0ZWdyZXk6JyM3Nzg4OTknLGxpZ2h0c3RlZWxibHVlOicjQjBDNERFJyxsaWdodHllbGxvdzonI0ZGRkZFMCcsbGltZTonIzAwRkYwMCcsbGltZWdyZWVuOicjMzJDRDMyJyxsaW5lbjonI0ZBRjBFNicsbWFnZW50YTonI0ZGMDBGRicsbWFyb29uOicjODAwMDAwJyxtZWRpdW1hcXVhbWFyaW5lOicjNjZDREFBJyxtZWRpdW1ibHVlOicjMDAwMENEJyxtZWRpdW1vcmNoaWQ6JyNCQTU1RDMnLG1lZGl1bXB1cnBsZTonIzkzNzBEOCcsbWVkaXVtc2VhZ3JlZW46JyMzQ0IzNzEnLG1lZGl1bXNsYXRlYmx1ZTonIzdCNjhFRScsbWVkaXVtc3ByaW5nZ3JlZW46JyMwMEZBOUEnLG1lZGl1bXR1cnF1b2lzZTonIzQ4RDFDQycsbWVkaXVtdmlvbGV0cmVkOicjQzcxNTg1JyxtaWRuaWdodGJsdWU6JyMxOTE5NzAnLG1pbnRjcmVhbTonI0Y1RkZGQScsbWlzdHlyb3NlOicjRkZFNEUxJyxtb2NjYXNpbjonI0ZGRTRCNScsbmF2YWpvd2hpdGU6JyNGRkRFQUQnLG5hdnk6JyMwMDAwODAnLG9sZGxhY2U6JyNGREY1RTYnLG9saXZlOicjODA4MDAwJyxvbGl2ZWRyYWI6JyM2QjhFMjMnLG9yYW5nZTonI0ZGQTUwMCcsb3JhbmdlcmVkOicjRkY0NTAwJyxvcmNoaWQ6JyNEQTcwRDYnLHBhbGVnb2xkZW5yb2Q6JyNFRUU4QUEnLHBhbGVncmVlbjonIzk4RkI5OCcscGFsZXR1cnF1b2lzZTonI0FGRUVFRScscGFsZXZpb2xldHJlZDonI0Q4NzA5MycscGFwYXlhd2hpcDonI0ZGRUZENScscGVhY2hwdWZmOicjRkZEQUI5JyxwZXJ1OicjQ0Q4NTNGJyxwaW5rOicjRkZDMENCJyxwbHVtOicjRERBMEREJyxwb3dkZXJibHVlOicjQjBFMEU2JyxwdXJwbGU6JyM4MDAwODAnLHJlYmVjY2FwdXJwbGU6JyM2NjMzOTknLHJlZDonI0ZGMDAwMCcscm9zeWJyb3duOicjQkM4RjhGJyxyb3lhbGJsdWU6JyM0MTY5RTEnLHNhZGRsZWJyb3duOicjOEI0NTEzJyxzYWxtb246JyNGQTgwNzInLHNhbmR5YnJvd246JyNGNEE0NjAnLHNlYWdyZWVuOicjMkU4QjU3JyxzZWFzaGVsbDonI0ZGRjVFRScsc2llbm5hOicjQTA1MjJEJyxzaWx2ZXI6JyNDMEMwQzAnLHNreWJsdWU6JyM4N0NFRUInLHNsYXRlYmx1ZTonIzZBNUFDRCcsc2xhdGVncmF5OicjNzA4MDkwJyxzbGF0ZWdyZXk6JyM3MDgwOTAnLHNub3c6JyNGRkZBRkEnLHNwcmluZ2dyZWVuOicjMDBGRjdGJyxzdGVlbGJsdWU6JyM0NjgyQjQnLHRhbjonI0QyQjQ4QycsdGVhbDonIzAwODA4MCcsdGhpc3RsZTonI0Q4QkZEOCcsdG9tYXRvOicjRkY2MzQ3Jyx0dXJxdW9pc2U6JyM0MEUwRDAnLHZpb2xldDonI0VFODJFRScsd2hlYXQ6JyNGNURFQjMnLHdoaXRlOicjRkZGRkZGJyx3aGl0ZXNtb2tlOicjRjVGNUY1Jyx5ZWxsb3c6JyNGRkZGMDAnLHllbGxvd2dyZWVuOicjOUFDRDMyJ307XG5cbiAgLy8gQ1NTIHZhbHVlIHJlZ2V4ZXMsIGFjY29yZGluZyB0byBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXZhbHVlcy9cbiAgdmFyIGNzc19pbnRlZ2VyID0gJyg/OlxcXFwrfC0pP1xcXFxkKyc7XG4gIHZhciBjc3NfZmxvYXQgPSAnKD86XFxcXCt8LSk/XFxcXGQqXFxcXC5cXFxcZCsnO1xuICB2YXIgY3NzX251bWJlciA9ICcoPzonICsgY3NzX2ludGVnZXIgKyAnKXwoPzonICsgY3NzX2Zsb2F0ICsgJyknO1xuICBjc3NfaW50ZWdlciA9ICcoJyArIGNzc19pbnRlZ2VyICsgJyknO1xuICBjc3NfZmxvYXQgPSAnKCcgKyBjc3NfZmxvYXQgKyAnKSc7XG4gIGNzc19udW1iZXIgPSAnKCcgKyBjc3NfbnVtYmVyICsgJyknO1xuICB2YXIgY3NzX3BlcmNlbnRhZ2UgPSBjc3NfbnVtYmVyICsgJyUnO1xuICB2YXIgY3NzX3doaXRlc3BhY2UgPSAnXFxcXHMqPyc7XG5cbiAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMy9DUi1jc3MzLWNvbG9yLTIwMDMwNTE0L1xuICB2YXIgaHNsX2hzbGFfcmVnZXggPSBuZXcgUmVnRXhwKFtcbiAgICAnXmhzbChhPylcXFxcKCcsIGNzc19udW1iZXIsICcsJywgY3NzX3BlcmNlbnRhZ2UsICcsJywgY3NzX3BlcmNlbnRhZ2UsICcoLCgnLCBjc3NfbnVtYmVyLCAnKSk/XFxcXCkkJ1xuICBdLmpvaW4oY3NzX3doaXRlc3BhY2UpICk7XG4gIHZhciByZ2JfcmdiYV9pbnRlZ2VyX3JlZ2V4ID0gbmV3IFJlZ0V4cChbXG4gICAgJ15yZ2IoYT8pXFxcXCgnLCBjc3NfaW50ZWdlciwgJywnLCBjc3NfaW50ZWdlciwgJywnLCBjc3NfaW50ZWdlciwgJygsKCcsIGNzc19udW1iZXIsICcpKT9cXFxcKSQnXG4gIF0uam9pbihjc3Nfd2hpdGVzcGFjZSkgKTtcbiAgdmFyIHJnYl9yZ2JhX3BlcmNlbnRhZ2VfcmVnZXggPSBuZXcgUmVnRXhwKFtcbiAgICAnXnJnYihhPylcXFxcKCcsIGNzc19wZXJjZW50YWdlLCAnLCcsIGNzc19wZXJjZW50YWdlLCAnLCcsIGNzc19wZXJjZW50YWdlLCAnKCwoJywgY3NzX251bWJlciwgJykpP1xcXFwpJCdcbiAgXS5qb2luKGNzc193aGl0ZXNwYWNlKSApO1xuXG4gIC8vIFBhY2thZ2Ugd2lkZSB2YXJpYWJsZXNcblxuICAvLyBiZWNvbWVzIHRoZSB0b3AgbGV2ZWwgcHJvdG90eXBlIG9iamVjdFxuICB2YXIgY29sb3I7XG5cbiAgLyogcmVnaXN0ZXJlZF9tb2RlbHMgY29udGFpbnMgdGhlIHRlbXBsYXRlIG9iamVjdHMgZm9yIGFsbCB0aGVcbiAgICogbW9kZWxzIHRoYXQgaGF2ZSBiZWVuIHJlZ2lzdGVyZWQgZm9yIHRoZSBjb2xvciBjbGFzcy5cbiAgICovXG4gIHZhciByZWdpc3RlcmVkX21vZGVscyA9IFtdO1xuXG5cbiAgLyogZmFjdG9yaWVzIGNvbnRhaW5zIG1ldGhvZHMgdG8gY3JlYXRlIG5ldyBpbnN0YW5jZSBvZlxuICAgKiBkaWZmZXJlbnQgY29sb3IgbW9kZWxzIHRoYXQgaGF2ZSBiZWVuIHJlZ2lzdGVyZWQuXG4gICAqL1xuICB2YXIgZmFjdG9yaWVzID0ge307XG5cbiAgLy8gVXRpbGl0eSBmdW5jdGlvbnNcblxuICAvKiBvYmplY3QgaXMgRG91Z2xhcyBDcm9ja2ZvcmRzIG9iamVjdCBmdW5jdGlvbiBmb3IgcHJvdG90eXBhbFxuICAgKiBpbmhlcml0YW5jZS5cbiAgICovXG4gIGlmICghdGhpcy5vYmplY3QpIHtcbiAgICB0aGlzLm9iamVjdCA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICBmdW5jdGlvbiBGICgpIHsgfVxuICAgICAgRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfTtcbiAgfVxuICB2YXIgb2JqZWN0ID0gdGhpcy5vYmplY3Q7XG5cbiAgLyogdGFrZXMgYSB2YWx1ZSwgY29udmVydHMgdG8gc3RyaW5nIGlmIG5lZWQgYmUsIHRoZW4gcGFkcyBpdFxuICAgKiB0byBhIG1pbmltdW0gbGVuZ3RoLlxuICAgKi9cbiAgZnVuY3Rpb24gcGFkICggdmFsLCBsZW4gKSB7XG4gICAgdmFsID0gdmFsLnRvU3RyaW5nKCk7XG4gICAgdmFyIHBhZGRlZCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1heCggbGVuIC0gdmFsLmxlbmd0aCwgMCk7IGkgPCBqOyBpKyspIHtcbiAgICAgIHBhZGRlZC5wdXNoKCcwJyk7XG4gICAgfVxuXG4gICAgcGFkZGVkLnB1c2godmFsKTtcbiAgICByZXR1cm4gcGFkZGVkLmpvaW4oJycpO1xuICB9XG5cblxuICAvKiB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIG5ldyBzdHJpbmcgd2l0aCB0aGUgZmlyc3QgbGV0dGVyXG4gICAqIGNhcGl0YWxpc2VkXG4gICAqL1xuICBmdW5jdGlvbiBjYXBpdGFsaXNlICggcyApIHtcbiAgICByZXR1cm4gcy5zbGljZSgwLDEpLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuICB9XG5cbiAgLyogcmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlXG4gICAqL1xuICBmdW5jdGlvbiB0cmltICggc3RyICkge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICB9XG5cbiAgLyogdXNlZCB0byBhcHBseSBhIG1ldGhvZCB0byBvYmplY3Qgbm9uLWRlc3RydWN0aXZlbHkgYnlcbiAgICogY2xvbmluZyB0aGUgb2JqZWN0IGFuZCB0aGVuIGFwcGx5IHRoZSBtZXRob2QgdG8gdGhhdFxuICAgKiBuZXcgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBjbG9uZU9uQXBwbHkoIG1ldGggKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICggKSB7XG4gICAgICB2YXIgY2xvbmVkID0gdGhpcy5jbG9uZSgpO1xuICAgICAgbWV0aC5hcHBseShjbG9uZWQsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2xvbmVkO1xuICAgIH07XG4gIH1cblxuXG4gIC8qIHJlZ2lzdGVyTW9kZWwgaXMgdXNlZCB0byBhZGQgYWRkaXRpb25hbCByZXByZXNlbnRhdGlvbnNcbiAgICogdG8gdGhlIGNvbG9yIGNvZGUsIGFuZCBleHRlbmQgdGhlIGNvbG9yIEFQSSB3aXRoIHRoZSBuZXdcbiAgICogb3BlcmF0aW9uIHRoYXQgbW9kZWwgcHJvdmlkZXMuIHNlZSBiZWZvcmUgZm9yIGV4YW1wbGVzXG4gICAqL1xuICBmdW5jdGlvbiByZWdpc3Rlck1vZGVsKCBuYW1lLCBtb2RlbCApIHtcbiAgICB2YXIgcHJvdG8gPSBvYmplY3QoY29sb3IpO1xuICAgIHZhciBmaWVsZHMgPSBbXTsgLy8gdXNlZCBmb3IgY2xvbmluZyBhbmQgZ2VuZXJhdGluZyBhY2Nlc3NvcnNcblxuICAgIHZhciB0b19tZXRoID0gJ3RvJysgY2FwaXRhbGlzZShuYW1lKTtcblxuICAgIGZ1bmN0aW9uIGNvbnZlcnRBbmRBcHBseSggbWV0aCApIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoICkge1xuICAgICAgICByZXR1cm4gbWV0aC5hcHBseSh0aGlzW3RvX21ldGhdKCksIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZvciAodmFyIGtleSBpbiBtb2RlbCkgaWYgKG1vZGVsLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHByb3RvW2tleV0gPSBtb2RlbFtrZXldO1xuICAgICAgdmFyIHByb3AgPSBwcm90b1trZXldO1xuXG4gICAgICBpZiAoa2V5LnNsaWNlKDAsMSkgPT0gJ18nKSB7IGNvbnRpbnVlOyB9XG4gICAgICBpZiAoIShrZXkgaW4gY29sb3IpICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgcHJvcCkge1xuICAgICAgICAvLyB0aGUgbWV0aG9kIGZvdW5kIG9uIHRoaXMgb2JqZWN0IGlzIGEpIHB1YmxpYyBhbmQgYikgbm90XG4gICAgICAgIC8vIGN1cnJlbnRseSBzdXBwb3J0ZWQgYnkgdGhlIGNvbG9yIG9iamVjdC4gQ3JlYXRlIGFuIGltcGwgdGhhdFxuICAgICAgICAvLyBjYWxscyB0aGUgdG9Nb2RlbCBmdW5jdGlvbiBhbmQgcGFzc2VzIHRoYXQgbmV3IG9iamVjdFxuICAgICAgICAvLyBvbnRvIHRoZSBjb3JyZWN0IG1ldGhvZCB3aXRoIHRoZSBhcmdzLlxuICAgICAgICBjb2xvcltrZXldID0gY29udmVydEFuZEFwcGx5KHByb3ApO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoXCJmdW5jdGlvblwiICE9IHR5cGVvZiBwcm9wKSB7XG4gICAgICAgIC8vIHdlIGhhdmUgZm91bmQgYSBwdWJsaWMgcHJvcGVydHkuIGNyZWF0ZSBhY2Nlc3NvciBtZXRob2RzXG4gICAgICAgIC8vIGFuZCBiaW5kIHRoZW0gdXAgY29ycmVjdGx5XG4gICAgICAgIGZpZWxkcy5wdXNoKGtleSk7XG4gICAgICAgIHZhciBnZXR0ZXIgPSAnZ2V0JytjYXBpdGFsaXNlKGtleSk7XG4gICAgICAgIHZhciBzZXR0ZXIgPSAnc2V0JytjYXBpdGFsaXNlKGtleSk7XG5cbiAgICAgICAgY29sb3JbZ2V0dGVyXSA9IGNvbnZlcnRBbmRBcHBseShcbiAgICAgICAgICBwcm90b1tnZXR0ZXJdID0gKGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzW2tleV07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKCBrZXkgKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbG9yW3NldHRlcl0gPSBjb252ZXJ0QW5kQXBwbHkoXG4gICAgICAgICAgcHJvdG9bc2V0dGVyXSA9IChmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgICAgICAgICAgdmFyIGNsb25lZCA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgICAgICAgY2xvbmVkW2tleV0gPSB2YWw7XG4gICAgICAgICAgICAgIHJldHVybiBjbG9uZWQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKCBrZXkgKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gLy8gZW5kIG9mIGZvciBvdmVyIG1vZGVsXG5cbiAgICAvLyBhIG1ldGhvZCB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IC0gbGFyZ2VseSBzbyBwcm90b3R5cGUgY2hhaW5zIGRvbnRcbiAgICAvLyBnZXQgaW5zYW5lLiBUaGlzIHVzZXMgYW4gdW5yb2xsZWQgJ29iamVjdCcgc28gdGhhdCBGIGlzIGNhY2hlZFxuICAgIC8vIGZvciBsYXRlciB1c2UuIHRoaXMgaXMgYXBwcm94IGEgMjUlIHNwZWVkIGltcHJvdmVtZW50XG4gICAgZnVuY3Rpb24gRiAoKSB7IH1cbiAgICBGLnByb3RvdHlwZSA9IHByb3RvO1xuICAgIGZ1bmN0aW9uIGZhY3RvcnkgKCApIHtcbiAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH1cbiAgICBmYWN0b3JpZXNbbmFtZV0gPSBmYWN0b3J5O1xuXG4gICAgcHJvdG8uY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2xvbmVkID0gZmFjdG9yeSgpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBmaWVsZHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBmaWVsZHNbaV07XG4gICAgICAgIGNsb25lZFtrZXldID0gdGhpc1trZXldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9O1xuXG4gICAgY29sb3JbdG9fbWV0aF0gPSBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoKTtcbiAgICB9O1xuXG4gICAgcmVnaXN0ZXJlZF9tb2RlbHMucHVzaChwcm90byk7XG5cbiAgICByZXR1cm4gcHJvdG87XG4gIH0vLyBlbmQgb2YgcmVnaXN0ZXJNb2RlbFxuXG4gIC8vIFRlbXBsYXRlIE9iamVjdHNcblxuICAvKiBjb2xvciBpcyB0aGUgcm9vdCBvYmplY3QgaW4gdGhlIGNvbG9yIGhpZXJhcmNoeS4gSXQgc3RhcnRzXG4gICAqIGxpZmUgYXMgYSB2ZXJ5IHNpbXBsZSBvYmplY3QsIGJ1dCBhcyBjb2xvciBtb2RlbHMgYXJlXG4gICAqIHJlZ2lzdGVyZWQgaXQgaGFzIG1ldGhvZHMgcHJvZ3JhbW1hdGljYWxseSBhZGRlZCB0byBtYW5hZ2VcbiAgICogY29udmVyc2lvbnMgYXMgbmVlZGVkLlxuICAgKi9cbiAgY29sb3IgPSB7XG4gICAgLyogZnJvbU9iamVjdCB0YWtlcyBhbiBhcmd1bWVudCBhbmQgZGVsZWdhdGVzIHRvIHRoZSBpbnRlcm5hbFxuICAgICAqIGNvbG9yIG1vZGVscyB0byB0cnkgdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZyb21PYmplY3Q6IGZ1bmN0aW9uICggbyApIHtcbiAgICAgIGlmICghbykge1xuICAgICAgICByZXR1cm4gb2JqZWN0KGNvbG9yKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSByZWdpc3RlcmVkX21vZGVscy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgdmFyIG51ID0gcmVnaXN0ZXJlZF9tb2RlbHNbaV0uZnJvbU9iamVjdChvKTtcbiAgICAgICAgaWYgKG51KSB7XG4gICAgICAgICAgcmV0dXJuIG51O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmplY3QoY29sb3IpO1xuICAgIH0sXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnRvQ1NTKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB0cmFuc3BhcmVudCA9IG51bGw7IC8vIGRlZmluZWQgd2l0aCBhbiBSR0IgbGF0ZXIuXG5cbiAgLyogUkdCIGlzIHRoZSByZWQgZ3JlZW4gYmx1ZSBtb2RlbC4gVGhpcyBkZWZpbml0aW9uIGlzIGNvbnZlcnRlZFxuICAgKiB0byBhIHRlbXBsYXRlIG9iamVjdCBieSByZWdpc3Rlck1vZGVsLlxuICAgKi9cbiAgcmVnaXN0ZXJNb2RlbCgnUkdCJywge1xuICAgIHJlZDogICAgMCxcbiAgICBncmVlbjogIDAsXG4gICAgYmx1ZTogICAwLFxuICAgIGFscGhhOiAgMCxcblxuICAgIC8qIGdldEx1bWluYW5jZSByZXR1cm5zIGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLCB0aGlzIGlzIHRoZVxuICAgICAqIGx1bWluYW5jZSBjYWxjdWF0ZWQgYWNjb3JkaW5nIHRvXG4gICAgICogaHR0cDovL3d3dy5wb3ludG9uLmNvbS9ub3Rlcy9jb2xvdXJfYW5kX2dhbW1hL0NvbG9yRkFRLmh0bWwjUlRGVG9DOVxuICAgICAqL1xuICAgIGdldEx1bWluYW5jZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiAodGhpcy5yZWQgKiAwLjIxMjYpICsgKHRoaXMuZ3JlZW4gKiAwLjcxNTIpICsgKHRoaXMuYmx1ZSAqIDAuMDcyMik7XG4gICAgfSxcblxuICAgIC8qIGRvZXMgYW4gYWxwaGEgYmFzZWQgYmxlbmQgb2YgY29sb3Igb250byB0aGlzLiBhbHBoYSBpcyB0aGVcbiAgICAgKiBhbW91bnQgb2YgJ2NvbG9yJyB0byB1c2UuICgwIHRvIDEpXG4gICAgICovXG4gICAgYmxlbmQ6IGZ1bmN0aW9uICggY29sb3IgLCBhbHBoYSApIHtcbiAgICAgIGNvbG9yID0gY29sb3IudG9SR0IoKTtcbiAgICAgIGFscGhhID0gTWF0aC5taW4oTWF0aC5tYXgoYWxwaGEsIDApLCAxKTtcbiAgICAgIHZhciByZ2IgPSB0aGlzLmNsb25lKCk7ICAgICBcblxuICAgICAgcmdiLnJlZCA9IChyZ2IucmVkICogKDEgLSBhbHBoYSkpICsgKGNvbG9yLnJlZCAqIGFscGhhKTtcbiAgICAgIHJnYi5ncmVlbiA9IChyZ2IuZ3JlZW4gKiAoMSAtIGFscGhhKSkgKyAoY29sb3IuZ3JlZW4gKiBhbHBoYSk7XG4gICAgICByZ2IuYmx1ZSA9IChyZ2IuYmx1ZSAqICgxIC0gYWxwaGEpKSArIChjb2xvci5ibHVlICogYWxwaGEpO1xuICAgICAgcmdiLmFscGhhID0gKHJnYi5hbHBoYSAqICgxIC0gYWxwaGEpKSArIChjb2xvci5hbHBoYSAqIGFscGhhKTtcblxuICAgICAgcmV0dXJuIHJnYjtcbiAgICB9LFxuXG4gICAgLyogZnJvbU9iamVjdCBhdHRlbXB0cyB0byBjb252ZXJ0IGFuIG9iamVjdCBvIHRvIGFuZCBSR0JcbiAgICAgKiBpbnN0YW5jZS4gVGhpcyBhY2NlcHRzIGFuIG9iamVjdCB3aXRoIHJlZCwgZ3JlZW4gYW5kIGJsdWVcbiAgICAgKiBtZW1iZXJzIG9yIGEgc3RyaW5nLiBJZiB0aGUgc3RyaW5nIGlzIGEga25vd24gQ1NTIGNvbG9yIG5hbWVcbiAgICAgKiBvciBhIGhleGRlY2ltYWwgc3RyaW5nIGl0IHdpbGwgYWNjZXB0IGl0LlxuICAgICAqL1xuICAgIGZyb21PYmplY3Q6IGZ1bmN0aW9uICggbyApIHtcbiAgICAgIGlmIChvIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21SR0JBcnJheSAoIG8gKTtcbiAgICAgIH1cbiAgICAgIGlmIChcInN0cmluZ1wiID09IHR5cGVvZiBvKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tQ1NTKCB0cmltKCBvICkgKTtcbiAgICAgIH1cbiAgICAgIGlmIChvLmhhc093blByb3BlcnR5KCdyZWQnKSAmJlxuICAgICAgICAgIG8uaGFzT3duUHJvcGVydHkoJ2dyZWVuJykgJiZcbiAgICAgICAgICBvLmhhc093blByb3BlcnR5KCdibHVlJykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21SR0IgKCBvICk7XG4gICAgICB9XG4gICAgICAvLyBub3RoaW5nIG1hdGNocywgbm90IGFuIFJHQiBvYmplY3RcbiAgICB9LFxuXG4gICAgX3N0cmluZ1BhcnNlcnM6IFtcbiAgICAgICAgLy8gQ1NTIFJHQihBKSBsaXRlcmFsOlxuICAgICAgICBmdW5jdGlvbiAoIGNzcyApIHtcbiAgICAgICAgICBjc3MgPSB0cmltKGNzcyk7XG5cbiAgICAgICAgICB2YXIgd2l0aEludGVnZXIgPSBtYXRjaChyZ2JfcmdiYV9pbnRlZ2VyX3JlZ2V4LCAyNTUpO1xuICAgICAgICAgIGlmKHdpdGhJbnRlZ2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gd2l0aEludGVnZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtYXRjaChyZ2JfcmdiYV9wZXJjZW50YWdlX3JlZ2V4LCAxMDApO1xuXG4gICAgICAgICAgZnVuY3Rpb24gbWF0Y2gocmVnZXgsIG1heF92YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGNvbG9yR3JvdXBzID0gY3NzLm1hdGNoKCByZWdleCApO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhbiBcImFcIiBhZnRlciBcInJnYlwiLCB0aGVyZSBtdXN0IGJlIGEgZm91cnRoIHBhcmFtZXRlciBhbmQgdGhlIG90aGVyIHdheSByb3VuZFxuICAgICAgICAgICAgaWYgKCFjb2xvckdyb3VwcyB8fCAoISFjb2xvckdyb3Vwc1sxXSArICEhY29sb3JHcm91cHNbNV0gPT09IDEpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmdiID0gZmFjdG9yaWVzLlJHQigpO1xuICAgICAgICAgICAgcmdiLnJlZCAgID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgY29sb3JHcm91cHNbMl0gLyBtYXhfdmFsdWUpKTtcbiAgICAgICAgICAgIHJnYi5ncmVlbiA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIGNvbG9yR3JvdXBzWzNdIC8gbWF4X3ZhbHVlKSk7XG4gICAgICAgICAgICByZ2IuYmx1ZSAgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCBjb2xvckdyb3Vwc1s0XSAvIG1heF92YWx1ZSkpO1xuICAgICAgICAgICAgcmdiLmFscGhhID0gISFjb2xvckdyb3Vwc1s1XSA/IE1hdGgubWluKE1hdGgubWF4KHBhcnNlRmxvYXQoY29sb3JHcm91cHNbNl0pLCAwKSwgMSkgOiAxO1xuXG4gICAgICAgICAgICByZXR1cm4gcmdiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmdW5jdGlvbiAoIGNzcyApIHtcbiAgICAgICAgICAgIHZhciBsb3dlciA9IGNzcy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKGxvd2VyIGluIGNzc19jb2xvcnMpIHtcbiAgICAgICAgICAgICAgY3NzID0gY3NzX2NvbG9yc1tsb3dlcl07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY3NzLm1hdGNoKC9eIyhbMC05YS1mQS1GXXszfXxbMC05YS1mQS1GXXs2fSkkLykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjc3MgPSBjc3MucmVwbGFjZSgvXiMvLCcnKTtcblxuICAgICAgICAgICAgdmFyIGJ5dGVzID0gY3NzLmxlbmd0aCAvIDM7XG5cbiAgICAgICAgICAgIHZhciBtYXggPSBNYXRoLnBvdygxNiwgYnl0ZXMpIC0gMTtcblxuICAgICAgICAgICAgdmFyIHJnYiA9IGZhY3Rvcmllcy5SR0IoKTtcbiAgICAgICAgICAgIHJnYi5yZWQgPSAgIHBhcnNlSW50KGNzcy5zbGljZSgwLCBieXRlcyksIDE2KSAvIG1heDtcbiAgICAgICAgICAgIHJnYi5ncmVlbiA9IHBhcnNlSW50KGNzcy5zbGljZShieXRlcyAqIDEsYnl0ZXMgKiAyKSwgMTYpIC8gbWF4O1xuICAgICAgICAgICAgcmdiLmJsdWUgPSAgcGFyc2VJbnQoY3NzLnNsaWNlKGJ5dGVzICogMiksIDE2KSAvIG1heDtcbiAgICAgICAgICAgIHJnYi5hbHBoYSA9IDE7XG4gICAgICAgICAgICByZXR1cm4gcmdiO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZ1bmN0aW9uICggY3NzICkge1xuICAgICAgICAgICAgaWYgKGNzcy50b0xvd2VyQ2FzZSgpICE9PSAndHJhbnNwYXJlbnQnKSByZXR1cm47XG5cbiAgICAgICAgICAgIHJldHVybiB0cmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgIF0sXG5cbiAgICBfZnJvbUNTUzogZnVuY3Rpb24gKCBjc3MgKSB7XG4gICAgICB2YXIgY29sb3IgPSBudWxsO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSB0aGlzLl9zdHJpbmdQYXJzZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgIGNvbG9yID0gdGhpcy5fc3RyaW5nUGFyc2Vyc1tpXShjc3MpO1xuICAgICAgICAgIGlmIChjb2xvcikgcmV0dXJuIGNvbG9yO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfZnJvbVJHQjogZnVuY3Rpb24gKCBSR0IgKSB7XG4gICAgICB2YXIgbmV3UkdCID0gZmFjdG9yaWVzLlJHQigpO1xuXG4gICAgICBuZXdSR0IucmVkID0gUkdCLnJlZDtcbiAgICAgIG5ld1JHQi5ncmVlbiA9IFJHQi5ncmVlbjtcbiAgICAgIG5ld1JHQi5ibHVlID0gUkdCLmJsdWU7XG4gICAgICBuZXdSR0IuYWxwaGEgPSBSR0IuaGFzT3duUHJvcGVydHkoJ2FscGhhJykgPyBSR0IuYWxwaGEgOiAxO1xuXG4gICAgICByZXR1cm4gbmV3UkdCO1xuICAgIH0sXG5cbiAgICBfZnJvbVJHQkFycmF5OiBmdW5jdGlvbiAoIFJHQiApIHtcbiAgICAgIHZhciBuZXdSR0IgPSBmYWN0b3JpZXMuUkdCKCk7XG5cbiAgICAgIG5ld1JHQi5yZWQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBSR0JbMF0gLyAyNTUpKTtcbiAgICAgIG5ld1JHQi5ncmVlbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIFJHQlsxXSAvIDI1NSkpO1xuICAgICAgbmV3UkdCLmJsdWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBSR0JbMl0gLyAyNTUpKTtcbiAgICAgIG5ld1JHQi5hbHBoYSA9IFJHQlszXSAhPT0gdW5kZWZpbmVkID8gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgUkdCWzNdKSkgOiAxO1xuXG4gICAgICByZXR1cm4gbmV3UkdCO1xuICAgIH0sXG5cbiAgICAvLyBjb252ZXJ0IHRvIGEgQ1NTIHN0cmluZy4gZGVmYXVsdHMgdG8gdHdvIGJ5dGVzIGEgdmFsdWVcbiAgICB0b0NTU0hleDogZnVuY3Rpb24gKCBieXRlcyApIHtcbiAgICAgICAgYnl0ZXMgPSBieXRlcyB8fCAyO1xuXG4gICAgICAgIHZhciBtYXggPSBNYXRoLnBvdygxNiwgYnl0ZXMpIC0gMTtcbiAgICAgICAgdmFyIGNzcyA9IFtcbiAgICAgICAgICBcIiNcIixcbiAgICAgICAgICBwYWQgKCBNYXRoLnJvdW5kKHRoaXMucmVkICogbWF4KS50b1N0cmluZyggMTYgKS50b1VwcGVyQ2FzZSgpLCBieXRlcyApLFxuICAgICAgICAgIHBhZCAoIE1hdGgucm91bmQodGhpcy5ncmVlbiAqIG1heCkudG9TdHJpbmcoIDE2ICkudG9VcHBlckNhc2UoKSwgYnl0ZXMgKSxcbiAgICAgICAgICBwYWQgKCBNYXRoLnJvdW5kKHRoaXMuYmx1ZSAqIG1heCkudG9TdHJpbmcoIDE2ICkudG9VcHBlckNhc2UoKSwgYnl0ZXMgKVxuICAgICAgICBdO1xuXG4gICAgICAgIHJldHVybiBjc3Muam9pbignJyk7XG4gICAgfSwgICAgXG4gICAgXG4gICAgdG9DU1M6IGZ1bmN0aW9uICggYnl0ZXMgKSB7XG4gICAgICBpZiAodGhpcy5hbHBoYSA9PT0gMSkgcmV0dXJuIHRoaXMudG9DU1NIZXgoYnl0ZXMpOyBcblxuICAgICAgdmFyIG1heCA9IDI1NTtcbiAgICAgIFxuICAgICAgdmFyIGNvbXBvbmVudHMgPSBbXG4gICAgICAgICdyZ2JhKCcsXG4gICAgICAgIE1hdGgubWF4KDAsIE1hdGgubWluKG1heCwgTWF0aC5yb3VuZCh0aGlzLnJlZCAqIG1heCkpKSwgJywnLFxuICAgICAgICBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXgsIE1hdGgucm91bmQodGhpcy5ncmVlbiAqIG1heCkpKSwgJywnLCBcbiAgICAgICAgTWF0aC5tYXgoMCwgTWF0aC5taW4obWF4LCBNYXRoLnJvdW5kKHRoaXMuYmx1ZSAqIG1heCkpKSwgJywnLFxuICAgICAgICBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB0aGlzLmFscGhhKSksIFxuICAgICAgICAnKSdcbiAgICAgIF07XG5cbiAgICAgIHJldHVybiBjb21wb25lbnRzLmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICB0b0hTVjogZnVuY3Rpb24gKCApIHtcbiAgICAgIHZhciBoc3YgPSBmYWN0b3JpZXMuSFNWKCk7XG4gICAgICB2YXIgbWluLCBtYXgsIGRlbHRhO1xuXG4gICAgICBtaW4gPSBNYXRoLm1pbih0aGlzLnJlZCwgdGhpcy5ncmVlbiwgdGhpcy5ibHVlKTtcbiAgICAgIG1heCA9IE1hdGgubWF4KHRoaXMucmVkLCB0aGlzLmdyZWVuLCB0aGlzLmJsdWUpO1xuICAgICAgaHN2LnZhbHVlID0gbWF4OyAvLyB2XG5cbiAgICAgIGRlbHRhID0gbWF4IC0gbWluO1xuXG4gICAgICBpZiggZGVsdGEgPT0gMCApIHsgLy8gd2hpdGUsIGdyZXksIGJsYWNrXG4gICAgICAgIGhzdi5odWUgPSBoc3Yuc2F0dXJhdGlvbiA9IDA7XG4gICAgICB9XG4gICAgICBlbHNlIHsgLy8gY2hyb21hXG4gICAgICAgIGhzdi5zYXR1cmF0aW9uID0gZGVsdGEgLyBtYXg7XG5cbiAgICAgICAgaWYoIHRoaXMucmVkID09IG1heCApIHtcbiAgICAgICAgICBoc3YuaHVlID0gKCB0aGlzLmdyZWVuIC0gdGhpcy5ibHVlICkgLyBkZWx0YTsgLy8gYmV0d2VlbiB5ZWxsb3cgJiBtYWdlbnRhXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiggdGhpcy5ncmVlbiAgPT0gbWF4ICkge1xuICAgICAgICAgIGhzdi5odWUgPSAyICsgKCB0aGlzLmJsdWUgLSB0aGlzLnJlZCApIC8gZGVsdGE7IC8vIGJldHdlZW4gY3lhbiAmIHllbGxvd1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGhzdi5odWUgPSA0ICsgKCB0aGlzLnJlZCAtIHRoaXMuZ3JlZW4gKSAvIGRlbHRhOyAvLyBiZXR3ZWVuIG1hZ2VudGEgJiBjeWFuXG4gICAgICAgIH1cblxuICAgICAgICBoc3YuaHVlID0gKChoc3YuaHVlICogNjApICsgMzYwKSAlIDM2MDsgLy8gZGVncmVlc1xuICAgICAgfVxuXG4gICAgICBoc3YuYWxwaGEgPSB0aGlzLmFscGhhO1xuXG4gICAgICByZXR1cm4gaHN2O1xuICAgIH0sXG4gICAgdG9IU0w6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0hTVigpLnRvSFNMKCk7XG4gICAgfSxcblxuICAgIHRvUkdCOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRyYW5zcGFyZW50ID0gY29sb3IuZnJvbU9iamVjdCh7cmVkOiAwLCBibHVlOiAwLCBncmVlbjogMCwgYWxwaGE6IDB9KTtcblxuXG4gIC8qIExpa2UgUkdCIGFib3ZlLCB0aGlzIG9iamVjdCBkZXNjcmliZXMgd2hhdCB3aWxsIGJlY29tZSB0aGUgSFNWXG4gICAqIHRlbXBsYXRlIG9iamVjdC4gVGhpcyBtb2RlbCBoYW5kbGVzIGh1ZSwgc2F0dXJhdGlvbiBhbmQgdmFsdWUuXG4gICAqIGh1ZSBpcyB0aGUgbnVtYmVyIG9mIGRlZ3JlZXMgYXJvdW5kIHRoZSBjb2xvciB3aGVlbCwgc2F0dXJhdGlvblxuICAgKiBkZXNjcmliZXMgaG93IG11Y2ggY29sb3IgdGhlaXIgaXMgYW5kIHZhbHVlIGlzIHRoZSBicmlnaHRuZXNzLlxuICAgKi9cbiAgcmVnaXN0ZXJNb2RlbCgnSFNWJywge1xuICAgIGh1ZTogMCxcbiAgICBzYXR1cmF0aW9uOiAwLFxuICAgIHZhbHVlOiAxLFxuICAgIGFscGhhOiAxLFxuXG4gICAgc2hpZnRIdWU6IGNsb25lT25BcHBseShmdW5jdGlvbiAoIGRlZ3JlZXMgKSB7XG4gICAgICB2YXIgaHVlID0gKHRoaXMuaHVlICsgZGVncmVlcykgJSAzNjA7XG4gICAgICBpZiAoaHVlIDwgMCkge1xuICAgICAgICBodWUgPSAoMzYwICsgaHVlKSAlIDM2MDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5odWUgPSBodWU7XG4gICAgfSksXG5cbiAgICBkZXZhbHVlQnlBbW91bnQ6IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLnZhbHVlIC0gdmFsLCAwKSk7XG4gICAgfSksXG5cbiAgICBkZXZhbHVlQnlSYXRpbzogY2xvbmVPbkFwcGx5KGZ1bmN0aW9uICggdmFsICkge1xuICAgICAgdGhpcy52YWx1ZSA9IE1hdGgubWluKDEsIE1hdGgubWF4KHRoaXMudmFsdWUgKiAoMSAtIHZhbCksIDApKTtcbiAgICB9KSxcblxuICAgIHZhbHVlQnlBbW91bnQ6IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLnZhbHVlICsgdmFsLCAwKSk7XG4gICAgfSksXG5cbiAgICB2YWx1ZUJ5UmF0aW86IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLnZhbHVlICogKDEgKyB2YWwpLCAwKSk7XG4gICAgfSksXG5cbiAgICBkZXNhdHVyYXRlQnlBbW91bnQ6IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMuc2F0dXJhdGlvbiA9IE1hdGgubWluKDEsIE1hdGgubWF4KHRoaXMuc2F0dXJhdGlvbiAtIHZhbCwgMCkpO1xuICAgIH0pLFxuXG4gICAgZGVzYXR1cmF0ZUJ5UmF0aW86IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMuc2F0dXJhdGlvbiA9IE1hdGgubWluKDEsIE1hdGgubWF4KHRoaXMuc2F0dXJhdGlvbiAqICgxIC0gdmFsKSwgMCkpO1xuICAgIH0pLFxuXG4gICAgc2F0dXJhdGVCeUFtb3VudDogY2xvbmVPbkFwcGx5KGZ1bmN0aW9uICggdmFsICkge1xuICAgICAgdGhpcy5zYXR1cmF0aW9uID0gTWF0aC5taW4oMSwgTWF0aC5tYXgodGhpcy5zYXR1cmF0aW9uICsgdmFsLCAwKSk7XG4gICAgfSksXG5cbiAgICBzYXR1cmF0ZUJ5UmF0aW86IGNsb25lT25BcHBseShmdW5jdGlvbiAoIHZhbCApIHtcbiAgICAgIHRoaXMuc2F0dXJhdGlvbiA9IE1hdGgubWluKDEsIE1hdGgubWF4KHRoaXMuc2F0dXJhdGlvbiAqICgxICsgdmFsKSwgMCkpO1xuICAgIH0pLFxuXG4gICAgc2NoZW1lRnJvbURlZ3JlZXM6IGZ1bmN0aW9uICggZGVncmVlcyApIHtcbiAgICAgIHZhciBuZXdDb2xvcnMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gZGVncmVlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgdmFyIGNvbCA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgY29sLmh1ZSA9ICh0aGlzLmh1ZSArIGRlZ3JlZXNbaV0pICUgMzYwO1xuICAgICAgICBuZXdDb2xvcnMucHVzaChjb2wpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ld0NvbG9ycztcbiAgICB9LFxuXG4gICAgY29tcGxlbWVudGFyeVNjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDE4MF0pO1xuICAgIH0sXG5cbiAgICBzcGxpdENvbXBsZW1lbnRhcnlTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCwxNTAsMzIwXSk7XG4gICAgfSxcblxuICAgIHNwbGl0Q29tcGxlbWVudGFyeUNXU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsMTUwLDMwMF0pO1xuICAgIH0sXG5cbiAgICBzcGxpdENvbXBsZW1lbnRhcnlDQ1dTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCw2MCwyMTBdKTtcbiAgICB9LFxuXG4gICAgdHJpYWRpY1NjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDEyMCwyNDBdKTtcbiAgICB9LFxuXG4gICAgY2xhc2hTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCw5MCwyNzBdKTtcbiAgICB9LFxuXG4gICAgdGV0cmFkaWNTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCw5MCwxODAsMjcwXSk7XG4gICAgfSxcblxuICAgIGZvdXJUb25lQ1dTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCw2MCwxODAsMjQwXSk7XG4gICAgfSxcblxuICAgIGZvdXJUb25lQ0NXU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsMTIwLDE4MCwzMDBdKTtcbiAgICB9LFxuXG4gICAgZml2ZVRvbmVBU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsMTE1LDE1NSwyMDUsMjQ1XSk7XG4gICAgfSxcblxuICAgIGZpdmVUb25lQlNjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDQwLDkwLDEzMCwyNDVdKTtcbiAgICB9LFxuXG4gICAgZml2ZVRvbmVDU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsNTAsOTAsMjA1LDMyMF0pO1xuICAgIH0sXG5cbiAgICBmaXZlVG9uZURTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCw0MCwxNTUsMjcwLDMxMF0pO1xuICAgIH0sXG5cbiAgICBmaXZlVG9uZUVTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCwxMTUsMjMwLDI3MCwzMjBdKTtcbiAgICB9LFxuXG4gICAgc2l4VG9uZUNXU2NoZW1lOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1lRnJvbURlZ3JlZXMoWzAsMzAsMTIwLDE1MCwyNDAsMjcwXSk7XG4gICAgfSxcblxuICAgIHNpeFRvbmVDQ1dTY2hlbWU6IGZ1bmN0aW9uICggKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlbWVGcm9tRGVncmVlcyhbMCw5MCwxMjAsMjEwLDI0MCwzMzBdKTtcbiAgICB9LFxuXG4gICAgbmV1dHJhbFNjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDE1LDMwLDQ1LDYwLDc1XSk7XG4gICAgfSxcblxuICAgIGFuYWxvZ291c1NjaGVtZTogZnVuY3Rpb24gKCApIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVtZUZyb21EZWdyZWVzKFswLDMwLDYwLDkwLDEyMCwxNTBdKTtcbiAgICB9LFxuXG4gICAgZnJvbU9iamVjdDogZnVuY3Rpb24gKCBvICkge1xuICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkoJ2h1ZScpICYmXG4gICAgICAgICAgby5oYXNPd25Qcm9wZXJ0eSgnc2F0dXJhdGlvbicpICYmXG4gICAgICAgICAgby5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICB2YXIgaHN2ID0gZmFjdG9yaWVzLkhTVigpO1xuXG4gICAgICAgIGhzdi5odWUgPSBvLmh1ZTtcbiAgICAgICAgaHN2LnNhdHVyYXRpb24gPSBvLnNhdHVyYXRpb247XG4gICAgICAgIGhzdi52YWx1ZSA9IG8udmFsdWU7XG4gICAgICAgIGhzdi5hbHBoYSA9IG8uaGFzT3duUHJvcGVydHkoJ2FscGhhJykgPyBvLmFscGhhIDogMTtcblxuICAgICAgICByZXR1cm4gaHN2O1xuICAgICAgfVxuICAgICAgLy8gbm90aGluZyBtYXRjaGVzLCBub3QgYW4gSFNWIG9iamVjdFxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIF9ub3JtYWxpc2U6IGZ1bmN0aW9uICggKSB7XG4gICAgICAgdGhpcy5odWUgJT0gMzYwO1xuICAgICAgIHRoaXMuc2F0dXJhdGlvbiA9IE1hdGgubWluKE1hdGgubWF4KDAsIHRoaXMuc2F0dXJhdGlvbiksIDEpO1xuICAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbihNYXRoLm1heCgwLCB0aGlzLnZhbHVlKSk7XG4gICAgICAgdGhpcy5hbHBoYSA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIHRoaXMuYWxwaGEpKTtcbiAgICB9LFxuXG4gICAgdG9SR0I6IGZ1bmN0aW9uICggKSB7XG4gICAgICB0aGlzLl9ub3JtYWxpc2UoKTtcblxuICAgICAgdmFyIHJnYiA9IGZhY3Rvcmllcy5SR0IoKTtcbiAgICAgIHZhciBpO1xuICAgICAgdmFyIGYsIHAsIHEsIHQ7XG5cbiAgICAgIGlmKCB0aGlzLnNhdHVyYXRpb24gPT09IDAgKSB7XG4gICAgICAgIC8vIGFjaHJvbWF0aWMgKGdyZXkpXG4gICAgICAgIHJnYi5yZWQgPSB0aGlzLnZhbHVlO1xuICAgICAgICByZ2IuZ3JlZW4gPSB0aGlzLnZhbHVlO1xuICAgICAgICByZ2IuYmx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIHJnYi5hbHBoYSA9IHRoaXMuYWxwaGE7XG4gICAgICAgIHJldHVybiByZ2I7XG4gICAgICB9XG5cbiAgICAgIHZhciBoID0gdGhpcy5odWUgLyA2MDtcdFx0XHQvLyBzZWN0b3IgMCB0byA1XG4gICAgICBpID0gTWF0aC5mbG9vciggaCApO1xuICAgICAgZiA9IGggLSBpO1x0XHRcdC8vIGZhY3RvcmlhbCBwYXJ0IG9mIGhcbiAgICAgIHAgPSB0aGlzLnZhbHVlICogKCAxIC0gdGhpcy5zYXR1cmF0aW9uICk7XG4gICAgICBxID0gdGhpcy52YWx1ZSAqICggMSAtIHRoaXMuc2F0dXJhdGlvbiAqIGYgKTtcbiAgICAgIHQgPSB0aGlzLnZhbHVlICogKCAxIC0gdGhpcy5zYXR1cmF0aW9uICogKCAxIC0gZiApICk7XG5cbiAgICAgIHN3aXRjaCggaSApIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHJnYi5yZWQgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgIHJnYi5ncmVlbiA9IHQ7XG4gICAgICAgICAgcmdiLmJsdWUgPSBwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgcmdiLnJlZCA9IHE7XG4gICAgICAgICAgcmdiLmdyZWVuID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICByZ2IuYmx1ZSA9IHA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZ2IucmVkID0gcDtcbiAgICAgICAgICByZ2IuZ3JlZW4gPSB0aGlzLnZhbHVlO1xuICAgICAgICAgIHJnYi5ibHVlID0gdDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHJnYi5yZWQgPSBwO1xuICAgICAgICAgIHJnYi5ncmVlbiA9IHE7XG4gICAgICAgICAgcmdiLmJsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgcmdiLnJlZCA9IHQ7XG4gICAgICAgICAgcmdiLmdyZWVuID0gcDtcbiAgICAgICAgICByZ2IuYmx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XHRcdC8vIGNhc2UgNTpcbiAgICAgICAgICByZ2IucmVkID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICByZ2IuZ3JlZW4gPSBwO1xuICAgICAgICAgIHJnYi5ibHVlID0gcTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmdiLmFscGhhID0gdGhpcy5hbHBoYTtcblxuICAgICAgcmV0dXJuIHJnYjtcbiAgICB9LFxuICAgIHRvSFNMOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX25vcm1hbGlzZSgpO1xuXG4gICAgICB2YXIgaHNsID0gZmFjdG9yaWVzLkhTTCgpO1xuXG4gICAgICBoc2wuaHVlID0gdGhpcy5odWU7XG4gICAgICB2YXIgbCA9ICgyIC0gdGhpcy5zYXR1cmF0aW9uKSAqIHRoaXMudmFsdWUsXG4gICAgICAgICAgcyA9IHRoaXMuc2F0dXJhdGlvbiAqIHRoaXMudmFsdWU7XG4gICAgICBpZihsICYmIDIgLSBsKSB7XG4gICAgICAgIHMgLz0gKGwgPD0gMSkgPyBsIDogMiAtIGw7XG4gICAgICB9XG4gICAgICBsIC89IDI7XG4gICAgICBoc2wuc2F0dXJhdGlvbiA9IHM7XG4gICAgICBoc2wubGlnaHRuZXNzID0gbDtcbiAgICAgIGhzbC5hbHBoYSA9IHRoaXMuYWxwaGE7XG5cbiAgICAgIHJldHVybiBoc2w7XG4gICAgfSxcblxuICAgIHRvSFNWOiBmdW5jdGlvbiAoICkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJlZ2lzdGVyTW9kZWwoJ0hTTCcsIHtcbiAgICBodWU6IDAsXG4gICAgc2F0dXJhdGlvbjogMCxcbiAgICBsaWdodG5lc3M6IDAsXG4gICAgYWxwaGE6IDEsXG5cbiAgICBkYXJrZW5CeUFtb3VudDogY2xvbmVPbkFwcGx5KGZ1bmN0aW9uICggdmFsICkge1xuICAgICAgdGhpcy5saWdodG5lc3MgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLmxpZ2h0bmVzcyAtIHZhbCwgMCkpO1xuICAgIH0pLFxuXG4gICAgZGFya2VuQnlSYXRpbzogY2xvbmVPbkFwcGx5KGZ1bmN0aW9uICggdmFsICkge1xuICAgICAgdGhpcy5saWdodG5lc3MgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLmxpZ2h0bmVzcyAqICgxIC0gdmFsKSwgMCkpO1xuICAgIH0pLFxuXG4gICAgbGlnaHRlbkJ5QW1vdW50OiBjbG9uZU9uQXBwbHkoZnVuY3Rpb24gKCB2YWwgKSB7XG4gICAgICB0aGlzLmxpZ2h0bmVzcyA9IE1hdGgubWluKDEsIE1hdGgubWF4KHRoaXMubGlnaHRuZXNzICsgdmFsLCAwKSk7XG4gICAgfSksXG5cbiAgICBsaWdodGVuQnlSYXRpbzogY2xvbmVPbkFwcGx5KGZ1bmN0aW9uICggdmFsICkge1xuICAgICAgdGhpcy5saWdodG5lc3MgPSBNYXRoLm1pbigxLCBNYXRoLm1heCh0aGlzLmxpZ2h0bmVzcyAqICgxICsgdmFsKSwgMCkpO1xuICAgIH0pLFxuXG4gICAgZnJvbU9iamVjdDogZnVuY3Rpb24gKCBvICkge1xuICAgICAgaWYgKFwic3RyaW5nXCIgPT0gdHlwZW9mIG8pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb21DU1MoIG8gKTtcbiAgICAgIH1cbiAgICAgIGlmIChvLmhhc093blByb3BlcnR5KCdodWUnKSAmJlxuICAgICAgICAgIG8uaGFzT3duUHJvcGVydHkoJ3NhdHVyYXRpb24nKSAmJlxuICAgICAgICAgIG8uaGFzT3duUHJvcGVydHkoJ2xpZ2h0bmVzcycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcm9tSFNMICggbyApO1xuICAgICAgfVxuICAgICAgLy8gbm90aGluZyBtYXRjaHMsIG5vdCBhbiBSR0Igb2JqZWN0XG4gICAgfSxcblxuICAgIF9mcm9tQ1NTOiBmdW5jdGlvbiAoIGNzcyApIHtcbiAgICAgIHZhciBjb2xvckdyb3VwcyA9IHRyaW0oIGNzcyApLm1hdGNoKCBoc2xfaHNsYV9yZWdleCApO1xuXG4gICAgICAvLyBpZiB0aGVyZSBpcyBhbiBcImFcIiBhZnRlciBcImhzbFwiLCB0aGVyZSBtdXN0IGJlIGEgZm91cnRoIHBhcmFtZXRlciBhbmQgdGhlIG90aGVyIHdheSByb3VuZFxuICAgICAgaWYgKCFjb2xvckdyb3VwcyB8fCAoISFjb2xvckdyb3Vwc1sxXSArICEhY29sb3JHcm91cHNbNV0gPT09IDEpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgaHNsID0gZmFjdG9yaWVzLkhTTCgpO1xuICAgICAgaHNsLmh1ZSAgICAgICAgPSAoY29sb3JHcm91cHNbMl0gJSAzNjAgKyAzNjApICUgMzYwO1xuICAgICAgaHNsLnNhdHVyYXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihwYXJzZUludChjb2xvckdyb3Vwc1szXSwgMTApIC8gMTAwLCAxKSk7XG4gICAgICBoc2wubGlnaHRuZXNzICA9IE1hdGgubWF4KDAsIE1hdGgubWluKHBhcnNlSW50KGNvbG9yR3JvdXBzWzRdLCAxMCkgLyAxMDAsIDEpKTtcbiAgICAgIGhzbC5hbHBoYSAgICAgID0gISFjb2xvckdyb3Vwc1s1XSA/IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHBhcnNlRmxvYXQoY29sb3JHcm91cHNbNl0pKSkgOiAxO1xuXG4gICAgICByZXR1cm4gaHNsO1xuICAgIH0sXG5cbiAgICBfZnJvbUhTTDogZnVuY3Rpb24gKCBIU0wgKSB7XG4gICAgICB2YXIgbmV3SFNMID0gZmFjdG9yaWVzLkhTTCgpO1xuXG4gICAgICBuZXdIU0wuaHVlID0gSFNMLmh1ZTtcbiAgICAgIG5ld0hTTC5zYXR1cmF0aW9uID0gSFNMLnNhdHVyYXRpb247XG4gICAgICBuZXdIU0wubGlnaHRuZXNzID0gSFNMLmxpZ2h0bmVzcztcblxuICAgICAgbmV3SFNMLmFscGhhID0gSFNMLmhhc093blByb3BlcnR5KCdhbHBoYScpID8gSFNMLmFscGhhIDogMTtcblxuICAgICAgcmV0dXJuIG5ld0hTTDtcbiAgICB9LFxuXG4gICAgX25vcm1hbGlzZTogZnVuY3Rpb24gKCApIHtcbiAgICAgICB0aGlzLmh1ZSA9ICh0aGlzLmh1ZSAlIDM2MCArIDM2MCkgJSAzNjA7XG4gICAgICAgdGhpcy5zYXR1cmF0aW9uID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgdGhpcy5zYXR1cmF0aW9uKSwgMSk7XG4gICAgICAgdGhpcy5saWdodG5lc3MgPSBNYXRoLm1pbihNYXRoLm1heCgwLCB0aGlzLmxpZ2h0bmVzcykpO1xuICAgICAgIHRoaXMuYWxwaGEgPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB0aGlzLmFscGhhKSk7XG4gICAgfSxcblxuICAgIHRvSFNMOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsb25lKCk7XG4gICAgfSxcbiAgICB0b0hTVjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9ub3JtYWxpc2UoKTtcblxuICAgICAgdmFyIGhzdiA9IGZhY3Rvcmllcy5IU1YoKTtcblxuICAgICAgLy8gaHR0cDovL2FyaXlhLmJsb2dzcG90LmNvbS8yMDA4LzA3L2NvbnZlcnRpbmctYmV0d2Vlbi1oc2wtYW5kLWhzdi5odG1sXG4gICAgICBoc3YuaHVlID0gdGhpcy5odWU7IC8vIEhcbiAgICAgIHZhciBsID0gMiAqIHRoaXMubGlnaHRuZXNzLFxuICAgICAgICAgIHMgPSB0aGlzLnNhdHVyYXRpb24gKiAoKGwgPD0gMSkgPyBsIDogMiAtIGwpO1xuICAgICAgaHN2LnZhbHVlID0gKGwgKyBzKSAvIDI7IC8vIFZcbiAgICAgIGhzdi5zYXR1cmF0aW9uID0gKCgyICogcykgLyAobCArIHMpKSB8fCAwOyAvLyBTXG4gICAgICBoc3YuYWxwaGEgPSB0aGlzLmFscGhhO1xuXG4gICAgICByZXR1cm4gaHN2O1xuICAgIH0sXG4gICAgdG9SR0I6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9IU1YoKS50b1JHQigpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gUGFja2FnZSBzcGVjaWZpYyBleHBvcnRzXG5cbiAgLyogdGhlIENvbG9yIGZ1bmN0aW9uIGlzIGEgZmFjdG9yeSBmb3IgbmV3IGNvbG9yIG9iamVjdHMuXG4gICAqL1xuICBmdW5jdGlvbiBDb2xvciggbyApIHtcbiAgICByZXR1cm4gY29sb3IuZnJvbU9iamVjdCggbyApO1xuICB9XG4gIENvbG9yLmlzVmFsaWQgPSBmdW5jdGlvbiggc3RyICkge1xuICAgIHZhciBrZXksIGMgPSBDb2xvciggc3RyICk7XG5cbiAgICB2YXIgbGVuZ3RoID0gMDtcbiAgICBmb3Ioa2V5IGluIGMpIHtcbiAgICAgIGlmKGMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBsZW5ndGgrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGVuZ3RoID4gMDtcbiAgfTtcbiAgbmV0LmJyZWhhdXQuQ29sb3IgPSBDb2xvcjtcbn0pLmNhbGwobmV0LmJyZWhhdXQpO1xuXG4vKiBFeHBvcnQgdG8gQ29tbW9uSlNcbiovXG5pZih0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IG5ldC5icmVoYXV0LkNvbG9yO1xufVxuIiwicmVxdWlyZSgnLi9zaGltJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5kaWN0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5pdGVyLWhlbHBlcnMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLiRmb3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLmRlbGF5Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5mdW5jdGlvbi5wYXJ0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5vYmplY3QnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLmFycmF5LnR1cm4nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLm51bWJlci5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUubnVtYmVyLm1hdGgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb3JlLnN0cmluZy5lc2NhcGUtaHRtbCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUuZGF0ZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2NvcmUuZ2xvYmFsJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvY29yZS5sb2cnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tb2R1bGVzLyQnKS5jb3JlOyIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9ICQudG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4O1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyICQgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ID0gcmVxdWlyZSgnLi8kLmN0eCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFKXtcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCgkdGhpcykpXG4gICAgICAsIHNlbGYgICA9ICQuRVM1T2JqZWN0KE8pXG4gICAgICAsIGYgICAgICA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKVxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IEFycmF5KGxlbmd0aCkgOiBJU19GSUxURVIgPyBbXSA6IHVuZGVmaW5lZFxuICAgICAgLCB2YWwsIHJlcztcbiAgICBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpe1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYoVFlQRSl7XG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmKHJlcylzd2l0Y2goVFlQRSl7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59OyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cxLCBtc2cyKXtcbiAgaWYoIWNvbmRpdGlvbil0aHJvdyBUeXBlRXJyb3IobXNnMiA/IG1zZzEgKyBtc2cyIDogbXNnMSk7XG59XG5hc3NlcnQuZGVmID0gJC5hc3NlcnREZWZpbmVkO1xuYXNzZXJ0LmZuID0gZnVuY3Rpb24oaXQpe1xuICBpZighJC5pc0Z1bmN0aW9uKGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuYXNzZXJ0Lm9iaiA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoISQuaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbmFzc2VydC5pbnN0ID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl0aHJvdyBUeXBlRXJyb3IobmFtZSArIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcbiAgcmV0dXJuIGl0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0OyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZW51bUtleXMgPSByZXF1aXJlKCcuLyQuZW51bS1rZXlzJyk7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gIHZhciBUID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0YXJnZXQpKVxuICAgICwgbCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGkgPSAxO1xuICB3aGlsZShsID4gaSl7XG4gICAgdmFyIFMgICAgICA9ICQuRVM1T2JqZWN0KGFyZ3VtZW50c1tpKytdKVxuICAgICAgLCBrZXlzICAgPSBlbnVtS2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKVRba2V5ID0ga2V5c1tqKytdXSA9IFNba2V5XTtcbiAgfVxuICByZXR1cm4gVDtcbn07IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBUQUcgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAsIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5mdW5jdGlvbiBjb2YoaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufVxuY29mLmNsYXNzb2YgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBUO1xuICByZXR1cm4gaXQgPT0gdW5kZWZpbmVkID8gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogJ051bGwnXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1RBR10pID09ICdzdHJpbmcnID8gVCA6IGNvZihPKTtcbn07XG5jb2Yuc2V0ID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICEkLmhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkkLmhpZGUoaXQsIFRBRywgdGFnKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGNvZjsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGN0eCAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgc2FmZSAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzdGVwICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJykuc3RlcFxuICAsICRoYXMgICAgID0gJC5oYXNcbiAgLCBzZXQgICAgICA9ICQuc2V0XG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XG4gICwgaGlkZSAgICAgPSAkLmhpZGVcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgSUQgICAgICAgPSBzYWZlKCdpZCcpXG4gICwgTzEgICAgICAgPSBzYWZlKCdPMScpXG4gICwgTEFTVCAgICAgPSBzYWZlKCdsYXN0JylcbiAgLCBGSVJTVCAgICA9IHNhZmUoJ2ZpcnN0JylcbiAgLCBJVEVSICAgICA9IHNhZmUoJ2l0ZXInKVxuICAsIFNJWkUgICAgID0gJC5ERVNDID8gc2FmZSgnc2l6ZScpIDogJ3NpemUnXG4gICwgaWQgICAgICAgPSAwO1xuXG5mdW5jdGlvbiBmYXN0S2V5KGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoISRoYXMoaXQsIElEKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IGlkIHRvIGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIGlkXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG9iamVjdCBpZFxuICAgIGhpZGUoaXQsIElELCArK2lkKTtcbiAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxuICB9IHJldHVybiAnTycgKyBpdFtJRF07XG59XG5cbmZ1bmN0aW9uIGdldEVudHJ5KHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0W08xXVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IoZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIGFzc2VydC5pbnN0KHRoYXQsIEMsIE5BTUUpO1xuICAgICAgc2V0KHRoYXQsIE8xLCAkLmNyZWF0ZShudWxsKSk7XG4gICAgICBzZXQodGhhdCwgU0laRSwgMCk7XG4gICAgICBzZXQodGhhdCwgTEFTVCwgdW5kZWZpbmVkKTtcbiAgICAgIHNldCh0aGF0LCBGSVJTVCwgdW5kZWZpbmVkKTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVxdWlyZSgnLi8kLm1peCcpKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCl7XG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0W08xXSwgZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXRbRklSU1RdID0gdGhhdFtMQVNUXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZihlbnRyeSl7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0W08xXVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmKHRoYXRbRklSU1RdID09IGVudHJ5KXRoYXRbRklSU1RdID0gbmV4dDtcbiAgICAgICAgICBpZih0aGF0W0xBU1RdID09IGVudHJ5KXRoYXRbTEFTVF0gPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxuICAgICAgICAgICwgZW50cnk7XG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpc1tGSVJTVF0pe1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoJC5ERVNDKSQuc2V0RGVzYyhDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBhc3NlcnQuZGVmKHRoaXNbU0laRV0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSlcbiAgICAgICwgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYoZW50cnkpe1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdFtMQVNUXSA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXRbTEFTVF0sICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYoIXRoYXRbRklSU1RdKXRoYXRbRklSU1RdID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgc2V0SXRlcjogZnVuY3Rpb24oQywgTkFNRSwgSVNfTUFQKXtcbiAgICByZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShDLCBOQU1FLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gICAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiBraW5kfSk7XG4gICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cbiAgICAgICAgLCBraW5kICA9IGl0ZXIua1xuICAgICAgICAsIGVudHJ5ID0gaXRlci5sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZighaXRlci5vIHx8ICEoaXRlci5sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiBpdGVyLm9bRklSU1RdKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycgLCAhSVNfTUFQLCB0cnVlKTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBmb3JPZiA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gICRkZWYoJGRlZi5QLCBOQU1FLCB7XG4gICAgdG9KU09OOiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgIGZvck9mKHRoaXMsIGZhbHNlLCBhcnIucHVzaCwgYXJyKTtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgc2FmZSAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcbiAgLCBhc3NlcnQgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCBmb3JPZiAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCAkaGFzICAgICAgPSAkLmhhc1xuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcbiAgLCBoaWRlICAgICAgPSAkLmhpZGVcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgaWQgICAgICAgID0gMFxuICAsIElEICAgICAgICA9IHNhZmUoJ2lkJylcbiAgLCBXRUFLICAgICAgPSBzYWZlKCd3ZWFrJylcbiAgLCBMRUFLICAgICAgPSBzYWZlKCdsZWFrJylcbiAgLCBtZXRob2QgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpXG4gICwgZmluZCAgICAgID0gbWV0aG9kKDUpXG4gICwgZmluZEluZGV4ID0gbWV0aG9kKDYpO1xuZnVuY3Rpb24gZmluZEZyb3plbihzdG9yZSwga2V5KXtcbiAgcmV0dXJuIGZpbmQoc3RvcmUuYXJyYXksIGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcbiAgfSk7XG59XG4vLyBmYWxsYmFjayBmb3IgZnJvemVuIGtleXNcbmZ1bmN0aW9uIGxlYWtTdG9yZSh0aGF0KXtcbiAgcmV0dXJuIHRoYXRbTEVBS10gfHwgaGlkZSh0aGF0LCBMRUFLLCB7XG4gICAgYXJyYXk6IFtdLFxuICAgIGdldDogZnVuY3Rpb24oa2V5KXtcbiAgICAgIHZhciBlbnRyeSA9IGZpbmRGcm96ZW4odGhpcywga2V5KTtcbiAgICAgIGlmKGVudHJ5KXJldHVybiBlbnRyeVsxXTtcbiAgICB9LFxuICAgIGhhczogZnVuY3Rpb24oa2V5KXtcbiAgICAgIHJldHVybiAhIWZpbmRGcm96ZW4odGhpcywga2V5KTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gICAgICBpZihlbnRyeSllbnRyeVsxXSA9IHZhbHVlO1xuICAgICAgZWxzZSB0aGlzLmFycmF5LnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICB9LFxuICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgdmFyIGluZGV4ID0gZmluZEluZGV4KHRoaXMuYXJyYXksIGZ1bmN0aW9uKGl0KXtcbiAgICAgICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gICAgICB9KTtcbiAgICAgIGlmKH5pbmRleCl0aGlzLmFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICByZXR1cm4gISF+aW5kZXg7XG4gICAgfVxuICB9KVtMRUFLXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgJC5zZXQoYXNzZXJ0Lmluc3QodGhhdCwgQywgTkFNRSksIElELCBpZCsrKTtcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVxdWlyZSgnLi8kLm1peCcpKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuNC4zLjMgV2Vha1NldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIWlzRXh0ZW5zaWJsZShrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcylbJ2RlbGV0ZSddKGtleSk7XG4gICAgICAgIHJldHVybiAkaGFzKGtleSwgV0VBSykgJiYgJGhhcyhrZXlbV0VBS10sIHRoaXNbSURdKSAmJiBkZWxldGUga2V5W1dFQUtdW3RoaXNbSURdXTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuNC4zLjQgV2Vha1NldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZighaXNFeHRlbnNpYmxlKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5oYXMoa2V5KTtcbiAgICAgICAgcmV0dXJuICRoYXMoa2V5LCBXRUFLKSAmJiAkaGFzKGtleVtXRUFLXSwgdGhpc1tJRF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xuICAgIGlmKCFpc0V4dGVuc2libGUoYXNzZXJ0Lm9iaihrZXkpKSl7XG4gICAgICBsZWFrU3RvcmUodGhhdCkuc2V0KGtleSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkaGFzKGtleSwgV0VBSykgfHwgaGlkZShrZXksIFdFQUssIHt9KTtcbiAgICAgIGtleVtXRUFLXVt0aGF0W0lEXV0gPSB2YWx1ZTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBsZWFrU3RvcmU6IGxlYWtTdG9yZSxcbiAgV0VBSzogV0VBSyxcbiAgSUQ6IElEXG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkaXRlciA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBCVUdHWSA9ICRpdGVyLkJVR0dZXG4gICwgZm9yT2YgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBhc3NlcnRJbnN0YW5jZSA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5pbnN0XG4gICwgSU5URVJOQUwgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaW50ZXJuYWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSyl7XG4gIHZhciBCYXNlICA9ICQuZ1tOQU1FXVxuICAgICwgQyAgICAgPSBCYXNlXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcbiAgICAsIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZVxuICAgICwgTyAgICAgPSB7fTtcbiAgaWYoISQuREVTQyB8fCAhJC5pc0Z1bmN0aW9uKEMpIHx8ICEoSVNfV0VBSyB8fCAhQlVHR1kgJiYgcHJvdG8uZm9yRWFjaCAmJiBwcm90by5lbnRyaWVzKSl7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlcXVpcmUoJy4vJC5taXgnKShDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gIH0gZWxzZSB7XG4gICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGFyZ2V0LCBpdGVyYWJsZSl7XG4gICAgICBhc3NlcnRJbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUpO1xuICAgICAgdGFyZ2V0W0lOVEVSTkFMXSA9IG5ldyBCYXNlO1xuICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRhcmdldFtBRERFUl0sIHRhcmdldCk7XG4gICAgfSk7XG4gICAgJC5lYWNoLmNhbGwoJ2FkZCxjbGVhcixkZWxldGUsZm9yRWFjaCxnZXQsaGFzLHNldCxrZXlzLHZhbHVlcyxlbnRyaWVzJy5zcGxpdCgnLCcpLGZ1bmN0aW9uKEtFWSl7XG4gICAgICB2YXIgY2hhaW4gPSBLRVkgPT0gJ2FkZCcgfHwgS0VZID09ICdzZXQnO1xuICAgICAgaWYoS0VZIGluIHByb3RvKSQuaGlkZShDLnByb3RvdHlwZSwgS0VZLCBmdW5jdGlvbihhLCBiKXtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXNbSU5URVJOQUxdW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIGNoYWluID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKCdzaXplJyBpbiBwcm90bykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpc1tJTlRFUk5BTF0uc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlcXVpcmUoJy4vJC5jb2YnKS5zZXQoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRkZWYoJGRlZi5HICsgJGRlZi5XICsgJGRlZi5GLCBPKTtcbiAgcmVxdWlyZSgnLi8kLnNwZWNpZXMnKShDKTtcblxuICBpZighSVNfV0VBSyljb21tb24uc2V0SXRlcihDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTsiLCIvLyBPcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhc3NlcnRGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5mbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFzc2VydEZ1bmN0aW9uKGZuKTtcbiAgaWYofmxlbmd0aCAmJiB0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfSByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgICB9O1xufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZ2xvYmFsICAgICA9ICQuZ1xuICAsIGNvcmUgICAgICAgPSAkLmNvcmVcbiAgLCBpc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uO1xuZnVuY3Rpb24gY3R4KGZuLCB0aGF0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG4vLyB0eXBlIGJpdG1hcFxuJGRlZi5GID0gMTsgIC8vIGZvcmNlZFxuJGRlZi5HID0gMjsgIC8vIGdsb2JhbFxuJGRlZi5TID0gNDsgIC8vIHN0YXRpY1xuJGRlZi5QID0gODsgIC8vIHByb3RvXG4kZGVmLkIgPSAxNjsgLy8gYmluZFxuJGRlZi5XID0gMzI7IC8vIHdyYXBcbmZ1bmN0aW9uICRkZWYodHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cFxuICAgICwgaXNHbG9iYWwgPSB0eXBlICYgJGRlZi5HXG4gICAgLCBpc1Byb3RvICA9IHR5cGUgJiAkZGVmLlBcbiAgICAsIHRhcmdldCAgID0gaXNHbG9iYWwgPyBnbG9iYWwgOiB0eXBlICYgJGRlZi5TXG4gICAgICAgID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSkucHJvdG90eXBlXG4gICAgLCBleHBvcnRzICA9IGlzR2xvYmFsID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIGlmKGlzR2xvYmFsKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhKHR5cGUgJiAkZGVmLkYpICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgaWYoaXNHbG9iYWwgJiYgIWlzRnVuY3Rpb24odGFyZ2V0W2tleV0pKWV4cCA9IHNvdXJjZVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZWxzZSBpZih0eXBlICYgJGRlZi5CICYmIG93billeHAgPSBjdHgob3V0LCBnbG9iYWwpO1xuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgZWxzZSBpZih0eXBlICYgJGRlZi5XICYmIHRhcmdldFtrZXldID09IG91dCkhZnVuY3Rpb24oQyl7XG4gICAgICBleHAgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIGV4cC5wcm90b3R5cGUgPSBDLnByb3RvdHlwZTtcbiAgICB9KG91dCk7XG4gICAgZWxzZSBleHAgPSBpc1Byb3RvICYmIGlzRnVuY3Rpb24ob3V0KSA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydFxuICAgIGV4cG9ydHNba2V5XSA9IGV4cDtcbiAgICBpZihpc1Byb3RvKShleHBvcnRzLnByb3RvdHlwZSB8fCAoZXhwb3J0cy5wcm90b3R5cGUgPSB7fSkpW2tleV0gPSBvdXQ7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gJGRlZjsiLCJ2YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGRvY3VtZW50ID0gJC5nLmRvY3VtZW50XG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldEtleXMoaXQpXG4gICAgLCBnZXREZXNjICAgID0gJC5nZXREZXNjXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xuICBpZihnZXRTeW1ib2xzKSQuZWFjaC5jYWxsKGdldFN5bWJvbHMoaXQpLCBmdW5jdGlvbihrZXkpe1xuICAgIGlmKGdldERlc2MoaXQsIGtleSkuZW51bWVyYWJsZSlrZXlzLnB1c2goa2V5KTtcbiAgfSk7XG4gIHJldHVybiBrZXlzO1xufTsiLCJ2YXIgY3R4ICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGdldCAgPSByZXF1aXJlKCcuLyQuaXRlcicpLmdldFxuICAsIGNhbGwgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCl7XG4gIHZhciBpdGVyYXRvciA9IGdldChpdGVyYWJsZSlcbiAgICAsIGYgICAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBzdGVwO1xuICB3aGlsZSghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpe1xuICAgIGlmKGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpID09PSBmYWxzZSl7XG4gICAgICByZXR1cm4gY2FsbC5jbG9zZShpdGVyYXRvcik7XG4gICAgfVxuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJCl7XG4gICQuRlcgICA9IGZhbHNlO1xuICAkLnBhdGggPSAkLmNvcmU7XG4gIHJldHVybiAkO1xufTsiLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XHJcbnZhciAkID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHRvU3RyaW5nID0ge30udG9TdHJpbmdcclxuICAsIGdldE5hbWVzID0gJC5nZXROYW1lcztcclxuXHJcbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcclxuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcclxuXHJcbmZ1bmN0aW9uIGdldFdpbmRvd05hbWVzKGl0KXtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGdldE5hbWVzKGl0KTtcclxuICB9IGNhdGNoKGUpe1xyXG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcclxuICBpZih3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJylyZXR1cm4gZ2V0V2luZG93TmFtZXMoaXQpO1xyXG4gIHJldHVybiBnZXROYW1lcygkLnRvT2JqZWN0KGl0KSk7XHJcbn07IiwiLy8gRmFzdCBhcHBseVxuLy8gaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCBhcmdzLCB0aGF0KXtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2goYXJncy5sZW5ndGgpe1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICAgIGNhc2UgNTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwidmFyIGFzc2VydE9iamVjdCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5vYmo7XG5mdW5jdGlvbiBjbG9zZShpdGVyYXRvcil7XG4gIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFzc2VydE9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xufVxuZnVuY3Rpb24gY2FsbChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFzc2VydE9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgfSBjYXRjaChlKXtcbiAgICBjbG9zZShpdGVyYXRvcik7XG4gICAgdGhyb3cgZTtcbiAgfVxufVxuY2FsbC5jbG9zZSA9IGNsb3NlO1xubW9kdWxlLmV4cG9ydHMgPSBjYWxsOyIsInZhciAkZGVmICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcmVkZWYgICAgICAgICAgPSByZXF1aXJlKCcuLyQucmVkZWYnKVxuICAsICQgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY29mICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGl0ZXIgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEZGX0lURVJBVE9SICAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgICA9ICd2YWx1ZXMnXG4gICwgSXRlcmF0b3JzICAgICAgID0gJGl0ZXIuSXRlcmF0b3JzO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRSl7XG4gICRpdGVyLmNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIGZ1bmN0aW9uIGNyZWF0ZU1ldGhvZChraW5kKXtcbiAgICBmdW5jdGlvbiAkJCh0aGF0KXtcbiAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhhdCwga2luZCk7XG4gICAgfVxuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuICQkKHRoaXMpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICQkKHRoaXMpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuICQkKHRoaXMpOyB9O1xuICB9XG4gIHZhciBUQUcgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgcHJvdG8gICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgX25hdGl2ZSAgPSBwcm90b1tTWU1CT0xfSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCBfZGVmYXVsdCA9IF9uYXRpdmUgfHwgY3JlYXRlTWV0aG9kKERFRkFVTFQpXG4gICAgLCBtZXRob2RzLCBrZXk7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoX25hdGl2ZSl7XG4gICAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gJC5nZXRQcm90byhfZGVmYXVsdC5jYWxsKG5ldyBCYXNlKSk7XG4gICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgIGNvZi5zZXQoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgLy8gRkYgZml4XG4gICAgaWYoJC5GVyAmJiAkLmhhcyhwcm90bywgRkZfSVRFUkFUT1IpKSRpdGVyLnNldChJdGVyYXRvclByb3RvdHlwZSwgJC50aGF0KTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoJC5GVyB8fCBGT1JDRSkkaXRlci5zZXQocHJvdG8sIF9kZWZhdWx0KTtcbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSBfZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gJC50aGF0O1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAga2V5czogICAgSVNfU0VUICAgICAgICAgICAgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZChLRVlTKSxcbiAgICAgIHZhbHVlczogIERFRkFVTFQgPT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoVkFMVUVTKSxcbiAgICAgIGVudHJpZXM6IERFRkFVTFQgIT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoJ2VudHJpZXMnKVxuICAgIH07XG4gICAgaWYoRk9SQ0UpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSkkcmVkZWYocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAkaXRlci5CVUdHWSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbn07IiwidmFyIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyAgICA9IGZhbHNlO1xudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW1NZTUJPTF9JVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICBpZighU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW1NZTUJPTF9JVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcbiAgICBhcnJbU1lNQk9MX0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIGNsYXNzb2YgICAgICAgICAgID0gY29mLmNsYXNzb2ZcbiAgLCBhc3NlcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxuICAsIGFzc2VydE9iamVjdCAgICAgID0gYXNzZXJ0Lm9ialxuICAsIFNZTUJPTF9JVEVSQVRPUiAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgRkZfSVRFUkFUT1IgICAgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBJdGVyYXRvcnMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5zaGFyZWQnKSgnaXRlcmF0b3JzJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnNldEl0ZXJhdG9yKEl0ZXJhdG9yUHJvdG90eXBlLCAkLnRoYXQpO1xuZnVuY3Rpb24gc2V0SXRlcmF0b3IoTywgdmFsdWUpe1xuICAkLmhpZGUoTywgU1lNQk9MX0lURVJBVE9SLCB2YWx1ZSk7XG4gIC8vIEFkZCBpdGVyYXRvciBmb3IgRkYgaXRlcmF0b3IgcHJvdG9jb2xcbiAgaWYoRkZfSVRFUkFUT1IgaW4gW10pJC5oaWRlKE8sIEZGX0lURVJBVE9SLCB2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gIEJVR0dZOiAna2V5cycgaW4gW10gJiYgISgnbmV4dCcgaW4gW10ua2V5cygpKSxcbiAgSXRlcmF0b3JzOiBJdGVyYXRvcnMsXG4gIHN0ZXA6IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbiAgfSxcbiAgaXM6IGZ1bmN0aW9uKGl0KXtcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KGl0KVxuICAgICAgLCBTeW1ib2wgPSAkLmcuU3ltYm9sO1xuICAgIHJldHVybiAoU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvciB8fCBGRl9JVEVSQVRPUikgaW4gT1xuICAgICAgfHwgU1lNQk9MX0lURVJBVE9SIGluIE9cbiAgICAgIHx8ICQuaGFzKEl0ZXJhdG9ycywgY2xhc3NvZihPKSk7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24oaXQpe1xuICAgIHZhciBTeW1ib2wgPSAkLmcuU3ltYm9sXG4gICAgICAsIGdldEl0ZXI7XG4gICAgaWYoaXQgIT0gdW5kZWZpbmVkKXtcbiAgICAgIGdldEl0ZXIgPSBpdFtTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IEZGX0lURVJBVE9SXVxuICAgICAgICB8fCBpdFtTWU1CT0xfSVRFUkFUT1JdXG4gICAgICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG4gICAgfVxuICAgIGFzc2VydCgkLmlzRnVuY3Rpb24oZ2V0SXRlciksIGl0LCAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgICByZXR1cm4gYXNzZXJ0T2JqZWN0KGdldEl0ZXIuY2FsbChpdCkpO1xuICB9LFxuICBzZXQ6IHNldEl0ZXJhdG9yLFxuICBjcmVhdGU6IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0LCBwcm90byl7XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUocHJvdG8gfHwgSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiAkLmRlc2MoMSwgbmV4dCl9KTtcbiAgICBjb2Yuc2V0KENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpXG4gICwgY29yZSAgID0ge31cbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuICAsIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHlcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vclxuICAsIG1heCAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICA9IE1hdGgubWluO1xuLy8gVGhlIGVuZ2luZSB3b3JrcyBmaW5lIHdpdGggZGVzY3JpcHRvcnM/IFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHkuXG52YXIgREVTQyA9ICEhZnVuY3Rpb24oKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDI7IH19KS5hID09IDI7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn0oKTtcbnZhciBoaWRlID0gY3JlYXRlRGVmaW5lcigxKTtcbi8vIDcuMS40IFRvSW50ZWdlclxuZnVuY3Rpb24gdG9JbnRlZ2VyKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59XG5mdW5jdGlvbiBkZXNjKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn1cbmZ1bmN0aW9uIHNpbXBsZVNldChvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufVxuZnVuY3Rpb24gY3JlYXRlRGVmaW5lcihiaXRtYXApe1xuICByZXR1cm4gREVTQyA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgZGVzYyhiaXRtYXAsIHZhbHVlKSk7XG4gIH0gOiBzaW1wbGVTZXQ7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGl0KXtcbiAgcmV0dXJuIGl0ICE9PSBudWxsICYmICh0eXBlb2YgaXQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGl0ID09ICdmdW5jdGlvbicpO1xufVxuZnVuY3Rpb24gaXNGdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFzc2VydERlZmluZWQoaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59XG5cbnZhciAkID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZncnKSh7XG4gIGc6IGdsb2JhbCxcbiAgY29yZTogY29yZSxcbiAgaHRtbDogZ2xvYmFsLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vY29yZS1qcy1pc29iamVjdFxuICBpc09iamVjdDogICBpc09iamVjdCxcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgdGhhdDogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gNy4xLjQgVG9JbnRlZ2VyXG4gIHRvSW50ZWdlcjogdG9JbnRlZ2VyLFxuICAvLyA3LjEuMTUgVG9MZW5ndGhcbiAgdG9MZW5ndGg6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxuICB9LFxuICB0b0luZGV4OiBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gICAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG4gIH0sXG4gIGhhczogZnVuY3Rpb24oaXQsIGtleSl7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG4gIH0sXG4gIGNyZWF0ZTogICAgIE9iamVjdC5jcmVhdGUsXG4gIGdldFByb3RvOiAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgREVTQzogICAgICAgREVTQyxcbiAgZGVzYzogICAgICAgZGVzYyxcbiAgZ2V0RGVzYzogICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgc2V0RGVzYzogICAgZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuICBnZXRLZXlzOiAgICBPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gIGFzc2VydERlZmluZWQ6IGFzc2VydERlZmluZWQsXG4gIC8vIER1bW15LCBmaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgaW4gZXM1IG1vZHVsZVxuICBFUzVPYmplY3Q6IE9iamVjdCxcbiAgdG9PYmplY3Q6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gJC5FUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xuICB9LFxuICBoaWRlOiBoaWRlLFxuICBkZWY6IGNyZWF0ZURlZmluZXIoMCksXG4gIHNldDogZ2xvYmFsLlN5bWJvbCA/IHNpbXBsZVNldCA6IGhpZGUsXG4gIGVhY2g6IFtdLmZvckVhY2hcbn0pO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbmlmKHR5cGVvZiBfX2UgIT0gJ3VuZGVmaW5lZCcpX19lID0gY29yZTtcbmlmKHR5cGVvZiBfX2cgIT0gJ3VuZGVmaW5lZCcpX19nID0gZ2xvYmFsOyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsInZhciAkcmVkZWYgPSByZXF1aXJlKCcuLyQucmVkZWYnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYyl7XHJcbiAgZm9yKHZhciBrZXkgaW4gc3JjKSRyZWRlZih0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn07IiwidmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgYXNzZXJ0T2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9iajtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3duS2V5cyhpdCl7XG4gIGFzc2VydE9iamVjdChpdCk7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXROYW1lcyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHM7XG4gIHJldHVybiBnZXRTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0U3ltYm9scyhpdCkpIDoga2V5cztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaW52b2tlID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgYXNzZXJ0RnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuZm47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKC8qIC4uLnBhcmdzICovKXtcbiAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXG4gICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBwYXJncyAgPSBBcnJheShsZW5ndGgpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBfICAgICAgPSAkLnBhdGguX1xuICAgICwgaG9sZGVyID0gZmFsc2U7XG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKHBhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgdGhhdCAgICA9IHRoaXNcbiAgICAgICwgX2xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgaiA9IDAsIGsgPSAwLCBhcmdzO1xuICAgIGlmKCFob2xkZXIgJiYgIV9sZW5ndGgpcmV0dXJuIGludm9rZShmbiwgcGFyZ3MsIHRoYXQpO1xuICAgIGFyZ3MgPSBwYXJncy5zbGljZSgpO1xuICAgIGlmKGhvbGRlcilmb3IoO2xlbmd0aCA+IGo7IGorKylpZihhcmdzW2pdID09PSBfKWFyZ3Nbal0gPSBhcmd1bWVudHNbaysrXTtcbiAgICB3aGlsZShfbGVuZ3RoID4gaylhcmdzLnB1c2goYXJndW1lbnRzW2srK10pO1xuICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJCcpLmhpZGU7IiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZWdFeHAsIHJlcGxhY2UsIGlzU3RhdGljKXtcbiAgdmFyIHJlcGxhY2VyID0gcmVwbGFjZSA9PT0gT2JqZWN0KHJlcGxhY2UpID8gZnVuY3Rpb24ocGFydCl7XG4gICAgcmV0dXJuIHJlcGxhY2VbcGFydF07XG4gIH0gOiByZXBsYWNlO1xuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBTdHJpbmcoaXNTdGF0aWMgPyBpdCA6IHRoaXMpLnJlcGxhY2UocmVnRXhwLCByZXBsYWNlcik7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmlzIHx8IGZ1bmN0aW9uIGlzKHgsIHkpe1xyXG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xyXG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGFzc2VydCA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKTtcbmZ1bmN0aW9uIGNoZWNrKE8sIHByb3RvKXtcbiAgYXNzZXJ0Lm9iaihPKTtcbiAgYXNzZXJ0KHByb3RvID09PSBudWxsIHx8ICQuaXNPYmplY3QocHJvdG8pLCBwcm90bywgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgPyBmdW5jdGlvbihidWdneSwgc2V0KXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgJC5nZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICAgIHNldCh7fSwgW10pO1xuICAgICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgICAgcmV0dXJuIE87XG4gICAgICAgIH07XG4gICAgICB9KClcbiAgICA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTsiLCJ2YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXHJcbiAgLCBzdG9yZSAgPSAkLmdbU0hBUkVEXSB8fCAoJC5nW1NIQVJFRF0gPSB7fSk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcclxuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcclxufTsiLCJ2YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDKXtcbiAgaWYoJC5ERVNDICYmICEoU1BFQ0lFUyBpbiBDKSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6ICQudGhhdFxuICB9KTtcbn07IiwiLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9ICQudG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGxcbiAgICAgIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwiLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9c3RyYXdtYW46c3RyaW5nX3BhZGRpbmdcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHJlcGVhdCA9IHJlcXVpcmUoJy4vJC5zdHJpbmctcmVwZWF0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGhhdCwgbWluTGVuZ3RoLCBmaWxsQ2hhciwgbGVmdCl7XG4gIC8vIDEuIExldCBPIGJlIENoZWNrT2JqZWN0Q29lcmNpYmxlKHRoaXMgdmFsdWUpLlxuICAvLyAyLiBMZXQgUyBiZSBUb1N0cmluZyhPKS5cbiAgdmFyIFMgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoYXQpKTtcbiAgLy8gNC4gSWYgaW50TWluTGVuZ3RoIGlzIHVuZGVmaW5lZCwgcmV0dXJuIFMuXG4gIGlmKG1pbkxlbmd0aCA9PT0gdW5kZWZpbmVkKXJldHVybiBTO1xuICAvLyA0LiBMZXQgaW50TWluTGVuZ3RoIGJlIFRvSW50ZWdlcihtaW5MZW5ndGgpLlxuICB2YXIgaW50TWluTGVuZ3RoID0gJC50b0ludGVnZXIobWluTGVuZ3RoKTtcbiAgLy8gNS4gTGV0IGZpbGxMZW4gYmUgdGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIGluIFMgbWludXMgaW50TWluTGVuZ3RoLlxuICB2YXIgZmlsbExlbiA9IGludE1pbkxlbmd0aCAtIFMubGVuZ3RoO1xuICAvLyA2LiBJZiBmaWxsTGVuIDwgMCwgdGhlbiB0aHJvdyBhIFJhbmdlRXJyb3IgZXhjZXB0aW9uLlxuICAvLyA3LiBJZiBmaWxsTGVuIGlzICviiJ4sIHRoZW4gdGhyb3cgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbi5cbiAgaWYoZmlsbExlbiA8IDAgfHwgZmlsbExlbiA9PT0gSW5maW5pdHkpe1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdDYW5ub3Qgc2F0aXNmeSBzdHJpbmcgbGVuZ3RoICcgKyBtaW5MZW5ndGggKyAnIGZvciBzdHJpbmc6ICcgKyBTKTtcbiAgfVxuICAvLyA4LiBMZXQgc0ZpbGxTdHIgYmUgdGhlIHN0cmluZyByZXByZXNlbnRlZCBieSBmaWxsU3RyLlxuICAvLyA5LiBJZiBzRmlsbFN0ciBpcyB1bmRlZmluZWQsIGxldCBzRmlsbFN0ciBiZSBhIHNwYWNlIGNoYXJhY3Rlci5cbiAgdmFyIHNGaWxsU3RyID0gZmlsbENoYXIgPT09IHVuZGVmaW5lZCA/ICcgJyA6IFN0cmluZyhmaWxsQ2hhcik7XG4gIC8vIDEwLiBMZXQgc0ZpbGxWYWwgYmUgYSBTdHJpbmcgbWFkZSBvZiBzRmlsbFN0ciwgcmVwZWF0ZWQgdW50aWwgZmlsbExlbiBpcyBtZXQuXG4gIHZhciBzRmlsbFZhbCA9IHJlcGVhdC5jYWxsKHNGaWxsU3RyLCBNYXRoLmNlaWwoZmlsbExlbiAvIHNGaWxsU3RyLmxlbmd0aCkpO1xuICAvLyB0cnVuY2F0ZSBpZiB3ZSBvdmVyZmxvd2VkXG4gIGlmKHNGaWxsVmFsLmxlbmd0aCA+IGZpbGxMZW4pc0ZpbGxWYWwgPSBsZWZ0XG4gICAgPyBzRmlsbFZhbC5zbGljZShzRmlsbFZhbC5sZW5ndGggLSBmaWxsTGVuKVxuICAgIDogc0ZpbGxWYWwuc2xpY2UoMCwgZmlsbExlbik7XG4gIC8vIDExLiBSZXR1cm4gYSBzdHJpbmcgbWFkZSBmcm9tIHNGaWxsVmFsLCBmb2xsb3dlZCBieSBTLlxuICAvLyAxMS4gUmV0dXJuIGEgU3RyaW5nIG1hZGUgZnJvbSBTLCBmb2xsb3dlZCBieSBzRmlsbFZhbC5cbiAgcmV0dXJuIGxlZnQgPyBzRmlsbFZhbC5jb25jYXQoUykgOiBTLmNvbmNhdChzRmlsbFZhbCk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVwZWF0KGNvdW50KXtcbiAgdmFyIHN0ciA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXG4gICAgLCByZXMgPSAnJ1xuICAgICwgbiAgID0gJC50b0ludGVnZXIoY291bnQpO1xuICBpZihuIDwgMCB8fCBuID09IEluZmluaXR5KXRocm93IFJhbmdlRXJyb3IoXCJDb3VudCBjYW4ndCBiZSBuZWdhdGl2ZVwiKTtcbiAgZm9yKDtuID4gMDsgKG4gPj4+PSAxKSAmJiAoc3RyICs9IHN0cikpaWYobiAmIDEpcmVzICs9IHN0cjtcbiAgcmV0dXJuIHJlcztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY29mICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgaW52b2tlID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgY2VsICAgID0gcmVxdWlyZSgnLi8kLmRvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9ICQuZ1xuICAsIGlzRnVuY3Rpb24gICAgICAgICA9ICQuaXNGdW5jdGlvblxuICAsIGh0bWwgICAgICAgICAgICAgICA9ICQuaHRtbFxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG5mdW5jdGlvbiBydW4oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKCQuaGFzKHF1ZXVlLCBpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGxpc3RuZXIoZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn1cbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmKCFpc0Z1bmN0aW9uKHNldFRhc2spIHx8ICFpc0Z1bmN0aW9uKGNsZWFyVGFzaykpe1xuICBzZXRUYXNrID0gZnVuY3Rpb24oZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UoaXNGdW5jdGlvbihmbikgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24oaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihjb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBNb2Rlcm4gYnJvd3NlcnMsIHNraXAgaW1wbGVtZW50YXRpb24gZm9yIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgb2JqZWN0XG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiBpc0Z1bmN0aW9uKGdsb2JhbC5wb3N0TWVzc2FnZSkgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCwgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdG5lciwgZmFsc2UpO1xuICAvLyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihpc0Z1bmN0aW9uKE1lc3NhZ2VDaGFubmVsKSl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBzaWQgPSAwO1xuZnVuY3Rpb24gdWlkKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK3NpZCArIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KSk7XG59XG51aWQuc2FmZSA9IHJlcXVpcmUoJy4vJCcpLmcuU3ltYm9sIHx8IHVpZDtcbm1vZHVsZS5leHBvcnRzID0gdWlkOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kJykuZ1xuICAsIHN0b3JlICA9IHJlcXVpcmUoJy4vJC5zaGFyZWQnKSgnd2tzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBnbG9iYWwuU3ltYm9sICYmIGdsb2JhbC5TeW1ib2xbbmFtZV0gfHwgcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIHNhZmUgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkaXRlciAgID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIGZvck9mICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBFTlRSSUVTID0gc2FmZSgnZW50cmllcycpXG4gICwgRk4gICAgICA9IHNhZmUoJ2ZuJylcbiAgLCBJVEVSICAgID0gc2FmZSgnaXRlcicpXG4gICwgY2FsbCAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKVxuICAsIGdldEl0ZXJhdG9yICAgID0gJGl0ZXIuZ2V0XG4gICwgc2V0SXRlcmF0b3IgICAgPSAkaXRlci5zZXRcbiAgLCBjcmVhdGVJdGVyYXRvciA9ICRpdGVyLmNyZWF0ZTtcbmZ1bmN0aW9uICRmb3IoaXRlcmFibGUsIGVudHJpZXMpe1xuICBpZighKHRoaXMgaW5zdGFuY2VvZiAkZm9yKSlyZXR1cm4gbmV3ICRmb3IoaXRlcmFibGUsIGVudHJpZXMpO1xuICB0aGlzW0lURVJdICAgID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpO1xuICB0aGlzW0VOVFJJRVNdID0gISFlbnRyaWVzO1xufVxuXG5jcmVhdGVJdGVyYXRvcigkZm9yLCAnV3JhcHBlcicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0aGlzW0lURVJdLm5leHQoKTtcbn0pO1xudmFyICRmb3JQcm90byA9ICRmb3IucHJvdG90eXBlO1xuc2V0SXRlcmF0b3IoJGZvclByb3RvLCBmdW5jdGlvbigpe1xuICByZXR1cm4gdGhpc1tJVEVSXTsgLy8gdW53cmFwXG59KTtcblxuZnVuY3Rpb24gY3JlYXRlQ2hhaW5JdGVyYXRvcihuZXh0KXtcbiAgZnVuY3Rpb24gSXRlcmF0b3IoaXRlciwgZm4sIHRoYXQpe1xuICAgIHRoaXNbSVRFUl0gICAgPSBnZXRJdGVyYXRvcihpdGVyKTtcbiAgICB0aGlzW0VOVFJJRVNdID0gaXRlcltFTlRSSUVTXTtcbiAgICB0aGlzW0ZOXSAgICAgID0gY3R4KGZuLCB0aGF0LCBpdGVyW0VOVFJJRVNdID8gMiA6IDEpO1xuICB9XG4gIGNyZWF0ZUl0ZXJhdG9yKEl0ZXJhdG9yLCAnQ2hhaW4nLCBuZXh0LCAkZm9yUHJvdG8pO1xuICBzZXRJdGVyYXRvcihJdGVyYXRvci5wcm90b3R5cGUsICQudGhhdCk7IC8vIG92ZXJyaWRlICRmb3JQcm90byBpdGVyYXRvclxuICByZXR1cm4gSXRlcmF0b3I7XG59XG5cbnZhciBNYXBJdGVyID0gY3JlYXRlQ2hhaW5JdGVyYXRvcihmdW5jdGlvbigpe1xuICB2YXIgc3RlcCA9IHRoaXNbSVRFUl0ubmV4dCgpO1xuICByZXR1cm4gc3RlcC5kb25lXG4gICAgPyBzdGVwXG4gICAgOiAkaXRlci5zdGVwKDAsIGNhbGwodGhpc1tJVEVSXSwgdGhpc1tGTl0sIHN0ZXAudmFsdWUsIHRoaXNbRU5UUklFU10pKTtcbn0pO1xuXG52YXIgRmlsdGVySXRlciA9IGNyZWF0ZUNoYWluSXRlcmF0b3IoZnVuY3Rpb24oKXtcbiAgZm9yKDs7KXtcbiAgICB2YXIgc3RlcCA9IHRoaXNbSVRFUl0ubmV4dCgpO1xuICAgIGlmKHN0ZXAuZG9uZSB8fCBjYWxsKHRoaXNbSVRFUl0sIHRoaXNbRk5dLCBzdGVwLnZhbHVlLCB0aGlzW0VOVFJJRVNdKSlyZXR1cm4gc3RlcDtcbiAgfVxufSk7XG5cbnJlcXVpcmUoJy4vJC5taXgnKSgkZm9yUHJvdG8sIHtcbiAgb2Y6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcbiAgICBmb3JPZih0aGlzLCB0aGlzW0VOVFJJRVNdLCBmbiwgdGhhdCk7XG4gIH0sXG4gIGFycmF5OiBmdW5jdGlvbihmbiwgdGhhdCl7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvck9mKGZuICE9IHVuZGVmaW5lZCA/IHRoaXMubWFwKGZuLCB0aGF0KSA6IHRoaXMsIGZhbHNlLCByZXN1bHQucHVzaCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBmaWx0ZXI6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcbiAgICByZXR1cm4gbmV3IEZpbHRlckl0ZXIodGhpcywgZm4sIHRoYXQpO1xuICB9LFxuICBtYXA6IGZ1bmN0aW9uKGZuLCB0aGF0KXtcbiAgICByZXR1cm4gbmV3IE1hcEl0ZXIodGhpcywgZm4sIHRoYXQpO1xuICB9XG59KTtcblxuJGZvci5pc0l0ZXJhYmxlICA9ICRpdGVyLmlzO1xuJGZvci5nZXRJdGVyYXRvciA9IGdldEl0ZXJhdG9yO1xuXG4kZGVmKCRkZWYuRyArICRkZWYuRiwgeyRmb3I6ICRmb3J9KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgYXNzZXJ0RnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuZm47XG4kZGVmKCRkZWYuUCArICRkZWYuRiwgJ0FycmF5Jywge1xuICB0dXJuOiBmdW5jdGlvbihmbiwgdGFyZ2V0IC8qID0gW10gKi8pe1xuICAgIGFzc2VydEZ1bmN0aW9uKGZuKTtcbiAgICB2YXIgbWVtbyAgID0gdGFyZ2V0ID09IHVuZGVmaW5lZCA/IFtdIDogT2JqZWN0KHRhcmdldClcbiAgICAgICwgTyAgICAgID0gJC5FUzVPYmplY3QodGhpcylcbiAgICAgICwgbGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gMDtcbiAgICB3aGlsZShsZW5ndGggPiBpbmRleClpZihmbihtZW1vLCBPW2luZGV4XSwgaW5kZXgrKywgdGhpcykgPT09IGZhbHNlKWJyZWFrO1xuICAgIHJldHVybiBtZW1vO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ3R1cm4nKTsiLCJ2YXIgJCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBjb3JlICAgICAgICAgPSAkLmNvcmVcbiAgLCBmb3JtYXRSZWdFeHAgPSAvXFxiXFx3XFx3P1xcYi9nXG4gICwgZmxleGlvUmVnRXhwID0gLzooLiopXFx8KC4qKSQvXG4gICwgbG9jYWxlcyAgICAgID0ge31cbiAgLCBjdXJyZW50ICAgICAgPSAnZW4nXG4gICwgU0VDT05EUyAgICAgID0gJ1NlY29uZHMnXG4gICwgTUlOVVRFUyAgICAgID0gJ01pbnV0ZXMnXG4gICwgSE9VUlMgICAgICAgID0gJ0hvdXJzJ1xuICAsIERBVEUgICAgICAgICA9ICdEYXRlJ1xuICAsIE1PTlRIICAgICAgICA9ICdNb250aCdcbiAgLCBZRUFSICAgICAgICAgPSAnRnVsbFllYXInO1xuZnVuY3Rpb24gbHoobnVtKXtcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XG59XG5mdW5jdGlvbiBjcmVhdGVGb3JtYXQocHJlZml4KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRlbXBsYXRlLCBsb2NhbGUgLyogPSBjdXJyZW50ICovKXtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICwgZGljdCA9IGxvY2FsZXNbJC5oYXMobG9jYWxlcywgbG9jYWxlKSA/IGxvY2FsZSA6IGN1cnJlbnRdO1xuICAgIGZ1bmN0aW9uIGdldCh1bml0KXtcbiAgICAgIHJldHVybiB0aGF0W3ByZWZpeCArIHVuaXRdKCk7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcodGVtcGxhdGUpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbihwYXJ0KXtcbiAgICAgIHN3aXRjaChwYXJ0KXtcbiAgICAgICAgY2FzZSAncycgIDogcmV0dXJuIGdldChTRUNPTkRTKTsgICAgICAgICAgICAgICAgICAvLyBTZWNvbmRzIDogMC01OVxuICAgICAgICBjYXNlICdzcycgOiByZXR1cm4gbHooZ2V0KFNFQ09ORFMpKTsgICAgICAgICAgICAgIC8vIFNlY29uZHMgOiAwMC01OVxuICAgICAgICBjYXNlICdtJyAgOiByZXR1cm4gZ2V0KE1JTlVURVMpOyAgICAgICAgICAgICAgICAgIC8vIE1pbnV0ZXMgOiAwLTU5XG4gICAgICAgIGNhc2UgJ21tJyA6IHJldHVybiBseihnZXQoTUlOVVRFUykpOyAgICAgICAgICAgICAgLy8gTWludXRlcyA6IDAwLTU5XG4gICAgICAgIGNhc2UgJ2gnICA6IHJldHVybiBnZXQoSE9VUlMpOyAgICAgICAgICAgICAgICAgICAgLy8gSG91cnMgICA6IDAtMjNcbiAgICAgICAgY2FzZSAnaGgnIDogcmV0dXJuIGx6KGdldChIT1VSUykpOyAgICAgICAgICAgICAgICAvLyBIb3VycyAgIDogMDAtMjNcbiAgICAgICAgY2FzZSAnRCcgIDogcmV0dXJuIGdldChEQVRFKTsgICAgICAgICAgICAgICAgICAgICAvLyBEYXRlICAgIDogMS0zMVxuICAgICAgICBjYXNlICdERCcgOiByZXR1cm4gbHooZ2V0KERBVEUpKTsgICAgICAgICAgICAgICAgIC8vIERhdGUgICAgOiAwMS0zMVxuICAgICAgICBjYXNlICdXJyAgOiByZXR1cm4gZGljdFswXVtnZXQoJ0RheScpXTsgICAgICAgICAgIC8vIERheSAgICAgOiDQn9C+0L3QtdC00LXQu9GM0L3QuNC6XG4gICAgICAgIGNhc2UgJ04nICA6IHJldHVybiBnZXQoTU9OVEgpICsgMTsgICAgICAgICAgICAgICAgLy8gTW9udGggICA6IDEtMTJcbiAgICAgICAgY2FzZSAnTk4nIDogcmV0dXJuIGx6KGdldChNT05USCkgKyAxKTsgICAgICAgICAgICAvLyBNb250aCAgIDogMDEtMTJcbiAgICAgICAgY2FzZSAnTScgIDogcmV0dXJuIGRpY3RbMl1bZ2V0KE1PTlRIKV07ICAgICAgICAgICAvLyBNb250aCAgIDog0K/QvdCy0LDRgNGMXG4gICAgICAgIGNhc2UgJ01NJyA6IHJldHVybiBkaWN0WzFdW2dldChNT05USCldOyAgICAgICAgICAgLy8gTW9udGggICA6INCv0L3QstCw0YDRj1xuICAgICAgICBjYXNlICdZJyAgOiByZXR1cm4gZ2V0KFlFQVIpOyAgICAgICAgICAgICAgICAgICAgIC8vIFllYXIgICAgOiAyMDE0XG4gICAgICAgIGNhc2UgJ1lZJyA6IHJldHVybiBseihnZXQoWUVBUikgJSAxMDApOyAgICAgICAgICAgLy8gWWVhciAgICA6IDE0XG4gICAgICB9IHJldHVybiBwYXJ0O1xuICAgIH0pO1xuICB9O1xufVxuZnVuY3Rpb24gYWRkTG9jYWxlKGxhbmcsIGxvY2FsZSl7XG4gIGZ1bmN0aW9uIHNwbGl0KGluZGV4KXtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgJC5lYWNoLmNhbGwobG9jYWxlLm1vbnRocy5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XG4gICAgICByZXN1bHQucHVzaChpdC5yZXBsYWNlKGZsZXhpb1JlZ0V4cCwgJyQnICsgaW5kZXgpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGxvY2FsZXNbbGFuZ10gPSBbbG9jYWxlLndlZWtkYXlzLnNwbGl0KCcsJyksIHNwbGl0KDEpLCBzcGxpdCgyKV07XG4gIHJldHVybiBjb3JlO1xufVxuJGRlZigkZGVmLlAgKyAkZGVmLkYsIERBVEUsIHtcbiAgZm9ybWF0OiAgICBjcmVhdGVGb3JtYXQoJ2dldCcpLFxuICBmb3JtYXRVVEM6IGNyZWF0ZUZvcm1hdCgnZ2V0VVRDJylcbn0pO1xuYWRkTG9jYWxlKGN1cnJlbnQsIHtcbiAgd2Vla2RheXM6ICdTdW5kYXksTW9uZGF5LFR1ZXNkYXksV2VkbmVzZGF5LFRodXJzZGF5LEZyaWRheSxTYXR1cmRheScsXG4gIG1vbnRoczogJ0phbnVhcnksRmVicnVhcnksTWFyY2gsQXByaWwsTWF5LEp1bmUsSnVseSxBdWd1c3QsU2VwdGVtYmVyLE9jdG9iZXIsTm92ZW1iZXIsRGVjZW1iZXInXG59KTtcbmFkZExvY2FsZSgncnUnLCB7XG4gIHdlZWtkYXlzOiAn0JLQvtGB0LrRgNC10YHQtdC90YzQtSzQn9C+0L3QtdC00LXQu9GM0L3QuNC6LNCS0YLQvtGA0L3QuNC6LNCh0YDQtdC00LAs0KfQtdGC0LLQtdGA0LMs0J/Rj9GC0L3QuNGG0LAs0KHRg9Cx0LHQvtGC0LAnLFxuICBtb250aHM6ICfQr9C90LLQsNGAOtGPfNGMLNCk0LXQstGA0LDQuzrRj3zRjCzQnNCw0YDRgjrQsHws0JDQv9GA0LXQuzrRj3zRjCzQnNCwOtGPfNC5LNCY0Y7QvTrRj3zRjCwnICtcbiAgICAgICAgICAn0JjRjtC7OtGPfNGMLNCQ0LLQs9GD0YHRgjrQsHws0KHQtdC90YLRj9Cx0YA60Y980Yws0J7QutGC0Y/QsdGAOtGPfNGMLNCd0L7Rj9Cx0YA60Y980Yws0JTQtdC60LDQsdGAOtGPfNGMJ1xufSk7XG5jb3JlLmxvY2FsZSA9IGZ1bmN0aW9uKGxvY2FsZSl7XG4gIHJldHVybiAkLmhhcyhsb2NhbGVzLCBsb2NhbGUpID8gY3VycmVudCA9IGxvY2FsZSA6IGN1cnJlbnQ7XG59O1xuY29yZS5hZGRMb2NhbGUgPSBhZGRMb2NhbGU7IiwidmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBwYXJ0aWFsID0gcmVxdWlyZSgnLi8kLnBhcnRpYWwnKTtcbi8vIGh0dHBzOi8vZXNkaXNjdXNzLm9yZy90b3BpYy9wcm9taXNlLXJldHVybmluZy1kZWxheS1mdW5jdGlvblxuJGRlZigkZGVmLkcgKyAkZGVmLkYsIHtcbiAgZGVsYXk6IGZ1bmN0aW9uKHRpbWUpe1xuICAgIHJldHVybiBuZXcgKCQuY29yZS5Qcm9taXNlIHx8ICQuZy5Qcm9taXNlKShmdW5jdGlvbihyZXNvbHZlKXtcbiAgICAgIHNldFRpbWVvdXQocGFydGlhbC5jYWxsKHJlc29sdmUsIHRydWUpLCB0aW1lKTtcbiAgICB9KTtcbiAgfVxufSk7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgYXNzaWduICAgPSByZXF1aXJlKCcuLyQuYXNzaWduJylcbiAgLCBrZXlPZiAgICA9IHJlcXVpcmUoJy4vJC5rZXlvZicpXG4gICwgSVRFUiAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXG4gICwgYXNzZXJ0ICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCAkaXRlciAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcbiAgLCBmb3JPZiAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIHN0ZXAgICAgID0gJGl0ZXIuc3RlcFxuICAsIGdldEtleXMgID0gJC5nZXRLZXlzXG4gICwgdG9PYmplY3QgPSAkLnRvT2JqZWN0XG4gICwgaGFzICAgICAgPSAkLmhhcztcblxuZnVuY3Rpb24gRGljdChpdGVyYWJsZSl7XG4gIHZhciBkaWN0ID0gJC5jcmVhdGUobnVsbCk7XG4gIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCl7XG4gICAgaWYoJGl0ZXIuaXMoaXRlcmFibGUpKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCB0cnVlLCBmdW5jdGlvbihrZXksIHZhbHVlKXtcbiAgICAgICAgZGljdFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgYXNzaWduKGRpY3QsIGl0ZXJhYmxlKTtcbiAgfVxuICByZXR1cm4gZGljdDtcbn1cbkRpY3QucHJvdG90eXBlID0gbnVsbDtcblxuZnVuY3Rpb24gRGljdEl0ZXJhdG9yKGl0ZXJhdGVkLCBraW5kKXtcbiAgJC5zZXQodGhpcywgSVRFUiwge286IHRvT2JqZWN0KGl0ZXJhdGVkKSwgYTogZ2V0S2V5cyhpdGVyYXRlZCksIGk6IDAsIGs6IGtpbmR9KTtcbn1cbiRpdGVyLmNyZWF0ZShEaWN0SXRlcmF0b3IsICdEaWN0JywgZnVuY3Rpb24oKXtcbiAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXG4gICAgLCBPICAgID0gaXRlci5vXG4gICAgLCBrZXlzID0gaXRlci5hXG4gICAgLCBraW5kID0gaXRlci5rXG4gICAgLCBrZXk7XG4gIGRvIHtcbiAgICBpZihpdGVyLmkgPj0ga2V5cy5sZW5ndGgpe1xuICAgICAgaXRlci5vID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgfVxuICB9IHdoaWxlKCFoYXMoTywga2V5ID0ga2V5c1tpdGVyLmkrK10pKTtcbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBrZXkpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9ba2V5XSk7XG4gIHJldHVybiBzdGVwKDAsIFtrZXksIE9ba2V5XV0pO1xufSk7XG5mdW5jdGlvbiBjcmVhdGVEaWN0SXRlcihraW5kKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gbmV3IERpY3RJdGVyYXRvcihpdCwga2luZCk7XG4gIH07XG59XG5mdW5jdGlvbiBnZW5lcmljKEEsIEIpe1xuICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxuICByZXR1cm4gdHlwZW9mIEEgPT0gJ2Z1bmN0aW9uJyA/IEEgOiBCO1xufVxuXG4vLyAwIC0+IERpY3QuZm9yRWFjaFxuLy8gMSAtPiBEaWN0Lm1hcFxuLy8gMiAtPiBEaWN0LmZpbHRlclxuLy8gMyAtPiBEaWN0LnNvbWVcbi8vIDQgLT4gRGljdC5ldmVyeVxuLy8gNSAtPiBEaWN0LmZpbmRcbi8vIDYgLT4gRGljdC5maW5kS2V5XG4vLyA3IC0+IERpY3QubWFwUGFpcnNcbmZ1bmN0aW9uIGNyZWF0ZURpY3RNZXRob2QoVFlQRSl7XG4gIHZhciBJU19NQVAgICA9IFRZUEUgPT0gMVxuICAgICwgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGNhbGxiYWNrZm4sIHRoYXQgLyogPSB1bmRlZmluZWQgKi8pe1xuICAgIHZhciBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMylcbiAgICAgICwgTyAgICAgID0gdG9PYmplY3Qob2JqZWN0KVxuICAgICAgLCByZXN1bHQgPSBJU19NQVAgfHwgVFlQRSA9PSA3IHx8IFRZUEUgPT0gMiA/IG5ldyAoZ2VuZXJpYyh0aGlzLCBEaWN0KSkgOiB1bmRlZmluZWRcbiAgICAgICwga2V5LCB2YWwsIHJlcztcbiAgICBmb3Ioa2V5IGluIE8paWYoaGFzKE8sIGtleSkpe1xuICAgICAgdmFsID0gT1trZXldO1xuICAgICAgcmVzID0gZih2YWwsIGtleSwgb2JqZWN0KTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2tleV0gPSByZXM7ICAgICAgICAgICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdFtrZXldID0gdmFsOyBicmVhazsgICAgIC8vIGZpbHRlclxuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGtleTsgICAgICAgICAgICAgICAgICAgLy8gZmluZEtleVxuICAgICAgICAgIGNhc2UgNzogcmVzdWx0W3Jlc1swXV0gPSByZXNbMV07ICAgICAgLy8gbWFwUGFpcnNcbiAgICAgICAgfSBlbHNlIGlmKElTX0VWRVJZKXJldHVybiBmYWxzZTsgICAgICAgIC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBUWVBFID09IDMgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn1cblxuLy8gdHJ1ZSAgLT4gRGljdC50dXJuXG4vLyBmYWxzZSAtPiBEaWN0LnJlZHVjZVxuZnVuY3Rpb24gY3JlYXRlRGljdFJlZHVjZShJU19UVVJOKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgbWFwZm4sIGluaXQpe1xuICAgIGFzc2VydC5mbihtYXBmbik7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KG9iamVjdClcbiAgICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBpICAgICAgPSAwXG4gICAgICAsIG1lbW8sIGtleSwgcmVzdWx0O1xuICAgIGlmKElTX1RVUk4pe1xuICAgICAgbWVtbyA9IGluaXQgPT0gdW5kZWZpbmVkID8gbmV3IChnZW5lcmljKHRoaXMsIERpY3QpKSA6IE9iamVjdChpbml0KTtcbiAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDMpe1xuICAgICAgYXNzZXJ0KGxlbmd0aCwgJ1JlZHVjZSBvZiBlbXB0eSBvYmplY3Qgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICBtZW1vID0gT1trZXlzW2krK11dO1xuICAgIH0gZWxzZSBtZW1vID0gT2JqZWN0KGluaXQpO1xuICAgIHdoaWxlKGxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IGtleXNbaSsrXSkpe1xuICAgICAgcmVzdWx0ID0gbWFwZm4obWVtbywgT1trZXldLCBrZXksIG9iamVjdCk7XG4gICAgICBpZihJU19UVVJOKXtcbiAgICAgICAgaWYocmVzdWx0ID09PSBmYWxzZSlicmVhaztcbiAgICAgIH0gZWxzZSBtZW1vID0gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcbn1cbnZhciBmaW5kS2V5ID0gY3JlYXRlRGljdE1ldGhvZCg2KTtcblxuJGRlZigkZGVmLkcgKyAkZGVmLkYsIHtEaWN0OiBEaWN0fSk7XG5cbiRkZWYoJGRlZi5TLCAnRGljdCcsIHtcbiAga2V5czogICAgIGNyZWF0ZURpY3RJdGVyKCdrZXlzJyksXG4gIHZhbHVlczogICBjcmVhdGVEaWN0SXRlcigndmFsdWVzJyksXG4gIGVudHJpZXM6ICBjcmVhdGVEaWN0SXRlcignZW50cmllcycpLFxuICBmb3JFYWNoOiAgY3JlYXRlRGljdE1ldGhvZCgwKSxcbiAgbWFwOiAgICAgIGNyZWF0ZURpY3RNZXRob2QoMSksXG4gIGZpbHRlcjogICBjcmVhdGVEaWN0TWV0aG9kKDIpLFxuICBzb21lOiAgICAgY3JlYXRlRGljdE1ldGhvZCgzKSxcbiAgZXZlcnk6ICAgIGNyZWF0ZURpY3RNZXRob2QoNCksXG4gIGZpbmQ6ICAgICBjcmVhdGVEaWN0TWV0aG9kKDUpLFxuICBmaW5kS2V5OiAgZmluZEtleSxcbiAgbWFwUGFpcnM6IGNyZWF0ZURpY3RNZXRob2QoNyksXG4gIHJlZHVjZTogICBjcmVhdGVEaWN0UmVkdWNlKGZhbHNlKSxcbiAgdHVybjogICAgIGNyZWF0ZURpY3RSZWR1Y2UodHJ1ZSksXG4gIGtleU9mOiAgICBrZXlPZixcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICAgIHJldHVybiAoZWwgPT0gZWwgPyBrZXlPZihvYmplY3QsIGVsKSA6IGZpbmRLZXkob2JqZWN0LCBmdW5jdGlvbihpdCl7XG4gICAgICByZXR1cm4gaXQgIT0gaXQ7XG4gICAgfSkpICE9PSB1bmRlZmluZWQ7XG4gIH0sXG4gIC8vIEhhcyAvIGdldCAvIHNldCBvd24gcHJvcGVydHlcbiAgaGFzOiBoYXMsXG4gIGdldDogZnVuY3Rpb24ob2JqZWN0LCBrZXkpe1xuICAgIGlmKGhhcyhvYmplY3QsIGtleSkpcmV0dXJuIG9iamVjdFtrZXldO1xuICB9LFxuICBzZXQ6ICQuZGVmLFxuICBpc0RpY3Q6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gJC5pc09iamVjdChpdCkgJiYgJC5nZXRQcm90byhpdCkgPT09IERpY3QucHJvdG90eXBlO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcblxuLy8gUGxhY2Vob2xkZXJcbiQuY29yZS5fID0gJC5wYXRoLl8gPSAkLnBhdGguXyB8fCB7fTtcblxuJGRlZigkZGVmLlAgKyAkZGVmLkYsICdGdW5jdGlvbicsIHtcbiAgcGFydDogcmVxdWlyZSgnLi8kLnBhcnRpYWwnKVxufSk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuRyArICRkZWYuRiwge2dsb2JhbDogcmVxdWlyZSgnLi8kJykuZ30pOyIsInZhciBjb3JlICA9IHJlcXVpcmUoJy4vJCcpLmNvcmVcbiAgLCAkaXRlciA9IHJlcXVpcmUoJy4vJC5pdGVyJyk7XG5jb3JlLmlzSXRlcmFibGUgID0gJGl0ZXIuaXM7XG5jb3JlLmdldEl0ZXJhdG9yID0gJGl0ZXIuZ2V0OyIsInZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgbG9nICA9IHt9XG4gICwgZW5hYmxlZCA9IHRydWU7XG4vLyBNZXRob2RzIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0RldmVsb3BlclRvb2xzV0cvY29uc29sZS1vYmplY3QvYmxvYi9tYXN0ZXIvYXBpLm1kXG4kLmVhY2guY2FsbCgoJ2Fzc2VydCxjbGVhcixjb3VudCxkZWJ1ZyxkaXIsZGlyeG1sLGVycm9yLGV4Y2VwdGlvbiwnICtcbiAgICAnZ3JvdXAsZ3JvdXBDb2xsYXBzZWQsZ3JvdXBFbmQsaW5mbyxpc0luZGVwZW5kZW50bHlDb21wb3NlZCxsb2csJyArXG4gICAgJ21hcmtUaW1lbGluZSxwcm9maWxlLHByb2ZpbGVFbmQsdGFibGUsdGltZSx0aW1lRW5kLHRpbWVsaW5lLCcgK1xuICAgICd0aW1lbGluZUVuZCx0aW1lU3RhbXAsdHJhY2Usd2FybicpLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGtleSl7XG4gIGxvZ1trZXldID0gZnVuY3Rpb24oKXtcbiAgICBpZihlbmFibGVkICYmICQuZy5jb25zb2xlICYmICQuaXNGdW5jdGlvbihjb25zb2xlW2tleV0pKXtcbiAgICAgIHJldHVybiBGdW5jdGlvbi5hcHBseS5jYWxsKGNvbnNvbGVba2V5XSwgY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59KTtcbiRkZWYoJGRlZi5HICsgJGRlZi5GLCB7bG9nOiByZXF1aXJlKCcuLyQuYXNzaWduJykobG9nLmxvZywgbG9nLCB7XG4gIGVuYWJsZTogZnVuY3Rpb24oKXtcbiAgICBlbmFibGVkID0gdHJ1ZTtcbiAgfSxcbiAgZGlzYWJsZTogZnVuY3Rpb24oKXtcbiAgICBlbmFibGVkID0gZmFsc2U7XG4gIH1cbn0pfSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIElURVIgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpO1xuXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShOdW1iZXIsICdOdW1iZXInLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gICQuc2V0KHRoaXMsIElURVIsIHtsOiAkLnRvTGVuZ3RoKGl0ZXJhdGVkKSwgaTogMH0pO1xufSwgZnVuY3Rpb24oKXtcbiAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXG4gICAgLCBpICAgID0gaXRlci5pKytcbiAgICAsIGRvbmUgPSBpID49IGl0ZXIubDtcbiAgcmV0dXJuIHtkb25lOiBkb25lLCB2YWx1ZTogZG9uZSA/IHVuZGVmaW5lZCA6IGl9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBpbnZva2UgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgbWV0aG9kcyA9IHt9O1xuXG5tZXRob2RzLnJhbmRvbSA9IGZ1bmN0aW9uKGxpbSAvKiA9IDAgKi8pe1xuICB2YXIgYSA9ICt0aGlzXG4gICAgLCBiID0gbGltID09IHVuZGVmaW5lZCA/IDAgOiArbGltXG4gICAgLCBtID0gTWF0aC5taW4oYSwgYik7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogKE1hdGgubWF4KGEsIGIpIC0gbSkgKyBtO1xufTtcblxuaWYoJC5GVykkLmVhY2guY2FsbCgoXG4gICAgLy8gRVMzOlxuICAgICdyb3VuZCxmbG9vcixjZWlsLGFicyxzaW4sYXNpbixjb3MsYWNvcyx0YW4sYXRhbixleHAsc3FydCxtYXgsbWluLHBvdyxhdGFuMiwnICtcbiAgICAvLyBFUzY6XG4gICAgJ2Fjb3NoLGFzaW5oLGF0YW5oLGNicnQsY2x6MzIsY29zaCxleHBtMSxoeXBvdCxpbXVsLGxvZzFwLGxvZzEwLGxvZzIsc2lnbixzaW5oLHRhbmgsdHJ1bmMnXG4gICkuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcbiAgICB2YXIgZm4gPSBNYXRoW2tleV07XG4gICAgaWYoZm4pbWV0aG9kc1trZXldID0gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgICAvLyBpZTktIGRvbnQgc3VwcG9ydCBzdHJpY3QgbW9kZSAmIGNvbnZlcnQgYHRoaXNgIHRvIG9iamVjdCAtPiBjb252ZXJ0IGl0IHRvIG51bWJlclxuICAgICAgdmFyIGFyZ3MgPSBbK3RoaXNdXG4gICAgICAgICwgaSAgICA9IDA7XG4gICAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgICAgcmV0dXJuIGludm9rZShmbiwgYXJncyk7XG4gICAgfTtcbiAgfVxuKTtcblxuJGRlZigkZGVmLlAgKyAkZGVmLkYsICdOdW1iZXInLCBtZXRob2RzKTsiLCJ2YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIG93bktleXMgPSByZXF1aXJlKCcuLyQub3duLWtleXMnKTtcbmZ1bmN0aW9uIGRlZmluZSh0YXJnZXQsIG1peGluKXtcbiAgdmFyIGtleXMgICA9IG93bktleXMoJC50b09iamVjdChtaXhpbikpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaSkkLnNldERlc2ModGFyZ2V0LCBrZXkgPSBrZXlzW2krK10sICQuZ2V0RGVzYyhtaXhpbiwga2V5KSk7XG4gIHJldHVybiB0YXJnZXQ7XG59XG4kZGVmKCRkZWYuUyArICRkZWYuRiwgJ09iamVjdCcsIHtcbiAgaXNPYmplY3Q6ICQuaXNPYmplY3QsXG4gIGNsYXNzb2Y6IHJlcXVpcmUoJy4vJC5jb2YnKS5jbGFzc29mLFxuICBkZWZpbmU6IGRlZmluZSxcbiAgbWFrZTogZnVuY3Rpb24ocHJvdG8sIG1peGluKXtcbiAgICByZXR1cm4gZGVmaW5lKCQuY3JlYXRlKHByb3RvKSwgbWl4aW4pO1xuICB9XG59KTsiLCJ2YXIgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCByZXBsYWNlciA9IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpO1xudmFyIGVzY2FwZUhUTUxEaWN0ID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJmFwb3M7J1xufSwgdW5lc2NhcGVIVE1MRGljdCA9IHt9LCBrZXk7XG5mb3Ioa2V5IGluIGVzY2FwZUhUTUxEaWN0KXVuZXNjYXBlSFRNTERpY3RbZXNjYXBlSFRNTERpY3Rba2V5XV0gPSBrZXk7XG4kZGVmKCRkZWYuUCArICRkZWYuRiwgJ1N0cmluZycsIHtcbiAgZXNjYXBlSFRNTDogICByZXBsYWNlcigvWyY8PlwiJ10vZywgZXNjYXBlSFRNTERpY3QpLFxuICB1bmVzY2FwZUhUTUw6IHJlcGxhY2VyKC8mKD86YW1wfGx0fGd0fHF1b3R8YXBvcyk7L2csIHVuZXNjYXBlSFRNTERpY3QpXG59KTsiLCJ2YXIgJCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY2VsICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBjb2YgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGRlZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGludm9rZSAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcbiAgLCBhcnJheU1ldGhvZCAgICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxuICAsIElFX1BST1RPICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnX19wcm90b19fJylcbiAgLCBhc3NlcnQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXG4gICwgYXNzZXJ0T2JqZWN0ICAgICA9IGFzc2VydC5vYmpcbiAgLCBPYmplY3RQcm90byAgICAgID0gT2JqZWN0LnByb3RvdHlwZVxuICAsIGh0bWwgICAgICAgICAgICAgPSAkLmh0bWxcbiAgLCBBICAgICAgICAgICAgICAgID0gW11cbiAgLCBfc2xpY2UgICAgICAgICAgID0gQS5zbGljZVxuICAsIF9qb2luICAgICAgICAgICAgPSBBLmpvaW5cbiAgLCBjbGFzc29mICAgICAgICAgID0gY29mLmNsYXNzb2ZcbiAgLCBoYXMgICAgICAgICAgICAgID0gJC5oYXNcbiAgLCBkZWZpbmVQcm9wZXJ0eSAgID0gJC5zZXREZXNjXG4gICwgZ2V0T3duRGVzY3JpcHRvciA9ICQuZ2V0RGVzY1xuICAsIGRlZmluZVByb3BlcnRpZXMgPSAkLnNldERlc2NzXG4gICwgaXNGdW5jdGlvbiAgICAgICA9ICQuaXNGdW5jdGlvblxuICAsIGlzT2JqZWN0ICAgICAgICAgPSAkLmlzT2JqZWN0XG4gICwgdG9PYmplY3QgICAgICAgICA9ICQudG9PYmplY3RcbiAgLCB0b0xlbmd0aCAgICAgICAgID0gJC50b0xlbmd0aFxuICAsIHRvSW5kZXggICAgICAgICAgPSAkLnRvSW5kZXhcbiAgLCBJRThfRE9NX0RFRklORSAgID0gZmFsc2VcbiAgLCAkaW5kZXhPZiAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgJGZvckVhY2ggICAgICAgICA9IGFycmF5TWV0aG9kKDApXG4gICwgJG1hcCAgICAgICAgICAgICA9IGFycmF5TWV0aG9kKDEpXG4gICwgJGZpbHRlciAgICAgICAgICA9IGFycmF5TWV0aG9kKDIpXG4gICwgJHNvbWUgICAgICAgICAgICA9IGFycmF5TWV0aG9kKDMpXG4gICwgJGV2ZXJ5ICAgICAgICAgICA9IGFycmF5TWV0aG9kKDQpO1xuXG5pZighJC5ERVNDKXtcbiAgdHJ5IHtcbiAgICBJRThfRE9NX0RFRklORSA9IGRlZmluZVByb3BlcnR5KGNlbCgnZGl2JyksICd4JyxcbiAgICAgIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA4OyB9fVxuICAgICkueCA9PSA4O1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gICQuc2V0RGVzYyA9IGZ1bmN0aW9uKE8sIFAsIEF0dHJpYnV0ZXMpe1xuICAgIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICAgIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICAgIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylhc3NlcnRPYmplY3QoTylbUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICAgIHJldHVybiBPO1xuICB9O1xuICAkLmdldERlc2MgPSBmdW5jdGlvbihPLCBQKXtcbiAgICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgICAgcmV0dXJuIGdldE93bkRlc2NyaXB0b3IoTywgUCk7XG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICAgIGlmKGhhcyhPLCBQKSlyZXR1cm4gJC5kZXNjKCFPYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKE8sIFApLCBPW1BdKTtcbiAgfTtcbiAgJC5zZXREZXNjcyA9IGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihPLCBQcm9wZXJ0aWVzKXtcbiAgICBhc3NlcnRPYmplY3QoTyk7XG4gICAgdmFyIGtleXMgICA9ICQuZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBpID0gMFxuICAgICAgLCBQO1xuICAgIHdoaWxlKGxlbmd0aCA+IGkpJC5zZXREZXNjKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICAgIHJldHVybiBPO1xuICB9O1xufVxuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhJC5ERVNDLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuNiAvIDE1LjIuMy4zIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkLmdldERlc2MsXG4gIC8vIDE5LjEuMi40IC8gMTUuMi4zLjYgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkLnNldERlc2MsXG4gIC8vIDE5LjEuMi4zIC8gMTUuMi4zLjcgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogZGVmaW5lUHJvcGVydGllc1xufSk7XG5cbiAgLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xudmFyIGtleXMxID0gKCdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLCcgK1xuICAgICAgICAgICAgJ3RvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnKS5zcGxpdCgnLCcpXG4gIC8vIEFkZGl0aW9uYWwga2V5cyBmb3IgZ2V0T3duUHJvcGVydHlOYW1lc1xuICAsIGtleXMyID0ga2V5czEuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJylcbiAgLCBrZXlzTGVuMSA9IGtleXMxLmxlbmd0aDtcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGNlbCgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGtleXNMZW4xXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZSgnPHNjcmlwdD5kb2N1bWVudC5GPU9iamVjdDwvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdC5wcm90b3R5cGVba2V5czFbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcbmZ1bmN0aW9uIGNyZWF0ZUdldEtleXMobmFtZXMsIGxlbmd0aCl7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXG4gICAgICAsIGkgICAgICA9IDBcbiAgICAgICwgcmVzdWx0ID0gW11cbiAgICAgICwga2V5O1xuICAgIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gICAgd2hpbGUobGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgICAgfiRpbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuZnVuY3Rpb24gRW1wdHkoKXt9XG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbiAgZ2V0UHJvdG90eXBlT2Y6ICQuZ2V0UHJvdG8gPSAkLmdldFByb3RvIHx8IGZ1bmN0aW9uKE8pe1xuICAgIE8gPSBPYmplY3QoYXNzZXJ0LmRlZihPKSk7XG4gICAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gICAgaWYoaXNGdW5jdGlvbihPLmNvbnN0cnVjdG9yKSAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcil7XG4gICAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbiAgfSxcbiAgLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkLmdldE5hbWVzID0gJC5nZXROYW1lcyB8fCBjcmVhdGVHZXRLZXlzKGtleXMyLCBrZXlzMi5sZW5ndGgsIHRydWUpLFxuICAvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkLmNyZWF0ZSA9ICQuY3JlYXRlIHx8IGZ1bmN0aW9uKE8sIC8qPyovUHJvcGVydGllcyl7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZihPICE9PSBudWxsKXtcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IGFzc2VydE9iamVjdChPKTtcbiAgICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcbiAgICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2Ygc2hpbVxuICAgICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gICAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xuICB9LFxuICAvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbiAga2V5czogJC5nZXRLZXlzID0gJC5nZXRLZXlzIHx8IGNyZWF0ZUdldEtleXMoa2V5czEsIGtleXNMZW4xLCBmYWxzZSksXG4gIC8vIDE5LjEuMi4xNyAvIDE1LjIuMy44IE9iamVjdC5zZWFsKE8pXG4gIHNlYWw6IGZ1bmN0aW9uIHNlYWwoaXQpe1xuICAgIHJldHVybiBpdDsgLy8gPC0gY2FwXG4gIH0sXG4gIC8vIDE5LjEuMi41IC8gMTUuMi4zLjkgT2JqZWN0LmZyZWV6ZShPKVxuICBmcmVlemU6IGZ1bmN0aW9uIGZyZWV6ZShpdCl7XG4gICAgcmV0dXJuIGl0OyAvLyA8LSBjYXBcbiAgfSxcbiAgLy8gMTkuMS4yLjE1IC8gMTUuMi4zLjEwIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhPKVxuICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMoaXQpe1xuICAgIHJldHVybiBpdDsgLy8gPC0gY2FwXG4gIH0sXG4gIC8vIDE5LjEuMi4xMyAvIDE1LjIuMy4xMSBPYmplY3QuaXNTZWFsZWQoTylcbiAgaXNTZWFsZWQ6IGZ1bmN0aW9uIGlzU2VhbGVkKGl0KXtcbiAgICByZXR1cm4gIWlzT2JqZWN0KGl0KTsgLy8gPC0gY2FwXG4gIH0sXG4gIC8vIDE5LjEuMi4xMiAvIDE1LjIuMy4xMiBPYmplY3QuaXNGcm96ZW4oTylcbiAgaXNGcm96ZW46IGZ1bmN0aW9uIGlzRnJvemVuKGl0KXtcbiAgICByZXR1cm4gIWlzT2JqZWN0KGl0KTsgLy8gPC0gY2FwXG4gIH0sXG4gIC8vIDE5LjEuMi4xMSAvIDE1LjIuMy4xMyBPYmplY3QuaXNFeHRlbnNpYmxlKE8pXG4gIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24gaXNFeHRlbnNpYmxlKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpOyAvLyA8LSBjYXBcbiAgfVxufSk7XG5cbi8vIDE5LjIuMy4yIC8gMTUuMy40LjUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQodGhpc0FyZywgYXJncy4uLilcbiRkZWYoJGRlZi5QLCAnRnVuY3Rpb24nLCB7XG4gIGJpbmQ6IGZ1bmN0aW9uKHRoYXQgLyosIGFyZ3MuLi4gKi8pe1xuICAgIHZhciBmbiAgICAgICA9IGFzc2VydC5mbih0aGlzKVxuICAgICAgLCBwYXJ0QXJncyA9IF9zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgZnVuY3Rpb24gYm91bmQoLyogYXJncy4uLiAqLyl7XG4gICAgICB2YXIgYXJncyAgID0gcGFydEFyZ3MuY29uY2F0KF9zbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICwgY29uc3RyID0gdGhpcyBpbnN0YW5jZW9mIGJvdW5kXG4gICAgICAgICwgY3R4ICAgID0gY29uc3RyID8gJC5jcmVhdGUoZm4ucHJvdG90eXBlKSA6IHRoYXRcbiAgICAgICAgLCByZXN1bHQgPSBpbnZva2UoZm4sIGFyZ3MsIGN0eCk7XG4gICAgICByZXR1cm4gY29uc3RyID8gY3R4IDogcmVzdWx0O1xuICAgIH1cbiAgICBpZihmbi5wcm90b3R5cGUpYm91bmQucHJvdG90eXBlID0gZm4ucHJvdG90eXBlO1xuICAgIHJldHVybiBib3VuZDtcbiAgfVxufSk7XG5cbi8vIEZpeCBmb3Igbm90IGFycmF5LWxpa2UgRVMzIHN0cmluZyBhbmQgRE9NIG9iamVjdHNcbmlmKCEoMCBpbiBPYmplY3QoJ3onKSAmJiAneidbMF0gPT0gJ3onKSl7XG4gICQuRVM1T2JqZWN0ID0gZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbiAgfTtcbn1cblxudmFyIGJ1Z2d5U2xpY2UgPSB0cnVlO1xudHJ5IHtcbiAgaWYoaHRtbClfc2xpY2UuY2FsbChodG1sKTtcbiAgYnVnZ3lTbGljZSA9IGZhbHNlO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG4kZGVmKCRkZWYuUCArICRkZWYuRiAqIGJ1Z2d5U2xpY2UsICdBcnJheScsIHtcbiAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKGJlZ2luLCBlbmQpe1xuICAgIHZhciBsZW4gICA9IHRvTGVuZ3RoKHRoaXMubGVuZ3RoKVxuICAgICAgLCBrbGFzcyA9IGNvZih0aGlzKTtcbiAgICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IGVuZDtcbiAgICBpZihrbGFzcyA9PSAnQXJyYXknKXJldHVybiBfc2xpY2UuY2FsbCh0aGlzLCBiZWdpbiwgZW5kKTtcbiAgICB2YXIgc3RhcnQgID0gdG9JbmRleChiZWdpbiwgbGVuKVxuICAgICAgLCB1cFRvICAgPSB0b0luZGV4KGVuZCwgbGVuKVxuICAgICAgLCBzaXplICAgPSB0b0xlbmd0aCh1cFRvIC0gc3RhcnQpXG4gICAgICAsIGNsb25lZCA9IEFycmF5KHNpemUpXG4gICAgICAsIGkgICAgICA9IDA7XG4gICAgZm9yKDsgaSA8IHNpemU7IGkrKyljbG9uZWRbaV0gPSBrbGFzcyA9PSAnU3RyaW5nJ1xuICAgICAgPyB0aGlzLmNoYXJBdChzdGFydCArIGkpXG4gICAgICA6IHRoaXNbc3RhcnQgKyBpXTtcbiAgICByZXR1cm4gY2xvbmVkO1xuICB9XG59KTtcblxuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAoJC5FUzVPYmplY3QgIT0gT2JqZWN0KSwgJ0FycmF5Jywge1xuICBqb2luOiBmdW5jdGlvbiBqb2luKCl7XG4gICAgcmV0dXJuIF9qb2luLmFwcGx5KCQuRVM1T2JqZWN0KHRoaXMpLCBhcmd1bWVudHMpO1xuICB9XG59KTtcblxuLy8gMjIuMS4yLjIgLyAxNS40LjMuMiBBcnJheS5pc0FycmF5KGFyZylcbiRkZWYoJGRlZi5TLCAnQXJyYXknLCB7XG4gIGlzQXJyYXk6IGZ1bmN0aW9uKGFyZyl7XG4gICAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG4gIH1cbn0pO1xuZnVuY3Rpb24gY3JlYXRlQXJyYXlSZWR1Y2UoaXNSaWdodCl7XG4gIHJldHVybiBmdW5jdGlvbihjYWxsYmFja2ZuLCBtZW1vKXtcbiAgICBhc3NlcnQuZm4oY2FsbGJhY2tmbik7XG4gICAgdmFyIE8gICAgICA9IHRvT2JqZWN0KHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSBpc1JpZ2h0ID8gbGVuZ3RoIC0gMSA6IDBcbiAgICAgICwgaSAgICAgID0gaXNSaWdodCA/IC0xIDogMTtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoIDwgMilmb3IoOzspe1xuICAgICAgaWYoaW5kZXggaW4gTyl7XG4gICAgICAgIG1lbW8gPSBPW2luZGV4XTtcbiAgICAgICAgaW5kZXggKz0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpbmRleCArPSBpO1xuICAgICAgYXNzZXJ0KGlzUmlnaHQgPyBpbmRleCA+PSAwIDogbGVuZ3RoID4gaW5kZXgsICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgfVxuICAgIGZvcig7aXNSaWdodCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleDsgaW5kZXggKz0gaSlpZihpbmRleCBpbiBPKXtcbiAgICAgIG1lbW8gPSBjYWxsYmFja2ZuKG1lbW8sIE9baW5kZXhdLCBpbmRleCwgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9O1xufVxuJGRlZigkZGVmLlAsICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjEwIC8gMTUuNC40LjE4IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIGZvckVhY2g6ICQuZWFjaCA9ICQuZWFjaCB8fCBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmb3JFYWNoKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy4xNSAvIDE1LjQuNC4xOSBBcnJheS5wcm90b3R5cGUubWFwKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIG1hcDogZnVuY3Rpb24gbWFwKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRtYXAodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfSxcbiAgLy8gMjIuMS4zLjcgLyAxNS40LjQuMjAgQXJyYXkucHJvdG90eXBlLmZpbHRlcihjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgIHJldHVybiAkZmlsdGVyKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy4yMyAvIDE1LjQuNC4xNyBBcnJheS5wcm90b3R5cGUuc29tZShjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBzb21lOiBmdW5jdGlvbiBzb21lKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRzb21lKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy41IC8gMTUuNC40LjE2IEFycmF5LnByb3RvdHlwZS5ldmVyeShjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBldmVyeTogZnVuY3Rpb24gZXZlcnkoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGV2ZXJ5KHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH0sXG4gIC8vIDIyLjEuMy4xOCAvIDE1LjQuNC4yMSBBcnJheS5wcm90b3R5cGUucmVkdWNlKGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcbiAgcmVkdWNlOiBjcmVhdGVBcnJheVJlZHVjZShmYWxzZSksXG4gIC8vIDIyLjEuMy4xOSAvIDE1LjQuNC4yMiBBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHQoY2FsbGJhY2tmbiBbLCBpbml0aWFsVmFsdWVdKVxuICByZWR1Y2VSaWdodDogY3JlYXRlQXJyYXlSZWR1Y2UodHJ1ZSksXG4gIC8vIDIyLjEuMy4xMSAvIDE1LjQuNC4xNCBBcnJheS5wcm90b3R5cGUuaW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXG4gIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2YoZWwgLyosIGZyb21JbmRleCA9IDAgKi8pe1xuICAgIHJldHVybiAkaW5kZXhPZih0aGlzLCBlbCwgYXJndW1lbnRzWzFdKTtcbiAgfSxcbiAgLy8gMjIuMS4zLjE0IC8gMTUuNC40LjE1IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXG4gIGxhc3RJbmRleE9mOiBmdW5jdGlvbihlbCwgZnJvbUluZGV4IC8qID0gQFsqLTFdICovKXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QodGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IGxlbmd0aCAtIDE7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA+IDEpaW5kZXggPSBNYXRoLm1pbihpbmRleCwgJC50b0ludGVnZXIoZnJvbUluZGV4KSk7XG4gICAgaWYoaW5kZXggPCAwKWluZGV4ID0gdG9MZW5ndGgobGVuZ3RoICsgaW5kZXgpO1xuICAgIGZvcig7aW5kZXggPj0gMDsgaW5kZXgtLSlpZihpbmRleCBpbiBPKWlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gaW5kZXg7XG4gICAgcmV0dXJuIC0xO1xuICB9XG59KTtcblxuLy8gMjEuMS4zLjI1IC8gMTUuNS40LjIwIFN0cmluZy5wcm90b3R5cGUudHJpbSgpXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHt0cmltOiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvXlxccyooW1xcc1xcU10qXFxTKT9cXHMqJC8sICckMScpfSk7XG5cbi8vIDIwLjMuMy4xIC8gMTUuOS40LjQgRGF0ZS5ub3coKVxuJGRlZigkZGVmLlMsICdEYXRlJywge25vdzogZnVuY3Rpb24oKXtcbiAgcmV0dXJuICtuZXcgRGF0ZTtcbn19KTtcblxuZnVuY3Rpb24gbHoobnVtKXtcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XG59XG5cbi8vIDIwLjMuNC4zNiAvIDE1LjkuNS40MyBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZygpXG4vLyBQaGFudG9tSlMgYW5kIG9sZCB3ZWJraXQgaGFkIGEgYnJva2VuIERhdGUgaW1wbGVtZW50YXRpb24uXG52YXIgZGF0ZSAgICAgICA9IG5ldyBEYXRlKC01ZTEzIC0gMSlcbiAgLCBicm9rZW5EYXRlID0gIShkYXRlLnRvSVNPU3RyaW5nICYmIGRhdGUudG9JU09TdHJpbmcoKSA9PSAnMDM4NS0wNy0yNVQwNzowNjozOS45OTlaJ1xuICAgICAgJiYgcmVxdWlyZSgnLi8kLnRocm93cycpKGZ1bmN0aW9uKCl7IG5ldyBEYXRlKE5hTikudG9JU09TdHJpbmcoKTsgfSkpO1xuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiBicm9rZW5EYXRlLCAnRGF0ZScsIHt0b0lTT1N0cmluZzogZnVuY3Rpb24oKXtcbiAgaWYoIWlzRmluaXRlKHRoaXMpKXRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgdGltZSB2YWx1ZScpO1xuICB2YXIgZCA9IHRoaXNcbiAgICAsIHkgPSBkLmdldFVUQ0Z1bGxZZWFyKClcbiAgICAsIG0gPSBkLmdldFVUQ01pbGxpc2Vjb25kcygpXG4gICAgLCBzID0geSA8IDAgPyAnLScgOiB5ID4gOTk5OSA/ICcrJyA6ICcnO1xuICByZXR1cm4gcyArICgnMDAwMDAnICsgTWF0aC5hYnMoeSkpLnNsaWNlKHMgPyAtNiA6IC00KSArXG4gICAgJy0nICsgbHooZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgKyBseihkLmdldFVUQ0RhdGUoKSkgK1xuICAgICdUJyArIGx6KGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBseihkLmdldFVUQ01pbnV0ZXMoKSkgK1xuICAgICc6JyArIGx6KGQuZ2V0VVRDU2Vjb25kcygpKSArICcuJyArIChtID4gOTkgPyBtIDogJzAnICsgbHoobSkpICsgJ1onO1xufX0pO1xuXG5pZihjbGFzc29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ09iamVjdCcpY29mLmNsYXNzb2YgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0YWcgPSBjbGFzc29mKGl0KTtcbiAgcmV0dXJuIHRhZyA9PSAnT2JqZWN0JyAmJiBpc0Z1bmN0aW9uKGl0LmNhbGxlZSkgPyAnQXJndW1lbnRzJyA6IHRhZztcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCB0b0luZGV4ID0gJC50b0luZGV4O1xuJGRlZigkZGVmLlAsICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXG4gIGNvcHlXaXRoaW46IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0LyogPSAwICovLCBzdGFydCAvKiA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xuICAgIHZhciBPICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGhpcykpXG4gICAgICAsIGxlbiAgID0gJC50b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgdG8gICAgPSB0b0luZGV4KHRhcmdldCwgbGVuKVxuICAgICAgLCBmcm9tICA9IHRvSW5kZXgoc3RhcnQsIGxlbilcbiAgICAgICwgZW5kICAgPSBhcmd1bWVudHNbMl1cbiAgICAgICwgZmluICAgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IHRvSW5kZXgoZW5kLCBsZW4pXG4gICAgICAsIGNvdW50ID0gTWF0aC5taW4oZmluIC0gZnJvbSwgbGVuIC0gdG8pXG4gICAgICAsIGluYyAgID0gMTtcbiAgICBpZihmcm9tIDwgdG8gJiYgdG8gPCBmcm9tICsgY291bnQpe1xuICAgICAgaW5jICA9IC0xO1xuICAgICAgZnJvbSA9IGZyb20gKyBjb3VudCAtIDE7XG4gICAgICB0byAgID0gdG8gICArIGNvdW50IC0gMTtcbiAgICB9XG4gICAgd2hpbGUoY291bnQtLSA+IDApe1xuICAgICAgaWYoZnJvbSBpbiBPKU9bdG9dID0gT1tmcm9tXTtcbiAgICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xuICAgICAgdG8gICArPSBpbmM7XG4gICAgICBmcm9tICs9IGluYztcbiAgICB9IHJldHVybiBPO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2NvcHlXaXRoaW4nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHRvSW5kZXggPSAkLnRvSW5kZXg7XG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbiAgZmlsbDogZnVuY3Rpb24gZmlsbCh2YWx1ZSAvKiwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcbiAgICAgICwgbGVuZ3RoID0gJC50b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aClcbiAgICAgICwgZW5kICAgID0gYXJndW1lbnRzWzJdXG4gICAgICAsIGVuZFBvcyA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbmRleChlbmQsIGxlbmd0aCk7XG4gICAgd2hpbGUoZW5kUG9zID4gaW5kZXgpT1tpbmRleCsrXSA9IHZhbHVlO1xuICAgIHJldHVybiBPO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2ZpbGwnKTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMi4xLjMuOSBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbnZhciBLRVkgICAgPSAnZmluZEluZGV4J1xuICAsICRkZWYgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGZvcmNlZCA9IHRydWVcbiAgLCAkZmluZCAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpKDYpO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmKEtFWSBpbiBbXSlBcnJheSgxKVtLRVldKGZ1bmN0aW9uKCl7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmRJbmRleDogZnVuY3Rpb24gZmluZEluZGV4KGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xucmVxdWlyZSgnLi8kLnVuc2NvcGUnKShLRVkpOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbnZhciBLRVkgICAgPSAnZmluZCdcbiAgLCAkZGVmICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBmb3JjZWQgPSB0cnVlXG4gICwgJGZpbmQgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKSg1KTtcbi8vIFNob3VsZG4ndCBza2lwIGhvbGVzXG5pZihLRVkgaW4gW10pQXJyYXkoMSlbS0VZXShmdW5jdGlvbigpeyBmb3JjZWQgPSBmYWxzZTsgfSk7XG4kZGVmKCRkZWYuUCArICRkZWYuRiAqIGZvcmNlZCwgJ0FycmF5Jywge1xuICBmaW5kOiBmdW5jdGlvbiBmaW5kKGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xucmVxdWlyZSgnLi8kLnVuc2NvcGUnKShLRVkpOyIsInZhciAkICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIGNhbGwgID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpO1xuJGRlZigkZGVmLlMgKyAkZGVmLkYgKiAhcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UvKiwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQqLyl7XG4gICAgdmFyIE8gICAgICAgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKGFycmF5TGlrZSkpXG4gICAgICAsIG1hcGZuICAgPSBhcmd1bWVudHNbMV1cbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgZiAgICAgICA9IG1hcHBpbmcgPyBjdHgobWFwZm4sIGFyZ3VtZW50c1syXSwgMikgOiB1bmRlZmluZWRcbiAgICAgICwgaW5kZXggICA9IDBcbiAgICAgICwgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmKCRpdGVyLmlzKE8pKXtcbiAgICAgIGl0ZXJhdG9yID0gJGl0ZXIuZ2V0KE8pO1xuICAgICAgLy8gc3RyYW5nZSBJRSBxdWlya3MgbW9kZSBidWcgLT4gdXNlIHR5cGVvZiBpbnN0ZWFkIG9mIGlzRnVuY3Rpb25cbiAgICAgIHJlc3VsdCAgID0gbmV3ICh0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5KTtcbiAgICAgIGZvcig7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKyl7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgZiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxuICAgICAgcmVzdWx0ID0gbmV3ICh0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5KShsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKSk7XG4gICAgICBmb3IoOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gZihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF07XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgc2V0VW5zY29wZSA9IHJlcXVpcmUoJy4vJC51bnNjb3BlJylcbiAgLCBJVEVSICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxuICAsICRpdGVyICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgc3RlcCAgICAgICA9ICRpdGVyLnN0ZXBcbiAgLCBJdGVyYXRvcnMgID0gJGl0ZXIuSXRlcmF0b3JzO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICAkLnNldCh0aGlzLCBJVEVSLCB7bzogJC50b09iamVjdChpdGVyYXRlZCksIGk6IDAsIGs6IGtpbmR9KTtcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxuICAgICwgTyAgICAgPSBpdGVyLm9cbiAgICAsIGtpbmQgID0gaXRlci5rXG4gICAgLCBpbmRleCA9IGl0ZXIuaSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgaXRlci5vID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5zZXRVbnNjb3BlKCdrZXlzJyk7XG5zZXRVbnNjb3BlKCd2YWx1ZXMnKTtcbnNldFVuc2NvcGUoJ2VudHJpZXMnKTsiLCJ2YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4zIEFycmF5Lm9mKCAuLi5pdGVtcylcbiAgb2Y6IGZ1bmN0aW9uIG9mKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHZhciBpbmRleCAgPSAwXG4gICAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgIC8vIHN0cmFuZ2UgSUUgcXVpcmtzIG1vZGUgYnVnIC0+IHVzZSB0eXBlb2YgaW5zdGVhZCBvZiBpc0Z1bmN0aW9uXG4gICAgICAsIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkobGVuZ3RoKTtcbiAgICB3aGlsZShsZW5ndGggPiBpbmRleClyZXN1bHRbaW5kZXhdID0gYXJndW1lbnRzW2luZGV4KytdO1xuICAgIHJlc3VsdC5sZW5ndGggPSBsZW5ndGg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7IiwicmVxdWlyZSgnLi8kLnNwZWNpZXMnKShBcnJheSk7IiwidmFyICQgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIEhBU19JTlNUQU5DRSAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2hhc0luc3RhbmNlJylcbiAgLCBGdW5jdGlvblByb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuLy8gMTkuMi4zLjYgRnVuY3Rpb24ucHJvdG90eXBlW0BAaGFzSW5zdGFuY2VdKFYpXG5pZighKEhBU19JTlNUQU5DRSBpbiBGdW5jdGlvblByb3RvKSkkLnNldERlc2MoRnVuY3Rpb25Qcm90bywgSEFTX0lOU1RBTkNFLCB7dmFsdWU6IGZ1bmN0aW9uKE8pe1xuICBpZighJC5pc0Z1bmN0aW9uKHRoaXMpIHx8ICEkLmlzT2JqZWN0KE8pKXJldHVybiBmYWxzZTtcbiAgaWYoISQuaXNPYmplY3QodGhpcy5wcm90b3R5cGUpKXJldHVybiBPIGluc3RhbmNlb2YgdGhpcztcbiAgLy8gZm9yIGVudmlyb25tZW50IHcvbyBuYXRpdmUgYEBAaGFzSW5zdGFuY2VgIGxvZ2ljIGVub3VnaCBgaW5zdGFuY2VvZmAsIGJ1dCBhZGQgdGhpczpcbiAgd2hpbGUoTyA9ICQuZ2V0UHJvdG8oTykpaWYodGhpcy5wcm90b3R5cGUgPT09IE8pcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn19KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgTkFNRSA9ICduYW1lJ1xuICAsIHNldERlc2MgPSAkLnNldERlc2NcbiAgLCBGdW5jdGlvblByb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuLy8gMTkuMi40LjIgbmFtZVxuTkFNRSBpbiBGdW5jdGlvblByb3RvIHx8ICQuRlcgJiYgJC5ERVNDICYmIHNldERlc2MoRnVuY3Rpb25Qcm90bywgTkFNRSwge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKXtcbiAgICB2YXIgbWF0Y2ggPSBTdHJpbmcodGhpcykubWF0Y2goL15cXHMqZnVuY3Rpb24gKFteIChdKikvKVxuICAgICAgLCBuYW1lICA9IG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcbiAgICAkLmhhcyh0aGlzLCBOQU1FKSB8fCBzZXREZXNjKHRoaXMsIE5BTUUsICQuZGVzYyg1LCBuYW1lKSk7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICQuaGFzKHRoaXMsIE5BTUUpIHx8IHNldERlc2ModGhpcywgTkFNRSwgJC5kZXNjKDAsIHZhbHVlKSk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50c1swXSk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KXtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodGhpcywga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpOyIsInZhciBJbmZpbml0eSA9IDEgLyAwXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBFICAgICA9IE1hdGguRVxuICAsIHBvdyAgID0gTWF0aC5wb3dcbiAgLCBhYnMgICA9IE1hdGguYWJzXG4gICwgZXhwICAgPSBNYXRoLmV4cFxuICAsIGxvZyAgID0gTWF0aC5sb2dcbiAgLCBzcXJ0ICA9IE1hdGguc3FydFxuICAsIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXG4gICwgRVBTSUxPTiAgID0gcG93KDIsIC01MilcbiAgLCBFUFNJTE9OMzIgPSBwb3coMiwgLTIzKVxuICAsIE1BWDMyICAgICA9IHBvdygyLCAxMjcpICogKDIgLSBFUFNJTE9OMzIpXG4gICwgTUlOMzIgICAgID0gcG93KDIsIC0xMjYpO1xuZnVuY3Rpb24gcm91bmRUaWVzVG9FdmVuKG4pe1xuICByZXR1cm4gbiArIDEgLyBFUFNJTE9OIC0gMSAvIEVQU0lMT047XG59XG5cbi8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcbmZ1bmN0aW9uIHNpZ24oeCl7XG4gIHJldHVybiAoeCA9ICt4KSA9PSAwIHx8IHggIT0geCA/IHggOiB4IDwgMCA/IC0xIDogMTtcbn1cbi8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcbmZ1bmN0aW9uIGFzaW5oKHgpe1xuICByZXR1cm4gIWlzRmluaXRlKHggPSAreCkgfHwgeCA9PSAwID8geCA6IHggPCAwID8gLWFzaW5oKC14KSA6IGxvZyh4ICsgc3FydCh4ICogeCArIDEpKTtcbn1cbi8vIDIwLjIuMi4xNCBNYXRoLmV4cG0xKHgpXG5mdW5jdGlvbiBleHBtMSh4KXtcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IGV4cCh4KSAtIDE7XG59XG5cbiRkZWYoJGRlZi5TLCAnTWF0aCcsIHtcbiAgLy8gMjAuMi4yLjMgTWF0aC5hY29zaCh4KVxuICBhY29zaDogZnVuY3Rpb24gYWNvc2goeCl7XG4gICAgcmV0dXJuICh4ID0gK3gpIDwgMSA/IE5hTiA6IGlzRmluaXRlKHgpID8gbG9nKHggLyBFICsgc3FydCh4ICsgMSkgKiBzcXJ0KHggLSAxKSAvIEUpICsgMSA6IHg7XG4gIH0sXG4gIC8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcbiAgYXNpbmg6IGFzaW5oLFxuICAvLyAyMC4yLjIuNyBNYXRoLmF0YW5oKHgpXG4gIGF0YW5oOiBmdW5jdGlvbiBhdGFuaCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBsb2coKDEgKyB4KSAvICgxIC0geCkpIC8gMjtcbiAgfSxcbiAgLy8gMjAuMi4yLjkgTWF0aC5jYnJ0KHgpXG4gIGNicnQ6IGZ1bmN0aW9uIGNicnQoeCl7XG4gICAgcmV0dXJuIHNpZ24oeCA9ICt4KSAqIHBvdyhhYnMoeCksIDEgLyAzKTtcbiAgfSxcbiAgLy8gMjAuMi4yLjExIE1hdGguY2x6MzIoeClcbiAgY2x6MzI6IGZ1bmN0aW9uIGNsejMyKHgpe1xuICAgIHJldHVybiAoeCA+Pj49IDApID8gMzEgLSBmbG9vcihsb2coeCArIDAuNSkgKiBNYXRoLkxPRzJFKSA6IDMyO1xuICB9LFxuICAvLyAyMC4yLjIuMTIgTWF0aC5jb3NoKHgpXG4gIGNvc2g6IGZ1bmN0aW9uIGNvc2goeCl7XG4gICAgcmV0dXJuIChleHAoeCA9ICt4KSArIGV4cCgteCkpIC8gMjtcbiAgfSxcbiAgLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbiAgZXhwbTE6IGV4cG0xLFxuICAvLyAyMC4yLjIuMTYgTWF0aC5mcm91bmQoeClcbiAgZnJvdW5kOiBmdW5jdGlvbiBmcm91bmQoeCl7XG4gICAgdmFyICRhYnMgID0gYWJzKHgpXG4gICAgICAsICRzaWduID0gc2lnbih4KVxuICAgICAgLCBhLCByZXN1bHQ7XG4gICAgaWYoJGFicyA8IE1JTjMyKXJldHVybiAkc2lnbiAqIHJvdW5kVGllc1RvRXZlbigkYWJzIC8gTUlOMzIgLyBFUFNJTE9OMzIpICogTUlOMzIgKiBFUFNJTE9OMzI7XG4gICAgYSA9ICgxICsgRVBTSUxPTjMyIC8gRVBTSUxPTikgKiAkYWJzO1xuICAgIHJlc3VsdCA9IGEgLSAoYSAtICRhYnMpO1xuICAgIGlmKHJlc3VsdCA+IE1BWDMyIHx8IHJlc3VsdCAhPSByZXN1bHQpcmV0dXJuICRzaWduICogSW5maW5pdHk7XG4gICAgcmV0dXJuICRzaWduICogcmVzdWx0O1xuICB9LFxuICAvLyAyMC4yLjIuMTcgTWF0aC5oeXBvdChbdmFsdWUxWywgdmFsdWUyWywg4oCmIF1dXSlcbiAgaHlwb3Q6IGZ1bmN0aW9uIGh5cG90KHZhbHVlMSwgdmFsdWUyKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHZhciBzdW0gID0gMFxuICAgICAgLCBpICAgID0gMFxuICAgICAgLCBsZW4gID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBsYXJnID0gMFxuICAgICAgLCBhcmcsIGRpdjtcbiAgICB3aGlsZShpIDwgbGVuKXtcbiAgICAgIGFyZyA9IGFicyhhcmd1bWVudHNbaSsrXSk7XG4gICAgICBpZihsYXJnIDwgYXJnKXtcbiAgICAgICAgZGl2ICA9IGxhcmcgLyBhcmc7XG4gICAgICAgIHN1bSAgPSBzdW0gKiBkaXYgKiBkaXYgKyAxO1xuICAgICAgICBsYXJnID0gYXJnO1xuICAgICAgfSBlbHNlIGlmKGFyZyA+IDApe1xuICAgICAgICBkaXYgID0gYXJnIC8gbGFyZztcbiAgICAgICAgc3VtICs9IGRpdiAqIGRpdjtcbiAgICAgIH0gZWxzZSBzdW0gKz0gYXJnO1xuICAgIH1cbiAgICByZXR1cm4gbGFyZyA9PT0gSW5maW5pdHkgPyBJbmZpbml0eSA6IGxhcmcgKiBzcXJ0KHN1bSk7XG4gIH0sXG4gIC8vIDIwLjIuMi4xOCBNYXRoLmltdWwoeCwgeSlcbiAgaW11bDogZnVuY3Rpb24gaW11bCh4LCB5KXtcbiAgICB2YXIgVUludDE2ID0gMHhmZmZmXG4gICAgICAsIHhuID0gK3hcbiAgICAgICwgeW4gPSAreVxuICAgICAgLCB4bCA9IFVJbnQxNiAmIHhuXG4gICAgICAsIHlsID0gVUludDE2ICYgeW47XG4gICAgcmV0dXJuIDAgfCB4bCAqIHlsICsgKChVSW50MTYgJiB4biA+Pj4gMTYpICogeWwgKyB4bCAqIChVSW50MTYgJiB5biA+Pj4gMTYpIDw8IDE2ID4+PiAwKTtcbiAgfSxcbiAgLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcbiAgbG9nMXA6IGZ1bmN0aW9uIGxvZzFwKHgpe1xuICAgIHJldHVybiAoeCA9ICt4KSA+IC0xZS04ICYmIHggPCAxZS04ID8geCAtIHggKiB4IC8gMiA6IGxvZygxICsgeCk7XG4gIH0sXG4gIC8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXG4gIGxvZzEwOiBmdW5jdGlvbiBsb2cxMCh4KXtcbiAgICByZXR1cm4gbG9nKHgpIC8gTWF0aC5MTjEwO1xuICB9LFxuICAvLyAyMC4yLjIuMjIgTWF0aC5sb2cyKHgpXG4gIGxvZzI6IGZ1bmN0aW9uIGxvZzIoeCl7XG4gICAgcmV0dXJuIGxvZyh4KSAvIE1hdGguTE4yO1xuICB9LFxuICAvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXG4gIHNpZ246IHNpZ24sXG4gIC8vIDIwLjIuMi4zMCBNYXRoLnNpbmgoeClcbiAgc2luaDogZnVuY3Rpb24gc2luaCh4KXtcbiAgICByZXR1cm4gYWJzKHggPSAreCkgPCAxID8gKGV4cG0xKHgpIC0gZXhwbTEoLXgpKSAvIDIgOiAoZXhwKHggLSAxKSAtIGV4cCgteCAtIDEpKSAqIChFIC8gMik7XG4gIH0sXG4gIC8vIDIwLjIuMi4zMyBNYXRoLnRhbmgoeClcbiAgdGFuaDogZnVuY3Rpb24gdGFuaCh4KXtcbiAgICB2YXIgYSA9IGV4cG0xKHggPSAreClcbiAgICAgICwgYiA9IGV4cG0xKC14KTtcbiAgICByZXR1cm4gYSA9PSBJbmZpbml0eSA/IDEgOiBiID09IEluZmluaXR5ID8gLTEgOiAoYSAtIGIpIC8gKGV4cCh4KSArIGV4cCgteCkpO1xuICB9LFxuICAvLyAyMC4yLjIuMzQgTWF0aC50cnVuYyh4KVxuICB0cnVuYzogZnVuY3Rpb24gdHJ1bmMoaXQpe1xuICAgIHJldHVybiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBpc09iamVjdCAgID0gJC5pc09iamVjdFxuICAsIGlzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb25cbiAgLCBOVU1CRVIgICAgID0gJ051bWJlcidcbiAgLCAkTnVtYmVyICAgID0gJC5nW05VTUJFUl1cbiAgLCBCYXNlICAgICAgID0gJE51bWJlclxuICAsIHByb3RvICAgICAgPSAkTnVtYmVyLnByb3RvdHlwZTtcbmZ1bmN0aW9uIHRvUHJpbWl0aXZlKGl0KXtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmKGlzRnVuY3Rpb24oZm4gPSBpdC52YWx1ZU9mKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKGlzRnVuY3Rpb24oZm4gPSBpdC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBudW1iZXJcIik7XG59XG5mdW5jdGlvbiB0b051bWJlcihpdCl7XG4gIGlmKGlzT2JqZWN0KGl0KSlpdCA9IHRvUHJpbWl0aXZlKGl0KTtcbiAgaWYodHlwZW9mIGl0ID09ICdzdHJpbmcnICYmIGl0Lmxlbmd0aCA+IDIgJiYgaXQuY2hhckNvZGVBdCgwKSA9PSA0OCl7XG4gICAgdmFyIGJpbmFyeSA9IGZhbHNlO1xuICAgIHN3aXRjaChpdC5jaGFyQ29kZUF0KDEpKXtcbiAgICAgIGNhc2UgNjYgOiBjYXNlIDk4ICA6IGJpbmFyeSA9IHRydWU7XG4gICAgICBjYXNlIDc5IDogY2FzZSAxMTEgOiByZXR1cm4gcGFyc2VJbnQoaXQuc2xpY2UoMiksIGJpbmFyeSA/IDIgOiA4KTtcbiAgICB9XG4gIH0gcmV0dXJuICtpdDtcbn1cbmlmKCQuRlcgJiYgISgkTnVtYmVyKCcwbzEnKSAmJiAkTnVtYmVyKCcwYjEnKSkpe1xuICAkTnVtYmVyID0gZnVuY3Rpb24gTnVtYmVyKGl0KXtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mICROdW1iZXIgPyBuZXcgQmFzZSh0b051bWJlcihpdCkpIDogdG9OdW1iZXIoaXQpO1xuICB9O1xuICAkLmVhY2guY2FsbCgkLkRFU0MgPyAkLmdldE5hbWVzKEJhc2UpIDogKFxuICAgICAgLy8gRVMzOlxuICAgICAgJ01BWF9WQUxVRSxNSU5fVkFMVUUsTmFOLE5FR0FUSVZFX0lORklOSVRZLFBPU0lUSVZFX0lORklOSVRZLCcgK1xuICAgICAgLy8gRVM2IChpbiBjYXNlLCBpZiBtb2R1bGVzIHdpdGggRVM2IE51bWJlciBzdGF0aWNzIHJlcXVpcmVkIGJlZm9yZSk6XG4gICAgICAnRVBTSUxPTixpc0Zpbml0ZSxpc0ludGVnZXIsaXNOYU4saXNTYWZlSW50ZWdlcixNQVhfU0FGRV9JTlRFR0VSLCcgK1xuICAgICAgJ01JTl9TQUZFX0lOVEVHRVIscGFyc2VGbG9hdCxwYXJzZUludCxpc0ludGVnZXInXG4gICAgKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihrZXkpe1xuICAgICAgaWYoJC5oYXMoQmFzZSwga2V5KSAmJiAhJC5oYXMoJE51bWJlciwga2V5KSl7XG4gICAgICAgICQuc2V0RGVzYygkTnVtYmVyLCBrZXksICQuZ2V0RGVzYyhCYXNlLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG4gICROdW1iZXIucHJvdG90eXBlID0gcHJvdG87XG4gIHByb3RvLmNvbnN0cnVjdG9yID0gJE51bWJlcjtcbiAgcmVxdWlyZSgnLi8kLnJlZGVmJykoJC5nLCBOVU1CRVIsICROdW1iZXIpO1xufSIsInZhciAkICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBhYnMgICA9IE1hdGguYWJzXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXG4gICwgX2lzRmluaXRlID0gJC5nLmlzRmluaXRlXG4gICwgTUFYX1NBRkVfSU5URUdFUiA9IDB4MWZmZmZmZmZmZmZmZmY7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTE7XG5mdW5jdGlvbiBpc0ludGVnZXIoaXQpe1xuICByZXR1cm4gISQuaXNPYmplY3QoaXQpICYmIF9pc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcbn1cbiRkZWYoJGRlZi5TLCAnTnVtYmVyJywge1xuICAvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxuICBFUFNJTE9OOiBNYXRoLnBvdygyLCAtNTIpLFxuICAvLyAyMC4xLjIuMiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKVxuICBpc0Zpbml0ZTogZnVuY3Rpb24gaXNGaW5pdGUoaXQpe1xuICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgX2lzRmluaXRlKGl0KTtcbiAgfSxcbiAgLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXG4gIGlzSW50ZWdlcjogaXNJbnRlZ2VyLFxuICAvLyAyMC4xLjIuNCBOdW1iZXIuaXNOYU4obnVtYmVyKVxuICBpc05hTjogZnVuY3Rpb24gaXNOYU4obnVtYmVyKXtcbiAgICByZXR1cm4gbnVtYmVyICE9IG51bWJlcjtcbiAgfSxcbiAgLy8gMjAuMS4yLjUgTnVtYmVyLmlzU2FmZUludGVnZXIobnVtYmVyKVxuICBpc1NhZmVJbnRlZ2VyOiBmdW5jdGlvbiBpc1NhZmVJbnRlZ2VyKG51bWJlcil7XG4gICAgcmV0dXJuIGlzSW50ZWdlcihudW1iZXIpICYmIGFicyhudW1iZXIpIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG4gIH0sXG4gIC8vIDIwLjEuMi42IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gIE1BWF9TQUZFX0lOVEVHRVI6IE1BWF9TQUZFX0lOVEVHRVIsXG4gIC8vIDIwLjEuMi4xMCBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUlxuICBNSU5fU0FGRV9JTlRFR0VSOiAtTUFYX1NBRkVfSU5URUdFUixcbiAgLy8gMjAuMS4yLjEyIE51bWJlci5wYXJzZUZsb2F0KHN0cmluZylcbiAgcGFyc2VGbG9hdDogcGFyc2VGbG9hdCxcbiAgLy8gMjAuMS4yLjEzIE51bWJlci5wYXJzZUludChzdHJpbmcsIHJhZGl4KVxuICBwYXJzZUludDogcGFyc2VJbnRcbn0pOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi8kLmFzc2lnbicpfSk7IiwiLy8gMTkuMS4zLjEwIE9iamVjdC5pcyh2YWx1ZTEsIHZhbHVlMilcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XG4gIGlzOiByZXF1aXJlKCcuLyQuc2FtZScpXG59KTsiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldH0pOyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBpc09iamVjdCA9ICQuaXNPYmplY3RcbiAgLCB0b09iamVjdCA9ICQudG9PYmplY3Q7XG4kLmVhY2guY2FsbCgoJ2ZyZWV6ZSxzZWFsLHByZXZlbnRFeHRlbnNpb25zLGlzRnJvemVuLGlzU2VhbGVkLGlzRXh0ZW5zaWJsZSwnICtcbiAgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcixnZXRQcm90b3R5cGVPZixrZXlzLGdldE93blByb3BlcnR5TmFtZXMnKS5zcGxpdCgnLCcpXG4sIGZ1bmN0aW9uKEtFWSwgSUQpe1xuICB2YXIgZm4gICAgID0gKCQuY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGZvcmNlZCA9IDBcbiAgICAsIG1ldGhvZCA9IHt9O1xuICBtZXRob2RbS0VZXSA9IElEID09IDAgPyBmdW5jdGlvbiBmcmVlemUoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBpdDtcbiAgfSA6IElEID09IDEgPyBmdW5jdGlvbiBzZWFsKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XG4gIH0gOiBJRCA9PSAyID8gZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiBpdDtcbiAgfSA6IElEID09IDMgPyBmdW5jdGlvbiBpc0Zyb3plbihpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IHRydWU7XG4gIH0gOiBJRCA9PSA0ID8gZnVuY3Rpb24gaXNTZWFsZWQoaXQpe1xuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xuICB9IDogSUQgPT0gNSA/IGZ1bmN0aW9uIGlzRXh0ZW5zaWJsZShpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/IGZuKGl0KSA6IGZhbHNlO1xuICB9IDogSUQgPT0gNiA/IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpLCBrZXkpO1xuICB9IDogSUQgPT0gNyA/IGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKGl0KXtcbiAgICByZXR1cm4gZm4oT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZChpdCkpKTtcbiAgfSA6IElEID09IDggPyBmdW5jdGlvbiBrZXlzKGl0KXtcbiAgICByZXR1cm4gZm4odG9PYmplY3QoaXQpKTtcbiAgfSA6IHJlcXVpcmUoJy4vJC5nZXQtbmFtZXMnKS5nZXQ7XG4gIHRyeSB7XG4gICAgZm4oJ3onKTtcbiAgfSBjYXRjaChlKXtcbiAgICBmb3JjZWQgPSAxO1xuICB9XG4gICRkZWYoJGRlZi5TICsgJGRlZi5GICogZm9yY2VkLCAnT2JqZWN0JywgbWV0aG9kKTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIHRtcCA9IHt9O1xudG1wW3JlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKV0gPSAneic7XG5pZihyZXF1aXJlKCcuLyQnKS5GVyAmJiBjb2YodG1wKSAhPSAneicpe1xuICByZXF1aXJlKCcuLyQucmVkZWYnKShPYmplY3QucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiAnW29iamVjdCAnICsgY29mLmNsYXNzb2YodGhpcykgKyAnXSc7XG4gIH0sIHRydWUpO1xufSIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3R4ICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjb2YgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsICRkZWYgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgYXNzZXJ0ICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCBmb3JPZiAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIHNldFByb3RvID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldFxuICAsIHNhbWUgICAgID0gcmVxdWlyZSgnLi8kLnNhbWUnKVxuICAsIHNwZWNpZXMgID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMnKVxuICAsIFNQRUNJRVMgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJylcbiAgLCBSRUNPUkQgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdyZWNvcmQnKVxuICAsIFBST01JU0UgID0gJ1Byb21pc2UnXG4gICwgZ2xvYmFsICAgPSAkLmdcbiAgLCBwcm9jZXNzICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgPSBjb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgYXNhcCAgICAgPSBwcm9jZXNzICYmIHByb2Nlc3MubmV4dFRpY2sgfHwgcmVxdWlyZSgnLi8kLnRhc2snKS5zZXRcbiAgLCBQICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIGlzRnVuY3Rpb24gICAgID0gJC5pc0Z1bmN0aW9uXG4gICwgaXNPYmplY3QgICAgICAgPSAkLmlzT2JqZWN0XG4gICwgYXNzZXJ0RnVuY3Rpb24gPSBhc3NlcnQuZm5cbiAgLCBhc3NlcnRPYmplY3QgICA9IGFzc2VydC5vYmpcbiAgLCBXcmFwcGVyO1xuXG5mdW5jdGlvbiB0ZXN0UmVzb2x2ZShzdWIpe1xuICB2YXIgdGVzdCA9IG5ldyBQKGZ1bmN0aW9uKCl7fSk7XG4gIGlmKHN1Yil0ZXN0LmNvbnN0cnVjdG9yID0gT2JqZWN0O1xuICByZXR1cm4gUC5yZXNvbHZlKHRlc3QpID09PSB0ZXN0O1xufVxuXG52YXIgdXNlTmF0aXZlID0gZnVuY3Rpb24oKXtcbiAgdmFyIHdvcmtzID0gZmFsc2U7XG4gIGZ1bmN0aW9uIFAyKHgpe1xuICAgIHZhciBzZWxmID0gbmV3IFAoeCk7XG4gICAgc2V0UHJvdG8oc2VsZiwgUDIucHJvdG90eXBlKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuICB0cnkge1xuICAgIHdvcmtzID0gaXNGdW5jdGlvbihQKSAmJiBpc0Z1bmN0aW9uKFAucmVzb2x2ZSkgJiYgdGVzdFJlc29sdmUoKTtcbiAgICBzZXRQcm90byhQMiwgUCk7XG4gICAgUDIucHJvdG90eXBlID0gJC5jcmVhdGUoUC5wcm90b3R5cGUsIHtjb25zdHJ1Y3Rvcjoge3ZhbHVlOiBQMn19KTtcbiAgICAvLyBhY3R1YWwgRmlyZWZveCBoYXMgYnJva2VuIHN1YmNsYXNzIHN1cHBvcnQsIHRlc3QgdGhhdFxuICAgIGlmKCEoUDIucmVzb2x2ZSg1KS50aGVuKGZ1bmN0aW9uKCl7fSkgaW5zdGFuY2VvZiBQMikpe1xuICAgICAgd29ya3MgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gYWN0dWFsIFY4IGJ1ZywgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxNjJcbiAgICBpZih3b3JrcyAmJiAkLkRFU0Mpe1xuICAgICAgdmFyIHRoZW5hYmxlVGhlbkdvdHRlbiA9IGZhbHNlO1xuICAgICAgUC5yZXNvbHZlKCQuc2V0RGVzYyh7fSwgJ3RoZW4nLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhlbmFibGVUaGVuR290dGVuID0gdHJ1ZTsgfVxuICAgICAgfSkpO1xuICAgICAgd29ya3MgPSB0aGVuYWJsZVRoZW5Hb3R0ZW47XG4gICAgfVxuICB9IGNhdGNoKGUpeyB3b3JrcyA9IGZhbHNlOyB9XG4gIHJldHVybiB3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xuZnVuY3Rpb24gaXNQcm9taXNlKGl0KXtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiAodXNlTmF0aXZlID8gY29mLmNsYXNzb2YoaXQpID09ICdQcm9taXNlJyA6IFJFQ09SRCBpbiBpdCk7XG59XG5mdW5jdGlvbiBzYW1lQ29uc3RydWN0b3IoYSwgYil7XG4gIC8vIGxpYnJhcnkgd3JhcHBlciBzcGVjaWFsIGNhc2VcbiAgaWYoISQuRlcgJiYgYSA9PT0gUCAmJiBiID09PSBXcmFwcGVyKXJldHVybiB0cnVlO1xuICByZXR1cm4gc2FtZShhLCBiKTtcbn1cbmZ1bmN0aW9uIGdldENvbnN0cnVjdG9yKEMpe1xuICB2YXIgUyA9IGFzc2VydE9iamVjdChDKVtTUEVDSUVTXTtcbiAgcmV0dXJuIFMgIT0gdW5kZWZpbmVkID8gUyA6IEM7XG59XG5mdW5jdGlvbiBpc1RoZW5hYmxlKGl0KXtcbiAgdmFyIHRoZW47XG4gIGlmKGlzT2JqZWN0KGl0KSl0aGVuID0gaXQudGhlbjtcbiAgcmV0dXJuIGlzRnVuY3Rpb24odGhlbikgPyB0aGVuIDogZmFsc2U7XG59XG5mdW5jdGlvbiBub3RpZnkocmVjb3JkKXtcbiAgdmFyIGNoYWluID0gcmVjb3JkLmM7XG4gIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgaWYoY2hhaW4ubGVuZ3RoKWFzYXAuY2FsbChnbG9iYWwsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHZhbHVlID0gcmVjb3JkLnZcbiAgICAgICwgb2sgICAgPSByZWNvcmQucyA9PSAxXG4gICAgICAsIGkgICAgID0gMDtcbiAgICBmdW5jdGlvbiBydW4ocmVhY3Qpe1xuICAgICAgdmFyIGNiID0gb2sgPyByZWFjdC5vayA6IHJlYWN0LmZhaWxcbiAgICAgICAgLCByZXQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihjYil7XG4gICAgICAgICAgaWYoIW9rKXJlY29yZC5oID0gdHJ1ZTtcbiAgICAgICAgICByZXQgPSBjYiA9PT0gdHJ1ZSA/IHZhbHVlIDogY2IodmFsdWUpO1xuICAgICAgICAgIGlmKHJldCA9PT0gcmVhY3QuUCl7XG4gICAgICAgICAgICByZWFjdC5yZWooVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXQsIHJlYWN0LnJlcywgcmVhY3QucmVqKTtcbiAgICAgICAgICB9IGVsc2UgcmVhY3QucmVzKHJldCk7XG4gICAgICAgIH0gZWxzZSByZWFjdC5yZWoodmFsdWUpO1xuICAgICAgfSBjYXRjaChlcnIpe1xuICAgICAgICByZWFjdC5yZWooZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgY2hhaW4ubGVuZ3RoID0gMDtcbiAgfSk7XG59XG5mdW5jdGlvbiBpc1VuaGFuZGxlZChwcm9taXNlKXtcbiAgdmFyIHJlY29yZCA9IHByb21pc2VbUkVDT1JEXVxuICAgICwgY2hhaW4gID0gcmVjb3JkLmEgfHwgcmVjb3JkLmNcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlYWN0O1xuICBpZihyZWNvcmQuaClyZXR1cm4gZmFsc2U7XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0ID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdC5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdC5QKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiAkcmVqZWN0KHZhbHVlKXtcbiAgdmFyIHJlY29yZCA9IHRoaXNcbiAgICAsIHByb21pc2U7XG4gIGlmKHJlY29yZC5kKXJldHVybjtcbiAgcmVjb3JkLmQgPSB0cnVlO1xuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxuICByZWNvcmQudiA9IHZhbHVlO1xuICByZWNvcmQucyA9IDI7XG4gIHJlY29yZC5hID0gcmVjb3JkLmMuc2xpY2UoKTtcbiAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICBhc2FwLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbigpe1xuICAgICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSA9IHJlY29yZC5wKSl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihnbG9iYWwuY29uc29sZSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlY29yZC5hID0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9LCAxKTtcbiAgbm90aWZ5KHJlY29yZCk7XG59XG5mdW5jdGlvbiAkcmVzb2x2ZSh2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgYXNhcC5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgICAgIHJlY29yZC5zID0gMTtcbiAgICAgIG5vdGlmeShyZWNvcmQpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe3I6IHJlY29yZCwgZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZighdXNlTmF0aXZlKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgUCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFzc2VydEZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICB2YXIgcmVjb3JkID0ge1xuICAgICAgcDogYXNzZXJ0Lmluc3QodGhpcywgUCwgUFJPTUlTRSksICAgICAgIC8vIDwtIHByb21pc2VcbiAgICAgIGM6IFtdLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICAgIGE6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgICAgczogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgICBkOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gZG9uZVxuICAgICAgdjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICBoOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gaGFuZGxlZCByZWplY3Rpb25cbiAgICB9O1xuICAgICQuaGlkZSh0aGlzLCBSRUNPUkQsIHJlY29yZCk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KCRyZWplY3QsIHJlY29yZCwgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbChyZWNvcmQsIGVycik7XG4gICAgfVxuICB9O1xuICByZXF1aXJlKCcuLyQubWl4JykoUC5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIFMgPSBhc3NlcnRPYmplY3QoYXNzZXJ0T2JqZWN0KHRoaXMpLmNvbnN0cnVjdG9yKVtTUEVDSUVTXTtcbiAgICAgIHZhciByZWFjdCA9IHtcbiAgICAgICAgb2s6ICAgaXNGdW5jdGlvbihvbkZ1bGZpbGxlZCkgPyBvbkZ1bGZpbGxlZCA6IHRydWUsXG4gICAgICAgIGZhaWw6IGlzRnVuY3Rpb24ob25SZWplY3RlZCkgID8gb25SZWplY3RlZCAgOiBmYWxzZVxuICAgICAgfTtcbiAgICAgIHZhciBwcm9taXNlID0gcmVhY3QuUCA9IG5ldyAoUyAhPSB1bmRlZmluZWQgPyBTIDogUCkoZnVuY3Rpb24ocmVzLCByZWope1xuICAgICAgICByZWFjdC5yZXMgPSBhc3NlcnRGdW5jdGlvbihyZXMpO1xuICAgICAgICByZWFjdC5yZWogPSBhc3NlcnRGdW5jdGlvbihyZWopO1xuICAgICAgfSk7XG4gICAgICB2YXIgcmVjb3JkID0gdGhpc1tSRUNPUkRdO1xuICAgICAgcmVjb3JkLmMucHVzaChyZWFjdCk7XG4gICAgICBpZihyZWNvcmQuYSlyZWNvcmQuYS5wdXNoKHJlYWN0KTtcbiAgICAgIGlmKHJlY29yZC5zKW5vdGlmeShyZWNvcmQpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIGV4cG9ydFxuJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYgKiAhdXNlTmF0aXZlLCB7UHJvbWlzZTogUH0pO1xuY29mLnNldChQLCBQUk9NSVNFKTtcbnNwZWNpZXMoUCk7XG5zcGVjaWVzKFdyYXBwZXIgPSAkLmNvcmVbUFJPTUlTRV0pO1xuXG4vLyBzdGF0aWNzXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICF1c2VOYXRpdmUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgcmV0dXJuIG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlcywgcmVqKXsgcmVqKHIpOyB9KTtcbiAgfVxufSk7XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICghdXNlTmF0aXZlIHx8IHRlc3RSZXNvbHZlKHRydWUpKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICByZXR1cm4gaXNQcm9taXNlKHgpICYmIHNhbWVDb25zdHJ1Y3Rvcih4LmNvbnN0cnVjdG9yLCB0aGlzKVxuICAgICAgPyB4IDogbmV3IHRoaXMoZnVuY3Rpb24ocmVzKXsgcmVzKHgpOyB9KTtcbiAgfVxufSk7XG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICEodXNlTmF0aXZlICYmIHJlcXVpcmUoJy4vJC5pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpe1xuICBQLmFsbChpdGVyKVsnY2F0Y2gnXShmdW5jdGlvbigpe30pO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIHZhbHVlcyA9IFtdO1xuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXMsIHJlail7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHZhbHVlcy5wdXNoLCB2YWx1ZXMpO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcbiAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xuICAgICAgaWYocmVtYWluaW5nKSQuZWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXMocmVzdWx0cyk7XG4gICAgICAgIH0sIHJlaik7XG4gICAgICB9KTtcbiAgICAgIGVsc2UgcmVzKHJlc3VsdHMpO1xuICAgIH0pO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpe1xuICAgIHZhciBDID0gZ2V0Q29uc3RydWN0b3IodGhpcyk7XG4gICAgcmV0dXJuIG5ldyBDKGZ1bmN0aW9uKHJlcywgcmVqKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKHJlcywgcmVqKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59KTsiLCJ2YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCBzZXRQcm90byAgPSByZXF1aXJlKCcuLyQuc2V0LXByb3RvJylcbiAgLCAkaXRlciAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSVRFUiAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxuICAsIHN0ZXAgICAgICA9ICRpdGVyLnN0ZXBcbiAgLCBhc3NlcnQgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcbiAgLCBpc09iamVjdCAgPSAkLmlzT2JqZWN0XG4gICwgZ2V0UHJvdG8gID0gJC5nZXRQcm90b1xuICAsICRSZWZsZWN0ICA9ICQuZy5SZWZsZWN0XG4gICwgX2FwcGx5ICAgID0gRnVuY3Rpb24uYXBwbHlcbiAgLCBhc3NlcnRPYmplY3QgPSBhc3NlcnQub2JqXG4gICwgX2lzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgaXNPYmplY3RcbiAgLCBfcHJldmVudEV4dGVuc2lvbnMgPSBPYmplY3QucHJldmVudEV4dGVuc2lvbnNcbiAgLy8gSUUgVFAgaGFzIGJyb2tlbiBSZWZsZWN0LmVudW1lcmF0ZVxuICAsIGJ1Z2d5RW51bWVyYXRlID0gISgkUmVmbGVjdCAmJiAkUmVmbGVjdC5lbnVtZXJhdGUgJiYgSVRFUkFUT1IgaW4gJFJlZmxlY3QuZW51bWVyYXRlKHt9KSk7XG5cbmZ1bmN0aW9uIEVudW1lcmF0ZShpdGVyYXRlZCl7XG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgazogdW5kZWZpbmVkLCBpOiAwfSk7XG59XG4kaXRlci5jcmVhdGUoRW51bWVyYXRlLCAnT2JqZWN0JywgZnVuY3Rpb24oKXtcbiAgdmFyIGl0ZXIgPSB0aGlzW0lURVJdXG4gICAgLCBrZXlzID0gaXRlci5rXG4gICAgLCBrZXk7XG4gIGlmKGtleXMgPT0gdW5kZWZpbmVkKXtcbiAgICBpdGVyLmsgPSBrZXlzID0gW107XG4gICAgZm9yKGtleSBpbiBpdGVyLm8pa2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgZG8ge1xuICAgIGlmKGl0ZXIuaSA+PSBrZXlzLmxlbmd0aClyZXR1cm4gc3RlcCgxKTtcbiAgfSB3aGlsZSghKChrZXkgPSBrZXlzW2l0ZXIuaSsrXSkgaW4gaXRlci5vKSk7XG4gIHJldHVybiBzdGVwKDAsIGtleSk7XG59KTtcblxudmFyIHJlZmxlY3QgPSB7XG4gIC8vIDI2LjEuMSBSZWZsZWN0LmFwcGx5KHRhcmdldCwgdGhpc0FyZ3VtZW50LCBhcmd1bWVudHNMaXN0KVxuICBhcHBseTogZnVuY3Rpb24gYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3Qpe1xuICAgIHJldHVybiBfYXBwbHkuY2FsbCh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdCk7XG4gIH0sXG4gIC8vIDI2LjEuMiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3VtZW50c0xpc3QgWywgbmV3VGFyZ2V0XSlcbiAgY29uc3RydWN0OiBmdW5jdGlvbiBjb25zdHJ1Y3QodGFyZ2V0LCBhcmd1bWVudHNMaXN0IC8qLCBuZXdUYXJnZXQqLyl7XG4gICAgdmFyIHByb3RvICAgID0gYXNzZXJ0LmZuKGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdKS5wcm90b3R5cGVcbiAgICAgICwgaW5zdGFuY2UgPSAkLmNyZWF0ZShpc09iamVjdChwcm90bykgPyBwcm90byA6IE9iamVjdC5wcm90b3R5cGUpXG4gICAgICAsIHJlc3VsdCAgID0gX2FwcGx5LmNhbGwodGFyZ2V0LCBpbnN0YW5jZSwgYXJndW1lbnRzTGlzdCk7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcbiAgfSxcbiAgLy8gMjYuMS4zIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpe1xuICAgIGFzc2VydE9iamVjdCh0YXJnZXQpO1xuICAgIHRyeSB7XG4gICAgICAkLnNldERlc2ModGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgLy8gMjYuMS40IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSlcbiAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uIGRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHZhciBkZXNjID0gJC5nZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XG4gICAgcmV0dXJuIGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlID8gZmFsc2UgOiBkZWxldGUgdGFyZ2V0W3Byb3BlcnR5S2V5XTtcbiAgfSxcbiAgLy8gMjYuMS42IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcGVydHlLZXkgWywgcmVjZWl2ZXJdKVxuICBnZXQ6IGZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3BlcnR5S2V5LyosIHJlY2VpdmVyKi8pe1xuICAgIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdXG4gICAgICAsIGRlc2MgPSAkLmdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KSwgcHJvdG87XG4gICAgaWYoZGVzYylyZXR1cm4gJC5oYXMoZGVzYywgJ3ZhbHVlJylcbiAgICAgID8gZGVzYy52YWx1ZVxuICAgICAgOiBkZXNjLmdldCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KSlcbiAgICAgID8gZ2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgcmVjZWl2ZXIpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgfSxcbiAgLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpe1xuICAgIHJldHVybiAkLmdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgfSxcbiAgLy8gMjYuMS44IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVxuICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KXtcbiAgICByZXR1cm4gZ2V0UHJvdG8oYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xuICB9LFxuICAvLyAyNi4xLjkgUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wZXJ0eUtleSlcbiAgaGFzOiBmdW5jdGlvbiBoYXModGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgcmV0dXJuIHByb3BlcnR5S2V5IGluIHRhcmdldDtcbiAgfSxcbiAgLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXG4gIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24gaXNFeHRlbnNpYmxlKHRhcmdldCl7XG4gICAgcmV0dXJuIF9pc0V4dGVuc2libGUoYXNzZXJ0T2JqZWN0KHRhcmdldCkpO1xuICB9LFxuICAvLyAyNi4xLjExIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpXG4gIG93bktleXM6IHJlcXVpcmUoJy4vJC5vd24ta2V5cycpLFxuICAvLyAyNi4xLjEyIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxuICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KXtcbiAgICBhc3NlcnRPYmplY3QodGFyZ2V0KTtcbiAgICB0cnkge1xuICAgICAgaWYoX3ByZXZlbnRFeHRlbnNpb25zKV9wcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIC8vIDI2LjEuMTMgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgViBbLCByZWNlaXZlcl0pXG4gIHNldDogZnVuY3Rpb24gc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYvKiwgcmVjZWl2ZXIqLyl7XG4gICAgdmFyIHJlY2VpdmVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDQgPyB0YXJnZXQgOiBhcmd1bWVudHNbM11cbiAgICAgICwgb3duRGVzYyAgPSAkLmdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KVxuICAgICAgLCBleGlzdGluZ0Rlc2NyaXB0b3IsIHByb3RvO1xuICAgIGlmKCFvd25EZXNjKXtcbiAgICAgIGlmKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KSkpe1xuICAgICAgICByZXR1cm4gc2V0KHByb3RvLCBwcm9wZXJ0eUtleSwgViwgcmVjZWl2ZXIpO1xuICAgICAgfVxuICAgICAgb3duRGVzYyA9ICQuZGVzYygwKTtcbiAgICB9XG4gICAgaWYoJC5oYXMob3duRGVzYywgJ3ZhbHVlJykpe1xuICAgICAgaWYob3duRGVzYy53cml0YWJsZSA9PT0gZmFsc2UgfHwgIWlzT2JqZWN0KHJlY2VpdmVyKSlyZXR1cm4gZmFsc2U7XG4gICAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSAkLmdldERlc2MocmVjZWl2ZXIsIHByb3BlcnR5S2V5KSB8fCAkLmRlc2MoMCk7XG4gICAgICBleGlzdGluZ0Rlc2NyaXB0b3IudmFsdWUgPSBWO1xuICAgICAgJC5zZXREZXNjKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSwgZXhpc3RpbmdEZXNjcmlwdG9yKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gb3duRGVzYy5zZXQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogKG93bkRlc2Muc2V0LmNhbGwocmVjZWl2ZXIsIFYpLCB0cnVlKTtcbiAgfVxufTtcbi8vIDI2LjEuMTQgUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKVxuaWYoc2V0UHJvdG8pcmVmbGVjdC5zZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pe1xuICBzZXRQcm90by5jaGVjayh0YXJnZXQsIHByb3RvKTtcbiAgdHJ5IHtcbiAgICBzZXRQcm90by5zZXQodGFyZ2V0LCBwcm90byk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4kZGVmKCRkZWYuRywge1JlZmxlY3Q6IHt9fSk7XG5cbiRkZWYoJGRlZi5TICsgJGRlZi5GICogYnVnZ3lFbnVtZXJhdGUsICdSZWZsZWN0Jywge1xuICAvLyAyNi4xLjUgUmVmbGVjdC5lbnVtZXJhdGUodGFyZ2V0KVxuICBlbnVtZXJhdGU6IGZ1bmN0aW9uIGVudW1lcmF0ZSh0YXJnZXQpe1xuICAgIHJldHVybiBuZXcgRW51bWVyYXRlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcbiAgfVxufSk7XG5cbiRkZWYoJGRlZi5TLCAnUmVmbGVjdCcsIHJlZmxlY3QpOyIsInZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJFJlZ0V4cCA9ICQuZy5SZWdFeHBcbiAgLCBCYXNlICAgID0gJFJlZ0V4cFxuICAsIHByb3RvICAgPSAkUmVnRXhwLnByb3RvdHlwZVxuICAsIHJlICAgICAgPSAvYS9nXG4gIC8vIFwibmV3XCIgY3JlYXRlcyBhIG5ldyBvYmplY3RcbiAgLCBDT1JSRUNUX05FVyA9IG5ldyAkUmVnRXhwKHJlKSAhPT0gcmVcbiAgLy8gUmVnRXhwIGFsbG93cyBhIHJlZ2V4IHdpdGggZmxhZ3MgYXMgdGhlIHBhdHRlcm5cbiAgLCBBTExPV1NfUkVfV0lUSF9GTEFHUyA9IGZ1bmN0aW9uKCl7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAkUmVnRXhwKHJlLCAnaScpID09ICcvYS9pJztcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIH0oKTtcbmlmKCQuRlcgJiYgJC5ERVNDKXtcbiAgaWYoIUNPUlJFQ1RfTkVXIHx8ICFBTExPV1NfUkVfV0lUSF9GTEFHUyl7XG4gICAgJFJlZ0V4cCA9IGZ1bmN0aW9uIFJlZ0V4cChwYXR0ZXJuLCBmbGFncyl7XG4gICAgICB2YXIgcGF0dGVybklzUmVnRXhwICA9IGNvZihwYXR0ZXJuKSA9PSAnUmVnRXhwJ1xuICAgICAgICAsIGZsYWdzSXNVbmRlZmluZWQgPSBmbGFncyA9PT0gdW5kZWZpbmVkO1xuICAgICAgaWYoISh0aGlzIGluc3RhbmNlb2YgJFJlZ0V4cCkgJiYgcGF0dGVybklzUmVnRXhwICYmIGZsYWdzSXNVbmRlZmluZWQpcmV0dXJuIHBhdHRlcm47XG4gICAgICByZXR1cm4gQ09SUkVDVF9ORVdcbiAgICAgICAgPyBuZXcgQmFzZShwYXR0ZXJuSXNSZWdFeHAgJiYgIWZsYWdzSXNVbmRlZmluZWQgPyBwYXR0ZXJuLnNvdXJjZSA6IHBhdHRlcm4sIGZsYWdzKVxuICAgICAgICA6IG5ldyBCYXNlKHBhdHRlcm5Jc1JlZ0V4cCA/IHBhdHRlcm4uc291cmNlIDogcGF0dGVyblxuICAgICAgICAgICwgcGF0dGVybklzUmVnRXhwICYmIGZsYWdzSXNVbmRlZmluZWQgPyBwYXR0ZXJuLmZsYWdzIDogZmxhZ3MpO1xuICAgIH07XG4gICAgJC5lYWNoLmNhbGwoJC5nZXROYW1lcyhCYXNlKSwgZnVuY3Rpb24oa2V5KXtcbiAgICAgIGtleSBpbiAkUmVnRXhwIHx8ICQuc2V0RGVzYygkUmVnRXhwLCBrZXksIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBCYXNlW2tleV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oaXQpeyBCYXNlW2tleV0gPSBpdDsgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcHJvdG8uY29uc3RydWN0b3IgPSAkUmVnRXhwO1xuICAgICRSZWdFeHAucHJvdG90eXBlID0gcHJvdG87XG4gICAgcmVxdWlyZSgnLi8kLnJlZGVmJykoJC5nLCAnUmVnRXhwJywgJFJlZ0V4cCk7XG4gIH1cbiAgLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3MoKVxuICBpZigvLi9nLmZsYWdzICE9ICdnJykkLnNldERlc2MocHJvdG8sICdmbGFncycsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvXi4qXFwvKFxcdyopJC8sICckMScpXG4gIH0pO1xufVxucmVxdWlyZSgnLi8kLnNwZWNpZXMnKSgkUmVnRXhwKTsiLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1NldCcsIGZ1bmN0aW9uKGdldCl7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHNbMF0pOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykoZmFsc2UpO1xuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxuICBjb2RlUG9pbnRBdDogZnVuY3Rpb24gY29kZVBvaW50QXQocG9zKXtcbiAgICByZXR1cm4gJGF0KHRoaXMsIHBvcyk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHRvTGVuZ3RoID0gJC50b0xlbmd0aDtcblxuLy8gc2hvdWxkIHRocm93IGVycm9yIG9uIHJlZ2V4XG4kZGVmKCRkZWYuUCArICRkZWYuRiAqICFyZXF1aXJlKCcuLyQudGhyb3dzJykoZnVuY3Rpb24oKXsgJ3EnLmVuZHNXaXRoKC8uLyk7IH0pLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuNiBTdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKHNlYXJjaFN0cmluZyBbLCBlbmRQb3NpdGlvbl0pXG4gIGVuZHNXaXRoOiBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2hTdHJpbmcgLyosIGVuZFBvc2l0aW9uID0gQGxlbmd0aCAqLyl7XG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgdmFyIHRoYXQgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxuICAgICAgLCBlbmRQb3NpdGlvbiA9IGFyZ3VtZW50c1sxXVxuICAgICAgLCBsZW4gPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcbiAgICAgICwgZW5kID0gZW5kUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGxlbiA6IE1hdGgubWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKTtcbiAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoZW5kIC0gc2VhcmNoU3RyaW5nLmxlbmd0aCwgZW5kKSA9PT0gc2VhcmNoU3RyaW5nO1xuICB9XG59KTsiLCJ2YXIgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIHRvSW5kZXggPSByZXF1aXJlKCcuLyQnKS50b0luZGV4XG4gICwgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZVxuICAsICRmcm9tQ29kZVBvaW50ID0gU3RyaW5nLmZyb21Db2RlUG9pbnQ7XG5cbi8vIGxlbmd0aCBzaG91bGQgYmUgMSwgb2xkIEZGIHByb2JsZW1cbiRkZWYoJGRlZi5TICsgJGRlZi5GICogKCEhJGZyb21Db2RlUG9pbnQgJiYgJGZyb21Db2RlUG9pbnQubGVuZ3RoICE9IDEpLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuMiBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKVxuICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KHgpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHJlcyA9IFtdXG4gICAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICwgaSAgID0gMFxuICAgICAgLCBjb2RlO1xuICAgIHdoaWxlKGxlbiA+IGkpe1xuICAgICAgY29kZSA9ICthcmd1bWVudHNbaSsrXTtcbiAgICAgIGlmKHRvSW5kZXgoY29kZSwgMHgxMGZmZmYpICE9PSBjb2RlKXRocm93IFJhbmdlRXJyb3IoY29kZSArICcgaXMgbm90IGEgdmFsaWQgY29kZSBwb2ludCcpO1xuICAgICAgcmVzLnB1c2goY29kZSA8IDB4MTAwMDBcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcbiAgICAgICAgOiBmcm9tQ2hhckNvZGUoKChjb2RlIC09IDB4MTAwMDApID4+IDEwKSArIDB4ZDgwMCwgY29kZSAlIDB4NDAwICsgMHhkYzAwKVxuICAgICAgKTtcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcblxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy43IFN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbiA9IDApXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgcmV0dXJuICEhflN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpLmluZGV4T2Yoc2VhcmNoU3RyaW5nLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTsiLCJ2YXIgc2V0ICAgPSByZXF1aXJlKCcuLyQnKS5zZXRcbiAgLCAkYXQgICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKSh0cnVlKVxuICAsIElURVIgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ2l0ZXInKVxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxuICAsIHN0ZXAgID0gJGl0ZXIuc3RlcDtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICBzZXQodGhpcywgSVRFUiwge286IFN0cmluZyhpdGVyYXRlZCksIGk6IDB9KTtcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cbiAgICAsIE8gICAgID0gaXRlci5vXG4gICAgLCBpbmRleCA9IGl0ZXIuaVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiBzdGVwKDEpO1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIGl0ZXIuaSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiBzdGVwKDAsIHBvaW50KTtcbn0pOyIsInZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuXG4kZGVmKCRkZWYuUywgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcbiAgcmF3OiBmdW5jdGlvbiByYXcoY2FsbFNpdGUpe1xuICAgIHZhciB0cGwgPSAkLnRvT2JqZWN0KGNhbGxTaXRlLnJhdylcbiAgICAgICwgbGVuID0gJC50b0xlbmd0aCh0cGwubGVuZ3RoKVxuICAgICAgLCBzbG4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAsIHJlcyA9IFtdXG4gICAgICAsIGkgICA9IDA7XG4gICAgd2hpbGUobGVuID4gaSl7XG4gICAgICByZXMucHVzaChTdHJpbmcodHBsW2krK10pKTtcbiAgICAgIGlmKGkgPCBzbG4pcmVzLnB1c2goU3RyaW5nKGFyZ3VtZW50c1tpXSkpO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XG5cbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXG4gIHJlcGVhdDogcmVxdWlyZSgnLi8kLnN0cmluZy1yZXBlYXQnKVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuXG4vLyBzaG91bGQgdGhyb3cgZXJyb3Igb24gcmVnZXhcbiRkZWYoJGRlZi5QICsgJGRlZi5GICogIXJlcXVpcmUoJy4vJC50aHJvd3MnKShmdW5jdGlvbigpeyAncScuc3RhcnRzV2l0aCgvLi8pOyB9KSwgJ1N0cmluZycsIHtcbiAgLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgdmFyIHRoYXQgID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcbiAgICAgICwgaW5kZXggPSAkLnRvTGVuZ3RoKE1hdGgubWluKGFyZ3VtZW50c1sxXSwgdGhhdC5sZW5ndGgpKTtcbiAgICBzZWFyY2hTdHJpbmcgKz0gJyc7XG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBzZXRUYWcgICA9IHJlcXVpcmUoJy4vJC5jb2YnKS5zZXRcbiAgLCB1aWQgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIHNoYXJlZCAgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpXG4gICwgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkcmVkZWYgICA9IHJlcXVpcmUoJy4vJC5yZWRlZicpXG4gICwga2V5T2YgICAgPSByZXF1aXJlKCcuLyQua2V5b2YnKVxuICAsIGVudW1LZXlzID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpXG4gICwgYXNzZXJ0T2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9ialxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZVxuICAsIERFU0MgICAgID0gJC5ERVNDXG4gICwgaGFzICAgICAgPSAkLmhhc1xuICAsICRjcmVhdGUgID0gJC5jcmVhdGVcbiAgLCBnZXREZXNjICA9ICQuZ2V0RGVzY1xuICAsIHNldERlc2MgID0gJC5zZXREZXNjXG4gICwgZGVzYyAgICAgPSAkLmRlc2NcbiAgLCAkbmFtZXMgICA9IHJlcXVpcmUoJy4vJC5nZXQtbmFtZXMnKVxuICAsIGdldE5hbWVzID0gJG5hbWVzLmdldFxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdFxuICAsICRTeW1ib2wgID0gJC5nLlN5bWJvbFxuICAsIHNldHRlciAgID0gZmFsc2VcbiAgLCBUQUcgICAgICA9IHVpZCgndGFnJylcbiAgLCBISURERU4gICA9IHVpZCgnaGlkZGVuJylcbiAgLCBfcHJvcGVydHlJc0VudW1lcmFibGUgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZVxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKVxuICAsIEFsbFN5bWJvbHMgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIHVzZU5hdGl2ZSA9ICQuaXNGdW5jdGlvbigkU3ltYm9sKTtcblxudmFyIHNldFN5bWJvbERlc2MgPSBERVNDID8gZnVuY3Rpb24oKXsgLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkXG4gIHRyeSB7XG4gICAgcmV0dXJuICRjcmVhdGUoc2V0RGVzYyh7fSwgSElEREVOLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBzZXREZXNjKHRoaXMsIEhJRERFTiwge3ZhbHVlOiBmYWxzZX0pW0hJRERFTl07XG4gICAgICB9XG4gICAgfSkpW0hJRERFTl0gfHwgc2V0RGVzYztcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gZnVuY3Rpb24oaXQsIGtleSwgRCl7XG4gICAgICB2YXIgcHJvdG9EZXNjID0gZ2V0RGVzYyhPYmplY3RQcm90bywga2V5KTtcbiAgICAgIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgICAgIHNldERlc2MoaXQsIGtleSwgRCk7XG4gICAgICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKXNldERlc2MoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbiAgICB9O1xuICB9XG59KCkgOiBzZXREZXNjO1xuXG5mdW5jdGlvbiB3cmFwKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSAkLnNldCgkY3JlYXRlKCRTeW1ib2wucHJvdG90eXBlKSwgVEFHLCB0YWcpO1xuICBERVNDICYmIHNldHRlciAmJiBzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgZGVzYygxLCB2YWx1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzeW07XG59XG5cbmZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpc2V0RGVzYyhpdCwgSElEREVOLCBkZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9ICRjcmVhdGUoRCwge2VudW1lcmFibGU6IGRlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gc2V0RGVzYyhpdCwga2V5LCBEKTtcbn1cbmZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhc3NlcnRPYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b09iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufVxuZnVuY3Rpb24gY3JlYXRlKGl0LCBQKXtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/ICRjcmVhdGUoaXQpIDogZGVmaW5lUHJvcGVydGllcygkY3JlYXRlKGl0KSwgUCk7XG59XG5mdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpe1xuICB2YXIgRSA9IF9wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRoaXMsIGtleSk7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV1cbiAgICA/IEUgOiB0cnVlO1xufVxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICB2YXIgRCA9IGdldERlc2MoaXQgPSB0b09iamVjdChpdCksIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn1cbmZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4pcmVzdWx0LnB1c2goa2V5KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b09iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmKCF1c2VOYXRpdmUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcbiAgICByZXR1cm4gd3JhcCh1aWQoYXJndW1lbnRzWzBdKSk7XG4gIH07XG4gICRyZWRlZigkU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpc1tUQUddO1xuICB9KTtcblxuICAkLmNyZWF0ZSAgICAgPSBjcmVhdGU7XG4gICQuc2V0RGVzYyAgICA9IGRlZmluZVByb3BlcnR5O1xuICAkLmdldERlc2MgICAgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICQuc2V0RGVzY3MgICA9IGRlZmluZVByb3BlcnRpZXM7XG4gICQuZ2V0TmFtZXMgICA9ICRuYW1lcy5nZXQgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICAkLmdldFN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYoJC5ERVNDICYmICQuRlcpJHJlZGVmKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCBwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG59XG5cbnZhciBzeW1ib2xTdGF0aWNzID0ge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xuICAgIHJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XG59O1xuLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXG4vLyAxOS40LjIuMyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlXG4vLyAxOS40LjIuNCBTeW1ib2wuaXRlcmF0b3Jcbi8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxuLy8gMTkuNC4yLjggU3ltYm9sLnJlcGxhY2Vcbi8vIDE5LjQuMi45IFN5bWJvbC5zZWFyY2hcbi8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xuLy8gMTkuNC4yLjExIFN5bWJvbC5zcGxpdFxuLy8gMTkuNC4yLjEyIFN5bWJvbC50b1ByaW1pdGl2ZVxuLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xuLy8gMTkuNC4yLjE0IFN5bWJvbC51bnNjb3BhYmxlc1xuJC5lYWNoLmNhbGwoKFxuICAgICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXG4gICAgJ3NwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4gICkuc3BsaXQoJywnKSwgZnVuY3Rpb24oaXQpe1xuICAgIHZhciBzeW0gPSByZXF1aXJlKCcuLyQud2tzJykoaXQpO1xuICAgIHN5bWJvbFN0YXRpY3NbaXRdID0gdXNlTmF0aXZlID8gc3ltIDogd3JhcChzeW0pO1xuICB9XG4pO1xuXG5zZXR0ZXIgPSB0cnVlO1xuXG4kZGVmKCRkZWYuRyArICRkZWYuVywge1N5bWJvbDogJFN5bWJvbH0pO1xuXG4kZGVmKCRkZWYuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xuXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICF1c2VOYXRpdmUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiBjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6IGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6IGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VGFnKCQuZy5KU09OLCAnSlNPTicsIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHdlYWsgICAgICA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKVxuICAsIGxlYWtTdG9yZSA9IHdlYWsubGVha1N0b3JlXG4gICwgSUQgICAgICAgID0gd2Vhay5JRFxuICAsIFdFQUsgICAgICA9IHdlYWsuV0VBS1xuICAsIGhhcyAgICAgICA9ICQuaGFzXG4gICwgaXNPYmplY3QgID0gJC5pc09iamVjdFxuICAsIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgaXNPYmplY3RcbiAgLCB0bXAgICAgICAgPSB7fTtcblxuLy8gMjMuMyBXZWFrTWFwIE9iamVjdHNcbnZhciAkV2Vha01hcCA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1dlYWtNYXAnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gV2Vha01hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50c1swXSk7IH07XG59LCB7XG4gIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgaWYoaXNPYmplY3Qoa2V5KSl7XG4gICAgICBpZighaXNFeHRlbnNpYmxlKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5nZXQoa2V5KTtcbiAgICAgIGlmKGhhcyhrZXksIFdFQUspKXJldHVybiBrZXlbV0VBS11bdGhpc1tJRF1dO1xuICAgIH1cbiAgfSxcbiAgLy8gMjMuMy4zLjUgV2Vha01hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpe1xuICAgIHJldHVybiB3ZWFrLmRlZih0aGlzLCBrZXksIHZhbHVlKTtcbiAgfVxufSwgd2VhaywgdHJ1ZSwgdHJ1ZSk7XG5cbi8vIElFMTEgV2Vha01hcCBmcm96ZW4ga2V5cyBmaXhcbmlmKG5ldyAkV2Vha01hcCgpLnNldCgoT2JqZWN0LmZyZWV6ZSB8fCBPYmplY3QpKHRtcCksIDcpLmdldCh0bXApICE9IDcpe1xuICAkLmVhY2guY2FsbChbJ2RlbGV0ZScsICdoYXMnLCAnZ2V0JywgJ3NldCddLCBmdW5jdGlvbihrZXkpe1xuICAgIHZhciBwcm90byAgPSAkV2Vha01hcC5wcm90b3R5cGVcbiAgICAgICwgbWV0aG9kID0gcHJvdG9ba2V5XTtcbiAgICByZXF1aXJlKCcuLyQucmVkZWYnKShwcm90bywga2V5LCBmdW5jdGlvbihhLCBiKXtcbiAgICAgIC8vIHN0b3JlIGZyb3plbiBvYmplY3RzIG9uIGxlYWt5IG1hcFxuICAgICAgaWYoaXNPYmplY3QoYSkgJiYgIWlzRXh0ZW5zaWJsZShhKSl7XG4gICAgICAgIHZhciByZXN1bHQgPSBsZWFrU3RvcmUodGhpcylba2V5XShhLCBiKTtcbiAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICAvLyBzdG9yZSBhbGwgdGhlIHJlc3Qgb24gbmF0aXZlIHdlYWttYXBcbiAgICAgIH0gcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIGEsIGIpO1xuICAgIH0pO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG52YXIgd2VhayA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKTtcblxuLy8gMjMuNCBXZWFrU2V0IE9iamVjdHNcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1dlYWtTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gV2Vha1NldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50c1swXSk7IH07XG59LCB7XG4gIC8vIDIzLjQuMy4xIFdlYWtTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiB3ZWFrLmRlZih0aGlzLCB2YWx1ZSwgdHJ1ZSk7XG4gIH1cbn0sIHdlYWssIGZhbHNlLCB0cnVlKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZiAgICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJGluY2x1ZGVzID0gcmVxdWlyZSgnLi8kLmFycmF5LWluY2x1ZGVzJykodHJ1ZSk7XG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZG9tZW5pYy9BcnJheS5wcm90b3R5cGUuaW5jbHVkZXNcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKGVsIC8qLCBmcm9tSW5kZXggPSAwICovKXtcbiAgICByZXR1cm4gJGluY2x1ZGVzKHRoaXMsIGVsLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2luY2x1ZGVzJyk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24tdG8tanNvbicpKCdNYXAnKTsiLCIvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uLzkzNTM3ODFcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgb3duS2V5cyA9IHJlcXVpcmUoJy4vJC5vd24ta2V5cycpO1xuXG4kZGVmKCRkZWYuUywgJ09iamVjdCcsIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmplY3Qpe1xuICAgIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcbiAgICAgICwgcmVzdWx0ID0ge307XG4gICAgJC5lYWNoLmNhbGwob3duS2V5cyhPKSwgZnVuY3Rpb24oa2V5KXtcbiAgICAgICQuc2V0RGVzYyhyZXN1bHQsIGtleSwgJC5kZXNjKDAsICQuZ2V0RGVzYyhPLCBrZXkpKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7IiwiLy8gaHR0cDovL2dvby5nbC9Ya0JyakRcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xuZnVuY3Rpb24gY3JlYXRlT2JqZWN0VG9BcnJheShpc0VudHJpZXMpe1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXG4gICAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBpICAgICAgPSAwXG4gICAgICAsIHJlc3VsdCA9IEFycmF5KGxlbmd0aClcbiAgICAgICwga2V5O1xuICAgIGlmKGlzRW50cmllcyl3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IFtrZXkgPSBrZXlzW2krK10sIE9ba2V5XV07XG4gICAgZWxzZSB3aGlsZShsZW5ndGggPiBpKXJlc3VsdFtpXSA9IE9ba2V5c1tpKytdXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XG4gIHZhbHVlczogIGNyZWF0ZU9iamVjdFRvQXJyYXkoZmFsc2UpLFxuICBlbnRyaWVzOiBjcmVhdGVPYmplY3RUb0FycmF5KHRydWUpXG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vYmVuamFtaW5nci9SZXhFeHAuZXNjYXBlXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcbiRkZWYoJGRlZi5TLCAnUmVnRXhwJywge1xuICBlc2NhcGU6IHJlcXVpcmUoJy4vJC5yZXBsYWNlcicpKC9bXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicsIHRydWUpXG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbi10by1qc29uJykoJ1NldCcpOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUuYXRcbid1c2Ugc3RyaWN0JztcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJGF0ICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKSh0cnVlKTtcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xuICBhdDogZnVuY3Rpb24gYXQocG9zKXtcbiAgICByZXR1cm4gJGF0KHRoaXMsIHBvcyk7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpXG4gICwgJHBhZCA9IHJlcXVpcmUoJy4vJC5zdHJpbmctcGFkJyk7XG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcbiAgbHBhZDogZnVuY3Rpb24gbHBhZChuKXtcbiAgICByZXR1cm4gJHBhZCh0aGlzLCBuLCBhcmd1bWVudHNbMV0sIHRydWUpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRwYWQgPSByZXF1aXJlKCcuLyQuc3RyaW5nLXBhZCcpO1xuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XG4gIHJwYWQ6IGZ1bmN0aW9uIHJwYWQobil7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbiwgYXJndW1lbnRzWzFdLCBmYWxzZSk7XG4gIH1cbn0pOyIsIi8vIEphdmFTY3JpcHQgMS42IC8gU3RyYXdtYW4gYXJyYXkgc3RhdGljcyBzaGltXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsICRBcnJheSAgPSAkLmNvcmUuQXJyYXkgfHwgQXJyYXlcbiAgLCBzdGF0aWNzID0ge307XG5mdW5jdGlvbiBzZXRTdGF0aWNzKGtleXMsIGxlbmd0aCl7XG4gICQuZWFjaC5jYWxsKGtleXMuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcbiAgICBpZihsZW5ndGggPT0gdW5kZWZpbmVkICYmIGtleSBpbiAkQXJyYXkpc3RhdGljc1trZXldID0gJEFycmF5W2tleV07XG4gICAgZWxzZSBpZihrZXkgaW4gW10pc3RhdGljc1trZXldID0gcmVxdWlyZSgnLi8kLmN0eCcpKEZ1bmN0aW9uLmNhbGwsIFtdW2tleV0sIGxlbmd0aCk7XG4gIH0pO1xufVxuc2V0U3RhdGljcygncG9wLHJldmVyc2Usc2hpZnQsa2V5cyx2YWx1ZXMsZW50cmllcycsIDEpO1xuc2V0U3RhdGljcygnaW5kZXhPZixldmVyeSxzb21lLGZvckVhY2gsbWFwLGZpbHRlcixmaW5kLGZpbmRJbmRleCxpbmNsdWRlcycsIDMpO1xuc2V0U3RhdGljcygnam9pbixzbGljZSxjb25jYXQscHVzaCxzcGxpY2UsdW5zaGlmdCxzb3J0LGxhc3RJbmRleE9mLCcgK1xuICAgICAgICAgICAncmVkdWNlLHJlZHVjZVJpZ2h0LGNvcHlXaXRoaW4sZmlsbCx0dXJuJyk7XG4kZGVmKCRkZWYuUywgJ0FycmF5Jywgc3RhdGljcyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgSXRlcmF0b3JzICAgPSByZXF1aXJlKCcuLyQuaXRlcicpLkl0ZXJhdG9yc1xuICAsIElURVJBVE9SICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlWYWx1ZXMgPSBJdGVyYXRvcnMuQXJyYXlcbiAgLCBOTCAgICAgICAgICA9ICQuZy5Ob2RlTGlzdFxuICAsIEhUQyAgICAgICAgID0gJC5nLkhUTUxDb2xsZWN0aW9uXG4gICwgTkxQcm90byAgICAgPSBOTCAmJiBOTC5wcm90b3R5cGVcbiAgLCBIVENQcm90byAgICA9IEhUQyAmJiBIVEMucHJvdG90eXBlO1xuaWYoJC5GVyl7XG4gIGlmKE5MICYmICEoSVRFUkFUT1IgaW4gTkxQcm90bykpJC5oaWRlKE5MUHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG4gIGlmKEhUQyAmJiAhKElURVJBVE9SIGluIEhUQ1Byb3RvKSkkLmhpZGUoSFRDUHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG59XG5JdGVyYXRvcnMuTm9kZUxpc3QgPSBJdGVyYXRvcnMuSFRNTENvbGxlY3Rpb24gPSBBcnJheVZhbHVlczsiLCJ2YXIgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcbiAgLCAkdGFzayA9IHJlcXVpcmUoJy4vJC50YXNrJyk7XG4kZGVmKCRkZWYuRyArICRkZWYuQiwge1xuICBzZXRJbW1lZGlhdGU6ICAgJHRhc2suc2V0LFxuICBjbGVhckltbWVkaWF0ZTogJHRhc2suY2xlYXJcbn0pOyIsIi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRkZWYgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxuICAsIGludm9rZSAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIHBhcnRpYWwgICA9IHJlcXVpcmUoJy4vJC5wYXJ0aWFsJylcbiAgLCBuYXZpZ2F0b3IgPSAkLmcubmF2aWdhdG9yXG4gICwgTVNJRSAgICAgID0gISFuYXZpZ2F0b3IgJiYgL01TSUUgLlxcLi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xuZnVuY3Rpb24gd3JhcChzZXQpe1xuICByZXR1cm4gTVNJRSA/IGZ1bmN0aW9uKGZuLCB0aW1lIC8qLCAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gc2V0KGludm9rZShcbiAgICAgIHBhcnRpYWwsXG4gICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAkLmlzRnVuY3Rpb24oZm4pID8gZm4gOiBGdW5jdGlvbihmbilcbiAgICApLCB0aW1lKTtcbiAgfSA6IHNldDtcbn1cbiRkZWYoJGRlZi5HICsgJGRlZi5CICsgJGRlZi5GICogTVNJRSwge1xuICBzZXRUaW1lb3V0OiAgd3JhcCgkLmcuc2V0VGltZW91dCksXG4gIHNldEludGVydmFsOiB3cmFwKCQuZy5zZXRJbnRlcnZhbClcbn0pOyIsInJlcXVpcmUoJy4vbW9kdWxlcy9lczUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmlzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LnN0YXRpY3MtYWNjZXB0LXByaW1pdGl2ZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5mdW5jdGlvbi5oYXMtaW5zdGFuY2UnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubnVtYmVyLmNvbnN0cnVjdG9yJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5zdGF0aWNzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcucmF3Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuY29kZS1wb2ludC1hdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuZW5kcy13aXRoJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5zdGFydHMtd2l0aCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5Lm9mJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuY29weS13aXRoaW4nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmlsbCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maW5kJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbmQtaW5kZXgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVnZXhwJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWFwJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnNldCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLW1hcCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLXNldCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnN0cmluZy5hdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcubHBhZCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcucnBhZCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5yZWdleHAuZXNjYXBlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC50by1hcnJheScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIudGltZXJzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLmltbWVkaWF0ZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tb2R1bGVzLyQnKS5jb3JlO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IGdsLW1hdHJpeCAtIEhpZ2ggcGVyZm9ybWFuY2UgbWF0cml4IGFuZCB2ZWN0b3Igb3BlcmF0aW9uc1xuICogQGF1dGhvciBCcmFuZG9uIEpvbmVzXG4gKiBAYXV0aG9yIENvbGluIE1hY0tlbnppZSBJVlxuICogQHZlcnNpb24gMi4zLjBcbiAqL1xuXG4vKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuLy8gRU5EIEhFQURFUlxuXG5leHBvcnRzLmdsTWF0cml4ID0gcmVxdWlyZShcIi4vZ2wtbWF0cml4L2NvbW1vbi5qc1wiKTtcbmV4cG9ydHMubWF0MiA9IHJlcXVpcmUoXCIuL2dsLW1hdHJpeC9tYXQyLmpzXCIpO1xuZXhwb3J0cy5tYXQyZCA9IHJlcXVpcmUoXCIuL2dsLW1hdHJpeC9tYXQyZC5qc1wiKTtcbmV4cG9ydHMubWF0MyA9IHJlcXVpcmUoXCIuL2dsLW1hdHJpeC9tYXQzLmpzXCIpO1xuZXhwb3J0cy5tYXQ0ID0gcmVxdWlyZShcIi4vZ2wtbWF0cml4L21hdDQuanNcIik7XG5leHBvcnRzLnF1YXQgPSByZXF1aXJlKFwiLi9nbC1tYXRyaXgvcXVhdC5qc1wiKTtcbmV4cG9ydHMudmVjMiA9IHJlcXVpcmUoXCIuL2dsLW1hdHJpeC92ZWMyLmpzXCIpO1xuZXhwb3J0cy52ZWMzID0gcmVxdWlyZShcIi4vZ2wtbWF0cml4L3ZlYzMuanNcIik7XG5leHBvcnRzLnZlYzQgPSByZXF1aXJlKFwiLi9nbC1tYXRyaXgvdmVjNC5qc1wiKTsiLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuXG4vKipcbiAqIEBjbGFzcyBDb21tb24gdXRpbGl0aWVzXG4gKiBAbmFtZSBnbE1hdHJpeFxuICovXG52YXIgZ2xNYXRyaXggPSB7fTtcblxuLy8gQ29uc3RhbnRzXG5nbE1hdHJpeC5FUFNJTE9OID0gMC4wMDAwMDE7XG5nbE1hdHJpeC5BUlJBWV9UWVBFID0gKHR5cGVvZiBGbG9hdDMyQXJyYXkgIT09ICd1bmRlZmluZWQnKSA/IEZsb2F0MzJBcnJheSA6IEFycmF5O1xuZ2xNYXRyaXguUkFORE9NID0gTWF0aC5yYW5kb207XG5cbi8qKlxuICogU2V0cyB0aGUgdHlwZSBvZiBhcnJheSB1c2VkIHdoZW4gY3JlYXRpbmcgbmV3IHZlY3RvcnMgYW5kIG1hdHJpY2VzXG4gKlxuICogQHBhcmFtIHtUeXBlfSB0eXBlIEFycmF5IHR5cGUsIHN1Y2ggYXMgRmxvYXQzMkFycmF5IG9yIEFycmF5XG4gKi9cbmdsTWF0cml4LnNldE1hdHJpeEFycmF5VHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBHTE1BVF9BUlJBWV9UWVBFID0gdHlwZTtcbn1cblxudmFyIGRlZ3JlZSA9IE1hdGguUEkgLyAxODA7XG5cbi8qKlxuKiBDb252ZXJ0IERlZ3JlZSBUbyBSYWRpYW5cbipcbiogQHBhcmFtIHtOdW1iZXJ9IEFuZ2xlIGluIERlZ3JlZXNcbiovXG5nbE1hdHJpeC50b1JhZGlhbiA9IGZ1bmN0aW9uKGEpe1xuICAgICByZXR1cm4gYSAqIGRlZ3JlZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnbE1hdHJpeDtcbiIsIi8qIENvcHlyaWdodCAoYykgMjAxNSwgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuICovXG5cbnZhciBnbE1hdHJpeCA9IHJlcXVpcmUoXCIuL2NvbW1vbi5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgMngyIE1hdHJpeFxuICogQG5hbWUgbWF0MlxuICovXG52YXIgbWF0MiA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0MlxuICpcbiAqIEByZXR1cm5zIHttYXQyfSBhIG5ldyAyeDIgbWF0cml4XG4gKi9cbm1hdDIuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBtYXQyIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQyfSBhIG1hdHJpeCB0byBjbG9uZVxuICogQHJldHVybnMge21hdDJ9IGEgbmV3IDJ4MiBtYXRyaXhcbiAqL1xubWF0Mi5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoNCk7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbWF0MiB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0Mn0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDJ9IG91dFxuICovXG5tYXQyLmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCBhIG1hdDIgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIuaWRlbnRpdHkgPSBmdW5jdGlvbihvdXQpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zcG9zZSB0aGUgdmFsdWVzIG9mIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi50cmFuc3Bvc2UgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICB2YXIgYTEgPSBhWzFdO1xuICAgICAgICBvdXRbMV0gPSBhWzJdO1xuICAgICAgICBvdXRbMl0gPSBhMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvdXRbMF0gPSBhWzBdO1xuICAgICAgICBvdXRbMV0gPSBhWzJdO1xuICAgICAgICBvdXRbMl0gPSBhWzFdO1xuICAgICAgICBvdXRbM10gPSBhWzNdO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBJbnZlcnRzIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5pbnZlcnQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLFxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICAgICAgZGV0ID0gYTAgKiBhMyAtIGEyICogYTE7XG5cbiAgICBpZiAoIWRldCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZGV0ID0gMS4wIC8gZGV0O1xuICAgIFxuICAgIG91dFswXSA9ICBhMyAqIGRldDtcbiAgICBvdXRbMV0gPSAtYTEgKiBkZXQ7XG4gICAgb3V0WzJdID0gLWEyICogZGV0O1xuICAgIG91dFszXSA9ICBhMCAqIGRldDtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5hZGpvaW50ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgLy8gQ2FjaGluZyB0aGlzIHZhbHVlIGlzIG5lc3NlY2FyeSBpZiBvdXQgPT0gYVxuICAgIHZhciBhMCA9IGFbMF07XG4gICAgb3V0WzBdID0gIGFbM107XG4gICAgb3V0WzFdID0gLWFbMV07XG4gICAgb3V0WzJdID0gLWFbMl07XG4gICAgb3V0WzNdID0gIGEwO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSBtYXQyXG4gKlxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXG4gKi9cbm1hdDIuZGV0ZXJtaW5hbnQgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBhWzBdICogYVszXSAtIGFbMl0gKiBhWzFdO1xufTtcblxuLyoqXG4gKiBNdWx0aXBsaWVzIHR3byBtYXQyJ3NcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge21hdDJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIubXVsdGlwbHkgPSBmdW5jdGlvbiAob3V0LCBhLCBiKSB7XG4gICAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXTtcbiAgICB2YXIgYjAgPSBiWzBdLCBiMSA9IGJbMV0sIGIyID0gYlsyXSwgYjMgPSBiWzNdO1xuICAgIG91dFswXSA9IGEwICogYjAgKyBhMiAqIGIxO1xuICAgIG91dFsxXSA9IGExICogYjAgKyBhMyAqIGIxO1xuICAgIG91dFsyXSA9IGEwICogYjIgKyBhMiAqIGIzO1xuICAgIG91dFszXSA9IGExICogYjIgKyBhMyAqIGIzO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0Mi5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5tYXQyLm11bCA9IG1hdDIubXVsdGlwbHk7XG5cbi8qKlxuICogUm90YXRlcyBhIG1hdDIgYnkgdGhlIGdpdmVuIGFuZ2xlXG4gKlxuICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0Mn0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5yb3RhdGUgPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLFxuICAgICAgICBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgb3V0WzBdID0gYTAgKiAgYyArIGEyICogcztcbiAgICBvdXRbMV0gPSBhMSAqICBjICsgYTMgKiBzO1xuICAgIG91dFsyXSA9IGEwICogLXMgKyBhMiAqIGM7XG4gICAgb3V0WzNdID0gYTEgKiAtcyArIGEzICogYztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTY2FsZXMgdGhlIG1hdDIgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzJcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge3ZlYzJ9IHYgdGhlIHZlYzIgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDJ9IG91dFxuICoqL1xubWF0Mi5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgdikge1xuICAgIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sXG4gICAgICAgIHYwID0gdlswXSwgdjEgPSB2WzFdO1xuICAgIG91dFswXSA9IGEwICogdjA7XG4gICAgb3V0WzFdID0gYTEgKiB2MDtcbiAgICBvdXRbMl0gPSBhMiAqIHYxO1xuICAgIG91dFszXSA9IGEzICogdjE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgZ2l2ZW4gYW5nbGVcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQyLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDIucm90YXRlKGRlc3QsIGRlc3QsIHJhZCk7XG4gKlxuICogQHBhcmFtIHttYXQyfSBvdXQgbWF0MiByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5mcm9tUm90YXRpb24gPSBmdW5jdGlvbihvdXQsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgb3V0WzBdID0gYztcbiAgICBvdXRbMV0gPSBzO1xuICAgIG91dFsyXSA9IC1zO1xuICAgIG91dFszXSA9IGM7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB2ZWN0b3Igc2NhbGluZ1xuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDIuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0Mi5zY2FsZShkZXN0LCBkZXN0LCB2ZWMpO1xuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IG1hdDIgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7dmVjMn0gdiBTY2FsaW5nIHZlY3RvclxuICogQHJldHVybnMge21hdDJ9IG91dFxuICovXG5tYXQyLmZyb21TY2FsaW5nID0gZnVuY3Rpb24ob3V0LCB2KSB7XG4gICAgb3V0WzBdID0gdlswXTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gdlsxXTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBtYXQyXG4gKlxuICogQHBhcmFtIHttYXQyfSBtYXQgbWF0cml4IHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXhcbiAqL1xubWF0Mi5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAnbWF0MignICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgYVszXSArICcpJztcbn07XG5cbi8qKlxuICogUmV0dXJucyBGcm9iZW5pdXMgbm9ybSBvZiBhIG1hdDJcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIG1hdHJpeCB0byBjYWxjdWxhdGUgRnJvYmVuaXVzIG5vcm0gb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IEZyb2Jlbml1cyBub3JtXG4gKi9cbm1hdDIuZnJvYiA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuKE1hdGguc3FydChNYXRoLnBvdyhhWzBdLCAyKSArIE1hdGgucG93KGFbMV0sIDIpICsgTWF0aC5wb3coYVsyXSwgMikgKyBNYXRoLnBvdyhhWzNdLCAyKSkpXG59O1xuXG4vKipcbiAqIFJldHVybnMgTCwgRCBhbmQgVSBtYXRyaWNlcyAoTG93ZXIgdHJpYW5ndWxhciwgRGlhZ29uYWwgYW5kIFVwcGVyIHRyaWFuZ3VsYXIpIGJ5IGZhY3Rvcml6aW5nIHRoZSBpbnB1dCBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0Mn0gTCB0aGUgbG93ZXIgdHJpYW5ndWxhciBtYXRyaXggXG4gKiBAcGFyYW0ge21hdDJ9IEQgdGhlIGRpYWdvbmFsIG1hdHJpeCBcbiAqIEBwYXJhbSB7bWF0Mn0gVSB0aGUgdXBwZXIgdHJpYW5ndWxhciBtYXRyaXggXG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIGlucHV0IG1hdHJpeCB0byBmYWN0b3JpemVcbiAqL1xuXG5tYXQyLkxEVSA9IGZ1bmN0aW9uIChMLCBELCBVLCBhKSB7IFxuICAgIExbMl0gPSBhWzJdL2FbMF07IFxuICAgIFVbMF0gPSBhWzBdOyBcbiAgICBVWzFdID0gYVsxXTsgXG4gICAgVVszXSA9IGFbM10gLSBMWzJdICogVVsxXTsgXG4gICAgcmV0dXJuIFtMLCBELCBVXTsgICAgICAgXG59OyBcblxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdDI7XG4iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuXG52YXIgZ2xNYXRyaXggPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG5cbi8qKlxuICogQGNsYXNzIDJ4MyBNYXRyaXhcbiAqIEBuYW1lIG1hdDJkXG4gKiBcbiAqIEBkZXNjcmlwdGlvbiBcbiAqIEEgbWF0MmQgY29udGFpbnMgc2l4IGVsZW1lbnRzIGRlZmluZWQgYXM6XG4gKiA8cHJlPlxuICogW2EsIGMsIHR4LFxuICogIGIsIGQsIHR5XVxuICogPC9wcmU+XG4gKiBUaGlzIGlzIGEgc2hvcnQgZm9ybSBmb3IgdGhlIDN4MyBtYXRyaXg6XG4gKiA8cHJlPlxuICogW2EsIGMsIHR4LFxuICogIGIsIGQsIHR5LFxuICogIDAsIDAsIDFdXG4gKiA8L3ByZT5cbiAqIFRoZSBsYXN0IHJvdyBpcyBpZ25vcmVkIHNvIHRoZSBhcnJheSBpcyBzaG9ydGVyIGFuZCBvcGVyYXRpb25zIGFyZSBmYXN0ZXIuXG4gKi9cbnZhciBtYXQyZCA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0MmRcbiAqXG4gKiBAcmV0dXJucyB7bWF0MmR9IGEgbmV3IDJ4MyBtYXRyaXhcbiAqL1xubWF0MmQuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDYpO1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0MmQgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyBtYXRyaXhcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBhIG1hdHJpeCB0byBjbG9uZVxuICogQHJldHVybnMge21hdDJkfSBhIG5ldyAyeDMgbWF0cml4XG4gKi9cbm1hdDJkLmNsb25lID0gZnVuY3Rpb24oYSkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSg2KTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbWF0MmQgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqL1xubWF0MmQuY29weSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCBhIG1hdDJkIHRvIHRoZSBpZGVudGl0eSBtYXRyaXhcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKi9cbm1hdDJkLmlkZW50aXR5ID0gZnVuY3Rpb24ob3V0KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMTtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogSW52ZXJ0cyBhIG1hdDJkXG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICovXG5tYXQyZC5pbnZlcnQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgYWEgPSBhWzBdLCBhYiA9IGFbMV0sIGFjID0gYVsyXSwgYWQgPSBhWzNdLFxuICAgICAgICBhdHggPSBhWzRdLCBhdHkgPSBhWzVdO1xuXG4gICAgdmFyIGRldCA9IGFhICogYWQgLSBhYiAqIGFjO1xuICAgIGlmKCFkZXQpe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZGV0ID0gMS4wIC8gZGV0O1xuXG4gICAgb3V0WzBdID0gYWQgKiBkZXQ7XG4gICAgb3V0WzFdID0gLWFiICogZGV0O1xuICAgIG91dFsyXSA9IC1hYyAqIGRldDtcbiAgICBvdXRbM10gPSBhYSAqIGRldDtcbiAgICBvdXRbNF0gPSAoYWMgKiBhdHkgLSBhZCAqIGF0eCkgKiBkZXQ7XG4gICAgb3V0WzVdID0gKGFiICogYXR4IC0gYWEgKiBhdHkpICogZGV0O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0MmRcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXG4gKi9cbm1hdDJkLmRldGVybWluYW50ID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gYVswXSAqIGFbM10gLSBhWzFdICogYVsyXTtcbn07XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gbWF0MmQnc1xuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHttYXQyZH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKi9cbm1hdDJkLm11bHRpcGx5ID0gZnVuY3Rpb24gKG91dCwgYSwgYikge1xuICAgIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sIGE0ID0gYVs0XSwgYTUgPSBhWzVdLFxuICAgICAgICBiMCA9IGJbMF0sIGIxID0gYlsxXSwgYjIgPSBiWzJdLCBiMyA9IGJbM10sIGI0ID0gYls0XSwgYjUgPSBiWzVdO1xuICAgIG91dFswXSA9IGEwICogYjAgKyBhMiAqIGIxO1xuICAgIG91dFsxXSA9IGExICogYjAgKyBhMyAqIGIxO1xuICAgIG91dFsyXSA9IGEwICogYjIgKyBhMiAqIGIzO1xuICAgIG91dFszXSA9IGExICogYjIgKyBhMyAqIGIzO1xuICAgIG91dFs0XSA9IGEwICogYjQgKyBhMiAqIGI1ICsgYTQ7XG4gICAgb3V0WzVdID0gYTEgKiBiNCArIGEzICogYjUgKyBhNTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDJkLm11bHRpcGx5fVxuICogQGZ1bmN0aW9uXG4gKi9cbm1hdDJkLm11bCA9IG1hdDJkLm11bHRpcGx5O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXQyZCBieSB0aGUgZ2l2ZW4gYW5nbGVcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICovXG5tYXQyZC5yb3RhdGUgPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLCBhNCA9IGFbNF0sIGE1ID0gYVs1XSxcbiAgICAgICAgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGEwICogIGMgKyBhMiAqIHM7XG4gICAgb3V0WzFdID0gYTEgKiAgYyArIGEzICogcztcbiAgICBvdXRbMl0gPSBhMCAqIC1zICsgYTIgKiBjO1xuICAgIG91dFszXSA9IGExICogLXMgKyBhMyAqIGM7XG4gICAgb3V0WzRdID0gYTQ7XG4gICAgb3V0WzVdID0gYTU7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2NhbGVzIHRoZSBtYXQyZCBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjMlxuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICogQHBhcmFtIHt2ZWMyfSB2IHRoZSB2ZWMyIHRvIHNjYWxlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKiovXG5tYXQyZC5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgdikge1xuICAgIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sIGE0ID0gYVs0XSwgYTUgPSBhWzVdLFxuICAgICAgICB2MCA9IHZbMF0sIHYxID0gdlsxXTtcbiAgICBvdXRbMF0gPSBhMCAqIHYwO1xuICAgIG91dFsxXSA9IGExICogdjA7XG4gICAgb3V0WzJdID0gYTIgKiB2MTtcbiAgICBvdXRbM10gPSBhMyAqIHYxO1xuICAgIG91dFs0XSA9IGE0O1xuICAgIG91dFs1XSA9IGE1O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zbGF0ZXMgdGhlIG1hdDJkIGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMyXG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gdHJhbnNsYXRlXG4gKiBAcGFyYW0ge3ZlYzJ9IHYgdGhlIHZlYzIgdG8gdHJhbnNsYXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKiovXG5tYXQyZC50cmFuc2xhdGUgPSBmdW5jdGlvbihvdXQsIGEsIHYpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLCBhNCA9IGFbNF0sIGE1ID0gYVs1XSxcbiAgICAgICAgdjAgPSB2WzBdLCB2MSA9IHZbMV07XG4gICAgb3V0WzBdID0gYTA7XG4gICAgb3V0WzFdID0gYTE7XG4gICAgb3V0WzJdID0gYTI7XG4gICAgb3V0WzNdID0gYTM7XG4gICAgb3V0WzRdID0gYTAgKiB2MCArIGEyICogdjEgKyBhNDtcbiAgICBvdXRbNV0gPSBhMSAqIHYwICsgYTMgKiB2MSArIGE1O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIGdpdmVuIGFuZ2xlXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0MmQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0MmQucm90YXRlKGRlc3QsIGRlc3QsIHJhZCk7XG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IG1hdDJkIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqL1xubWF0MmQuZnJvbVJvdGF0aW9uID0gZnVuY3Rpb24ob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIG91dFswXSA9IGM7XG4gICAgb3V0WzFdID0gcztcbiAgICBvdXRbMl0gPSAtcztcbiAgICBvdXRbM10gPSBjO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHZlY3RvciBzY2FsaW5nXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0MmQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0MmQuc2NhbGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgbWF0MmQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7dmVjMn0gdiBTY2FsaW5nIHZlY3RvclxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqL1xubWF0MmQuZnJvbVNjYWxpbmcgPSBmdW5jdGlvbihvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSB2WzBdO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSB2WzFdO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHZlY3RvciB0cmFuc2xhdGlvblxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDJkLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDJkLnRyYW5zbGF0ZShkZXN0LCBkZXN0LCB2ZWMpO1xuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCBtYXQyZCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHt2ZWMyfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqL1xubWF0MmQuZnJvbVRyYW5zbGF0aW9uID0gZnVuY3Rpb24ob3V0LCB2KSB7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMTtcbiAgICBvdXRbNF0gPSB2WzBdO1xuICAgIG91dFs1XSA9IHZbMV07XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0MmRcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBhIG1hdHJpeCB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gKi9cbm1hdDJkLnN0ciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuICdtYXQyZCgnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgXG4gICAgICAgICAgICAgICAgICAgIGFbM10gKyAnLCAnICsgYVs0XSArICcsICcgKyBhWzVdICsgJyknO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIEZyb2Jlbml1cyBub3JtIG9mIGEgbWF0MmRcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBGcm9iZW5pdXMgbm9ybVxuICovXG5tYXQyZC5mcm9iID0gZnVuY3Rpb24gKGEpIHsgXG4gICAgcmV0dXJuKE1hdGguc3FydChNYXRoLnBvdyhhWzBdLCAyKSArIE1hdGgucG93KGFbMV0sIDIpICsgTWF0aC5wb3coYVsyXSwgMikgKyBNYXRoLnBvdyhhWzNdLCAyKSArIE1hdGgucG93KGFbNF0sIDIpICsgTWF0aC5wb3coYVs1XSwgMikgKyAxKSlcbn07IFxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdDJkO1xuIiwiLyogQ29weXJpZ2h0IChjKSAyMDE1LCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cblxudmFyIGdsTWF0cml4ID0gcmVxdWlyZShcIi4vY29tbW9uLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyAzeDMgTWF0cml4XG4gKiBAbmFtZSBtYXQzXG4gKi9cbnZhciBtYXQzID0ge307XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBpZGVudGl0eSBtYXQzXG4gKlxuICogQHJldHVybnMge21hdDN9IGEgbmV3IDN4MyBtYXRyaXhcbiAqL1xubWF0My5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoOSk7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAxO1xuICAgIG91dFs1XSA9IDA7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29waWVzIHRoZSB1cHBlci1sZWZ0IDN4MyB2YWx1ZXMgaW50byB0aGUgZ2l2ZW4gbWF0My5cbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIDN4MyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSAgIHRoZSBzb3VyY2UgNHg0IG1hdHJpeFxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLmZyb21NYXQ0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVs0XTtcbiAgICBvdXRbNF0gPSBhWzVdO1xuICAgIG91dFs1XSA9IGFbNl07XG4gICAgb3V0WzZdID0gYVs4XTtcbiAgICBvdXRbN10gPSBhWzldO1xuICAgIG91dFs4XSA9IGFbMTBdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0MyBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0M30gYSBtYXRyaXggdG8gY2xvbmVcbiAqIEByZXR1cm5zIHttYXQzfSBhIG5ldyAzeDMgbWF0cml4XG4gKi9cbm1hdDMuY2xvbmUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDkpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBtYXQzIHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuY29weSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCBhIG1hdDMgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuaWRlbnRpdHkgPSBmdW5jdGlvbihvdXQpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDE7XG4gICAgb3V0WzVdID0gMDtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMudHJhbnNwb3NlID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgLy8gSWYgd2UgYXJlIHRyYW5zcG9zaW5nIG91cnNlbHZlcyB3ZSBjYW4gc2tpcCBhIGZldyBzdGVwcyBidXQgaGF2ZSB0byBjYWNoZSBzb21lIHZhbHVlc1xuICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgdmFyIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMiA9IGFbNV07XG4gICAgICAgIG91dFsxXSA9IGFbM107XG4gICAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICAgIG91dFszXSA9IGEwMTtcbiAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgb3V0WzZdID0gYTAyO1xuICAgICAgICBvdXRbN10gPSBhMTI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3V0WzBdID0gYVswXTtcbiAgICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgICAgb3V0WzJdID0gYVs2XTtcbiAgICAgICAgb3V0WzNdID0gYVsxXTtcbiAgICAgICAgb3V0WzRdID0gYVs0XTtcbiAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgb3V0WzZdID0gYVsyXTtcbiAgICAgICAgb3V0WzddID0gYVs1XTtcbiAgICAgICAgb3V0WzhdID0gYVs4XTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogSW52ZXJ0cyBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuaW52ZXJ0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sXG4gICAgICAgIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sXG4gICAgICAgIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sXG5cbiAgICAgICAgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxLFxuICAgICAgICBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwLFxuICAgICAgICBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjAsXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XG5cbiAgICBpZiAoIWRldCkgeyBcbiAgICAgICAgcmV0dXJuIG51bGw7IFxuICAgIH1cbiAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICBvdXRbMF0gPSBiMDEgKiBkZXQ7XG4gICAgb3V0WzFdID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xuICAgIG91dFsyXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xuICAgIG91dFszXSA9IGIxMSAqIGRldDtcbiAgICBvdXRbNF0gPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcbiAgICBvdXRbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XG4gICAgb3V0WzZdID0gYjIxICogZGV0O1xuICAgIG91dFs3XSA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcbiAgICBvdXRbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuYWRqb2ludCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLFxuICAgICAgICBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLFxuICAgICAgICBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdO1xuXG4gICAgb3V0WzBdID0gKGExMSAqIGEyMiAtIGExMiAqIGEyMSk7XG4gICAgb3V0WzFdID0gKGEwMiAqIGEyMSAtIGEwMSAqIGEyMik7XG4gICAgb3V0WzJdID0gKGEwMSAqIGExMiAtIGEwMiAqIGExMSk7XG4gICAgb3V0WzNdID0gKGExMiAqIGEyMCAtIGExMCAqIGEyMik7XG4gICAgb3V0WzRdID0gKGEwMCAqIGEyMiAtIGEwMiAqIGEyMCk7XG4gICAgb3V0WzVdID0gKGEwMiAqIGExMCAtIGEwMCAqIGExMik7XG4gICAgb3V0WzZdID0gKGExMCAqIGEyMSAtIGExMSAqIGEyMCk7XG4gICAgb3V0WzddID0gKGEwMSAqIGEyMCAtIGEwMCAqIGEyMSk7XG4gICAgb3V0WzhdID0gKGEwMCAqIGExMSAtIGEwMSAqIGExMCk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSBtYXQzXG4gKlxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXG4gKi9cbm1hdDMuZGV0ZXJtaW5hbnQgPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLFxuICAgICAgICBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLFxuICAgICAgICBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdO1xuXG4gICAgcmV0dXJuIGEwMCAqIChhMjIgKiBhMTEgLSBhMTIgKiBhMjEpICsgYTAxICogKC1hMjIgKiBhMTAgKyBhMTIgKiBhMjApICsgYTAyICogKGEyMSAqIGExMCAtIGExMSAqIGEyMCk7XG59O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIG1hdDMnc1xuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7bWF0M30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My5tdWx0aXBseSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSxcbiAgICAgICAgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSxcbiAgICAgICAgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSxcblxuICAgICAgICBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLFxuICAgICAgICBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLFxuICAgICAgICBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xuXG4gICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xuICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcbiAgICBvdXRbMl0gPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XG5cbiAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XG4gICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xuICAgIG91dFs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcblxuICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcbiAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XG4gICAgb3V0WzhdID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0My5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5tYXQzLm11bCA9IG1hdDMubXVsdGlwbHk7XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWF0MyBieSB0aGUgZ2l2ZW4gdmVjdG9yXG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0M30gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICogQHBhcmFtIHt2ZWMyfSB2IHZlY3RvciB0byB0cmFuc2xhdGUgYnlcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My50cmFuc2xhdGUgPSBmdW5jdGlvbihvdXQsIGEsIHYpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSxcbiAgICAgICAgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSxcbiAgICAgICAgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSxcbiAgICAgICAgeCA9IHZbMF0sIHkgPSB2WzFdO1xuXG4gICAgb3V0WzBdID0gYTAwO1xuICAgIG91dFsxXSA9IGEwMTtcbiAgICBvdXRbMl0gPSBhMDI7XG5cbiAgICBvdXRbM10gPSBhMTA7XG4gICAgb3V0WzRdID0gYTExO1xuICAgIG91dFs1XSA9IGExMjtcblxuICAgIG91dFs2XSA9IHggKiBhMDAgKyB5ICogYTEwICsgYTIwO1xuICAgIG91dFs3XSA9IHggKiBhMDEgKyB5ICogYTExICsgYTIxO1xuICAgIG91dFs4XSA9IHggKiBhMDIgKyB5ICogYTEyICsgYTIyO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXQzIGJ5IHRoZSBnaXZlbiBhbmdsZVxuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMucm90YXRlID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sXG4gICAgICAgIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sXG4gICAgICAgIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sXG5cbiAgICAgICAgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgb3V0WzBdID0gYyAqIGEwMCArIHMgKiBhMTA7XG4gICAgb3V0WzFdID0gYyAqIGEwMSArIHMgKiBhMTE7XG4gICAgb3V0WzJdID0gYyAqIGEwMiArIHMgKiBhMTI7XG5cbiAgICBvdXRbM10gPSBjICogYTEwIC0gcyAqIGEwMDtcbiAgICBvdXRbNF0gPSBjICogYTExIC0gcyAqIGEwMTtcbiAgICBvdXRbNV0gPSBjICogYTEyIC0gcyAqIGEwMjtcblxuICAgIG91dFs2XSA9IGEyMDtcbiAgICBvdXRbN10gPSBhMjE7XG4gICAgb3V0WzhdID0gYTIyO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyB0aGUgbWF0MyBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjMlxuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7dmVjMn0gdiB0aGUgdmVjMiB0byBzY2FsZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKiovXG5tYXQzLnNjYWxlID0gZnVuY3Rpb24ob3V0LCBhLCB2KSB7XG4gICAgdmFyIHggPSB2WzBdLCB5ID0gdlsxXTtcblxuICAgIG91dFswXSA9IHggKiBhWzBdO1xuICAgIG91dFsxXSA9IHggKiBhWzFdO1xuICAgIG91dFsyXSA9IHggKiBhWzJdO1xuXG4gICAgb3V0WzNdID0geSAqIGFbM107XG4gICAgb3V0WzRdID0geSAqIGFbNF07XG4gICAgb3V0WzVdID0geSAqIGFbNV07XG5cbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB2ZWN0b3IgdHJhbnNsYXRpb25cbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQzLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDMudHJhbnNsYXRlKGRlc3QsIGRlc3QsIHZlYyk7XG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgbWF0MyByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHt2ZWMyfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICogQHJldHVybnMge21hdDN9IG91dFxuICovXG5tYXQzLmZyb21UcmFuc2xhdGlvbiA9IGZ1bmN0aW9uKG91dCwgdikge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMTtcbiAgICBvdXRbNV0gPSAwO1xuICAgIG91dFs2XSA9IHZbMF07XG4gICAgb3V0WzddID0gdlsxXTtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgZ2l2ZW4gYW5nbGVcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQzLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDMucm90YXRlKGRlc3QsIGRlc3QsIHJhZCk7XG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgbWF0MyByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My5mcm9tUm90YXRpb24gPSBmdW5jdGlvbihvdXQsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSwgYyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICBvdXRbMF0gPSBjO1xuICAgIG91dFsxXSA9IHM7XG4gICAgb3V0WzJdID0gMDtcblxuICAgIG91dFszXSA9IC1zO1xuICAgIG91dFs0XSA9IGM7XG4gICAgb3V0WzVdID0gMDtcblxuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHNjYWxpbmdcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQzLmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDMuc2NhbGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCBtYXQzIHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3ZlYzJ9IHYgU2NhbGluZyB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My5mcm9tU2NhbGluZyA9IGZ1bmN0aW9uKG91dCwgdikge1xuICAgIG91dFswXSA9IHZbMF07XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuXG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSB2WzFdO1xuICAgIG91dFs1XSA9IDA7XG5cbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIGZyb20gYSBtYXQyZCBpbnRvIGEgbWF0M1xuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gY29weVxuICogQHJldHVybnMge21hdDN9IG91dFxuICoqL1xubWF0My5mcm9tTWF0MmQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gMDtcblxuICAgIG91dFszXSA9IGFbMl07XG4gICAgb3V0WzRdID0gYVszXTtcbiAgICBvdXRbNV0gPSAwO1xuXG4gICAgb3V0WzZdID0gYVs0XTtcbiAgICBvdXRbN10gPSBhWzVdO1xuICAgIG91dFs4XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuKiBDYWxjdWxhdGVzIGEgM3gzIG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBxdWF0ZXJuaW9uXG4qXG4qIEBwYXJhbSB7bWF0M30gb3V0IG1hdDMgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiogQHBhcmFtIHtxdWF0fSBxIFF1YXRlcm5pb24gdG8gY3JlYXRlIG1hdHJpeCBmcm9tXG4qXG4qIEByZXR1cm5zIHttYXQzfSBvdXRcbiovXG5tYXQzLmZyb21RdWF0ID0gZnVuY3Rpb24gKG91dCwgcSkge1xuICAgIHZhciB4ID0gcVswXSwgeSA9IHFbMV0sIHogPSBxWzJdLCB3ID0gcVszXSxcbiAgICAgICAgeDIgPSB4ICsgeCxcbiAgICAgICAgeTIgPSB5ICsgeSxcbiAgICAgICAgejIgPSB6ICsgeixcblxuICAgICAgICB4eCA9IHggKiB4MixcbiAgICAgICAgeXggPSB5ICogeDIsXG4gICAgICAgIHl5ID0geSAqIHkyLFxuICAgICAgICB6eCA9IHogKiB4MixcbiAgICAgICAgenkgPSB6ICogeTIsXG4gICAgICAgIHp6ID0geiAqIHoyLFxuICAgICAgICB3eCA9IHcgKiB4MixcbiAgICAgICAgd3kgPSB3ICogeTIsXG4gICAgICAgIHd6ID0gdyAqIHoyO1xuXG4gICAgb3V0WzBdID0gMSAtIHl5IC0geno7XG4gICAgb3V0WzNdID0geXggLSB3ejtcbiAgICBvdXRbNl0gPSB6eCArIHd5O1xuXG4gICAgb3V0WzFdID0geXggKyB3ejtcbiAgICBvdXRbNF0gPSAxIC0geHggLSB6ejtcbiAgICBvdXRbN10gPSB6eSAtIHd4O1xuXG4gICAgb3V0WzJdID0genggLSB3eTtcbiAgICBvdXRbNV0gPSB6eSArIHd4O1xuICAgIG91dFs4XSA9IDEgLSB4eCAtIHl5O1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuKiBDYWxjdWxhdGVzIGEgM3gzIG5vcm1hbCBtYXRyaXggKHRyYW5zcG9zZSBpbnZlcnNlKSBmcm9tIHRoZSA0eDQgbWF0cml4XG4qXG4qIEBwYXJhbSB7bWF0M30gb3V0IG1hdDMgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiogQHBhcmFtIHttYXQ0fSBhIE1hdDQgdG8gZGVyaXZlIHRoZSBub3JtYWwgbWF0cml4IGZyb21cbipcbiogQHJldHVybnMge21hdDN9IG91dFxuKi9cbm1hdDMubm9ybWFsRnJvbU1hdDQgPSBmdW5jdGlvbiAob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sIGExMSA9IGFbNV0sIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sIGEyMSA9IGFbOV0sIGEyMiA9IGFbMTBdLCBhMjMgPSBhWzExXSxcbiAgICAgICAgYTMwID0gYVsxMl0sIGEzMSA9IGFbMTNdLCBhMzIgPSBhWzE0XSwgYTMzID0gYVsxNV0sXG5cbiAgICAgICAgYjAwID0gYTAwICogYTExIC0gYTAxICogYTEwLFxuICAgICAgICBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTAsXG4gICAgICAgIGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMCxcbiAgICAgICAgYjAzID0gYTAxICogYTEyIC0gYTAyICogYTExLFxuICAgICAgICBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTEsXG4gICAgICAgIGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMixcbiAgICAgICAgYjA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwLFxuICAgICAgICBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzAsXG4gICAgICAgIGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMCxcbiAgICAgICAgYjA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxLFxuICAgICAgICBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzEsXG4gICAgICAgIGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMixcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcblxuICAgIGlmICghZGV0KSB7IFxuICAgICAgICByZXR1cm4gbnVsbDsgXG4gICAgfVxuICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgIG91dFswXSA9IChhMTEgKiBiMTEgLSBhMTIgKiBiMTAgKyBhMTMgKiBiMDkpICogZGV0O1xuICAgIG91dFsxXSA9IChhMTIgKiBiMDggLSBhMTAgKiBiMTEgLSBhMTMgKiBiMDcpICogZGV0O1xuICAgIG91dFsyXSA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xuXG4gICAgb3V0WzNdID0gKGEwMiAqIGIxMCAtIGEwMSAqIGIxMSAtIGEwMyAqIGIwOSkgKiBkZXQ7XG4gICAgb3V0WzRdID0gKGEwMCAqIGIxMSAtIGEwMiAqIGIwOCArIGEwMyAqIGIwNykgKiBkZXQ7XG4gICAgb3V0WzVdID0gKGEwMSAqIGIwOCAtIGEwMCAqIGIxMCAtIGEwMyAqIGIwNikgKiBkZXQ7XG5cbiAgICBvdXRbNl0gPSAoYTMxICogYjA1IC0gYTMyICogYjA0ICsgYTMzICogYjAzKSAqIGRldDtcbiAgICBvdXRbN10gPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldDtcbiAgICBvdXRbOF0gPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBtYXQzXG4gKlxuICogQHBhcmFtIHttYXQzfSBtYXQgbWF0cml4IHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXhcbiAqL1xubWF0My5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAnbWF0MygnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgXG4gICAgICAgICAgICAgICAgICAgIGFbM10gKyAnLCAnICsgYVs0XSArICcsICcgKyBhWzVdICsgJywgJyArIFxuICAgICAgICAgICAgICAgICAgICBhWzZdICsgJywgJyArIGFbN10gKyAnLCAnICsgYVs4XSArICcpJztcbn07XG5cbi8qKlxuICogUmV0dXJucyBGcm9iZW5pdXMgbm9ybSBvZiBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIG1hdHJpeCB0byBjYWxjdWxhdGUgRnJvYmVuaXVzIG5vcm0gb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IEZyb2Jlbml1cyBub3JtXG4gKi9cbm1hdDMuZnJvYiA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuKE1hdGguc3FydChNYXRoLnBvdyhhWzBdLCAyKSArIE1hdGgucG93KGFbMV0sIDIpICsgTWF0aC5wb3coYVsyXSwgMikgKyBNYXRoLnBvdyhhWzNdLCAyKSArIE1hdGgucG93KGFbNF0sIDIpICsgTWF0aC5wb3coYVs1XSwgMikgKyBNYXRoLnBvdyhhWzZdLCAyKSArIE1hdGgucG93KGFbN10sIDIpICsgTWF0aC5wb3coYVs4XSwgMikpKVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdDM7XG4iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuXG52YXIgZ2xNYXRyaXggPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG5cbi8qKlxuICogQGNsYXNzIDR4NCBNYXRyaXhcbiAqIEBuYW1lIG1hdDRcbiAqL1xudmFyIG1hdDQgPSB7fTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGlkZW50aXR5IG1hdDRcbiAqXG4gKiBAcmV0dXJucyB7bWF0NH0gYSBuZXcgNHg0IG1hdHJpeFxuICovXG5tYXQ0LmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgxNik7XG4gICAgb3V0WzBdID0gMTtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IDE7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG1hdDQgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyBtYXRyaXhcbiAqXG4gKiBAcGFyYW0ge21hdDR9IGEgbWF0cml4IHRvIGNsb25lXG4gKiBAcmV0dXJucyB7bWF0NH0gYSBuZXcgNHg0IG1hdHJpeFxuICovXG5tYXQ0LmNsb25lID0gZnVuY3Rpb24oYSkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgxNik7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICBvdXRbNF0gPSBhWzRdO1xuICAgIG91dFs1XSA9IGFbNV07XG4gICAgb3V0WzZdID0gYVs2XTtcbiAgICBvdXRbN10gPSBhWzddO1xuICAgIG91dFs4XSA9IGFbOF07XG4gICAgb3V0WzldID0gYVs5XTtcbiAgICBvdXRbMTBdID0gYVsxMF07XG4gICAgb3V0WzExXSA9IGFbMTFdO1xuICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICBvdXRbMTNdID0gYVsxM107XG4gICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbWF0NCB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICBvdXRbOV0gPSBhWzldO1xuICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICBvdXRbMTFdID0gYVsxMV07XG4gICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCBhIG1hdDQgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuaWRlbnRpdHkgPSBmdW5jdGlvbihvdXQpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMTtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSAxO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zcG9zZSB0aGUgdmFsdWVzIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC50cmFuc3Bvc2UgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICB2YXIgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTAzID0gYVszXSxcbiAgICAgICAgICAgIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgICAgICBhMjMgPSBhWzExXTtcblxuICAgICAgICBvdXRbMV0gPSBhWzRdO1xuICAgICAgICBvdXRbMl0gPSBhWzhdO1xuICAgICAgICBvdXRbM10gPSBhWzEyXTtcbiAgICAgICAgb3V0WzRdID0gYTAxO1xuICAgICAgICBvdXRbNl0gPSBhWzldO1xuICAgICAgICBvdXRbN10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzhdID0gYTAyO1xuICAgICAgICBvdXRbOV0gPSBhMTI7XG4gICAgICAgIG91dFsxMV0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzEyXSA9IGEwMztcbiAgICAgICAgb3V0WzEzXSA9IGExMztcbiAgICAgICAgb3V0WzE0XSA9IGEyMztcbiAgICB9IGVsc2Uge1xuICAgICAgICBvdXRbMF0gPSBhWzBdO1xuICAgICAgICBvdXRbMV0gPSBhWzRdO1xuICAgICAgICBvdXRbMl0gPSBhWzhdO1xuICAgICAgICBvdXRbM10gPSBhWzEyXTtcbiAgICAgICAgb3V0WzRdID0gYVsxXTtcbiAgICAgICAgb3V0WzVdID0gYVs1XTtcbiAgICAgICAgb3V0WzZdID0gYVs5XTtcbiAgICAgICAgb3V0WzddID0gYVsxM107XG4gICAgICAgIG91dFs4XSA9IGFbMl07XG4gICAgICAgIG91dFs5XSA9IGFbNl07XG4gICAgICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICAgICAgb3V0WzExXSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTJdID0gYVszXTtcbiAgICAgICAgb3V0WzEzXSA9IGFbN107XG4gICAgICAgIG91dFsxNF0gPSBhWzExXTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBJbnZlcnRzIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5pbnZlcnQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTAzID0gYVszXSxcbiAgICAgICAgYTEwID0gYVs0XSwgYTExID0gYVs1XSwgYTEyID0gYVs2XSwgYTEzID0gYVs3XSxcbiAgICAgICAgYTIwID0gYVs4XSwgYTIxID0gYVs5XSwgYTIyID0gYVsxMF0sIGEyMyA9IGFbMTFdLFxuICAgICAgICBhMzAgPSBhWzEyXSwgYTMxID0gYVsxM10sIGEzMiA9IGFbMTRdLCBhMzMgPSBhWzE1XSxcblxuICAgICAgICBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTAsXG4gICAgICAgIGIwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMCxcbiAgICAgICAgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwLFxuICAgICAgICBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTEsXG4gICAgICAgIGIwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMSxcbiAgICAgICAgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyLFxuICAgICAgICBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzAsXG4gICAgICAgIGIwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMCxcbiAgICAgICAgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwLFxuICAgICAgICBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzEsXG4gICAgICAgIGIxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMSxcbiAgICAgICAgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyLFxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICAgICAgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xuXG4gICAgaWYgKCFkZXQpIHsgXG4gICAgICAgIHJldHVybiBudWxsOyBcbiAgICB9XG4gICAgZGV0ID0gMS4wIC8gZGV0O1xuXG4gICAgb3V0WzBdID0gKGExMSAqIGIxMSAtIGExMiAqIGIxMCArIGExMyAqIGIwOSkgKiBkZXQ7XG4gICAgb3V0WzFdID0gKGEwMiAqIGIxMCAtIGEwMSAqIGIxMSAtIGEwMyAqIGIwOSkgKiBkZXQ7XG4gICAgb3V0WzJdID0gKGEzMSAqIGIwNSAtIGEzMiAqIGIwNCArIGEzMyAqIGIwMykgKiBkZXQ7XG4gICAgb3V0WzNdID0gKGEyMiAqIGIwNCAtIGEyMSAqIGIwNSAtIGEyMyAqIGIwMykgKiBkZXQ7XG4gICAgb3V0WzRdID0gKGExMiAqIGIwOCAtIGExMCAqIGIxMSAtIGExMyAqIGIwNykgKiBkZXQ7XG4gICAgb3V0WzVdID0gKGEwMCAqIGIxMSAtIGEwMiAqIGIwOCArIGEwMyAqIGIwNykgKiBkZXQ7XG4gICAgb3V0WzZdID0gKGEzMiAqIGIwMiAtIGEzMCAqIGIwNSAtIGEzMyAqIGIwMSkgKiBkZXQ7XG4gICAgb3V0WzddID0gKGEyMCAqIGIwNSAtIGEyMiAqIGIwMiArIGEyMyAqIGIwMSkgKiBkZXQ7XG4gICAgb3V0WzhdID0gKGExMCAqIGIxMCAtIGExMSAqIGIwOCArIGExMyAqIGIwNikgKiBkZXQ7XG4gICAgb3V0WzldID0gKGEwMSAqIGIwOCAtIGEwMCAqIGIxMCAtIGEwMyAqIGIwNikgKiBkZXQ7XG4gICAgb3V0WzEwXSA9IChhMzAgKiBiMDQgLSBhMzEgKiBiMDIgKyBhMzMgKiBiMDApICogZGV0O1xuICAgIG91dFsxMV0gPSAoYTIxICogYjAyIC0gYTIwICogYjA0IC0gYTIzICogYjAwKSAqIGRldDtcbiAgICBvdXRbMTJdID0gKGExMSAqIGIwNyAtIGExMCAqIGIwOSAtIGExMiAqIGIwNikgKiBkZXQ7XG4gICAgb3V0WzEzXSA9IChhMDAgKiBiMDkgLSBhMDEgKiBiMDcgKyBhMDIgKiBiMDYpICogZGV0O1xuICAgIG91dFsxNF0gPSAoYTMxICogYjAxIC0gYTMwICogYjAzIC0gYTMyICogYjAwKSAqIGRldDtcbiAgICBvdXRbMTVdID0gKGEyMCAqIGIwMyAtIGEyMSAqIGIwMSArIGEyMiAqIGIwMCkgKiBkZXQ7XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuYWRqb2ludCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLCBhMTEgPSBhWzVdLCBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICBhMjAgPSBhWzhdLCBhMjEgPSBhWzldLCBhMjIgPSBhWzEwXSwgYTIzID0gYVsxMV0sXG4gICAgICAgIGEzMCA9IGFbMTJdLCBhMzEgPSBhWzEzXSwgYTMyID0gYVsxNF0sIGEzMyA9IGFbMTVdO1xuXG4gICAgb3V0WzBdICA9ICAoYTExICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjEgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSArIGEzMSAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpKTtcbiAgICBvdXRbMV0gID0gLShhMDEgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMSAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMxICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikpO1xuICAgIG91dFsyXSAgPSAgKGEwMSAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpIC0gYTExICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzEgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgb3V0WzNdICA9IC0oYTAxICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikgLSBhMTEgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSArIGEyMSAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICBvdXRbNF0gID0gLShhMTAgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMCAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpICsgYTMwICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikpO1xuICAgIG91dFs1XSAgPSAgKGEwMCAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIwICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzAgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSk7XG4gICAgb3V0WzZdICA9IC0oYTAwICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgLSBhMTAgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMCAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICBvdXRbN10gID0gIChhMDAgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSAtIGExMCAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpICsgYTIwICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgIG91dFs4XSAgPSAgKGExMCAqIChhMjEgKiBhMzMgLSBhMjMgKiBhMzEpIC0gYTIwICogKGExMSAqIGEzMyAtIGExMyAqIGEzMSkgKyBhMzAgKiAoYTExICogYTIzIC0gYTEzICogYTIxKSk7XG4gICAgb3V0WzldICA9IC0oYTAwICogKGEyMSAqIGEzMyAtIGEyMyAqIGEzMSkgLSBhMjAgKiAoYTAxICogYTMzIC0gYTAzICogYTMxKSArIGEzMCAqIChhMDEgKiBhMjMgLSBhMDMgKiBhMjEpKTtcbiAgICBvdXRbMTBdID0gIChhMDAgKiAoYTExICogYTMzIC0gYTEzICogYTMxKSAtIGExMCAqIChhMDEgKiBhMzMgLSBhMDMgKiBhMzEpICsgYTMwICogKGEwMSAqIGExMyAtIGEwMyAqIGExMSkpO1xuICAgIG91dFsxMV0gPSAtKGEwMCAqIChhMTEgKiBhMjMgLSBhMTMgKiBhMjEpIC0gYTEwICogKGEwMSAqIGEyMyAtIGEwMyAqIGEyMSkgKyBhMjAgKiAoYTAxICogYTEzIC0gYTAzICogYTExKSk7XG4gICAgb3V0WzEyXSA9IC0oYTEwICogKGEyMSAqIGEzMiAtIGEyMiAqIGEzMSkgLSBhMjAgKiAoYTExICogYTMyIC0gYTEyICogYTMxKSArIGEzMCAqIChhMTEgKiBhMjIgLSBhMTIgKiBhMjEpKTtcbiAgICBvdXRbMTNdID0gIChhMDAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMDEgKiBhMzIgLSBhMDIgKiBhMzEpICsgYTMwICogKGEwMSAqIGEyMiAtIGEwMiAqIGEyMSkpO1xuICAgIG91dFsxNF0gPSAtKGEwMCAqIChhMTEgKiBhMzIgLSBhMTIgKiBhMzEpIC0gYTEwICogKGEwMSAqIGEzMiAtIGEwMiAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTEyIC0gYTAyICogYTExKSk7XG4gICAgb3V0WzE1XSA9ICAoYTAwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkgLSBhMTAgKiAoYTAxICogYTIyIC0gYTAyICogYTIxKSArIGEyMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGRldGVybWluYW50IG9mIGFcbiAqL1xubWF0NC5kZXRlcm1pbmFudCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sIGExMSA9IGFbNV0sIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sIGEyMSA9IGFbOV0sIGEyMiA9IGFbMTBdLCBhMjMgPSBhWzExXSxcbiAgICAgICAgYTMwID0gYVsxMl0sIGEzMSA9IGFbMTNdLCBhMzIgPSBhWzE0XSwgYTMzID0gYVsxNV0sXG5cbiAgICAgICAgYjAwID0gYTAwICogYTExIC0gYTAxICogYTEwLFxuICAgICAgICBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTAsXG4gICAgICAgIGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMCxcbiAgICAgICAgYjAzID0gYTAxICogYTEyIC0gYTAyICogYTExLFxuICAgICAgICBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTEsXG4gICAgICAgIGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMixcbiAgICAgICAgYjA2ID0gYTIwICogYTMxIC0gYTIxICogYTMwLFxuICAgICAgICBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzAsXG4gICAgICAgIGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMCxcbiAgICAgICAgYjA5ID0gYTIxICogYTMyIC0gYTIyICogYTMxLFxuICAgICAgICBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzEsXG4gICAgICAgIGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMjtcblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICByZXR1cm4gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xufTtcblxuLyoqXG4gKiBNdWx0aXBsaWVzIHR3byBtYXQ0J3NcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge21hdDR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQubXVsdGlwbHkgPSBmdW5jdGlvbiAob3V0LCBhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sIGExMSA9IGFbNV0sIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sIGEyMSA9IGFbOV0sIGEyMiA9IGFbMTBdLCBhMjMgPSBhWzExXSxcbiAgICAgICAgYTMwID0gYVsxMl0sIGEzMSA9IGFbMTNdLCBhMzIgPSBhWzE0XSwgYTMzID0gYVsxNV07XG5cbiAgICAvLyBDYWNoZSBvbmx5IHRoZSBjdXJyZW50IGxpbmUgb2YgdGhlIHNlY29uZCBtYXRyaXhcbiAgICB2YXIgYjAgID0gYlswXSwgYjEgPSBiWzFdLCBiMiA9IGJbMl0sIGIzID0gYlszXTsgIFxuICAgIG91dFswXSA9IGIwKmEwMCArIGIxKmExMCArIGIyKmEyMCArIGIzKmEzMDtcbiAgICBvdXRbMV0gPSBiMCphMDEgKyBiMSphMTEgKyBiMiphMjEgKyBiMyphMzE7XG4gICAgb3V0WzJdID0gYjAqYTAyICsgYjEqYTEyICsgYjIqYTIyICsgYjMqYTMyO1xuICAgIG91dFszXSA9IGIwKmEwMyArIGIxKmExMyArIGIyKmEyMyArIGIzKmEzMztcblxuICAgIGIwID0gYls0XTsgYjEgPSBiWzVdOyBiMiA9IGJbNl07IGIzID0gYls3XTtcbiAgICBvdXRbNF0gPSBiMCphMDAgKyBiMSphMTAgKyBiMiphMjAgKyBiMyphMzA7XG4gICAgb3V0WzVdID0gYjAqYTAxICsgYjEqYTExICsgYjIqYTIxICsgYjMqYTMxO1xuICAgIG91dFs2XSA9IGIwKmEwMiArIGIxKmExMiArIGIyKmEyMiArIGIzKmEzMjtcbiAgICBvdXRbN10gPSBiMCphMDMgKyBiMSphMTMgKyBiMiphMjMgKyBiMyphMzM7XG5cbiAgICBiMCA9IGJbOF07IGIxID0gYls5XTsgYjIgPSBiWzEwXTsgYjMgPSBiWzExXTtcbiAgICBvdXRbOF0gPSBiMCphMDAgKyBiMSphMTAgKyBiMiphMjAgKyBiMyphMzA7XG4gICAgb3V0WzldID0gYjAqYTAxICsgYjEqYTExICsgYjIqYTIxICsgYjMqYTMxO1xuICAgIG91dFsxMF0gPSBiMCphMDIgKyBiMSphMTIgKyBiMiphMjIgKyBiMyphMzI7XG4gICAgb3V0WzExXSA9IGIwKmEwMyArIGIxKmExMyArIGIyKmEyMyArIGIzKmEzMztcblxuICAgIGIwID0gYlsxMl07IGIxID0gYlsxM107IGIyID0gYlsxNF07IGIzID0gYlsxNV07XG4gICAgb3V0WzEyXSA9IGIwKmEwMCArIGIxKmExMCArIGIyKmEyMCArIGIzKmEzMDtcbiAgICBvdXRbMTNdID0gYjAqYTAxICsgYjEqYTExICsgYjIqYTIxICsgYjMqYTMxO1xuICAgIG91dFsxNF0gPSBiMCphMDIgKyBiMSphMTIgKyBiMiphMjIgKyBiMyphMzI7XG4gICAgb3V0WzE1XSA9IGIwKmEwMyArIGIxKmExMyArIGIyKmEyMyArIGIzKmEzMztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIG1hdDQubXVsdGlwbHl9XG4gKiBAZnVuY3Rpb25cbiAqL1xubWF0NC5tdWwgPSBtYXQ0Lm11bHRpcGx5O1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIG1hdDQgYnkgdGhlIGdpdmVuIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byB0cmFuc2xhdGVcbiAqIEBwYXJhbSB7dmVjM30gdiB2ZWN0b3IgdG8gdHJhbnNsYXRlIGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQudHJhbnNsYXRlID0gZnVuY3Rpb24gKG91dCwgYSwgdikge1xuICAgIHZhciB4ID0gdlswXSwgeSA9IHZbMV0sIHogPSB2WzJdLFxuICAgICAgICBhMDAsIGEwMSwgYTAyLCBhMDMsXG4gICAgICAgIGExMCwgYTExLCBhMTIsIGExMyxcbiAgICAgICAgYTIwLCBhMjEsIGEyMiwgYTIzO1xuXG4gICAgaWYgKGEgPT09IG91dCkge1xuICAgICAgICBvdXRbMTJdID0gYVswXSAqIHggKyBhWzRdICogeSArIGFbOF0gKiB6ICsgYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzFdICogeCArIGFbNV0gKiB5ICsgYVs5XSAqIHogKyBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMl0gKiB4ICsgYVs2XSAqIHkgKyBhWzEwXSAqIHogKyBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbM10gKiB4ICsgYVs3XSAqIHkgKyBhWzExXSAqIHogKyBhWzE1XTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBhMDAgPSBhWzBdOyBhMDEgPSBhWzFdOyBhMDIgPSBhWzJdOyBhMDMgPSBhWzNdO1xuICAgICAgICBhMTAgPSBhWzRdOyBhMTEgPSBhWzVdOyBhMTIgPSBhWzZdOyBhMTMgPSBhWzddO1xuICAgICAgICBhMjAgPSBhWzhdOyBhMjEgPSBhWzldOyBhMjIgPSBhWzEwXTsgYTIzID0gYVsxMV07XG5cbiAgICAgICAgb3V0WzBdID0gYTAwOyBvdXRbMV0gPSBhMDE7IG91dFsyXSA9IGEwMjsgb3V0WzNdID0gYTAzO1xuICAgICAgICBvdXRbNF0gPSBhMTA7IG91dFs1XSA9IGExMTsgb3V0WzZdID0gYTEyOyBvdXRbN10gPSBhMTM7XG4gICAgICAgIG91dFs4XSA9IGEyMDsgb3V0WzldID0gYTIxOyBvdXRbMTBdID0gYTIyOyBvdXRbMTFdID0gYTIzO1xuXG4gICAgICAgIG91dFsxMl0gPSBhMDAgKiB4ICsgYTEwICogeSArIGEyMCAqIHogKyBhWzEyXTtcbiAgICAgICAgb3V0WzEzXSA9IGEwMSAqIHggKyBhMTEgKiB5ICsgYTIxICogeiArIGFbMTNdO1xuICAgICAgICBvdXRbMTRdID0gYTAyICogeCArIGExMiAqIHkgKyBhMjIgKiB6ICsgYVsxNF07XG4gICAgICAgIG91dFsxNV0gPSBhMDMgKiB4ICsgYTEzICogeSArIGEyMyAqIHogKyBhWzE1XTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTY2FsZXMgdGhlIG1hdDQgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gc2NhbGVcbiAqIEBwYXJhbSB7dmVjM30gdiB0aGUgdmVjMyB0byBzY2FsZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKiovXG5tYXQ0LnNjYWxlID0gZnVuY3Rpb24ob3V0LCBhLCB2KSB7XG4gICAgdmFyIHggPSB2WzBdLCB5ID0gdlsxXSwgeiA9IHZbMl07XG5cbiAgICBvdXRbMF0gPSBhWzBdICogeDtcbiAgICBvdXRbMV0gPSBhWzFdICogeDtcbiAgICBvdXRbMl0gPSBhWzJdICogeDtcbiAgICBvdXRbM10gPSBhWzNdICogeDtcbiAgICBvdXRbNF0gPSBhWzRdICogeTtcbiAgICBvdXRbNV0gPSBhWzVdICogeTtcbiAgICBvdXRbNl0gPSBhWzZdICogeTtcbiAgICBvdXRbN10gPSBhWzddICogeTtcbiAgICBvdXRbOF0gPSBhWzhdICogejtcbiAgICBvdXRbOV0gPSBhWzldICogejtcbiAgICBvdXRbMTBdID0gYVsxMF0gKiB6O1xuICAgIG91dFsxMV0gPSBhWzExXSAqIHo7XG4gICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXQ0IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIGdpdmVuIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHBhcmFtIHt2ZWMzfSBheGlzIHRoZSBheGlzIHRvIHJvdGF0ZSBhcm91bmRcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5yb3RhdGUgPSBmdW5jdGlvbiAob3V0LCBhLCByYWQsIGF4aXMpIHtcbiAgICB2YXIgeCA9IGF4aXNbMF0sIHkgPSBheGlzWzFdLCB6ID0gYXhpc1syXSxcbiAgICAgICAgbGVuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeiksXG4gICAgICAgIHMsIGMsIHQsXG4gICAgICAgIGEwMCwgYTAxLCBhMDIsIGEwMyxcbiAgICAgICAgYTEwLCBhMTEsIGExMiwgYTEzLFxuICAgICAgICBhMjAsIGEyMSwgYTIyLCBhMjMsXG4gICAgICAgIGIwMCwgYjAxLCBiMDIsXG4gICAgICAgIGIxMCwgYjExLCBiMTIsXG4gICAgICAgIGIyMCwgYjIxLCBiMjI7XG5cbiAgICBpZiAoTWF0aC5hYnMobGVuKSA8IGdsTWF0cml4LkVQU0lMT04pIHsgcmV0dXJuIG51bGw7IH1cbiAgICBcbiAgICBsZW4gPSAxIC8gbGVuO1xuICAgIHggKj0gbGVuO1xuICAgIHkgKj0gbGVuO1xuICAgIHogKj0gbGVuO1xuXG4gICAgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgdCA9IDEgLSBjO1xuXG4gICAgYTAwID0gYVswXTsgYTAxID0gYVsxXTsgYTAyID0gYVsyXTsgYTAzID0gYVszXTtcbiAgICBhMTAgPSBhWzRdOyBhMTEgPSBhWzVdOyBhMTIgPSBhWzZdOyBhMTMgPSBhWzddO1xuICAgIGEyMCA9IGFbOF07IGEyMSA9IGFbOV07IGEyMiA9IGFbMTBdOyBhMjMgPSBhWzExXTtcblxuICAgIC8vIENvbnN0cnVjdCB0aGUgZWxlbWVudHMgb2YgdGhlIHJvdGF0aW9uIG1hdHJpeFxuICAgIGIwMCA9IHggKiB4ICogdCArIGM7IGIwMSA9IHkgKiB4ICogdCArIHogKiBzOyBiMDIgPSB6ICogeCAqIHQgLSB5ICogcztcbiAgICBiMTAgPSB4ICogeSAqIHQgLSB6ICogczsgYjExID0geSAqIHkgKiB0ICsgYzsgYjEyID0geiAqIHkgKiB0ICsgeCAqIHM7XG4gICAgYjIwID0geCAqIHogKiB0ICsgeSAqIHM7IGIyMSA9IHkgKiB6ICogdCAtIHggKiBzOyBiMjIgPSB6ICogeiAqIHQgKyBjO1xuXG4gICAgLy8gUGVyZm9ybSByb3RhdGlvbi1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICBvdXRbMF0gPSBhMDAgKiBiMDAgKyBhMTAgKiBiMDEgKyBhMjAgKiBiMDI7XG4gICAgb3V0WzFdID0gYTAxICogYjAwICsgYTExICogYjAxICsgYTIxICogYjAyO1xuICAgIG91dFsyXSA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcbiAgICBvdXRbM10gPSBhMDMgKiBiMDAgKyBhMTMgKiBiMDEgKyBhMjMgKiBiMDI7XG4gICAgb3V0WzRdID0gYTAwICogYjEwICsgYTEwICogYjExICsgYTIwICogYjEyO1xuICAgIG91dFs1XSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcbiAgICBvdXRbNl0gPSBhMDIgKiBiMTAgKyBhMTIgKiBiMTEgKyBhMjIgKiBiMTI7XG4gICAgb3V0WzddID0gYTAzICogYjEwICsgYTEzICogYjExICsgYTIzICogYjEyO1xuICAgIG91dFs4XSA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMjtcbiAgICBvdXRbOV0gPSBhMDEgKiBiMjAgKyBhMTEgKiBiMjEgKyBhMjEgKiBiMjI7XG4gICAgb3V0WzEwXSA9IGEwMiAqIGIyMCArIGExMiAqIGIyMSArIGEyMiAqIGIyMjtcbiAgICBvdXRbMTFdID0gYTAzICogYjIwICsgYTEzICogYjIxICsgYTIzICogYjIyO1xuXG4gICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCBsYXN0IHJvd1xuICAgICAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXRyaXggYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWCBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5yb3RhdGVYID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKSxcbiAgICAgICAgYTEwID0gYVs0XSxcbiAgICAgICAgYTExID0gYVs1XSxcbiAgICAgICAgYTEyID0gYVs2XSxcbiAgICAgICAgYTEzID0gYVs3XSxcbiAgICAgICAgYTIwID0gYVs4XSxcbiAgICAgICAgYTIxID0gYVs5XSxcbiAgICAgICAgYTIyID0gYVsxMF0sXG4gICAgICAgIGEyMyA9IGFbMTFdO1xuXG4gICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgICAgIG91dFswXSAgPSBhWzBdO1xuICAgICAgICBvdXRbMV0gID0gYVsxXTtcbiAgICAgICAgb3V0WzJdICA9IGFbMl07XG4gICAgICAgIG91dFszXSAgPSBhWzNdO1xuICAgICAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFs0XSA9IGExMCAqIGMgKyBhMjAgKiBzO1xuICAgIG91dFs1XSA9IGExMSAqIGMgKyBhMjEgKiBzO1xuICAgIG91dFs2XSA9IGExMiAqIGMgKyBhMjIgKiBzO1xuICAgIG91dFs3XSA9IGExMyAqIGMgKyBhMjMgKiBzO1xuICAgIG91dFs4XSA9IGEyMCAqIGMgLSBhMTAgKiBzO1xuICAgIG91dFs5XSA9IGEyMSAqIGMgLSBhMTEgKiBzO1xuICAgIG91dFsxMF0gPSBhMjIgKiBjIC0gYTEyICogcztcbiAgICBvdXRbMTFdID0gYTIzICogYyAtIGExMyAqIHM7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlcyBhIG1hdHJpeCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBZIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LnJvdGF0ZVkgPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxuICAgICAgICBhMDAgPSBhWzBdLFxuICAgICAgICBhMDEgPSBhWzFdLFxuICAgICAgICBhMDIgPSBhWzJdLFxuICAgICAgICBhMDMgPSBhWzNdLFxuICAgICAgICBhMjAgPSBhWzhdLFxuICAgICAgICBhMjEgPSBhWzldLFxuICAgICAgICBhMjIgPSBhWzEwXSxcbiAgICAgICAgYTIzID0gYVsxMV07XG5cbiAgICBpZiAoYSAhPT0gb3V0KSB7IC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIHJvd3NcbiAgICAgICAgb3V0WzRdICA9IGFbNF07XG4gICAgICAgIG91dFs1XSAgPSBhWzVdO1xuICAgICAgICBvdXRbNl0gID0gYVs2XTtcbiAgICAgICAgb3V0WzddICA9IGFbN107XG4gICAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgICAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdID0gYTAwICogYyAtIGEyMCAqIHM7XG4gICAgb3V0WzFdID0gYTAxICogYyAtIGEyMSAqIHM7XG4gICAgb3V0WzJdID0gYTAyICogYyAtIGEyMiAqIHM7XG4gICAgb3V0WzNdID0gYTAzICogYyAtIGEyMyAqIHM7XG4gICAgb3V0WzhdID0gYTAwICogcyArIGEyMCAqIGM7XG4gICAgb3V0WzldID0gYTAxICogcyArIGEyMSAqIGM7XG4gICAgb3V0WzEwXSA9IGEwMiAqIHMgKyBhMjIgKiBjO1xuICAgIG91dFsxMV0gPSBhMDMgKiBzICsgYTIzICogYztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFogYXhpc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQucm90YXRlWiA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgIGEwMCA9IGFbMF0sXG4gICAgICAgIGEwMSA9IGFbMV0sXG4gICAgICAgIGEwMiA9IGFbMl0sXG4gICAgICAgIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sXG4gICAgICAgIGExMSA9IGFbNV0sXG4gICAgICAgIGExMiA9IGFbNl0sXG4gICAgICAgIGExMyA9IGFbN107XG5cbiAgICBpZiAoYSAhPT0gb3V0KSB7IC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIGxhc3Qgcm93XG4gICAgICAgIG91dFs4XSAgPSBhWzhdO1xuICAgICAgICBvdXRbOV0gID0gYVs5XTtcbiAgICAgICAgb3V0WzEwXSA9IGFbMTBdO1xuICAgICAgICBvdXRbMTFdID0gYVsxMV07XG4gICAgICAgIG91dFsxMl0gPSBhWzEyXTtcbiAgICAgICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgICAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgICAgIG91dFsxNV0gPSBhWzE1XTtcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdID0gYTAwICogYyArIGExMCAqIHM7XG4gICAgb3V0WzFdID0gYTAxICogYyArIGExMSAqIHM7XG4gICAgb3V0WzJdID0gYTAyICogYyArIGExMiAqIHM7XG4gICAgb3V0WzNdID0gYTAzICogYyArIGExMyAqIHM7XG4gICAgb3V0WzRdID0gYTEwICogYyAtIGEwMCAqIHM7XG4gICAgb3V0WzVdID0gYTExICogYyAtIGEwMSAqIHM7XG4gICAgb3V0WzZdID0gYTEyICogYyAtIGEwMiAqIHM7XG4gICAgb3V0WzddID0gYTEzICogYyAtIGEwMyAqIHM7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHRyYW5zbGF0aW9uXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCBkZXN0LCB2ZWMpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7dmVjM30gdiBUcmFuc2xhdGlvbiB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5mcm9tVHJhbnNsYXRpb24gPSBmdW5jdGlvbihvdXQsIHYpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMTtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSAxO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSB2WzBdO1xuICAgIG91dFsxM10gPSB2WzFdO1xuICAgIG91dFsxNF0gPSB2WzJdO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgdmVjdG9yIHNjYWxpbmdcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQuc2NhbGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3ZlYzN9IHYgU2NhbGluZyB2ZWN0b3JcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5mcm9tU2NhbGluZyA9IGZ1bmN0aW9uKG91dCwgdikge1xuICAgIG91dFswXSA9IHZbMF07XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSB2WzFdO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IHZbMl07XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZSBhcm91bmQgYSBnaXZlbiBheGlzXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnJvdGF0ZShkZXN0LCBkZXN0LCByYWQsIGF4aXMpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcGFyYW0ge3ZlYzN9IGF4aXMgdGhlIGF4aXMgdG8gcm90YXRlIGFyb3VuZFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmZyb21Sb3RhdGlvbiA9IGZ1bmN0aW9uKG91dCwgcmFkLCBheGlzKSB7XG4gICAgdmFyIHggPSBheGlzWzBdLCB5ID0gYXhpc1sxXSwgeiA9IGF4aXNbMl0sXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopLFxuICAgICAgICBzLCBjLCB0O1xuICAgIFxuICAgIGlmIChNYXRoLmFicyhsZW4pIDwgZ2xNYXRyaXguRVBTSUxPTikgeyByZXR1cm4gbnVsbDsgfVxuICAgIFxuICAgIGxlbiA9IDEgLyBsZW47XG4gICAgeCAqPSBsZW47XG4gICAgeSAqPSBsZW47XG4gICAgeiAqPSBsZW47XG4gICAgXG4gICAgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgdCA9IDEgLSBjO1xuICAgIFxuICAgIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdID0geCAqIHggKiB0ICsgYztcbiAgICBvdXRbMV0gPSB5ICogeCAqIHQgKyB6ICogcztcbiAgICBvdXRbMl0gPSB6ICogeCAqIHQgLSB5ICogcztcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHggKiB5ICogdCAtIHogKiBzO1xuICAgIG91dFs1XSA9IHkgKiB5ICogdCArIGM7XG4gICAgb3V0WzZdID0geiAqIHkgKiB0ICsgeCAqIHM7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSB4ICogeiAqIHQgKyB5ICogcztcbiAgICBvdXRbOV0gPSB5ICogeiAqIHQgLSB4ICogcztcbiAgICBvdXRbMTBdID0geiAqIHogKiB0ICsgYztcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBYIGF4aXNcbiAqIFRoaXMgaXMgZXF1aXZhbGVudCB0byAoYnV0IG11Y2ggZmFzdGVyIHRoYW4pOlxuICpcbiAqICAgICBtYXQ0LmlkZW50aXR5KGRlc3QpO1xuICogICAgIG1hdDQucm90YXRlWChkZXN0LCBkZXN0LCByYWQpO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVhSb3RhdGlvbiA9IGZ1bmN0aW9uKG91dCwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKTtcbiAgICBcbiAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdICA9IDE7XG4gICAgb3V0WzFdICA9IDA7XG4gICAgb3V0WzJdICA9IDA7XG4gICAgb3V0WzNdICA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSBjO1xuICAgIG91dFs2XSA9IHM7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IC1zO1xuICAgIG91dFsxMF0gPSBjO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFkgYXhpc1xuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC5yb3RhdGVZKGRlc3QsIGRlc3QsIHJhZCk7XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5mcm9tWVJvdGF0aW9uID0gZnVuY3Rpb24ob3V0LCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIFxuICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICBvdXRbMF0gID0gYztcbiAgICBvdXRbMV0gID0gMDtcbiAgICBvdXRbMl0gID0gLXM7XG4gICAgb3V0WzNdICA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAxO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSBzO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IGM7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWiBheGlzXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnJvdGF0ZVooZGVzdCwgZGVzdCwgcmFkKTtcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmZyb21aUm90YXRpb24gPSBmdW5jdGlvbihvdXQsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgXG4gICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSAgPSBjO1xuICAgIG91dFsxXSAgPSBzO1xuICAgIG91dFsyXSAgPSAwO1xuICAgIG91dFszXSAgPSAwO1xuICAgIG91dFs0XSA9IC1zO1xuICAgIG91dFs1XSA9IGM7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gMTtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gMDtcbiAgICBvdXRbMTVdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24gYW5kIHZlY3RvciB0cmFuc2xhdGlvblxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcbiAqICAgICB2YXIgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XG4gKiAgICAgcXVhdDQudG9NYXQ0KHF1YXQsIHF1YXRNYXQpO1xuICogICAgIG1hdDQubXVsdGlwbHkoZGVzdCwgcXVhdE1hdCk7XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtxdWF0NH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3ZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24gPSBmdW5jdGlvbiAob3V0LCBxLCB2KSB7XG4gICAgLy8gUXVhdGVybmlvbiBtYXRoXG4gICAgdmFyIHggPSBxWzBdLCB5ID0gcVsxXSwgeiA9IHFbMl0sIHcgPSBxWzNdLFxuICAgICAgICB4MiA9IHggKyB4LFxuICAgICAgICB5MiA9IHkgKyB5LFxuICAgICAgICB6MiA9IHogKyB6LFxuXG4gICAgICAgIHh4ID0geCAqIHgyLFxuICAgICAgICB4eSA9IHggKiB5MixcbiAgICAgICAgeHogPSB4ICogejIsXG4gICAgICAgIHl5ID0geSAqIHkyLFxuICAgICAgICB5eiA9IHkgKiB6MixcbiAgICAgICAgenogPSB6ICogejIsXG4gICAgICAgIHd4ID0gdyAqIHgyLFxuICAgICAgICB3eSA9IHcgKiB5MixcbiAgICAgICAgd3ogPSB3ICogejI7XG5cbiAgICBvdXRbMF0gPSAxIC0gKHl5ICsgenopO1xuICAgIG91dFsxXSA9IHh5ICsgd3o7XG4gICAgb3V0WzJdID0geHogLSB3eTtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHh5IC0gd3o7XG4gICAgb3V0WzVdID0gMSAtICh4eCArIHp6KTtcbiAgICBvdXRbNl0gPSB5eiArIHd4O1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geHogKyB3eTtcbiAgICBvdXRbOV0gPSB5eiAtIHd4O1xuICAgIG91dFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSB2WzBdO1xuICAgIG91dFsxM10gPSB2WzFdO1xuICAgIG91dFsxNF0gPSB2WzJdO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIFxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24sIHZlY3RvciB0cmFuc2xhdGlvbiBhbmQgdmVjdG9yIHNjYWxlXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCB2ZWMpO1xuICogICAgIHZhciBxdWF0TWF0ID0gbWF0NC5jcmVhdGUoKTtcbiAqICAgICBxdWF0NC50b01hdDQocXVhdCwgcXVhdE1hdCk7XG4gKiAgICAgbWF0NC5tdWx0aXBseShkZXN0LCBxdWF0TWF0KTtcbiAqICAgICBtYXQ0LnNjYWxlKGRlc3QsIHNjYWxlKVxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdDR9IHEgUm90YXRpb24gcXVhdGVybmlvblxuICogQHBhcmFtIHt2ZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBzIFNjYWxpbmcgdmVjdG9yXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVJvdGF0aW9uVHJhbnNsYXRpb25TY2FsZSA9IGZ1bmN0aW9uIChvdXQsIHEsIHYsIHMpIHtcbiAgICAvLyBRdWF0ZXJuaW9uIG1hdGhcbiAgICB2YXIgeCA9IHFbMF0sIHkgPSBxWzFdLCB6ID0gcVsyXSwgdyA9IHFbM10sXG4gICAgICAgIHgyID0geCArIHgsXG4gICAgICAgIHkyID0geSArIHksXG4gICAgICAgIHoyID0geiArIHosXG5cbiAgICAgICAgeHggPSB4ICogeDIsXG4gICAgICAgIHh5ID0geCAqIHkyLFxuICAgICAgICB4eiA9IHggKiB6MixcbiAgICAgICAgeXkgPSB5ICogeTIsXG4gICAgICAgIHl6ID0geSAqIHoyLFxuICAgICAgICB6eiA9IHogKiB6MixcbiAgICAgICAgd3ggPSB3ICogeDIsXG4gICAgICAgIHd5ID0gdyAqIHkyLFxuICAgICAgICB3eiA9IHcgKiB6MixcbiAgICAgICAgc3ggPSBzWzBdLFxuICAgICAgICBzeSA9IHNbMV0sXG4gICAgICAgIHN6ID0gc1syXTtcblxuICAgIG91dFswXSA9ICgxIC0gKHl5ICsgenopKSAqIHN4O1xuICAgIG91dFsxXSA9ICh4eSArIHd6KSAqIHN4O1xuICAgIG91dFsyXSA9ICh4eiAtIHd5KSAqIHN4O1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gKHh5IC0gd3opICogc3k7XG4gICAgb3V0WzVdID0gKDEgLSAoeHggKyB6eikpICogc3k7XG4gICAgb3V0WzZdID0gKHl6ICsgd3gpICogc3k7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAoeHogKyB3eSkgKiBzejtcbiAgICBvdXRbOV0gPSAoeXogLSB3eCkgKiBzejtcbiAgICBvdXRbMTBdID0gKDEgLSAoeHggKyB5eSkpICogc3o7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IHZbMF07XG4gICAgb3V0WzEzXSA9IHZbMV07XG4gICAgb3V0WzE0XSA9IHZbMl07XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hdHJpeCBmcm9tIGEgcXVhdGVybmlvbiByb3RhdGlvbiwgdmVjdG9yIHRyYW5zbGF0aW9uIGFuZCB2ZWN0b3Igc2NhbGUsIHJvdGF0aW5nIGFuZCBzY2FsaW5nIGFyb3VuZCB0aGUgZ2l2ZW4gb3JpZ2luXG4gKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAqXG4gKiAgICAgbWF0NC5pZGVudGl0eShkZXN0KTtcbiAqICAgICBtYXQ0LnRyYW5zbGF0ZShkZXN0LCB2ZWMpO1xuICogICAgIG1hdDQudHJhbnNsYXRlKGRlc3QsIG9yaWdpbik7XG4gKiAgICAgdmFyIHF1YXRNYXQgPSBtYXQ0LmNyZWF0ZSgpO1xuICogICAgIHF1YXQ0LnRvTWF0NChxdWF0LCBxdWF0TWF0KTtcbiAqICAgICBtYXQ0Lm11bHRpcGx5KGRlc3QsIHF1YXRNYXQpO1xuICogICAgIG1hdDQuc2NhbGUoZGVzdCwgc2NhbGUpXG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgbmVnYXRpdmVPcmlnaW4pO1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdDR9IHEgUm90YXRpb24gcXVhdGVybmlvblxuICogQHBhcmFtIHt2ZWMzfSB2IFRyYW5zbGF0aW9uIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBzIFNjYWxpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IG8gVGhlIG9yaWdpbiB2ZWN0b3IgYXJvdW5kIHdoaWNoIHRvIHNjYWxlIGFuZCByb3RhdGVcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5mcm9tUm90YXRpb25UcmFuc2xhdGlvblNjYWxlT3JpZ2luID0gZnVuY3Rpb24gKG91dCwgcSwgdiwgcywgbykge1xuICAvLyBRdWF0ZXJuaW9uIG1hdGhcbiAgdmFyIHggPSBxWzBdLCB5ID0gcVsxXSwgeiA9IHFbMl0sIHcgPSBxWzNdLFxuICAgICAgeDIgPSB4ICsgeCxcbiAgICAgIHkyID0geSArIHksXG4gICAgICB6MiA9IHogKyB6LFxuXG4gICAgICB4eCA9IHggKiB4MixcbiAgICAgIHh5ID0geCAqIHkyLFxuICAgICAgeHogPSB4ICogejIsXG4gICAgICB5eSA9IHkgKiB5MixcbiAgICAgIHl6ID0geSAqIHoyLFxuICAgICAgenogPSB6ICogejIsXG4gICAgICB3eCA9IHcgKiB4MixcbiAgICAgIHd5ID0gdyAqIHkyLFxuICAgICAgd3ogPSB3ICogejIsXG4gICAgICBcbiAgICAgIHN4ID0gc1swXSxcbiAgICAgIHN5ID0gc1sxXSxcbiAgICAgIHN6ID0gc1syXSxcblxuICAgICAgb3ggPSBvWzBdLFxuICAgICAgb3kgPSBvWzFdLFxuICAgICAgb3ogPSBvWzJdO1xuICAgICAgXG4gIG91dFswXSA9ICgxIC0gKHl5ICsgenopKSAqIHN4O1xuICBvdXRbMV0gPSAoeHkgKyB3eikgKiBzeDtcbiAgb3V0WzJdID0gKHh6IC0gd3kpICogc3g7XG4gIG91dFszXSA9IDA7XG4gIG91dFs0XSA9ICh4eSAtIHd6KSAqIHN5O1xuICBvdXRbNV0gPSAoMSAtICh4eCArIHp6KSkgKiBzeTtcbiAgb3V0WzZdID0gKHl6ICsgd3gpICogc3k7XG4gIG91dFs3XSA9IDA7XG4gIG91dFs4XSA9ICh4eiArIHd5KSAqIHN6O1xuICBvdXRbOV0gPSAoeXogLSB3eCkgKiBzejtcbiAgb3V0WzEwXSA9ICgxIC0gKHh4ICsgeXkpKSAqIHN6O1xuICBvdXRbMTFdID0gMDtcbiAgb3V0WzEyXSA9IHZbMF0gKyBveCAtIChvdXRbMF0gKiBveCArIG91dFs0XSAqIG95ICsgb3V0WzhdICogb3opO1xuICBvdXRbMTNdID0gdlsxXSArIG95IC0gKG91dFsxXSAqIG94ICsgb3V0WzVdICogb3kgKyBvdXRbOV0gKiBveik7XG4gIG91dFsxNF0gPSB2WzJdICsgb3ogLSAob3V0WzJdICogb3ggKyBvdXRbNl0gKiBveSArIG91dFsxMF0gKiBveik7XG4gIG91dFsxNV0gPSAxO1xuICAgICAgICBcbiAgcmV0dXJuIG91dDtcbn07XG5cbm1hdDQuZnJvbVF1YXQgPSBmdW5jdGlvbiAob3V0LCBxKSB7XG4gICAgdmFyIHggPSBxWzBdLCB5ID0gcVsxXSwgeiA9IHFbMl0sIHcgPSBxWzNdLFxuICAgICAgICB4MiA9IHggKyB4LFxuICAgICAgICB5MiA9IHkgKyB5LFxuICAgICAgICB6MiA9IHogKyB6LFxuXG4gICAgICAgIHh4ID0geCAqIHgyLFxuICAgICAgICB5eCA9IHkgKiB4MixcbiAgICAgICAgeXkgPSB5ICogeTIsXG4gICAgICAgIHp4ID0geiAqIHgyLFxuICAgICAgICB6eSA9IHogKiB5MixcbiAgICAgICAgenogPSB6ICogejIsXG4gICAgICAgIHd4ID0gdyAqIHgyLFxuICAgICAgICB3eSA9IHcgKiB5MixcbiAgICAgICAgd3ogPSB3ICogejI7XG5cbiAgICBvdXRbMF0gPSAxIC0geXkgLSB6ejtcbiAgICBvdXRbMV0gPSB5eCArIHd6O1xuICAgIG91dFsyXSA9IHp4IC0gd3k7XG4gICAgb3V0WzNdID0gMDtcblxuICAgIG91dFs0XSA9IHl4IC0gd3o7XG4gICAgb3V0WzVdID0gMSAtIHh4IC0geno7XG4gICAgb3V0WzZdID0genkgKyB3eDtcbiAgICBvdXRbN10gPSAwO1xuXG4gICAgb3V0WzhdID0genggKyB3eTtcbiAgICBvdXRbOV0gPSB6eSAtIHd4O1xuICAgIG91dFsxMF0gPSAxIC0geHggLSB5eTtcbiAgICBvdXRbMTFdID0gMDtcblxuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgZnJ1c3R1bSBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gYm91bmRzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHtOdW1iZXJ9IGxlZnQgTGVmdCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IHJpZ2h0IFJpZ2h0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IHRvcCBUb3AgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJ1c3R1bSA9IGZ1bmN0aW9uIChvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gICAgdmFyIHJsID0gMSAvIChyaWdodCAtIGxlZnQpLFxuICAgICAgICB0YiA9IDEgLyAodG9wIC0gYm90dG9tKSxcbiAgICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFswXSA9IChuZWFyICogMikgKiBybDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IChuZWFyICogMikgKiB0YjtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gKHJpZ2h0ICsgbGVmdCkgKiBybDtcbiAgICBvdXRbOV0gPSAodG9wICsgYm90dG9tKSAqIHRiO1xuICAgIG91dFsxMF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICBvdXRbMTFdID0gLTE7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IChmYXIgKiBuZWFyICogMikgKiBuZjtcbiAgICBvdXRbMTVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBwZXJzcGVjdGl2ZSBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge251bWJlcn0gZm92eSBWZXJ0aWNhbCBmaWVsZCBvZiB2aWV3IGluIHJhZGlhbnNcbiAqIEBwYXJhbSB7bnVtYmVyfSBhc3BlY3QgQXNwZWN0IHJhdGlvLiB0eXBpY2FsbHkgdmlld3BvcnQgd2lkdGgvaGVpZ2h0XG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gZmFyIEZhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LnBlcnNwZWN0aXZlID0gZnVuY3Rpb24gKG91dCwgZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgZiA9IDEuMCAvIE1hdGgudGFuKGZvdnkgLyAyKSxcbiAgICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFswXSA9IGYgLyBhc3BlY3Q7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSBmO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgIG91dFsxMV0gPSAtMTtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gKDIgKiBmYXIgKiBuZWFyKSAqIG5mO1xuICAgIG91dFsxNV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGZpZWxkIG9mIHZpZXcuXG4gKiBUaGlzIGlzIHByaW1hcmlseSB1c2VmdWwgZm9yIGdlbmVyYXRpbmcgcHJvamVjdGlvbiBtYXRyaWNlcyB0byBiZSB1c2VkXG4gKiB3aXRoIHRoZSBzdGlsbCBleHBlcmllbWVudGFsIFdlYlZSIEFQSS5cbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge251bWJlcn0gZm92IE9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgdmFsdWVzOiB1cERlZ3JlZXMsIGRvd25EZWdyZWVzLCBsZWZ0RGVncmVlcywgcmlnaHREZWdyZWVzXG4gKiBAcGFyYW0ge251bWJlcn0gbmVhciBOZWFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gZmFyIEZhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LnBlcnNwZWN0aXZlRnJvbUZpZWxkT2ZWaWV3ID0gZnVuY3Rpb24gKG91dCwgZm92LCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgdXBUYW4gPSBNYXRoLnRhbihmb3YudXBEZWdyZWVzICogTWF0aC5QSS8xODAuMCksXG4gICAgICAgIGRvd25UYW4gPSBNYXRoLnRhbihmb3YuZG93bkRlZ3JlZXMgKiBNYXRoLlBJLzE4MC4wKSxcbiAgICAgICAgbGVmdFRhbiA9IE1hdGgudGFuKGZvdi5sZWZ0RGVncmVlcyAqIE1hdGguUEkvMTgwLjApLFxuICAgICAgICByaWdodFRhbiA9IE1hdGgudGFuKGZvdi5yaWdodERlZ3JlZXMgKiBNYXRoLlBJLzE4MC4wKSxcbiAgICAgICAgeFNjYWxlID0gMi4wIC8gKGxlZnRUYW4gKyByaWdodFRhbiksXG4gICAgICAgIHlTY2FsZSA9IDIuMCAvICh1cFRhbiArIGRvd25UYW4pO1xuXG4gICAgb3V0WzBdID0geFNjYWxlO1xuICAgIG91dFsxXSA9IDAuMDtcbiAgICBvdXRbMl0gPSAwLjA7XG4gICAgb3V0WzNdID0gMC4wO1xuICAgIG91dFs0XSA9IDAuMDtcbiAgICBvdXRbNV0gPSB5U2NhbGU7XG4gICAgb3V0WzZdID0gMC4wO1xuICAgIG91dFs3XSA9IDAuMDtcbiAgICBvdXRbOF0gPSAtKChsZWZ0VGFuIC0gcmlnaHRUYW4pICogeFNjYWxlICogMC41KTtcbiAgICBvdXRbOV0gPSAoKHVwVGFuIC0gZG93blRhbikgKiB5U2NhbGUgKiAwLjUpO1xuICAgIG91dFsxMF0gPSBmYXIgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzExXSA9IC0xLjA7XG4gICAgb3V0WzEyXSA9IDAuMDtcbiAgICBvdXRbMTNdID0gMC4wO1xuICAgIG91dFsxNF0gPSAoZmFyICogbmVhcikgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzE1XSA9IDAuMDtcbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIG9ydGhvZ29uYWwgcHJvamVjdGlvbiBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gYm91bmRzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHtudW1iZXJ9IGxlZnQgTGVmdCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0IFJpZ2h0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gYm90dG9tIEJvdHRvbSBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IHRvcCBUb3AgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQub3J0aG8gPSBmdW5jdGlvbiAob3V0LCBsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsIG5lYXIsIGZhcikge1xuICAgIHZhciBsciA9IDEgLyAobGVmdCAtIHJpZ2h0KSxcbiAgICAgICAgYnQgPSAxIC8gKGJvdHRvbSAtIHRvcCksXG4gICAgICAgIG5mID0gMSAvIChuZWFyIC0gZmFyKTtcbiAgICBvdXRbMF0gPSAtMiAqIGxyO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gLTIgKiBidDtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSAyICogbmY7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IChsZWZ0ICsgcmlnaHQpICogbHI7XG4gICAgb3V0WzEzXSA9ICh0b3AgKyBib3R0b20pICogYnQ7XG4gICAgb3V0WzE0XSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGxvb2stYXQgbWF0cml4IHdpdGggdGhlIGdpdmVuIGV5ZSBwb3NpdGlvbiwgZm9jYWwgcG9pbnQsIGFuZCB1cCBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCBmcnVzdHVtIG1hdHJpeCB3aWxsIGJlIHdyaXR0ZW4gaW50b1xuICogQHBhcmFtIHt2ZWMzfSBleWUgUG9zaXRpb24gb2YgdGhlIHZpZXdlclxuICogQHBhcmFtIHt2ZWMzfSBjZW50ZXIgUG9pbnQgdGhlIHZpZXdlciBpcyBsb29raW5nIGF0XG4gKiBAcGFyYW0ge3ZlYzN9IHVwIHZlYzMgcG9pbnRpbmcgdXBcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5sb29rQXQgPSBmdW5jdGlvbiAob3V0LCBleWUsIGNlbnRlciwgdXApIHtcbiAgICB2YXIgeDAsIHgxLCB4MiwgeTAsIHkxLCB5MiwgejAsIHoxLCB6MiwgbGVuLFxuICAgICAgICBleWV4ID0gZXllWzBdLFxuICAgICAgICBleWV5ID0gZXllWzFdLFxuICAgICAgICBleWV6ID0gZXllWzJdLFxuICAgICAgICB1cHggPSB1cFswXSxcbiAgICAgICAgdXB5ID0gdXBbMV0sXG4gICAgICAgIHVweiA9IHVwWzJdLFxuICAgICAgICBjZW50ZXJ4ID0gY2VudGVyWzBdLFxuICAgICAgICBjZW50ZXJ5ID0gY2VudGVyWzFdLFxuICAgICAgICBjZW50ZXJ6ID0gY2VudGVyWzJdO1xuXG4gICAgaWYgKE1hdGguYWJzKGV5ZXggLSBjZW50ZXJ4KSA8IGdsTWF0cml4LkVQU0lMT04gJiZcbiAgICAgICAgTWF0aC5hYnMoZXlleSAtIGNlbnRlcnkpIDwgZ2xNYXRyaXguRVBTSUxPTiAmJlxuICAgICAgICBNYXRoLmFicyhleWV6IC0gY2VudGVyeikgPCBnbE1hdHJpeC5FUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiBtYXQ0LmlkZW50aXR5KG91dCk7XG4gICAgfVxuXG4gICAgejAgPSBleWV4IC0gY2VudGVyeDtcbiAgICB6MSA9IGV5ZXkgLSBjZW50ZXJ5O1xuICAgIHoyID0gZXlleiAtIGNlbnRlcno7XG5cbiAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KHowICogejAgKyB6MSAqIHoxICsgejIgKiB6Mik7XG4gICAgejAgKj0gbGVuO1xuICAgIHoxICo9IGxlbjtcbiAgICB6MiAqPSBsZW47XG5cbiAgICB4MCA9IHVweSAqIHoyIC0gdXB6ICogejE7XG4gICAgeDEgPSB1cHogKiB6MCAtIHVweCAqIHoyO1xuICAgIHgyID0gdXB4ICogejEgLSB1cHkgKiB6MDtcbiAgICBsZW4gPSBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcbiAgICBpZiAoIWxlbikge1xuICAgICAgICB4MCA9IDA7XG4gICAgICAgIHgxID0gMDtcbiAgICAgICAgeDIgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgIHgwICo9IGxlbjtcbiAgICAgICAgeDEgKj0gbGVuO1xuICAgICAgICB4MiAqPSBsZW47XG4gICAgfVxuXG4gICAgeTAgPSB6MSAqIHgyIC0gejIgKiB4MTtcbiAgICB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgIHkyID0gejAgKiB4MSAtIHoxICogeDA7XG5cbiAgICBsZW4gPSBNYXRoLnNxcnQoeTAgKiB5MCArIHkxICogeTEgKyB5MiAqIHkyKTtcbiAgICBpZiAoIWxlbikge1xuICAgICAgICB5MCA9IDA7XG4gICAgICAgIHkxID0gMDtcbiAgICAgICAgeTIgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgIHkwICo9IGxlbjtcbiAgICAgICAgeTEgKj0gbGVuO1xuICAgICAgICB5MiAqPSBsZW47XG4gICAgfVxuXG4gICAgb3V0WzBdID0geDA7XG4gICAgb3V0WzFdID0geTA7XG4gICAgb3V0WzJdID0gejA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSB4MTtcbiAgICBvdXRbNV0gPSB5MTtcbiAgICBvdXRbNl0gPSB6MTtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IHgyO1xuICAgIG91dFs5XSA9IHkyO1xuICAgIG91dFsxMF0gPSB6MjtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gLSh4MCAqIGV5ZXggKyB4MSAqIGV5ZXkgKyB4MiAqIGV5ZXopO1xuICAgIG91dFsxM10gPSAtKHkwICogZXlleCArIHkxICogZXlleSArIHkyICogZXlleik7XG4gICAgb3V0WzE0XSA9IC0oejAgKiBleWV4ICsgejEgKiBleWV5ICsgejIgKiBleWV6KTtcbiAgICBvdXRbMTVdID0gMTtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHttYXQ0fSBtYXQgbWF0cml4IHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtYXRyaXhcbiAqL1xubWF0NC5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAnbWF0NCgnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgYVszXSArICcsICcgK1xuICAgICAgICAgICAgICAgICAgICBhWzRdICsgJywgJyArIGFbNV0gKyAnLCAnICsgYVs2XSArICcsICcgKyBhWzddICsgJywgJyArXG4gICAgICAgICAgICAgICAgICAgIGFbOF0gKyAnLCAnICsgYVs5XSArICcsICcgKyBhWzEwXSArICcsICcgKyBhWzExXSArICcsICcgKyBcbiAgICAgICAgICAgICAgICAgICAgYVsxMl0gKyAnLCAnICsgYVsxM10gKyAnLCAnICsgYVsxNF0gKyAnLCAnICsgYVsxNV0gKyAnKSc7XG59O1xuXG4vKipcbiAqIFJldHVybnMgRnJvYmVuaXVzIG5vcm0gb2YgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gY2FsY3VsYXRlIEZyb2Jlbml1cyBub3JtIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBGcm9iZW5pdXMgbm9ybVxuICovXG5tYXQ0LmZyb2IgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybihNYXRoLnNxcnQoTWF0aC5wb3coYVswXSwgMikgKyBNYXRoLnBvdyhhWzFdLCAyKSArIE1hdGgucG93KGFbMl0sIDIpICsgTWF0aC5wb3coYVszXSwgMikgKyBNYXRoLnBvdyhhWzRdLCAyKSArIE1hdGgucG93KGFbNV0sIDIpICsgTWF0aC5wb3coYVs2XSwgMikgKyBNYXRoLnBvdyhhWzddLCAyKSArIE1hdGgucG93KGFbOF0sIDIpICsgTWF0aC5wb3coYVs5XSwgMikgKyBNYXRoLnBvdyhhWzEwXSwgMikgKyBNYXRoLnBvdyhhWzExXSwgMikgKyBNYXRoLnBvdyhhWzEyXSwgMikgKyBNYXRoLnBvdyhhWzEzXSwgMikgKyBNYXRoLnBvdyhhWzE0XSwgMikgKyBNYXRoLnBvdyhhWzE1XSwgMikgKSlcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBtYXQ0O1xuIiwiLyogQ29weXJpZ2h0IChjKSAyMDE1LCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cblxudmFyIGdsTWF0cml4ID0gcmVxdWlyZShcIi4vY29tbW9uLmpzXCIpO1xudmFyIG1hdDMgPSByZXF1aXJlKFwiLi9tYXQzLmpzXCIpO1xudmFyIHZlYzMgPSByZXF1aXJlKFwiLi92ZWMzLmpzXCIpO1xudmFyIHZlYzQgPSByZXF1aXJlKFwiLi92ZWM0LmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBRdWF0ZXJuaW9uXG4gKiBAbmFtZSBxdWF0XG4gKi9cbnZhciBxdWF0ID0ge307XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBpZGVudGl0eSBxdWF0XG4gKlxuICogQHJldHVybnMge3F1YXR9IGEgbmV3IHF1YXRlcm5pb25cbiAqL1xucXVhdC5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoNCk7XG4gICAgb3V0WzBdID0gMDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXRzIGEgcXVhdGVybmlvbiB0byByZXByZXNlbnQgdGhlIHNob3J0ZXN0IHJvdGF0aW9uIGZyb20gb25lXG4gKiB2ZWN0b3IgdG8gYW5vdGhlci5cbiAqXG4gKiBCb3RoIHZlY3RvcnMgYXJlIGFzc3VtZWQgdG8gYmUgdW5pdCBsZW5ndGguXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uLlxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBpbml0aWFsIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBkZXN0aW5hdGlvbiB2ZWN0b3JcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5yb3RhdGlvblRvID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB0bXB2ZWMzID0gdmVjMy5jcmVhdGUoKTtcbiAgICB2YXIgeFVuaXRWZWMzID0gdmVjMy5mcm9tVmFsdWVzKDEsMCwwKTtcbiAgICB2YXIgeVVuaXRWZWMzID0gdmVjMy5mcm9tVmFsdWVzKDAsMSwwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICAgICAgdmFyIGRvdCA9IHZlYzMuZG90KGEsIGIpO1xuICAgICAgICBpZiAoZG90IDwgLTAuOTk5OTk5KSB7XG4gICAgICAgICAgICB2ZWMzLmNyb3NzKHRtcHZlYzMsIHhVbml0VmVjMywgYSk7XG4gICAgICAgICAgICBpZiAodmVjMy5sZW5ndGgodG1wdmVjMykgPCAwLjAwMDAwMSlcbiAgICAgICAgICAgICAgICB2ZWMzLmNyb3NzKHRtcHZlYzMsIHlVbml0VmVjMywgYSk7XG4gICAgICAgICAgICB2ZWMzLm5vcm1hbGl6ZSh0bXB2ZWMzLCB0bXB2ZWMzKTtcbiAgICAgICAgICAgIHF1YXQuc2V0QXhpc0FuZ2xlKG91dCwgdG1wdmVjMywgTWF0aC5QSSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9IGVsc2UgaWYgKGRvdCA+IDAuOTk5OTk5KSB7XG4gICAgICAgICAgICBvdXRbMF0gPSAwO1xuICAgICAgICAgICAgb3V0WzFdID0gMDtcbiAgICAgICAgICAgIG91dFsyXSA9IDA7XG4gICAgICAgICAgICBvdXRbM10gPSAxO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlYzMuY3Jvc3ModG1wdmVjMywgYSwgYik7XG4gICAgICAgICAgICBvdXRbMF0gPSB0bXB2ZWMzWzBdO1xuICAgICAgICAgICAgb3V0WzFdID0gdG1wdmVjM1sxXTtcbiAgICAgICAgICAgIG91dFsyXSA9IHRtcHZlYzNbMl07XG4gICAgICAgICAgICBvdXRbM10gPSAxICsgZG90O1xuICAgICAgICAgICAgcmV0dXJuIHF1YXQubm9ybWFsaXplKG91dCwgb3V0KTtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIFNldHMgdGhlIHNwZWNpZmllZCBxdWF0ZXJuaW9uIHdpdGggdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gKiBheGVzLiBFYWNoIGF4aXMgaXMgYSB2ZWMzIGFuZCBpcyBleHBlY3RlZCB0byBiZSB1bml0IGxlbmd0aCBhbmRcbiAqIHBlcnBlbmRpY3VsYXIgdG8gYWxsIG90aGVyIHNwZWNpZmllZCBheGVzLlxuICpcbiAqIEBwYXJhbSB7dmVjM30gdmlldyAgdGhlIHZlY3RvciByZXByZXNlbnRpbmcgdGhlIHZpZXdpbmcgZGlyZWN0aW9uXG4gKiBAcGFyYW0ge3ZlYzN9IHJpZ2h0IHRoZSB2ZWN0b3IgcmVwcmVzZW50aW5nIHRoZSBsb2NhbCBcInJpZ2h0XCIgZGlyZWN0aW9uXG4gKiBAcGFyYW0ge3ZlYzN9IHVwICAgIHRoZSB2ZWN0b3IgcmVwcmVzZW50aW5nIHRoZSBsb2NhbCBcInVwXCIgZGlyZWN0aW9uXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQuc2V0QXhlcyA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgbWF0ciA9IG1hdDMuY3JlYXRlKCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob3V0LCB2aWV3LCByaWdodCwgdXApIHtcbiAgICAgICAgbWF0clswXSA9IHJpZ2h0WzBdO1xuICAgICAgICBtYXRyWzNdID0gcmlnaHRbMV07XG4gICAgICAgIG1hdHJbNl0gPSByaWdodFsyXTtcblxuICAgICAgICBtYXRyWzFdID0gdXBbMF07XG4gICAgICAgIG1hdHJbNF0gPSB1cFsxXTtcbiAgICAgICAgbWF0cls3XSA9IHVwWzJdO1xuXG4gICAgICAgIG1hdHJbMl0gPSAtdmlld1swXTtcbiAgICAgICAgbWF0cls1XSA9IC12aWV3WzFdO1xuICAgICAgICBtYXRyWzhdID0gLXZpZXdbMl07XG5cbiAgICAgICAgcmV0dXJuIHF1YXQubm9ybWFsaXplKG91dCwgcXVhdC5mcm9tTWF0MyhvdXQsIG1hdHIpKTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHF1YXQgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyBxdWF0ZXJuaW9uXG4gKlxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXRlcm5pb24gdG8gY2xvbmVcbiAqIEByZXR1cm5zIHtxdWF0fSBhIG5ldyBxdWF0ZXJuaW9uXG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5jbG9uZSA9IHZlYzQuY2xvbmU7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBxdWF0IGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB3IFcgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7cXVhdH0gYSBuZXcgcXVhdGVybmlvblxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuZnJvbVZhbHVlcyA9IHZlYzQuZnJvbVZhbHVlcztcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgcXVhdCB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIHNvdXJjZSBxdWF0ZXJuaW9uXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5jb3B5ID0gdmVjNC5jb3B5O1xuXG4vKipcbiAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIHF1YXQgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geiBaIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHcgVyBjb21wb25lbnRcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LnNldCA9IHZlYzQuc2V0O1xuXG4vKipcbiAqIFNldCBhIHF1YXQgdG8gdGhlIGlkZW50aXR5IHF1YXRlcm5pb25cbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5pZGVudGl0eSA9IGZ1bmN0aW9uKG91dCkge1xuICAgIG91dFswXSA9IDA7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2V0cyBhIHF1YXQgZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYW5kIHJvdGF0aW9uIGF4aXMsXG4gKiB0aGVuIHJldHVybnMgaXQuXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3ZlYzN9IGF4aXMgdGhlIGF4aXMgYXJvdW5kIHdoaWNoIHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgaW4gcmFkaWFuc1xuICogQHJldHVybnMge3F1YXR9IG91dFxuICoqL1xucXVhdC5zZXRBeGlzQW5nbGUgPSBmdW5jdGlvbihvdXQsIGF4aXMsIHJhZCkge1xuICAgIHJhZCA9IHJhZCAqIDAuNTtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgb3V0WzBdID0gcyAqIGF4aXNbMF07XG4gICAgb3V0WzFdID0gcyAqIGF4aXNbMV07XG4gICAgb3V0WzJdID0gcyAqIGF4aXNbMl07XG4gICAgb3V0WzNdID0gTWF0aC5jb3MocmFkKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBZGRzIHR3byBxdWF0J3NcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3F1YXR9IG91dFxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuYWRkID0gdmVjNC5hZGQ7XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gcXVhdCdzXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5tdWx0aXBseSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLCBhdyA9IGFbM10sXG4gICAgICAgIGJ4ID0gYlswXSwgYnkgPSBiWzFdLCBieiA9IGJbMl0sIGJ3ID0gYlszXTtcblxuICAgIG91dFswXSA9IGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnk7XG4gICAgb3V0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcbiAgICBvdXRbMl0gPSBheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4O1xuICAgIG91dFszXSA9IGF3ICogYncgLSBheCAqIGJ4IC0gYXkgKiBieSAtIGF6ICogYno7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayBxdWF0Lm11bHRpcGx5fVxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQubXVsID0gcXVhdC5tdWx0aXBseTtcblxuLyoqXG4gKiBTY2FsZXMgYSBxdWF0IGJ5IGEgc2NhbGFyIG51bWJlclxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIHZlY3RvciB0byBzY2FsZVxuICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSB2ZWN0b3IgYnlcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LnNjYWxlID0gdmVjNC5zY2FsZTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgcXVhdGVybmlvbiBieSB0aGUgZ2l2ZW4gYW5nbGUgYWJvdXQgdGhlIFggYXhpc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHF1YXQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCBhbmdsZSAoaW4gcmFkaWFucykgdG8gcm90YXRlXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQucm90YXRlWCA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHJhZCAqPSAwLjU7IFxuXG4gICAgdmFyIGF4ID0gYVswXSwgYXkgPSBhWzFdLCBheiA9IGFbMl0sIGF3ID0gYVszXSxcbiAgICAgICAgYnggPSBNYXRoLnNpbihyYWQpLCBidyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICBvdXRbMF0gPSBheCAqIGJ3ICsgYXcgKiBieDtcbiAgICBvdXRbMV0gPSBheSAqIGJ3ICsgYXogKiBieDtcbiAgICBvdXRbMl0gPSBheiAqIGJ3IC0gYXkgKiBieDtcbiAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXggKiBieDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgcXVhdGVybmlvbiBieSB0aGUgZ2l2ZW4gYW5nbGUgYWJvdXQgdGhlIFkgYXhpc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHF1YXQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCBhbmdsZSAoaW4gcmFkaWFucykgdG8gcm90YXRlXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQucm90YXRlWSA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHJhZCAqPSAwLjU7IFxuXG4gICAgdmFyIGF4ID0gYVswXSwgYXkgPSBhWzFdLCBheiA9IGFbMl0sIGF3ID0gYVszXSxcbiAgICAgICAgYnkgPSBNYXRoLnNpbihyYWQpLCBidyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICBvdXRbMF0gPSBheCAqIGJ3IC0gYXogKiBieTtcbiAgICBvdXRbMV0gPSBheSAqIGJ3ICsgYXcgKiBieTtcbiAgICBvdXRbMl0gPSBheiAqIGJ3ICsgYXggKiBieTtcbiAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXkgKiBieTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgcXVhdGVybmlvbiBieSB0aGUgZ2l2ZW4gYW5nbGUgYWJvdXQgdGhlIFogYXhpc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHF1YXQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCBhbmdsZSAoaW4gcmFkaWFucykgdG8gcm90YXRlXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQucm90YXRlWiA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHJhZCAqPSAwLjU7IFxuXG4gICAgdmFyIGF4ID0gYVswXSwgYXkgPSBhWzFdLCBheiA9IGFbMl0sIGF3ID0gYVszXSxcbiAgICAgICAgYnogPSBNYXRoLnNpbihyYWQpLCBidyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICBvdXRbMF0gPSBheCAqIGJ3ICsgYXkgKiBiejtcbiAgICBvdXRbMV0gPSBheSAqIGJ3IC0gYXggKiBiejtcbiAgICBvdXRbMl0gPSBheiAqIGJ3ICsgYXcgKiBiejtcbiAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXogKiBiejtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBXIGNvbXBvbmVudCBvZiBhIHF1YXQgZnJvbSB0aGUgWCwgWSwgYW5kIFogY29tcG9uZW50cy5cbiAqIEFzc3VtZXMgdGhhdCBxdWF0ZXJuaW9uIGlzIDEgdW5pdCBpbiBsZW5ndGguXG4gKiBBbnkgZXhpc3RpbmcgVyBjb21wb25lbnQgd2lsbCBiZSBpZ25vcmVkLlxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXQgdG8gY2FsY3VsYXRlIFcgY29tcG9uZW50IG9mXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQuY2FsY3VsYXRlVyA9IGZ1bmN0aW9uIChvdXQsIGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sIHkgPSBhWzFdLCB6ID0gYVsyXTtcblxuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICBvdXRbMl0gPSB6O1xuICAgIG91dFszXSA9IE1hdGguc3FydChNYXRoLmFicygxLjAgLSB4ICogeCAtIHkgKiB5IC0geiAqIHopKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gcXVhdCdzXG4gKlxuICogQHBhcmFtIHtxdWF0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkb3QgcHJvZHVjdCBvZiBhIGFuZCBiXG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5kb3QgPSB2ZWM0LmRvdDtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHF1YXQnc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3F1YXR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5sZXJwID0gdmVjNC5sZXJwO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgc3BoZXJpY2FsIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHF1YXRcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LnNsZXJwID0gZnVuY3Rpb24gKG91dCwgYSwgYiwgdCkge1xuICAgIC8vIGJlbmNobWFya3M6XG4gICAgLy8gICAgaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi1zbGVycC1pbXBsZW1lbnRhdGlvbnNcblxuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLCBhdyA9IGFbM10sXG4gICAgICAgIGJ4ID0gYlswXSwgYnkgPSBiWzFdLCBieiA9IGJbMl0sIGJ3ID0gYlszXTtcblxuICAgIHZhciAgICAgICAgb21lZ2EsIGNvc29tLCBzaW5vbSwgc2NhbGUwLCBzY2FsZTE7XG5cbiAgICAvLyBjYWxjIGNvc2luZVxuICAgIGNvc29tID0gYXggKiBieCArIGF5ICogYnkgKyBheiAqIGJ6ICsgYXcgKiBidztcbiAgICAvLyBhZGp1c3Qgc2lnbnMgKGlmIG5lY2Vzc2FyeSlcbiAgICBpZiAoIGNvc29tIDwgMC4wICkge1xuICAgICAgICBjb3NvbSA9IC1jb3NvbTtcbiAgICAgICAgYnggPSAtIGJ4O1xuICAgICAgICBieSA9IC0gYnk7XG4gICAgICAgIGJ6ID0gLSBiejtcbiAgICAgICAgYncgPSAtIGJ3O1xuICAgIH1cbiAgICAvLyBjYWxjdWxhdGUgY29lZmZpY2llbnRzXG4gICAgaWYgKCAoMS4wIC0gY29zb20pID4gMC4wMDAwMDEgKSB7XG4gICAgICAgIC8vIHN0YW5kYXJkIGNhc2UgKHNsZXJwKVxuICAgICAgICBvbWVnYSAgPSBNYXRoLmFjb3MoY29zb20pO1xuICAgICAgICBzaW5vbSAgPSBNYXRoLnNpbihvbWVnYSk7XG4gICAgICAgIHNjYWxlMCA9IE1hdGguc2luKCgxLjAgLSB0KSAqIG9tZWdhKSAvIHNpbm9tO1xuICAgICAgICBzY2FsZTEgPSBNYXRoLnNpbih0ICogb21lZ2EpIC8gc2lub207XG4gICAgfSBlbHNlIHsgICAgICAgIFxuICAgICAgICAvLyBcImZyb21cIiBhbmQgXCJ0b1wiIHF1YXRlcm5pb25zIGFyZSB2ZXJ5IGNsb3NlIFxuICAgICAgICAvLyAgLi4uIHNvIHdlIGNhbiBkbyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uXG4gICAgICAgIHNjYWxlMCA9IDEuMCAtIHQ7XG4gICAgICAgIHNjYWxlMSA9IHQ7XG4gICAgfVxuICAgIC8vIGNhbGN1bGF0ZSBmaW5hbCB2YWx1ZXNcbiAgICBvdXRbMF0gPSBzY2FsZTAgKiBheCArIHNjYWxlMSAqIGJ4O1xuICAgIG91dFsxXSA9IHNjYWxlMCAqIGF5ICsgc2NhbGUxICogYnk7XG4gICAgb3V0WzJdID0gc2NhbGUwICogYXogKyBzY2FsZTEgKiBiejtcbiAgICBvdXRbM10gPSBzY2FsZTAgKiBhdyArIHNjYWxlMSAqIGJ3O1xuICAgIFxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgc3BoZXJpY2FsIGxpbmVhciBpbnRlcnBvbGF0aW9uIHdpdGggdHdvIGNvbnRyb2wgcG9pbnRzXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gYyB0aGUgdGhpcmQgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBkIHRoZSBmb3VydGggb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnRcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5zcWxlcnAgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgdGVtcDEgPSBxdWF0LmNyZWF0ZSgpO1xuICB2YXIgdGVtcDIgPSBxdWF0LmNyZWF0ZSgpO1xuICBcbiAgcmV0dXJuIGZ1bmN0aW9uIChvdXQsIGEsIGIsIGMsIGQsIHQpIHtcbiAgICBxdWF0LnNsZXJwKHRlbXAxLCBhLCBkLCB0KTtcbiAgICBxdWF0LnNsZXJwKHRlbXAyLCBiLCBjLCB0KTtcbiAgICBxdWF0LnNsZXJwKG91dCwgdGVtcDEsIHRlbXAyLCAyICogdCAqICgxIC0gdCkpO1xuICAgIFxuICAgIHJldHVybiBvdXQ7XG4gIH07XG59KCkpO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGludmVyc2Ugb2YgYSBxdWF0XG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byBjYWxjdWxhdGUgaW52ZXJzZSBvZlxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LmludmVydCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sXG4gICAgICAgIGRvdCA9IGEwKmEwICsgYTEqYTEgKyBhMiphMiArIGEzKmEzLFxuICAgICAgICBpbnZEb3QgPSBkb3QgPyAxLjAvZG90IDogMDtcbiAgICBcbiAgICAvLyBUT0RPOiBXb3VsZCBiZSBmYXN0ZXIgdG8gcmV0dXJuIFswLDAsMCwwXSBpbW1lZGlhdGVseSBpZiBkb3QgPT0gMFxuXG4gICAgb3V0WzBdID0gLWEwKmludkRvdDtcbiAgICBvdXRbMV0gPSAtYTEqaW52RG90O1xuICAgIG91dFsyXSA9IC1hMippbnZEb3Q7XG4gICAgb3V0WzNdID0gYTMqaW52RG90O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGNvbmp1Z2F0ZSBvZiBhIHF1YXRcbiAqIElmIHRoZSBxdWF0ZXJuaW9uIGlzIG5vcm1hbGl6ZWQsIHRoaXMgZnVuY3Rpb24gaXMgZmFzdGVyIHRoYW4gcXVhdC5pbnZlcnNlIGFuZCBwcm9kdWNlcyB0aGUgc2FtZSByZXN1bHQuXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byBjYWxjdWxhdGUgY29uanVnYXRlIG9mXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQuY29uanVnYXRlID0gZnVuY3Rpb24gKG91dCwgYSkge1xuICAgIG91dFswXSA9IC1hWzBdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIG91dFsyXSA9IC1hWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgcXVhdFxuICpcbiAqIEBwYXJhbSB7cXVhdH0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGFcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0Lmxlbmd0aCA9IHZlYzQubGVuZ3RoO1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgcXVhdC5sZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5sZW4gPSBxdWF0Lmxlbmd0aDtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiBhIHF1YXRcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBzcXVhcmVkIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBsZW5ndGggb2YgYVxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuc3F1YXJlZExlbmd0aCA9IHZlYzQuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHF1YXQuc3F1YXJlZExlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LnNxckxlbiA9IHF1YXQuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBOb3JtYWxpemUgYSBxdWF0XG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdGVybmlvbiB0byBub3JtYWxpemVcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0Lm5vcm1hbGl6ZSA9IHZlYzQubm9ybWFsaXplO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBxdWF0ZXJuaW9uIGZyb20gdGhlIGdpdmVuIDN4MyByb3RhdGlvbiBtYXRyaXguXG4gKlxuICogTk9URTogVGhlIHJlc3VsdGFudCBxdWF0ZXJuaW9uIGlzIG5vdCBub3JtYWxpemVkLCBzbyB5b3Ugc2hvdWxkIGJlIHN1cmVcbiAqIHRvIHJlbm9ybWFsaXplIHRoZSBxdWF0ZXJuaW9uIHlvdXJzZWxmIHdoZXJlIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7bWF0M30gbSByb3RhdGlvbiBtYXRyaXhcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LmZyb21NYXQzID0gZnVuY3Rpb24ob3V0LCBtKSB7XG4gICAgLy8gQWxnb3JpdGhtIGluIEtlbiBTaG9lbWFrZSdzIGFydGljbGUgaW4gMTk4NyBTSUdHUkFQSCBjb3Vyc2Ugbm90ZXNcbiAgICAvLyBhcnRpY2xlIFwiUXVhdGVybmlvbiBDYWxjdWx1cyBhbmQgRmFzdCBBbmltYXRpb25cIi5cbiAgICB2YXIgZlRyYWNlID0gbVswXSArIG1bNF0gKyBtWzhdO1xuICAgIHZhciBmUm9vdDtcblxuICAgIGlmICggZlRyYWNlID4gMC4wICkge1xuICAgICAgICAvLyB8d3wgPiAxLzIsIG1heSBhcyB3ZWxsIGNob29zZSB3ID4gMS8yXG4gICAgICAgIGZSb290ID0gTWF0aC5zcXJ0KGZUcmFjZSArIDEuMCk7ICAvLyAyd1xuICAgICAgICBvdXRbM10gPSAwLjUgKiBmUm9vdDtcbiAgICAgICAgZlJvb3QgPSAwLjUvZlJvb3Q7ICAvLyAxLyg0dylcbiAgICAgICAgb3V0WzBdID0gKG1bNV0tbVs3XSkqZlJvb3Q7XG4gICAgICAgIG91dFsxXSA9IChtWzZdLW1bMl0pKmZSb290O1xuICAgICAgICBvdXRbMl0gPSAobVsxXS1tWzNdKSpmUm9vdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB8d3wgPD0gMS8yXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgaWYgKCBtWzRdID4gbVswXSApXG4gICAgICAgICAgaSA9IDE7XG4gICAgICAgIGlmICggbVs4XSA+IG1baSozK2ldIClcbiAgICAgICAgICBpID0gMjtcbiAgICAgICAgdmFyIGogPSAoaSsxKSUzO1xuICAgICAgICB2YXIgayA9IChpKzIpJTM7XG4gICAgICAgIFxuICAgICAgICBmUm9vdCA9IE1hdGguc3FydChtW2kqMytpXS1tW2oqMytqXS1tW2sqMytrXSArIDEuMCk7XG4gICAgICAgIG91dFtpXSA9IDAuNSAqIGZSb290O1xuICAgICAgICBmUm9vdCA9IDAuNSAvIGZSb290O1xuICAgICAgICBvdXRbM10gPSAobVtqKjMra10gLSBtW2sqMytqXSkgKiBmUm9vdDtcbiAgICAgICAgb3V0W2pdID0gKG1baiozK2ldICsgbVtpKjMral0pICogZlJvb3Q7XG4gICAgICAgIG91dFtrXSA9IChtW2sqMytpXSArIG1baSozK2tdKSAqIGZSb290O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgcXVhdGVuaW9uXG4gKlxuICogQHBhcmFtIHtxdWF0fSB2ZWMgdmVjdG9yIHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3JcbiAqL1xucXVhdC5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAncXVhdCgnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgYVszXSArICcpJztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcXVhdDtcbiIsIi8qIENvcHlyaWdodCAoYykgMjAxNSwgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuICovXG5cbnZhciBnbE1hdHJpeCA9IHJlcXVpcmUoXCIuL2NvbW1vbi5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgMiBEaW1lbnNpb25hbCBWZWN0b3JcbiAqIEBuYW1lIHZlYzJcbiAqL1xudmFyIHZlYzIgPSB7fTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3LCBlbXB0eSB2ZWMyXG4gKlxuICogQHJldHVybnMge3ZlYzJ9IGEgbmV3IDJEIHZlY3RvclxuICovXG52ZWMyLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgyKTtcbiAgICBvdXRbMF0gPSAwO1xuICAgIG91dFsxXSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB2ZWMyIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgdmVjdG9yXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBhIHZlY3RvciB0byBjbG9uZVxuICogQHJldHVybnMge3ZlYzJ9IGEgbmV3IDJEIHZlY3RvclxuICovXG52ZWMyLmNsb25lID0gZnVuY3Rpb24oYSkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgyKTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB2ZWMyIGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHJldHVybnMge3ZlYzJ9IGEgbmV3IDJEIHZlY3RvclxuICovXG52ZWMyLmZyb21WYWx1ZXMgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDIpO1xuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgdmVjMiB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgc291cmNlIHZlY3RvclxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMiB0byB0aGUgZ2l2ZW4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnNldCA9IGZ1bmN0aW9uKG91dCwgeCwgeSkge1xuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBZGRzIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuYWRkID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU3VidHJhY3RzIHZlY3RvciBiIGZyb20gdmVjdG9yIGFcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuc3VidHJhY3QgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC0gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuc3VidHJhY3R9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5zdWIgPSB2ZWMyLnN1YnRyYWN0O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5tdWx0aXBseSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMi5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLm11bCA9IHZlYzIubXVsdGlwbHk7XG5cbi8qKlxuICogRGl2aWRlcyB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLmRpdmlkZSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLyBiWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMi5kaXZpZGV9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5kaXYgPSB2ZWMyLmRpdmlkZTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtaW5pbXVtIG9mIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIubWluID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5taW4oYVsxXSwgYlsxXSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4aW11bSBvZiB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLm1heCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWF4KGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyBhIHZlYzIgYnkgYSBzY2FsYXIgbnVtYmVyXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgdmVjdG9yIHRvIHNjYWxlXG4gKiBAcGFyYW0ge051bWJlcn0gYiBhbW91bnQgdG8gc2NhbGUgdGhlIHZlY3RvciBieVxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnNjYWxlID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGI7XG4gICAgb3V0WzFdID0gYVsxXSAqIGI7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWRkcyB0d28gdmVjMidzIGFmdGVyIHNjYWxpbmcgdGhlIHNlY29uZCBvcGVyYW5kIGJ5IGEgc2NhbGFyIHZhbHVlXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlIHRoZSBhbW91bnQgdG8gc2NhbGUgYiBieSBiZWZvcmUgYWRkaW5nXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuc2NhbGVBbmRBZGQgPSBmdW5jdGlvbihvdXQsIGEsIGIsIHNjYWxlKSB7XG4gICAgb3V0WzBdID0gYVswXSArIChiWzBdICogc2NhbGUpO1xuICAgIG91dFsxXSA9IGFbMV0gKyAoYlsxXSAqIHNjYWxlKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xudmVjMi5kaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdLFxuICAgICAgICB5ID0gYlsxXSAtIGFbMV07XG4gICAgcmV0dXJuIE1hdGguc3FydCh4KnggKyB5KnkpO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuZGlzdGFuY2V9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5kaXN0ID0gdmVjMi5kaXN0YW5jZTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cbnZlYzIuc3F1YXJlZERpc3RhbmNlID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciB4ID0gYlswXSAtIGFbMF0sXG4gICAgICAgIHkgPSBiWzFdIC0gYVsxXTtcbiAgICByZXR1cm4geCp4ICsgeSp5O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuc3F1YXJlZERpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzIuc3FyRGlzdCA9IHZlYzIuc3F1YXJlZERpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHZlYzJcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gKi9cbnZlYzIubGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCp4ICsgeSp5KTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLmxlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLmxlbiA9IHZlYzIubGVuZ3RoO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIGEgdmVjMlxuICpcbiAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIHNxdWFyZWQgbGVuZ3RoIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGxlbmd0aCBvZiBhXG4gKi9cbnZlYzIuc3F1YXJlZExlbmd0aCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICByZXR1cm4geCp4ICsgeSp5O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuc3F1YXJlZExlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLnNxckxlbiA9IHZlYzIuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBOZWdhdGVzIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMlxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIG5lZ2F0ZVxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLm5lZ2F0ZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IC1hWzBdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMyXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gaW52ZXJ0XG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuaW52ZXJzZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICBvdXRbMF0gPSAxLjAgLyBhWzBdO1xuICBvdXRbMV0gPSAxLjAgLyBhWzFdO1xuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgYSB2ZWMyXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gbm9ybWFsaXplXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIubm9ybWFsaXplID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICB2YXIgbGVuID0geCp4ICsgeSp5O1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIC8vVE9ETzogZXZhbHVhdGUgdXNlIG9mIGdsbV9pbnZzcXJ0IGhlcmU/XG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgb3V0WzBdID0gYVswXSAqIGxlbjtcbiAgICAgICAgb3V0WzFdID0gYVsxXSAqIGxlbjtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZG90IHByb2R1Y3Qgb2YgYSBhbmQgYlxuICovXG52ZWMyLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV07XG59O1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHR3byB2ZWMyJ3NcbiAqIE5vdGUgdGhhdCB0aGUgY3Jvc3MgcHJvZHVjdCBtdXN0IGJ5IGRlZmluaXRpb24gcHJvZHVjZSBhIDNEIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMi5jcm9zcyA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIHZhciB6ID0gYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbiAgICBvdXRbMF0gPSBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IHo7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIubGVycCA9IGZ1bmN0aW9uIChvdXQsIGEsIGIsIHQpIHtcbiAgICB2YXIgYXggPSBhWzBdLFxuICAgICAgICBheSA9IGFbMV07XG4gICAgb3V0WzBdID0gYXggKyB0ICogKGJbMF0gLSBheCk7XG4gICAgb3V0WzFdID0gYXkgKyB0ICogKGJbMV0gLSBheSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgcmFuZG9tIHZlY3RvciB3aXRoIHRoZSBnaXZlbiBzY2FsZVxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXSBMZW5ndGggb2YgdGhlIHJlc3VsdGluZyB2ZWN0b3IuIElmIG9tbWl0dGVkLCBhIHVuaXQgdmVjdG9yIHdpbGwgYmUgcmV0dXJuZWRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5yYW5kb20gPSBmdW5jdGlvbiAob3V0LCBzY2FsZSkge1xuICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xuICAgIHZhciByID0gZ2xNYXRyaXguUkFORE9NKCkgKiAyLjAgKiBNYXRoLlBJO1xuICAgIG91dFswXSA9IE1hdGguY29zKHIpICogc2NhbGU7XG4gICAgb3V0WzFdID0gTWF0aC5zaW4ocikgKiBzY2FsZTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMyIHdpdGggYSBtYXQyXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICogQHBhcmFtIHttYXQyfSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnRyYW5zZm9ybU1hdDIgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVsyXSAqIHk7XG4gICAgb3V0WzFdID0gbVsxXSAqIHggKyBtWzNdICogeTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMyIHdpdGggYSBtYXQyZFxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0MmR9IG0gbWF0cml4IHRvIHRyYW5zZm9ybSB3aXRoXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIudHJhbnNmb3JtTWF0MmQgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVsyXSAqIHkgKyBtWzRdO1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVszXSAqIHkgKyBtWzVdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzIgd2l0aCBhIG1hdDNcbiAqIDNyZCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICogQHBhcmFtIHttYXQzfSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnRyYW5zZm9ybU1hdDMgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVszXSAqIHkgKyBtWzZdO1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVs0XSAqIHkgKyBtWzddO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzIgd2l0aCBhIG1hdDRcbiAqIDNyZCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzAnXG4gKiA0dGggdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcxJ1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi50cmFuc2Zvcm1NYXQ0ID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLCBcbiAgICAgICAgeSA9IGFbMV07XG4gICAgb3V0WzBdID0gbVswXSAqIHggKyBtWzRdICogeSArIG1bMTJdO1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWzEzXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtIHNvbWUgb3BlcmF0aW9uIG92ZXIgYW4gYXJyYXkgb2YgdmVjMnMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYSB0aGUgYXJyYXkgb2YgdmVjdG9ycyB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgTnVtYmVyIG9mIGVsZW1lbnRzIGJldHdlZW4gdGhlIHN0YXJ0IG9mIGVhY2ggdmVjMi4gSWYgMCBhc3N1bWVzIHRpZ2h0bHkgcGFja2VkXG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IE51bWJlciBvZiBlbGVtZW50cyB0byBza2lwIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGFycmF5XG4gKiBAcGFyYW0ge051bWJlcn0gY291bnQgTnVtYmVyIG9mIHZlYzJzIHRvIGl0ZXJhdGUgb3Zlci4gSWYgMCBpdGVyYXRlcyBvdmVyIGVudGlyZSBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB2ZWN0b3IgaW4gdGhlIGFycmF5XG4gKiBAcGFyYW0ge09iamVjdH0gW2FyZ10gYWRkaXRpb25hbCBhcmd1bWVudCB0byBwYXNzIHRvIGZuXG4gKiBAcmV0dXJucyB7QXJyYXl9IGFcbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLmZvckVhY2ggPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZlYyA9IHZlYzIuY3JlYXRlKCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oYSwgc3RyaWRlLCBvZmZzZXQsIGNvdW50LCBmbiwgYXJnKSB7XG4gICAgICAgIHZhciBpLCBsO1xuICAgICAgICBpZighc3RyaWRlKSB7XG4gICAgICAgICAgICBzdHJpZGUgPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIW9mZnNldCkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoY291bnQpIHtcbiAgICAgICAgICAgIGwgPSBNYXRoLm1pbigoY291bnQgKiBzdHJpZGUpICsgb2Zmc2V0LCBhLmxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsID0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoaSA9IG9mZnNldDsgaSA8IGw7IGkgKz0gc3RyaWRlKSB7XG4gICAgICAgICAgICB2ZWNbMF0gPSBhW2ldOyB2ZWNbMV0gPSBhW2krMV07XG4gICAgICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgICAgIGFbaV0gPSB2ZWNbMF07IGFbaSsxXSA9IHZlY1sxXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjMn0gdmVjIHZlY3RvciB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gKi9cbnZlYzIuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ3ZlYzIoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcpJztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdmVjMjtcbiIsIi8qIENvcHlyaWdodCAoYykgMjAxNSwgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuICovXG5cbnZhciBnbE1hdHJpeCA9IHJlcXVpcmUoXCIuL2NvbW1vbi5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgMyBEaW1lbnNpb25hbCBWZWN0b3JcbiAqIEBuYW1lIHZlYzNcbiAqL1xudmFyIHZlYzMgPSB7fTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3LCBlbXB0eSB2ZWMzXG4gKlxuICogQHJldHVybnMge3ZlYzN9IGEgbmV3IDNEIHZlY3RvclxuICovXG52ZWMzLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQgPSBuZXcgZ2xNYXRyaXguQVJSQVlfVFlQRSgzKTtcbiAgICBvdXRbMF0gPSAwO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHZlYzMgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIGNsb25lXG4gKiBAcmV0dXJucyB7dmVjM30gYSBuZXcgM0QgdmVjdG9yXG4gKi9cbnZlYzMuY2xvbmUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDMpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdmVjMyBpbml0aWFsaXplZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFogY29tcG9uZW50XG4gKiBAcmV0dXJucyB7dmVjM30gYSBuZXcgM0QgdmVjdG9yXG4gKi9cbnZlYzMuZnJvbVZhbHVlcyA9IGZ1bmN0aW9uKHgsIHksIHopIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoMyk7XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIG91dFsyXSA9IHo7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIHZlYzMgdG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIHNvdXJjZSB2ZWN0b3JcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5jb3B5ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMyB0byB0aGUgZ2l2ZW4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5zZXQgPSBmdW5jdGlvbihvdXQsIHgsIHksIHopIHtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBZGRzIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuYWRkID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSArIGJbMl07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU3VidHJhY3RzIHZlY3RvciBiIGZyb20gdmVjdG9yIGFcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuc3VidHJhY3QgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC0gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMuc3VidHJhY3R9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5zdWIgPSB2ZWMzLnN1YnRyYWN0O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5tdWx0aXBseSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiWzJdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMzLm11bCA9IHZlYzMubXVsdGlwbHk7XG5cbi8qKlxuICogRGl2aWRlcyB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLmRpdmlkZSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLyBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gLyBiWzJdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5kaXZpZGV9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5kaXYgPSB2ZWMzLmRpdmlkZTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtaW5pbXVtIG9mIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMubWluID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5taW4oYVsxXSwgYlsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5taW4oYVsyXSwgYlsyXSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4aW11bSBvZiB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLm1heCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWF4KGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICAgIG91dFsyXSA9IE1hdGgubWF4KGFbMl0sIGJbMl0pO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyBhIHZlYzMgYnkgYSBzY2FsYXIgbnVtYmVyXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgdmVjdG9yIHRvIHNjYWxlXG4gKiBAcGFyYW0ge051bWJlcn0gYiBhbW91bnQgdG8gc2NhbGUgdGhlIHZlY3RvciBieVxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnNjYWxlID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGI7XG4gICAgb3V0WzFdID0gYVsxXSAqIGI7XG4gICAgb3V0WzJdID0gYVsyXSAqIGI7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWRkcyB0d28gdmVjMydzIGFmdGVyIHNjYWxpbmcgdGhlIHNlY29uZCBvcGVyYW5kIGJ5IGEgc2NhbGFyIHZhbHVlXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlIHRoZSBhbW91bnQgdG8gc2NhbGUgYiBieSBiZWZvcmUgYWRkaW5nXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuc2NhbGVBbmRBZGQgPSBmdW5jdGlvbihvdXQsIGEsIGIsIHNjYWxlKSB7XG4gICAgb3V0WzBdID0gYVswXSArIChiWzBdICogc2NhbGUpO1xuICAgIG91dFsxXSA9IGFbMV0gKyAoYlsxXSAqIHNjYWxlKTtcbiAgICBvdXRbMl0gPSBhWzJdICsgKGJbMl0gKiBzY2FsZSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cbnZlYzMuZGlzdGFuY2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXSxcbiAgICAgICAgeSA9IGJbMV0gLSBhWzFdLFxuICAgICAgICB6ID0gYlsyXSAtIGFbMl07XG4gICAgcmV0dXJuIE1hdGguc3FydCh4KnggKyB5KnkgKyB6KnopO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMuZGlzdGFuY2V9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5kaXN0ID0gdmVjMy5kaXN0YW5jZTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cbnZlYzMuc3F1YXJlZERpc3RhbmNlID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciB4ID0gYlswXSAtIGFbMF0sXG4gICAgICAgIHkgPSBiWzFdIC0gYVsxXSxcbiAgICAgICAgeiA9IGJbMl0gLSBhWzJdO1xuICAgIHJldHVybiB4KnggKyB5KnkgKyB6Kno7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5zcXVhcmVkRGlzdGFuY2V9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5zcXJEaXN0ID0gdmVjMy5zcXVhcmVkRGlzdGFuY2U7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgdmVjM1xuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGFcbiAqL1xudmVjMy5sZW5ndGggPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCp4ICsgeSp5ICsgeip6KTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLmxlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMzLmxlbiA9IHZlYzMubGVuZ3RoO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIGEgdmVjM1xuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIHNxdWFyZWQgbGVuZ3RoIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGxlbmd0aCBvZiBhXG4gKi9cbnZlYzMuc3F1YXJlZExlbmd0aCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl07XG4gICAgcmV0dXJuIHgqeCArIHkqeSArIHoqejtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLnNxdWFyZWRMZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5zcXJMZW4gPSB2ZWMzLnNxdWFyZWRMZW5ndGg7XG5cbi8qKlxuICogTmVnYXRlcyB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBuZWdhdGVcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5uZWdhdGUgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICBvdXRbMl0gPSAtYVsyXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbnZlcnNlIG9mIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjM1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIGludmVydFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLmludmVyc2UgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgb3V0WzBdID0gMS4wIC8gYVswXTtcbiAgb3V0WzFdID0gMS4wIC8gYVsxXTtcbiAgb3V0WzJdID0gMS4wIC8gYVsyXTtcbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIGEgdmVjM1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIG5vcm1hbGl6ZVxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdO1xuICAgIHZhciBsZW4gPSB4KnggKyB5KnkgKyB6Kno7XG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgLy9UT0RPOiBldmFsdWF0ZSB1c2Ugb2YgZ2xtX2ludnNxcnQgaGVyZT9cbiAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICBvdXRbMF0gPSBhWzBdICogbGVuO1xuICAgICAgICBvdXRbMV0gPSBhWzFdICogbGVuO1xuICAgICAgICBvdXRbMl0gPSBhWzJdICogbGVuO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkb3QgcHJvZHVjdCBvZiBhIGFuZCBiXG4gKi9cbnZlYzMuZG90ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXSArIGFbMl0gKiBiWzJdO1xufTtcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLmNyb3NzID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgdmFyIGF4ID0gYVswXSwgYXkgPSBhWzFdLCBheiA9IGFbMl0sXG4gICAgICAgIGJ4ID0gYlswXSwgYnkgPSBiWzFdLCBieiA9IGJbMl07XG5cbiAgICBvdXRbMF0gPSBheSAqIGJ6IC0gYXogKiBieTtcbiAgICBvdXRbMV0gPSBheiAqIGJ4IC0gYXggKiBiejtcbiAgICBvdXRbMl0gPSBheCAqIGJ5IC0gYXkgKiBieDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50IGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5sZXJwID0gZnVuY3Rpb24gKG91dCwgYSwgYiwgdCkge1xuICAgIHZhciBheCA9IGFbMF0sXG4gICAgICAgIGF5ID0gYVsxXSxcbiAgICAgICAgYXogPSBhWzJdO1xuICAgIG91dFswXSA9IGF4ICsgdCAqIChiWzBdIC0gYXgpO1xuICAgIG91dFsxXSA9IGF5ICsgdCAqIChiWzFdIC0gYXkpO1xuICAgIG91dFsyXSA9IGF6ICsgdCAqIChiWzJdIC0gYXopO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgaGVybWl0ZSBpbnRlcnBvbGF0aW9uIHdpdGggdHdvIGNvbnRyb2wgcG9pbnRzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBjIHRoZSB0aGlyZCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGQgdGhlIGZvdXJ0aCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuaGVybWl0ZSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIsIGMsIGQsIHQpIHtcbiAgdmFyIGZhY3RvclRpbWVzMiA9IHQgKiB0LFxuICAgICAgZmFjdG9yMSA9IGZhY3RvclRpbWVzMiAqICgyICogdCAtIDMpICsgMSxcbiAgICAgIGZhY3RvcjIgPSBmYWN0b3JUaW1lczIgKiAodCAtIDIpICsgdCxcbiAgICAgIGZhY3RvcjMgPSBmYWN0b3JUaW1lczIgKiAodCAtIDEpLFxuICAgICAgZmFjdG9yNCA9IGZhY3RvclRpbWVzMiAqICgzIC0gMiAqIHQpO1xuICBcbiAgb3V0WzBdID0gYVswXSAqIGZhY3RvcjEgKyBiWzBdICogZmFjdG9yMiArIGNbMF0gKiBmYWN0b3IzICsgZFswXSAqIGZhY3RvcjQ7XG4gIG91dFsxXSA9IGFbMV0gKiBmYWN0b3IxICsgYlsxXSAqIGZhY3RvcjIgKyBjWzFdICogZmFjdG9yMyArIGRbMV0gKiBmYWN0b3I0O1xuICBvdXRbMl0gPSBhWzJdICogZmFjdG9yMSArIGJbMl0gKiBmYWN0b3IyICsgY1syXSAqIGZhY3RvcjMgKyBkWzJdICogZmFjdG9yNDtcbiAgXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgYmV6aWVyIGludGVycG9sYXRpb24gd2l0aCB0d28gY29udHJvbCBwb2ludHNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGMgdGhlIHRoaXJkIG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gZCB0aGUgZm91cnRoIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50IGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5iZXppZXIgPSBmdW5jdGlvbiAob3V0LCBhLCBiLCBjLCBkLCB0KSB7XG4gIHZhciBpbnZlcnNlRmFjdG9yID0gMSAtIHQsXG4gICAgICBpbnZlcnNlRmFjdG9yVGltZXNUd28gPSBpbnZlcnNlRmFjdG9yICogaW52ZXJzZUZhY3RvcixcbiAgICAgIGZhY3RvclRpbWVzMiA9IHQgKiB0LFxuICAgICAgZmFjdG9yMSA9IGludmVyc2VGYWN0b3JUaW1lc1R3byAqIGludmVyc2VGYWN0b3IsXG4gICAgICBmYWN0b3IyID0gMyAqIHQgKiBpbnZlcnNlRmFjdG9yVGltZXNUd28sXG4gICAgICBmYWN0b3IzID0gMyAqIGZhY3RvclRpbWVzMiAqIGludmVyc2VGYWN0b3IsXG4gICAgICBmYWN0b3I0ID0gZmFjdG9yVGltZXMyICogdDtcbiAgXG4gIG91dFswXSA9IGFbMF0gKiBmYWN0b3IxICsgYlswXSAqIGZhY3RvcjIgKyBjWzBdICogZmFjdG9yMyArIGRbMF0gKiBmYWN0b3I0O1xuICBvdXRbMV0gPSBhWzFdICogZmFjdG9yMSArIGJbMV0gKiBmYWN0b3IyICsgY1sxXSAqIGZhY3RvcjMgKyBkWzFdICogZmFjdG9yNDtcbiAgb3V0WzJdID0gYVsyXSAqIGZhY3RvcjEgKyBiWzJdICogZmFjdG9yMiArIGNbMl0gKiBmYWN0b3IzICsgZFsyXSAqIGZhY3RvcjQ7XG4gIFxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSByYW5kb20gdmVjdG9yIHdpdGggdGhlIGdpdmVuIHNjYWxlXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdIExlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHZlY3Rvci4gSWYgb21taXR0ZWQsIGEgdW5pdCB2ZWN0b3Igd2lsbCBiZSByZXR1cm5lZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnJhbmRvbSA9IGZ1bmN0aW9uIChvdXQsIHNjYWxlKSB7XG4gICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XG5cbiAgICB2YXIgciA9IGdsTWF0cml4LlJBTkRPTSgpICogMi4wICogTWF0aC5QSTtcbiAgICB2YXIgeiA9IChnbE1hdHJpeC5SQU5ET00oKSAqIDIuMCkgLSAxLjA7XG4gICAgdmFyIHpTY2FsZSA9IE1hdGguc3FydCgxLjAteip6KSAqIHNjYWxlO1xuXG4gICAgb3V0WzBdID0gTWF0aC5jb3MocikgKiB6U2NhbGU7XG4gICAgb3V0WzFdID0gTWF0aC5zaW4ocikgKiB6U2NhbGU7XG4gICAgb3V0WzJdID0geiAqIHNjYWxlO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzMgd2l0aCBhIG1hdDQuXG4gKiA0dGggdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcxJ1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy50cmFuc2Zvcm1NYXQ0ID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLCB5ID0gYVsxXSwgeiA9IGFbMl0sXG4gICAgICAgIHcgPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV07XG4gICAgdyA9IHcgfHwgMS4wO1xuICAgIG91dFswXSA9IChtWzBdICogeCArIG1bNF0gKiB5ICsgbVs4XSAqIHogKyBtWzEyXSkgLyB3O1xuICAgIG91dFsxXSA9IChtWzFdICogeCArIG1bNV0gKiB5ICsgbVs5XSAqIHogKyBtWzEzXSkgLyB3O1xuICAgIG91dFsyXSA9IChtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0pIC8gdztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMzIHdpdGggYSBtYXQzLlxuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0NH0gbSB0aGUgM3gzIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnRyYW5zZm9ybU1hdDMgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sIHkgPSBhWzFdLCB6ID0gYVsyXTtcbiAgICBvdXRbMF0gPSB4ICogbVswXSArIHkgKiBtWzNdICsgeiAqIG1bNl07XG4gICAgb3V0WzFdID0geCAqIG1bMV0gKyB5ICogbVs0XSArIHogKiBtWzddO1xuICAgIG91dFsyXSA9IHggKiBtWzJdICsgeSAqIG1bNV0gKyB6ICogbVs4XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMzIHdpdGggYSBxdWF0XG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICogQHBhcmFtIHtxdWF0fSBxIHF1YXRlcm5pb24gdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy50cmFuc2Zvcm1RdWF0ID0gZnVuY3Rpb24ob3V0LCBhLCBxKSB7XG4gICAgLy8gYmVuY2htYXJrczogaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi10cmFuc2Zvcm0tdmVjMy1pbXBsZW1lbnRhdGlvbnNcblxuICAgIHZhciB4ID0gYVswXSwgeSA9IGFbMV0sIHogPSBhWzJdLFxuICAgICAgICBxeCA9IHFbMF0sIHF5ID0gcVsxXSwgcXogPSBxWzJdLCBxdyA9IHFbM10sXG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHF1YXQgKiB2ZWNcbiAgICAgICAgaXggPSBxdyAqIHggKyBxeSAqIHogLSBxeiAqIHksXG4gICAgICAgIGl5ID0gcXcgKiB5ICsgcXogKiB4IC0gcXggKiB6LFxuICAgICAgICBpeiA9IHF3ICogeiArIHF4ICogeSAtIHF5ICogeCxcbiAgICAgICAgaXcgPSAtcXggKiB4IC0gcXkgKiB5IC0gcXogKiB6O1xuXG4gICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxuICAgIG91dFswXSA9IGl4ICogcXcgKyBpdyAqIC1xeCArIGl5ICogLXF6IC0gaXogKiAtcXk7XG4gICAgb3V0WzFdID0gaXkgKiBxdyArIGl3ICogLXF5ICsgaXogKiAtcXggLSBpeCAqIC1xejtcbiAgICBvdXRbMl0gPSBpeiAqIHF3ICsgaXcgKiAtcXogKyBpeCAqIC1xeSAtIGl5ICogLXF4O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZSBhIDNEIHZlY3RvciBhcm91bmQgdGhlIHgtYXhpc1xuICogQHBhcmFtIHt2ZWMzfSBvdXQgVGhlIHJlY2VpdmluZyB2ZWMzXG4gKiBAcGFyYW0ge3ZlYzN9IGEgVGhlIHZlYzMgcG9pbnQgdG8gcm90YXRlXG4gKiBAcGFyYW0ge3ZlYzN9IGIgVGhlIG9yaWdpbiBvZiB0aGUgcm90YXRpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBjIFRoZSBhbmdsZSBvZiByb3RhdGlvblxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnJvdGF0ZVggPSBmdW5jdGlvbihvdXQsIGEsIGIsIGMpe1xuICAgdmFyIHAgPSBbXSwgcj1bXTtcblx0ICAvL1RyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG5cdCAgcFswXSA9IGFbMF0gLSBiWzBdO1xuXHQgIHBbMV0gPSBhWzFdIC0gYlsxXTtcbiAgXHRwWzJdID0gYVsyXSAtIGJbMl07XG5cblx0ICAvL3BlcmZvcm0gcm90YXRpb25cblx0ICByWzBdID0gcFswXTtcblx0ICByWzFdID0gcFsxXSpNYXRoLmNvcyhjKSAtIHBbMl0qTWF0aC5zaW4oYyk7XG5cdCAgclsyXSA9IHBbMV0qTWF0aC5zaW4oYykgKyBwWzJdKk1hdGguY29zKGMpO1xuXG5cdCAgLy90cmFuc2xhdGUgdG8gY29ycmVjdCBwb3NpdGlvblxuXHQgIG91dFswXSA9IHJbMF0gKyBiWzBdO1xuXHQgIG91dFsxXSA9IHJbMV0gKyBiWzFdO1xuXHQgIG91dFsyXSA9IHJbMl0gKyBiWzJdO1xuXG4gIFx0cmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlIGEgM0QgdmVjdG9yIGFyb3VuZCB0aGUgeS1heGlzXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCBUaGUgcmVjZWl2aW5nIHZlYzNcbiAqIEBwYXJhbSB7dmVjM30gYSBUaGUgdmVjMyBwb2ludCB0byByb3RhdGVcbiAqIEBwYXJhbSB7dmVjM30gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IGMgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMucm90YXRlWSA9IGZ1bmN0aW9uKG91dCwgYSwgYiwgYyl7XG4gIFx0dmFyIHAgPSBbXSwgcj1bXTtcbiAgXHQvL1RyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gIFx0cFswXSA9IGFbMF0gLSBiWzBdO1xuICBcdHBbMV0gPSBhWzFdIC0gYlsxXTtcbiAgXHRwWzJdID0gYVsyXSAtIGJbMl07XG4gIFxuICBcdC8vcGVyZm9ybSByb3RhdGlvblxuICBcdHJbMF0gPSBwWzJdKk1hdGguc2luKGMpICsgcFswXSpNYXRoLmNvcyhjKTtcbiAgXHRyWzFdID0gcFsxXTtcbiAgXHRyWzJdID0gcFsyXSpNYXRoLmNvcyhjKSAtIHBbMF0qTWF0aC5zaW4oYyk7XG4gIFxuICBcdC8vdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cbiAgXHRvdXRbMF0gPSByWzBdICsgYlswXTtcbiAgXHRvdXRbMV0gPSByWzFdICsgYlsxXTtcbiAgXHRvdXRbMl0gPSByWzJdICsgYlsyXTtcbiAgXG4gIFx0cmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlIGEgM0QgdmVjdG9yIGFyb3VuZCB0aGUgei1heGlzXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCBUaGUgcmVjZWl2aW5nIHZlYzNcbiAqIEBwYXJhbSB7dmVjM30gYSBUaGUgdmVjMyBwb2ludCB0byByb3RhdGVcbiAqIEBwYXJhbSB7dmVjM30gYiBUaGUgb3JpZ2luIG9mIHRoZSByb3RhdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IGMgVGhlIGFuZ2xlIG9mIHJvdGF0aW9uXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMucm90YXRlWiA9IGZ1bmN0aW9uKG91dCwgYSwgYiwgYyl7XG4gIFx0dmFyIHAgPSBbXSwgcj1bXTtcbiAgXHQvL1RyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXG4gIFx0cFswXSA9IGFbMF0gLSBiWzBdO1xuICBcdHBbMV0gPSBhWzFdIC0gYlsxXTtcbiAgXHRwWzJdID0gYVsyXSAtIGJbMl07XG4gIFxuICBcdC8vcGVyZm9ybSByb3RhdGlvblxuICBcdHJbMF0gPSBwWzBdKk1hdGguY29zKGMpIC0gcFsxXSpNYXRoLnNpbihjKTtcbiAgXHRyWzFdID0gcFswXSpNYXRoLnNpbihjKSArIHBbMV0qTWF0aC5jb3MoYyk7XG4gIFx0clsyXSA9IHBbMl07XG4gIFxuICBcdC8vdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cbiAgXHRvdXRbMF0gPSByWzBdICsgYlswXTtcbiAgXHRvdXRbMV0gPSByWzFdICsgYlsxXTtcbiAgXHRvdXRbMl0gPSByWzJdICsgYlsyXTtcbiAgXG4gIFx0cmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGVyZm9ybSBzb21lIG9wZXJhdGlvbiBvdmVyIGFuIGFycmF5IG9mIHZlYzNzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGFycmF5IG9mIHZlY3RvcnMgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIE51bWJlciBvZiBlbGVtZW50cyBiZXR3ZWVuIHRoZSBzdGFydCBvZiBlYWNoIHZlYzMuIElmIDAgYXNzdW1lcyB0aWdodGx5IHBhY2tlZFxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCBOdW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IE51bWJlciBvZiB2ZWMzcyB0byBpdGVyYXRlIG92ZXIuIElmIDAgaXRlcmF0ZXMgb3ZlciBlbnRpcmUgYXJyYXlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdmVjdG9yIGluIHRoZSBhcnJheVxuICogQHBhcmFtIHtPYmplY3R9IFthcmddIGFkZGl0aW9uYWwgYXJndW1lbnQgdG8gcGFzcyB0byBmblxuICogQHJldHVybnMge0FycmF5fSBhXG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5mb3JFYWNoID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ZWMgPSB2ZWMzLmNyZWF0ZSgpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGEsIHN0cmlkZSwgb2Zmc2V0LCBjb3VudCwgZm4sIGFyZykge1xuICAgICAgICB2YXIgaSwgbDtcbiAgICAgICAgaWYoIXN0cmlkZSkge1xuICAgICAgICAgICAgc3RyaWRlID0gMztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFvZmZzZXQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKGNvdW50KSB7XG4gICAgICAgICAgICBsID0gTWF0aC5taW4oKGNvdW50ICogc3RyaWRlKSArIG9mZnNldCwgYS5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IGEubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGkgPSBvZmZzZXQ7IGkgPCBsOyBpICs9IHN0cmlkZSkge1xuICAgICAgICAgICAgdmVjWzBdID0gYVtpXTsgdmVjWzFdID0gYVtpKzFdOyB2ZWNbMl0gPSBhW2krMl07XG4gICAgICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgICAgIGFbaV0gPSB2ZWNbMF07IGFbaSsxXSA9IHZlY1sxXTsgYVtpKzJdID0gdmVjWzJdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gYTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBHZXQgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIDNEIHZlY3RvcnNcbiAqIEBwYXJhbSB7dmVjM30gYSBUaGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIFRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gVGhlIGFuZ2xlIGluIHJhZGlhbnNcbiAqL1xudmVjMy5hbmdsZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgIFxuICAgIHZhciB0ZW1wQSA9IHZlYzMuZnJvbVZhbHVlcyhhWzBdLCBhWzFdLCBhWzJdKTtcbiAgICB2YXIgdGVtcEIgPSB2ZWMzLmZyb21WYWx1ZXMoYlswXSwgYlsxXSwgYlsyXSk7XG4gXG4gICAgdmVjMy5ub3JtYWxpemUodGVtcEEsIHRlbXBBKTtcbiAgICB2ZWMzLm5vcm1hbGl6ZSh0ZW1wQiwgdGVtcEIpO1xuIFxuICAgIHZhciBjb3NpbmUgPSB2ZWMzLmRvdCh0ZW1wQSwgdGVtcEIpO1xuXG4gICAgaWYoY29zaW5lID4gMS4wKXtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhjb3NpbmUpO1xuICAgIH0gICAgIFxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yXG4gKlxuICogQHBhcmFtIHt2ZWMzfSB2ZWMgdmVjdG9yIHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3JcbiAqL1xudmVjMy5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAndmVjMygnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnKSc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZlYzM7XG4iLCIvKiBDb3B5cmlnaHQgKGMpIDIwMTUsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLiAqL1xuXG52YXIgZ2xNYXRyaXggPSByZXF1aXJlKFwiLi9jb21tb24uanNcIik7XG5cbi8qKlxuICogQGNsYXNzIDQgRGltZW5zaW9uYWwgVmVjdG9yXG4gKiBAbmFtZSB2ZWM0XG4gKi9cbnZhciB2ZWM0ID0ge307XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldywgZW1wdHkgdmVjNFxuICpcbiAqIEByZXR1cm5zIHt2ZWM0fSBhIG5ldyA0RCB2ZWN0b3JcbiAqL1xudmVjNC5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoNCk7XG4gICAgb3V0WzBdID0gMDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHZlYzQgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGNsb25lXG4gKiBAcmV0dXJucyB7dmVjNH0gYSBuZXcgNEQgdmVjdG9yXG4gKi9cbnZlYzQuY2xvbmUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBnbE1hdHJpeC5BUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB2ZWM0IGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB3IFcgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7dmVjNH0gYSBuZXcgNEQgdmVjdG9yXG4gKi9cbnZlYzQuZnJvbVZhbHVlcyA9IGZ1bmN0aW9uKHgsIHksIHosIHcpIHtcbiAgICB2YXIgb3V0ID0gbmV3IGdsTWF0cml4LkFSUkFZX1RZUEUoNCk7XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIG91dFsyXSA9IHo7XG4gICAgb3V0WzNdID0gdztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgdmVjNCB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgc291cmNlIHZlY3RvclxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzQgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0geCBYIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHkgWSBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB6IFogY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0gdyBXIGNvbXBvbmVudFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnNldCA9IGZ1bmN0aW9uKG91dCwgeCwgeSwgeiwgdykge1xuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICBvdXRbMl0gPSB6O1xuICAgIG91dFszXSA9IHc7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWRkcyB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LmFkZCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKyBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gKyBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gKyBiWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0cyB2ZWN0b3IgYiBmcm9tIHZlY3RvciBhXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnN1YnRyYWN0ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAtIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAtIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAtIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSAtIGJbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LnN1YnRyYWN0fVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQuc3ViID0gdmVjNC5zdWJ0cmFjdDtcblxuLyoqXG4gKiBNdWx0aXBsaWVzIHR3byB2ZWM0J3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQubXVsdGlwbHkgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICogYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICogYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdICogYlszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQubXVsdGlwbHl9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5tdWwgPSB2ZWM0Lm11bHRpcGx5O1xuXG4vKipcbiAqIERpdmlkZXMgdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5kaXZpZGUgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC8gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC8gYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdIC8gYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdIC8gYlszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQuZGl2aWRlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQuZGl2ID0gdmVjNC5kaXZpZGU7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWluaW11bSBvZiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0Lm1pbiA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWluKGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWluKGFbMV0sIGJbMV0pO1xuICAgIG91dFsyXSA9IE1hdGgubWluKGFbMl0sIGJbMl0pO1xuICAgIG91dFszXSA9IE1hdGgubWluKGFbM10sIGJbM10pO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1heGltdW0gb2YgdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5tYXggPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBNYXRoLm1heChhWzBdLCBiWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLm1heChhWzFdLCBiWzFdKTtcbiAgICBvdXRbMl0gPSBNYXRoLm1heChhWzJdLCBiWzJdKTtcbiAgICBvdXRbM10gPSBNYXRoLm1heChhWzNdLCBiWzNdKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTY2FsZXMgYSB2ZWM0IGJ5IGEgc2NhbGFyIG51bWJlclxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIHZlY3RvciB0byBzY2FsZVxuICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSB2ZWN0b3IgYnlcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiO1xuICAgIG91dFszXSA9IGFbM10gKiBiO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFkZHMgdHdvIHZlYzQncyBhZnRlciBzY2FsaW5nIHRoZSBzZWNvbmQgb3BlcmFuZCBieSBhIHNjYWxhciB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSB0aGUgYW1vdW50IHRvIHNjYWxlIGIgYnkgYmVmb3JlIGFkZGluZ1xuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnNjYWxlQW5kQWRkID0gZnVuY3Rpb24ob3V0LCBhLCBiLCBzY2FsZSkge1xuICAgIG91dFswXSA9IGFbMF0gKyAoYlswXSAqIHNjYWxlKTtcbiAgICBvdXRbMV0gPSBhWzFdICsgKGJbMV0gKiBzY2FsZSk7XG4gICAgb3V0WzJdID0gYVsyXSArIChiWzJdICogc2NhbGUpO1xuICAgIG91dFszXSA9IGFbM10gKyAoYlszXSAqIHNjYWxlKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xudmVjNC5kaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdLFxuICAgICAgICB5ID0gYlsxXSAtIGFbMV0sXG4gICAgICAgIHogPSBiWzJdIC0gYVsyXSxcbiAgICAgICAgdyA9IGJbM10gLSBhWzNdO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCp4ICsgeSp5ICsgeip6ICsgdyp3KTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LmRpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQuZGlzdCA9IHZlYzQuZGlzdGFuY2U7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGRpc3RhbmNlIGJldHdlZW4gYSBhbmQgYlxuICovXG52ZWM0LnNxdWFyZWREaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdLFxuICAgICAgICB5ID0gYlsxXSAtIGFbMV0sXG4gICAgICAgIHogPSBiWzJdIC0gYVsyXSxcbiAgICAgICAgdyA9IGJbM10gLSBhWzNdO1xuICAgIHJldHVybiB4KnggKyB5KnkgKyB6KnogKyB3Knc7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5zcXVhcmVkRGlzdGFuY2V9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5zcXJEaXN0ID0gdmVjNC5zcXVhcmVkRGlzdGFuY2U7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgdmVjNFxuICpcbiAqIEBwYXJhbSB7dmVjNH0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGFcbiAqL1xudmVjNC5sZW5ndGggPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdLFxuICAgICAgICB3ID0gYVszXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeiArIHcqdyk7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5sZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5sZW4gPSB2ZWM0Lmxlbmd0aDtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiBhIHZlYzRcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBzcXVhcmVkIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBsZW5ndGggb2YgYVxuICovXG52ZWM0LnNxdWFyZWRMZW5ndGggPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciB4ID0gYVswXSxcbiAgICAgICAgeSA9IGFbMV0sXG4gICAgICAgIHogPSBhWzJdLFxuICAgICAgICB3ID0gYVszXTtcbiAgICByZXR1cm4geCp4ICsgeSp5ICsgeip6ICsgdyp3O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQuc3F1YXJlZExlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWM0LnNxckxlbiA9IHZlYzQuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBOZWdhdGVzIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjNFxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIG5lZ2F0ZVxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0Lm5lZ2F0ZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IC1hWzBdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIG91dFsyXSA9IC1hWzJdO1xuICAgIG91dFszXSA9IC1hWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGludmVyc2Ugb2YgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWM0XG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB2ZWN0b3IgdG8gaW52ZXJ0XG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQuaW52ZXJzZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICBvdXRbMF0gPSAxLjAgLyBhWzBdO1xuICBvdXRbMV0gPSAxLjAgLyBhWzFdO1xuICBvdXRbMl0gPSAxLjAgLyBhWzJdO1xuICBvdXRbM10gPSAxLjAgLyBhWzNdO1xuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgYSB2ZWM0XG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB2ZWN0b3IgdG8gbm9ybWFsaXplXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQubm9ybWFsaXplID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl0sXG4gICAgICAgIHcgPSBhWzNdO1xuICAgIHZhciBsZW4gPSB4KnggKyB5KnkgKyB6KnogKyB3Knc7XG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICBvdXRbMF0gPSB4ICogbGVuO1xuICAgICAgICBvdXRbMV0gPSB5ICogbGVuO1xuICAgICAgICBvdXRbMl0gPSB6ICogbGVuO1xuICAgICAgICBvdXRbM10gPSB3ICogbGVuO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkb3QgcHJvZHVjdCBvZiBhIGFuZCBiXG4gKi9cbnZlYzQuZG90ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXSArIGFbMl0gKiBiWzJdICsgYVszXSAqIGJbM107XG59O1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgbGluZWFyIGludGVycG9sYXRpb24gYmV0d2VlbiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LmxlcnAgPSBmdW5jdGlvbiAob3V0LCBhLCBiLCB0KSB7XG4gICAgdmFyIGF4ID0gYVswXSxcbiAgICAgICAgYXkgPSBhWzFdLFxuICAgICAgICBheiA9IGFbMl0sXG4gICAgICAgIGF3ID0gYVszXTtcbiAgICBvdXRbMF0gPSBheCArIHQgKiAoYlswXSAtIGF4KTtcbiAgICBvdXRbMV0gPSBheSArIHQgKiAoYlsxXSAtIGF5KTtcbiAgICBvdXRbMl0gPSBheiArIHQgKiAoYlsyXSAtIGF6KTtcbiAgICBvdXRbM10gPSBhdyArIHQgKiAoYlszXSAtIGF3KTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSByYW5kb20gdmVjdG9yIHdpdGggdGhlIGdpdmVuIHNjYWxlXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdIExlbmd0aCBvZiB0aGUgcmVzdWx0aW5nIHZlY3Rvci4gSWYgb21taXR0ZWQsIGEgdW5pdCB2ZWN0b3Igd2lsbCBiZSByZXR1cm5lZFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnJhbmRvbSA9IGZ1bmN0aW9uIChvdXQsIHNjYWxlKSB7XG4gICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XG5cbiAgICAvL1RPRE86IFRoaXMgaXMgYSBwcmV0dHkgYXdmdWwgd2F5IG9mIGRvaW5nIHRoaXMuIEZpbmQgc29tZXRoaW5nIGJldHRlci5cbiAgICBvdXRbMF0gPSBnbE1hdHJpeC5SQU5ET00oKTtcbiAgICBvdXRbMV0gPSBnbE1hdHJpeC5SQU5ET00oKTtcbiAgICBvdXRbMl0gPSBnbE1hdHJpeC5SQU5ET00oKTtcbiAgICBvdXRbM10gPSBnbE1hdHJpeC5SQU5ET00oKTtcbiAgICB2ZWM0Lm5vcm1hbGl6ZShvdXQsIG91dCk7XG4gICAgdmVjNC5zY2FsZShvdXQsIG91dCwgc2NhbGUpO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzQgd2l0aCBhIG1hdDQuXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICogQHBhcmFtIHttYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnRyYW5zZm9ybU1hdDQgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sIHkgPSBhWzFdLCB6ID0gYVsyXSwgdyA9IGFbM107XG4gICAgb3V0WzBdID0gbVswXSAqIHggKyBtWzRdICogeSArIG1bOF0gKiB6ICsgbVsxMl0gKiB3O1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWzldICogeiArIG1bMTNdICogdztcbiAgICBvdXRbMl0gPSBtWzJdICogeCArIG1bNl0gKiB5ICsgbVsxMF0gKiB6ICsgbVsxNF0gKiB3O1xuICAgIG91dFszXSA9IG1bM10gKiB4ICsgbVs3XSAqIHkgKyBtWzExXSAqIHogKyBtWzE1XSAqIHc7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgdmVjNCB3aXRoIGEgcXVhdFxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7cXVhdH0gcSBxdWF0ZXJuaW9uIHRvIHRyYW5zZm9ybSB3aXRoXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQudHJhbnNmb3JtUXVhdCA9IGZ1bmN0aW9uKG91dCwgYSwgcSkge1xuICAgIHZhciB4ID0gYVswXSwgeSA9IGFbMV0sIHogPSBhWzJdLFxuICAgICAgICBxeCA9IHFbMF0sIHF5ID0gcVsxXSwgcXogPSBxWzJdLCBxdyA9IHFbM10sXG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHF1YXQgKiB2ZWNcbiAgICAgICAgaXggPSBxdyAqIHggKyBxeSAqIHogLSBxeiAqIHksXG4gICAgICAgIGl5ID0gcXcgKiB5ICsgcXogKiB4IC0gcXggKiB6LFxuICAgICAgICBpeiA9IHF3ICogeiArIHF4ICogeSAtIHF5ICogeCxcbiAgICAgICAgaXcgPSAtcXggKiB4IC0gcXkgKiB5IC0gcXogKiB6O1xuXG4gICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxuICAgIG91dFswXSA9IGl4ICogcXcgKyBpdyAqIC1xeCArIGl5ICogLXF6IC0gaXogKiAtcXk7XG4gICAgb3V0WzFdID0gaXkgKiBxdyArIGl3ICogLXF5ICsgaXogKiAtcXggLSBpeCAqIC1xejtcbiAgICBvdXRbMl0gPSBpeiAqIHF3ICsgaXcgKiAtcXogKyBpeCAqIC1xeSAtIGl5ICogLXF4O1xuICAgIG91dFszXSA9IGFbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGVyZm9ybSBzb21lIG9wZXJhdGlvbiBvdmVyIGFuIGFycmF5IG9mIHZlYzRzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGFycmF5IG9mIHZlY3RvcnMgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIE51bWJlciBvZiBlbGVtZW50cyBiZXR3ZWVuIHRoZSBzdGFydCBvZiBlYWNoIHZlYzQuIElmIDAgYXNzdW1lcyB0aWdodGx5IHBhY2tlZFxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCBOdW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IE51bWJlciBvZiB2ZWM0cyB0byBpdGVyYXRlIG92ZXIuIElmIDAgaXRlcmF0ZXMgb3ZlciBlbnRpcmUgYXJyYXlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdmVjdG9yIGluIHRoZSBhcnJheVxuICogQHBhcmFtIHtPYmplY3R9IFthcmddIGFkZGl0aW9uYWwgYXJndW1lbnQgdG8gcGFzcyB0byBmblxuICogQHJldHVybnMge0FycmF5fSBhXG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5mb3JFYWNoID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ZWMgPSB2ZWM0LmNyZWF0ZSgpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGEsIHN0cmlkZSwgb2Zmc2V0LCBjb3VudCwgZm4sIGFyZykge1xuICAgICAgICB2YXIgaSwgbDtcbiAgICAgICAgaWYoIXN0cmlkZSkge1xuICAgICAgICAgICAgc3RyaWRlID0gNDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFvZmZzZXQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKGNvdW50KSB7XG4gICAgICAgICAgICBsID0gTWF0aC5taW4oKGNvdW50ICogc3RyaWRlKSArIG9mZnNldCwgYS5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IGEubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGkgPSBvZmZzZXQ7IGkgPCBsOyBpICs9IHN0cmlkZSkge1xuICAgICAgICAgICAgdmVjWzBdID0gYVtpXTsgdmVjWzFdID0gYVtpKzFdOyB2ZWNbMl0gPSBhW2krMl07IHZlY1szXSA9IGFbaSszXTtcbiAgICAgICAgICAgIGZuKHZlYywgdmVjLCBhcmcpO1xuICAgICAgICAgICAgYVtpXSA9IHZlY1swXTsgYVtpKzFdID0gdmVjWzFdOyBhW2krMl0gPSB2ZWNbMl07IGFbaSszXSA9IHZlY1szXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjNH0gdmVjIHZlY3RvciB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gKi9cbnZlYzQuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ3ZlYzQoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIGFbM10gKyAnKSc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZlYzQ7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSggJy4vcGljaW1vJyApO1xuXG59KSgpO1xuIiwiLyogZ2xvYmFsIHJlcXVlc3RBbmltYXRpb25GcmFtZSAqL1xuKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG4gICAgdmFyIHNnICAgID0gcmVxdWlyZSggJy4uL3NnJyApO1xuICAgIHZhciB3ZWJnbCA9IHJlcXVpcmUoICcuLi93ZWJnbCcgKTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8uQXBwXG4gICAgICpcbiAgICAgKiBAY2xhc3NkZXNjXG4gICAgICogICBDcmVhdGUgYSBuZXcgcGljaW1vIGFwcC4gVGhpcyBpcyB5b3VyIG1haW4gYXBwIGNvbnRyb2xsZXIuXG4gICAgICpcbiAgICAgKiAgICMjIyMjIEluaXRpYWxpemF0aW9uXG4gICAgICpcbiAgICAgKiAgIFVtIGVpbmUgUGljaW1vIEFwcCBJbnN0YW56ICh1bmQgZWluZW4gV2ViR0wgQ2FudmFzKSB6dSBlcnpldWdlbiwgcmVpY2h0IGVpbiBlaW5mYWNoZXIgQXVmcnVmOlxuICAgICAqXG4gICAgICogICBgYGBcbiAgICAgKiAgIHZhciBhcHAgPSBuZXcgUGljaW1vLkFwcCh7ICpvcHRpb25zKiB9KTtcbiAgICAgKiAgIGBgYFxuICAgICAqXG4gICAgICogICBFcyB3aXJkIGVpbiBgPGNhbnZhcz5gIEVsZW1lbnQgZXJ6ZXVndCB1bmQgdW50ZXJoYWxiIGRlcyBgPGJvZHk+YCBFbGVtZW50cyBkZXIgU2VpdGUgZWluZ2Vow6RuZ3QuXG4gICAgICogICBNaXQgZGVyIE9wdGlvbiAqKmFwcGVuZFRvKioga2FubiBtYW4gYW4gU3RlbGxlIGRlcyBgPGJvZHk+YCBlaW4gYW5kZXJlcyBDb250YWluZXIgRWxlbWVudCBiZXN0aW1tZW4uXG4gICAgICpcbiAgICAgKiAgIE3DtmNodGUgbWFuIGRhcyBgPGNhbnZhcz5gIEVsZW1lbnQgc2VsYnN0IGVyemV1Z2VuIG9kZXIgZWluIHZvcmhhbmRlbmVzIHZlcndlbmRlbiwgZ2lidCBtYW4gZGllc2VzIGVpbmZhY2ggYWxzIGVyc3RlbiBQYXJhbWV0ZXIgYW46XG4gICAgICpcbiAgICAgKiAgIGBgYFxuICAgICAqICAgdmFyIGFwcCA9IG5ldyBQaWNpbW8uQXBwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwaWNpbW8tY2FudmFzJykpO1xuICAgICAqICAgYGBgXG4gICAgICpcbiAgICAgKiAgIG9kZXIgZWluZmFjaCBhbHMgKipjYW52YXMqKiBPcHRpb246XG4gICAgICpcbiAgICAgKiAgIGBgYFxuICAgICAqICAgdmFyIGFwcCA9IG5ldyBQaWNpbW8uQXBwKHsgY2FudmFzOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGljaW1vLWNhbnZhcycpIH0pO1xuICAgICAqICAgYGBgXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8b2JqZWN0fSBbY2FudmFzXSAgICAgICAgICAgICAgICAgICAtIFRoZSBjYW52YXMgZG9tIGVsZW1lbnQgb3IgdGhlIG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIG9wdGlvbnMuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5hbHBoYT1mYWxzZV0gICAgICAgICAgICAgICAgICAgICAgIC0gQ3JlYXRlIGEgdHJhbnNwYXJlbnQgV2ViR0wgY2FudmFzLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuYW50aWFsaWFzPWZhbHNlXSAgICAgICAgICAgICAgICAgICAtIEVuYWJsZSBhbnRpYWxpYXNpbmcuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5zdGF0cz1mYWxzZV0gICAgICAgICAgICAgICAgICAgICAgIC0gQ3JlYXRlIHRoZSBbIG1yZG9vYi9zdGF0cy5qcyBdKCBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3N0YXRzLmpzLyApIHdpZGdldCBhbmQgYXBwZW5kIGl0IHRvIHRoZSBjb250YWluZXIgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBbb3B0aW9ucy5jYW52YXNdICAgICAgICAgICAgICAgICAgLSBUaGUgY2FudmFzIGRvbSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtvcHRpb25zLmFwcGVuZFRvPWRvY3VtZW50LmJvZHldICAgICAgICAtIFNldCB0aGUgY29udGFpbmVyIGVsZW1lbnQuIFRoZSBXZWJHTCBDYW52YXMgKGFuZCB0aGUgc3RhdHMgZWxlbWVudCkgd2lsbCBiZSBhcHBlbmRlZCB0byB0aGlzIGVsZW1lbnQuIFRoZSBjb250YWluZXIgZWxlbWVudCBhbHNvIGRlZmluZXMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcy4gSWYgdGhpcyBpcyB0aGUgYm9keSBlbGVtZW50IHlvdSB3aWxsIGdldCBhbiBmdWxsc2NyZWVuIFdlYkdMIGNhbnZhcy4gKldoZW4gdGhlIF9fY2FudmFzX18gb3B0aW9uIGlzIHVzZWQsIHRoaXMgb3B0aW9uIHdpbGwgYmUgaWdub3JlZC4qXG4gICAgICogQHBhcmFtIHtzdHJpbmd8UGljaW1vLnV0aWxzLkNvbG9yfSBbb3B0aW9ucy5iZ0NvbG9yPSMwMDAwMDBdIC0gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgV2ViR0wgY2FudmFzLiBVc2UgYW55IENTUyBjb2xvciBmb3JtYXQgeW91IGxpa2UuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmFzc2V0QmFzZVVybF0gICAgICAgICAgICAgICAgICAgICAgIC0gU2V0IHRoZSBiYXNlIHVybCBwcmVmaXggZm9yIGFsbCBhc3NldHMgKGltYWdlcywganNvbiwgLi4pLiBBcyBhbiBhbHRlcm5hdGl2ZSB0byB0aGlzIG9wdGlvbiB5b3UgY291bGQgZGVmaW5lIGEgZ2xvYmFsIHZhciAqKlBJQ0lNT19BU1NFVF9CQVNFX1VSTCoqIGJlZm9yZSBjcmVhdGluZyB5b3VyIFBpY2ltbyBpbnN0YW5jZS4gQnV0IHRoZSBwcmVmZXJyZWQgd2F5IHNob3VsZCBiZSB1c2luZyAqYXNzZXRCYXNlVXJsKiFcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIEFwcCAoIGNhbnZhcywgb3B0aW9ucyApIHtcblxuICAgICAgICB1dGlscy5jdXN0b21fZXZlbnQuZXZlbnRpemUoIHRoaXMgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uQXBwI25vdyAtIFRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIGFwcGxpY2F0aW9uIHN0YXJ0LlxuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLm5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAuMDtcblxuICAgICAgICBpZiAoIHR5cGVvZiBjYW52YXMgPT09ICdvYmplY3QnICYmICEgKCAnbm9kZU5hbWUnIGluIGNhbnZhcyApICkge1xuXG4gICAgICAgICAgICBvcHRpb25zID0gY2FudmFzO1xuICAgICAgICAgICAgY2FudmFzICA9IG9wdGlvbnMuY2FudmFzO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIG9wdGlvbnMgPT0gbnVsbCApIHtcblxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7SFRNTENhbnZhc0VsZW1lbnR9IFBpY2ltby5BcHAjY2FudmFzXG4gICAgICAgICAqL1xuXG4gICAgICAgIGNhbnZhcyA9IGNhbnZhcyAhPT0gdW5kZWZpbmVkID8gY2FudmFzIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJjYW52YXNcIiApO1xuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyggdGhpcywgJ2NhbnZhcycsIGNhbnZhcyApO1xuXG4gICAgICAgIHZhciBwYXJlbnROb2RlID0gISEgb3B0aW9ucy5hcHBlbmRUbyA/IG9wdGlvbnMuYXBwZW5kVG8gOiBkb2N1bWVudC5ib2R5O1xuICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKCBjYW52YXMgKTtcbiAgICAgICAgY2FudmFzLmNsYXNzTGlzdC5hZGQoICdwaWNpbW8nICk7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7V2ViR2xSZW5kZXJpbmdDb250ZXh0fSBQaWNpbW8uQXBwI2dsXG4gICAgICAgICAqL1xuXG4gICAgICAgIHV0aWxzLmFkZEdseFByb3BlcnR5KCB0aGlzICk7XG5cbiAgICAgICAgdGhpcy5nbEN0eEF0dHJzID0ge1xuXG4gICAgICAgICAgICBhbHBoYSAgICAgOiAoIG9wdGlvbnMuYWxwaGEgPT09IHRydWUgKSxcbiAgICAgICAgICAgIGFudGlhbGlhcyA6ICggb3B0aW9ucy5hbnRpYWxpYXMgPT09IHRydWUgKVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1dlYkdsQ29udGV4dH0gUGljaW1vLkFwcCNnbHhcbiAgICAgICAgICovXG5cbiAgICAgICAgdGhpcy5nbHggPSBjcmVhdGVXZWJHbENvbnRleHQoIHRoaXMgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLnV0aWxzLkNvbG9yfSBQaWNpbW8uQXBwI2JhY2tncm91bmRDb2xvclxuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmJhY2tncm91bmRDb2xvciA9IG5ldyB1dGlscy5Db2xvciggb3B0aW9ucy5iZ0NvbG9yICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmJnQ29sb3IgOiAoIHRoaXMuZ2xDdHhBdHRycy5hbHBoYSA/ICd0cmFuc3BhcmVudCcgOiBcIiMwMDAwMDBcIiApICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyfSBQaWNpbW8uQXBwI3NoYWRlclxuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLnNoYWRlciA9IG5ldyB3ZWJnbC5TaGFkZXJNYW5hZ2VyKCB0aGlzICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby53ZWJnbC5XZWJHbFJlbmRlcmVyfSBQaWNpbW8uQXBwI3JlbmRlcmVyXG4gICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgd2ViZ2wuV2ViR2xSZW5kZXJlciggdGhpcyApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uQXBwfSBQaWNpbW8uQXBwI2Fzc2V0QmFzZVVybCAtIFRoZSBiYXNlIHVybCBmb3IgYWxsIGFzc2V0cy4gTWF5IGJlICp1bmRlZmluZWQqLlxuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmFzc2V0QmFzZVVybCA9IHdpbmRvdy5QSUNJTU9fQVNTRVRfQkFTRV9VUkwgfHwgb3B0aW9ucy5hc3NldEJhc2VVcmw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5zZy5Ob2RlfSBQaWNpbW8uQXBwI3Jvb3QgLSBUaGUgcm9vdCBub2RlIG9mIHRoZSBzY2VuZSBncmFwaC5cbiAgICAgICAgICovXG5cbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnR5UHVibGljUk8oIHRoaXMsICdyb290JywgbmV3IHNnLk5vZGUoIHRoaXMgKSApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5BcHAjZnJhbWVObyAtIFRoZSBjdXJyZW50IGZyYW1lIG51bWJlci5cbiAgICAgICAgICovXG5cbiAgICAgICAgdGhpcy5mcmFtZU5vID0gMDtcblxuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuaW5pdEdsKCk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCB0aGlzLnJlc2l6ZS5iaW5kKCB0aGlzICksIGZhbHNlICk7XG5cbiAgICAgICAgdGhpcy5vbkFuaW1hdGlvbkZyYW1lID0gdGhpcy5yZW5kZXJGcmFtZS5iaW5kKCB0aGlzICk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdGhpcy5vbkFuaW1hdGlvbkZyYW1lICk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5BcHAjZGV2aWNlUGl4ZWxSYXRpbyAtIFRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8uXG4gICAgICovXG5cbiAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyggQXBwLnByb3RvdHlwZSwgJ2RldmljZVBpeGVsUmF0aW8nLCAoIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEgKSApO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby5BcHAjcmVzaXplXG4gICAgICovXG5cbiAgICBBcHAucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgdyA9IE1hdGgucm91bmQoIHRoaXMuY2FudmFzLnBhcmVudE5vZGUuY2xpZW50V2lkdGggKiB0aGlzLmRldmljZVBpeGVsUmF0aW8gKTtcbiAgICAgICAgdmFyIGggPSBNYXRoLnJvdW5kKCB0aGlzLmNhbnZhcy5wYXJlbnROb2RlLmNsaWVudEhlaWdodCAqIHRoaXMuZGV2aWNlUGl4ZWxSYXRpbyApO1xuXG4gICAgICAgIGlmICggdGhpcy53aWR0aCAhPT0gdyB8fCB0aGlzLmhlaWdodCAhPT0gaCApIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5BcHAjd2lkdGggLSBUaGUgX3JlYWxfIGRldmljZSBwaXhlbCB3aWR0aC5cbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gdztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5BcHAjaGVpZ2h0IC0gVGhlIF9yZWFsXyBkZXZpY2UgcGl4ZWwgaGVpZ2h0LlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaDtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLnJlbmRlcmVyICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHRoaXMuY2FudmFzLndpZHRoICE9PSB3IHx8IHRoaXMuY2FudmFzLmhlaWdodCAhPT0gaCApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoICA9IHc7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaDtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoICA9IE1hdGgucm91bmQoIHcgLyB0aGlzLmRldmljZVBpeGVsUmF0aW8gKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBNYXRoLnJvdW5kKCBoIC8gdGhpcy5kZXZpY2VQaXhlbFJhdGlvICkgKyBcInB4XCI7XG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPIHJlc2l6ZVxuICAgICAgICAgICAgICAgIC8vaWYgKCB0aGlzLnJvb3QgJiYgdGhpcy5zY2VuZS5yZXNpemUgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5zY2VuZS5yZXNpemUodGhpcy5nbHgsIHcsIGgpO1xuICAgICAgICAgICAgICAgIC8vfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLkFwcCNyZW5kZXJGcmFtZVxuICAgICAqL1xuXG4gICAgQXBwLnByb3RvdHlwZS5yZW5kZXJGcmFtZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLm5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSAvIDEwMDAuMDtcbiAgICAgICAgKyt0aGlzLmZyYW1lTm87XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5iZWdpbkZyYW1lKCk7XG5cbiAgICAgICAgaWYgKCB0aGlzLnJvb3QgKSB7XG5cbiAgICAgICAgICAgIHRoaXMucm9vdC5yZW5kZXJGcmFtZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlcmVyLmVuZEZyYW1lKCk7XG5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB0aGlzLm9uQW5pbWF0aW9uRnJhbWUgKTtcblxuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVdlYkdsQ29udGV4dCAoIGFwcCApIHtcblxuICAgICAgICB2YXIgZ2w7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgZ2wgPSBhcHAuY2FudmFzLmdldENvbnRleHQoIFwid2ViZ2xcIiwgYXBwLmdsQ3R4QXR0cnMgKSB8fFxuICAgICAgICAgICAgICAgICBhcHAuY2FudmFzLmdldENvbnRleHQoIFwiZXhwZXJpbWVudGFsLXdlYmdsXCIsIGFwcC5nbEN0eEF0dHJzICk7XG5cbiAgICAgICAgfSBjYXRjaCAoIGVyciApIHtcblxuICAgICAgICAgICAgY29uc29sZS5lcnJvciggZXJyICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggISBnbCApIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIkNvdWxkIG5vdCBpbml0aWFsaXplIHRoZSBXZWJHTCBjb250ZXh0IVwiICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgd2ViZ2wuV2ViR2xDb250ZXh0KCBnbCApO1xuXG4gICAgfVxuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEFwcDtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy92YXIgdmVjMiA9IHJlcXVpcmUoICdnbC1tYXRyeCcgKS52ZWMyO1xuXG4gICAgLyoqXG4gICAgICogUmVwcmVzZW50cyBhIDJkIGF4aXMgYWxpZ25lZCBib3VuZGFyeSBib3guXG4gICAgICogQGNsYXNzIFBpY2ltby5jb3JlLkFBQkIyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4MD0wXSAtIHgwXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4MT0wXSAtIHgxXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5MD0wXSAtIHkwXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5MT0wXSAtIHkxXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBBQUJCMiAoIHgwLCB4MSwgeTAsIHkxICkge1xuXG4gICAgICAgIGlmICggeDAgPT09IHVuZGVmaW5lZCApIHgwID0gMDtcbiAgICAgICAgaWYgKCB5MCA9PT0gdW5kZWZpbmVkICkgeTAgPSAwO1xuICAgICAgICBpZiAoIHgxID09PSB1bmRlZmluZWQgKSB4MSA9IDA7XG4gICAgICAgIGlmICggeTEgPT09IHVuZGVmaW5lZCApIHkxID0gMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuQUFCQjJ9IFBpY2ltby5jb3JlLkFBQkIyI21pbl94IC0gTWluaW11bSB4IHZhbHVlXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5BQUJCMn0gUGljaW1vLmNvcmUuQUFCQjIjbWF4X3ggLSBNYXhpbXVtIHggdmFsdWVcbiAgICAgICAgICovXG5cbiAgICAgICAgaWYgKCB4MCA8IHgxICkge1xuXG4gICAgICAgICAgICB0aGlzLm1pbl94ID0geDA7XG4gICAgICAgICAgICB0aGlzLm1heF94ID0geDE7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5taW5feCA9IHgxO1xuICAgICAgICAgICAgdGhpcy5tYXhfeCA9IHgwO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuQUFCQjJ9IFBpY2ltby5jb3JlLkFBQkIyI21pbl95IC0gTWluaW11bSB5IHZhbHVlXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5BQUJCMn0gUGljaW1vLmNvcmUuQUFCQjIjbWF4X3kgLSBNYXhpbXVtIHkgdmFsdWVcbiAgICAgICAgICovXG5cbiAgICAgICAgaWYgKCB5MCA8IHkxICkge1xuXG4gICAgICAgICAgICB0aGlzLm1pbl95ID0geTA7XG4gICAgICAgICAgICB0aGlzLm1heF95ID0geTE7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5taW5feSA9IHkxO1xuICAgICAgICAgICAgdGhpcy5tYXhfeSA9IHkwO1xuXG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Quc2VhbCggdGhpcyApO1xuXG4gICAgfVxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggQUFCQjIucHJvdG90eXBlLCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLkFBQkIyfSBQaWNpbW8uY29yZS5BQUJCMiN3aWR0aFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgICd3aWR0aCc6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5tYXhfeCAtIHRoaXMubWluX3ggKyAxOyB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5BQUJCMn0gUGljaW1vLmNvcmUuQUFCQjIjaGVpZ2h0XG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgJ2hlaWdodCc6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5tYXhfeSAtIHRoaXMubWluX3kgKyAxOyB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5BQUJCMn0gUGljaW1vLmNvcmUuQUFCQjIjY2VudGVyX3hcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICAnY2VudGVyX3gnOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuICggdGhpcy5tYXhfeCAtIHRoaXMubWluX3ggKSAvIDI7IH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLkFBQkIyfSBQaWNpbW8uY29yZS5BQUJCMiNjZW50ZXJfeVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgICdjZW50ZXJfeSc6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gKCB0aGlzLm1heF95IC0gdGhpcy5taW5feSApIC8gMjsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cblxuICAgIC8qKlxuICAgICAqIEV4dGVuZCB0aGUgYm91bmRhcnkgYm94LlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuQUFCQjIjYWRkUG9pbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIHlcbiAgICAgKi9cblxuICAgIEFBQkIyLnByb3RvdHlwZS5hZGRQb2ludCA9IGZ1bmN0aW9uICggeCwgeSApIHtcblxuICAgICAgICBpZiAoIHggPCB0aGlzLm1pbl94ICkge1xuXG4gICAgICAgICAgICB0aGlzLm1pbl94ID0geDtcblxuICAgICAgICB9IGVsc2UgaWYgKCB4ID4gdGhpcy5tYXhfeCApIHtcblxuICAgICAgICAgICAgdGhpcy5tYXhfeCA9IHg7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggeSA8IHRoaXMubWluX3kgKSB7XG5cbiAgICAgICAgICAgIHRoaXMubWluX3kgPSB5O1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHkgPiB0aGlzLm1heF95ICkge1xuXG4gICAgICAgICAgICB0aGlzLm1heF95ID0geTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmF0ZXMgd2V0aGVyIG9yIHRoZSAyZCBwb2ludCBpcyBpbnNpZGUgdGhpcyBBQUJCLlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuQUFCQjIjaXNJbnNpZGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIHlcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG4gICAgQUFCQjIucHJvdG90eXBlLmlzSW5zaWRlID0gZnVuY3Rpb24gKCB4LCB5ICkge1xuXG4gICAgICAgIGlmICggeCA+PSB0aGlzLm1pbl94ICYmIHggPD0gdGhpcy5tYXhfeCAmJlxuICAgICAgICAgICAgIHkgPj0gdGhpcy5taW5feSAmJiB5IDw9IHRoaXMubWF4X3kgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmF0ZXMgd2V0aGVyIG9yIG5vdCB0aGlzIEFBQkIgaW50ZXJzZWN0cyAqYWFiYiouXG4gICAgICogQG1ldGhvZCBQaWNpbW8uY29yZS5BQUJCMiNpc0ludGVyc2VjdGlvblxuICAgICAqIEBwYXJhbSB7QUFCQjJ9IGFhYmIgLSBhYWJiXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuICAgIEFBQkIyLnByb3RvdHlwZS5pc0ludGVyc2VjdGlvbiA9IGZ1bmN0aW9uICggYWFiYiApIHtcblxuICAgICAgICBpZiAoIGFhYmIubWF4X3ggPCB0aGlzLm1pbl94IHx8IGFhYmIubWluX3ggPiB0aGlzLm1heF94IHx8XG4gICAgICAgICAgICAgYWFiYi5tYXhfeSA8IHRoaXMubWluX3kgfHwgYWFiYi5taW5feSA+IHRoaXMubWF4X3kgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IEFBQkIyO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFBpY2ltby5jb3JlXG4gICAgICovXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICBBQUJCMiAgICAgICAgICAgICAgICAgIDogcmVxdWlyZSggJy4vYWFiYjInICksXG4gICAgICAgIFZpZXdwb3J0ICAgICAgICAgICAgICAgOiByZXF1aXJlKCAnLi92aWV3cG9ydCcgKSxcblxuICAgICAgICBUZXh0dXJlICAgICAgICAgICAgICAgIDogcmVxdWlyZSggJy4vdGV4dHVyZScgKSxcblxuICAgICAgICBWZXJ0ZXhBcnJheSAgICAgICAgICAgIDogcmVxdWlyZSggJy4vdmVydGV4X2FycmF5JyApLFxuICAgICAgICBWZXJ0ZXhJbmRleEFycmF5ICAgICAgIDogcmVxdWlyZSggJy4vdmVydGV4X2luZGV4X2FycmF5JyApLFxuXG4gICAgICAgIFZlcnRleE9iamVjdCAgICAgICAgICAgOiByZXF1aXJlKCAnLi92ZXJ0ZXhfb2JqZWN0JyApLFxuICAgICAgICBWZXJ0ZXhPYmplY3REZXNjcmlwdG9yIDogcmVxdWlyZSggJy4vdmVydGV4X29iamVjdF9kZXNjcmlwdG9yJyApLFxuICAgICAgICBWZXJ0ZXhPYmplY3RQb29sICAgICAgIDogcmVxdWlyZSggJy4vdmVydGV4X29iamVjdF9wb29sJyApXG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLmNvcmUuVGV4dHVyZVxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVGV4dHVyZX0gW3BhcmVudF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3dpZHRoXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbaGVpZ2h0XVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHQgPSBuZXcgUGljaW1vLmNvcmUuVGV4dHVyZTtcbiAgICAgKiB0LmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxuICAgICAqIHQud2lkdGggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA9PiAzMDBcbiAgICAgKiB0LmhlaWdodCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPT4gMTUwXG4gICAgICpcbiAgICAgKiB2YXIgdHQgPSBuZXcgUGljaW1vLmNvcmUuVGV4dHVyZSggdCwgMzAsIDE1LCAxMDAsIDEwMCApXG4gICAgICogdC53aWR0aCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vID0+IDEwMFxuICAgICAqXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBUZXh0dXJlICggcGFyZW50LCB4LCB5LCB3aWR0aCwgaGVpZ2h0ICkge1xuXG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5faW1hZ2UgID0gbnVsbDtcbiAgICAgICAgdGhpcy5fd2lkdGggID0gd2lkdGg7XG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5UZXh0dXJlI3hcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMueCA9IHggIT0gbnVsbCA/IHggOiAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlRleHR1cmUjeVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy55ID0geSAhPSBudWxsID8geSA6IDA7XG5cbiAgICB9XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBUZXh0dXJlLnByb3RvdHlwZSwge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5UZXh0dXJlfSBQaWNpbW8uY29yZS5UZXh0dXJlI3BhcmVudFxuICAgICAgICAgKi9cblxuICAgICAgICBwYXJlbnQ6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9wYXJlbnQ7IH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCBwYXJlbnQgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHBhcmVudCAhPSBudWxsICYmIHRoaXMuX2ltYWdlICE9IG51bGwgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIlRleHR1cmUgY2FuIGhhdmUgYSBwYXJlbnQgb3IgYW4gaW1hZ2UgYnV0IG5vdCBib3RoIVwiICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtJbWFnZXxDYW52YXN9IFBpY2ltby5jb3JlLlRleHR1cmUjaW1hZ2VcbiAgICAgICAgICovXG5cbiAgICAgICAgaW1hZ2U6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmltYWdlIDogdGhpcy5faW1hZ2U7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCBpbWFnZSApIHtcblxuICAgICAgICAgICAgICAgIGlmICggaW1hZ2UgIT0gbnVsbCAmJiB0aGlzLl9wYXJlbnQgIT0gbnVsbCApIHtcblxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiVGV4dHVyZSBjYW4gaGF2ZSBhIHBhcmVudCBvciBhbiBpbWFnZSBidXQgbm90IGJvdGghXCIgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2ltYWdlID0gaW1hZ2U7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlRleHR1cmUjd2lkdGhcbiAgICAgICAgICovXG5cbiAgICAgICAgd2lkdGg6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuX3dpZHRoICE9IG51bGwgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gdGhpcy5pbWFnZTtcblxuICAgICAgICAgICAgICAgIGlmICggaW1hZ2UgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlLndpZHRoO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCB3aWR0aCApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlRleHR1cmUjaGVpZ2h0XG4gICAgICAgICAqL1xuXG4gICAgICAgIGhlaWdodDoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGlmICggdGhpcy5faGVpZ2h0ICE9IG51bGwgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHRoaXMuaW1hZ2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGltYWdlICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoIGhlaWdodCApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLmNvcmUuVGV4dHVyZSNtaW5fc1xuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG5cbiAgICAgICAgbWluX3M6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgICAgICAgICB2YXIgdGV4ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHdoaWxlICggKCB0ZXggPSB0ZXgucGFyZW50ICkgIT0gbnVsbCApIHtcblxuICAgICAgICAgICAgICAgICAgICB4ICs9IHRleC54O1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggLyB0aGlzLmltYWdlLndpZHRoO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5UZXh0dXJlI21pbl90XG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cblxuICAgICAgICBtaW5fdDoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy55O1xuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKCAoIHRleCA9IHRleC5wYXJlbnQgKSAhPSBudWxsICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHkgKz0gdGV4Lnk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4geSAvIHRoaXMuaW1hZ2UuaGVpZ2h0O1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5UZXh0dXJlI21heF9zXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cblxuICAgICAgICBtYXhfczoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHZhciB4ID0gdGhpcy54ICsgdGhpcy53aWR0aDtcbiAgICAgICAgICAgICAgICB2YXIgdGV4ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHdoaWxlICggKCB0ZXggPSB0ZXgucGFyZW50ICkgIT0gbnVsbCApIHtcblxuICAgICAgICAgICAgICAgICAgICB4ICs9IHRleC54O1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggLyB0aGlzLmltYWdlLndpZHRoO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5UZXh0dXJlI21heF90XG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cblxuICAgICAgICBtYXhfdDoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdmFyIHRleCA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoICggdGV4ID0gdGV4LnBhcmVudCApICE9IG51bGwgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgeSArPSB0ZXgueTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB5IC8gdGhpcy5pbWFnZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9LFxuXG4gICAgfSk7XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuVGV4dHVyZSNzZXRUZXhDb29yZHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gQW55IG9iamVjdCB3aGljaCBoYXMgYSBgLnNldFRleENvb3JkcygpYCBtZXRob2RcbiAgICAgKi9cblxuICAgIFRleHR1cmUucHJvdG90eXBlLnNldFRleENvb3JkcyA9IGZ1bmN0aW9uICggb2JqICkge1xuXG4gICAgICAgIHZhciB4MCA9IHRoaXMubWluX3M7XG4gICAgICAgIHZhciB5MCA9IHRoaXMubWluX3Q7XG4gICAgICAgIHZhciB4MSA9IHRoaXMubWF4X3M7XG4gICAgICAgIHZhciB5MSA9IHRoaXMubWF4X3Q7XG5cbiAgICAgICAgb2JqLnNldFRleENvb3JkcyhcbiAgICAgICAgICAgIHgwLCB5MCxcbiAgICAgICAgICAgIHgxLCB5MCxcbiAgICAgICAgICAgIHgxLCB5MSxcbiAgICAgICAgICAgIHgwLCB5MSApO1xuICAgIFxuICAgIH07XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVGV4dHVyZTtcblxufSkoKTtcbiIsIi8qIGdsb2JhbCBGbG9hdDMyQXJyYXkgKi9cbihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby5jb3JlLlZlcnRleEFycmF5XG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yfSBkZXNjcmlwdG9yIC0gVGhlIGRlc2NyaXB0b3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNhcGFjaXR5IC0gTWF4aW11bSBudW1iZXIgb2YgdmVydGV4IG9iamVjdHNcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gW3ZlcnRpY2VzXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZlcnRleEFycmF5ICggZGVzY3JpcHRvciwgY2FwYWNpdHksIHZlcnRpY2VzICkge1xuXG4gICAgICAgIHRoaXMuZGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XG4gICAgICAgIHRoaXMuY2FwYWNpdHkgICA9IGNhcGFjaXR5O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtGbG9hdDMyQXJyYXl9IFBpY2ltby5jb3JlLlZlcnRleEFycmF5I3ZlcnRpY2VzIC0gVGhlIGZsb2F0IGFycmF5IGJ1ZmZlci5cbiAgICAgICAgICovXG5cbiAgICAgICAgaWYgKCB2ZXJ0aWNlcyAhPT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICB0aGlzLnZlcnRpY2VzID0gdmVydGljZXM7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkoIGNhcGFjaXR5ICogZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCAqIGRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50ICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheSNjb3B5XG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheX0gZnJvbVZlcnRleEFycmF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0b09mZnNldD0wXSAtIFZlcnRleCBvYmplY3Qgb2Zmc2V0XG4gICAgICovXG4gICAgVmVydGV4QXJyYXkucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoIGZyb21WZXJ0ZXhBcnJheSwgdG9PZmZzZXQgKSB7XG5cbiAgICAgICAgdmFyIG9mZnNldCA9IDA7XG5cbiAgICAgICAgaWYgKCB0b09mZnNldCA9PT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICBvZmZzZXQgPSB0b09mZnNldCAqIHRoaXMuZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCAqIHRoaXMuZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQ7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmVydGljZXMuc2V0KCBmcm9tVmVydGV4QXJyYXkudmVydGljZXMsIG9mZnNldCApO1xuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuVmVydGV4QXJyYXkjc3ViYXJyYXlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmVnaW4gLSBJbmRleCBvZiBmaXJzdCB2ZXJ0ZXggb2JqZWN0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzaXplPTFdIC1cbiAgICAgKiBAcmV0dXJuIHtQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheX1cbiAgICAgKi9cbiAgICBWZXJ0ZXhBcnJheS5wcm90b3R5cGUuc3ViYXJyYXkgPSBmdW5jdGlvbiAoIGJlZ2luLCBzaXplICkge1xuXG4gICAgICAgIGlmICggc2l6ZSA9PT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICBzaXplID0gMTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcy5zdWJhcnJheShcbiAgICAgICAgICAgICAgICBiZWdpbiAqIHRoaXMuZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCAqIHRoaXMuZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQsXG4gICAgICAgICAgICAgICAgKGJlZ2luICsgc2l6ZSkgKiB0aGlzLmRlc2NyaXB0b3IudmVydGV4Q291bnQgKiB0aGlzLmRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50ICk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWZXJ0ZXhBcnJheSggdGhpcy5kZXNjcmlwdG9yLCBzaXplLCB2ZXJ0aWNlcyApO1xuXG4gICAgfTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhBcnJheTtcblxufSkoKTtcbiIsIi8qIGdsb2JhbCBVaW50MzJBcnJheSAqL1xuKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLmNvcmUuVmVydGV4SW5kZXhBcnJheVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2ZXJ0ZXhPYmplY3RDb3VudCAtIE51bWJlciBvZiB2ZXJ0ZXggb2JqZWN0c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvYmplY3RJbmRleENvdW50IC0gTnVtYmVyIG9mIHZlcnRleCBpbmRpY2VzIHBlciBvYmplY3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBWZXJ0ZXhJbmRleEFycmF5ICggdmVydGV4T2JqZWN0Q291bnQsIG9iamVjdEluZGV4Q291bnQgKSB7XG5cbiAgICAgICAgdmFyIHNpemUgPSB2ZXJ0ZXhPYmplY3RDb3VudCAqIG9iamVjdEluZGV4Q291bnQ7XG5cbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnRpZXNQdWJsaWNSTyggdGhpcywge1xuICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5WZXJ0ZXhJbmRleEFycmF5I3ZlcnRleE9iamVjdENvdW50IC0gTnVtYmVyIG9mIHZlcnRleCBvYmplY3RzLlxuICAgICAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZlcnRleE9iamVjdENvdW50OiB2ZXJ0ZXhPYmplY3RDb3VudCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlZlcnRleEluZGV4QXJyYXkjb2JqZWN0SW5kZXhDb3VudCAtIE51bWJlciBvZiB2ZXJ0ZXggaW5kaWNlcyBwZXIgb2JqZWN0LlxuICAgICAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9iamVjdEluZGV4Q291bnQ6IG9iamVjdEluZGV4Q291bnQsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5WZXJ0ZXhJbmRleEFycmF5I3NpemUgLSBTaXplIG9mIGFycmF5IGJ1ZmZlci5cbiAgICAgICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzaXplOiBzaXplLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge1VpbnQzMkFycmF5fSBQaWNpbW8uY29yZS5WZXJ0ZXhJbmRleEFycmF5I2luZGljZXMgLSBUaGUgdWludCBpbmRleCBhcnJheSBidWZmZXIuXG4gICAgICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaW5kaWNlczogbmV3IFVpbnQzMkFycmF5KCBzaXplIClcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gUGljaW1vLmNvcmUuVmVydGV4SW5kZXhBcnJheS5HZW5lcmF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2ZXJ0ZXhPYmplY3RDb3VudFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGluZGljZXNcbiAgICAgKiBAcmV0dXJuIHtQaWNpbW8uY29yZS5WZXJ0ZXhJbmRleEFycmF5fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gY3JlYXRlIGEgdmVydGV4IGluZGV4IGJ1ZmZlciBmb3IgdGVuIHF1YWRzIHdoZXJlIGVhY2ggcXVhZCBpcyBjb25zdHJ1Y3RlZCBvZiB0d28gdHJpYW5nbGVzXG4gICAgICogdmFyIHF1YWRJbmRpY2VzID0gUGljaW1vLmNvcmUuVmVydGV4SW5kZXhBcnJheS5HZW5lcmF0ZSggMTAsIFsgMCwxLDIsIDAsMiwzIF0gKTtcbiAgICAgKiBxdWFkSW5kaWNlcy5zaXplICAgICAgICAgICAgICAgICAvLyA9PiA2MFxuICAgICAqIHF1YWRJbmRpY2VzLm9iamVjdEluZGV4Q291bnQgICAgIC8vID0+IDZcbiAgICAgKlxuICAgICAqL1xuICAgIFZlcnRleEluZGV4QXJyYXkuR2VuZXJhdGUgPSBmdW5jdGlvbiAoIHZlcnRleE9iamVjdENvdW50LCBpbmRpY2VzICkge1xuXG4gICAgICAgIHZhciBhcnIgPSBuZXcgVmVydGV4SW5kZXhBcnJheSggdmVydGV4T2JqZWN0Q291bnQsIGluZGljZXMubGVuZ3RoICk7XG4gICAgICAgIHZhciBpLCBqO1xuXG4gICAgICAgIGZvciAoIGkgPSAwOyBpIDwgdmVydGV4T2JqZWN0Q291bnQ7ICsraSApIHtcblxuICAgICAgICAgICAgZm9yICggaiA9IDA7IGogPCBpbmRpY2VzLmxlbmd0aDsgKytqICkge1xuXG4gICAgICAgICAgICAgICAgYXJyWyAoIGkgKiBhcnIub2JqZWN0SW5kZXhDb3VudCApICsgaiBdID0gaW5kaWNlc1sgaiBdICsgKCBpICogYXJyLm9iamVjdEluZGV4Q291bnQgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyO1xuXG4gICAgfTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhJbmRleEFycmF5O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0XG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yfSBbZGVzY3JpcHRvcl0gLSBWZXJ0ZXggZGVzY3JpcHRvci5cbiAgICAgKiBAcGFyYW0ge1BpY2ltby5jb3JlLlZlcnRleEFycmF5fSBbdmVydGV4QXJyYXldIC0gVmVydGV4IGFycmF5LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZlcnRleE9iamVjdCAoIGRlc2NyaXB0b3IsIHZlcnRleEFycmF5ICkge1xuXG4gICAgICAgIGlmICggdGhpcy5kZXNjcmlwdG9yICE9PSB1bmRlZmluZWQgKSByZXR1cm47XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLlZlcnRleE9iamVjdERlc2NyaXB0b3J9IFBpY2ltby5jb3JlLlZlcnRleE9iamVjdCNkZXNjcmlwdG9yIC0gVmVydGV4IG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG5cbiAgICAgICAgdmFyIF9kZXNjcmlwdG9yID0gKCAhISBkZXNjcmlwdG9yICkgPyBkZXNjcmlwdG9yIDogKCAoICEhIHZlcnRleEFycmF5ICkgPyB2ZXJ0ZXhBcnJheS5kZXNjcmlwdG9yIDogbnVsbCApO1xuICAgICAgICBpZiAoICEgX2Rlc2NyaXB0b3IgKSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggJ1ZlcnRleE9iamVjdC5kZXNjcmlwdG9yIGlzIG51bGwhJyApO1xuXG4gICAgICAgIH1cbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnR5UHJpdmF0ZVJPKCB0aGlzLCAnZGVzY3JpcHRvcicsIF9kZXNjcmlwdG9yICk7XG5cbiAgICAgICAgLyoqIEBtZW1iZXIge1BpY2ltby5jb3JlLlZlcnRleEFycmF5fSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3QjdmVydGV4QXJyYXkgLSBWZXJ0ZXggYXJyYXkuICovXG4gICAgICAgIHZhciBfdmVydGV4QXJyYXkgPSAoICEhIHZlcnRleEFycmF5ICkgPyB2ZXJ0ZXhBcnJheSA6IGRlc2NyaXB0b3IuY3JlYXRlVmVydGV4QXJyYXkoKTtcbiAgICAgICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnR5UHJpdmF0ZSggdGhpcywgJ3ZlcnRleEFycmF5JywgX3ZlcnRleEFycmF5ICk7XG5cbiAgICAgICAgaWYgKCB0aGlzLmRlc2NyaXB0b3IgIT09IHRoaXMudmVydGV4QXJyYXkuZGVzY3JpcHRvciAmJiAoIHRoaXMuZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCAhPT0gdGhpcy52ZXJ0ZXhBcnJheS5kZXNjcmlwdG9yLnZlcnRleENvdW50IHx8IHRoaXMuZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQgIT09IHRoaXMudmVydGV4QXJyYXkuZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQpICkge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdJbmNvbXBhdGlibGUgdmVydGV4IG9iamVjdCBkZXNjcmlwdG9ycyEnICk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIFZlcnRleE9iamVjdC5wcm90b3R5cGUsIHtcblxuICAgICAgICAndmVydGljZXMnOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXhPYmplY3Q7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vdmFyIHV0aWxzID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuICAgIHZhciBWZXJ0ZXhPYmplY3QgPSByZXF1aXJlKCAnLi92ZXJ0ZXhfb2JqZWN0JyApO1xuICAgIHZhciBWZXJ0ZXhBcnJheSA9IHJlcXVpcmUoICcuL3ZlcnRleF9hcnJheScgKTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gdmVydGV4T2JqZWN0Q29uc3RydWN0b3IgLSBWZXJ0ZXggb2JqZWN0IGNvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZlcnRleENvdW50IC0gVmVydGV4IGNvdW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZlcnRleEF0dHJDb3VudCAtIFZlcnRleCBhdHRyaWJ1dGUgY291bnRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyaWJ1dGVzIC0gVmVydGV4IGF0dHJpYnV0ZSBkZXNjcmlwdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2FsaWFzZXNdIC0gVmVydGV4IGF0dHJpYnV0ZSBhbGlhc2VzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgZGVzY3JpcHRvciA9IG5ldyBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yKFxuICAgICAqXG4gICAgICogICAgIG51bGwsXG4gICAgICpcbiAgICAgKiAgICAgNCwgICAvLyB2ZXJ0ZXhDb3VudFxuICAgICAqICAgICAxMiwgIC8vIHZlcnRleEF0dHJDb3VudFxuICAgICAqXG4gICAgICogICAgIFsgICAgLy8gYXR0cmlidXRlcyAuLlxuICAgICAqXG4gICAgICogICAgICAgICB7IG5hbWU6ICdwb3NpdGlvbicsICBzaXplOiAzLCBhdHRyTmFtZXM6IFsgJ3gnLCAneScsICd6JyBdIH0sXG4gICAgICogICAgICAgICB7IG5hbWU6ICdyb3RhdGUnLCAgICBzaXplOiAxLCB1bmlmb3JtOiB0cnVlIH0sXG4gICAgICogICAgICAgICB7IG5hbWU6ICd0ZXhDb29yZHMnLCBzaXplOiAyLCBhdHRyTmFtZXM6IFsgJ3MnLCAndCcgXSB9LFxuICAgICAqICAgICAgICAgeyBuYW1lOiAndHJhbnNsYXRlJywgc2l6ZTogMiwgYXR0ck5hbWVzOiBbICd0eCcsICd0eScgXSwgdW5pZm9ybTogdHJ1ZSB9LFxuICAgICAqICAgICAgICAgeyBuYW1lOiAnc2NhbGUnLCAgICAgc2l6ZTogMSwgdW5pZm9ybTogdHJ1ZSB9LFxuICAgICAqICAgICAgICAgeyBuYW1lOiAnb3BhY2l0eScsICAgc2l6ZTogMSwgdW5pZm9ybTogdHJ1ZSB9XG4gICAgICpcbiAgICAgKiAgICAgXSxcbiAgICAgKlxuICAgICAqICAgICB7ICAgLy8gYWxpYXNlcyAuLlxuICAgICAqXG4gICAgICogICAgICAgICBwb3MyZDogeyBzaXplOiAyLCBvZmZzZXQ6IDAgfSxcbiAgICAgKiAgICAgICAgIHBvc1o6ICB7IHNpemU6IDEsIG9mZnNldDogMiwgdW5pZm9ybTogdHJ1ZSB9LFxuICAgICAqICAgICAgICAgdXY6ICAgICd0ZXhDb29yZHMnXG4gICAgICpcbiAgICAgKiAgICAgfVxuICAgICAqXG4gICAgICogKTtcbiAgICAgKlxuICAgICAqIHZvLnByb3RvLm51bWJlck9mQmVhc3QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiA2NjY7IH07XG4gICAgICpcbiAgICAgKlxuICAgICAqIHZhciB2byA9IGRlc2NyaXB0b3IuY3JlYXRlKCk7XG4gICAgICpcbiAgICAgKiB2by5zZXRQb3NpdGlvbiggMSwyLC0xLCA0LDUsLTEsIDcsOCwtMSwgMTAsMTEsLTEgKTtcbiAgICAgKiB2by54MiAgICAgICAgICAgICAgICAvLyA9PiA3XG4gICAgICogdm8ueTAgICAgICAgICAgICAgICAgLy8gPT4gMlxuICAgICAqIHZvLnBvc1ogICAgICAgICAgICAgIC8vID0+IC0xXG4gICAgICogdm8ucG9zWiA9IDIzO1xuICAgICAqIHZvLnoxICAgICAgICAgICAgICAgIC8vID0+IDIzXG4gICAgICogdm8ubnVtYmVyT2ZCZWFzdCgpICAgLy8gPT4gNjY2XG4gICAgICpcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBWZXJ0ZXhPYmplY3REZXNjcmlwdG9yICggdmVydGV4T2JqZWN0Q29uc3RydWN0b3IsIHZlcnRleENvdW50LCB2ZXJ0ZXhBdHRyQ291bnQsIGF0dHJpYnV0ZXMsIGFsaWFzZXMgKSB7XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhPYmplY3RDb25zdHJ1Y3RvciA9IHR5cGVvZiB2ZXJ0ZXhPYmplY3RDb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyA/IHZlcnRleE9iamVjdENvbnN0cnVjdG9yIDogKCBmdW5jdGlvbiAoKSB7fSApO1xuICAgICAgICB0aGlzLnZlcnRleE9iamVjdENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFZlcnRleE9iamVjdC5wcm90b3R5cGUgKTtcbiAgICAgICAgdGhpcy52ZXJ0ZXhPYmplY3RDb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSB0aGlzLnZlcnRleE9iamVjdENvbnN0cnVjdG9yO1xuXG4gICAgICAgIHRoaXMudmVydGV4Q291bnQgPSBwYXJzZUludCggdmVydGV4Q291bnQsIDEwICk7XG4gICAgICAgIHRoaXMudmVydGV4QXR0ckNvdW50ID0gcGFyc2VJbnQoIHZlcnRleEF0dHJDb3VudCwgMTAgKTtcblxuICAgICAgICAvLyA9PT09PT09IGF0dHJpYnV0ZXMgPT09PT09PVxuXG4gICAgICAgIHRoaXMuYXR0ciA9IHt9O1xuXG4gICAgICAgIHZhciBvZmZzZXQsIGF0dHIsIGk7XG5cbiAgICAgICAgaWYgKCBBcnJheS5pc0FycmF5KCBhdHRyaWJ1dGVzICkgKSB7XG5cbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG5cbiAgICAgICAgICAgIGZvciAoIGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7ICsraSApIHtcblxuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyaWJ1dGVzWyBpIF07XG5cbiAgICAgICAgICAgICAgICBpZiAoIGF0dHIuc2l6ZSA9PT0gdW5kZWZpbmVkICkgdGhyb3cgbmV3IEVycm9yKCAndmVydGV4IG9iamVjdCBhdHRyaWJ1dGUgZGVzY3JpcHRvciBoYXMgbm8gc2l6ZSBwcm9wZXJ0eSEnICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGF0dHIubmFtZSAhPT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0clsgYXR0ci5uYW1lIF0gPSBuZXcgVmVydGV4T2JqZWN0QXR0ckRlc2NyaXB0b3IoIGF0dHIubmFtZSwgYXR0ci5zaXplLCBvZmZzZXQsICEhIGF0dHIudW5pZm9ybSwgYXR0ci5hdHRyTmFtZXMgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9mZnNldCArPSBhdHRyLnNpemU7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBvZmZzZXQgPiB0aGlzLnZlcnRleEF0dHJDb3VudCApIHRocm93IG5ldyBFcnJvciggJ3ZlcnRleEF0dHJDb3VudCBpcyB0b28gc21hbGwgKG9mZnNldD0nICsgb2Zmc2V0ICsgJyknICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vID09PT09PT0gYWxpYXNlcyA9PT09PT09XG5cbiAgICAgICAgdmFyIG5hbWU7XG5cbiAgICAgICAgaWYgKCBhbGlhc2VzICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgIGZvciAoIG5hbWUgaW4gYWxpYXNlcyApIHtcblxuICAgICAgICAgICAgICAgIGlmICggYWxpYXNlcy5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xuXG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBhbGlhc2VzWyBuYW1lIF07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgYXR0ciA9PT0gJ3N0cmluZycgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgPSB0aGlzLmF0dHJbIGF0dHIgXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBhdHRyICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJbIG5hbWUgXSA9IGF0dHI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHJbIG5hbWUgXSA9IG5ldyBWZXJ0ZXhPYmplY3RBdHRyRGVzY3JpcHRvciggbmFtZSwgYXR0ci5zaXplLCBhdHRyLm9mZnNldCwgISEgYXR0ci51bmlmb3JtLCBhdHRyLmF0dHJOYW1lcyApO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09IHByb3BlcnRpZXNPYmplY3QgPT09PT09PVxuXG4gICAgICAgIHRoaXMucHJvcGVydGllc09iamVjdCA9IHt9O1xuXG4gICAgICAgIGZvciAoIG5hbWUgaW4gdGhpcy5hdHRyICkge1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMuYXR0ci5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xuXG4gICAgICAgICAgICAgICAgYXR0ciA9IHRoaXMuYXR0clsgbmFtZSBdO1xuXG4gICAgICAgICAgICAgICAgYXR0ci5kZWZpbmVQcm9wZXJ0aWVzKCBuYW1lLCB0aGlzLnByb3BlcnRpZXNPYmplY3QsIHRoaXMgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvLyA9PT09PT09IHZlcnRleCBvYmplY3QgcHJvdG90eXBlID09PT09PT1cblxuICAgICAgICB0aGlzLnZlcnRleE9iamVjdFByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIHRoaXMudmVydGV4T2JqZWN0Q29uc3RydWN0b3IucHJvdG90eXBlLCB0aGlzLnByb3BlcnRpZXNPYmplY3QgKTtcblxuXG4gICAgICAgIC8vID09PSB3aW50ZXJrw6RsdGUgamV0enRcblxuICAgICAgICBPYmplY3QuZnJlZXplKCB0aGlzLmF0dHIgKTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSggdGhpcyApO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yI2NyZWF0ZVZlcnRleEFycmF5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzaXplPTFdXG4gICAgICogQHJldHVybiB7UGljaW1vLmNvcmUuVmVydGV4QXJyYXl9XG4gICAgICovXG4gICAgVmVydGV4T2JqZWN0RGVzY3JpcHRvci5wcm90b3R5cGUuY3JlYXRlVmVydGV4QXJyYXkgPSBmdW5jdGlvbiAoIHNpemUgKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWZXJ0ZXhBcnJheSggdGhpcywgKCBzaXplID09PSB1bmRlZmluZWQgPyAxIDogc2l6ZSApICk7XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IHZlcnRleCBvYmplY3QuXG4gICAgICogQG1ldGhvZCBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yI2NyZWF0ZVxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmVydGV4QXJyYXl9IFt2ZXJ0ZXhBcnJheV0gLSBWZXJ0ZXggYXJyYXkuXG4gICAgICogQHJldHVybiB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0fVxuICAgICAqL1xuICAgIFZlcnRleE9iamVjdERlc2NyaXB0b3IucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICggdmVydGV4QXJyYXkgKSB7XG5cbiAgICAgICAgdmFyIHZvID0gT2JqZWN0LmNyZWF0ZSggdGhpcy52ZXJ0ZXhPYmplY3RQcm90b3R5cGUgKTtcbiAgICAgICAgVmVydGV4T2JqZWN0LmNhbGwoIHZvLCB0aGlzLCB2ZXJ0ZXhBcnJheSApO1xuXG4gICAgICAgIGlmICggVmVydGV4T2JqZWN0ICE9PSB0aGlzLnZlcnRleE9iamVjdENvbnN0cnVjdG9yICkge1xuXG4gICAgICAgICAgICB0aGlzLnZlcnRleE9iamVjdENvbnN0cnVjdG9yLmNhbGwoIHZvICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2bztcblxuICAgIH07XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBWZXJ0ZXhPYmplY3REZXNjcmlwdG9yLnByb3RvdHlwZSwge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtPYmplY3R9IFBpY2ltby5jb3JlLlZlcnRleE9iamVjdERlc2NyaXB0b3IjcHJvdG8gLSBUaGUgcHJvdG90eXBlIG9iamVjdCBvZiB0aGUgdmVydGV4IG9iamVjdC4gWW91IHNob3VsZCBhZGQgeW91ciBvd24gcHJvcGVydGllcyBhbmQgbWV0aG9kcyBoZXJlLlxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG5cbiAgICAgICAgJ3Byb3RvJzoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52ZXJ0ZXhPYmplY3RDb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFZlcnRleE9iamVjdEF0dHJEZXNjcmlwdG9yXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGZ1bmN0aW9uIFZlcnRleE9iamVjdEF0dHJEZXNjcmlwdG9yICggbmFtZSwgc2l6ZSwgb2Zmc2V0LCB1bmlmb3JtLCBhdHRyTmFtZXMgKSB7XG5cbiAgICAgICAgdGhpcy5uYW1lICAgICAgPSBuYW1lO1xuICAgICAgICB0aGlzLnNpemUgICAgICA9IHNpemU7XG4gICAgICAgIHRoaXMub2Zmc2V0ICAgID0gb2Zmc2V0O1xuICAgICAgICB0aGlzLnVuaWZvcm0gICA9IHVuaWZvcm07XG4gICAgICAgIHRoaXMuYXR0ck5hbWVzID0gYXR0ck5hbWVzO1xuXG4gICAgICAgIE9iamVjdC5mcmVlemUoIHRoaXMgKTtcblxuICAgIH1cblxuICAgIFZlcnRleE9iamVjdEF0dHJEZXNjcmlwdG9yLnByb3RvdHlwZS5nZXRBdHRyUG9zdGZpeCA9IGZ1bmN0aW9uICggbmFtZSwgaW5kZXggKSB7XG5cbiAgICAgICAgaWYgKCB0aGlzLmF0dHJOYW1lcyApIHtcblxuICAgICAgICAgICAgdmFyIHBvc3RmaXggPSB0aGlzLmF0dHJOYW1lc1sgaW5kZXggXTtcblxuICAgICAgICAgICAgaWYgKCBwb3N0Zml4ICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zdGZpeDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmFtZSArICdfJyArIGluZGV4O1xuXG4gICAgfTtcblxuICAgIFZlcnRleE9iamVjdEF0dHJEZXNjcmlwdG9yLnByb3RvdHlwZS5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKCBuYW1lLCBvYmosIGRlc2NyaXB0b3IgKSB7XG5cbiAgICAgICAgdmFyIGksIGosIHNldHRlcjtcblxuICAgICAgICBpZiAoIHRoaXMuc2l6ZSA9PT0gMSApIHtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLnVuaWZvcm0gKSB7XG5cbiAgICAgICAgICAgICAgICBvYmpbIG5hbWUgXSA9IHtcblxuICAgICAgICAgICAgICAgICAgICBnZXQgICAgICAgIDogZ2V0X3YxZl91KCB0aGlzLm9mZnNldCApLFxuICAgICAgICAgICAgICAgICAgICBzZXQgICAgICAgIDogc2V0X3YxZl91KCBkZXNjcmlwdG9yLnZlcnRleENvdW50LCBkZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCwgdGhpcy5vZmZzZXQgKSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZSA6IHRydWVcblxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBvYmpbIFwic2V0XCIgKyBjYW1lbGl6ZSggbmFtZSApIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgICAgICA6IHNldF92MWZfdiggZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCwgZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQsIHRoaXMub2Zmc2V0ICksXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlXG5cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZm9yICggaSA9IDA7IGkgPCBkZXNjcmlwdG9yLnZlcnRleENvdW50IDsgKytpICkge1xuXG4gICAgICAgICAgICAgICAgICAgIG9ialsgbmFtZSArIGkgXSA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0ICAgICAgICA6IGdldF92MWZfdSggdGhpcy5vZmZzZXQgKyAoIGkgKiBkZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCApICksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQgICAgICAgIDogc2V0X3YxZl92KCAxLCAwLCB0aGlzLm9mZnNldCArICggaSAqIGRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50ICkgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuc2l6ZSA+PSAyICYmIHRoaXMuc2l6ZSA8PSA0ICkge1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMudW5pZm9ybSApIHtcblxuICAgICAgICAgICAgICAgIG9ialsgXCJnZXRcIiArIGNhbWVsaXplKCBuYW1lICkgXSA9IHtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSAgICAgIDogZ2V0X3ZOZl91KCB0aGlzLm9mZnNldCApLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlIDogdHJ1ZVxuXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHNldHRlciA9IFsgc2V0X3YyZl91LCBzZXRfdjNmX3UsIHNldF92NGZfdSBdWyB0aGlzLnNpemUgLSAyIF07XG5cbiAgICAgICAgICAgICAgICBvYmpbIFwic2V0XCIgKyBjYW1lbGl6ZSggbmFtZSApIF0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgICAgICA6IHNldHRlciggZGVzY3JpcHRvci52ZXJ0ZXhDb3VudCwgZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQsIHRoaXMub2Zmc2V0ICksXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlXG5cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZm9yICggaSA9IDA7IGkgPCB0aGlzLnNpemUgOyArK2kgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgb2JqWyB0aGlzLmdldEF0dHJQb3N0Zml4KCBuYW1lLCBpICkgXSA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0ICAgICAgICA6IGdldF92MWZfdSggdGhpcy5vZmZzZXQgKyBpICksXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXQgICAgICAgIDogc2V0X3YxZl91KCBkZXNjcmlwdG9yLnZlcnRleENvdW50LCBkZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCwgdGhpcy5vZmZzZXQgKyBpICksXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlIDogdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBzZXR0ZXIgPSBbIHNldF92MmZfdiwgc2V0X3YzZl92IF1bIHRoaXMuc2l6ZSAtIDIgXTtcblxuICAgICAgICAgICAgICAgIG9ialsgXCJzZXRcIiArIGNhbWVsaXplKCBuYW1lICkgXSA9IHtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSAgICAgIDogc2V0dGVyKCBkZXNjcmlwdG9yLnZlcnRleENvdW50LCBkZXNjcmlwdG9yLnZlcnRleEF0dHJDb3VudCwgdGhpcy5vZmZzZXQgKSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZSA6IHRydWVcblxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IGRlc2NyaXB0b3IudmVydGV4Q291bnQgOyArK2kgKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoIGogPSAwOyBqIDwgdGhpcy5zaXplIDsgKytqICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpbIHRoaXMuZ2V0QXR0clBvc3RmaXgoIG5hbWUsIGogKSArIGkgXSA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldCAgICAgICAgOiBnZXRfdjFmX3UoIHRoaXMub2Zmc2V0ICsgKCBpICogZGVzY3JpcHRvci52ZXJ0ZXhBdHRyQ291bnQgKSArIGogKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXQgICAgICAgIDogc2V0X3YxZl92KCAxLCAwLCB0aGlzLm9mZnNldCArICggaSAqIGRlc2NyaXB0b3IudmVydGV4QXR0ckNvdW50ICkgKyBqICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZSA6IHRydWVcblxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnVW5zdXBwcnRlZCB2ZXJ0ZXggYXR0cmlidXRlIHNpemUgb2YgJyArIHRoaXMuc2l6ZSArICcgKHNob3VsZCBub3QgYmUgZ3JlYXRlciB0aGFuIDQpJyApO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRfdk5mX3UgKCBvZmZzZXQgKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggYXR0ckluZGV4ICkge1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlc1sgb2Zmc2V0ICsgYXR0ckluZGV4IF07XG5cbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldF92MmZfdSAoIHZlcnRleENvdW50LCB2ZXJ0ZXhBdHRyQ291bnQsIG9mZnNldCApIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2MCwgdjEgKSB7XG5cbiAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgKytpICkge1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIGkgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCAgICAgXSA9IHYwO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCBpICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAxIF0gPSB2MTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRfdjNmX3UgKCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBvZmZzZXQgKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdjAsIHYxLCB2MiApIHtcblxuICAgICAgICAgICAgdmFyIF92ZXJ0aWNlcyA9IHRoaXMudmVydGV4QXJyYXkudmVydGljZXM7XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHZlcnRleENvdW50OyArK2kgKSB7XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggaSAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICAgICBdID0gdjA7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIGkgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDEgXSA9IHYxO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCBpICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAyIF0gPSB2MjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRfdjRmX3UgKCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBvZmZzZXQgKSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdjAsIHYxLCB2MiwgdjMgKSB7XG5cbiAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgKytpICkge1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIGkgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCAgICAgXSA9IHYwO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCBpICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAxIF0gPSB2MTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggaSAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMiBdID0gdjI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIGkgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDMgXSA9IHYzO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF92MWZfdSAoIG9mZnNldCApIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlc1sgb2Zmc2V0IF07XG5cbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldF92MWZfdiAoIHZlcnRleENvdW50LCB2ZXJ0ZXhBdHRyQ291bnQsIG9mZnNldCApIHtcblxuICAgICAgICBpZiAoIHZlcnRleENvdW50ID09PSAxICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4QXJyYXkudmVydGljZXNbIG9mZnNldCBdID0gdmFsdWU7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmICggdmVydGV4Q291bnQgPT09IDMgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHYwLCB2MSwgdjIgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0IF0gICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYwO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0IF0gICAgICAgICA9IHYxO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgXSA9IHYyO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHZlcnRleENvdW50ID09PSA0ICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2MCwgdjEsIHYyLCB2MyApIHtcblxuICAgICAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgXSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjA7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyB2ZXJ0ZXhBdHRyQ291bnQgKyBvZmZzZXQgXSAgICAgICAgID0gdjE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDIgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCBdID0gdjI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDMgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCBdID0gdjM7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnVW5zdXBwb3J0ZWQgdmVydGV4Q291bnQ9JyArIHZlcnRleENvdW50ICsgJyBmb3IgcGVyIHZlcnRleCBhdHRyaWJ1dGUgKGFsbG93ZWQgaXMgMSwgMyBvciA0KScgKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRfdjJmX3YgKCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBvZmZzZXQgKSB7XG5cbiAgICAgICAgaWYgKCB2ZXJ0ZXhDb3VudCA9PT0gMSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdmFsdWVfMCwgdmFsdWVfMSApIHtcblxuICAgICAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgXSAgICAgPSB2YWx1ZV8wO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0ICsgMSBdID0gdmFsdWVfMTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKCB2ZXJ0ZXhDb3VudCA9PT0gMyApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdjAsIHYxLCB2MF8xLCB2MV8xLCB2MF8yLCB2MV8yICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIF92ZXJ0aWNlcyA9IHRoaXMudmVydGV4QXJyYXkudmVydGljZXM7XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCBdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjA7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgKyAxIF0gICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYxO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0IF0gICAgICAgICAgICAgPSB2MF8xO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0ICsgMSBdICAgICAgICAgPSB2MV8xO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgXSAgICAgPSB2MF8yO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAxIF0gPSB2MV8yO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHZlcnRleENvdW50ID09PSA0ICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2MCwgdjEsIHYwXzEsIHYxXzEsIHYwXzIsIHYxXzIsIHYwXzMsIHYxXzMgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0IF0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MDtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCArIDEgXSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyB2ZXJ0ZXhBdHRyQ291bnQgKyBvZmZzZXQgXSAgICAgICAgICAgICA9IHYwXzE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyB2ZXJ0ZXhBdHRyQ291bnQgKyBvZmZzZXQgKyAxIF0gICAgICAgICA9IHYxXzE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDIgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCBdICAgICA9IHYwXzI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDIgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDEgXSA9IHYxXzI7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDMgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCBdICAgICA9IHYwXzM7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyAoIDMgKiB2ZXJ0ZXhBdHRyQ291bnQgKSArIG9mZnNldCArIDEgXSA9IHYxXzM7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCAnVW5zdXBwb3J0ZWQgdmVydGV4Q291bnQ9JyArIHZlcnRleENvdW50ICsgJyBmb3IgcGVyIHZlcnRleCBhdHRyaWJ1dGUgKGFsbG93ZWQgaXMgMSwgMyBvciA0KScgKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRfdjNmX3YgKCB2ZXJ0ZXhDb3VudCwgdmVydGV4QXR0ckNvdW50LCBvZmZzZXQgKSB7XG5cbiAgICAgICAgaWYgKCB2ZXJ0ZXhDb3VudCA9PT0gMSApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICggdmFsdWVfMCwgdmFsdWVfMSwgdmFsdWVfMiApIHtcblxuICAgICAgICAgICAgICAgIHZhciBfdmVydGljZXMgPSB0aGlzLnZlcnRleEFycmF5LnZlcnRpY2VzO1xuXG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgXSAgICAgPSB2YWx1ZV8wO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0ICsgMSBdID0gdmFsdWVfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCArIDIgXSA9IHZhbHVlXzI7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmICggdmVydGV4Q291bnQgPT09IDMgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoIHYwLCB2MSwgdjIsIHYwXzEsIHYxXzEsIHYyXzEsIHYwXzIsIHYxXzIsIHYyXzIgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgX3ZlcnRpY2VzID0gdGhpcy52ZXJ0ZXhBcnJheS52ZXJ0aWNlcztcblxuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0IF0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MDtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCArIDEgXSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjE7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgKyAyIF0gICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYyO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0IF0gICAgICAgICAgICAgPSB2MF8xO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0ICsgMSBdICAgICAgICAgPSB2MV8xO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgdmVydGV4QXR0ckNvdW50ICsgb2Zmc2V0ICsgMiBdICAgICAgICAgPSB2Ml8xO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgXSAgICAgPSB2MF8yO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAxIF0gPSB2MV8yO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgKCAyICogdmVydGV4QXR0ckNvdW50ICkgKyBvZmZzZXQgKyAyIF0gPSB2Ml8yO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHZlcnRleENvdW50ID09PSA0ICkge1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2MCwgdjEsIHYyLCB2MF8xLCB2MV8xLCB2Ml8xLCB2MF8yLCB2MV8yLCB2Ml8yLCB2MF8zLCB2MV8zLCB2Ml8zICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIF92ZXJ0aWNlcyA9IHRoaXMudmVydGV4QXJyYXkudmVydGljZXM7XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIG9mZnNldCBdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gdjA7XG4gICAgICAgICAgICAgICAgX3ZlcnRpY2VzWyBvZmZzZXQgKyAxIF0gICAgICAgICAgICAgICAgICAgICAgICAgICA9IHYxO1xuICAgICAgICAgICAgICAgIF92ZXJ0aWNlc1sgb2Zmc2V0ICsgMiBdICAgICAgICAgICAgICAgICAgICAgICAgICAgPSB2MjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCBdICAgICAgICAgICAgID0gdjBfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCArIDEgXSAgICAgICAgID0gdjFfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbIHZlcnRleEF0dHJDb3VudCArIG9mZnNldCArIDIgXSAgICAgICAgID0gdjJfMTtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0IF0gICAgID0gdjBfMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMSBdID0gdjFfMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMiAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMiBdID0gdjJfMjtcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMyAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0IF0gICAgID0gdjBfMztcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMyAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMSBdID0gdjFfMztcbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggMyAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0ICsgMiBdID0gdjJfMztcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdVbnN1cHBvcnRlZCB2ZXJ0ZXhDb3VudD0nICsgdmVydGV4Q291bnQgKyAnIGZvciBwZXIgdmVydGV4IGF0dHJpYnV0ZSAoYWxsb3dlZCBpcyAxLCAzIG9yIDQpJyApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldF92MWZfdSAoIHZlcnRleENvdW50LCB2ZXJ0ZXhBdHRyQ291bnQsIG9mZnNldCApIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblxuICAgICAgICAgICAgdmFyIF92ZXJ0aWNlcyA9IHRoaXMudmVydGV4QXJyYXkudmVydGljZXM7XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHZlcnRleENvdW50OyArK2kgKSB7XG5cbiAgICAgICAgICAgICAgICBfdmVydGljZXNbICggaSAqIHZlcnRleEF0dHJDb3VudCApICsgb2Zmc2V0IF0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGNhbWVsaXplKCBuYW1lICkge1xuXG4gICAgICAgIHJldHVybiBuYW1lWyAwIF0udG9VcHBlckNhc2UoKSArIG5hbWUuc3Vic3RyKCAxICk7XG5cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZlcnRleE9iamVjdERlc2NyaXB0b3I7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoICcuLi91dGlscycgKTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sXG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yfSBkZXNjcmlwdG9yIC0gVmVydGV4IG9iamVjdCBkZXNjcmlwdG9yLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjYXBhY2l0eSAtIE1heGltdW0gbnVtYmVyIG9mIHZlcnRleCBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmVydGV4QXJyYXl9IFt2ZXJ0ZXhBcnJheV0gLSBWZXJ0ZXggYXJyYXkuXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBWZXJ0ZXhPYmplY3RQb29sICggZGVzY3JpcHRvciwgY2FwYWNpdHksIHZlcnRleEFycmF5ICkge1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHVibGljUk8oIHRoaXMsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3REZXNjcmlwdG9yfSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sI2Rlc2NyaXB0b3IgLSBWZXJ0ZXggb2JqZWN0IGRlc2NyaXB0b3IuXG4gICAgICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJ2Rlc2NyaXB0b3InIDogZGVzY3JpcHRvcixcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFBvb2wjY2FwYWNpdHkgLSBNYXhpbXVtIG51bWJlciBvZiB2ZXJ0ZXggb2JqZWN0cy5cbiAgICAgICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAnY2FwYWNpdHknIDogY2FwYWNpdHksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuVmVydGV4QXJyYXl9IFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFBvb2wjdmVydGV4QXJyYXkgLSBWZXJ0ZXggYXJyYXkuXG4gICAgICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJ3ZlcnRleEFycmF5JyA6ICggdmVydGV4QXJyYXkgIT0gbnVsbCA/IHZlcnRleEFycmF5IDogZGVzY3JpcHRvci5jcmVhdGVWZXJ0ZXhBcnJheSggY2FwYWNpdHkgKSApLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5jb3JlLlZlcnRleE9iamVjdH0gUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0UG9vbCNaRVJPIC0gVGhlICp6ZXJvKiB2ZXJ0ZXggb2JqZWN0LlxuICAgICAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICdaRVJPJyA6IGRlc2NyaXB0b3IuY3JlYXRlKCksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0fSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sI05FVyAtIFRoZSAqbmV3KiB2ZXJ0ZXggb2JqZWN0LlxuICAgICAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICdORVcnIDogZGVzY3JpcHRvci5jcmVhdGUoKVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNyZWF0ZVZlcnRleE9iamVjdHMoIHRoaXMgKTtcblxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBWZXJ0ZXhPYmplY3RQb29sLnByb3RvdHlwZSwge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFBvb2wjdXNlZENvdW50IC0gTnVtYmVyIG9mIGluLXVzZSB2ZXJ0ZXggb2JqZWN0cy5cbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICAndXNlZENvdW50Jzoge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZWRWT3MubGVuZ3RoO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3RQb29sI2F2YWlsYWJsZUNvdW50IC0gTnVtYmVyIG9mIGZyZWUgYW5kIHVudXNlZCB2ZXJ0ZXggb2JqZWN0cy5cbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICAnYXZhaWxhYmxlQ291bnQnOiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlVk9zLmxlbmd0aDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFBvb2wjYWxsb2NcbiAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgY2FwYWNpdHkgcmVhY2hlZCBhbmQgbm8gdmVydGV4IG9iamVjdCBpcyBhdmFpbGFibGUuXG4gICAgICogQHJldHVybiB7UGljaW1vLmNvcmUuVmVydGV4T2JqZWN0fVxuICAgICAqL1xuXG4gICAgVmVydGV4T2JqZWN0UG9vbC5wcm90b3R5cGUuYWxsb2MgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHZvID0gdGhpcy5hdmFpbGFibGVWT3Muc2hpZnQoKTtcblxuICAgICAgICBpZiAoIHZvID09PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJWZXJ0ZXhPYmplY3RQb29sIGNhcGFjaXR5KD1cIiArIHRoaXMuY2FwYWNpdHkgKyBcIikgcmVhY2hlZCFcIiApO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVzZWRWT3MucHVzaCggdm8gKTtcblxuICAgICAgICB2by52ZXJ0ZXhBcnJheS5jb3B5KCB0aGlzLk5FVy52ZXJ0ZXhBcnJheSApO1xuXG4gICAgICAgIHJldHVybiB2bztcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLmNvcmUuVmVydGV4T2JqZWN0UG9vbCNmcmVlXG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WZXJ0ZXhPYmplY3R9IHZvIC0gVGhlIHZlcnRleCBvYmplY3RcbiAgICAgKi9cblxuICAgIFZlcnRleE9iamVjdFBvb2wucHJvdG90eXBlLmZyZWUgPSBmdW5jdGlvbiAoIHZvICkge1xuXG4gICAgICAgIHZhciBpZHggPSB0aGlzLnVzZWRWT3MuaW5kZXhPZiggdm8gKTtcbiAgICAgICAgXG4gICAgICAgIGlmICggaWR4ID09PSAtMSApIHJldHVybjtcblxuICAgICAgICB2YXIgbGFzdElkeCA9IHRoaXMudXNlZFZPcy5sZW5ndGggLSAxO1xuXG4gICAgICAgIGlmICggaWR4ICE9PSBsYXN0SWR4ICkge1xuXG4gICAgICAgICAgICB2YXIgbGFzdCA9IHRoaXMudXNlZFZPc1sgbGFzdElkeCBdO1xuICAgICAgICAgICAgdm8udmVydGV4QXJyYXkuY29weSggbGFzdC52ZXJ0ZXhBcnJheSApO1xuXG4gICAgICAgICAgICB2YXIgdG1wID0gbGFzdC52ZXJ0ZXhBcnJheTtcbiAgICAgICAgICAgIGxhc3QudmVydGV4QXJyYXkgPSB2by52ZXJ0ZXhBcnJheTtcbiAgICAgICAgICAgIHZvLnZlcnRleEFycmF5ID0gdG1wO1xuXG4gICAgICAgICAgICB0aGlzLnVzZWRWT3Muc3BsaWNlKCBpZHgsIDEsIGxhc3QgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VkVk9zLnBvcCgpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVZPcy51bnNoaWZ0KCB2byApO1xuXG4gICAgICAgIHZvLnZlcnRleEFycmF5LmNvcHkoIHRoaXMuWkVSTy52ZXJ0ZXhBcnJheSApO1xuXG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gY3JlYXRlVmVydGV4T2JqZWN0cyggcG9vbCApIHtcblxuICAgICAgICBwb29sLmF2YWlsYWJsZVZPcyA9IFtdO1xuXG4gICAgICAgIHZhciB2ZXJ0ZXhBcnJheSwgdmVydGV4T2JqZWN0O1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHBvb2wuY2FwYWNpdHk7IGkrKyApIHtcblxuICAgICAgICAgICAgdmVydGV4QXJyYXkgPSBwb29sLnZlcnRleEFycmF5LnN1YmFycmF5KCBpICk7XG4gICAgICAgICAgICB2ZXJ0ZXhPYmplY3QgPSBwb29sLmRlc2NyaXB0b3IuY3JlYXRlKCB2ZXJ0ZXhBcnJheSApO1xuXG4gICAgICAgICAgICBwb29sLmF2YWlsYWJsZVZPcy5wdXNoKCB2ZXJ0ZXhPYmplY3QgKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcG9vbC51c2VkVk9zID0gW107XG5cbiAgICB9XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gVmVydGV4T2JqZWN0UG9vbDtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEFBQkIyID0gcmVxdWlyZSggXCIuL2FhYmIyXCIgKTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8uY29yZS5WaWV3cG9ydFxuICAgICAqIEBleHRlbmRzIFBpY2ltby5jb3JlLkFBQkIyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSB5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gd2lkdGhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gaGVpZ2h0XG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBWaWV3cG9ydCAoIHgsIHksIHdpZHRoLCBoZWlnaHQgKSB7XG5cbiAgICAgICAgdmFyIG1pbl94ID0gcGFyc2VJbnQoIHgsIDEwICk7XG4gICAgICAgIHZhciBtaW5feSA9IHBhcnNlSW50KCB5LCAxMCApO1xuXG4gICAgICAgIEFBQkIyLmNhbGwoIHRoaXMsXG4gICAgICAgICAgICAgICAgbWluX3gsICggbWluX3ggKyBwYXJzZUludCggd2lkdGgsIDEwICkgLSAxICksXG4gICAgICAgICAgICAgICAgbWluX3ksICggbWluX3kgKyBwYXJzZUludCggaGVpZ2h0LCAxMCApIC0gMSApICk7XG5cbiAgICB9XG5cbiAgICBWaWV3cG9ydC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBBQUJCMi5wcm90b3R5cGUgKTtcbiAgICBWaWV3cG9ydC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBWaWV3cG9ydDtcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIFZpZXdwb3J0LnByb3RvdHlwZSwge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5WaWV3cG9ydH0gUGljaW1vLmNvcmUuVmlld3BvcnQjeFxuICAgICAgICAgKi9cblxuICAgICAgICB4OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbl94O1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoIHggKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdyA9IHRoaXMud2lkdGg7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1pbl94ID0geDtcbiAgICAgICAgICAgICAgICB0aGlzLm1heF94ID0geCArIHcgLSAxO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5WaWV3cG9ydH0gUGljaW1vLmNvcmUuVmlld3BvcnQjeVxuICAgICAgICAgKi9cblxuICAgICAgICB5OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbl95O1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoIHkgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgaCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5taW5feSA9IHk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhfeSA9IHkgKyBoIC0gMTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLmNvcmUuVmlld3BvcnR9IFBpY2ltby5jb3JlLlZpZXdwb3J0I3dpZHRoXG4gICAgICAgICAqL1xuXG4gICAgICAgICd3aWR0aCc6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5tYXhfeCAtIHRoaXMubWluX3ggKyAxOyB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoIHcgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1heF94ID0gdGhpcy5taW5feCArIHcgLSAxO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uY29yZS5WaWV3cG9ydH0gUGljaW1vLmNvcmUuVmlld3BvcnQjaGVpZ2h0XG4gICAgICAgICAqL1xuXG4gICAgICAgICdoZWlnaHQnOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMubWF4X3kgLSB0aGlzLm1pbl95ICsgMTsgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCBoICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tYXhfeSA9IHRoaXMubWluX3kgKyBoIC0gMTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgIH0pO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFZpZXdwb3J0O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFBpY2ltb1xuICAgICAqL1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgQXBwICAgICA6IHJlcXVpcmUoICcuL2FwcCcgKSxcbiAgICAgICAgc2cgICAgICA6IHJlcXVpcmUoICcuL3NnJyApLFxuICAgICAgICB3ZWJnbCAgIDogcmVxdWlyZSggJy4vd2ViZ2wnICksXG4gICAgICAgIHV0aWxzICAgOiByZXF1aXJlKCAnLi91dGlscycgKSxcbiAgICAgICAgY29yZSAgICA6IHJlcXVpcmUoICcuL2NvcmUnICksXG4gICAgICAgIHNwcml0ZXMgOiByZXF1aXJlKCAnLi9zcHJpdGVzJyApXG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFBpY2ltby5zZ1xuICAgICAqIEBzdW1tYXJ5XG4gICAgICogU2NlbmUtZ3JhcGggcmVsYXRlZCBvYmplY3RzIGFuZCBjbGFzc2VzLlxuICAgICAqL1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgTm9kZTogcmVxdWlyZSggJy4vbm9kZScgKSxcbiAgICAgICAgTm9kZVN0YXRlOiByZXF1aXJlKCAnLi9ub2RlX3N0YXRlJyApXG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgICAgID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuICAgIHZhciBOb2RlU3RhdGUgPSByZXF1aXJlKCAnLi9ub2RlX3N0YXRlJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby5zZy5Ob2RlXG4gICAgICogQGNsYXNzZGVzY1xuICAgICAqIFRoZSBnZW5lcmljIGJhc2UgY2xhc3MgZm9yIGFsbCBzY2VuZSBncmFwaCBub2Rlcy5cbiAgICAgKlxuICAgICAqICMjIyBTdGF0ZXMgYW5kIEV2ZW50c1xuICAgICAqIDxpbWcgc3JjPVwiaW1hZ2VzL25vZGUtZXZlbnRzLnBuZ1wiIHNyY3NldD1cImltYWdlcy9ub2RlLWV2ZW50cy5wbmcgMXgsaW1hZ2VzL25vZGUtZXZlbnRzQDJ4LnBuZyAyeFwiIGFsdD1cIk5vZGUgRXZlbnRzIGFuZCBTdGF0ZXNcIj5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGljaW1vLkFwcH0gYXBwIC0gVGhlIGFwcCBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBUaGUgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZGlzcGxheT10cnVlXVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMucmVhZHk9dHJ1ZV1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5vbkluaXRdXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMub25Jbml0R2xdXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMub25SZXNpemVdXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMub25GcmFtZV1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5vblJlbmRlckZyYW1lXVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLm9uRnJhbWVFbmRdXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMub25EZXN0cm95XVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLm9uRGVzdHJveUdsXVxuICAgICAqXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBOb2RlICggYXBwLCBvcHRpb25zICkge1xuXG4gICAgICAgIGlmICggISBhcHAgKSB0aHJvdyBuZXcgRXJyb3IoICdbUGljaW1vLnNnLk5vZGVdIGFwcCBpcyBudWxsIScgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLkFwcH0gUGljaW1vLnNnLk5vZGUjYXBwIC0gVGhlIGFwcCBpbnN0YW5jZVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPKCB0aGlzLCAnYXBwJywgYXBwICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5zZy5Ob2RlU3RhdGV9IFBpY2ltby5zZy5Ob2RlI3N0YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0YXRlID0gbmV3IE5vZGVTdGF0ZSggTm9kZVN0YXRlLkNSRUFURSApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtib29sZWFufSBQaWNpbW8uc2cuTm9kZSNkaXNwbGF5XG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBJZiBzZXQgdG8gKmZhbHNlKiB0aGUgbm9kZSB3b24ndCBiZSByZW5kZXJlZC4gVGhlICpmcmFtZSosICpyZW5kZXJGcmFtZSogYW5kICpmcmFtZUVuZCogZXZlbnRzIHdvbid0IGJlIGVtaXR0ZWQuXG4gICAgICAgICAqIEJVVCBpbml0aWFsaXphdGlvbiB3aWxsIGJlIGhhcHBlbi4gKElmIHlvdSBkb24ndCB3YW50IHRoZSBub2RlIHRvIGluaXRpYWxpemUgc2V0IHRoZSAqcmVhZHkqIGF0dHJpYnV0ZSB0byAqZmFsc2UqKS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGlzcGxheSA9ICggISBvcHRpb25zICkgfHwgKCBvcHRpb25zLmRpc3BsYXkgIT09IGZhbHNlICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge1BpY2ltby5BcHB9IFBpY2ltby5zZy5Ob2RlI3BhcmVudCAtIFRoZSBwYXJlbnQgbm9kZS5cbiAgICAgICAgICovXG5cbiAgICAgICAgdGhpcy5fcmVhZHkgPSAoICEgb3B0aW9ucyApIHx8IG9wdGlvbnMucmVhZHkgIT09IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uc2cuTm9kZX0gUGljaW1vLnNnLk5vZGUjY2hpbGRyZW4gLSBUaGUgY2hpbGQgbm9kZXMgYXJyYXkuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG5cbiAgICBcbiAgICAgICAgdXRpbHMuY3VzdG9tX2V2ZW50LmV2ZW50aXplKCB0aGlzICk7XG5cbiAgICAgICAgaWYgKCBvcHRpb25zICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgIHRoaXMub24oIG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICAnb25Jbml0JyAgICAgICA6ICdpbml0JyxcbiAgICAgICAgICAgICAgICAnb25Jbml0R2wnICAgICA6ICdpbml0R2wnLFxuICAgICAgICAgICAgICAgICdvblJlc2l6ZScgICAgIDogJ3Jlc2l6ZScsXG4gICAgICAgICAgICAgICAgJ29uRnJhbWUnICAgICAgOiAnZnJhbWUnLFxuICAgICAgICAgICAgICAgICdvblJlbmRlckZyYW1lJzogJ3JlbmRlckZyYW1lJyxcbiAgICAgICAgICAgICAgICAnb25GcmFtZUVuZCcgICA6ICdmcmFtZUVuZCcsXG4gICAgICAgICAgICAgICAgJ29uRGVzdHJveUdsJyAgOiAnZGVzdHJveUdsJyxcbiAgICAgICAgICAgICAgICAnb25EZXN0cm95JyAgICA6ICdkZXN0cm95JyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLnNnLk5vZGUjYWRkQ2hpbGRcbiAgICAgKiBAcGFyYW0ge1BpY2ltby5zZy5Ob2RlfVxuICAgICAqL1xuICAgIE5vZGUucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKCBub2RlICkge1xuXG4gICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaCggbm9kZSApO1xuXG4gICAgICAgIG5vZGUucGFyZW50ID0gdGhpcztcblxuICAgICAgICByZXR1cm4gbm9kZTtcblxuICAgIH07XG5cbiAgICBOb2RlLnByb3RvdHlwZS5yZW5kZXJGcmFtZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAoICEgdGhpcy5yZWFkeSApIHJldHVybjtcblxuICAgICAgICBpZiAoIHRoaXMuc3RhdGUuaXMoIE5vZGVTdGF0ZS5DUkVBVEUgKSApIHtcblxuICAgICAgICAgICAgLy8gY3JlYXRlIC0+IGluaXRpYWxpemVcblxuICAgICAgICAgICAgb25Jbml0KCB0aGlzICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdGhpcy5zdGF0ZS5pcyggTm9kZVN0YXRlLlJFQURZICkgKSB7XG5cbiAgICAgICAgICAgIC8vIGluaXRpYWxpemUgLT4gcmVhZHkgdG8gcmVuZGVyXG5cbiAgICAgICAgICAgIC8vIFRPRE8gcmVzaXplXG5cbiAgICAgICAgICAgIGlmICggdGhpcy5kaXNwbGF5ICkge1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSXMgY2FsbGVkIG9ubHkgaWYgbm9kZSBpcyAqcmVhZHkqIGFuZCAqZGlzcGxheSotYWJsZS5cbiAgICAgICAgICAgICAgICAgICAgICogQGV2ZW50IFBpY2ltby5zZy5Ob2RlI2ZyYW1lXG4gICAgICAgICAgICAgICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCAnZnJhbWUnICk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElzIGNhbGxlZCBqdXN0IGFmdGVyIHRoZSAqZnJhbWUqIGV2ZW50IGFuZCBiZWZvcmUgdGhlICpmcmFtZUVuZCogZXZlbnQuIFRoZSAqcmVuZGVyIGNvbW1hbmRzKiBzaG91bGQgYmUgZ2VuZXJhdGVkIGhlcmUuXG4gICAgICAgICAgICAgICAgICAgICAqIEBldmVudCBQaWNpbW8uc2cuTm9kZSNyZW5kZXJGcmFtZVxuICAgICAgICAgICAgICAgICAgICAgKiBAbWVtYmVyb2YgUGljaW1vLnNnLk5vZGVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCggJ3JlbmRlckZyYW1lJyApO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoIGVyciApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCAnW2ZyYW1lLHJlbmRlckZyYW1lXScsIGVyciApO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgKytpICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5bIGkgXS5yZW5kZXJGcmFtZSgpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJcyBjYWxsZWQgYWZ0ZXIgdGhlIG9uICpmcmFtZSogYW5kICpyZW5kZXJGcmFtZSogZXZlbnRzLlxuICAgICAgICAgICAgICAgICAgICAgKiBAZXZlbnQgUGljaW1vLnNnLk5vZGUjZnJhbWVFbmRcbiAgICAgICAgICAgICAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoICdmcmFtZUVuZCcgKTtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKCBlcnIgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggJ1tmcmFtZUVuZF0nLCBlcnIgKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8uc2cuTm9kZSNkZXN0cm95XG4gICAgICovXG4gICAgTm9kZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiAoIHRoaXMuc3RhdGUuaXMoIE5vZGVTdGF0ZS5ERVNUUk9ZRUQgKSApIHJldHVybjtcblxuXG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyArK2kgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5bIGkgXS5kZXN0cm95KCk7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zZXQoIE5vZGVTdGF0ZS5ERVNUUk9ZRUQgKTtcblxuICAgICAgICBpZiAoIHRoaXMuX2luaXRpYWxpemVkICkge1xuXG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSXMgb25seSBjYWxsZWQgaWYgdGhlICppbml0KiBldmVudCBzdWNjZXNzZnVsbHkgcmVzb2x2ZWQuICpFdmVuIGlmIHRoZSAqaW5pdEdsKiBldmVudCBmYWlsZWQqLlxuICAgICAgICAgICAgICAgICAqIElzIGNhbGxlZCBiZWZvcmUgdGhlICpkZXN0cm95KiBldmVudC5cbiAgICAgICAgICAgICAgICAgKiBAZXZlbnQgUGljaW1vLnNnLk5vZGUjZGVzdHJveUdsXG4gICAgICAgICAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCAnZGVzdHJveUdsJyApO1xuXG4gICAgICAgICAgICB9IGNhdGNoICggZXJyICkge1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciggJ1tkZXN0cm95R2xdJywgZXJyICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElzIG9ubHkgY2FsbGVkIGlmIHRoZSAqaW5pdCogZXZlbnQgc3VjY2Vzc2Z1bGx5IHJlc29sdmVkIGFuZCBqdXN0IGFmdGVyIHRoZSAqZGVzdHJveUdsKiBldmVudC5cbiAgICAgICAgICAgICAgICAgKiBAZXZlbnQgUGljaW1vLnNnLk5vZGUjZGVzdHJveVxuICAgICAgICAgICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCggJ2Rlc3Ryb3knICk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKCBlcnIgKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCAnW2Rlc3Ryb3ldJywgZXJyICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gb25Jbml0ICggbm9kZSApIHtcblxuICAgICAgICBub2RlLnN0YXRlLnNldCggTm9kZVN0YXRlLklOSVQgKTtcblxuICAgICAgICB2YXIgaW5pdFByb21pc2VzID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGlzIGlzIHRoZSBmaXJzdCBldmVudC4gSXMgY2FsbGVkIG9ubHkgb25jZS5cbiAgICAgICAgICAgICAqIEBldmVudCBQaWNpbW8uc2cuTm9kZSNpbml0XG4gICAgICAgICAgICAgKiBAbWVtYmVyb2YgUGljaW1vLnNnLk5vZGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbm9kZS5lbWl0KCAnaW5pdCcsIG1ha2VEb25lRnVuYyggaW5pdFByb21pc2VzLCBub2RlICkgKTtcblxuICAgICAgICAgICAgdXRpbHMuUHJvbWlzZS5hbGwoIGluaXRQcm9taXNlcyApLnRoZW4oIG9uSW5pdEdsLmJpbmQoIG5vZGUsIG5vZGUgKSwgb25GYWlsLmJpbmQoIG5vZGUsIG5vZGUgKSApO1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlcnIgKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoICdbaW5pdF0nLCBlcnIgKTtcblxuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uSW5pdEdsICggbm9kZSApIHtcblxuICAgICAgICBub2RlLl9pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKCAhIG5vZGUucmVhZHkgKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGluaXRHbFByb21pc2VzID0gW107XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJcyBjYWxsZWQganVzdCBhZnRlciAqaW5pdCouIFNob3VsZCBvbmx5IGJlIHVzZWQgdG8gcGVyZm9ybSB3ZWJnbCByZWxhdGVkIHRhc2tzLlxuICAgICAgICAgICAgICogQGV2ZW50IFBpY2ltby5zZy5Ob2RlI2luaXRHbFxuICAgICAgICAgICAgICogQG1lbWJlcm9mIFBpY2ltby5zZy5Ob2RlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG5vZGUuZW1pdCggJ2luaXRHbCcsIG1ha2VEb25lRnVuYyggaW5pdEdsUHJvbWlzZXMsIG5vZGUgKSApO1xuXG4gICAgICAgICAgICB1dGlscy5Qcm9taXNlLmFsbCggaW5pdEdsUHJvbWlzZXMgKS50aGVuKCBvbkluaXREb25lLmJpbmQoIG5vZGUsIG5vZGUgKSwgb25GYWlsLmJpbmQoIG5vZGUsIG5vZGUgKSApO1xuXG4gICAgICAgIH0gY2F0Y2ggKCBlcnIgKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoICdbaW5pdEdsXScsIGVyciApO1xuXG4gICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uSW5pdERvbmUgKCBub2RlICkge1xuXG4gICAgICAgIGlmICggbm9kZS5yZWFkeSApIHtcblxuICAgICAgICAgICAgbm9kZS5zdGF0ZS5zZXQoIE5vZGVTdGF0ZS5SRUFEWSApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VEb25lRnVuYyAoIGFyciApIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCBwcm9taXNlICkge1xuXG4gICAgICAgICAgICBpZiAoIHByb21pc2UgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBwcm9taXNlID09PSAnZnVuY3Rpb24nICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBuZXcgdXRpbHMuUHJvbWlzZSggcHJvbWlzZSApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goIHByb21pc2UgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkZhaWwgKCBub2RlICkge1xuXG4gICAgICAgIGlmICggbm9kZS5yZWFkeSApIHtcblxuICAgICAgICAgICAgbm9kZS5zdGF0ZS5zZXQoIE5vZGVTdGF0ZS5FUlJPUiApO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggTm9kZS5wcm90b3R5cGUsIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLnNnLk5vZGV9IFBpY2ltby5zZy5Ob2RlI2lzUm9vdCAtICpUcnVlKiBpZiB0aGlzIG5vZGUgaGFzIG5vIHBhcmVudC5cbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICAnaXNSb290Jzoge1xuICAgICAgICBcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gISB0aGlzLnBhcmVudDsgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtib29sZWFufSBQaWNpbW8uc2cuTm9kZSNyZWFkeVxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogQSBub2RlIGlzdCAqbm90KiByZWFkeSBpZiAuLlxuICAgICAgICAgKiAxLiB0aGUgc3RhdGUgaXMgc2V0IHRvICpkZXN0cm95ZWQqIG9yICplcnJvcipcbiAgICAgICAgICogMy4geW91IGV4cGxpY2l0bHkgc2V0IGl0IHRvICpmYWxzZSogKGJ1dCBkZWZhdWx0IGlzICp0cnVlKilcbiAgICAgICAgICovXG4gICAgICAgICdyZWFkeSc6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKCAoICEhIHRoaXMuX3JlYWR5ICkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICggISB0aGlzLnN0YXRlLmlzKCBOb2RlU3RhdGUuRVJST1J8Tm9kZVN0YXRlLkRFU1RST1lFRCApKSApO1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggcmVhZHkgKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9yZWFkeSA9ICEhIHJlYWR5O1xuXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG5cbiAgICAgICAgfVxuXG4gICAgfSk7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gTm9kZTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby5zZy5Ob2RlU3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2luaXRpYWxWYWx1ZT0wXSAtIFRoZSBpbml0aWFsIHN0YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gTm9kZVN0YXRlICggaW5pdGlhbFZhbHVlICkge1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSBpbml0aWFsVmFsdWUgfCAwO1xuXG4gICAgICAgIE9iamVjdC5zZWFsKCB0aGlzICk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby5zZy5Ob2RlU3RhdGUjaXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdGVcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICogc3RhdGUuaXMoIE5vZGVTdGF0ZS5DUkVBVEUgfCBOb2RlU3RhdGUuSU5JVCApXG4gICAgICovXG4gICAgTm9kZVN0YXRlLnByb3RvdHlwZS5pcyA9IGZ1bmN0aW9uICggc3RhdGUgKSB7XG5cbiAgICAgICAgcmV0dXJuICggdGhpcy52YWx1ZSAmICggc3RhdGUgfCAwICkgKSA+IDA7IC8vPT09IHN0YXRlO1xuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLnNnLk5vZGVTdGF0ZSNzZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhdGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHN0YXRlLnNldCggTm9kZVN0YXRlLlJFQURZIClcbiAgICAgKiBAcmV0dXJuICpzZWxmKlxuICAgICAqL1xuICAgIE5vZGVTdGF0ZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKCBzdGF0ZSApIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gc3RhdGUgfCAwO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cbiAgICBOb2RlU3RhdGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzdGF0ZXMgPSBbXTtcblxuICAgICAgICBpZiAoIHRoaXMuaXMoIE5vZGVTdGF0ZS5DUkVBVEUgKSApIHN0YXRlcy5wdXNoKCAnQ1JFQVRFJyApO1xuICAgICAgICBpZiAoIHRoaXMuaXMoIE5vZGVTdGF0ZS5JTklUICkgKSBzdGF0ZXMucHVzaCggJ0lOSVQnICk7XG4gICAgICAgIGlmICggdGhpcy5pcyggTm9kZVN0YXRlLlJFQURZICkgKSBzdGF0ZXMucHVzaCggJ1JFQURZJyApO1xuICAgICAgICBpZiAoIHRoaXMuaXMoIE5vZGVTdGF0ZS5FUlJPUiApICkgc3RhdGVzLnB1c2goICdFUlJPUicgKTtcbiAgICAgICAgaWYgKCB0aGlzLmlzKCBOb2RlU3RhdGUuREVTVFJPWUVEICkgKSBzdGF0ZXMucHVzaCggJ0RFU1RST1lFRCcgKTtcblxuICAgICAgICByZXR1cm4gXCJbXCIgKyBzdGF0ZXMuam9pbiggXCIsXCIgKSArIFwiXVwiO1xuXG4gICAgfTtcblxuXG4gICAgdXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnRpZXNQdWJsaWNSTyggTm9kZVN0YXRlLCB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVN0YXRlXG4gICAgICAgICAqIEBjb25zdGFudFxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqL1xuICAgICAgICBDUkVBVEUgOiAxLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyb2YgUGljaW1vLnNnLk5vZGVTdGF0ZVxuICAgICAgICAgKiBAY29uc3RhbnRcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgSU5JVCA6IDIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVN0YXRlXG4gICAgICAgICAqIEBjb25zdGFudFxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqL1xuICAgICAgICBSRUFEWSA6IDQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVN0YXRlXG4gICAgICAgICAqIEBjb25zdGFudFxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqL1xuICAgICAgICBFUlJPUiA6IDgsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXJvZiBQaWNpbW8uc2cuTm9kZVN0YXRlXG4gICAgICAgICAqIEBjb25zdGFudFxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqL1xuICAgICAgICBERVNUUk9ZRUQgOiAxNlxuXG4gICAgfSk7XG5cblxuICAgIE9iamVjdC5mcmVlemUoIE5vZGVTdGF0ZSApO1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IE5vZGVTdGF0ZTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBQaWNpbW8uc3ByaXRlc1xuICAgICAqL1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICAgICAgU3ByaXRlICAgICAgICAgICA6IHJlcXVpcmUoICcuL3Nwcml0ZScgKSxcbiAgICAgICAgU3ByaXRlRGVzY3JpcHRvciA6IHJlcXVpcmUoICcuL3Nwcml0ZV9kZXNjcmlwdG9yJyApXG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU3ByaXRlRGVzY3JpcHRvciA9IHJlcXVpcmUoICcuL3Nwcml0ZV9kZXNjcmlwdG9yJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby5zcHJpdGVzLlNwcml0ZVxuICAgICAqIEBleHRlbmRzIFBpY2ltby5jb3JlLlZlcnRleE9iamVjdFxuICAgICAqIEBjbGFzc2Rlc2NcbiAgICAgKiBUaGUgZGVmYXVsdCBzcHJpdGUgY2xhc3MuXG4gICAgICogQHBhcmFtIHtQaWNpbW8uY29yZS5WZXJ0ZXhBcnJheX0gW3ZlcnRleEFycmF5XSAtIFZlcnRleCBhcnJheS5cbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIFNwcml0ZSAoKSB7XG5cbiAgICAgICAgcmV0dXJuIFNwcml0ZURlc2NyaXB0b3IuY3JlYXRlLmFwcGx5KCBTcHJpdGVEZXNjcmlwdG9yLCBhcmd1bWVudHMgKTtcbiAgICBcbiAgICB9XG5cbiAgICBTcHJpdGUucHJvdG90eXBlID0gU3ByaXRlRGVzY3JpcHRvci5wcm90bztcbiAgICBTcHJpdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ByaXRlO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBjb3JlID0gcmVxdWlyZSggXCIuLi9jb3JlXCIgKTtcblxuICAgIHZhciBTcHJpdGVEZXNjcmlwdG9yID0gbmV3IGNvcmUuVmVydGV4T2JqZWN0RGVzY3JpcHRvcihcblxuICAgICAgICBudWxsLFxuXG4gICAgICAgIDQsXG4gICAgICAgIDEyLFxuXG4gICAgICAgIFtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzZXRQb3NpdGlvblxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHgwIC0geDBcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MCAtIHkwXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gejAgLSB6MFxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHgxIC0geDFcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIHkxXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gejEgLSB6MVxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHgyIC0geDJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIHkyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gejIgLSB6MlxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHgzIC0geDNcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MyAtIHkzXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gejMgLSB6M1xuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN4MCAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3kwICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjejAgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN4MSAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3kxICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjejEgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN4MiAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3kyICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjejIgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN4MyAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3kzICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjejMgKi9cblxuICAgICAgICAgICAgeyBuYW1lOiAncG9zaXRpb24nLCBzaXplOiAzLCBhdHRyTmFtZXM6IFsgJ3gnLCAneScsICd6JyBdIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjcm90YXRlIC0gcm90YXRpb24gKHJhZGlhbilcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICB7IG5hbWU6ICdyb3RhdGUnLCBzaXplOiAxLCB1bmlmb3JtOiB0cnVlIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjc2V0VGV4Q29vcmRzXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gczAgLSBzMFxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHQwIC0gdDBcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzMSAtIHMxXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdDEgLSB0MVxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHMyIC0gczJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0MiAtIHQyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gczMgLSBzM1xuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHQzIC0gdDNcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjczAgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN0MCAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3MxICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjdDEgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzMiAqL1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3QyICovXG4gICAgICAgICAgICAvKiogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjczMgKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN0MyAqL1xuXG4gICAgICAgICAgICB7IG5hbWU6ICd0ZXhDb29yZHMnLCBzaXplOiAyLCBhdHRyTmFtZXM6IFsgJ3MnLCAndCcgXSB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZXRob2QgUGljaW1vLnNwcml0ZXMuU3ByaXRlI3NldFRyYW5zbGF0ZVxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHR4IC0gdHhcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0eSAtIHR5XG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLyoqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3R4IC0gdHJhbnNsYXRlIHggKi9cbiAgICAgICAgICAgIC8qKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSN0eSAtIHRyYW5zbGF0ZSB5ICovXG5cbiAgICAgICAgICAgIHsgbmFtZTogJ3RyYW5zbGF0ZScsIHNpemU6IDIsIHVuaWZvcm06IHRydWUsIGF0dHJOYW1lczogWyAndHgnLCAndHknIF0gfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzY2FsZSAtIHNjYWxlXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgeyBuYW1lOiAnc2NhbGUnLCBzaXplOiAxLCB1bmlmb3JtOiB0cnVlIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjb3BhY2l0eSAtIG9wYWNpdHlcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICB7IG5hbWU6ICdvcGFjaXR5Jywgc2l6ZTogMSwgdW5pZm9ybTogdHJ1ZSB9XG5cbiAgICAgICAgXSxcblxuICAgICAgICB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1ldGhvZCBQaWNpbW8uc3ByaXRlcy5TcHJpdGUjc2V0UG9zMmRcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MCAtIHgwXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geTAgLSB5MFxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHgxIC0geDFcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIHkxXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geDIgLSB4MlxuICAgICAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHkyIC0geTJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MyAtIHgzXG4gICAgICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0geTMgLSB5M1xuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHBvczJkOiB7IHNpemU6IDIsIG9mZnNldDogMCB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLnNwcml0ZXMuU3ByaXRlI3Bvc1pcbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBwb3NaOiAgeyBzaXplOiAxLCBvZmZzZXQ6IDIsIHVuaWZvcm06IHRydWUgfSxcblxuICAgICAgICAgICAgdXY6ICAgICd0ZXhDb29yZHMnXG5cbiAgICAgICAgfVxuXG4gICAgKTtcblxuICAgIHJlcXVpcmUoICcuL3Nwcml0ZV9oZWxwZXJzJyApKCBTcHJpdGVEZXNjcmlwdG9yLnByb3RvICk7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNwcml0ZURlc2NyaXB0b3I7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBTcHJpdGVfcHJvdG90eXBlICkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzZXRUZXhDb29yZHNCeVZpZXdwb3J0XG4gICAgICAgICAqIEBwYXJhbSB7UGljaW1vLmNvcmUuVmlld3BvcnR9IHZpZXdwb3J0IC0gdmlld3BvcnRcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHRleHR1cmVXaWR0aCAtIHRleHR1cmUgd2lkdGhcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHRleHR1cmVIZWlnaHQgLSB0ZXh0dXJlIGhlaWdodFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gW3JlcGVhdF0gLSB0ZXh0dXJlIHJlcGVhdCBmYWN0b3JcbiAgICAgICAgICovXG5cbiAgICAgICAgU3ByaXRlX3Byb3RvdHlwZS5zZXRUZXhDb29yZHNCeVZpZXdwb3J0ID0gZnVuY3Rpb24gKCB2aWV3cG9ydCwgdGV4dHVyZVdpZHRoLCB0ZXh0dXJlSGVpZ2h0LCByZXBlYXQgKSB7XG5cbiAgICAgICAgICAgIHZhciB4MCA9IHZpZXdwb3J0LnggPT09IDAgPyAwIDogKCB2aWV3cG9ydC54IC8gdGV4dHVyZVdpZHRoICk7XG4gICAgICAgICAgICB2YXIgeDEgPSAoIHZpZXdwb3J0LnggKyB2aWV3cG9ydC53aWR0aCApIC8gdGV4dHVyZVdpZHRoO1xuICAgICAgICAgICAgdmFyIHkwID0gMSAtICggKCB2aWV3cG9ydC55ICsgdmlld3BvcnQuaGVpZ2h0ICkgLyB0ZXh0dXJlSGVpZ2h0ICk7XG4gICAgICAgICAgICB2YXIgeTEgPSB2aWV3cG9ydC55ID09PSAwID8gMSA6IDEgLSAoIHZpZXdwb3J0LnkgLyB0ZXh0dXJlSGVpZ2h0ICk7XG5cbiAgICAgICAgICAgIGlmICggcmVwZWF0ICE9PSB1bmRlZmluZWQgKSB7XG5cbiAgICAgICAgICAgICAgICB4MCAqPSByZXBlYXQ7XG4gICAgICAgICAgICAgICAgeDEgKj0gcmVwZWF0O1xuICAgICAgICAgICAgICAgIHkwICo9IHJlcGVhdDtcbiAgICAgICAgICAgICAgICB5MSAqPSByZXBlYXQ7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXRUZXhDb29yZHMoXG4gICAgICAgICAgICAgICAgeDAsIHkwLFxuICAgICAgICAgICAgICAgIHgxLCB5MCxcbiAgICAgICAgICAgICAgICB4MSwgeTEsXG4gICAgICAgICAgICAgICAgeDAsIHkxICk7XG5cbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIFBpY2ltby5zcHJpdGVzLlNwcml0ZSNzZXRQb3NpdGlvbkJ5U2l6ZVxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSB3aWR0aFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gaGVpZ2h0XG4gICAgICAgICAqL1xuXG4gICAgICAgIFNwcml0ZV9wcm90b3R5cGUuc2V0UG9zaXRpb25CeVNpemUgPSBmdW5jdGlvbiAoIHdpZHRoLCBoZWlnaHQgKSB7XG5cbiAgICAgICAgICAgIHZhciBoYWxmX3dpZHRoICA9IHdpZHRoICAqIDAuNTtcbiAgICAgICAgICAgIHZhciBoYWxmX2hlaWdodCA9IGhlaWdodCAqIDAuNTtcblxuICAgICAgICAgICAgdGhpcy5zZXRQb3MyZChcbiAgICAgICAgICAgICAgICAgICAgLWhhbGZfd2lkdGgsIC1oYWxmX2hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgIGhhbGZfd2lkdGgsIC1oYWxmX2hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgIGhhbGZfd2lkdGgsICBoYWxmX2hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgLWhhbGZfd2lkdGgsICBoYWxmX2hlaWdodFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLlNwcml0ZSNyb3RhdGVEZWdyZWUgLSByb3RhdGlvbiBpbiBkZWdyZWVcbiAgICAgICAgICovXG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBTcHJpdGVfcHJvdG90eXBlLCAncm90YXRlRGVncmVlJywge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yb3RhdGUgKiAxODAuMCAvIE1hdGguUEk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggZGVncmVlICkge1xuICAgICAgICAgICAgICAgIHRoaXMucm90YXRlID0gZGVncmVlICogKCBNYXRoLlBJIC8gMTgwLjAgKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRkR2x4UHJvcGVydHkob2JqKSB7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgICAgICBvYmosIHtcbiAgICAgICAgICAgICAgICBnbHg6IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbihnbHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dseCA9IGdseDtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZ2wnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICggdHlwZW9mIGdseCA9PT0gJ29iamVjdCcgPyBnbHguZ2wgOiB1bmRlZmluZWQgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2x4O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIG9iamVjdF91dGlscyA9IHJlcXVpcmUoICcuL29iamVjdF91dGlscycgKTtcblxuICAgIHZhciBVSUQgPSAwO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhZGRVaWQoIG9iaiApIHtcblxuICAgICAgICBvYmplY3RfdXRpbHMuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyggb2JqLCAndWlkJywgKCArK1VJRCApICk7XG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgKGZ1bmN0aW9uKGFwaSkge1xuXG4gICAgICAgIF9kZWZpbmVQdWJsaWNQcm9wZXJ0eVJPKGFwaSwgJ1ZFUlNJT04nLCBcIjAuMTAuMlwiKTtcblxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gZXZlbnRpemUoIG9iamVjdCApXG4gICAgICAgIC8vXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICAgIGFwaS5ldmVudGl6ZSA9IGZ1bmN0aW9uKG8pIHtcblxuICAgICAgICAgICAgX2RlZmluZUhpZGRlblByb3BlcnR5Uk8obywgJ19jYWxsYmFja3MnLCB7IF9pZDogMCB9KTtcblxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBvYmplY3Qub24oIGV2ZW50TmFtZSwgWyBwcmlvLCBdIGNhbGxiYWNrIClcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICBvLm9uID0gZnVuY3Rpb24oZXZlbnROYW1lLCBwcmlvLCBmbikge1xuXG4gICAgICAgICAgICAgICAgLy8gVE9ETyBjcmVhdGUgb3duIGJpbmQoKSBtZXRob2RcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0TGlzdGVuZXJGcm9tT3B0aW9ucyh0aGlzLCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm4gPSBwcmlvO1xuICAgICAgICAgICAgICAgICAgICBwcmlvID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRMaXN0ZW5lciA9IHRoaXMuX2NhbGxiYWNrc1tldmVudE5hbWVdIHx8ICh0aGlzLl9jYWxsYmFja3NbZXZlbnROYW1lXSA9IFtdKVxuICAgICAgICAgICAgICAgICAgLCBsaXN0ZW5lcklkID0gKyt0aGlzLl9jYWxsYmFja3MuX2lkXG4gICAgICAgICAgICAgICAgICA7XG5cbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBfZGVmaW5lUHVibGljUHJvcGVydGllc1JPKHt9LCB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBsaXN0ZW5lcklkLFxuICAgICAgICAgICAgICAgICAgICBmbjogZm4sXG4gICAgICAgICAgICAgICAgICAgIHByaW86IChwcmlvfHwwKSxcbiAgICAgICAgICAgICAgICAgICAgaXNGdW5jdGlvbjogKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGV2ZW50TGlzdGVuZXIucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgZXZlbnRMaXN0ZW5lci5zb3J0KHNvcnRMaXN0ZW5lckJ5UHJpbyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdGVuZXJJZDtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gc29ydExpc3RlbmVyQnlQcmlvKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYi5wcmlvIC0gYS5wcmlvO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIG9iamVjdC5vbmNlKCBldmVudE5hbWUsIFsgcHJpbywgXSBjYWxsYmFjayApXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgby5vbmNlID0gZnVuY3Rpb24oZXZlbnROYW1lLCBwcmlvLCBmbikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm4gPSBwcmlvO1xuICAgICAgICAgICAgICAgICAgICBwcmlvID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbGlkID0gby5vbihldmVudE5hbWUsIHByaW8sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBvLm9mZihsaWQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBsaWQ7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIG9iamVjdC5vZmYoIGlkIClcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICBvLm9mZiA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNiLCBpLCBqLCBfY2FsbGJhY2tzLCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fY2FsbGJhY2tzKTtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2tleXNbal1dO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgX2NhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IgPSBfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNiLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gb2JqZWN0LmVtaXQoIGV2ZW50TmFtZSBbLCBhcmd1bWVudHMgLi4gXSApXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgby5lbWl0ID0gZnVuY3Rpb24oZXZlbnROYW1lIC8qLCBhcmd1bWVudHMgLi4qLykge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICB2YXIgX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIHZhciBpLCBsZW4sIGNiO1xuICAgICAgICAgICAgICAgIGlmIChfY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbiA9IF9jYWxsYmFja3MubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiID0gX2NhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYi5pc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLmZuLmVtaXQoZXZlbnROYW1lLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gb2JqZWN0LmVtaXRSZWR1Y2UoIGV2ZW50TmFtZSBbLCBhcmd1bWVudHMgLi4gXSApXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgby5lbWl0UmVkdWNlID0gZnVuY3Rpb24oZXZlbnROYW1lIC8qLCB2YWx1ZSwgW2FyZ3VtZW50cyAuLl0gKi8pIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgdmFyIF9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnROYW1lXTtcbiAgICAgICAgICAgICAgICB2YXIgaSwgbGVuLCBjYjtcbiAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKHt9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF9jYWxsYmFja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuID0gX2NhbGxiYWNrcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IgPSBfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc1swXSA9IGNiLmlzRnVuY3Rpb24gPyBjYi5mbi5hcHBseSh0aGlzLCBhcmdzKSA6IGNiLmZuLmVtaXRSZWR1Y2UoZXZlbnROYW1lLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYXJnc1swXTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBvO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvL1xuICAgICAgICAvLyBzZXRMaXN0ZW5lckZyb21PcHRpb25zXG4gICAgICAgIC8vXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIC5vbiggb3B0aW9ucywgeyBvblByb2plY3Rpb25VcGRhdGVkOiBbMTAwLCAncHJvamVjdGlvblVwZGF0ZWQnXSwgb25GcmFtZTogJ2ZyYW1lJywgb25GcmFtZUVuZDogJ2ZyYW1lRW5kJyB9IClcblxuICAgICAgICBmdW5jdGlvbiBzZXRMaXN0ZW5lckZyb21PcHRpb25zKG9iaiwgb3B0aW9ucywgbGlzdGVuZXJNYXApIHtcblxuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSwgbGlzdGVuTmFtZSwgbGlzdGVuRnVuYywgcHJpbztcblxuICAgICAgICAgICAgZm9yIChsaXN0ZW5OYW1lIGluIGxpc3RlbmVyTWFwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyTWFwLmhhc093blByb3BlcnR5KGxpc3Rlbk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbkZ1bmMgPSBvcHRpb25zW2xpc3Rlbk5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxpc3RlbkZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IGxpc3RlbmVyTWFwW2xpc3Rlbk5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW8gPSBldmVudE5hbWVbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lID0gZXZlbnROYW1lWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlwqB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpbyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoub24oZXZlbnROYW1lLCBwcmlvLCBsaXN0ZW5GdW5jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vXG4gICAgICAgIC8vIGhlbHBlciBmdW5jdGlvbnNcbiAgICAgICAgLy9cbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgZnVuY3Rpb24gX2RlZmluZVB1YmxpY1Byb3BlcnR5Uk8ob2JqLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgICAgICAgICAgIHZhbHVlICAgICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZSAgIDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2RlZmluZVB1YmxpY1Byb3BlcnRpZXNSTyhvYmosIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgaSwga2V5cyA9IE9iamVjdC5rZXlzKGF0dHJzKTtcbiAgICAgICAgICAgIGZvciAoaSA9IGtleXMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgX2RlZmluZVB1YmxpY1Byb3BlcnR5Uk8ob2JqLCBrZXlzW2ldLCBhdHRyc1trZXlzW2ldXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2RlZmluZUhpZGRlblByb3BlcnR5Uk8ob2JqLCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgICAgICAgICAgIHZhbHVlICAgICAgICA6IHZhbHVlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZSA6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgfSkobW9kdWxlLmV4cG9ydHMpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUHJvbWlzZSAgICAgID0gcmVxdWlyZSggJy4vcHJvbWlzZScgKTtcbiAgICB2YXIgb2JqZWN0X3V0aWxzID0gcmVxdWlyZSggJy4vb2JqZWN0X3V0aWxzJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby51dGlscy5EZWZlcnJlZFxuICAgICAqIEBzdW1tYXJ5XG4gICAgICogQSBzaW1wbGUgYW5kIGdlbmVyaWMgZGVmZXJyZWQgaW50ZXJmYWNlLlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gRGVmZXJyZWQgKCBvYmogKSB7XG5cbiAgICAgICAgb2JqZWN0X3V0aWxzLmRlZmluZVByb3BlcnR5UHJpdmF0ZVJPKCB0aGlzLCAnX29iaicsIG9iaiApO1xuXG4gICAgICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gdGhpcztcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLnV0aWxzLlByb21pc2V9IFBpY2ltby51dGlscy5EZWZlcnJlZCNwcm9taXNlXG4gICAgICAgICAqL1xuXG4gICAgICAgIG9iamVjdF91dGlscy5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPKCB0aGlzLCAncHJvbWlzZScsIG5ldyBQcm9taXNlKCBmdW5jdGlvbiAoIHJlc29sdmUgKSB7XG5cbiAgICAgICAgICAgIG9iamVjdF91dGlscy5kZWZpbmVQcm9wZXJ0eVByaXZhdGUoIGRlZmVycmVkLCAnX3Jlc29sdmUnLCByZXNvbHZlICk7XG5cbiAgICAgICAgfSkpO1xuXG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIERlZmVycmVkLnByb3RvdHlwZSwge1xuICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7Ym9vbGVhbn0gUGljaW1vLnV0aWxzLkRlZmVycmVkI3JlYWR5XG4gICAgICAgICAqL1xuXG4gICAgICAgICdyZWFkeSc6IHtcblxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9yZWFkeTsgfSxcblxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAoIHJlYWR5ICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCAhIHRoaXMuX3JlYWR5ICYmICEhIHJlYWR5ICkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMuX3Jlc29sdmUgKSB7XG4gICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlKCB0aGlzLl9vYmogKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhISB0aGlzLl9yZWFkeSAmJiAhIHJlYWR5ICkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgfVxuICAgIFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8udXRpbHMuRGVmZXJyZWQjdGhlblxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG5cbiAgICBEZWZlcnJlZC5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG5cbiAgICAgICAgaWYgKCB0aGlzLnJlYWR5ICkge1xuXG4gICAgICAgICAgICBjYWxsYmFjayggdGhpcy5fb2JqICk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5wcm9taXNlLnRoZW4oIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBkZWZlcnJlZC5fb2JqICk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby51dGlscy5EZWZlcnJlZCNmb3J3YXJkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5TmFtZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG5cbiAgICBEZWZlcnJlZC5wcm90b3R5cGUuZm9yd2FyZCA9IGZ1bmN0aW9uICggcHJvcGVydHlOYW1lLCBjYWxsYmFjayApIHtcblxuICAgICAgICB0aGlzLnRoZW4oIGZ1bmN0aW9uICggc2VsZiApIHtcblxuICAgICAgICAgICAgY2FsbGJhY2soIHNlbGZbIHByb3BlcnR5TmFtZSBdICk7XG4gICAgICAgIFxuICAgICAgICB9KTtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBQaWNpbW8udXRpbHMuRGVmZXJyZWRcbiAgICAgKiBAZnVuY3Rpb24gbWFrZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHJldHVybiBvYmpcbiAgICAgKi9cbiAgICBEZWZlcnJlZC5tYWtlID0gZnVuY3Rpb24gKCBvYmogKSB7XG5cbiAgICAgICAgb2JqZWN0X3V0aWxzLmRlZmluZVByb3BlcnR5UHVibGljUk8oIG9iaiwgJ2RlZmVycmVkJywgbmV3IERlZmVycmVkKCBvYmogKSApO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgUGljaW1vLnV0aWxzLkRlZmVycmVkXG4gICAgICogQGZ1bmN0aW9uIHRoZW5cbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgRGVmZXJyZWQudGhlbiA9IGZ1bmN0aW9uICggb2JqLCBjYWxsYmFjayApIHtcblxuICAgICAgICBpZiAoIG9iai5kZWZlcnJlZCAhPT0gdW5kZWZpbmVkICkge1xuXG4gICAgICAgICAgICBvYmouZGVmZXJyZWQudGhlbiggY2FsbGJhY2sgKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjYWxsYmFjayggb2JqICk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBEZWZlcnJlZDtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBQaWNpbW8udXRpbHNcbiAgICAgKiBAc3VtbWFyeVxuICAgICAqIEhlbHBlciBmdW5jdGlvbnMsIHV0aWxpdGllcyBhbmQgM3JkLXBhcnR5IGxpYnJhcmllcy5cbiAgICAgKi9cblxuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgICAgIGN1c3RvbV9ldmVudCA6IHJlcXVpcmUoICcuL2N1c3RvbV9ldmVudCcgKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWVzcGFjZSBQaWNpbW8udXRpbHMub2JqZWN0XG4gICAgICAgICAqIEBzdW1tYXJ5XG4gICAgICAgICAqIEdlbmVyaWMgb2JqZWN0IGFuZCBwcm9wZXJ0aWVzIGhlbHBlciBmdW5jdGlvbnMuXG4gICAgICAgICAqL1xuICAgICAgICBvYmplY3QgOiByZXF1aXJlKCAnLi9vYmplY3RfdXRpbHMnICksXG5cbiAgICAgICAgRGVmZXJyZWQgOiByZXF1aXJlKCAnLi9kZWZlcnJlZCcgKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNsYXNzIFBpY2ltby51dGlscy5NYXBcbiAgICAgICAgICpcbiAgICAgICAgICogQHN1bW1hcnlcbiAgICAgICAgICogICBFUzYgTWFwXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiAgIEFuIEVTNiBNYXAgSW1wbGVtZW50YXRpb24uXG4gICAgICAgICAqICAgVGhpcyBpcyB0aGUgKm5hdGl2ZSogSW1wbGVtZW50YXRpb24gb2YgeW91ciBqYXZhc2NyaXB0IGVudmlyb25tZW50IG9yIHRoZSBwb2x5ZmlsbC9zaGltIG9mIHRoZSAqY29yZS1qcyogbGlicmFyeS5cbiAgICAgICAgICovXG4gICAgICAgIE1hcCA6IHJlcXVpcmUoICcuL21hcCcgKSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGNsYXNzIFBpY2ltby51dGlscy5Qcm9taXNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzdW1tYXJ5XG4gICAgICAgICAqICAgRVM2IFByb21pc2VcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqICAgQW4gRVM2IFByb21pc2UgSW1wbGVtZW50YXRpb24uXG4gICAgICAgICAqICAgVGhpcyBpcyB0aGUgKm5hdGl2ZSogSW1wbGVtZW50YXRpb24gb2YgeW91ciBqYXZhc2NyaXB0IGVudmlyb25tZW50IG9yIHRoZSBwb2x5ZmlsbC9zaGltIG9mIHRoZSAqY29yZS1qcyogbGlicmFyeS5cbiAgICAgICAgICovXG4gICAgICAgIFByb21pc2UgOiByZXF1aXJlKCAnLi9wcm9taXNlJyApLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZXNwYWNlIFBpY2ltby51dGlscy5nbE1hdHJpeFxuICAgICAgICAgKlxuICAgICAgICAgKiBAc3VtbWFyeVxuICAgICAgICAgKiAgIFRoZSBmYW50YXN0aWMgZ2wtbWF0cml4IGxpYnJhcnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzZWVcbiAgICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL3RvamkvZ2wtbWF0cml4XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBnbE1hdHJpeCA6IHJlcXVpcmUoICdnbC1tYXRyaXgnICksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBjbGFzcyBQaWNpbW8udXRpbHMuQ29sb3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHN1bW1hcnlcbiAgICAgICAgICogICBUaGUgZmFudGFzdGljIGNvbG9yIG1hbmFnZW1lbnQgQVBJIG5ldC5icmVoYXV0LkNvbG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzZWVcbiAgICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL2JyZWhhdXQvY29sb3ItanNcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIENvbG9yIDogcmVxdWlyZSggJ2NvbG9yLWpzJyApLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkR2x4UHJvcGVydHkgOiByZXF1aXJlKCAnLi9hZGRfZ2x4X3Byb3BlcnR5JyApLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkVWlkIDogcmVxdWlyZSggJy4vYWRkX3VpZCcgKVxuXG4gICAgfTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2YgTWFwID09PSAndW5kZWZpbmVkJyA/IHJlcXVpcmUoICdjb3JlLWpzL2xpYnJhcnknICkuTWFwIDogTWFwO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gUGljaW1vLnV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogICBEZWZpbmUgYSAqcmVhZC1vbmx5KiBwcm9wZXJ0eSB3aGljaCBpcyAqZW51bWVyYWJsZSogYnV0IG5vdCAqd3JpdGFibGUqIGFuZCAqY29uZmlndXJhYmxlKi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9kZWZpbmVQcm9wZXJ0eVxuICAgICAqIEByZXR1cm4gb2JqXG4gICAgICovXG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyA9IGZ1bmN0aW9uICggb2JqLCBuYW1lLCB2YWx1ZSApIHtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwgbmFtZSwge1xuICAgICAgICAgICAgdmFsdWUgICAgIDogdmFsdWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gUGljaW1vLnV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVByaXZhdGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiAgIERlZmluZSBhIHByb3BlcnR5IHdoaWNoIGlzIE5PVCAqZW51bWVyYWJsZSogYW5kICpjb25maWd1cmFibGUqIEJVVCAqd3JpdGFibGUqLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2RlZmluZVByb3BlcnR5XG4gICAgICogQHJldHVybiBvYmpcbiAgICAgKi9cbiAgICBtb2R1bGUuZXhwb3J0cy5kZWZpbmVQcm9wZXJ0eVByaXZhdGUgPSBmdW5jdGlvbiAoIG9iaiwgbmFtZSwgdmFsdWUgKSB7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIG5hbWUsIHtcbiAgICAgICAgICAgIHZhbHVlICAgIDogdmFsdWUsXG4gICAgICAgICAgICB3cml0YWJsZSA6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBQaWNpbW8udXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnR5UHJpdmF0ZVJPXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogICBEZWZpbmUgYSAqKnJlYWQtb25seSoqIHByb3BlcnR5IHdoaWNoIGlzIE5PVCAqZW51bWVyYWJsZSosICpjb25maWd1cmFibGUqIGFuZCAqd3JpdGFibGUqLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2RlZmluZVByb3BlcnR5XG4gICAgICogQHJldHVybiBvYmpcbiAgICAgKi9cbiAgICBtb2R1bGUuZXhwb3J0cy5kZWZpbmVQcm9wZXJ0eVByaXZhdGVSTyA9IGZ1bmN0aW9uICggb2JqLCBuYW1lLCB2YWx1ZSApIHtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwgbmFtZSwge1xuICAgICAgICAgICAgdmFsdWUgOiB2YWx1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIFBpY2ltby51dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydGllc1B1YmxpY1JPXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBEZWZpbmUgKnJlYWQtb25seSogcHJvcGVydGllcyB3aGljaCBhcmUgKmVudW1lcmFibGUqIGJ1dCBub3QgKndyaXRhYmxlKiBhbmQgKmNvbmZpZ3VyYWJsZSouXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFRoZSBuYW1lL3ZhbHVlIG1hcFxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvZGVmaW5lUHJvcGVydGllc1xuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBQaWNpbW8udXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnRpZXNQdWJsaWNSTyggb2JqLCB7XG4gICAgICogICAgIEZPTzogJ2ZvbycsXG4gICAgICogICAgIEJBUjogJ3BsYWghJ1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogQHJldHVybiBvYmpcbiAgICAgKi9cbiAgICBtb2R1bGUuZXhwb3J0cy5kZWZpbmVQcm9wZXJ0aWVzUHVibGljUk8gPSBmdW5jdGlvbiAoIG9iaiwgbWFwICkge1xuXG4gICAgICAgIGZvciAoIHZhciBrZXkgaW4gbWFwICkge1xuXG4gICAgICAgICAgICBpZiAoIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBtYXAsIGtleSApICkge1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSAgICAgOiBtYXBbIGtleSBdLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iajtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBQaWNpbW8udXRpbHMub2JqZWN0LmRlZmluZVByb3BlcnRpZXNQcml2YXRlUk9cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIERlZmluZSAqcmVhZC1vbmx5KiBwcm9wZXJ0aWVzIHdoaWNoIGFyZSBOT1QgKmVudW1lcmFibGUqLCAqd3JpdGFibGUqIG9yICpjb25maWd1cmFibGUqLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBUaGUgbmFtZS92YWx1ZSBtYXBcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2RlZmluZVByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogUGljaW1vLnV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHJpdmF0ZVJPKCBvYmosIHtcbiAgICAgKiAgICAgX0ZPTzogJ2ZvbycsXG4gICAgICogICAgIF9iYXI6ICdwbGFoISdcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIEByZXR1cm4gb2JqXG4gICAgICovXG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmaW5lUHJvcGVydGllc1ByaXZhdGVSTyA9IGZ1bmN0aW9uICggb2JqLCBtYXAgKSB7XG5cbiAgICAgICAgZm9yICggdmFyIGtleSBpbiBtYXAgKSB7XG5cbiAgICAgICAgICAgIGlmICggT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoIG1hcCwga2V5ICkgKSB7XG5cbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwga2V5LCB7IHZhbHVlOiBtYXBbIGtleSBdIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmo7XG5cbiAgICB9O1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBQcm9taXNlID09PSAndW5kZWZpbmVkJyA/IHJlcXVpcmUoICdjb3JlLWpzL2xpYnJhcnknICkuUHJvbWlzZSA6IFByb21pc2U7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgUGljaW1vLndlYmdsXG4gICAgICovXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgICAgICBTaGFkZXJTb3VyY2UgIDogcmVxdWlyZSggJy4vc2hhZGVyX3NvdXJjZScgKSxcbiAgICAgICAgU2hhZGVyTWFuYWdlciA6IHJlcXVpcmUoICcuL3NoYWRlcl9tYW5hZ2VyJyApLFxuICAgICAgICBXZWJHbENvbnRleHQgIDogcmVxdWlyZSggJy4vd2ViX2dsX2NvbnRleHQnICksXG4gICAgICAgIFdlYkdsUmVuZGVyZXIgOiByZXF1aXJlKCAnLi93ZWJfZ2xfcmVuZGVyZXInIClcblxuICAgIH07XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciB1dGlscyAgICAgICAgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG4gICAgdmFyIFNoYWRlclNvdXJjZSA9IHJlcXVpcmUoICcuL3NoYWRlcl9zb3VyY2UnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIFNoYWRlck1hbmFnZXIgKCBhcHAgKSB7XG4gICAgICAgIFxuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyggdGhpcywgJ2FwcCcsIGFwcCApO1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHJpdmF0ZVJPKCB0aGlzLCB7XG5cbiAgICAgICAgICAgIF92ZXJ0ZXhTaGFkZXIgICA6IG5ldyB1dGlscy5NYXAoKSxcbiAgICAgICAgICAgIF9mcmFnbWVudFNoYWRlciA6IG5ldyB1dGlscy5NYXAoKSxcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2FkZFNoYWRlclxuICAgICAqIEBwYXJhbSB7UGljaW1vLlNoYWRlclNvdXJjZX0gc2hhZGVyXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmFkZFNoYWRlciA9IGZ1bmN0aW9uICggc2hhZGVyICkge1xuXG4gICAgICAgIGlmICggc2hhZGVyLnNoYWRlclR5cGUgPT09IFNoYWRlclNvdXJjZS5WRVJURVhfU0hBREVSICkge1xuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRleFNoYWRlci5zZXQoIHNoYWRlci5uYW1lLCBzaGFkZXIgKTtcbiAgICAgICAgXG4gICAgICAgIH0gZWxzZSBpZiAoIHNoYWRlci5zaGFkZXJUeXBlID09PSBTaGFkZXJTb3VyY2UuRlJBR01FTlRfU0hBREVSICkge1xuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2ZyYWdtZW50U2hhZGVyLnNldCggc2hhZGVyLm5hbWUsIHNoYWRlciApO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICBcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2FkZFZlcnRleFNoYWRlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNoYWRlciAtIFRoZSByYXcgc2hhZGVyIHNvdXJjZSBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtQaWNpbW8ud2ViZ2wuU2hhZGVyTWFuYWdlcn0gc2VsZlxuICAgICAqL1xuXG4gICAgU2hhZGVyTWFuYWdlci5wcm90b3R5cGUuYWRkVmVydGV4U2hhZGVyID0gZnVuY3Rpb24gKCBuYW1lLCBzb3VyY2UgKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2hhZGVyKCBuZXcgU2hhZGVyU291cmNlKCBTaGFkZXJTb3VyY2UuVkVSVEVYX1NIQURFUiwgbmFtZSwgc291cmNlICkgKTtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXIjYWRkRnJhZ21lbnRTaGFkZXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaGFkZXIgLSBUaGUgcmF3IHNoYWRlciBzb3VyY2Ugc3RyaW5nXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmFkZEZyYWdtZW50U2hhZGVyID0gZnVuY3Rpb24gKCBuYW1lLCBzb3VyY2UgKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkU2hhZGVyKCBuZXcgU2hhZGVyU291cmNlKCBTaGFkZXJTb3VyY2UuRlJBR01FTlRfU0hBREVSLCBuYW1lLCBzb3VyY2UgKSApO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuU2hhZGVyTWFuYWdlciNsb2FkVmVydGV4U2hhZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmxvYWRWZXJ0ZXhTaGFkZXIgPSBmdW5jdGlvbiAoIG5hbWUsIHVybCApIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5hZGRTaGFkZXIoIG5ldyBTaGFkZXJTb3VyY2UoIFNoYWRlclNvdXJjZS5WRVJURVhfU0hBREVSLCBuYW1lICkubG9hZCggdXJsICkgKTtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXIjbG9hZEZyYWdtZW50U2hhZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlck1hbmFnZXJ9IHNlbGZcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmxvYWRGcmFnbWVudFNoYWRlciA9IGZ1bmN0aW9uICggbmFtZSwgdXJsICkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNoYWRlciggbmV3IFNoYWRlclNvdXJjZSggU2hhZGVyU291cmNlLkZSQUdNRU5UX1NIQURFUiwgbmFtZSApLmxvYWQoIHVybCApICk7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2dldFZlcnRleFNoYWRlclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybiB7UGljaW1vLlNoYWRlclNvdXJjZX0gc2hhZGVyXG4gICAgICovXG5cbiAgICBTaGFkZXJNYW5hZ2VyLnByb3RvdHlwZS5nZXRWZXJ0ZXhTaGFkZXIgPSBmdW5jdGlvbiAoIG5hbWUgKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRleFNoYWRlci5nZXQoIG5hbWUgKTtcbiAgICBcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJNYW5hZ2VyI2dldEZyYWdtZW50U2hhZGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcmV0dXJuIHtQaWNpbW8uU2hhZGVyU291cmNlfSBzaGFkZXJcbiAgICAgKi9cblxuICAgIFNoYWRlck1hbmFnZXIucHJvdG90eXBlLmdldEZyYWdtZW50U2hhZGVyID0gZnVuY3Rpb24gKCBuYW1lICkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9mcmFnbWVudFNoYWRlci5nZXQoIG5hbWUgKTtcbiAgICBcbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNoYWRlck1hbmFnZXI7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoICcuLi91dGlscycgKTtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNoYWRlclR5cGUgLSAnVkVSVEVYX1NIQURFUicgb3IgJ0ZSQUdNRU5UX1NIQURFUidcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzb3VyY2VdXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBTaGFkZXJTb3VyY2UgKCBzaGFkZXJUeXBlLCBuYW1lLCBzb3VyY2UgKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZSN1aWRcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICB1dGlscy5hZGRVaWQoIHRoaXMgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7UGljaW1vLnV0aWxzLkRlZmVycmVkfSBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI2RlZmVycmVkXG4gICAgICAgICAqL1xuICAgICAgICB1dGlscy5EZWZlcnJlZC5tYWtlKCB0aGlzICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBtZW1iZXIge3N0cmluZ30gUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZSNzaGFkZXJUeXBlIC0gJ1ZFUlRFWF9TSEFERVInIG9yICdGUkFHTUVOVF9TSEFERVInXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNoYWRlclR5cGUgPSBzaGFkZXJUeXBlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IFBpY2ltby53ZWJnbC5TaGFkZXJTb3VyY2UjbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI3NvdXJjZSAtIFRoZSBzaGFkZXIgc291cmNlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1lbWJlciB7c3RyaW5nfSBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI3VybFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51cmwgPSBudWxsO1xuXG4gICAgfVxuXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggU2hhZGVyU291cmNlLnByb3RvdHlwZSwge1xuXG4gICAgICAgICdzb3VyY2UnOiB7XG5cbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc291cmNlOyB9LFxuXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICggc291cmNlICkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmZXJyZWQucmVhZHkgPSB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyAmJiBzb3VyY2UudHJpbSgpLmxlbmd0aCAhPT0gMDtcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXG4gICAgICAgIH1cblxuICAgIH0pO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5TaGFkZXJTb3VyY2UjZ2V0U291cmNlXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZVxuICAgICAqL1xuXG4gICAgU2hhZGVyU291cmNlLnByb3RvdHlwZS5nZXRTb3VyY2UgPSBmdW5jdGlvbiAoIHJlc29sdmUgKSB7XG5cbiAgICAgICAgdGhpcy5kZWZlcnJlZC5mb3J3YXJkKCAnc291cmNlJywgcmVzb2x2ZSApO1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuU2hhZGVyU291cmNlI2xvYWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAgICogQHJldHVybiB7UGljaW1vLndlYmdsLlNoYWRlclNvdXJjZX0gLSBzZWxmXG4gICAgICovXG5cbiAgICBTaGFkZXJTb3VyY2UucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoIHVybCApIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG5cbiAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgIHJlcS5vcGVuKCBcIkdFVFwiLCB1cmwsIHRydWUgKTtcblxuICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAoIHJlcS5yZWFkeVN0YXRlICE9PSA0IC8qIERPTkUgKi8gKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmICggcmVxLnN0YXR1cyA+PSAyMDAgJiYgcmVxLnN0YXR1cyA8IDMwMCApIHtcblxuICAgICAgICAgICAgICAgIHNlbGYuc291cmNlID0gcmVxLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVxLnNlbmQoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZSNjb21waWxlXG4gICAgICogQHBhcmFtIHtXZWJHbFJlbmRlcmluZ0NvbnRleHR9IGdsXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAtICpnbCBpZCogb3IgMFxuICAgICAqL1xuXG4gICAgU2hhZGVyU291cmNlLnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKCBnbCApIHtcblxuICAgICAgICBpZiAoICEgdGhpcy5kZWZlcnJlZC5yZWFkeSApIHJldHVybjtcblxuICAgICAgICB2YXIgaWQgPSBnbC5jcmVhdGVTaGFkZXIoIGdsWyB0aGlzLnNoYWRlclR5cGUgXSApO1xuXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZSggaWQsIHRoaXMuc291cmNlICk7XG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoIGlkICk7XG5cbiAgICAgICAgaWYgKCAhIGdsLmdldFNoYWRlclBhcmFtZXRlciggaWQsIGdsLkNPTVBJTEVfU1RBVFVTICkgKSB7XG5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciggZ2wuZ2V0U2hhZGVySW5mb0xvZyggaWQgKSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaWQ7XG5cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZVxuICAgICAqIEBjb25zdGFudCBWRVJURVhfU0hBREVSXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuXG4gICAgU2hhZGVyU291cmNlLlZFUlRFWF9TSEFERVIgPSAnVkVSVEVYX1NIQURFUic7XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyb2YgUGljaW1vLndlYmdsLlNoYWRlclNvdXJjZVxuICAgICAqIEBjb25zdGFudCBGUkFHTUVOVF9TSEFERVJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG5cbiAgICBTaGFkZXJTb3VyY2UuRlJBR01FTlRfU0hBREVSID0gJ0ZSQUdNRU5UX1NIQURFUic7XG5cblxuICAgIG1vZHVsZS5leHBvcnRzID0gU2hhZGVyU291cmNlO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXRpbHMgPSByZXF1aXJlKCAnLi4vdXRpbHMnICk7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUGljaW1vLndlYmdsLldlYkdsQ29udGV4dFxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gV2ViR2xDb250ZXh0ICggZ2wgKSB7XG5cbiAgICAgICAgaWYgKCAhIGdsICkgdGhyb3cgbmV3IEVycm9yKCAnW25ldyBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0XSBnbCBpcyB1bmRlZmluZWQhJyApO1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0eVB1YmxpY1JPKCB0aGlzLCAnZ2wnLCBnbCApO1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHJpdmF0ZVJPKCB0aGlzLCB7XG4gICAgICAgICAgICAnX2JvdW5kQnVmZmVycycgOiBuZXcgdXRpbHMuTWFwKCksXG4gICAgICAgICAgICAnX2JvdW5kVGV4dHVyZXMnOiBuZXcgdXRpbHMuTWFwKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZ2V0RXh0ZW5zaW9ucyggdGhpcyApO1xuICAgICAgICByZWFkV2ViR2xQYXJhbWV0ZXJzKCB0aGlzICk7XG5cbiAgICAgICAgT2JqZWN0LnNlYWwoIHRoaXMgKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLldlYkdsQ29udGV4dCNnbEJpbmRCdWZmZXJcbiAgICAgKiBAcGFyYW0gYnVmZmVyVHlwZVxuICAgICAqIEBwYXJhbSBidWZmZXJcbiAgICAgKi9cblxuICAgIFdlYkdsQ29udGV4dC5wcm90b3R5cGUuZ2xCaW5kQnVmZmVyID0gZnVuY3Rpb24gKCBidWZmZXJUeXBlLCBidWZmZXIgKSB7XG5cbiAgICAgICAgaWYgKCB0aGlzLl9ib3VuZEJ1ZmZlcnMuZ2V0KCBidWZmZXJUeXBlICkgIT09IGJ1ZmZlciApIHtcblxuICAgICAgICAgICAgdGhpcy5fYm91bmRCdWZmZXJzLnNldCggYnVmZmVyVHlwZSwgYnVmZmVyICk7XG4gICAgICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIoIGJ1ZmZlclR5cGUsIGJ1ZmZlciApO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZWFkV2ViR2xQYXJhbWV0ZXJzKCB3ZWJHbENvbnRleHQgKSB7XG5cbiAgICAgICAgdmFyIGdsID0gd2ViR2xDb250ZXh0LmdsO1xuXG4gICAgICAgIHV0aWxzLm9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzUHVibGljUk8oIHdlYkdsQ29udGV4dCwge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBtZW1iZXIge251bWJlcn0gUGljaW1vLndlYmdsLldlYkdsQ29udGV4dCNNQVhfVEVYVFVSRV9TSVpFIC0gZ2wuTUFYX1RFWFRVUkVfU0laRVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBNQVhfVEVYVFVSRV9TSVpFIDogZ2wuZ2V0UGFyYW1ldGVyKCBnbC5NQVhfVEVYVFVSRV9TSVpFICksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG1lbWJlciB7bnVtYmVyfSBQaWNpbW8ud2ViZ2wuV2ViR2xDb250ZXh0I01BWF9URVhUVVJFX0lNQUdFX1VOSVRTIC0gZ2wuTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFMgOiBnbC5nZXRQYXJhbWV0ZXIoIGdsLk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTIClcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEV4dGVuc2lvbnMoIHdlYkdsQ29udGV4dCApIHtcblxuICAgICAgICB3ZWJHbENvbnRleHQuT0VTX2VsZW1lbnRfaW5kZXhfdWludCA9IHdlYkdsQ29udGV4dC5nbC5nZXRFeHRlbnNpb24oXCJPRVNfZWxlbWVudF9pbmRleF91aW50XCIpO1xuXG4gICAgICAgIGlmICggISB3ZWJHbENvbnRleHQuT0VTX2VsZW1lbnRfaW5kZXhfdWludCApIHtcbiAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCBcIldlYkdMIGRvbid0IHN1cHBvcnQgdGhlIE9FU19lbGVtZW50X2luZGV4X3VpbnQgZXh0ZW5zaW9uIVwiICk7XG4gICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFdlYkdsQ29udGV4dDtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZSggJy4uL3V0aWxzJyApO1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBpY2ltby53ZWJnbC5XZWJHbFJlbmRlcmVyXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBXZWJHbFJlbmRlcmVyICggYXBwICkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWVtYmVyIHtQaWNpbW8uQXBwfSBQaWNpbW8ud2ViZ2wuV2ViR2xSZW5kZXJlciNhcHBcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICB1dGlscy5vYmplY3QuZGVmaW5lUHJvcGVydHlQdWJsaWNSTyggdGhpcywgJ2FwcCcsIGFwcCApO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIFBpY2ltby53ZWJnbC5XZWJHbFJlbmRlcmVyI2JlZ2luRnJhbWVcbiAgICAgKi9cblxuICAgIFdlYkdsUmVuZGVyZXIucHJvdG90eXBlLmJlZ2luRnJhbWUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGdsID0gdGhpcy5hcHAuZ2w7XG4gICAgICAgIHZhciBiZ0NvbG9yID0gdGhpcy5hcHAuYmFja2dyb3VuZENvbG9yO1xuXG4gICAgICAgIGdsLmNsZWFyQ29sb3IoIGJnQ29sb3IuZ2V0UmVkKCksIGJnQ29sb3IuZ2V0R3JlZW4oKSwgYmdDb2xvci5nZXRCbHVlKCksIGJnQ29sb3IuZ2V0QWxwaGEoKSApO1xuICAgICAgICBnbC5jbGVhciggZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQgKTtcblxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgUGljaW1vLndlYmdsLldlYkdsUmVuZGVyZXIjZW5kRnJhbWVcbiAgICAgKi9cblxuICAgIFdlYkdsUmVuZGVyZXIucHJvdG90eXBlLmVuZEZyYW1lID0gZnVuY3Rpb24gKCkge1xuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuV2ViR2xSZW5kZXJlciNpbml0R2xcbiAgICAgKi9cblxuICAgIFdlYkdsUmVuZGVyZXIucHJvdG90eXBlLmluaXRHbCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmFwcC5nbDtcblxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKCBnbC5URVhUVVJFMCApOyAvLyBUT0RPIHJlbW92ZVxuXG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBQaWNpbW8ud2ViZ2wuV2ViR2xSZW5kZXJlciNyZXNpemVcbiAgICAgKi9cblxuICAgIFdlYkdsUmVuZGVyZXIucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgYXBwID0gdGhpcy5hcHA7XG4gICAgICAgIHZhciBnbCAgPSB0aGlzLmFwcC5nbDtcblxuICAgICAgICBnbC52aWV3cG9ydCggMCwgMCwgYXBwLndpZHRoLCBhcHAuaGVpZ2h0ICk7XG5cbiAgICB9O1xuXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IFdlYkdsUmVuZGVyZXI7XG5cbn0pKCk7XG4iXX0=
