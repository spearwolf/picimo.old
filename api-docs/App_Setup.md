---
title: App Setup
type: topic
tags:
    - guide
---

Der Anfang von allem. Das ist der __Main Controller__ deiner App.
Der einfachste Weg eine App Instanz zu erzeugen ist mittels

`let app = new Picimo.App;`

#### Options are optional

Options werden einfach an den Constructor als erstes Argument überreicht ..

`let app = new Picimo({ canvas: document.getElementById('myCanvas') });`

#### Canvas Setup

Picimo benötigt ein `<canvas>` Element zur Anzeige. Dieses kann mittels `canvas` option
oder einfach als ersten Parameter an den Constructor übergeben werden.

`let app = new Picimo.App(myCanvas/* , options */);`

Wird kein Canvas angegeben, erzeugt die App instance einfach selbst einen eigenen Canvas.
Dieser wird unterhalb `document.body` eingehängt oder alternativ kann der Container mit der Option `appendTo` bestimmt werden.

Dieser automatisch erzeugte Canvas richtet seine Größe dynamisch an seinem Container Element (parentNode) aus.
Der Container sollte also eine eigene Größe haben.

Im Gegensatz dazu wird die Canvas Element Größe *niemals* von der App verändert,
wenn ein schon bestehendes Canvas (zB. per `canvas` option) verwendet wird.

#### Background (color/transparency)

Mit der Option `alpha: true` kann ein transparenter Canvas erzeugt werden. Mit `backgroundColor` kann alternativ
eine Hintergrundfarbe bestimmt werden.

#### Events and State Changes

While registering function callbacks with `app.on()` you can hook into the different app state changes
(like *init*, *resize* or *renderFrame* .. )

Picimo is using the [spearwolf/eventize](https://github.com/spearwolf/eventize) library.

#### glx/gl/renderer states

TODO

#### assets/shader/texture/sprite factories/helpers

TODO

#### timing/frameNo state

TODO

#### scene graph root

TODO

#### plugin support

- `App.on('create')`

