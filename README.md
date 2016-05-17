# NoGame

This repository is a proof of concept of 2D mmorpg game engine&client written in JS (es6).
It was made as a research before paid project for my client. 

Following features are already implemented: 

- simple user login (username only) 
- player moves (up, down, left, right)
- map configuration (created with http://www.mapeditor.org/) 
- some basic but ugly sprites 
- simple battle system
- player health 
- possibility to die when monster is too hard to kill
- probably some other things that I don't remember now
- simple chat (players voice is visible to other players) 
- client&server communication protocols
- and probably some more that I don't remember now 

In order to make it playable you gonna need to implement following features:

- leveing system (based on experience) 
- improve battle system in order to support equpiment (that is also not implemented) 
- prepare some better looking assets 
- add more tests (just to make sure that game is stable)
- add some persistence layer (at the moment when you shutdown server or when player logout his data is lost)
- and many many more...

# Screenshot 

One ugly square (player) is fighting with another ugly square (rat, monster) :P

![alt tag](/resources/img/no-game.jpeg)

# Setup

Before you start make sure you have installed ``npm`` on your machine. 

```
$ git clone git@github.com:norzechowicz/no-game.git
$ cd no-game
$ npm install 
```

That's all. Now you are ready to build server/client and test the game yourself.

In order to do that you need to build server&client, following commands should help you with that. 

- ``$ npm test `` - execute test suite 
- ``$ npm run client:dev`` - build and watch for changes in client (after building client you can open it in your browser ``/client/index.html``)
- ``$ npm run client:build`` - build client into ``build`` folder 
- ``$ npm run server:dev`` - build server in memory and start listening for connections
- ``$ npm run server:build`` - build server code into ``build`` folder
