const Json = Jymfony.Component.Validator.Constraints.Json;
const JsonValidator = Jymfony.Component.Validator.Constraints.JsonValidator;
const { expect } = require('chai');

describe('[Validator] Constraints.JsonValidator', function () {
    const validValues = [
        '{"planet":"earth", "country": "Morocco","city": "Rabat" ,"postcode" : 10160, "is_great": true, \
            "img" : null, "area": 118.5, "foo": 15 }',
        null,
        undefined,
        '"null"',
        'null',
        '"string"',
        '1',
        'true',
        1,
    ];

    const invalidValues = [
        '{"foo": 3 "bar": 4}',
        '{"foo": 3 ,"bar": 4',
        '{foo": 3, "bar": 4}',
        'foo',
    ];

    let i = 0;
    for (const valid of validValues) {
        it('should not raise violation #' + ++i, async () => {
            await expect(valid).to.be.validated.by(JsonValidator)
                .with.constraint(new Json())
                .and.raise.no.violations();
        });
    }

    i = 0;
    for (const value of invalidValues) {
        it('should raise violation on invalid JSON #' + ++i, async () => {
            await expect(value).to.be.validated.by(JsonValidator)
                .with.constraint(new Json({ message: 'myMessage' }))
                .and.raise.violations([ {
                    message: 'myMessage',
                    code: Json.INVALID_JSON_ERROR,
                    parameters: {
                        '{{ value }}': '"' + value + '"',
                    },
                    propertyPath: '',
                } ]);
        });
    }
});
