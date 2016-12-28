require('../../lib/String/version_compare');
const util = require("util");
const expect = require('chai').expect;

let special_forms = ["-dev", "a1", "b1", "RC1", "rc1", "", "pl1"];
let operators = [
    "lt", "<",
    "le", "<=",
    "gt", ">",
    "ge", ">=",
    "eq", "=", "==",
    "ne", "<>", "!="
];

describe('Version Compare', function () {
    it('compare', () => {
        let result = '';
        let test = (v1, v2) => {
            let res = __jymfony.version_compare(v1, v2);
            switch (res) {
                case -1:
                    result += `${v1} < ${v2}\n`;
                    break;

                case 1:
                    result += `${v1} > ${v2}\n`;
                    break;

                default:
                case 0:
                    result += `${v1} = ${v2}\n`;
                    break;
            }
        };

        test("1", "2");
        test("10", "2");
        test("1.0", "1.1");
        test("1.2", "1.0.1");
        for (let f1 of special_forms) {
            for (let f2 of special_forms) {
                test(`1.0${f1}`, `1.0${f2}`);
            }
        }

        let expected = `1 < 2
10 > 2
1.0 < 1.1
1.2 > 1.0.1
1.0-dev = 1.0-dev
1.0-dev < 1.0a1
1.0-dev < 1.0b1
1.0-dev < 1.0RC1
1.0-dev < 1.0rc1
1.0-dev < 1.0
1.0-dev < 1.0pl1
1.0a1 > 1.0-dev
1.0a1 = 1.0a1
1.0a1 < 1.0b1
1.0a1 < 1.0RC1
1.0a1 < 1.0rc1
1.0a1 < 1.0
1.0a1 < 1.0pl1
1.0b1 > 1.0-dev
1.0b1 > 1.0a1
1.0b1 = 1.0b1
1.0b1 < 1.0RC1
1.0b1 < 1.0rc1
1.0b1 < 1.0
1.0b1 < 1.0pl1
1.0RC1 > 1.0-dev
1.0RC1 > 1.0a1
1.0RC1 > 1.0b1
1.0RC1 = 1.0RC1
1.0RC1 = 1.0rc1
1.0RC1 < 1.0
1.0RC1 < 1.0pl1
1.0rc1 > 1.0-dev
1.0rc1 > 1.0a1
1.0rc1 > 1.0b1
1.0rc1 = 1.0RC1
1.0rc1 = 1.0rc1
1.0rc1 < 1.0
1.0rc1 < 1.0pl1
1.0 > 1.0-dev
1.0 > 1.0a1
1.0 > 1.0b1
1.0 > 1.0RC1
1.0 > 1.0rc1
1.0 = 1.0
1.0 < 1.0pl1
1.0pl1 > 1.0-dev
1.0pl1 > 1.0a1
1.0pl1 > 1.0b1
1.0pl1 > 1.0RC1
1.0pl1 > 1.0rc1
1.0pl1 > 1.0
1.0pl1 = 1.0pl1
`;

        expect(result).to.be.equal(expected);
    });

    it('operators', () => {
        let result = '';

        for (let f1 of special_forms) {
            for (let f2 of special_forms) {
                for (let op of operators) {
                    let v1 = `1.0${f1}`;
                    let v2 = `1.0${f2}`;
                    let test = __jymfony.version_compare(v1, v2, op) ? "true" : "false";
                    result += util.format(
                        "%s %s %s : %s\n",
                        ('       ' + v1).slice(-7),
                        ('  ' + op).slice(-2),
                        (v2 + '       ').slice(0, 7),
                        test
                    );
                }
            }
        }

        let expected = `1.0-dev lt 1.0-dev : false
1.0-dev  < 1.0-dev : false
1.0-dev le 1.0-dev : true
1.0-dev <= 1.0-dev : true
1.0-dev gt 1.0-dev : false
1.0-dev  > 1.0-dev : false
1.0-dev ge 1.0-dev : true
1.0-dev >= 1.0-dev : true
1.0-dev eq 1.0-dev : true
1.0-dev  = 1.0-dev : true
1.0-dev == 1.0-dev : true
1.0-dev ne 1.0-dev : false
1.0-dev <> 1.0-dev : false
1.0-dev != 1.0-dev : false
1.0-dev lt 1.0a1   : true
1.0-dev  < 1.0a1   : true
1.0-dev le 1.0a1   : true
1.0-dev <= 1.0a1   : true
1.0-dev gt 1.0a1   : false
1.0-dev  > 1.0a1   : false
1.0-dev ge 1.0a1   : false
1.0-dev >= 1.0a1   : false
1.0-dev eq 1.0a1   : false
1.0-dev  = 1.0a1   : false
1.0-dev == 1.0a1   : false
1.0-dev ne 1.0a1   : true
1.0-dev <> 1.0a1   : true
1.0-dev != 1.0a1   : true
1.0-dev lt 1.0b1   : true
1.0-dev  < 1.0b1   : true
1.0-dev le 1.0b1   : true
1.0-dev <= 1.0b1   : true
1.0-dev gt 1.0b1   : false
1.0-dev  > 1.0b1   : false
1.0-dev ge 1.0b1   : false
1.0-dev >= 1.0b1   : false
1.0-dev eq 1.0b1   : false
1.0-dev  = 1.0b1   : false
1.0-dev == 1.0b1   : false
1.0-dev ne 1.0b1   : true
1.0-dev <> 1.0b1   : true
1.0-dev != 1.0b1   : true
1.0-dev lt 1.0RC1  : true
1.0-dev  < 1.0RC1  : true
1.0-dev le 1.0RC1  : true
1.0-dev <= 1.0RC1  : true
1.0-dev gt 1.0RC1  : false
1.0-dev  > 1.0RC1  : false
1.0-dev ge 1.0RC1  : false
1.0-dev >= 1.0RC1  : false
1.0-dev eq 1.0RC1  : false
1.0-dev  = 1.0RC1  : false
1.0-dev == 1.0RC1  : false
1.0-dev ne 1.0RC1  : true
1.0-dev <> 1.0RC1  : true
1.0-dev != 1.0RC1  : true
1.0-dev lt 1.0rc1  : true
1.0-dev  < 1.0rc1  : true
1.0-dev le 1.0rc1  : true
1.0-dev <= 1.0rc1  : true
1.0-dev gt 1.0rc1  : false
1.0-dev  > 1.0rc1  : false
1.0-dev ge 1.0rc1  : false
1.0-dev >= 1.0rc1  : false
1.0-dev eq 1.0rc1  : false
1.0-dev  = 1.0rc1  : false
1.0-dev == 1.0rc1  : false
1.0-dev ne 1.0rc1  : true
1.0-dev <> 1.0rc1  : true
1.0-dev != 1.0rc1  : true
1.0-dev lt 1.0     : true
1.0-dev  < 1.0     : true
1.0-dev le 1.0     : true
1.0-dev <= 1.0     : true
1.0-dev gt 1.0     : false
1.0-dev  > 1.0     : false
1.0-dev ge 1.0     : false
1.0-dev >= 1.0     : false
1.0-dev eq 1.0     : false
1.0-dev  = 1.0     : false
1.0-dev == 1.0     : false
1.0-dev ne 1.0     : true
1.0-dev <> 1.0     : true
1.0-dev != 1.0     : true
1.0-dev lt 1.0pl1  : true
1.0-dev  < 1.0pl1  : true
1.0-dev le 1.0pl1  : true
1.0-dev <= 1.0pl1  : true
1.0-dev gt 1.0pl1  : false
1.0-dev  > 1.0pl1  : false
1.0-dev ge 1.0pl1  : false
1.0-dev >= 1.0pl1  : false
1.0-dev eq 1.0pl1  : false
1.0-dev  = 1.0pl1  : false
1.0-dev == 1.0pl1  : false
1.0-dev ne 1.0pl1  : true
1.0-dev <> 1.0pl1  : true
1.0-dev != 1.0pl1  : true
  1.0a1 lt 1.0-dev : false
  1.0a1  < 1.0-dev : false
  1.0a1 le 1.0-dev : false
  1.0a1 <= 1.0-dev : false
  1.0a1 gt 1.0-dev : true
  1.0a1  > 1.0-dev : true
  1.0a1 ge 1.0-dev : true
  1.0a1 >= 1.0-dev : true
  1.0a1 eq 1.0-dev : false
  1.0a1  = 1.0-dev : false
  1.0a1 == 1.0-dev : false
  1.0a1 ne 1.0-dev : true
  1.0a1 <> 1.0-dev : true
  1.0a1 != 1.0-dev : true
  1.0a1 lt 1.0a1   : false
  1.0a1  < 1.0a1   : false
  1.0a1 le 1.0a1   : true
  1.0a1 <= 1.0a1   : true
  1.0a1 gt 1.0a1   : false
  1.0a1  > 1.0a1   : false
  1.0a1 ge 1.0a1   : true
  1.0a1 >= 1.0a1   : true
  1.0a1 eq 1.0a1   : true
  1.0a1  = 1.0a1   : true
  1.0a1 == 1.0a1   : true
  1.0a1 ne 1.0a1   : false
  1.0a1 <> 1.0a1   : false
  1.0a1 != 1.0a1   : false
  1.0a1 lt 1.0b1   : true
  1.0a1  < 1.0b1   : true
  1.0a1 le 1.0b1   : true
  1.0a1 <= 1.0b1   : true
  1.0a1 gt 1.0b1   : false
  1.0a1  > 1.0b1   : false
  1.0a1 ge 1.0b1   : false
  1.0a1 >= 1.0b1   : false
  1.0a1 eq 1.0b1   : false
  1.0a1  = 1.0b1   : false
  1.0a1 == 1.0b1   : false
  1.0a1 ne 1.0b1   : true
  1.0a1 <> 1.0b1   : true
  1.0a1 != 1.0b1   : true
  1.0a1 lt 1.0RC1  : true
  1.0a1  < 1.0RC1  : true
  1.0a1 le 1.0RC1  : true
  1.0a1 <= 1.0RC1  : true
  1.0a1 gt 1.0RC1  : false
  1.0a1  > 1.0RC1  : false
  1.0a1 ge 1.0RC1  : false
  1.0a1 >= 1.0RC1  : false
  1.0a1 eq 1.0RC1  : false
  1.0a1  = 1.0RC1  : false
  1.0a1 == 1.0RC1  : false
  1.0a1 ne 1.0RC1  : true
  1.0a1 <> 1.0RC1  : true
  1.0a1 != 1.0RC1  : true
  1.0a1 lt 1.0rc1  : true
  1.0a1  < 1.0rc1  : true
  1.0a1 le 1.0rc1  : true
  1.0a1 <= 1.0rc1  : true
  1.0a1 gt 1.0rc1  : false
  1.0a1  > 1.0rc1  : false
  1.0a1 ge 1.0rc1  : false
  1.0a1 >= 1.0rc1  : false
  1.0a1 eq 1.0rc1  : false
  1.0a1  = 1.0rc1  : false
  1.0a1 == 1.0rc1  : false
  1.0a1 ne 1.0rc1  : true
  1.0a1 <> 1.0rc1  : true
  1.0a1 != 1.0rc1  : true
  1.0a1 lt 1.0     : true
  1.0a1  < 1.0     : true
  1.0a1 le 1.0     : true
  1.0a1 <= 1.0     : true
  1.0a1 gt 1.0     : false
  1.0a1  > 1.0     : false
  1.0a1 ge 1.0     : false
  1.0a1 >= 1.0     : false
  1.0a1 eq 1.0     : false
  1.0a1  = 1.0     : false
  1.0a1 == 1.0     : false
  1.0a1 ne 1.0     : true
  1.0a1 <> 1.0     : true
  1.0a1 != 1.0     : true
  1.0a1 lt 1.0pl1  : true
  1.0a1  < 1.0pl1  : true
  1.0a1 le 1.0pl1  : true
  1.0a1 <= 1.0pl1  : true
  1.0a1 gt 1.0pl1  : false
  1.0a1  > 1.0pl1  : false
  1.0a1 ge 1.0pl1  : false
  1.0a1 >= 1.0pl1  : false
  1.0a1 eq 1.0pl1  : false
  1.0a1  = 1.0pl1  : false
  1.0a1 == 1.0pl1  : false
  1.0a1 ne 1.0pl1  : true
  1.0a1 <> 1.0pl1  : true
  1.0a1 != 1.0pl1  : true
  1.0b1 lt 1.0-dev : false
  1.0b1  < 1.0-dev : false
  1.0b1 le 1.0-dev : false
  1.0b1 <= 1.0-dev : false
  1.0b1 gt 1.0-dev : true
  1.0b1  > 1.0-dev : true
  1.0b1 ge 1.0-dev : true
  1.0b1 >= 1.0-dev : true
  1.0b1 eq 1.0-dev : false
  1.0b1  = 1.0-dev : false
  1.0b1 == 1.0-dev : false
  1.0b1 ne 1.0-dev : true
  1.0b1 <> 1.0-dev : true
  1.0b1 != 1.0-dev : true
  1.0b1 lt 1.0a1   : false
  1.0b1  < 1.0a1   : false
  1.0b1 le 1.0a1   : false
  1.0b1 <= 1.0a1   : false
  1.0b1 gt 1.0a1   : true
  1.0b1  > 1.0a1   : true
  1.0b1 ge 1.0a1   : true
  1.0b1 >= 1.0a1   : true
  1.0b1 eq 1.0a1   : false
  1.0b1  = 1.0a1   : false
  1.0b1 == 1.0a1   : false
  1.0b1 ne 1.0a1   : true
  1.0b1 <> 1.0a1   : true
  1.0b1 != 1.0a1   : true
  1.0b1 lt 1.0b1   : false
  1.0b1  < 1.0b1   : false
  1.0b1 le 1.0b1   : true
  1.0b1 <= 1.0b1   : true
  1.0b1 gt 1.0b1   : false
  1.0b1  > 1.0b1   : false
  1.0b1 ge 1.0b1   : true
  1.0b1 >= 1.0b1   : true
  1.0b1 eq 1.0b1   : true
  1.0b1  = 1.0b1   : true
  1.0b1 == 1.0b1   : true
  1.0b1 ne 1.0b1   : false
  1.0b1 <> 1.0b1   : false
  1.0b1 != 1.0b1   : false
  1.0b1 lt 1.0RC1  : true
  1.0b1  < 1.0RC1  : true
  1.0b1 le 1.0RC1  : true
  1.0b1 <= 1.0RC1  : true
  1.0b1 gt 1.0RC1  : false
  1.0b1  > 1.0RC1  : false
  1.0b1 ge 1.0RC1  : false
  1.0b1 >= 1.0RC1  : false
  1.0b1 eq 1.0RC1  : false
  1.0b1  = 1.0RC1  : false
  1.0b1 == 1.0RC1  : false
  1.0b1 ne 1.0RC1  : true
  1.0b1 <> 1.0RC1  : true
  1.0b1 != 1.0RC1  : true
  1.0b1 lt 1.0rc1  : true
  1.0b1  < 1.0rc1  : true
  1.0b1 le 1.0rc1  : true
  1.0b1 <= 1.0rc1  : true
  1.0b1 gt 1.0rc1  : false
  1.0b1  > 1.0rc1  : false
  1.0b1 ge 1.0rc1  : false
  1.0b1 >= 1.0rc1  : false
  1.0b1 eq 1.0rc1  : false
  1.0b1  = 1.0rc1  : false
  1.0b1 == 1.0rc1  : false
  1.0b1 ne 1.0rc1  : true
  1.0b1 <> 1.0rc1  : true
  1.0b1 != 1.0rc1  : true
  1.0b1 lt 1.0     : true
  1.0b1  < 1.0     : true
  1.0b1 le 1.0     : true
  1.0b1 <= 1.0     : true
  1.0b1 gt 1.0     : false
  1.0b1  > 1.0     : false
  1.0b1 ge 1.0     : false
  1.0b1 >= 1.0     : false
  1.0b1 eq 1.0     : false
  1.0b1  = 1.0     : false
  1.0b1 == 1.0     : false
  1.0b1 ne 1.0     : true
  1.0b1 <> 1.0     : true
  1.0b1 != 1.0     : true
  1.0b1 lt 1.0pl1  : true
  1.0b1  < 1.0pl1  : true
  1.0b1 le 1.0pl1  : true
  1.0b1 <= 1.0pl1  : true
  1.0b1 gt 1.0pl1  : false
  1.0b1  > 1.0pl1  : false
  1.0b1 ge 1.0pl1  : false
  1.0b1 >= 1.0pl1  : false
  1.0b1 eq 1.0pl1  : false
  1.0b1  = 1.0pl1  : false
  1.0b1 == 1.0pl1  : false
  1.0b1 ne 1.0pl1  : true
  1.0b1 <> 1.0pl1  : true
  1.0b1 != 1.0pl1  : true
 1.0RC1 lt 1.0-dev : false
 1.0RC1  < 1.0-dev : false
 1.0RC1 le 1.0-dev : false
 1.0RC1 <= 1.0-dev : false
 1.0RC1 gt 1.0-dev : true
 1.0RC1  > 1.0-dev : true
 1.0RC1 ge 1.0-dev : true
 1.0RC1 >= 1.0-dev : true
 1.0RC1 eq 1.0-dev : false
 1.0RC1  = 1.0-dev : false
 1.0RC1 == 1.0-dev : false
 1.0RC1 ne 1.0-dev : true
 1.0RC1 <> 1.0-dev : true
 1.0RC1 != 1.0-dev : true
 1.0RC1 lt 1.0a1   : false
 1.0RC1  < 1.0a1   : false
 1.0RC1 le 1.0a1   : false
 1.0RC1 <= 1.0a1   : false
 1.0RC1 gt 1.0a1   : true
 1.0RC1  > 1.0a1   : true
 1.0RC1 ge 1.0a1   : true
 1.0RC1 >= 1.0a1   : true
 1.0RC1 eq 1.0a1   : false
 1.0RC1  = 1.0a1   : false
 1.0RC1 == 1.0a1   : false
 1.0RC1 ne 1.0a1   : true
 1.0RC1 <> 1.0a1   : true
 1.0RC1 != 1.0a1   : true
 1.0RC1 lt 1.0b1   : false
 1.0RC1  < 1.0b1   : false
 1.0RC1 le 1.0b1   : false
 1.0RC1 <= 1.0b1   : false
 1.0RC1 gt 1.0b1   : true
 1.0RC1  > 1.0b1   : true
 1.0RC1 ge 1.0b1   : true
 1.0RC1 >= 1.0b1   : true
 1.0RC1 eq 1.0b1   : false
 1.0RC1  = 1.0b1   : false
 1.0RC1 == 1.0b1   : false
 1.0RC1 ne 1.0b1   : true
 1.0RC1 <> 1.0b1   : true
 1.0RC1 != 1.0b1   : true
 1.0RC1 lt 1.0RC1  : false
 1.0RC1  < 1.0RC1  : false
 1.0RC1 le 1.0RC1  : true
 1.0RC1 <= 1.0RC1  : true
 1.0RC1 gt 1.0RC1  : false
 1.0RC1  > 1.0RC1  : false
 1.0RC1 ge 1.0RC1  : true
 1.0RC1 >= 1.0RC1  : true
 1.0RC1 eq 1.0RC1  : true
 1.0RC1  = 1.0RC1  : true
 1.0RC1 == 1.0RC1  : true
 1.0RC1 ne 1.0RC1  : false
 1.0RC1 <> 1.0RC1  : false
 1.0RC1 != 1.0RC1  : false
 1.0RC1 lt 1.0rc1  : false
 1.0RC1  < 1.0rc1  : false
 1.0RC1 le 1.0rc1  : true
 1.0RC1 <= 1.0rc1  : true
 1.0RC1 gt 1.0rc1  : false
 1.0RC1  > 1.0rc1  : false
 1.0RC1 ge 1.0rc1  : true
 1.0RC1 >= 1.0rc1  : true
 1.0RC1 eq 1.0rc1  : true
 1.0RC1  = 1.0rc1  : true
 1.0RC1 == 1.0rc1  : true
 1.0RC1 ne 1.0rc1  : false
 1.0RC1 <> 1.0rc1  : false
 1.0RC1 != 1.0rc1  : false
 1.0RC1 lt 1.0     : true
 1.0RC1  < 1.0     : true
 1.0RC1 le 1.0     : true
 1.0RC1 <= 1.0     : true
 1.0RC1 gt 1.0     : false
 1.0RC1  > 1.0     : false
 1.0RC1 ge 1.0     : false
 1.0RC1 >= 1.0     : false
 1.0RC1 eq 1.0     : false
 1.0RC1  = 1.0     : false
 1.0RC1 == 1.0     : false
 1.0RC1 ne 1.0     : true
 1.0RC1 <> 1.0     : true
 1.0RC1 != 1.0     : true
 1.0RC1 lt 1.0pl1  : true
 1.0RC1  < 1.0pl1  : true
 1.0RC1 le 1.0pl1  : true
 1.0RC1 <= 1.0pl1  : true
 1.0RC1 gt 1.0pl1  : false
 1.0RC1  > 1.0pl1  : false
 1.0RC1 ge 1.0pl1  : false
 1.0RC1 >= 1.0pl1  : false
 1.0RC1 eq 1.0pl1  : false
 1.0RC1  = 1.0pl1  : false
 1.0RC1 == 1.0pl1  : false
 1.0RC1 ne 1.0pl1  : true
 1.0RC1 <> 1.0pl1  : true
 1.0RC1 != 1.0pl1  : true
 1.0rc1 lt 1.0-dev : false
 1.0rc1  < 1.0-dev : false
 1.0rc1 le 1.0-dev : false
 1.0rc1 <= 1.0-dev : false
 1.0rc1 gt 1.0-dev : true
 1.0rc1  > 1.0-dev : true
 1.0rc1 ge 1.0-dev : true
 1.0rc1 >= 1.0-dev : true
 1.0rc1 eq 1.0-dev : false
 1.0rc1  = 1.0-dev : false
 1.0rc1 == 1.0-dev : false
 1.0rc1 ne 1.0-dev : true
 1.0rc1 <> 1.0-dev : true
 1.0rc1 != 1.0-dev : true
 1.0rc1 lt 1.0a1   : false
 1.0rc1  < 1.0a1   : false
 1.0rc1 le 1.0a1   : false
 1.0rc1 <= 1.0a1   : false
 1.0rc1 gt 1.0a1   : true
 1.0rc1  > 1.0a1   : true
 1.0rc1 ge 1.0a1   : true
 1.0rc1 >= 1.0a1   : true
 1.0rc1 eq 1.0a1   : false
 1.0rc1  = 1.0a1   : false
 1.0rc1 == 1.0a1   : false
 1.0rc1 ne 1.0a1   : true
 1.0rc1 <> 1.0a1   : true
 1.0rc1 != 1.0a1   : true
 1.0rc1 lt 1.0b1   : false
 1.0rc1  < 1.0b1   : false
 1.0rc1 le 1.0b1   : false
 1.0rc1 <= 1.0b1   : false
 1.0rc1 gt 1.0b1   : true
 1.0rc1  > 1.0b1   : true
 1.0rc1 ge 1.0b1   : true
 1.0rc1 >= 1.0b1   : true
 1.0rc1 eq 1.0b1   : false
 1.0rc1  = 1.0b1   : false
 1.0rc1 == 1.0b1   : false
 1.0rc1 ne 1.0b1   : true
 1.0rc1 <> 1.0b1   : true
 1.0rc1 != 1.0b1   : true
 1.0rc1 lt 1.0RC1  : false
 1.0rc1  < 1.0RC1  : false
 1.0rc1 le 1.0RC1  : true
 1.0rc1 <= 1.0RC1  : true
 1.0rc1 gt 1.0RC1  : false
 1.0rc1  > 1.0RC1  : false
 1.0rc1 ge 1.0RC1  : true
 1.0rc1 >= 1.0RC1  : true
 1.0rc1 eq 1.0RC1  : true
 1.0rc1  = 1.0RC1  : true
 1.0rc1 == 1.0RC1  : true
 1.0rc1 ne 1.0RC1  : false
 1.0rc1 <> 1.0RC1  : false
 1.0rc1 != 1.0RC1  : false
 1.0rc1 lt 1.0rc1  : false
 1.0rc1  < 1.0rc1  : false
 1.0rc1 le 1.0rc1  : true
 1.0rc1 <= 1.0rc1  : true
 1.0rc1 gt 1.0rc1  : false
 1.0rc1  > 1.0rc1  : false
 1.0rc1 ge 1.0rc1  : true
 1.0rc1 >= 1.0rc1  : true
 1.0rc1 eq 1.0rc1  : true
 1.0rc1  = 1.0rc1  : true
 1.0rc1 == 1.0rc1  : true
 1.0rc1 ne 1.0rc1  : false
 1.0rc1 <> 1.0rc1  : false
 1.0rc1 != 1.0rc1  : false
 1.0rc1 lt 1.0     : true
 1.0rc1  < 1.0     : true
 1.0rc1 le 1.0     : true
 1.0rc1 <= 1.0     : true
 1.0rc1 gt 1.0     : false
 1.0rc1  > 1.0     : false
 1.0rc1 ge 1.0     : false
 1.0rc1 >= 1.0     : false
 1.0rc1 eq 1.0     : false
 1.0rc1  = 1.0     : false
 1.0rc1 == 1.0     : false
 1.0rc1 ne 1.0     : true
 1.0rc1 <> 1.0     : true
 1.0rc1 != 1.0     : true
 1.0rc1 lt 1.0pl1  : true
 1.0rc1  < 1.0pl1  : true
 1.0rc1 le 1.0pl1  : true
 1.0rc1 <= 1.0pl1  : true
 1.0rc1 gt 1.0pl1  : false
 1.0rc1  > 1.0pl1  : false
 1.0rc1 ge 1.0pl1  : false
 1.0rc1 >= 1.0pl1  : false
 1.0rc1 eq 1.0pl1  : false
 1.0rc1  = 1.0pl1  : false
 1.0rc1 == 1.0pl1  : false
 1.0rc1 ne 1.0pl1  : true
 1.0rc1 <> 1.0pl1  : true
 1.0rc1 != 1.0pl1  : true
    1.0 lt 1.0-dev : false
    1.0  < 1.0-dev : false
    1.0 le 1.0-dev : false
    1.0 <= 1.0-dev : false
    1.0 gt 1.0-dev : true
    1.0  > 1.0-dev : true
    1.0 ge 1.0-dev : true
    1.0 >= 1.0-dev : true
    1.0 eq 1.0-dev : false
    1.0  = 1.0-dev : false
    1.0 == 1.0-dev : false
    1.0 ne 1.0-dev : true
    1.0 <> 1.0-dev : true
    1.0 != 1.0-dev : true
    1.0 lt 1.0a1   : false
    1.0  < 1.0a1   : false
    1.0 le 1.0a1   : false
    1.0 <= 1.0a1   : false
    1.0 gt 1.0a1   : true
    1.0  > 1.0a1   : true
    1.0 ge 1.0a1   : true
    1.0 >= 1.0a1   : true
    1.0 eq 1.0a1   : false
    1.0  = 1.0a1   : false
    1.0 == 1.0a1   : false
    1.0 ne 1.0a1   : true
    1.0 <> 1.0a1   : true
    1.0 != 1.0a1   : true
    1.0 lt 1.0b1   : false
    1.0  < 1.0b1   : false
    1.0 le 1.0b1   : false
    1.0 <= 1.0b1   : false
    1.0 gt 1.0b1   : true
    1.0  > 1.0b1   : true
    1.0 ge 1.0b1   : true
    1.0 >= 1.0b1   : true
    1.0 eq 1.0b1   : false
    1.0  = 1.0b1   : false
    1.0 == 1.0b1   : false
    1.0 ne 1.0b1   : true
    1.0 <> 1.0b1   : true
    1.0 != 1.0b1   : true
    1.0 lt 1.0RC1  : false
    1.0  < 1.0RC1  : false
    1.0 le 1.0RC1  : false
    1.0 <= 1.0RC1  : false
    1.0 gt 1.0RC1  : true
    1.0  > 1.0RC1  : true
    1.0 ge 1.0RC1  : true
    1.0 >= 1.0RC1  : true
    1.0 eq 1.0RC1  : false
    1.0  = 1.0RC1  : false
    1.0 == 1.0RC1  : false
    1.0 ne 1.0RC1  : true
    1.0 <> 1.0RC1  : true
    1.0 != 1.0RC1  : true
    1.0 lt 1.0rc1  : false
    1.0  < 1.0rc1  : false
    1.0 le 1.0rc1  : false
    1.0 <= 1.0rc1  : false
    1.0 gt 1.0rc1  : true
    1.0  > 1.0rc1  : true
    1.0 ge 1.0rc1  : true
    1.0 >= 1.0rc1  : true
    1.0 eq 1.0rc1  : false
    1.0  = 1.0rc1  : false
    1.0 == 1.0rc1  : false
    1.0 ne 1.0rc1  : true
    1.0 <> 1.0rc1  : true
    1.0 != 1.0rc1  : true
    1.0 lt 1.0     : false
    1.0  < 1.0     : false
    1.0 le 1.0     : true
    1.0 <= 1.0     : true
    1.0 gt 1.0     : false
    1.0  > 1.0     : false
    1.0 ge 1.0     : true
    1.0 >= 1.0     : true
    1.0 eq 1.0     : true
    1.0  = 1.0     : true
    1.0 == 1.0     : true
    1.0 ne 1.0     : false
    1.0 <> 1.0     : false
    1.0 != 1.0     : false
    1.0 lt 1.0pl1  : true
    1.0  < 1.0pl1  : true
    1.0 le 1.0pl1  : true
    1.0 <= 1.0pl1  : true
    1.0 gt 1.0pl1  : false
    1.0  > 1.0pl1  : false
    1.0 ge 1.0pl1  : false
    1.0 >= 1.0pl1  : false
    1.0 eq 1.0pl1  : false
    1.0  = 1.0pl1  : false
    1.0 == 1.0pl1  : false
    1.0 ne 1.0pl1  : true
    1.0 <> 1.0pl1  : true
    1.0 != 1.0pl1  : true
 1.0pl1 lt 1.0-dev : false
 1.0pl1  < 1.0-dev : false
 1.0pl1 le 1.0-dev : false
 1.0pl1 <= 1.0-dev : false
 1.0pl1 gt 1.0-dev : true
 1.0pl1  > 1.0-dev : true
 1.0pl1 ge 1.0-dev : true
 1.0pl1 >= 1.0-dev : true
 1.0pl1 eq 1.0-dev : false
 1.0pl1  = 1.0-dev : false
 1.0pl1 == 1.0-dev : false
 1.0pl1 ne 1.0-dev : true
 1.0pl1 <> 1.0-dev : true
 1.0pl1 != 1.0-dev : true
 1.0pl1 lt 1.0a1   : false
 1.0pl1  < 1.0a1   : false
 1.0pl1 le 1.0a1   : false
 1.0pl1 <= 1.0a1   : false
 1.0pl1 gt 1.0a1   : true
 1.0pl1  > 1.0a1   : true
 1.0pl1 ge 1.0a1   : true
 1.0pl1 >= 1.0a1   : true
 1.0pl1 eq 1.0a1   : false
 1.0pl1  = 1.0a1   : false
 1.0pl1 == 1.0a1   : false
 1.0pl1 ne 1.0a1   : true
 1.0pl1 <> 1.0a1   : true
 1.0pl1 != 1.0a1   : true
 1.0pl1 lt 1.0b1   : false
 1.0pl1  < 1.0b1   : false
 1.0pl1 le 1.0b1   : false
 1.0pl1 <= 1.0b1   : false
 1.0pl1 gt 1.0b1   : true
 1.0pl1  > 1.0b1   : true
 1.0pl1 ge 1.0b1   : true
 1.0pl1 >= 1.0b1   : true
 1.0pl1 eq 1.0b1   : false
 1.0pl1  = 1.0b1   : false
 1.0pl1 == 1.0b1   : false
 1.0pl1 ne 1.0b1   : true
 1.0pl1 <> 1.0b1   : true
 1.0pl1 != 1.0b1   : true
 1.0pl1 lt 1.0RC1  : false
 1.0pl1  < 1.0RC1  : false
 1.0pl1 le 1.0RC1  : false
 1.0pl1 <= 1.0RC1  : false
 1.0pl1 gt 1.0RC1  : true
 1.0pl1  > 1.0RC1  : true
 1.0pl1 ge 1.0RC1  : true
 1.0pl1 >= 1.0RC1  : true
 1.0pl1 eq 1.0RC1  : false
 1.0pl1  = 1.0RC1  : false
 1.0pl1 == 1.0RC1  : false
 1.0pl1 ne 1.0RC1  : true
 1.0pl1 <> 1.0RC1  : true
 1.0pl1 != 1.0RC1  : true
 1.0pl1 lt 1.0rc1  : false
 1.0pl1  < 1.0rc1  : false
 1.0pl1 le 1.0rc1  : false
 1.0pl1 <= 1.0rc1  : false
 1.0pl1 gt 1.0rc1  : true
 1.0pl1  > 1.0rc1  : true
 1.0pl1 ge 1.0rc1  : true
 1.0pl1 >= 1.0rc1  : true
 1.0pl1 eq 1.0rc1  : false
 1.0pl1  = 1.0rc1  : false
 1.0pl1 == 1.0rc1  : false
 1.0pl1 ne 1.0rc1  : true
 1.0pl1 <> 1.0rc1  : true
 1.0pl1 != 1.0rc1  : true
 1.0pl1 lt 1.0     : false
 1.0pl1  < 1.0     : false
 1.0pl1 le 1.0     : false
 1.0pl1 <= 1.0     : false
 1.0pl1 gt 1.0     : true
 1.0pl1  > 1.0     : true
 1.0pl1 ge 1.0     : true
 1.0pl1 >= 1.0     : true
 1.0pl1 eq 1.0     : false
 1.0pl1  = 1.0     : false
 1.0pl1 == 1.0     : false
 1.0pl1 ne 1.0     : true
 1.0pl1 <> 1.0     : true
 1.0pl1 != 1.0     : true
 1.0pl1 lt 1.0pl1  : false
 1.0pl1  < 1.0pl1  : false
 1.0pl1 le 1.0pl1  : true
 1.0pl1 <= 1.0pl1  : true
 1.0pl1 gt 1.0pl1  : false
 1.0pl1  > 1.0pl1  : false
 1.0pl1 ge 1.0pl1  : true
 1.0pl1 >= 1.0pl1  : true
 1.0pl1 eq 1.0pl1  : true
 1.0pl1  = 1.0pl1  : true
 1.0pl1 == 1.0pl1  : true
 1.0pl1 ne 1.0pl1  : false
 1.0pl1 <> 1.0pl1  : false
 1.0pl1 != 1.0pl1  : false
`;

        expect(result).to.be.equal(expected);
    })
});
