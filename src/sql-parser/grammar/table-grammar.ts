/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-10 10:51:57
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 11:42:07
 */
import { TableType, TableGrammarType, SqlStruct } from '../base';
class TableGrammar {
  constructor() {
  }

  public static parserTableSql(lexter: SqlStruct): TableGrammarType {
    // table
    lexter.other.shift();
    const cmd = lexter.cmd, tableName = lexter.other.shift(), columnMap: Map<string, string> = new Map();
    lexter.other.forEach((value, index, arr) => {
      columnMap.set(value, value);
    });
    const table: TableType = {
      tableName,
      column: columnMap,
    }
    const res: TableGrammarType = {
      cmd,
      table,
    }
    return res;
  }
}

export default TableGrammar;
