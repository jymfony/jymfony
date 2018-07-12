const AggregateException = Jymfony.Component.Testing.Exception.Prediction.AggregateException;
const PredictionException = Jymfony.Component.Testing.Exception.Prediction.PredictionException;
const ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

/**
 * @memberOf Jymfony.Component.Testing
 */
class Prophet {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy[]}
         *
         * @private
         */
        this._prophecies = [];
    }

    /**
     * Creates new object prophecy.
     *
     * @param {undefined|string} classOrInterface
     *
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    prophesize(classOrInterface = undefined) {
        const prophecy = new ObjectProphecy();

        if (undefined !== classOrInterface && ReflectionClass.exists(classOrInterface)) {
            const reflClass = new ReflectionClass(classOrInterface);
            if (reflClass.isInterface) {
                prophecy.willImplement(classOrInterface);
            } else {
                prophecy.willExtend(classOrInterface);
            }
        }

        this._prophecies.push(prophecy);

        return prophecy;
    }

    /**
     * Checks all predictions defined by prophecies of this Prophet.
     *
     * @throws {Jymfony.Component.Testing.Exception.Prediction.AggregateException} If any prediction fails
     */
    checkPredictions() {
        let exception = undefined;
        for (const prophecy of this._prophecies) {
            try {
                prophecy.checkProphecyMethodsPredictions();
            } catch (e) {
                if (! (e instanceof PredictionException)) {
                    throw e;
                }

                if (undefined === exception) {
                    exception = new AggregateException('Some predictions failed:\n');
                }

                exception.append(e);
            }
        }

        if (exception) {
            throw exception;
        }
    }
}

module.exports = Prophet;
