# NoGame [![Build Status](https://travis-ci.org/norzechowicz/no-game.svg?branch=master)](https://travis-ci.org/norzechowicz/no-game)

This repository is a proof of concept of 2D mmorpg game engine&client written in JS (es6).
It was made as a part of research done in my free time.

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

- leveling system (based on experience)
- improve battle system in order to support equipment (that is also not implemented)
- prepare some better looking assets
- add more tests (just to make sure that game is stable)
- add some persistence layer (at the moment when you shutdown server or when player logout his data is lost)
- and many many more...

# Screenshot

One ugly square (player) is fighting with another ugly square (rat, monster) :P

![alt tag](/resources/img/no-game.png)

# Documentation

 * [Setup](/docs/setup.md)
 * [NodeJS - Common](/nodejs/common/README.md)
 * [NodeJS - Client](/nodejs/client/README.md)
 * [NodeJS - Server](/nodejs/server/README.md)

