/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-02-09 13:03:50
 * @LastEditors  : xiuquanxu
 * @LastEditTime : 2020-02-10 17:54:18
 */

export const isDomStringList = (value: any) => {
  return toString.call(value) === '[object DOMStringList]';
};

export const isArray = (value: any): boolean => {
  return toString.call(value) === '[object Array]';
};

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

export const map2Obj: any = (map: Map<any, any>) => {
  const obj = {};
  map.forEach((value, key, m) => {
    obj[key] = value;
  });
  return obj;
};