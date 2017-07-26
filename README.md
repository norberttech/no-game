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

# Setup

Before you start make sure you have installed ``node`` version `>=7.9.x` and ``npm`` version `>4.6.x` on your machine. 

```
$ git clone git@github.com:norzechowicz/no-game.git
$ cd no-game
$ npm install 
```

# Vagrant 

`/etc/hosts`

```
10.0.0.200      nogame.local
10.0.0.200      client.nogame.local
```

* http://nogame.local 
* http://client.nogame.local 
