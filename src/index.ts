/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-14 23:32:29
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 14:20:04
 */
// var Parser = require('sqlparser');
// import Parser from 'sqlparser';
// var result = Parser.parse('SELECT * FROM table');
// console.log(result);

import SqlLexter from './sql-parser/sql-lexter';
import UseGrammar from './sql-parser/grammar/use-grammar';
import { CommandType, SqlStruct, UseGrammarType, TableGrammarType } from './sql-parser/base';
import TableGrammar from './sql-parser/grammar/table-grammar';
import DBManager from './db/db-manager';

class EasyIndexDb {
  private sqlLexter: SqlLexter = null;
  private dbManager: DBManager = null;
  private version: number = 0;

  constructor(version: number) {
    this.version = version;
    this.sqlLexter = new SqlLexter();
    this.dbManager = new DBManager();
  } 

  public execute(sql: any) {
    this.sqlLexter.parserSQL(sql);
    const resSqlLexter:Array<SqlStruct> = this.sqlLexter.getLexterResult();
    resSqlLexter.forEach(this.handleLexter.bind(this));
  }

  private handleLexter(value: SqlStruct, index: number, arr: Array<SqlStruct>) {
    const sqlKey = value.cmd;
    let res: UseGrammarType | TableGrammarType = null;
    switch (sqlKey) {
      case CommandType.Use:
        res = UseGrammar.parserUseSql(value, this.version);
        this.dbManager.executeUse(res);
        break;
      case CommandType.Create:
        res = TableGrammar.parserTableSql(value);
        this.dbManager.executeTable(res);
        break;
      default:
        console.error('sqlKey is not defined');
        break;
    }
    console.log('handleLexter: ', res);
  }
}

// test
const eid = new EasyIndexDb(16);
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
const insertSql = `insert into DBName_1(name, age, relation) values("xxq", "25", slot)`;

eid.execute(conbinationSQL);
// eid.execute([insertSql, buffer]);
export default EasyIndexDb;
