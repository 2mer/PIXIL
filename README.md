<img src="./public/pixil_logox200.png"/>

# PIXIL

A TypeScript open-source hackable pixel editor powered by PIXI.js

Almost everything is exposed, extendable, and modular for bending this editor to your needs

[demo🎨](https://2mer-storybook.netlify.app/)

[demo code⌨](https://github.com/2mer/pixil-storybook)

## Installation:

```sh
npm i @sgty/pixil
```

```sh
yarn add @sgty/pixil
```

```sh
pnpm add @sgty/pixil
```

## Features:

-   [x] Layers
-   [x] Tools
    -   [x] Brush
    -   [x] Eraser
    -   [x] Fill (using [q-floodfill](https://www.npmjs.com/package/q-floodfill?activeTab=readme))
-   [x] History
-   [x] Plugins

### History

History is opt-in as to not bloat your memory when not necessary
to enable history:

```js
editor.history.enabled = true;
```

you can also limit the amount of entries in the history (no limit by default):

```js
editor.history.limit = 100; // 100 entries
```
