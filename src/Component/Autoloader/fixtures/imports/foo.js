import * as mod from './bar';

export default class foo {
    trial(v) {
        return v instanceof mod.default;
    }

    foo() {
        return new mod.default().trial(this);
    }
}
