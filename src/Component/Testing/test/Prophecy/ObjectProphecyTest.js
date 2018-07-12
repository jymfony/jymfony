const ArgumentsWildcard = Jymfony.Component.Testing.Argument.ArgumentsWildcard;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const CallCenter = Jymfony.Component.Testing.Call.CallCenter;
const MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;
const AggregateException = Jymfony.Component.Testing.Exception.Prediction.AggregateException;
const ProphecyInterface = Jymfony.Component.Testing.Prophecy.ProphecyInterface;
const Doubler = Jymfony.Component.Testing.Double.Doubler;
const MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
const ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;
const Revealer = Jymfony.Component.Testing.Prophecy.Revealer;
const Prophet = Jymfony.Component.Testing.Prophet;

const expect = require('chai').expect;

describe('[Testing] ObjectProphecy', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.Testing.Double.Doubler|Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._doubler = this._prophet.prophesize(Doubler);

        /**
         * @type {Jymfony.Component.Testing.Prophecy.Revealer|Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._revealer = this._prophet.prophesize(Revealer);
        const method = new MethodProphecy(this._revealer, 'reveal', [ Argument.any() ]);
        method.willReturnArgument(0);

        /**
         * @type {Jymfony.Component.Testing.Call.CallCenter|Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._callCenter = this._prophet.prophesize(CallCenter);

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._objectProphecy = new ObjectProphecy(this._doubler.reveal(), this._revealer.reveal(), this._callCenter.reveal());
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('is a ProphecyInterface', () => {
        expect(this._objectProphecy instanceof ProphecyInterface).to.be.true;
    });

    it('should set the super class on willExtend', () => {
        this._doubler.superClass('123').shouldBeCalled();
        this._objectProphecy.willExtend('123');
    });

    it('should add an interface on willImplement', () => {
        this._doubler.addInterface('222').shouldBeCalled();
        this._objectProphecy.willImplement('222');
    });

    it('should set constructor arguments on willBeConstructedWith', () => {
        this._doubler.constructorArguments([ 2, 5, 4 ]).shouldBeCalled();
        this._objectProphecy.willBeConstructedWith([ 2, 5, 4 ]);
    });

    it('should not have any method prophecy', () => {
        expect(this._objectProphecy.getMethodProphecies()).to.be.empty;
    });

    it('should get method prophecy by method name', () => {
        const method1 = this._prophet.prophesize(MethodProphecy);
        method1.methodName().willReturn('getName');
        method1.argumentsWildcard().willReturn(this._prophet.prophesize(ArgumentsWildcard));

        const method2 = this._prophet.prophesize(MethodProphecy);
        method2.methodName().willReturn('setName');
        method2.argumentsWildcard().willReturn(this._prophet.prophesize(ArgumentsWildcard));

        this._objectProphecy.addMethodProphecy(method1.reveal());
        this._objectProphecy.addMethodProphecy(method2.reveal());

        const methods = this._objectProphecy.getMethodProphecies('getName');
        expect(methods).to.have.length(1);
        expect(methods[0]).to.be.equal(method1.reveal());
    });

    it('should return an empty array if no prophecy is found', () => {
        expect(this._objectProphecy.getMethodProphecies('setName')).to.be.empty;
    });

    it('should proxy method call to call center', () => {
        this._callCenter.makeCall(this._objectProphecy.reveal(), 'setName', [ 'alekitto' ])
            .shouldBeCalled();

        this._objectProphecy.makeProphecyMethodCall('setName', [ 'alekitto' ]);
    });

    it('should reveal method arguments and return value', () => {
        let method = new MethodProphecy(this._revealer, 'reveal', [ 'question' ]);
        method.willReturn('life');

        method = new MethodProphecy(this._revealer, 'reveal', [ 'answer' ]);
        method.willReturn(42);

        this._callCenter.makeCall(this._objectProphecy, 'setName', 'life').willReturn('answer');

        expect(this._objectProphecy.makeProphecyMethodCall('setName', [ 'question' ])).to.be.equal(42);
    });

    it('should retrieve calls from call center', () => {
        this._callCenter.findCalls('setName', new ArgumentsWildcard([ 'alekitto' ]))
            .shouldBeCalled();

        this._objectProphecy.findProphecyMethodCalls('setName', new ArgumentsWildcard([ 'alekitto' ]));
    });

    it('addMethodProphecy adds the prophecy', () => {
        const methodProphecy = this._prophet.prophesize(MethodProphecy);
        methodProphecy.methodName().willReturn('setName');
        methodProphecy.argumentsWildcard().willReturn(new ArgumentsWildcard([ 'foobar' ]));

        this._objectProphecy.addMethodProphecy(methodProphecy.reveal());

        expect(this._objectProphecy.methodProphecies).to.be.deep.equal({
            'setName': [ methodProphecy.reveal() ],
        });
    });

    it('addMethodProphecy should throw if no arguments wildcard is set', () => {
        const methodProphecy = this._prophet.prophesize(MethodProphecy);
        methodProphecy.methodName().willReturn('setName');
        methodProphecy.argumentsWildcard().willReturn(undefined);
        methodProphecy.objectProphecy().willReturn(this._objectProphecy);

        expect(this._objectProphecy.addMethodProphecy.bind(this._objectProphecy, methodProphecy.reveal()))
            .to.throw(MethodProphecyException);
    });

    it('checkProphecyMethodsPredictions should do nothing if no propehcy has been added', () => {
        expect(this._objectProphecy.checkProphecyMethodsPredictions()).to.be.undefined;
    });

    it('checkProphecyMethodsPredictions should throw AggregateException if prophecy fails', () => {
        const method1 = this._prophet.prophesize(MethodProphecy);
        method1.methodName().willReturn('getName');
        method1.argumentsWildcard().willReturn(this._prophet.prophesize(ArgumentsWildcard));
        method1.checkPrediction().willThrow(new AggregateException());

        const method2 = this._prophet.prophesize(MethodProphecy);
        method2.methodName().willReturn('setName');
        method2.argumentsWildcard().willReturn(this._prophet.prophesize(ArgumentsWildcard));
        method2.checkPrediction().willReturn();

        this._objectProphecy.addMethodProphecy(method1.reveal());
        this._objectProphecy.addMethodProphecy(method2.reveal());

        expect(this._objectProphecy.checkProphecyMethodsPredictions.bind(this._objectProphecy))
            .to.throw(AggregateException);
    });

    it('returns a new MethodProphecy for arbitrary call', () => {
        this._doubler.getInstance().willReturn(new class {
            getFoo() { }
        }());

        const retVal = this._objectProphecy.getFoo();

        expect(retVal).to.be.instanceOf(MethodProphecy);
        expect(retVal.methodName).to.be.equal('getFoo');
    });

    it('returns the same MethodProphecy for same signature', () => {
        this._doubler.getInstance().willReturn(new class {
            getFoo() { }
        }());

        const method1 = this._objectProphecy.getFoo(1, 2, 3);
        this._objectProphecy.addMethodProphecy(method1);

        const method2 = this._objectProphecy.getFoo(1, 2, 3);
        expect(method2).to.be.equal(method1);
    });

    it('returns the different MethodProphecy for different signatures', () => {
        this._doubler.getInstance().willReturn(new class {
            getFoo() { }
        }());

        const method1 = this._objectProphecy.getFoo(1, 2, 3, { val: 'foo' });
        this._objectProphecy.addMethodProphecy(method1);

        const method2 = this._objectProphecy.getFoo(1, 2, 3, { val: 'bar' });
        expect(method2).not.to.be.equal(method1);
    });

    it('returns the different MethodProphecy for different callbacks', () => {
        this._doubler.getInstance().willReturn(new class {
            getFoo() { }
        }());

        const method1 = this._objectProphecy.getFoo(() => {});
        this._objectProphecy.addMethodProphecy(method1);

        const method2 = this._objectProphecy.getFoo(() => {});
        expect(method2).not.to.be.equal(method1);
    });
});
