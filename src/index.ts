/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-14 23:32:29
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 18:53:56
 */
import SqlLexter from './sql-parser/sql-lexter';
import UseGrammar from './sql-parser/grammar/use-grammar';
import { CommandType, SqlStruct, UseGrammarType, TableGrammarType, InsertGrammarType } from './sql-parser/base';
import TableGrammar from './sql-parser/grammar/table-grammar';
import DBManager from './db/db-manager';
import InsertGrammar from './sql-parser/grammar/insert-grammar';
import { isArray } from './help/tool';

class EasyIndexDb {
  private sqlLexter: SqlLexter = null;
  private dbManager: DBManager = null;
  private slotQue: Array<any> = [];
  private version: number = 0;

  constructor(version: number) {
    this.version = version;
    this.sqlLexter = new SqlLexter();
    this.dbManager = new DBManager();
  } 

  public execute(sql: string | Array<any>) {
    let sqlStr: string = '';
    if (isArray(sql)) {
      sqlStr = (<Array<any>>sql).shift();
      (<Array<any>>sql).forEach((value, index, arr) => {
        this.slotQue.push(value);
      });
    } else {
      sqlStr = <string>sql;
    }
    this.sqlLexter.parserSQL(sqlStr);
    const resSqlLexter:Array<SqlStruct> = this.sqlLexter.getLexterResult();
    console.log('afterSqlLexter:', resSqlLexter);
    resSqlLexter.forEach(this.handleLexter.bind(this));
  }

  private handleLexter(value: SqlStruct, index: number, arr: Array<SqlStruct>) {
    const sqlKey = value.cmd;
    let res: UseGrammarType | TableGrammarType | InsertGrammarType = null;
    switch (sqlKey) {
      case CommandType.Use:
        res = UseGrammar.parserUseSql(value, this.version);
        this.dbManager.executeUse(res);
        break;
      case CommandType.Create:
        res = TableGrammar.parserTableSql(value);
        this.dbManager.executeTable(res);
        break;
      case CommandType.Insert:
        // 判断是否有slot，如果有传入把slotQue传入parser
        res = InsertGrammar.parseInsertSql(value, this.slotQue);
        this.dbManager.executeInsert(res);
        break;
      case CommandType.Delete:
        break;
      case CommandType.Select:
        break;
      case CommandType.Update:
        break;
      default:
        console.error('sqlKey is not defined');
        break;
    }
    console.log('handleLexter: ', res);
  }
}

// test
const eid = new EasyIndexDb(18);
const conbinationSQL = `
  use DBName_1;

  create table TName_1
  (
    name,
    age,
    relation,
  );
  create table TName_2
  (
    name2,
    age2,
    relation2,
  );
`;
const useDBSQL = 'use DBName_1';
const createTableSQL = `
  create table TName_1
  (
    name,
    age,
    relation,
  )`;
const createTableSQL1 = `
  create table TName_1
  (
    name,
    age,
    relation,
  )`;
const buffer = new ArrayBuffer(100);
const insertSql = `insert into TName_1(name, age, relation) values("xxq", "25", "child")`;
// const insertSql = `insert into TName_1(name, age, relation) values("xxq", "25", "slot")`;
eid.execute(conbinationSQL);
setTimeout(() => {
  eid.execute(insertSql);
}, 5 * 1000);
// eid.execute([insertSql, buffer]);
export default EasyIndexDb;
