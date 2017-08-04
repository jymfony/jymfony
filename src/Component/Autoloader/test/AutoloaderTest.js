const expect = require('chai').expect;

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
const Autoloader = require('../src/Autoloader');
const path = require('path');

describe('[Autoloader] Autoloader', () => {
    it('autoloader should be a singleton', () => {
        let glob = {};
        let autoloader = new Autoloader({}, glob);

        expect(new Autoloader({}, glob)).to.be.equal(autoloader);
        expect(glob.__jymfony.autoload).to.be.equal(autoloader);
    });
});
