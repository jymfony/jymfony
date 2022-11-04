const ClassMetadata = Jymfony.Component.Validator.Mapping.ClassMetadata;
const Constraints = Jymfony.Component.Validator.Constraints;
const Fixtures = Jymfony.Component.Validator.Fixtures;
const JsonFileLoader = Jymfony.Component.Validator.Mapping.Loader.JsonFileLoader;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const { expect } = require('chai');

export default class JsonFileLoaderTest extends TestCase {
    get testCaseName() {
        return '[Validator] ' + super.testCaseName;
    }

    testLoadClassMetadataReturnsFalseIfEmpty() {
        if (! __jymfony.Platform.hasPrivateFieldSupport()) {
            this.markTestSkipped();
        }

        const loader = this._createLoader(this.provideEmptyMapping());
        const metadata = new ClassMetadata(new ReflectionClass(Fixtures.Entity));

        loader.loadClassMetadata(metadata);
        const r = (new ReflectionClass(loader)).getField('_classes');
        r.accessible = true;

        expect(r.getValue(loader)).to.be.deep.equal({});
    }

    provideEmptyMapping() {
        return __dirname + '/empty-mapping.json';
    }

    @dataProvider('provideInvalidFiles')
    testInvalidFiles(file) {
        if (! __jymfony.Platform.hasPrivateFieldSupport()) {
            this.markTestSkipped();
        }

        const loader = this._createLoader(file);
        const metadata = new ClassMetadata(new ReflectionClass(Fixtures.Entity));

        expect(() => loader.loadClassMetadata(metadata)).to.throw(InvalidArgumentException);
    }

    * provideInvalidFiles() {
        yield [ __dirname + '/nonvalid-mapping.json' ];
        yield [ __dirname + '/bad-format.json' ];
    }

    provideConstraintMapping() {
        return __dirname + '/constraint-mapping.json';
    }

    testLoadClassMetadata() {
        if (! __jymfony.Platform.hasPrivateFieldSupport()) {
            this.markTestSkipped();
        }

        const loader = this._createLoader(this.provideConstraintMapping());
        const metadata = new ClassMetadata(new ReflectionClass(Fixtures.Entity));

        loader.loadClassMetadata(metadata);

        const expected = new ClassMetadata(new ReflectionClass(Fixtures.Entity));
        expected.setGroupSequence([ 'Foo', 'Entity' ]);
        expected.addConstraint(new Fixtures.ConstraintA());
        expected.addConstraint(new Fixtures.ConstraintB());
        expected.addConstraint(new Constraints.Callback('validateMe'));
        expected.addConstraint(new Constraints.Callback('validateMeStatic'));
        expected.addConstraint(new Constraints.Callback([ 'Jymfony.Component.Validator.Fixtures.CallbackClass', 'callback' ]));
        expected.addFieldConstraint('firstName', new Constraints.NotNull());
        expected.addFieldConstraint('firstName', new Constraints.Range({ min: 3 }));
        expected.addFieldConstraint('firstName', new Constraints.Choice([ 'A', 'B' ]));
        expected.addFieldConstraint('firstName', new Constraints.All([ new Constraints.NotNull(), new Constraints.Range({ min: 3 }) ]));
        expected.addFieldConstraint('firstName', new Constraints.All({ constraints: [ new Constraints.NotNull(), new Constraints.Range({ min: 3 }) ] }));
        expected.addFieldConstraint('firstName', new Constraints.Collection({ fields: {
            foo: [ new Constraints.NotNull(), new Constraints.Range({ min: 3 }) ],
            bar: [ new Constraints.Range({ min: 5 }) ],
        } }));
        expected.addFieldConstraint('firstName', new Constraints.Choice({
            message: 'Must be one of %choices%',
            choices: [ 'A', 'B' ],
        }));
        expected.addGetterConstraint('lastName', new Constraints.NotNull());
        expected.addGetterConstraint('valid', new Constraints.IsTrue());
        expected.addGetterConstraint('permissions', new Constraints.IsTrue());

        expect(metadata).to.be.dump.as(expected);
    }

    testLoadGroupSequenceProvider() {
        const loader = this._createLoader(this.provideConstraintMapping());
        const metadata = new ClassMetadata(new ReflectionClass(Fixtures.GroupSequenceProviderEntity));

        loader.loadClassMetadata(metadata);

        const expected = new ClassMetadata(new ReflectionClass(Fixtures.GroupSequenceProviderEntity));
        expected.setGroupSequenceProvider(true);

        expect(metadata).to.be.dump.as(expected);
    }

    _createLoader(file) {
        return new JsonFileLoader(file);
    }
}
