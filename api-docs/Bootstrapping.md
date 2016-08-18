---
title: Bootstrapping
type: guide
---

You instantiate a *picimo* application by explicitly creating a `new Picimo.App` instance.

#### Simple Example

Assuming this `index.html`:

```
<!DOCTYPE html>
<html>
  <head>
    <title>a picimo application!</title>
    <style>
        html, body { height: 100%; }
        body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <script src="picimo.min.js"></script>
    <script>
        /* your bootstrapping code here */
    </script>
  </body>
</html>
```

We can use this minimal *picimo* application bootstrapping code:

```
var app = new Picimo.App({ alpha: false, bgColor: '#a0c0e0' });

// Set pixel resolution
app.scene.setSize(640, 480, 'contain');
```

When you instantiate the `Picimo.App`, *picimo* performs the following tasks:

1. It creates a webgl `<canvas>` context (in this case *without* alpha support)
2. It appends the `<canvas>` to the body as child (because you didn't specify the *container* element).
   This will create a fullscreen canvas, since you set the `<body>` (and `<html>`) height to 100%.
3. It starts the main render loop and renders the scene (given that you didn't create some interesting scene graph nodes you
   will only see a blank *blue* scene here as result).

*Congratulation!* You created you first *picimo* application.

Now go on and create some more visual appealing stuff!
*Picimo* offers some predefined scene graph nodes for you:

- [Picimo.graph.Picture](#picimo-graph-picture)
- [Picimo.graph.Canvas](#picimo-graph-canvas)
- [Picimo.graph.SpriteGroup](#picimo-graph-sprite-group)
- [Picimo.graph.Scene](#picimo-graph-scene)

