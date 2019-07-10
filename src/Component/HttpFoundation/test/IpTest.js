const Ip = Jymfony.Component.HttpFoundation.Ip;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[HttpFoundation] Ip', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();
    });

    let ips = [
        [ '192.168.1.1', Ip.IPV4 ],
        [ '127.0.0.1', Ip.IPV4 ],
        [ '1.2.3.4', Ip.IPV4 ],
        [ '127.0.0.0', Ip.IPV4 ],
        [ '2a01:198:603:0:396e:4789:8e99:890f', Ip.IPV6 ],
        [ '2a01:198:603::396e:4789:8e99:890f', Ip.IPV6 ],
        [ '0:0:0:0:0:0:0:1', Ip.IPV6 ],
        [ '::1', Ip.IPV6 ],
        [ '0:0:603:0:396e:4789:8e99:0001', Ip.IPV6 ],
        [ '::603:0:396e:4789:8e99:0001', Ip.IPV6 ],
    ];

    for (const [ key, [ address, type ] ] of __jymfony.getEntries(ips)) {
        it('parses ip addresses with dataset #'+key, () => {
            const ip = new Ip(address);
            expect(ip.type).to.be.equal(type);
        });
    }

    ips = [
        'an_invalid_ip',
        '256.256.256.0',
        '}__test|O:21:&quot;JDatabaseDriverMysqli&quot;:3:{s:2',
        'unknown',
    ];

    for (const [ key, address ] of __jymfony.getEntries(ips)) {
        it('throws error when parsing with dataset #'+key, () => {
            expect(() => new Ip(address)).to.throw(InvalidArgumentException);
        });
    }


    ips = [
        [ '192.168.1.1', '192.168.1.1' ],
        [ '127.0.0.1', '127.0.0.1' ],
        [ '1.2.3.4', '1.2.3.4' ],
        [ '127.0.0.0', '127.0.0.0' ],
        [ '2a01:198:603:0:396e:4789:8e99:890f', '2a01:0198:0603:0000:396e:4789:8e99:890f' ],
        [ '2a01:198:603::396e:4789:8e99:890f', '2a01:0198:0603:0000:396e:4789:8e99:890f' ],
        [ '0:0:0:0:0:0:0:1', '0000:0000:0000:0000:0000:0000:0000:0001' ],
        [ '::1', '0000:0000:0000:0000:0000:0000:0000:0001' ],
        [ '0:0:603:0:396e:4789:8e99:0001', '0000:0000:0603:0000:396e:4789:8e99:0001' ],
        [ '::603:0:396e:4789:8e99:0001', '0000:0000:0603:0000:396e:4789:8e99:0001' ],
    ];

    for (const [ key, [ address, out ] ] of __jymfony.getEntries(ips)) {
        it('toString with dataset #'+key, () => {
            const ip = new Ip(address);
            expect(ip.toString()).to.be.equal(out);
        });
    }

    const tests = [
        [ true, '192.168.1.1', '192.168.1.1' ],
        [ true, '192.168.1.1', '192.168.1.1/1' ],
        [ true, '192.168.1.1', '192.168.1.0/24' ],
        [ false, '192.168.1.1', '1.2.3.4/1' ],
        [ false, '192.168.1.1', '192.168.1.1/33' ], // Invalid subnet
        [ true, '1.2.3.4', '0.0.0.0/0' ],
        [ true, '1.2.3.4', '192.168.1.0/0' ],
        [ false, '1.2.3.4', '256.256.256/0' ], // Invalid CIDR notation
        [ true, '2a01:198:603:0:396e:4789:8e99:890f', '2a01:198:603:0::/65' ],
        [ false, '2a00:198:603:0:396e:4789:8e99:890f', '2a01:198:603:0::/65' ],
        [ false, '2a01:198:603:0:396e:4789:8e99:890f', '::1' ],
        [ true, '0:0:0:0:0:0:0:1', '::1' ],
        [ false, '0:0:603:0:396e:4789:8e99:0001', '::1' ],
        [ true, '0:0:603:0:396e:4789:8e99:0001', '::/0' ],
        [ true, '0:0:603:0:396e:4789:8e99:0001', '2a01:198:603:0::/0' ],
        [ false, '2a01:198:603:0:396e:4789:8e99:890f', 'unknown' ],
    ];

    for (const [ key, [ expected, address, cidr ] ] of __jymfony.getEntries(tests)) {
        it('matches with dataset #'+key, () => {
            const ip = new Ip(address);
            expect(ip.match(cidr)).to.be.equal(expected);
        });
    }
});
