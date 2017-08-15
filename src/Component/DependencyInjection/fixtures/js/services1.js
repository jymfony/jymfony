const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct() {
        super.__construct(new FrozenParameterBag(ProjectContainer._getDefaultsParameters()));

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

module.exports = global.ProjectContainer = ProjectContainer;
