const Argument = Jymfony.Component.Testing.Argument;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;
const MethodNotFoundException = Jymfony.Component.Testing.Exception.MethodNotFoundException;
const Promise = Jymfony.Component.Testing.Promise;
const Prediction = Jymfony.Component.Testing.Prediction;

/**
 * @memberOf Jymfony.Component.Testing.Prophecy
 */
class MethodProphecy {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} objectProphecy
     * @param {string} methodName
     * @param {undefined|[*]} args
     */
    __construct(objectProphecy, methodName, args = undefined) {
        const reflection = new ReflectionClass(objectProphecy.reveal());
        if (! reflection.hasMethod(methodName) && ! reflection.hasProperty(methodName)) {
            throw new MethodNotFoundException(__jymfony.sprintf(
                'Method `%s:%s()` is not defined.', reflection.name, methodName
            ), reflection.name, methodName, args);
        }

        this._objectProphecy = objectProphecy;
        this._methodName = methodName;
        this._args = undefined;

        this._prediction = undefined;
        this._checkedPredictions = [];

        this._bound = false;

        if (undefined !== args) {
            this.withArguments(args);
        }
    }

    /**
     * Gets the method name.
     *
     * @returns {string}
     */
    get methodName() {
        return this._methodName;
    }

    /**
     * Gets the arguments wildcard for this prophecy.
     *
     * @returns {undefined|Jymfony.Component.Testing.Argument.ArgumentsWildcard}
     */
    get argumentsWildcard() {
        return this._args;
    }

    /**
     * Returns object prophecy this method prophecy is tied to.
     *
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    get objectProphecy() {
        return this._objectProphecy;
    }

    /**
     * Gets the promise tied to this method prophecy.
     *
     * @returns {undefined|Jymfony.Component.Testing.Promise.PromiseInterface}
     */
    get promise() {
        return this._promise;
    }

    /**
     * Gets the checked predictions for this prophecy.
     *
     * @returns {[Jymfony.Component.Testing.Prediction.PredictionInterface]}
     */
    get checkedPredictions() {
        return [ ...this._checkedPredictions ];
    }

    /**
     * Sets argument wildcard.
     *
     * @param {[*]|Jymfony.Component.Testing.Argument.ArgumentsWildcard} args
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     *
     * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
     */
    withArguments(args) {
        if (isArray(args)) {
            args = new Argument.ArgumentsWildcard(this._objectProphecy.revealer.reveal(args));
        }

        if (! (args instanceof Argument.ArgumentsWildcard)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'Either an array or an instance of ArgumentsWildcard expected as\n' +
                'a `MethodProphecy::withArguments()` argument, but got %s.',
                typeof args
            ));
        }

        this._args = args;

        return this;
    }

    /**
     * Sets custom promise to the prophecy.
     *
     * @param {Function|Jymfony.Component.Testing.Promise.PromiseInterface} promise
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     *
     * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
     */
    will(promise) {
        if (isFunction(promise)) {
            promise = new Promise.CallbackPromise(promise);
        }

        if (! (promise instanceof Promise.PromiseInterface)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'Expected callable or instance of PromiseInterface, but got %s.',
                typeof promise
            ));
        }

        this._bindToObjectProphecy();
        this._promise = promise;

        return this;
    }

    /**
     * Sets return promise to the prophecy.
     *
     * @param {[*]} $args
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    willReturn(...$args) {
        this.will(new Promise.ReturnPromise($args));

        return this;
    }

    /**
     * Sets return argument promise to the prophecy.
     *
     * @param {int} index
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    willReturnArgument(index) {
        this.will(new Promise.ReturnArgumentPromise(index));

        return this;
    }

    /**
     * Sets return "this" (the object) promise to the prophecy.
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    willReturnThis() {
        this.will(new Promise.ReturnThisPromise());

        return this;
    }

    /**
     * Sets throw promise to the prophecy.
     *
     * @param {Function|Error} exception
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    willThrow(exception) {
        this.will(new Promise.ThrowPromise(exception));

        return this;
    }

    /**
     * Sets custom prediction to the prophecy.
     *
     * @param {Function|Jymfony.Component.Testing.Prediction.PredictionInterface} prediction
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     *
     * @throws {Jymfony.Component.Testing.Prophecy.Exception.InvalidArgumentException}
     */
    should(prediction) {
        if (isFunction(prediction)) {
            prediction = new Prediction.CallbackPrediction(prediction);
        }

        if (! (prediction instanceof Prediction.PredictionInterface)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'Expected callable or instance of PredictionInterface, but got %s.',
                typeof prediction
            ));
        }

        this._bindToObjectProphecy();
        this._prediction = prediction;

        return this;
    }

    /**
     * Sets call prediction to the prophecy.
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    shouldBeCalled() {
        return this.should(new Prediction.CallPrediction());
    }

    /**
     * Sets no calls prediction to the prophecy.
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    shouldNotBeCalled() {
        return this.should(new Prediction.NoCallsPrediction());
    }

    /**
     * Sets call times prediction to the prophecy.
     *
     * @param {int} count
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    shouldBeCalledTimes(count) {
        return this.should(new Prediction.CallTimesPrediction(count));
    }

    /**
     * Checks provided prediction immediately.
     *
     * @param {Function|Jymfony.Component.Testing.Prediction.PredictionInterface} prediction
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     *
     * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
     */
    shouldHave(prediction) {
        if (isFunction(prediction)) {
            prediction = new Prediction.CallbackPrediction(prediction);
        }

        if (! (prediction instanceof Prediction.PredictionInterface)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'Expected callable or instance of PredictionInterface, but got %s.',
                typeof prediction
            ));
        }

        if (undefined === this._promise) {
            this.willReturn();
        }

        const calls = this._objectProphecy.findProphecyMethodCalls(this._methodName, this._args);

        try {
            prediction.check(calls, this._objectProphecy, this);
        } catch (err) {
            throw err;
        } finally {
            this._checkedPredictions.push(prediction);
        }

        return this;
    }

    /**
     * Checks call prediction.
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    shouldHaveBeenCalled() {
        return this.shouldHave(new Prediction.CallPrediction());
    }

    /**
     * Checks no calls prediction.
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    shouldNotHaveBeenCalled() {
        return this.shouldHave(new Prediction.NoCallsPrediction());
    }

    /**
     * Checks call times prediction.
     *
     * @param {int} count
     *
     * @returns {Jymfony.Component.Testing.Prophecy.MethodProphecy}
     */
    shouldHaveBeenCalledTimes(count) {
        return this.shouldHave(new Prediction.CallTimesPrediction(count));
    }

    /**
     * Checks currently registered [with should(...)] prediction.
     */
    checkPrediction() {
        if (undefined === this._prediction) {
            return;
        }

        this.shouldHave(this._prediction);
    }

    _bindToObjectProphecy() {
        if (this._bound) {
            return;
        }

        this._objectProphecy.addMethodProphecy(this);
        this._bound = true;
    }
}

module.exports = MethodProphecy;
