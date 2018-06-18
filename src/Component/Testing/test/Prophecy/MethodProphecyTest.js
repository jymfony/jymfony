const ArgumentsWildcard = Jymfony.Component.Testing.Argument.ArgumentsWildcard;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Call = Jymfony.Component.Testing.Call.Call;
const MethodNotFoundException = Jymfony.Component.Testing.Exception.MethodNotFoundException;
const Promise = Jymfony.Component.Testing.Promise;
const MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
const ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;
const Revealer = Jymfony.Component.Testing.Prophecy.Revealer;
const PredictionInterface = Jymfony.Component.Testing.Prediction.PredictionInterface;
const Prophet = Jymfony.Component.Testing.Prophet;

const expect = require('chai').expect;

describe('[Testing] MethodProphecy', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._objectProphecy = this._prophet.prophesize(ObjectProphecy);

        const reveal = new MethodProphecy(this._objectProphecy, 'reveal', []);
        reveal.willReturn(this._prophet.prophesize(ReflectionClass));

        const revealer = new MethodProphecy(this._objectProphecy, 'revealer', []);
        revealer.willReturn(new Revealer());

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._methodProphecy = new MethodProphecy(this._objectProphecy.reveal(), 'name', undefined);
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('throws on construct with non-existent method', () => {
        expect(() => {
            new MethodProphecy(this._objectProphecy.reveal(), 'nonExistent', undefined);
        }).to.throw(MethodNotFoundException);
    });

    it('converts 3rd constructor argument to ArgumentsWildcard if array', () => {
        this._methodProphecy = new MethodProphecy(this._objectProphecy.reveal(), 'name', [ 42, 47 ]);

        expect(this._methodProphecy.argumentsWildcard).to.be.instanceOf(ArgumentsWildcard);
        expect(this._methodProphecy.argumentsWildcard.toString()).to.be.equal('exact(42), exact(47)');
    });

    it('converts array passed to withArguments method', () => {
        this._methodProphecy.withArguments([ 42, 47 ]);

        expect(this._methodProphecy.argumentsWildcard).to.be.instanceOf(ArgumentsWildcard);
        expect(this._methodProphecy.argumentsWildcard.toString()).to.be.equal('exact(42), exact(47)');
    });

    it('accepts 3rd constructor argument as undefined', () => {
        this._methodProphecy = new MethodProphecy(this._objectProphecy.reveal(), 'name', undefined);

        expect(this._methodProphecy.argumentsWildcard).to.be.undefined;
    });

    it('sets promise through will method', () => {
        const method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        this._methodProphecy.will(() => {});
        expect(this._methodProphecy.promise).to.be.instanceOf(Promise.PromiseInterface);
    });

    it('sets a ReturnPromise through willReturn method', () => {
        const method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        this._methodProphecy.willReturn(42);
        expect(this._methodProphecy.promise).to.be.instanceOf(Promise.ReturnPromise);
    });

    it('sets a ThrowPromise through willThrow method', () => {
        const method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        this._methodProphecy.willThrow(new Error());
        expect(this._methodProphecy.promise).to.be.instanceOf(Promise.ThrowPromise);
    });

    it('sets a ReturnArgumentPromise through willReturnArgument method', () => {
        const method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        this._methodProphecy.willReturnArgument();
        expect(this._methodProphecy.promise).to.be.instanceOf(Promise.ReturnArgumentPromise);
    });

    it('sets a ReturnArgumentPromise with index through willReturnArgument method', () => {
        const method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        this._methodProphecy.willReturnArgument(1);
        expect(this._methodProphecy.promise).to.be.instanceOf(Promise.ReturnArgumentPromise);
        expect(this._methodProphecy.promise.execute([ 'one', 'two' ])).to.be.equal('two');
    });

    it('sets a ReturnThisPromise through willReturnThis method', () => {
        const method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        this._methodProphecy.willReturnThis();
        expect(this._methodProphecy.promise).to.be.instanceOf(Promise.ReturnThisPromise);
        expect(this._methodProphecy.promise.execute([], this._objectProphecy.reveal())).to.be.equal(this._objectProphecy.reveal());
    });

    it('sets a CallbackPromise through will method with callback argument', () => {
        const method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        this._methodProphecy.will(() => {});
        expect(this._methodProphecy.promise).to.be.instanceOf(Promise.CallbackPromise);
    });

    it('sets prediction through should method', () => {
        let method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        method = new MethodProphecy(this._objectProphecy, 'findProphecyMethodCalls', [ 'name', Argument.any() ]);
        method.willReturn([]);

        let called = false;
        this._methodProphecy.should(() => {
            called = true;
        });

        this._methodProphecy.checkPrediction();
        expect(called).to.be.true;
    });

    it('shouldHave method should check prediction immediately', () => {
        let method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        method = new MethodProphecy(this._objectProphecy, 'findProphecyMethodCalls', [ 'name', Argument.any() ]);
        method.willReturn([]);

        let called = false;
        this._methodProphecy.shouldHave(() => {
            called = true;
        });

        expect(called).to.be.true;
    });

    it('should record checked predictions', () => {
        let method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        method = new MethodProphecy(this._objectProphecy, 'findProphecyMethodCalls', [ 'name', Argument.any() ]);
        method.willReturn([]);

        const prediction1 = this._prophet.prophesize(PredictionInterface);
        const prediction2 = this._prophet.prophesize(PredictionInterface);

        this._methodProphecy.shouldHave(prediction1.reveal());
        this._methodProphecy.shouldHave(prediction2.reveal());

        expect(this._methodProphecy.checkedPredictions).to.be.deep.equal([ prediction1.reveal(), prediction2.reveal() ]);
    });

    it('should record failed checked predictions', () => {
        let method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        method = new MethodProphecy(this._objectProphecy, 'findProphecyMethodCalls', [ 'name', Argument.any() ]);
        method.willReturn([]);

        const prediction = this._prophet.prophesize(PredictionInterface);
        prediction.check(Argument.cetera()).willThrow(new RuntimeException());

        try {
            this._methodProphecy.shouldHave(prediction.reveal());
        } catch (e) { }

        expect(this._methodProphecy.checkedPredictions).to.be.deep.equal([ prediction.reveal() ]);
    });

    it('should check set prediction during checkPrediction', () => {
        let method = new MethodProphecy(this._objectProphecy, 'addMethodProphecy', [ this._methodProphecy ]);
        method.willReturnThis().shouldBeCalled();

        const call1 = this._prophet.prophesize(Call);
        const call2 = this._prophet.prophesize(Call);

        method = new MethodProphecy(this._objectProphecy, 'findProphecyMethodCalls', [ 'name', Argument.any() ]);
        method.willReturn([ call1, call2 ]);

        const prediction = this._prophet.prophesize(PredictionInterface);
        prediction.check([ call1, call2 ], this._objectProphecy.reveal(), this._methodProphecy).shouldBeCalled();

        this._methodProphecy.should(prediction.reveal());
        this._methodProphecy.checkPrediction();
    });
});
