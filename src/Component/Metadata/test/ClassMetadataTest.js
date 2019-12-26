require('../fixtures/namespace');

const ClassMetadata = Jymfony.Component.Metadata.ClassMetadata;
const FieldMetadata = Jymfony.Component.Metadata.FieldMetadata;
const Fixtures = Jymfony.Component.Metadata.Fixtures;
const MethodMetadata = Jymfony.Component.Metadata.MethodMetadata;
const PropertyMetadata = Jymfony.Component.Metadata.PropertyMetadata;
const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const NullMetadata = Jymfony.Contracts.Metadata.NullMetadata;
const { expect } = require('chai');

describe('[Metadata] ClassMetadata', function () {
    it ('should merge NullMetadata', () => {
        const c = new ClassMetadata(new ReflectionClass(ClassMetadata));
        const m = new NullMetadata('');

        expect(() => c.merge(m)).not.to.throw(Error);
    });

    const invalidMetadatas = [
        [ 'property', new PropertyMetadata(new ReflectionClass(ClassMetadata), 'name', 'get') ],
        [ 'field', new FieldMetadata(new ReflectionClass(ClassMetadata), '_name') ],
    ];

    for (const [ key, value ] of invalidMetadatas) {
        it('should throw if merge is called with wrong metadata object: ' + key, () => {
            const c = new ClassMetadata(new ReflectionClass(ClassMetadata));
            expect(() => c.merge(value)).to.throw(InvalidArgumentException);
        });
    }

    it('should throw if trying to merge with metadata of out-of-hierarchy class', () => {
        const c = new ClassMetadata(new ReflectionClass(ClassMetadata));
        const m = new ClassMetadata(new ReflectionClass(Jymfony.Component.Metadata.Factory.MetadataFactory));

        expect(() => c.merge(m)).to.throw(InvalidArgumentException);
    });

    it ('should merge all attributes', () => {
        const class_ = new Fixtures.ClassForMetadata();
        const subclass_ = new Fixtures.SubclassForMetadata();

        const metadata = new ClassMetadata(new ReflectionClass(class_));
        const submetadata = new ClassMetadata(new ReflectionClass(subclass_));

        metadata.addAttributeMetadata(new FieldMetadata(metadata.reflectionClass.name, '_attributeFirst'));
        metadata.addAttributeMetadata(new FieldMetadata(metadata.reflectionClass.name, 'attributeSecond'));
        metadata.addAttributeMetadata(new MethodMetadata(metadata.reflectionClass.name, 'methodOne'));

        submetadata.addAttributeMetadata(new MethodMetadata(submetadata.reflectionClass.name, 'methodOne'));

        submetadata.merge(metadata);

        const attributes = submetadata.attributesMetadata;
        expect(Object.keys(attributes)).to.have.length(3);
        expect(submetadata.getAttributeMetadata('_attributefirst')).to.be.instanceOf(FieldMetadata);

        const methodOne = submetadata.getAttributeMetadata('methodOne');
        expect(methodOne).to.be.instanceOf(MethodMetadata);
        expect(methodOne.reflection.reflectionClass.name).to.be.equal(submetadata.reflectionClass.name);
    });

    it ('should serialize public properties and attributes', () => {
        const class_ = new Fixtures.ClassForMetadata();

        const metadata = new Fixtures.MetadataClassWithAttributes(new ReflectionClass(class_));
        metadata.addAttributeMetadata(new PropertyMetadata(ReflectionClass.getClassName(class_), '_attributeFirst'));
        metadata.attributeOne = 'ONE';
        metadata.attributeTwo = 'TEST';

        const des = __jymfony.unserialize(__jymfony.serialize(metadata));

        expect(des).to.be.instanceOf(Fixtures.MetadataClassWithAttributes);
        expect(des.attributeOne).to.be.equal('ONE');
        expect(des.attributeTwo).to.be.equal('TEST');
        expect(des._attributePrivate).to.be.equal(undefined);

        expect(Object.keys(des.attributesMetadata)).to.have.length(1);
        expect(des.getAttributeMetadata('_attributeFirst')).to.be.instanceOf(PropertyMetadata);
    });

    it ('name should return the class name', () => {
        const class_ = new Fixtures.ClassForMetadata();
        const metadata = new Fixtures.MetadataClassWithAttributes(new ReflectionClass(class_));

        expect(metadata.name).to.be.equal('Jymfony.Component.Metadata.Fixtures.ClassForMetadata');
    });

    it ('should reinit reflection upon unserialization', () => {
        const class_ = new Fixtures.ClassForMetadata();
        const metadata = new ClassMetadata(new ReflectionClass(class_));

        const serialized = __jymfony.serialize(metadata);
        const metadata_unser = __jymfony.unserialize(serialized);

        expect(metadata_unser.reflectionClass).not.to.be.equal(undefined);
    });

    it ('get attribute should ignore case', () => {
        const class_ = new Fixtures.ClassForMetadata();
        const metadata = new ClassMetadata(new ReflectionClass(class_));

        metadata.addAttributeMetadata(new FieldMetadata(ReflectionClass.getClassName(class_), '_attributeFirst'));
        metadata.addAttributeMetadata(new FieldMetadata(ReflectionClass.getClassName(class_), 'attributeSecond'));
        metadata.addAttributeMetadata(new MethodMetadata(ReflectionClass.getClassName(class_), 'methodOne'));

        expect(metadata.getAttributeMetadata('_attributefirst')).to.be.instanceOf(FieldMetadata);
        expect(metadata.getAttributeMetadata('ATTRIBUTESECOND')).to.be.instanceOf(FieldMetadata);
        expect(metadata.getAttributeMetadata('MethodOne')).to.be.instanceOf(MethodMetadata);
    });
});
