const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;
const path = require('path');

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, this._getDefaultsParameters(), buildParameters)));

        this._methodMap = {
            "Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber": "getJymfony_Component_DependencyInjection_Fixtures_TestServiceSubscriberService",
            "foo_service": "getFooServiceService",
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
     * Gets the public 'Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber}
     */
    getJymfony_Component_DependencyInjection_Fixtures_TestServiceSubscriberService() {
        return this._services["Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber"] = new Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber();
    }

    /**
     * Gets the public 'foo_service' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber}
     */
    getFooServiceService() {
        return this._services["foo_service"] = new Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber(getCallableFromArray([new Jymfony.Component.DependencyInjection.ServiceLocator({"bar": () => {
            return (this._privates["Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition"] || this.getJymfony_Component_DependencyInjection_Fixtures_CustomDefinitionService());
        }, "baz": () => {
            return (this._privates["Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition"] || this.getJymfony_Component_DependencyInjection_Fixtures_CustomDefinitionService());
        }, "Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition": () => {
            return (this._privates["Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition"] || this.getJymfony_Component_DependencyInjection_Fixtures_CustomDefinitionService());
        }, "Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber": () => {
            return (this._services["Jymfony.Component.DependencyInjection.Fixtures.TestServiceSubscriber"] || this.getJymfony_Component_DependencyInjection_Fixtures_TestServiceSubscriberService());
        }}), '_withContext'])("foo_service", this));
    }

    /**
     * Gets the 'Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition' shared service.
     *
     * @returns {Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition}
     */
    getJymfony_Component_DependencyInjection_Fixtures_CustomDefinitionService() {
        return this._privates["Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition"] = new Jymfony.Component.DependencyInjection.Fixtures.CustomDefinition();
    }

    _getDefaultsParameters() {
        return {
        };
    }
}

module.exports = ProjectContainer;
