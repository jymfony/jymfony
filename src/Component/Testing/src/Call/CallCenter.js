const Call = Jymfony.Component.Testing.Call.Call;
const UnexpectedCallException = Jymfony.Component.Testing.Exception.UnexpectedCallException;
const StringUtil = Jymfony.Component.Testing.Util.StringUtil;

/**
 * @memberOf Jymfony.Component.Testing.Call
 */
export default class CallCenter {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.Testing.Call.Call[]}
         *
         * @private
         */
        this._recordedCalls = [];
    }

    /**
     * Makes and records specific method call for object prophecy.
     *
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} prophecy
     * @param {string} methodName
     * @param {*[]} args
     *
     * @returns {*} Returns null if no promise for prophecy found or promise return value.
     *
     * @throws {Jymfony.Component.Testing.Exception.UnexpectedCallException} If no appropriate method prophecy found
     */
    makeCall(prophecy, methodName, args) {
        const backtrace = (new Exception()).stackTrace;
        const file = backtrace[3].file, line = backtrace[3].line;

        if (0 === Object.values(prophecy.methodProphecies).length) {
            this._recordedCalls.push(new Call(methodName, args, undefined, undefined, file, line));

            return undefined;
        }

        const matches = [];
        for (const methodProphecy of prophecy.getMethodProphecies(methodName)) {
            let score;
            if (0 < (score = methodProphecy.argumentsWildcard.scoreArguments(args))) {
                matches.push([ score, methodProphecy ]);
            }
        }

        if (0 === matches.length) {
            throw this.createUnexpectedCallException(prophecy, methodName, args);
        }

        matches.sort((match1, match2) => match2[0] - match1[0]);

        const methodProphecy = matches[0][1];
        let returnValue = undefined;
        let exception = undefined;
        let promise;
        if (promise = methodProphecy.promise) {
            try {
                returnValue = promise.execute(args, prophecy, methodProphecy);
            } catch (e) {
                exception = e;
            }
        }

        this._recordedCalls.push(new Call(
            methodName, args, returnValue, exception, file, line
        ));

        if (undefined !== exception) {
            throw exception;
        }

        return returnValue;
    }

    /**
     * Searches for calls by method name & arguments wildcard.
     *
     * @param {string} methodName
     * @param {Jymfony.Component.Testing.Argument.ArgumentsWildcard} wildcard
     *
     * @returns {Jymfony.Component.Testing.Call.Call[]}
     */
    findCalls(methodName, wildcard) {
        return this._recordedCalls
            .filter(call => call.methodName === methodName && 0 < wildcard.scoreArguments(call.args))
        ;
    }

    /**
     * Creates an unexpected call exception.
     *
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} prophecy
     * @param {string} methodName
     * @param {*[]} args
     *
     * @returns {Jymfony.Component.Testing.Exception.UnexpectedCallException}
     */
    createUnexpectedCallException(prophecy, methodName, args) {
        const className = (new ReflectionClass(prophecy.reveal())).name;
        const argumentList = args.map(StringUtil.stringify).join(', ');
        const expected = prophecy.getMethodProphecies().map(
            /** Jymfony.Component.Testing.Prophecy.MethodProphecy */ methodProphecy => {
                return __jymfony.sprintf('  - %s(%s)',
                    methodProphecy.methodName,
                    methodProphecy.argumentsWildcard.toString()
                );
            }
        ).join('\n');

        return new UnexpectedCallException(
            __jymfony.sprintf(
                'Method call:\n' +
                '  - %s(%s)\n' +
                'on %s was not expected, expected calls were:\n%s\n',
                methodName, argumentList, className, expected
            ),
            prophecy, methodName, args
        );
    }
}
