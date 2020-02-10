/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-05 23:06:03
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 11:38:53
 */
// export type CommandType = {
//   Use: 'Use',
//   Create: 'Create',
//   Select: 'Select',
//   Update: 'Update',
//   Insert: 'Insert',
//   Delete: 'Delete',
// };

export enum CommandType {
    Use = 'use',
    Create = 'create',
    Select = 'select',
    Update = 'update',
    Insert = 'insert',
    Delete = 'delete',
  };

export type SqlStruct = {
  cmd: CommandType,
  other: Array<string>,
}

// 语法解析后：use产生结构
export type UseGrammarType = {
  cmd: CommandType,
  operation: string,
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
