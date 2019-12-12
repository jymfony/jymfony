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

    _getDefaultsParameters() {
        return {
        };
    }
}

module.exports = ProjectContainer;
