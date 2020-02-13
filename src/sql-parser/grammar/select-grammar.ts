/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-09 18:39:44
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-02-13 15:43:15
 */
import { SqlStruct, SelectGrammarType, SelectType } from "../base";

class SelectGrammar {
  public static parserSelectSql(lexter: SqlStruct): SelectGrammarType {
    // 删除from
    lexter.other.shift();
    // 删除*
    lexter.other.shift();
    const cmd = lexter.cmd, tokens = lexter.other, tableName = lexter.other.shift(), map: Map<string, any> = new Map();
    // 删除where
    if (lexter.other.length > 0) lexter.other.shift();
    console.log('selectgrammar:', lexter.other);
    lexter.other.forEach((value, index, arr) => {
      if (value === 'and') return;
      // 偶数都是key，奇数都是value
      if ((index % 2) === 0) {
        map.set(value, lexter.other[index + 1]);
      }
    });
    const select: SelectType = {
      tableName,
      where: map,
    };
    const res: SelectGrammarType = {
      cmd,
      select
    };
    return res;
  }
}

export default SelectGrammar;
