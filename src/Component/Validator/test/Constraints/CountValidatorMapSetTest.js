import { CountValidatorTest } from './CountValidatorTest';

export default class CountValidatorMapSetTest extends CountValidatorTest {
    createCollection(content) {
        if (isObjectLiteral(content)) {
            const map = new Map();
            for (const [ key, value ] of __jymfony.getEntries(content)) {
                map.set(key, value);
            }

            return map;
        }

        return new Set(content);
    }
}
