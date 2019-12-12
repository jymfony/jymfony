const ExtensionInterface = Jymfony.Component.DependencyInjection.Extension.ExtensionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
export default class ProjectExtension extends implementationOf(ExtensionInterface) {
    load(configs, configuration) {
        configuration.setParameter('project.configs', configs);
        configs = configs.filter(c => !! c);

        let config;
        if (configs.length) {
            config = [ ...configs ];
        } else {
            config = [];
        }

        configuration.register('project.service.bar', 'Jymfony.Component.DependencyInjection.Fixtures.FooClass').setPublic(true);
        configuration.setParameter('project.parameter.bar', config.foo || 'foobar');

        configuration.register('project.service.foo', 'Jymfony.Component.DependencyInjection.Fixtures.FooClass').setPublic(true);
        configuration.setParameter('project.parameter.foo', config.foo || 'foobar');

        return configuration;
    }

    get xsdValidationBasePath() {
        return false;
    }

    get namespace() {
        return 'http://www.example.com/schema/project';
    }

    get alias() {
        return 'project';
    }

    getConfiguration() {
    }
}
