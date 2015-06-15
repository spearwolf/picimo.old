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
