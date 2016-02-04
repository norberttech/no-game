'use strict';

import Kernel from './../Engine/Kernel';
import Server from './Server';

let kernel = new Kernel();
kernel.boot();

let server = new Server(kernel);
server.listen();


