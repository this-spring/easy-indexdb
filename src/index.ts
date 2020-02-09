/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-14 23:32:29
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-09 12:55:12
 */
// var Parser = require('sqlparser');
// import Parser from 'sqlparser';
// var result = Parser.parse('SELECT * FROM table');
// console.log(result);

import SqlLexter from './sql-parser/sql-lexter';
class EasyIndexDb {
  private sqlLexter: SqlLexter = null;

  constructor() {
    this.sqlLexter = new SqlLexter();
  } 

  public initDB(sql: any) {
    
  }

  public execute(sql: any) {
    this.sqlLexter.parserSQL(sql);
  }
}

// test
const eid = new EasyIndexDb();
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
