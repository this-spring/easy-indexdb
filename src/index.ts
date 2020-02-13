/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-14 23:32:29
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-13 16:29:18
 */
import SqlLexter from './sql-parser/sql-lexter';
import UseGrammar from './sql-parser/grammar/use-grammar';
import { CommandType, SqlStruct, UseGrammarType, TableGrammarType, InsertGrammarType, SelectGrammarType } from './sql-parser/base';
import TableGrammar from './sql-parser/grammar/table-grammar';
import DBManager from './db/db-manager';
import InsertGrammar from './sql-parser/grammar/insert-grammar';
import { isArray } from './help/tool';
import SelectGrammar from './sql-parser/grammar/select-grammar';

class EasyIndexDb {
  private sqlLexter: SqlLexter = null;
  private dbManager: DBManager = null;
  private slotQue: Array<any> = [];
  private cbQue: Array<any> = [];
  private version: number = 0;

  constructor(version: number) {
    this.version = version;
    this.sqlLexter = new SqlLexter();
    this.dbManager = new DBManager();
  } 

  public execute(sql: string | Array<any>, cbQue: Array<any>) {
    let sqlStr: string = '';
    if (isArray(sql)) {
      sqlStr = (<Array<any>>sql).shift();
      (<Array<any>>sql).forEach((value, index, arr) => {
        this.slotQue.push(value);
      });
    } else {
      sqlStr = <string>sql;
    }
    this.cbQue = this.cbQue.concat(cbQue);
    const resSqlLexter:Array<SqlStruct> = this.sqlLexter.parserSQL(sqlStr);
    console.log('afterSqlLexter:', JSON.stringify(resSqlLexter));
    resSqlLexter.forEach(this.handleLexter.bind(this));
  }

  private handleLexter(value: SqlStruct, index: number, arr: Array<SqlStruct>) {
    const sqlKey = value.cmd, cb = this.cbQue.shift();
    let res: UseGrammarType | TableGrammarType | InsertGrammarType | SelectGrammarType = null;
    console.error('sqlKey:', sqlKey);
    switch (sqlKey) {
      case CommandType.Use:
        res = UseGrammar.parserUseSql(value, this.version);
        this.dbManager.executeUse(res, cb);
        break;
      case CommandType.Create:
        res = TableGrammar.parserTableSql(value);
        this.dbManager.executeTable(res, cb);
        break;
      case CommandType.Insert:
        // 判断是否有slot，如果有传入把slotQue传入parser
        res = InsertGrammar.parseInsertSql(value, this.slotQue);
        this.dbManager.executeInsert(res, cb);
        break;
      case CommandType.Delete:
        break;
      case CommandType.Select:
        res = SelectGrammar.parserSelectSql(value);
        this.dbManager.executeSelect(res, cb);
        break;
      case CommandType.Update:
        break;
      default:
        console.error('sqlKey is not defined');
        break;
    }
  }
}

// test
const eid = new EasyIndexDb(19);
const conbinationSQL = `
  use DB_test;

  create table pdfTable
  (
    pdfUrl,
    pdfData,
    pdfMd5,
  );
`;
const insert1 = `insert into pdfTable(pdfUrl, pdfData, pdfMd5) values('https://wwww.baidi.com/1.pdf', 'pdfData1', '111')`;
const insert2 = `insert into pdfTable(pdfUrl, pdfData, pdfMd5) values('https://wwww.baidi.com/2.pdf', 'pdfData2', '222')`
const select = `select * from pdfTable where pdfUrl='https://wwww.baidi.com/2.pdf'`;
eid.execute(conbinationSQL, [() => {}, () => {}]);
// eid.execute(insert1, [() => {}]);
// eid.execute(insert2, [() => {}]);
eid.execute(select, [(data) => {console.error(data)}]);
// const useDBSQL = 'use DBName_1';
// const createTableSQL = `
//   create table TName_1
//   (
//     name,
//     age,
//     relation,
//   )`;
// const createTableSQL1 = `
//   create table TName_1
//   (
//     name,
//     age,
//     relation,
//   )`;
// const buffer = new ArrayBuffer(100);
// const insertSql = `insert into TName_2(tnUrl, tnData) values("http://www.baidu.com", "xx")`;
// const insertSql1 = `insert into TName_2(tnUrl, tnData) values("http://www.baidu.com1", "xx1")`;
// const insertSql2 = `insert into TName_2(tnUrl, tnData) values("http://www.baidu.com2", "xx2")`;
// const selectSqlWhere = `select * from TName_2 where tnUrl = "http://www.baidu.com"`;

// eid.execute(conbinationSQL, [() => {}, () => {}, () => {}]);
// eid.execute(insertSql, [() => {}]);
// eid.execute(insertSql1, [() => {}]);
// eid.execute(insertSql2, [() => {}]);
// eid.execute(selectSqlWhere, [(data) => {
//   console.error(data);
// }]);
// const selectSql = `select * from TName_2`;
// const selectSqlWhere = `select * from TName_1 where tnUrl="http://www.baidu.com"`;
// // const insertSql = `insert into TName_1(name, age, relation) values("xxq", "25", "slot")`;
// eid.execute(conbinationSQL, [(data) => {
//   console.error(data);
// }, (data) => {
//   console.error(data);
// }, (data) => {
//   console.error(data);
// }]);
// eid.execute(insertSql, [(data) => {
//   console.error(data);
// }]);
// eid.execute(selectSqlWhere, [(data) => {
//   console.log('selectSql:', data);
// }]);
// eid.execute([insertSql, buffer]);
export default EasyIndexDb;
