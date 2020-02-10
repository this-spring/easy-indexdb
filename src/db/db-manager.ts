/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-03 15:08:41
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 18:44:08
 */
import { UseGrammarType, TableGrammarType, DBMessage, InsertGrammarType } from "../sql-parser/base";
import { inClude, map2Obj } from "../help/tool";

class DBManager {
  private version: number = 0;
  private dbName: string = '';
  private request: IDBOpenDBRequest;
  private managerObj: Array<TableGrammarType> = [];
  private db: IDBDatabase;
  private dbMessage: DBMessage = {
    dbName: '',
    oldVersion: 0,
    newVersion: 0,
    objectStoreNames: [],
  };
  constructor() {

  }

  public executeUse(db: UseGrammarType): void {
    const version = db.use.version, dbName = db.use.dbName;
    this.dbMessage.dbName = dbName;
    this.request = indexedDB.open(dbName, version);
    this.request.onerror = this.requestError.bind(this);
    this.request.onsuccess = this.requestSuccess.bind(this);
    this.request.onupgradeneeded = this.onupgradeneeded.bind(this);
  }

  public executeTable(t: TableGrammarType): void {
    const tableName = t.table.tableName, talbeColumn = t.table.column;
    this.managerObj.push(t);
  }

  public executeInsert(i: InsertGrammarType): void {
    const tableName = i.insert.tableName,
          column = i.insert.column,
          // transaction = this.db.transaction([tableName]),
          objectStoreReq = this.db.transaction([tableName], 'readwrite').objectStore(tableName),
          obj = map2Obj(column);
    console.log('executeInsert:', obj);
    objectStoreReq.add(obj);
  }

  private requestError(): void {
    console.log('requestError');
  }

  private requestSuccess(event: any): void {
    this.db = event.target.result;
    console.log('requestSuccess:', event);
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
    this.managerObj.forEach((value: TableGrammarType, index, arr) => {
      const table = value.table, tableName = table.tableName, talbeColumn = table.column;
      if (inClude(tableName, hasTableNames)) {
        console.log('has table:', tableName);
      } else {
        // indexDB不存在该表结构，创建表
        this.createTable(IDBDatabase, tableName, talbeColumn);
        console.log('do not has talbe:', tableName);
      }
    });
  }

  private updateTable() {
    
  }
  // 创建表
  private createTable(IDBDatabase: IDBDatabase, tableName: string, talbeColumn: Map<string, string>): void {
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
  }
  // IDBDatabase.deleteObjectStore:删除表
}

export default DBManager;