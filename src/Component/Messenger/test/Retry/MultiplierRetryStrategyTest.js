const Envelope = Jymfony.Component.Messenger.Envelope;
const MultiplierRetryStrategy = Jymfony.Component.Messenger.Retry.MultiplierRetryStrategy;
const RedeliveryStamp = Jymfony.Component.Messenger.Stamp.RedeliveryStamp;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class MultiplierRetryStrategyTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testIsRetryable() {
        const strategy = new MultiplierRetryStrategy(3);
        const envelope = new Envelope({}, [ new RedeliveryStamp(0) ]);

        __self.assertTrue(strategy.isRetryable(envelope));
    }

    testIsNotRetryable() {
        const strategy = new MultiplierRetryStrategy(3);
        const envelope = new Envelope({}, [ new RedeliveryStamp(3) ]);

        __self.assertFalse(strategy.isRetryable(envelope));
    }

    testIsNotRetryableWithZeroMax() {
        const strategy = new MultiplierRetryStrategy(0);
        const envelope = new Envelope({}, [ new RedeliveryStamp(0) ]);
        __self.assertFalse(strategy.isRetryable(envelope));
    }

    testIsRetryableWithNoStamp() {
        const strategy = new MultiplierRetryStrategy(3);
        const envelope = new Envelope({});

        __self.assertTrue(strategy.isRetryable(envelope));
    }

    @dataProvider ('getWaitTimeTests')
    testGetWaitTime(delay, multiplier, maxDelay, previousRetries, expectedDelay) {
        const strategy = new MultiplierRetryStrategy(10, delay, multiplier, maxDelay);
        const envelope = new Envelope({}, [ new RedeliveryStamp(previousRetries) ]);

        __self.assertSame(expectedDelay, strategy.getWaitingTime(envelope));
    }

    * getWaitTimeTests() {
        // Delay, multiplier, maxDelay, retries, expectedDelay
        yield [ 1000, 1, 5000, 0, 1000 ];
        yield [ 1000, 1, 5000, 1, 1000 ];
        yield [ 1000, 1, 5000, 2, 1000 ];

        yield [ 1000, 2, 10000, 0, 1000 ];
        yield [ 1000, 2, 10000, 1, 2000 ];
        yield [ 1000, 2, 10000, 2, 4000 ];
        yield [ 1000, 2, 10000, 3, 8000 ];
        yield [ 1000, 2, 10000, 4, 10000 ]; // Max hit
        yield [ 1000, 2, 0, 4, 16000 ]; // No max

        yield [ 1000, 3, 10000, 0, 1000 ];
        yield [ 1000, 3, 10000, 1, 3000 ];
        yield [ 1000, 3, 10000, 2, 9000 ];

        yield [ 1000, 1, 500, 0, 500 ]; // Max hit immediately

        // Never a delay
        yield [ 0, 2, 10000, 0, 0 ];
        yield [ 0, 2, 10000, 1, 0 ];
    }
}
