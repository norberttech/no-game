'use strict';

import Kernel from './../Engine/Kernel';
import Server from './Server';
import fs from 'fs';

var parametersFilePath = __dirname + '/parameters.json';
console.log(parametersFilePath);

let config = (fs.existsSync(parametersFilePath))
    ? JSON.parse(fs.readFileSync(parametersFilePath))
    : {port: 8080, debug: true};

let kernel = new Kernel();
kernel.boot();

let server = new Server(kernel, config.debug);
server.listen(config.port);


