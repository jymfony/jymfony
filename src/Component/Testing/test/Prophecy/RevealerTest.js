const Revealer = Jymfony.Component.Testing.Prophecy.Revealer;
const ProphecyInterface = Jymfony.Component.Testing.Prophecy.ProphecyInterface;
const MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
const Prophet = Jymfony.Component.Testing.Prophet;

const expect = require('chai').expect;

describe('[Testing] Revealer', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophecy.Revealer}
         * @private
         */
        this._revealer = new Revealer();

        /**
         * @type {Jymfony.Component.Testing.Prophet}
         * @private
         */
        this._prophet = new Prophet();
    });

    it('reveals a single ProphecyInterface object', () => {
        let obj = this._prophet.prophesize(ProphecyInterface);
        let method = new MethodProphecy(obj, 'reveal', []);
        method.willReturn({ id: 'foobar' });
        obj.addMethodProphecy(method);

        expect(this._revealer.reveal(obj.reveal()))
            .to.be.deep.equal({ id: 'foobar' });
    });
});
