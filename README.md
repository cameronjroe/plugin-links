# plugin-links

> Create markdown links from namespaced github repos.

## Install

```sh
$ npm install plugin-links --save
```

## Example

[Example of Metalsmith Plugins](https://github.com/cameronjroe/plugin-links/blob/master/PLUGINS.md)

## Usage

```js
import PluginLinks from 'plugin-links';

let pluginLinks = new PluginLinks({
  prefix: 'metalsmith',
  fileName: 'PLUGINS',
  pages: 1
});

```

## Options
  - **prefix** {string} - namespace to search on github (required)
  - **fileName** {string} - name of markdown file to be created (optional)
  - **pages** {number} - amount of pages to search on github (optional)

## Testing

```sh
$ npm test
```

## License

[MIT](https://github.com/cameronjroe/plugin-links/blob/master/LICENSE)