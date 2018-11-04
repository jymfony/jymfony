const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;

class DumpedContainer extends AbstractContainer {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, DumpedContainer._getDefaultsParameters(), buildParameters)));

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

    static _getDefaultsParameters() {
        return {
        };
    }
}

module.exports = DumpedContainer;
