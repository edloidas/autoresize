autoresize
==========

> Automatically resize the inputs.

## Examples

You can try [TextArea](http://edloidas.github.io/autoresize/examples/textarea.html) or [Input](http://edloidas.github.io/autoresize/examples/input.html) examples in your browser.<br/>
__Note:__ _Autoresize of the `<input>` element is **not yet implemented**._

## Install

#### Node

```
npm i roll-parser
```

Then in your project require it:

```js
const autoresize = require('autoresize');
```
Or use ES import:
```js
import autoresize from 'autoresize';
```

#### Browser

__Note:__ _You will have access to the global `autoresize` function, that will be added to the `window` object._

```html
<script src="https://unpkg.com/autoresize/dist/autoresize.js"></script>
```

Minified version:

```html
<script src="https://unpkg.com/autoresize/dist/autoresize.min.js"></script>
```

ES5 version:

```html
<script src="https://unpkg.com/autoresize/dist/autoresize.es5.js"></script>
```

Minified ES5 version:

```html
<script src="https://unpkg.com/autoresize/dist/autoresize.es5.min.js"></script>
```

## Usage

```js
const element = document.querySelector('#textarea');
const options = { maximumRows: 5 };
autoresize(element, options);
```

#### Paramenters

##### `element`

An HTML element of types: `HTMLTextAreaElement` or `HTMLInputElement`.

##### `options`


An options object, that is different for each element type.

__TextArea__
```js
{
  minimumRows: 1,
  maximumRows: Infinity,
  rowHeight: null
}
```
Passing the `rowHeight` value may be a bit more performant solution, but it will mean you can guarantee that the `lineSize` won't be changed in future with JS or CSS (including some `@media` queries). Otherwise, `rowHeight` will be calculated on the initial step and recalculated on window `'resize'` event.

__Input__
```js
{
  maxWidth: null
}
```

## License

[MIT](LICENSE) © [Mikita Taukachou](https://edloidas.com)
