/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-03 15:08:41
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 10:47:04
 */
class DBManager {
  private version: number = 0;
  private dbName: string = '';
  private request: IDBOpenDBRequest;
  private tables: Array<any> = [];
  constructor() {

  }

  public executeUse(dbName: string, version: number): void {
    this.request = indexedDB.open(dbName, version);
    this.request.onerror.bind(this.requestError.bind(this));
    this.request.onsuccess.bind(this.requestSuccess.bind(this));
    this.request.onupgradeneeded.bind(this.requestUpgradeneeded.bind(this));
  }

  public executeTable(table: any): void {
    this.tables.push(table);
  }

  private requestError(): void {

  }

  private requestSuccess(): void {

  }

  private requestUpgradeneeded(): void {
    
  }
}

export default DBManager;