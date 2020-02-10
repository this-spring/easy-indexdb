/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-09 13:03:50
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 14:54:08
 */
export const isArray = () => {

};

export const isDomStringList = (value: any) => {
  return toString.call(value);
}

export const inClude = (key: String | Number, source: String | Array<any> | Object | DOMStringList): boolean =>  {
  if (Array.isArray(source)) {
    for (let i = 0, len = source.length; i < len; i += 1) {
      if (key === source[i]) {
        return true;
      }
    }
  }
  if (isDomStringList(source)) {
    if ((<DOMStringList>source).contains(<string>key)) {
      return true;
    }
  }
  return false;
}