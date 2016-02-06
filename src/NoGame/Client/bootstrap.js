"use strict";

import Client from './Client';
import Engine from './Gfx/Engine';
import Canvas from './Gfx/Canvas';

window.document.addEventListener("DOMContentLoaded", function(event) {
    let gfx = new Engine(
        new Canvas(window.document.getElementById('game-canvas')),
        (callback) => { window.requestAnimationFrame(callback); }
    );
    let client = new Client('ws://localhost:8080/', gfx);
    client.connect();
});