/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-14 23:32:29
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-03 16:04:35
 */
// var Parser = require('sqlparser');
// import Parser from 'sqlparser';
// var result = Parser.parse('SELECT * FROM table');
// console.log(result);

class EasyIndexDb {
  constructor() {
    
  } 

  public execute(sql: any) {
    
  }
}

// test
const eid = new EasyIndexDb();
eid.execute(`
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
`);
const buffer = new ArrayBuffer(100);
const insertSql = `insert into DBName_1(name, age, relation) values("xxq", "25", slot)`;
eid.execute([insertSql, buffer]);
export default EasyIndexDb;
