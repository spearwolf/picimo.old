'use strict';

import eventize from 'eventize-js';
import App from './app';

eventize(App);  // Enable plugins via Picimo.App.on('create', function (app, options))

export default App;
