const expect = require('chai').expect;
const OptionsResolver = Jymfony.Component.OptionsResolver.OptionsResolver;
const AccessException = Jymfony.Component.OptionsResolver.Exception.AccessException;
const UndefinedOptionsException = Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException;

describe('OptionsResolver', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.OptionsResolver.OptionsResolver}
         * @private
         */
        this._resolver = new OptionsResolver();
    });

    describe('resolve', () => {
        it('should fail on non-existing option', () => {
            this._resolver.setDefault('z', '1');
            this._resolver.setDefault('a', '2');

            expect(this._resolver.resolve.bind(this._resolver, {foo: 'bar'}))
                .to.throw(UndefinedOptionsException, 'The option "foo" does not exist. Defined options are: "a", "z".');
        });

        it('should fail on multiple non-existing options', () => {
            this._resolver.setDefault('z', '1');
            this._resolver.setDefault('a', '2');

            expect(this._resolver.resolve.bind(this._resolver, {
                ping: 'pong',
                foo: 'bar',
                baz: 'bam',
            })).to.throw(UndefinedOptionsException, 'The options "baz", "foo", "ping" do not exist. Defined options are: "a", "z".');
        });

        it('should fail from lazy option', () => {
            this._resolver.setDefault('foo', (options) => {
                options.resolve();
            }, true);

            expect(this._resolver.resolve.bind(this._resolver)).to.throw(AccessException);
        });
    });
});
