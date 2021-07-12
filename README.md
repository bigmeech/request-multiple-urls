# Request Multiple URLs

## Installation
`npm i request-multiple-url` NOTE: Not Pubished Yet

## Requirements
- NodeJS (see .nvmrc)

## Dependencies
None required, except for Jest for unit testing

## Usage
```js
const { requestMulti } = require('./lib')

const options = {
    parse: <boolean>,
    atomic: <boolean>
}

try {
    const urls = [
        'http://www.source.com/a.json',
        'http://www.source.com/b.json',
        'http://www.source.com/c.json'
    ]
    const results = await requestMulti(urls, options);
} catch(err) {
    // handle Error
    logger.error(err);
}
```

## API
#### `requestMulti`
takes a list of urls and an options object and returns an array of resolved promises

### `options`
- `parse: <boolean>` - Call parse the raw response buffer to a javascript object?
- `atomic: <boolean>` - Should succeed or fail together as one?

## Testing

`npm test`
