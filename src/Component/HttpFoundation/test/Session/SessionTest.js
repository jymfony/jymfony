const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
const CacheSessionStorage = Jymfony.Component.HttpFoundation.Session.Storage.CacheSessionStorage;
const Session = Jymfony.Component.HttpFoundation.Session.Session;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[HttpFoundation] Session', function () {
    /**
     * @type {Jymfony.Component.Testing.Prophet}
     *
     * @private
     */
    this._prophet = undefined;

    /**
     * @type {Jymfony.Component.HttpFoundation.Session.Session}
     *
     * @private
     */
    this._session = undefined;

    /**
     * @type {Jymfony.Component.HttpFoundation.Session.Storage.SessionStorageInterface}
     *
     * @private
     */
    this._storage = undefined;

    beforeEach(() => {
        this._prophet = new Prophet();
        this._storage = new CacheSessionStorage(new ArrayAdapter());
        this._session = new Session(this._storage);
    });

    it ('should be not started on construction', () => {
        expect(this._session.started).to.be.equal(false);
    });

    it ('should start', async () => {
        expect(this._session.id).to.be.equal(undefined);
        await this._session.start();
        expect(this._session.started).to.be.equal(true);
        expect(this._session.id).not.to.be.equal('');
    });

    it ('should accept id before start', async () => {
        expect(this._session.id).to.be.equal(undefined);
        this._session.id = '012345abcde';

        await this._session.start();
        expect(this._session.id).to.be.equal('012345abcde');
    });

    it ('should throw trying to set id after start', async () => {
        expect(this._session.id).to.be.equal(undefined);
        await this._session.start();

        expect(() => this._session.id = '012345abcde').to.throw(LogicException);
    });

    it ('name should be set', async () => {
        expect(this._session.name).to.be.equal('JFSESSID');
        this._session.name = 'session.test.com';
        await this._session.start();

        expect(this._session.name).to.be.equal('session.test.com');
    });

    const setTests = [
        [ 'foo', 'bar', { 'foo': 'bar' } ],
        [ 'foo.bar', 'too much beer', { 'foo.bar': 'too much beer' } ],
        [ 'great', 'jymfony is great', { 'great': 'jymfony is great' } ],
    ];

    let i = 0;
    for (const [ key, value, result ] of setTests) {
        ++i;

        it ('should set attributes #' + i, () => {
            this._session.set(key, value);
            expect(this._session.get(key)).to.be.equal(value);
        });

        it ('has should work #' + i, () => {
            this._session.set(key, value);
            expect(this._session.has(key)).to.be.equal(true);
            expect(this._session.has(key + '.non_value')).to.be.equal(false);
        });

        it ('all should work #' + i, () => {
            this._session.set(key, value);
            expect(this._session.all()).to.be.deep.equal(result);
        });

        it ('clear should work #' + i, () => {
            this._session.set('hi', 'alessandro');
            this._session.set(key, value);
            this._session.clear();
            expect(this._session.all()).to.be.deep.equal({});
        });

        it ('remove should work #' + i, () => {
            this._session.set('hi', 'alessandro');
            this._session.set(key, value);
            this._session.remove(key);
            expect(this._session.all()).to.be.deep.equal({ hi: 'alessandro' });
        });
    }

    it ('replace should work', () => {
        this._session.replace({ happiness: 'be good', jymfony: 'awesome' });
        expect(this._session.all()).to.be.deep.equal({ happiness: 'be good', jymfony: 'awesome' });
        this._session.replace({});
        expect(this._session.all()).to.be.deep.equal({});
    });

    it ('invalidate should work', async () => {
        this._session.set('invalidate', 123);
        await this._session.invalidate();
        expect(this._session.all()).to.be.deep.equal({});
    });

    it ('migrate should work', () => {
        this._session.set('migrate', 333);
        this._session.migrate();
        expect(this._session.get('migrate')).to.be.equal(333);

        this._session.set('migrate', 321);
        this._session.migrate(true);
        expect(this._session.get('migrate')).to.be.equal(321);
    });

    it ('should save and load correctly', async () => {
        this._session.id = 'io.jymfony';
        await this._session.start();
        this._session.set('hi', 'alessandro');

        await this._session.save();
        expect(this._session.started).to.be.equal(false);

        this._session = new Session(this._storage);
        this._session.id = 'io.jymfony';
        await this._session.start();

        expect(this._session.all()).to.be.deep.equal({ hi: 'alessandro' });
    });

    it ('should be iterable and have length', () => {
        this._session.set('hi', 'alessandro');
        this._session.set('jymfony', 'rocks');

        expect([ ...this._session ]).to.be.deep.equal([
            [ 'hi', 'alessandro' ],
            [ 'jymfony', 'rocks' ],
        ]);

        expect(this._session).to.have.length(2);
    });
});
