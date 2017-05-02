import Jasmine from 'jasmine';

const jasmine = new Jasmine();
jasmine.loadConfigFile('./spec/support/client.json');
jasmine.execute();