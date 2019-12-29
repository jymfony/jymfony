const { expect } = require('chai');

describe('[VarDumper] RegExpCaster', function () {
    it('should dump regexp object correctly', () => {
        const dump = `
RegExp {
  source: 23
  flags: gi
}`;

        expect(/23/gi).to.dump.as.format(dump);
        expect(new RegExp('23', 'gi')).to.dump.as.format(dump);
    });
});
