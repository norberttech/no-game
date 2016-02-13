"use strict";

import fs from 'fs';

let mapData = {
    name: "Testera",
    x: 100,
    y: 100,
    spawnPosition: {
        x: 50,
        y: 50
    },
    tiles: []
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

for (let x = 0; x < mapData.x; x++) {
    for (let y = 0; y < mapData.y; y++) {
        let ground = (x !== 55 && x !== 56)
            ? {id: randomInt(1, 3), blocking: false}
            : {id: 11, blocking: true};

        let tile = {
            x: x,
            y: y,
            ground: ground
        };

        mapData.tiles.push(tile);
    }
}

fs.writeFile(__dirname + "/testera.json", JSON.stringify(mapData));