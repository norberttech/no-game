[Back to readme](/README.md)

# Important commands

- ``$ npm run common:update`` - **Should be executed after any change in nogame common library**
- ``$ npm test `` - execute client test suite
- ``$ npm run client:build`` - execute server test suite
- ``$ npm run client:dev`` - run client in dev (watch) mode


# Development

In order to develop client without server launched (just to work on UI for example) you can open client url with
[https://client.nogame.local/?test=test](https://client.nogame.local/?test=test) test parameter.
This will initialize client with stub connection protocol (put anything into credentials to login).

* [Dictionary](/nodejs/client/docs/dictionary.md)

# Debugging

In order to debug client in browser in test mode type following code in browser console:

```
console.log(nogameClient._kernel._gfxEngine._visibleTiles);
```