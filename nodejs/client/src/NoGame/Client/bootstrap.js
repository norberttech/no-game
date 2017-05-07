"use strict";

import Client from './Client';
import Kernel from './Kernel';
import {PathFinder} from 'nogame-common';
import UserInterface from './UserInterface';
import Engine from './Gfx/Engine';
import Canvas from './Gfx/Canvas';
import SpriteMap from './Gfx/SpriteMap';
import SpriteFile from './Gfx/SpriteFile';
import KeyBoard from './Input/KeyBoard';
import Mouse from './Input/Mouse';
import ProtocolFactory from './ProtocolFactory';

window.location.getParameter = function(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
    let results = regex.exec(url);

    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

window.location.hasParameter = function(name) {
    return this.getParameter(name) !== null;
};

if (window.document.readyState == 'loading') {
    window.document.addEventListener("DOMContentLoaded", (event) => {
        initialize();
    });
} else {
    initialize();
}

function initialize()
{
    let spriteMap = new SpriteMap();
    spriteMap.add(new SpriteFile("grounds", "assets/sprites/grounds.png", 1));
    let mouse = new Mouse();
    let keyboard = new KeyBoard();
    let protocolFactory = new ProtocolFactory(
        window.location.hasParameter('test')
    );

    let gfx = new Engine(
        new Canvas(window.document.getElementById('game-canvas')),
        (callback) => { window.requestAnimationFrame(callback); },
        spriteMap,
        mouse
    );
    let pathFinder = new PathFinder();
    let client = new Client(
        window.Settings.host,
        new Kernel(gfx, pathFinder),
        keyboard,
        mouse,
        protocolFactory
    );
    let ui = new UserInterface(window.document, keyboard, mouse);

    ui.bindWindowResize();
    ui.bindArrows();
    ui.bindMouse();

    client.connect().then((connectedClient) => {
        ui.showLoginScreen();

        ui.onSay((message) => {
            connectedClient.protocol.say(message);
        });

        ui.onLoginSubmit((username) => {
            ui.hideLoginScreen();
            ui.showCanvas();
            connectedClient.protocol.login(username);
            ui.chat().setCurrentUsername(username);
        });

        connectedClient.protocol.onCharacterSay((characterName, message) => {
            ui.chat().addMessage(new Date(), characterName, message);
        });

        connectedClient.onLogin(() => {
            setTimeout(() => {
                ui.resizeUI();
            }, 100);
        });

        connectedClient.onLogout((reason) => {
            ui.hideCanvas();
            ui.showLoginScreen();
            ui.addErrorMessage(reason);
        });

        connectedClient.onDisconnect((client) => {
            ui.showLoginScreen();
            ui.hideCanvas();
            ui.addErrorMessage("Disconnected from server.");
        });
    }).catch((client) => {
        ui.addErrorMessage("Can't connect to the server.");
    });
}