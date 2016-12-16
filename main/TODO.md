# TODO

## Code Refactoring

- [ ] no more generic `import * as ...` imports
- [ ] only one class or method per file
- [ ] for all options/configuration values use transform helpers `utils.asString()`, `utils.asBoolean()`, ..
- [ ] texture state and events (imageLoaded, textureCreated, firstTimeRender), add to TextureManager
- [ ] generic factories solution (see src/scene/factories as an example of how to *not*)
- [ ] remove renderer.debugOutFrame - create a dynamic flag/properties for this feature
- [ ] check/remove all inline TODOs
- [ ] convert all graph/.. nodes into es6 classes
- [ ] rename `utils/obj_utils`into `utils/obj_props`
- [ ] rework all exceptions/errors and logs plus DEBUG/debug
- [ ] cleanup utils/index.js

## Inline Documentation

- [ ] jsdoc vs esdoc
- [ ] find solution how to write inline documentation for events (emits, listens)
- [ ] find solution how to documentate properties/method added to obects via `Object.defineProperty()`
- [ ] all constructor options
- [ ] examples for all important classes and methods

## Tests

- [ ] vertex object description and vertex objects generation
- [ ] ready promise / resource
- [ ] src/graph/picture/ update\_vertices.js + diplay\_position.js

