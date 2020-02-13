/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-03 15:08:41
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-13 16:58:39
 */
import { UseGrammarType, TableGrammarType, DBMessage, InsertGrammarType, ResTemplate, StateCode, SelectGrammarType } from "../sql-parser/base";
import { inClude, map2Obj } from "../help/tool";

type TableCallBack = {
  tgt: TableGrammarType,
  cb: Function,
};

class DBManager {
  private version: number = 0;
  private dbName: string = '';
  private request: IDBOpenDBRequest;
  private managerObj: Array<TableCallBack> = [];
  private task: Array<any> = [];
  private db: IDBDatabase;
  private state: boolean = false;
  private dbMessage: DBMessage = {
    dbName: '',
    oldVersion: 0,
    newVersion: 0,
    objectStoreNames: [],
  };
  constructor() {

  }

  public executeUse(db: UseGrammarType, cb: Function): void {
    const version = db.use.version, dbName = db.use.dbName;
    this.dbMessage.dbName = dbName;
    this.request = indexedDB.open(dbName, version);
    const cbFun = cb;
    this.request.onerror = () => {
      const data: ResTemplate = {
        code: StateCode.Error,
        data: '',
      };
      cbFun(data);
    };
    this.request.onsuccess = (event: any) => {
      console.log('db open success');
      this.db = event.target.result;
      this.state = true;
      // 当db初始化成功，查看task中是否有未初始化完成时就要执行的任务
      this.task.forEach((value, index, arr) => {
        this[value.fun](value.param.i, value.param.cb);
      });
      console.log('requestSuccess:', event);
      const data: ResTemplate = {
        code: StateCode.Success,
        data: '',
      }
      cbFun(data);
    };
    this.request.onupgradeneeded = this.onupgradeneeded.bind(this);
  }

  public executeTable(t: TableGrammarType, cb: Function): void {
    const tableName = t.table.tableName, talbeColumn = t.table.column;
    this.managerObj.push({
      tgt: t,
      cb
    });
  }

  // db执行insert语句
  public executeInsert(i: InsertGrammarType, cb: Function): void {
    // 如果db没初始化成功，那么存入task，带初始化完成后在执行
    if (!this.checkState()) {
      this.task.push({
        fun: 'executeInsert',
        param: {
          i,
          cb,
        },
      });
      return;
    }
    const tableName = i.insert.tableName,
          column = i.insert.column,
          objectStoreReq = this.db.transaction([tableName], 'readwrite').objectStore(tableName),
          obj = map2Obj(column);
    console.log('executeInsert:', obj);
    const cbFun = cb;
    try {
      const req = objectStoreReq.add(obj);
      req.onsuccess = () => {
        console.log('xxx', cbFun);
        const res: ResTemplate = {
          code: StateCode.Success,
          data: '',
        }
        cbFun(res);
      };
      req.onerror = () => {
        const res: ResTemplate = {
          code: StateCode.Error,
          data: '',
        }
        cbFun(res);
      };
    } catch (error) {
      const res: ResTemplate = {
        code: StateCode.Error,
        data: error,
      }
      cbFun(res);
    }    
  }

  // db执行selec语句
  public executeSelect(s: SelectGrammarType, cb: Function): void {
    // 如果db没初始化成功，那么存入task，带初始化完成后在执行
    if (!this.checkState()) {
      this.task.push({
        fun: 'executeSelect',
        param: {
          i: s,
          cb,
        },
      });
      return;
    } 
    const tableName = s.select.tableName, where = s.select.where;
    console.error('where.size:', where.size);
    if (where.size > 0) {
      // 如果有where
      this.selectWhereFromTable(tableName, where, cb);
    } else {
      // 如果是检索所有
      this.selectAllFromTable(tableName, cb);
    }
  }

  // where
  private selectWhereFromTable(tableName: string, where: Map<string, any>, cb: Function) {
    const store = this.getObjectStore(tableName, 'readwrite');
    where.forEach((value, key, arr) => {
      const index = store.index(key);
      const cursor = index.openCursor();
      const data = [];
      cursor.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          const req = store.getKey(cursor.key);
          req.onsuccess = (event: any) => {
            const value = event.target.result;
            data.push(value);
          };
          cursor.continue();
        } else {
          const res: ResTemplate = {
            code: StateCode.Success,
            data,
          };
          cb(res);
        }
      };
    });
    // const req = store.index(); // not IDBRequest
    // // const req = store.get(1); IDBRequest
    // req.get('xxq').onsuccess = (event: any) => {
    //   console.log(event.target.result);
    // }

    // const index = store.index('name');
    // const cursor = index.openCursor();
    // cursor.onsuccess = (event: any) => {
    //   const cursor = event.target.result;
    //   if (cursor) {
    //     // const req = store.get();
    //     console.log(cursor.key);
    //     cursor.continue();
    //   }
    // };
  }

  // 查询表中所有数据
  private selectAllFromTable(tableName: string, cb: Function) {
    const store = this.getObjectStore(tableName, 'readwrite');
    const res = store.openCursor();
    const data = [];
    res.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        const req = store.get(cursor.key);
        req.onsuccess = (event: any) => {
          const value = event.target.result;
          data.push(value);
        };
        cursor.continue();
      } else {
        const res: ResTemplate = {
          code: StateCode.Success,
          data,
        };
        cb(res);
      }
    };
  }

  private getObjectStore(tableName, mode): IDBObjectStore {
    const tx = this.db.transaction(tableName, mode);
    return tx.objectStore(tableName);
  }

  private checkState(): boolean {
    return this.state;
  }

  // 表
  // 增: 在输入表结构中有，在原有表结构中没有 ✔️ done
  // 删: 在输入表结构中没有，在原有表结构中有 ❌
  // 改: 输入表和原有表都有，但是字段不同（这里涉及字段的增、删、改）❌
  private onupgradeneeded(event: any): void {
    console.log('requestUpgradeneeded, event:', event);
    const oldVersion = event.oldVersion,
          newVersion = event.oldVersion,
          IDBDatabase = event.target.result,
          hasTableNames = IDBDatabase.objectStoreNames;
    this.dbMessage.oldVersion = oldVersion,
    this.dbMessage.newVersion = newVersion;
    this.dbMessage.objectStoreNames = hasTableNames;
    console.log('dbMessage:', this.dbMessage);
    this.managerObj.forEach((value: TableCallBack, index, arr) => {
      const table = value.tgt.table, cb = value.cb, tableName = table.tableName, talbeColumn = table.column;
      if (inClude(tableName, hasTableNames)) {
        console.log('has table:', tableName);
        const res: ResTemplate = {
          code: StateCode.Success,
          data: '',
        }
        cb(res); 
      } else {
        // indexDB不存在该表结构，创建表
        this.createTable(IDBDatabase, tableName, talbeColumn, cb);
        console.log('do not has talbe:', tableName);
      }
    });
  }

  private updateTable() {
    
  }
  // 创建表
  private createTable(IDBDatabase: IDBDatabase, tableName: string, talbeColumn: Map<string, string>, cb: Function): void {
    const store = IDBDatabase.createObjectStore(
      tableName,
      {
        keyPath: 'id',
        autoIncrement: true,
      }
    );
    talbeColumn.forEach((value: string, key: string) => {
      store.createIndex(value, value, { unique: false });
    });
    const res: ResTemplate = {
      code: StateCode.Success,
      data: '',
    }
    cb(res);
  }
  // IDBDatabase.deleteObjectStore:删除表
  // 生成ID与DB异步操作回调对应关系

}

export default DBManager;