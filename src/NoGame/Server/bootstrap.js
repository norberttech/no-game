'use strict';

import Kernel from './../Engine/Kernel';
import Server from './Server';
import Logger from './../Common/Logger';
import fs from 'fs';

let parametersFilePath = __dirname + '/parameters.json';
console.log(parametersFilePath);

let config = (fs.existsSync(parametersFilePath))
    ? JSON.parse(fs.readFileSync(parametersFilePath))
    : {port: 8080, logLevel: "info"};

let logger = new Logger(config.logLevel);

let kernel = new Kernel(logger);
kernel.boot();

let server = new Server(kernel, logger);
server.listen(config.port);


