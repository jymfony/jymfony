require('./src/Component/Autoloader');

const Debug = Jymfony.Component.Debug.Debug;
Debug.enable();

require('mocha/bin/_mocha');
