"use strict";

import Client from './Client/Client';
import Kernel from './Client/Kernel';
import PathFinder from './Common/PathFinder';
import UserInterface from './Client/UserInterface';
import Engine from './Client/Gfx/Engine';
import Canvas from './Client/Gfx/Canvas';
import SpriteMap from './Client/Gfx/SpriteMap';
import SpriteFile from './Client/Gfx/SpriteFile';
import KeyBoard from './Client/Input/KeyBoard';
import Mouse from './Client/Input/Mouse';
import ProtocolFactory from './Client/ProtocolFactory';

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
    spriteMap.add(new SpriteFile("grounds", "assets/sprites/grounds.png", 0));
    spriteMap.add(new SpriteFile("walls", "assets/sprites/walls.png", 400));
    spriteMap.add(new SpriteFile("characters", "assets/sprites/characters.png", 800));

    let mouse = new Mouse();
    let keyboard = new KeyBoard();
    let ui = new UserInterface(window.document, keyboard, mouse);
    let protocolFactory = new ProtocolFactory(
        ui,
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

    ui.bindWindowResize();
    ui.bindArrows();
    ui.bindMouse();

    client.connect().then((connectedClient) => {
        ui.showLoginScreen();

        ui.onSay((message) => {
            connectedClient.protocol.say(message);
        });

        ui.onLoginSubmit((username, password) => {
            connectedClient.protocol.login(username, password);
        });

        ui.characterList.onLoginSubmit(() => {
            if (ui.characterList.isCharacterSelected) {
                connectedClient.protocol.loginCharacter(ui.characterList.selectedCharacterId);
            } else {
                ui.addErrorMessage("Please select character first");
            }
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
            ui.characterList.hide();
            ui.addErrorMessage("Disconnected from server.");
        });
    }).catch((client) => {
        ui.addErrorMessage("Can't connect to the server.");
    });
}