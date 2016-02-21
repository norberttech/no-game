'use strict';

import Kernel from './../Engine/Kernel';
import Server from './Server';
import fs from 'fs';

var parametersFilePath = __dirname + '/parameters.json';
let config = fs.exists(parametersFilePath)
    ? fs.read(parametersFilePath)
    : {port: 8080, debug: true};

let kernel = new Kernel();
kernel.boot();

let server = new Server(kernel, config.debug);
server.listen(config.port);


