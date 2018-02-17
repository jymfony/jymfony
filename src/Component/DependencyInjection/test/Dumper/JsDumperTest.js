const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;

const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const Variable = Jymfony.Component.DependencyInjection.Variable;
const JsDumper = Jymfony.Component.DependencyInjection.Dumper.JsDumper;
const fixturesPath = path.join(__dirname, '..', '..', 'fixtures');

describe('[DependencyInjection] JsDumper', function () {
    it('dump', () => {
        const container = new ContainerBuilder();
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump()).to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services1.js')).toString());
        expect(dumper.dump({ class_name: 'DumpedContainer', base_class: 'AbstractContainer' }))
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services1-1.js')).toString());
    });

    it('dump optimization string', () => {
        const definition = new Definition();
        definition.setClass('Object');
        definition.setPublic(true);
        definition.addArgument({
            'only dot': '.',
            'concatenation as value': '+""+',
            'concatenation from the start value': '""+',
            '.': 'dot as a key',
            '+""+': 'concatenation as a key',
            '""+': 'concatenation from the start key',
            'optimize concatenation': 'string1%some_string%string2',
            'optimize concatenation with empty string': 'string1%empty_value%string2',
            'optimize concatenation from the start': '%empty_value%start',
            'optimize concatenation at the end': 'end%empty_value%',
        });

        const container = new ContainerBuilder();
        container.setResourceTracking(false);
        container.setDefinition('test', definition);
        container.setParameter('empty_value', '');
        container.setParameter('some_string', '-');
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump())
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services10.js')).toString());
    });

    const tests = function * () {
        yield {'foo': new Definition('Object')};
        yield {'foo': new Reference('foo')};
        yield {'foo': new Variable('foo')};
    };
    let count = 0;

    for (const t of tests()) {
        it('should throw if invalid parameters are passed #'+count++, () => {
            const container = new ContainerBuilder(new ParameterBag(t));
            container.compile();

            const dumper = new JsDumper(container);
            expect(() => dumper.dump()).to.throw(InvalidArgumentException);
        });
    }

    it('should add parameters', () => {
        const container = require(path.join(fixturesPath, 'containers', 'container8.js'));
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump())
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services8.js')).toString());
    });

    it('should add services', () => {
        const container = require(path.join(fixturesPath, 'containers', 'container9.js'));
        container.compile();

        const dumper = new JsDumper(container);
        expect(dumper.dump())
            .to.be.equal(fs.readFileSync(path.join(fixturesPath, 'js', 'services9.js')).toString());
    });
});
