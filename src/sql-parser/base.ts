/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-05 23:06:03
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-09 19:23:29
 */
export type CommandType = {
  DB: 'DB',
  Table: 'Table',
  Select: 'Select',
  Update: 'Update',
  Insert: 'Insert',
  Delete: 'Delete',
};

export type SqlStruct = {
  cmd: CommandType,
  other: Array<string>,
}

export type UseGrammarType = {
  cmd: CommandType,
  operation: string,
}