const expect = require('chai').expect;
const OptionsResolver = Jymfony.Component.OptionsResolver.OptionsResolver;
const AccessException = Jymfony.Component.OptionsResolver.Exception.AccessException;
const MissingOptionsException = Jymfony.Component.OptionsResolver.Exception.MissingOptionsException;
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

    describe('setDefault', () => {
        it('should return itself', () => {
            expect(this._resolver.setDefault('foo', 'bar')).to.be.equal(this._resolver);
        });

        it('should work', () => {
            this._resolver.setDefault('one', 2);
            this._resolver.setDefault('two', '42');

            expect(this._resolver.resolve()).to.be.deep.equal({
                one: 2,
                two: '42',
            });
        });

        it('should fail if called from lazy default', () => {
            this._resolver.setDefault('lazy', (options) => {
                options.setDefault('two', 42);
            }, true);

            expect(this._resolver.resolve.bind(this._resolver))
                .to.throw(AccessException);
        });

        it('should call lazy default', () => {
            this._resolver.setDefault('lazy', () => {
                return 'foo';
            }, true);

            expect(this._resolver.resolve()).to.be.deep.equal({ lazy: 'foo' });
        });

        it('should pass previous default value', () => {
            this._resolver.setDefault('lazy', 42);

            this._resolver.setDefault('lazy', (options, previousDefault) => {
                return previousDefault + 5;
            }, true);

            expect(this._resolver.resolve()).to.be.deep.equal({ lazy: 47 });
        });

        it('should pass previous default value returned by lazy option', () => {
            this._resolver.setDefault('lazy', () => {
                return 42;
            }, true);

            this._resolver.setDefault('lazy', (options, previousDefault) => {
                expect(previousDefault).to.be.equal(42);

                return previousDefault + 5;
            }, true);

            expect(this._resolver.resolve()).to.be.deep.equal({ lazy: 47 });
        });

        it('should not call overwritten lazy option', () => {
            this._resolver.setDefault('lazy', () => {
                throw new Error('Should not be called');
            }, true);

            this._resolver.setDefault('lazy', 'foo');
            expect(this._resolver.resolve()).to.be.deep.equal({ lazy: 'foo' });
        });
    });

    describe('hasDefault', () => {
        it('should return true if default is set', () => {
            expect(this._resolver.hasDefault('foo')).to.be.false;
            this._resolver.setDefault('foo', 42);
            expect(this._resolver.hasDefault('foo')).to.be.true;
        });

        it('should return true if default is undefined', () => {
            expect(this._resolver.hasDefault('foo')).to.be.false;
            this._resolver.setDefault('foo', undefined);
            expect(this._resolver.hasDefault('foo')).to.be.true;
        });

        it('should return true if default is null', () => {
            expect(this._resolver.hasDefault('foo')).to.be.false;
            this._resolver.setDefault('foo', null);
            expect(this._resolver.hasDefault('foo')).to.be.true;
        });

        it('should return true if default is lazy', () => {
            expect(this._resolver.hasDefault('foo')).to.be.false;
            this._resolver.setDefault('foo', () => 42, true);
            expect(this._resolver.hasDefault('foo')).to.be.true;
        });
    });

    describe('setRequired', () => {
        it('should fail if called from a lazy option', () => {
            this._resolver.setDefault('foo', (options) => {
                options.setRequired('bar');
            }, true);

            expect(this._resolver.resolve.bind(this._resolver))
                .to.throw(AccessException);
        });

        it('should throw if required option is not provided', () => {
            this._resolver.setRequired('foo');

            expect(this._resolver.resolve.bind(this._resolver))
                .to.throw(MissingOptionsException, 'The required option "foo" is missing.');
        });

        it('resolve should succeed if option is set', () => {
            this._resolver.setRequired('foo');
            this._resolver.setDefault('foo', 'bar');

            expect(this._resolver.resolve()).to.be.deep.equal({ foo: 'bar' });
        });

        it('resolve should succeed if option is set before setting as required', () => {
            this._resolver.setDefault('foo', 'bar');
            this._resolver.setRequired('foo');

            expect(this._resolver.resolve()).to.be.deep.equal({ foo: 'bar' });
        });

        it('still required if set', () => {
            this._resolver.setDefault('foo', 'bar');
            this._resolver.setRequired('foo');

            expect(this._resolver.isRequired('foo')).to.be.true;
        });

        it('not required after remove', () => {
            this._resolver.setRequired('foo');
            this._resolver.remove('foo');

            expect(this._resolver.isRequired('foo')).to.be.false;
        });

        it('not required after clear', () => {
            this._resolver.setRequired('foo');
            this._resolver.clear();

            expect(this._resolver.isRequired('foo')).to.be.false;
        });

        it('get required options', () => {
            this._resolver.setRequired([ 'foo', 'bar' ]);
            this._resolver.setDefault('bam', 'baz');
            this._resolver.setDefault('foo', 'bar');

            expect(this._resolver.getRequiredOptions()).to.be.deep.equal([ 'foo', 'bar' ]);
        });
    });

    describe('isMissing/getMissingOptions', () => {
        it('should be missing if not defined', () => {
            expect(this._resolver.isMissing('foo')).to.be.false;
            this._resolver.setRequired('foo');
            expect(this._resolver.isMissing('foo')).to.be.true;
        });

        it('should not be missing if defined', () => {
            this._resolver.setDefault('foo', 'bar');

            expect(this._resolver.isMissing('foo')).to.be.false;
            this._resolver.setRequired('foo');
            expect(this._resolver.isMissing('foo')).to.be.false;
        });

        it('should not be missing after remove', () => {
            this._resolver.setRequired('foo');
            this._resolver.remove('foo');
            expect(this._resolver.isMissing('foo')).to.be.false;
        });

        it('should not be missing after clear', () => {
            this._resolver.setRequired('foo');
            this._resolver.clear();
            expect(this._resolver.isMissing('foo')).to.be.false;
        });

        it('get missing options', () => {
            this._resolver.setRequired([ 'foo', 'bar' ]);
            this._resolver.setDefault('bam', 'baz');
            this._resolver.setDefault('foo', 'bar');

            expect(this._resolver.getMissingOptions()).to.be.deep.equal([ 'bar' ]);
        });
    });
});
