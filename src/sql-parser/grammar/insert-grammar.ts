import { SqlStruct, UseGrammarType, InsertGrammarType, InsertType } from "../base";

/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-09 18:39:49
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 17:01:27
 */
class InsertGrammar {
  public static parseInsertSql(lexter: SqlStruct, slotQue: Array<any>): InsertGrammarType {
    const cmd = lexter.cmd, insertLexter = lexter.other, key = [], value = [], slots = slotQue, map: Map<string, any> = new Map();
    let isValue = false;
    // shift 'into' command
    insertLexter.shift();
    const tableName = insertLexter.shift();
    insertLexter.forEach((item, index, arr) => {
      if (item === 'values') {
        isValue = true;
        return;
      }
      if (isValue) {
        // slot为关键字如果有slot那么将所有slot替换为要插入的真实值，在slotQue中
        item === 'slot' ? value.push(slots.shift()) : value.push(item);
      } else {
        key.push(item);
      }
    });
    key.forEach((item, index, arr) => {
      map.set(item, value[index]);
    });
    const insert: InsertType = {
      tableName,
      column: map,
    };
    const res: InsertGrammarType = {
      cmd,
      insert,
    };
    return res;
  }
}

export default InsertGrammar;
