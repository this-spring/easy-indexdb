/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-09 18:39:27
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 10:19:08
 */
import { SqlStruct, UseGrammarType } from '../base';

class UseGrammar {
  public static parserUseSql(lexter: SqlStruct): UseGrammarType {
    const res: UseGrammarType = {
      cmd: lexter.cmd,
      operation: lexter.other.shift(),
    };
    return res;
  }
}

export default UseGrammar;
