const Prophet = Jymfony.Component.Testing.Prophet;
const ArgumentsWildcard = Jymfony.Component.Testing.Argument.ArgumentsWildcard;
const AggregateException = Jymfony.Component.Testing.Exception.Prediction.AggregateException;
const ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;
const MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

const { expect } = require('chai');

describe('[Testing] Prophet', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();
    });

    it('prophesize should return a new prophecy', () => {
        const obj = this._prophet.prophesize();
        expect(obj).to.be.instanceOf(ObjectProphecy);
    });

    it('prophesize should construct a new prophecy with parent class if specified', () => {
        const obj = this._prophet.prophesize(Prophet);
        expect(obj.reveal()).to.be.instanceOf(Prophet);
    });

    it('prophesize should construct a new prophecy with interface if specified', () => {
        const obj = this._prophet.prophesize(PromiseInterface);
        expect(obj.reveal()).to.be.instanceOf(PromiseInterface);
    });

    it('checkPredictions should do nothing if no prediction has been defined', () => {
        this._prophet.checkPredictions();
    });

    it('checkPredictions should throw AggregateException if prediction fails', () => {
        const prophet = new Prophet();
        const method1 = prophet.prophesize(MethodProphecy);
        method1.methodName().willReturn('getName');
        method1.argumentsWildcard().willReturn(prophet.prophesize(ArgumentsWildcard));
        method1.checkPrediction().willReturn(null);

        const method2 = prophet.prophesize(MethodProphecy);
        method2.methodName().willReturn('isSet');
        method2.argumentsWildcard().willReturn(prophet.prophesize(ArgumentsWildcard));
        method2.checkPrediction().willThrow(new AggregateException());

        this._prophet.prophesize().addMethodProphecy(method1.reveal());
        this._prophet.prophesize().addMethodProphecy(method2.reveal());

        expect(this._prophet.checkPredictions.bind(this._prophet))
            .to.throw(AggregateException);
    });
});
