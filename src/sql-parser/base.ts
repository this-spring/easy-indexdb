/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-05 23:06:03
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-11 15:10:25
 */
export type DBMessage = {
  dbName: string,
  oldVersion: number,
  newVersion: number,
  objectStoreNames: Array<any>,
};

export enum CommandType {
    Use = 'use',
    Create = 'create',
    Select = 'select',
    Update = 'update',
    Insert = 'insert',
    Delete = 'delete',
};

export enum StateCode {
  Success = '2000',
  Error = '20001',
}

export type SqlStruct = {
  cmd: CommandType,
  other: Array<string>,
}

// 语法解析后：use产生结构
export type UseType = {
  dbName: string,
  version: number,
}
export type UseGrammarType = {
  cmd: CommandType,
  use: UseType,
}

// 语法解析后：table产生结构
export type TableType = {
  tableName: string,
  column: Map<string, string>,
}
export type TableGrammarType = {
  cmd: CommandType,
  table: TableType,
}

// 语法解析后：insert产生结构
export type InsertType = {
  tableName: string,
  column: Map<string, any>,
}
export type InsertGrammarType = {
  cmd: CommandType,
  insert: InsertType,
}

// 语法解析后：select产生结构
export type SelectType = {
  tableName: string,
  where: Map<string, any>
}
export type SelectGrammarType = {
  cmd: CommandType,
  select: SelectType,
}

export type ResTemplate = {
  code: StateCode,
  data: any
}