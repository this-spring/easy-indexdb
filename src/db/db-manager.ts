/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-03 15:08:41
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 14:59:38
 */
import { UseGrammarType, TableGrammarType, DBMessage } from "../sql-parser/base";
import { inClude } from "../help/tool";

class DBManager {
  private version: number = 0;
  private dbName: string = '';
  private request: IDBOpenDBRequest;
  private managerObj: Array<TableGrammarType> = [];
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

  private requestError(): void {
    console.log('requestError');
  }

  private requestSuccess(): void {
    console.log('requestSuccess');
  }

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