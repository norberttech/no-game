"use strict";

import Client from './Client';
import Kernel from './Kernel';
import UserInterface from './UserInterface';
import Engine from './Gfx/Engine';
import Canvas from './Gfx/Canvas';
import SpriteMap from './Gfx/SpriteMap';
import Sprite from './Gfx/Sprite';

window.document.addEventListener("DOMContentLoaded", (event) => {
    let spriteMap = new SpriteMap();
    spriteMap.add(new Sprite("grounds", "assets/sprites/grounds.png", 0));

    let gfx = new Engine(
        new Canvas(window.document.getElementById('game-canvas')),
        (callback) => { window.requestAnimationFrame(callback); },
        spriteMap
    );
    let client = new Client('ws://localhost:8080/', new Kernel(gfx));
    let ui = new UserInterface(window.document);

    client.connect((client) => {
        ui.showLoginScreen();
    });

    client.onDisconnect((client) => {
        ui.showLoginScreen();
        ui.addErrorMessage("Disconnected from server.");
    });


    ui.onLoginSubmit((username) => {
        ui.hideLoginScreen();
        client.login(username);
    });
});