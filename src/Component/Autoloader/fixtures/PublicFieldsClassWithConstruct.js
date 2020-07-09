class PublicFieldsClassWithConstruct {
    noInterrupt
    field = 'foobar';
    static bar = 'bar';

    __construct() {
        __assert(this.field === 'foobar', 'Fields are initialized before __construct call');

        this.initializedField = this.field;
    }
}

module.exports = PublicFieldsClassWithConstruct;
