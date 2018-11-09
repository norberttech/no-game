[Back to readme](/README.md)

# Important commands

- ``$ npm run build`` - build common library in order to allow client to use it
- ``$ npm test `` - execute common library test suite

# Development

Initially I though this package should be exposed and installed as a dependency by Server and Client however
I'm no longer so sure about it. For now I created symlink into this folder from Client and Server,
this might be a problem for developers using Windows OS.