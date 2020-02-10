/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-09 18:39:27
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 11:59:54
 */
import { SqlStruct, UseGrammarType, UseType } from '../base';

class UseGrammar {
  public static parserUseSql(lexter: SqlStruct, version: number): UseGrammarType {
    const use: UseType = {
      dbName: lexter.other.shift(),
      version,
    };
    const res: UseGrammarType = {
      cmd: lexter.cmd,
      use,
    };
    return res;
  }
}

export default UseGrammar;
