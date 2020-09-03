const path = require('path');
const { expect } = require('chai');

const FileLocator = Jymfony.Component.Config.FileLocator;
const LoaderResolver = Jymfony.Component.Config.Loader.LoaderResolver;
const IteratorArgument = Jymfony.Component.DependencyInjection.Argument.IteratorArgument;
const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const JsonFileLoader = Jymfony.Component.DependencyInjection.Loader.JsonFileLoader;
const YamlFileLoader = Jymfony.Component.DependencyInjection.Loader.YamlFileLoader;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const Reference = Jymfony.Component.DependencyInjection.Reference;

const Fixtures = Jymfony.Component.DependencyInjection.Fixtures;
const CaseSensitiveClass = Jymfony.Component.DependencyInjection.Fixtures.CaseSensitiveClass;
const ProjectExtension = Jymfony.Component.DependencyInjection.Fixtures.ProjectExtension;
const fixturesPath = path.join(__dirname, '..', '..', 'fixtures');

describe('[DependencyInjection] YamlFileLoader', function () {
    it ('should throw when loading non-existent file', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/ini'));

        expect(() => loader._loadFile('foo.yml'))
            .to.throw(InvalidArgumentException, /The file ".+" does not exist./);
    });

    it ('should throw when loading invalid yaml file', () => {
        const path = fixturesPath + '/ini';
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(path));

        expect(() => loader._loadFile(path + '/parameters.ini'))
            .to.throw(InvalidArgumentException, /The file ".+" does not contain valid YAML./);
    });

    const invalidFiles = [
        'bad_parameters', 'bad_imports',
        'bad_import', 'bad_services',
        'bad_service', 'bad_calls',
        'bad_format', 'nonvalid1',
        'nonvalid2',
    ];

    for (const file of invalidFiles) {
        it('should throw on invalid file: ' + file, () => {
            const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));

            expect(() => loader.load(file + '.yml')).to.throw(InvalidArgumentException);
        });
    }

    it ('should load parameters', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services2.yml');

        expect(container.parameterBag.all()).to.be.deep.eq({
            'foo': 'bar',
            'mixedcase': {'MixedCaseKey': 'value'},
            'values': [ true, false, 0, 1000.3, Infinity ],
            'bar': 'foo',
            'escape': '@escapeme',
            'foo_bar': new Reference('foo_bar'),
        }, '.load() converts YAML keys to lowercase');
    });

    it ('should load imports', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));

        loader.resolver = new LoaderResolver([
            new JsFileLoader(container, new FileLocator(fixturesPath + '/js')),
            new JsonFileLoader(container, new FileLocator(fixturesPath + '/json')),
            loader,
        ]);

        loader.load('services4.yml');

        const actual = container.parameterBag.all();
        const expected = {
            'foo': 'foo',
            'values': [ true, false ],
            'bar': 'foo',
            'escape': '@escapeme',
            'foo_bar': new Reference('foo_bar'),
            'mixedcase': {'MixedCaseKey': 'value'},
            'imported_from_js': true,
            'imported_from_json': true,
            'with_wrong_ext': 'from json',
        };

        expect(Object.keys(actual)).to.be.deep.eq(Object.keys(expected));
        expect(actual).to.be.deep.eq(expected);

        // Bad import throws no exception due to ignore_errors value.
        loader.load('services4_bad_import.yml');

    });

    it ('should load services', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services6.yml');

        const services = container.getDefinitions();
        expect(Object.keys(services)).to.include('foo', '.load() parses service elements');
        expect(services.not_shared.isShared()).to.be.eq(false, '->load() parses the shared flag');
        expect(services.foo).to.be.instanceOf(Definition, '.load() converts service element to Definition instances');
        expect(services.foo.getClass()).to.be.eq('FooClass', '.load() parses the class attribute');
        expect(services.file.getModule()).to.be.deep.eq([ '%path%/foo.js', undefined ], '.load() parses the module tag');
        expect(services.arguments.getArguments()).to.be.deep.eq([ 'foo', new Reference('foo'), [ true, false ] ], '.load() parses the argument tags');
        expect(services.configurator1.getConfigurator()).to.be.eq('sc_configure', '.load() parses the configurator tag');
        expect(services.configurator2.getConfigurator()).to.be.deep.eq([ new Reference('baz'), 'configure' ], '.load() parses the configurator tag');
        expect(services.configurator3.getConfigurator()).to.be.deep.eq([ 'BazClass', 'configureStatic' ], '.load() parses the configurator tag');
        expect(services.method_call1.getMethodCalls()).to.be.deep.eq([ [ 'setBar', [] ], [ 'setBar', [] ] ], '.load() parses the method_call tag');
        expect(services.method_call2.getMethodCalls()).to.be.deep.eq([ [ 'setBar', [ 'foo', new Reference('foo'), [ true, false ] ] ] ], '.load() parses the method_call tag');
        expect(services.new_factory1.getFactory()).to.be.eq('factory', '.load() parses the factory tag');
        expect(services.new_factory2.getFactory()).to.be.deep.eq([ new Reference('baz'), 'getClass' ], '.load() parses the factory tag');
        expect(services.new_factory3.getFactory()).to.be.deep.eq([ 'BazClass', 'getInstance' ], '.load() parses the factory tag');
        expect(services.new_factory4.getFactory()).to.be.deep.eq([ null, 'getInstance' ], '.load() accepts factory tag without class');
        expect(services.new_factory5.getFactory()).to.be.deep.eq([ new Reference('baz'), '__invoke' ], '.load() accepts service reference as invokable factory');
        expect(services['Acme.WithShortCutArgs'].getArguments()).to.be.deep.eq([ 'foo', new Reference('baz') ], '.load() parses short service definition');

        const aliases = container.getAliases();
        expect(Object.keys(aliases)).to.include('alias_for_foo', '.load() parses aliases');
        expect(aliases.alias_for_foo.toString()).to.be.eq('foo', '.load() parses aliases');
        expect(aliases.alias_for_foo.isPublic()).to.be.false;
        expect(Object.keys(aliases)).to.include('another_alias_for_foo');
        expect(aliases.another_alias_for_foo.toString()).to.be.eq('foo');
        expect(aliases.another_alias_for_foo.isPublic()).to.be.true;
        expect(Object.keys(aliases)).to.include('another_third_alias_for_foo');
        expect(aliases.another_third_alias_for_foo.toString()).to.be.eq('foo');
        expect(aliases.another_third_alias_for_foo.isPublic()).to.be.false;

        expect(services.decorator_service.getDecoratedService()).to.be.deep.eq([ 'decorated', null, 0 ]);
        expect(services.decorator_service_with_name.getDecoratedService()).to.be.deep.eq([ 'decorated', 'decorated.pif-pouf', 0 ]);
        expect(services.decorator_service_with_name_and_priority.getDecoratedService()).to.be.deep.eq([ 'decorated', 'decorated.pif-pouf', 5 ]);
    });

    it ('should set deprecation messages on alias', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('deprecated_alias_definitions.yml');

        expect(container.getAlias('alias_for_foobar').isDeprecated()).to.be.true;
        expect(container.getAlias('alias_for_foobar').getDeprecationMessage('alias_for_foobar'))
            .to.be.eq('The "alias_for_foobar" service alias is deprecated.');
    });

    it ('should load factory short syntax', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services14.yml');

        const services = container.getDefinitions();
        expect(services.factory.getFactory(), '.load() parses the factory tag with service:method').to.be.deep.eq([ new Reference('baz'), 'getClass' ]);
        expect(services.factory_with_static_call.getFactory(), '.load() parses the factory tag with Class.method').to.be.deep.eq([ 'FooBacFactory', 'createFooBar' ]);
        expect(services.invokable_factory.getFactory(), '.load() parses string service reference').to.be.deep.eq([ new Reference('factory'), '__invoke' ]);
    });

    it ('should load configuratro with short syntax', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_configurator_short_syntax.yml');

        const services = container.getDefinitions();
        expect(services.foo_bar.getConfigurator()).to.be.deep.eq([ new Reference('foo_bar_configurator'), 'configure' ], '.load() parses the configurator tag with service:method');
        expect(services.foo_bar_with_static_call.getConfigurator()).to.be.deep.eq([ 'FooBarConfigurator', 'configureFooBar' ], '.load() parses the configurator tag with Class::method');
    });

    it ('should compile extension configuration', () => {
        const container = new ContainerBuilder();
        container.registerExtension(new ProjectExtension());

        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services10.yml');
        container.compile();

        const services = container.getDefinitions();
        const parameters = container.parameterBag.all();

        expect(Object.keys(services)).to.include('project.service.bar', '.load() parses extension elements');
        expect(Object.keys(parameters)).to.include('project.parameter.bar', '.load() parses extension elements');

        expect(services['project.service.foo'].getClass()).to.be.eq('BAR', '.load() parses extension elements');
        expect(parameters['project.parameter.foo']).to.be.eq('BAR', '.load() parses extension elements');

        expect(() => loader.load('services11.yml'))
            .to.throw(InvalidArgumentException,
                /There is no extension able to load the configuration for "foobarfoobar" \(in/,
                '.load() throws an InvalidArgumentException if the tag is not valid');
    });

    it ('should load void extension configuration', () => {
        const container = new ContainerBuilder();
        container.registerExtension(new ProjectExtension());

        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('null_config.yml');
        container.compile();

        expect(container.getParameter('project.configs')).to.be.deep.eq([ null ]);
    });

    it ('should support only yml and yaml files', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));

        expect(loader.supports('foo.yml'), '.supports() returns true if the resource is loadable').to.be.true;
        expect(loader.supports('foo.yaml'), '.supports() returns true if the resource is loadable').to.be.true;
        expect(loader.supports('foo.foo'), '.supports() returns false if the resource is not loadable').to.be.false;
        expect(loader.supports('with_wrong_ext.xml', 'yml'), '.supports() returns true if the resource with forced type is loadable').to.be.true;
        expect(loader.supports('with_wrong_ext.xml', 'yaml'), '.supports() returns true if the resource with forced type is loadable').to.be.true;
    });

    it ('should throw on non array tags', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('badtag1.yml')).to.throw(
            InvalidArgumentException,
            /Parameter "tags" must be an array for service/,
            '.load() throws an InvalidArgumentException if the tags key is not an array'
        );
    });

    it ('should throw on tag without name', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('badtag2.yml')).to.throw(
            InvalidArgumentException,
            /A "tags" entry is missing a "name" key for service /,
            '.load() throws an InvalidArgumentException if a tag is missing the name key'
        );
    });

    it ('should inject tagged iterator argument', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_with_tagged_argument.yml');

        expect(container.getDefinition('foo_service').getTag('foo')).to.have.length(1);
        expect(container.getDefinition('foo_service_tagged_iterator').getArguments()).to.have.length(1);

        const taggedIterator = new TaggedIteratorArgument('foo');
        expect(container.getDefinition('foo_service_tagged_iterator').getArgument(0)).to.be.deep.eq(taggedIterator);
    });

    it ('should accept tags with name only as string', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('tag_name_only.yml');

        expect(container.getDefinition('foo_service').getTag('foo')).to.have.length(1);
    });

    it ('should throw tag with attribute object', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('badtag3.yml')).to.throw(
            InvalidArgumentException,
            /A "tags" attribute must be of a scalar-type for service "foo_service", tag "foo", attribute "bar"/,
            '.load() throws an InvalidArgumentException if a tag-attribute is not a scalar'
        );
    });

    it ('should load yaml only with keys', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services21.yml');

        const definition = container.getDefinition('manager');
        expect(definition.getMethodCalls()).to.be.deep.eq([ [ 'setLogger', [ new Reference('logger') ] ], [ 'setClass', [ 'User' ] ] ]);
        expect(definition.getArguments()).to.be.deep.eq([ true ]);
        expect(definition.getTag('manager')).to.be.deep.eq([ { alias: 'user' } ]);
    });

    it ('should throw on tag with empty name', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('tag_name_empty_string.yml')).to.throw(
            InvalidArgumentException,
            /The tag name for service ".+" in .+ must be a non-empty string/
        );
    });

    it ('should throw on tag with non-string name', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('tag_name_no_string.yml')).to.throw(
            InvalidArgumentException,
            /The tag name for service ".+" in .+ must be a non-empty string/
        );
    });

    it ('should parse iterator argument', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services9.yml');

        const lazyDefinition = container.getDefinition('lazy_context');
        expect(lazyDefinition.getArguments()).to.be.deep.eq([ new IteratorArgument([ new Reference('foo.baz'), new Reference('service_container') ]), new IteratorArgument([]) ], '.load() parses lazy arguments');
    });

    it ('should set class from id', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('class_from_id.yml');
        container.compile();

        expect(container.getDefinition(CaseSensitiveClass).getClass()).to.be.eq('Jymfony.Component.DependencyInjection.Fixtures.CaseSensitiveClass');
    });

    it ('should parse namespace autodiscovery', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_prototype.yml');

        const ids = Object.keys(container.getDefinitions()).sort();
        expect(ids).to.be.deep.eq([
            'Jymfony.Component.DependencyInjection.Fixtures.Prototype.Foo',
            'Jymfony.Component.DependencyInjection.Fixtures.Prototype.Sub.Bar',
            'service_container',
        ]);

        const resources = container.getResources();
        expect(resources.find(r => r.toString() === fixturesPath + '/yaml/services_prototype.yaml')).not.to.be.eq(-1);
        expect(resources.find(r => '/yaml/services_prototype.yaml' === r.toString())).not.to.be.eq(-1);
        expect(resources.find(r => 'reflection.Jymfony.Component.DependencyInjection.Fixtures.Prototype.Foo' === r.toString())).not.to.be.eq(-1);
        expect(resources.find(r => 'reflection.Jymfony.Component.DependencyInjection.Fixtures.Prototype.Sub.Bar' === r.toString())).not.to.be.eq(-1);
    });

    it ('should load namespace prototype', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_prototype_namespace.yml');

        const ids = Object.keys(container.getDefinitions()).sort();
        expect(ids).to.be.deep.eq([
            'Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component1.Dir1.Service1',
            'Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component1.Dir2.Service2',
            'Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component2.Dir1.Service4',
            'Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component2.Dir2.Service5',
            'service_container',
        ]);

        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component1.Dir1.Service1').hasTag('foo')).to.be.true;
        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component2.Dir1.Service4').hasTag('foo')).to.be.true;
        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component1.Dir1.Service1').hasTag('bar')).to.be.false;
        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component2.Dir1.Service4').hasTag('bar')).to.be.false;

        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component1.Dir2.Service2').hasTag('bar')).to.be.true;
        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component2.Dir2.Service5').hasTag('bar')).to.be.true;
        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component1.Dir2.Service2').hasTag('foo')).to.be.false;
        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.OtherDir.Component2.Dir2.Service5').hasTag('foo')).to.be.false;
    });

    it ('should throw if namespace specified without output', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('services_prototype_namespace_without_resource.yml'))
            .to.throw(
                InvalidArgumentException,
                /A "resource" attribute must be set when the "namespace" attribute is set for service ".+" in .+/
            );
    });

    it ('should parse defaults', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services28.yml');

        expect(container.getDefinition('with_defaults').isPublic()).to.be.true;
        expect(container.getDefinition('with_defaults').getTags()).to.be.deep.eq({foo: [ {} ]});
        expect(Object.keys(container.getDefinition('with_defaults').getChanges())).to.include('class');

        expect(container.getAlias('with_defaults_aliased').isPublic()).to.be.true;
        expect(container.getAlias('with_defaults_aliased_short').isPublic()).to.be.true;

        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.Sub.Bar').isPublic()).to.be.true;
        expect(container.getDefinition('Jymfony.Component.DependencyInjection.Fixtures.Prototype.Sub.Bar').getTags()).to.be.deep.eq({foo: [ {} ]});

        expect(container.getDefinition('with_null').isPublic()).to.be.false;
        expect(container.getDefinition('no_defaults').isPublic()).to.be.false;

        // Foo tag is inherited from defaults
        expect(container.getDefinition('with_null').getTags()).to.be.deep.eq({foo: [ {} ]});
        expect(container.getDefinition('no_defaults').getTags()).to.be.deep.eq({foo: [ {} ]});

        expect(container.getDefinition('child_def').isPublic()).to.be.false;
        expect(container.getDefinition('child_def').getTags()).to.be.deep.eq({foo: [ {} ]});

        container.compile();
    });

    it ('should parse instanceof', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_instanceof.yml');
        container.compile();

        const definition = container.getDefinition(Fixtures.Bar);
        expect(definition.isLazy()).to.be.true;
        expect(definition.getTags()).to.be.deep.eq({foo: [ {} ], bar: [ {} ]});
    });

    it ('should throw if instanceof and parent are used in the same file', () =>{
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('services_instanceof_with_parent.yml'))
            .to.throw(
                InvalidArgumentException,
                /The service "child_service" cannot use the "parent" option in the same file where "_instanceof" configuration is defined as using both is not supported\. Move your child definitions to a separate file\./
            );
    });

    it ('should throw if autoconfigure is set on ChildDefinition', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));

        expect(() => loader.load('services_autoconfigure_with_parent.yml')).to.throw(
            InvalidArgumentException,
            /The service "child_service" cannot have a "parent" and also have "autoconfigure"\. Try setting "autoconfigure: false" for the service\./
        );
    });

    it ('should throw if defaults and parent are used in the same file', () =>{
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('services_defaults_with_parent.yml'))
            .to.throw(
                InvalidArgumentException,
                /Attribute "public" on service "child_service" cannot be inherited from "_defaults" when a "parent" is set\. Move your child definitions to a separate file or define this attribute explicitly\./
            );
    });

    it ('should throw on child definition with wrong syntax', () =>{
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('bad_parent.yml'))
            .to.throw(
                InvalidArgumentException,
                /The value of the "parent" option for the "bar" service must be the id of the service without the "@" prefix \(replace "@foo" with "foo"\)\./
            );
    });

    it ('should throw on bad decorated service syntax', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('bad_decorates.yml'))
            .to.throw(
                InvalidArgumentException,
                /The value of the "decorates" option for the "bar" service must be the id of the service without the "@" prefix \(replace "@foo" with "foo"\)\./
            );
    });

    it ('should throw if invalid tags are specified and defaults are present', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('services31_invalid_tags.yml'))
            .to.throw(
                InvalidArgumentException,
                /Parameter "tags" must be an array for service "Foo\.Bar" in .+services31_invalid_tags\.yml\. Check your syntax./
            );
    });

    it ('should throw if service name starts with underscore', () => {
        const loader = new YamlFileLoader(new ContainerBuilder(), new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('services_underscore.yml'))
            .to.throw(
                InvalidArgumentException,
                /Service names that start with an underscore are reserved\. Rename the "_foo" service or define it in JS instead\./
            );
    });

    it ('should load anonymous services', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('anonymous_services.yml');

        const definition = container.getDefinition('Foo');
        expect(definition.isPublic()).to.be.false;

        // Anonymous service in an argument
        const args = definition.getArguments();
        expect(args).to.have.length(1);
        expect(args[0]).to.be.instanceOf(Reference);
        expect(container.has(args[0].toString())).to.be.true;
        expect(args[0].toString()).to.match(/^\.\d+_Bar~[._A-Za-z0-9]{7}$/);

        let anonymous = container.getDefinition(args[0].toString());
        expect(anonymous.getClass()).to.be.deep.eq('Bar');
        expect(anonymous.isPublic()).to.be.false;
        expect(anonymous.hasTag('foo_anonymous')).to.be.false;

        // Anonymous service in a callable
        const factory = definition.getFactory();
        expect(factory[0]).to.be.instanceOf(Reference);
        expect(container.has(factory[0].toString())).to.be.true;
        expect(factory[0].toString()).to.match(/^\.\d+_Quz~[._A-Za-z0-9]{7}$/);
        expect(factory[1]).to.be.deep.eq('constructFoo');

        anonymous = container.getDefinition(factory[0].toString());
        expect(anonymous.getClass()).to.be.deep.eq('Quz');
        expect(anonymous.isPublic()).to.be.false;
        expect(anonymous.hasTag('foo_anonymous')).to.be.false;
    });

    it ('should not throw with anonymous services in different files', () => {
        const container = new ContainerBuilder();

        let loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml/foo'));
        loader.load('services.yml');

        loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml/bar'));
        loader.load('services.yml');

        expect(Object.keys(container.getDefinitions())).to.have.length(5);
    });

    it ('should load anonymous services in instanceof', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('anonymous_services_in_instanceof.yml');

        const definition = container.getDefinition('Dummy');

        const instanceOf = definition.getInstanceofConditionals();
        expect(Object.keys(instanceOf)).to.have.length(3);
        expect(Object.keys(instanceOf)).to.include('DummyInterface');

        const args = instanceOf.DummyInterface.getProperties();
        expect(Object.keys(args)).to.have.length(1);
        expect(args.foo).to.be.instanceOf(Reference);
        expect(container.has(args.foo.toString())).to.be.true;

        const anonymous = container.getDefinition(args.foo.toString());
        expect(anonymous.getClass()).to.be.eq('Anonymous');
        expect(anonymous.isPublic()).to.be.false;
        expect(anonymous.getInstanceofConditionals()).to.be.deep.eq({});

        expect(container.has('Bar')).to.be.false;
    });

    it ('should throw if anonymous services with aliases are present', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('anonymous_services_alias.yml')).to.throw(
            InvalidArgumentException,
            /Creating an alias using the tag "!service" is not allowed in ".+anonymous_services_alias\.yml"\./
        );
    });

    it ('should throw if anonymous services in parameters are present', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('anonymous_services_in_parameters.yml')).to.throw(
            InvalidArgumentException,
            /Using an anonymous service in a parameter is not allowed in ".+anonymous_services_in_parameters\.yml"\./
        );
    });

    it ('should auto configure services', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_autoconfigure.yml');

        expect(container.getDefinition('use_defaults_settings').isAutoconfigured()).to.be.true;
        expect(container.getDefinition('override_defaults_settings_to_false').isAutoconfigured()).to.be.false;
    });

    it ('should throw if defaults is null', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('bad_empty_defaults.yml')).to.throw(
            InvalidArgumentException,
            /Service "_defaults" key must be a mapping, "null" given in ".+bad_empty_defaults\.yml"\./
        );
    });

    it ('should throw if instanceof is null', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('bad_empty_instanceof.yml')).to.throw(
            InvalidArgumentException,
            /Service "_instanceof" key must be a mapping, "null" given in ".+bad_empty_instanceof\.yml"\./
        );
    });

    it ('should throw on unsupported keyword', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('bad_keyword.yml')).to.throw(
            InvalidArgumentException,
            /^The configuration key "private" is unsupported for definition "bar"/
        );
    });

    it ('should throw on unsupported keyword in alias', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        expect(() => loader.load('bad_alias.yml')).to.throw(
            InvalidArgumentException,
            /^The configuration key "calls" is unsupported for the service "bar" which is defined as an alias/
        );
    });

    it ('should respect case sensitivity', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_case.yml');
        container.compile();

        expect(container.has('bar')).to.be.true;
        expect(container.has('BAR')).to.be.true;
        expect(container.has('baR')).to.be.false;
        expect(container.get('bar')).not.to.be.eq(container.get('BAR'));
        expect(container.get('bar')).to.be.deep.eq(container.get('BAR').arguments.bar);
        expect(container.get('bar')).to.be.deep.eq(container.get('BAR').bar);
    });

    it ('should load lazy interface', () => {
        const container = new ContainerBuilder();
        const loader = new YamlFileLoader(container, new FileLocator(fixturesPath + '/yaml'));
        loader.load('services_lazy_fqcn.yml');

        const definition = container.getDefinition('foo');
        expect(definition.getTag('proxy')).to.be.deep.eq([ {'interface': 'SomeInterface'} ]);
    });
});
