require('../../lib/Object/serialize');

const Namespace = Jymfony.Component.Autoloader.Namespace;
const expect = require('chai').expect;
const path = require('path');

global.UtilFixtures = new Namespace(__jymfony.autoload, 'UtilFixtures', [
    path.join(__dirname, '..', '..', 'fixtures'),
]);

describe('Serialize', function () {
    it('should serialize undefined', () => {
        expect(__jymfony.serialize(undefined)).to.be.equal('U');
    });

    it('should serialize null', () => {
        expect(__jymfony.serialize(null)).to.be.equal('N');
    });

    it('should serialize booleans', () => {
        expect(__jymfony.serialize(true)).to.be.equal('B:1');
        expect(__jymfony.serialize(false)).to.be.equal('B:0');
    });

    it('should serialize numbers', () => {
        expect(__jymfony.serialize(0)).to.be.equal('D(1):0');
        expect(__jymfony.serialize(42)).to.be.equal('D(2):42');
        expect(__jymfony.serialize(47.3)).to.be.equal('D(4):47.3');
    });

    it('should serialize strings', () => {
        expect(__jymfony.serialize('')).to.be.equal('S(2):""');
        expect(__jymfony.serialize('hello world')).to.be.equal('S(13):"hello world"');
    });

    it('should serialize arrays', () => {
        expect(__jymfony.serialize([ 1, 1.1, 'hallo', null, true, [] ]))
            .to.be.equal('A(6):{0:D(1):1;1:D(3):1.1;2:S(7):"hallo";3:N;4:B:1;5:A(0):{};}');
    });

    it('should serialize object literals', () => {
        expect(__jymfony.serialize({a: 1, b: 1.1, c: 'hallo', d: null, e: true, f: []}))
            .to.be.equal('O(6):{S(3):"a":D(1):1;S(3):"b":D(3):1.1;S(3):"c":S(7):"hallo";S(3):"d":N;S(3):"e":B:1;S(3):"f":A(0):{};}');
    });

    it('should serialize objects', () => {
        expect(__jymfony.serialize(new UtilFixtures.BarClass()))
            .to.be.equal('C[UtilFixtures.BarClass]:{S(7):"hello":S(7):"world";}');

        const foo = new UtilFixtures.FooClass();
        expect(__jymfony.serialize(foo))
            .to.be.equal('C[UtilFixtures.FooClass]:{S(3):"a":S(7):"hello";S(3):"c":S(7):"world";}');
        expect(foo.sleepCalled).to.be.true;
    });
});
