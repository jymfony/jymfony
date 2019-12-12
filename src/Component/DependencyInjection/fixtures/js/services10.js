const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;
const path = require('path');

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, this._getDefaultsParameters(), buildParameters)));

        this._methodMap = {
            "test": "getTestService",
        };

        this._aliases = {
        };

        this._privates = {};
    }

    compile() {
        throw new LogicException('You cannot compile a dumped container');
    }

    get frozen() {
        return true;
    }

    /**
     * Gets the public 'test' shared service.
     *
     * @returns {Object}
     */
    getTestService() {
        return this._services["test"] = new Object({"only dot": ".", "concatenation as value": "+\"\"+", "concatenation from the start value": "\"\"+", ".": "dot as a key", "+\"\"+": "concatenation as a key", "\"\"+": "concatenation from the start key", "optimize concatenation": "string1-string2", "optimize concatenation with empty string": "string1string2", "optimize concatenation from the start": "start", "optimize concatenation at the end": "end"});
    }

    _getDefaultsParameters() {
        return {
            "empty_value": "",
            "some_string": "-",
        };
    }
}

module.exports = ProjectContainer;
