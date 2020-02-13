/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-03 15:12:45
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-13 16:23:12
 */
import { CommandType, SqlStruct } from './base';

class SQLLexter {

  public parserSQL(sql: string) {
    const afterTrimSql = sql.toString().trim().toLowerCase();
    let sqlQue: Array<SqlStruct> = [], tokenQue: Array<any> = [];
    const afterQuoSpace = this.handleSingleQuoSpace(afterTrimSql);
    for (let i = 0, len = afterQuoSpace.length; i < len; i += 1) {
      const template = afterQuoSpace[i];
      let index = 0;
      const tempateLen = template.length;
      if (!template) continue;
      for (;index < tempateLen; index += 1) {
        const cur = template.charAt(index);
        if("'" === cur || '"' === cur) {
          let sub = '';
          let start = index + 1, end = index;
          index ++;
          while(index < template.length && cur !== (sub = template.charAt(index))) {
            index ++;
          }
          end = index;
          const res = template.substring(start, end);
          tokenQue.push(res);
        } else if (/^[a-z_]+$/i.test(cur) || /^[0-9_]+$/i.test(cur) || /^\*/i.test(cur)) {
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
          tokenQue.push(res);
        }
      }
      const cmd = tokenQue.shift();
      const sqlStru: SqlStruct = {
        cmd: cmd,
        other: JSON.parse(JSON.stringify(tokenQue)),
      };
      tokenQue = [];
      sqlQue.push(sqlStru);
    }
    const res = JSON.parse(JSON.stringify(sqlQue));
    return res;
  }

  private tokenStart(type: any) {

  }

  private tokenEnd(res: any) {

  }

  private handleAllEnd() {

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
