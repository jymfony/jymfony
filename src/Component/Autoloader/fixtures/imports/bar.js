import * as mod from './foo';

export default class bar {
    trial(v) {
        return v instanceof mod.default;
    }
}
