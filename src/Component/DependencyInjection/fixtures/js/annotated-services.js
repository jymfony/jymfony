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
            "Jymfony.Component.DependencyInjection.Fixtures.AnnotatedBar": "getJymfony_Component_DependencyInjection_Fixtures_AnnotatedBarService",
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
     * Gets the public 'Jymfony.Component.DependencyInjection.Fixtures.AnnotatedBar' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.Fixtures.AnnotatedBar}
     */
    getJymfony_Component_DependencyInjection_Fixtures_AnnotatedBarService() {
        let instance;
        this._services["Jymfony.Component.DependencyInjection.Fixtures.AnnotatedBar"] = instance = new Jymfony.Component.DependencyInjection.Fixtures.AnnotatedBar();

        instance._quz = this;
        instance._debug = true;
        return instance;
    }

    _getDefaultsParameters() {
        return {
            "foo": "bar",
            "baz": "bar",
            "bar": "foo is %foo bar",
            "escape": "@escapeme",
            "values": [true,false,null,0,1000.3,"true","false","null"],
            "kernel.debug": true,
        };
    }
}

module.exports = ProjectContainer;
