const { expect } = require('chai');
const InvalidPropertyPathException = Jymfony.Component.PropertyAccess.Exception.InvalidPropertyPathException;
const OutOfBoundsException = Jymfony.Contracts.PropertyAccess.Exception.OutOfBoundsException;
const PropertyPath = Jymfony.Component.PropertyAccess.PropertyPath;

describe('[PropertyAccess] PropertyPath', function () {
    it ('could be converted to string', () => {
        const path = new PropertyPath('reference.traversable[index].property');
        expect(String(path)).to.be.eq('reference.traversable[index].property');
    });

    it ('should throw if dot is present at the beginning', () => {
        expect(() => new PropertyPath('.property')).to.throw(InvalidPropertyPathException);
    });

    let index = 1;
    const propertyPathsContainingInvalidCharacters = [
        [ 'property.' ],
        [ 'property.[' ],
        [ 'property..' ],
        [ 'property[' ],
        [ 'property[[' ],
        [ 'property[.' ],
        [ 'property[]' ],
    ];

    for (const [ path ] of propertyPathsContainingInvalidCharacters) {
        it('should throw if path contained invalid chars #' + index++, () => {
            expect(() => new PropertyPath(path)).to.throw(InvalidPropertyPathException);
        });
    }

    it ('should throw if path is empty', () => {
        expect(() => new PropertyPath('')).to.throw(InvalidPropertyPathException);
    });

    it ('should throw if path is null', () => {
        expect(() => new PropertyPath(null)).to.throw(InvalidArgumentException);
    });

    it ('should throw if path is undefined', () => {
        expect(() => new PropertyPath(undefined)).to.throw(InvalidArgumentException);
    });

    it ('should throw if path is false', () => {
        expect(() => new PropertyPath(false)).to.throw(InvalidArgumentException);
    });

    it ('zero should be accepted as a valid property path', () => {
        const propertyPath = new PropertyPath('0');
        expect(String(propertyPath)).to.be.eq('0');
    });

    it ('should get a parent with dot', () => {
        const propertyPath = new PropertyPath('grandpa.parent.child');
        expect(propertyPath.parent).to.be.deep.eq(new PropertyPath('grandpa.parent'));
    });

    it ('should get a parent with index', () => {
        const propertyPath = new PropertyPath('grandpa.parent[child]');
        expect(propertyPath.parent).to.be.deep.eq(new PropertyPath('grandpa.parent'));
    });

    it ('should return undefined if there is no parent', () => {
        const propertyPath = new PropertyPath('path');
        expect(propertyPath.parent).to.be.undefined;
    });

    it ('could be constructed with another path', () => {
        const propertyPath = new PropertyPath('grandpa.parent[child]');
        const copy = new PropertyPath(propertyPath);
        expect(copy).to.be.deep.eq(propertyPath);
    });

    it ('element could be retrieved by getElement', () => {
        const propertyPath = new PropertyPath('grandpa.parent[child]');
        expect(propertyPath.getElement(2)).to.be.eq('child');
    });

    it ('getElement should throw on invalid index', () => {
        const propertyPath = new PropertyPath('path');
        expect(() => propertyPath.getElement(2)).to.throw(OutOfBoundsException);
    });

    it ('isProperty should work', () => {
        const propertyPath = new PropertyPath('grandpa.parent[child]');
        expect(propertyPath.isProperty(1)).to.be.true;
        expect(propertyPath.isProperty(2)).to.be.false;
    });

    it ('isProperty should throw on invalid index', () => {
        const propertyPath = new PropertyPath('path');
        expect(() => propertyPath.isProperty(2)).to.throw(OutOfBoundsException);
    });

    it ('isIndex should work', () => {
        const propertyPath = new PropertyPath('grandpa.parent[child]');
        expect(propertyPath.isIndex(1)).to.be.false;
        expect(propertyPath.isIndex(2)).to.be.true;
    });

    it ('isIndex should throw on invalid index', () => {
        const propertyPath = new PropertyPath('path');
        expect(() => propertyPath.isIndex(2)).to.throw(OutOfBoundsException);
    });
});
