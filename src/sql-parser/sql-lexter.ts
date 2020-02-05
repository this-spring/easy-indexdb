/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-03 15:12:45
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-05 23:40:07
 */
import { CommandType } from './base';
class SQLLexter {
  constructor() {

  }

  public parserDB(sql: string) {
    const afterTrimSql = sql.toString().trim().toLowerCase();
    const afterQuoSpace = this.handleSingleQuoSpace(afterTrimSql);
    for (let i = 0, len = afterQuoSpace.length; i < len; i += 1) {
      const template = afterQuoSpace[i];
      const index = 0;
      const tempateLen = 0;
      for (;index < tempateLen; i += 1) {
        const cur = template.charAt(i);
        let res = '';
        // use db
        if (/^[a-z_]+$/i.test(cur)) {
          let sub = '', res = template.charAt(i);
          while(i < template.length) {
            i ++;
            sub = template.charAt(i);
            if (!(/^[\w\.:]+$/i.test(sub))) {
              i --;
              break;
            }
            res += sub
          }
        }
      }
    }
  }

  private tokenStart(type: any) {

  }

  private tokenEnd(res: any) {

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
