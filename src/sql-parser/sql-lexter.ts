/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-03 15:12:45
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-09 18:36:07
 */
import { CommandType } from './base';

type SqlStruct = {
  cmd: CommandType,
  other: any,
}

class SQLLexter {
  private sqlQue: Array<SqlStruct> = [];
  private tokenQue: Array<any> = [];

  public parserSQL(sql: string) {
    const afterTrimSql = sql.toString().trim().toLowerCase();
    const afterQuoSpace = this.handleSingleQuoSpace(afterTrimSql);
    for (let i = 0, len = afterQuoSpace.length; i < len; i += 1) {
      const template = afterQuoSpace[i];
      let index = 0;
      const tempateLen = template.length;
      if (!template) continue;
      for (;index < tempateLen; index += 1) {
        const cur = template.charAt(index);
        if (/^[a-z_]+$/i.test(cur)) {
          let sub = '', res = template.charAt(index);
          while(index < template.length) {
            index ++;
            sub = template.charAt(index);
            if (!(/^[\w\.:]+$/i.test(sub))) {
              index --;
              break;
            }
            res += sub
          }
          console.log(res);
          this.tokenQue.push(res);
        }
      }
      this.handleAllEnd();
    }
  }

  public getLexterResult() {
    return this.sqlQue;
  }

  private tokenStart(type: any) {

  }

  private tokenEnd(res: any) {

  }

  private handleAllEnd() {
    const cmd = this.tokenQue.shift();
    const sqlStru: SqlStruct = {
      cmd: cmd,
      other: this.tokenQue,
    };
    this.tokenQue = [];
    this.sqlQue.push(sqlStru);
  }

  private handleSingleQuoSpace(str: string) {
    const strArr = str.split(';');
    if (strArr.length >= 0) {
      const afterTrimArr = strArr.map((value) => {
        return value.trim();
      });
      return afterTrimArr;
    } else {
      return strArr;
    }
  }
}


export default SQLLexter;
