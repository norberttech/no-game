"use strict";

import Client from './Client';
import Kernel from './Kernel';
import PathFinder from './../Common/PathFinder';
import UserInterface from './UserInterface';
import Engine from './Gfx/Engine';
import Canvas from './Gfx/Canvas';
import SpriteMap from './Gfx/SpriteMap';
import SpriteFile from './Gfx/SpriteFile';
import KeyBoard from './UserInterface/KeyBoard';
import Mouse from './UserInterface/Mouse';

window.document.addEventListener("DOMContentLoaded", (event) => {
    let spriteMap = new SpriteMap();
    spriteMap.add(new SpriteFile("grounds", "assets/sprites/grounds.png", 1));
    let mouse = new Mouse();
    let keyboard = new KeyBoard();

    let gfx = new Engine(
        new Canvas(window.document.getElementById('game-canvas')),
        (callback) => { window.requestAnimationFrame(callback); },
        spriteMap,
        mouse
    );
    let pathFinder = new PathFinder();
    let client = new Client(window.Settings.host, new Kernel(gfx, pathFinder), keyboard, mouse);
    let ui = new UserInterface(window.document, keyboard, mouse);

    ui.bindWindowResize();
    ui.bindArrows();
    ui.bindMouse();

    client.connect().then((client) => {
        ui.showLoginScreen();

        ui.onSay((message) => {
            client.protocol.say(message);
        });

        ui.onLoginSubmit((username) => {
            ui.hideLoginScreen();
            ui.showCanvas();
            client.protocol.login(username);
            ui.chat().setCurrentUsername(username);
        });

        client.protocol.onCharacterSay((characterName, message) => {
            ui.chat().addMessage(new Date(), characterName, message);
        });

        client.onLogin(() => {
            setTimeout(() => {
                ui.resizeUI();
            }, 100);
        });

        client.onLogout((reason) => {
            ui.hideCanvas();
            ui.showLoginScreen();
            ui.addErrorMessage(reason);
        });
    });

    client.onDisconnect((client) => {
        ui.showLoginScreen();
        ui.hideCanvas();
        ui.addErrorMessage("Disconnected from server.");
    });
});