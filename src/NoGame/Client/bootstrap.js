"use strict";

import Client from './Client';
import Kernel from './Kernel';
import UserInterface from './UserInterface';
import Engine from './Gfx/Engine';
import Canvas from './Gfx/Canvas';
import SpriteMap from './Gfx/SpriteMap';
import SpriteFile from './Gfx/SpriteFile';
import Keys from './UserInterface/Keys';

window.document.addEventListener("DOMContentLoaded", (event) => {
    let spriteMap = new SpriteMap();
    spriteMap.add(new SpriteFile("grounds", "assets/sprites/grounds.png", 1));

    let gfx = new Engine(
        new Canvas(window.document.getElementById('game-canvas')),
        (callback) => { window.requestAnimationFrame(callback); },
        spriteMap
    );
    let client = new Client('ws://localhost:8080/', new Kernel(gfx));
    let ui = new UserInterface(window.document);

    ui.bindWindowResize();
    ui.bindArrows((key) => {
        switch (key) {
            case Keys.LEFT:
                client.moveLeft();
                break;
            case Keys.DOWN:
                client.moveDown();
                break;
            case Keys.RIGHT:
                client.moveRight();
                break;
            case Keys.UP:
                client.moveUp();
                break;
        }
    });

    ui.onSay((message) => {
        client.say(message);
    });

    client.onCharacterSay((characterName, message) => {
        ui.chat().addMessage(new Date(), characterName, message);
    });

    client.connect((client) => {
        ui.showLoginScreen();
    });

    client.onDisconnect((client) => {
        ui.showLoginScreen();
        ui.hideCanvas();
        ui.addErrorMessage("Disconnected from server.");
    });


    ui.onLoginSubmit((username) => {
        ui.hideLoginScreen();
        ui.showCanvas();
        client.login(username);
        ui.chat().setCurrentUsername(username);
        ui.resizeUI();
    });
});