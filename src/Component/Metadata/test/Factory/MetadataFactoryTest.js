require('../../fixtures/namespace');

const Argument = Jymfony.Component.Testing.Argument.Argument;
const ClassMetadataInterface = Jymfony.Component.Metadata.ClassMetadataInterface;
const Fixtures = Jymfony.Component.Metadata.Fixtures;
const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
const MetadataFactory = Jymfony.Component.Metadata.Factory.MetadataFactory;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[Metadata] MetadataFactory', function () {
    /**
     * @type {Jymfony.Component.Testing.Prophet}
     */
    let prophet;

    /**
     * @type {Jymfony.Component.Metadata.Loader.LoaderInterface|Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    let loader;

    beforeEach(() => {
        prophet = new Prophet();
        loader = prophet.prophesize(LoaderInterface);
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        prophet.checkPredictions();
    });

    it ('hasMetadata should return false on non-existent classes', () => {
        const factory = new MetadataFactory(loader.reveal());
        expect(factory.hasMetadataFor('App.NonExistentClass')).to.be.equal(false);
    });

    it ('hasMetadata should return false on invalid value', () => {
        const factory = new MetadataFactory(loader.reveal());
        expect(factory.hasMetadataFor([])).to.be.equal(false);
    });

    it ('getMetadata should throw if invalid value has passed', () => {
        const factory = new MetadataFactory(loader.reveal());
        expect(() => factory.getMetadataFor([])).to.throw(InvalidArgumentException);
        expect(() => factory.getMetadataFor('App.NonExistentClass')).to.throw(InvalidArgumentException);
    });

    it ('getMetadata should call the loader', () => {
        loader.loadClassMetadata(Argument.type(ClassMetadataInterface)).shouldBeCalled();

        const factory = new MetadataFactory(loader.reveal());
        factory.getMetadataFor(Fixtures.ClassForMetadata);
    });

    it ('getMetadata should not call the loader twice', () => {
        const className = ReflectionClass.getClassName(Fixtures.ClassForMetadata);
        loader.loadClassMetadata(Argument.that((metadata) => {
            return metadata.reflectionClass.name === className;
        }))
            .willReturn(true)
            .shouldBeCalledTimes(1);

        loader.loadClassMetadata(Argument.type(ClassMetadataInterface)).willReturn(true);

        const factory = new MetadataFactory(loader.reveal());
        factory.getMetadataFor(Fixtures.ClassForMetadata);
        factory.getMetadataFor(Fixtures.ClassForMetadata);
    });

    it ('metadataClass setter should work', () => {
        const factory = new MetadataFactory(loader.reveal());
        factory.metadataClass = Fixtures.MetadataClassWithAttributes;

        expect(() => factory.metadataClass = 'App.NonExistentClass').to.throw(InvalidArgumentException);
        expect(() => factory.metadataClass = Fixtures.FakeClassNoMetadata).to.throw(InvalidArgumentException);

        expect(factory.getMetadataFor(Fixtures.ClassForMetadata)).to.be.instanceOf(Fixtures.MetadataClassWithAttributes);
    });

    it ('metadata should not merge with superclass if failing to load', () => {
        loader.loadClassMetadata(Argument.type(ClassMetadataInterface)).willReturn(false);

        const metadata = prophet.prophesize(ClassMetadataInterface);
        metadata.merge(Argument.cetera()).shouldNotBeCalled();
        metadata.reflectionClass().willReturn(new ReflectionClass(Fixtures.SubclassForMetadata));

        const factory = new class extends MetadataFactory {
            __construct(loader) {
                super.__construct(loader);

                this._mock = metadata;
            }

            getMetadataFor(subject) {
                if (undefined !== this._mock) {
                    const m = this._mock;
                    this._mock = undefined;

                    return m;
                }

                return super.getMetadataFor(subject);
            }
        }(loader.reveal());

        factory.getMetadataFor(Fixtures.SubclassForMetadata);
    });

    // /**
    //  * @test
    //  */
    // Public function get_metadata_for_should_not_merge_with_superclasses_if_fails()
    // {
    //     $this->loader->loadClassMetadata(Argument::type(ClassMetadataInterface::class))->willReturn(false);
    //
    //     $metadata = $this->prophesize(ClassMetadataInterface::class);
    //
    //     $metadata->merge(Argument::cetera())->shouldNotBeCalled();
    //     $metadata->getReflectionClass()->willReturn(new \ReflectionClass($this));
    //
    //     $factory = new MockedClassMetadataFactory($this->loader->reveal());
    //     $factory->mock = $metadata->reveal();
    //     $factory->getMetadataFor($this);
    // }
});
