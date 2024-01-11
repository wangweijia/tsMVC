import 'reflect-metadata';
import dayjs from 'dayjs';
import { getUUID } from './util/index';

import { IObjectConfig, IArrayConfig, IDateConfig, TConfig } from './types/modelConfig';

const ClassBaseModelKey = Symbol('class');
const ClassPathKey = Symbol('ClassPathKey');

class ModelBaseClassRoot {
  _baseProse_: any = {};
  _path_: Array<string | number> = [];
  constructor(...args: any[]) {}

  // 默认初始化方法
  _init_?(...p: any) {}

  // 自定义 初始化 uuid
  _initUUID_?(v?: string) {
    return v || getUUID();
  }
}

export class ModelBaseClass extends ModelBaseClassRoot {
  // object  => data
  _OTD_() {
    return {};
  }

  // 树状数据 展开成 列表数据
  _tree_to_list_<T extends any>(baseList: Array<T>, pathName?: string): Array<T> {
    return baseList || [];
  }

  _copy_<T extends ModelBaseClass>(deep?: boolean): T {
    return this as any;
  }

  static InitWithList<T>(items: Array<any>): Array<T> {
    return [];
  }

  static TreeToList<T extends ModelBaseClass>(array: Array<T>, pathName?: string): Array<T> {
    const list: Array<T> = [];
    array.forEach((item) => {
      item._tree_to_list_(list, pathName);
    });
    return list;
  }
}

type TClassBaseRoot = typeof ModelBaseClassRoot;
type TClassBase = typeof ModelBaseClass;

const DefPathName = '_def_path_Name_';
export function ModelPath(config: { type: 'id' | 'source'; pathName?: string }) {
  return function (target: any, propertyKey: any) {
    const pathName = config.pathName || DefPathName;

    const paths: any = Reflect.getMetadata(ClassPathKey, target, pathName) || {};
    if (config.type === 'id') {
      paths.id = propertyKey;
    } else {
      paths.source = propertyKey;
    }
    const newFun = Reflect.metadata(ClassPathKey, paths);
    newFun(target, pathName);
  };
}

export function ModelCol(config: TConfig) {
  return function (target: any, propertyKey: any) {
    if (!target._baseKeys) {
      target._baseKeys = [];
    }

    target._baseKeys.push(propertyKey);

    const newFun = Reflect.metadata(ClassBaseModelKey, config);
    newFun(target, propertyKey);
  };
}

export function ModelAutoUUID() {
  return ModelCol({
    type: 'UUID',
  });
}

interface IClassOpt {
  _debugger_?: boolean;
  pathName?: string;
}

export function ModelEnter(opt: IClassOpt = {}) {
  const customLog = (...info: any[]) => {
    if (opt._debugger_) {
      console.log('mvc info:', ...info);
    }
  };

  const customWarn = (...info: any[]) => {
    if (opt._debugger_) {
      customWarn('mvc warn:', ...info);
    }
  };

  return function <T extends TClassBaseRoot>(constructor: T, _?: any): T & TClassBase {
    const createClass = () => {
      return class extends constructor {
        constructor(...baseProps: Array<any>) {
          const [props, ...otherParams] = baseProps || [];
          super(props, ...(otherParams || {}));

          this._baseProse_ = props;

          ((this as any)._baseKeys || []).forEach((propsKey: string) => {
            const config: TConfig = Reflect.getMetadata(ClassBaseModelKey, this, propsKey) || {};
            const key = config.key || propsKey;

            customLog(`key:`, key);

            if (props) {
              const formatValue = config.formatValue;
              // 获取原始 数据
              let value = props[key];
              // 如果有格式化方法，格式化数据
              if (formatValue) {
                value = formatValue(value, props);
              }
              if (value === null) {
                if (config.enableNULL) {
                  // 如果数据是 null，并且允许数据是 null，那么赋值 null
                  (this as any)[propsKey] = value;
                  return;
                }
                customWarn(`[key:${key}] is null`);
                return;
              }

              customLog(`value:`, value);

              if (config.ignoreDTO) {
                return;
              }

              if (config.type === 'UUID') {
                const uuid = getUUID();
                if (this._initUUID_) {
                  (this as any)[propsKey] = this._initUUID_(uuid);
                } else {
                  (this as any)[propsKey] = uuid;
                }
                return;
              }

              if (value !== undefined) {
                try {
                  customLog(`type`, config.type);

                  if (!config.type || config.type === 'single') {
                    (this as any)[propsKey] = value;
                    return;
                  } else if (config.type === 'array') {
                    const tempConfig: IArrayConfig = config;
                    (this as any)[propsKey] = (value || []).map((arrayItem: any) => {
                      customLog('tempConfig.arrayItem:', tempConfig.arrayItem);
                      customLog(`array arrayItem:`, arrayItem);

                      if (tempConfig.arrayItem === 'Self') {
                        return new (createClass() as any)(arrayItem);
                      } else {
                        return new tempConfig.arrayItem(arrayItem);
                      }
                    });
                    return;
                  } else if (config.type === 'object') {
                    const tempConfig: IObjectConfig = config;

                    if (tempConfig.objectItem === 'Self') {
                      (this as any)[propsKey] = new (createClass() as any)(value);
                    } else {
                      (this as any)[propsKey] = new tempConfig.objectItem(value);
                    }

                    return;
                  } else if (config.type === 'date') {
                    const tempConfig: IDateConfig = config;
                    if (tempConfig.formatDTOKey) {
                      (this as any)[propsKey] = dayjs(value).format(tempConfig.formatDTOKey);
                    } else {
                      (this as any)[propsKey] = value;
                    }
                    return;
                  } else {
                    (this as any)[propsKey] = value;
                    return;
                  }
                } catch (error) {
                  console.log(`init [${key}] error with value [${value}]`);
                  console.error(error);
                }
              }
            } else {
              customWarn('model init no props');
            }
          });

          if (this._init_) {
            this._init_(props, ...otherParams);
          }

          if (this._init_path_) {
            this._init_path_([]);
          }
        }

        // 类方法，用于批量创建自己
        static InitWithList(dataList: Array<any>): Array<T> {
          return dataList.map((item) => {
            const temp: any = new (createClass())(item);
            return temp;
          });
        }

        // 动态生成 数据对象
        _OTD_(): any {
          const data: any = {};

          (this as any)._baseKeys.forEach((propsKey: string) => {
            const config: TConfig = Reflect.getMetadata(ClassBaseModelKey, this, propsKey) || {};

            if (config.ignoreOTD) {
              // 忽略掉不需要 从对象重新再 赋值为 数据源的字段
              return;
            }

            // 反向数据格式化
            const dataKey = config.key || propsKey;
            // 格式化数据
            const formatData = config.formatData;
            // 获取原始 数据
            let value = (this as any)[propsKey];

            // 如果有格式化方法，格式化数据
            if (formatData) {
              value = formatData(value, this);
            }

            if (config.type === 'UUID') {
              return;
            }
            if (value) {
              try {
                if (!config.type || config.type === 'single') {
                  // 普通数据

                  data[dataKey] = value;

                  return;
                } else if (config.type === 'array') {
                  // 列表

                  data[dataKey] = (value || []).map((item: any) => {
                    if (item._OTD_) {
                      return item._OTD_();
                    }
                    return item;
                  });

                  return;
                } else if (config.type === 'object') {
                  // 对象

                  data[dataKey] = value._OTD_ ? value._OTD_() : value;

                  return;
                } else if (config.type === 'date') {
                  // 日期
                  const tempConfig: IDateConfig = config;
                  if (tempConfig.formatOTDKey) {
                    data[dataKey] = dayjs(value).format(tempConfig.formatOTDKey);
                  } else {
                    data[dataKey] = value;
                  }
                  return;
                } else {
                  (this as any)[propsKey] = value;
                  return;
                }
              } catch (error) {
                console.log(`OTD [${dataKey}] error with value [${value}]`);
                console.error(error);
              }
            } else {
              data[dataKey] = value;
            }
          });

          return data;
        }

        _init_path_(basePath: Array<string | number> = [], pathName?: string): Array<string | number> {
          const pathKey = opt.pathName || '_path_';
          const currentPathName = pathName || DefPathName;
          const pathConfig: any = Reflect.getMetadata(ClassPathKey, this, currentPathName) || {};

          if (pathConfig.id) {
            (this as any)[pathKey] = [...basePath, (this as any)[pathConfig.id]];
          }

          if (pathConfig.source) {
            ((this as any)[pathConfig.source] || []).forEach((subItem: any) => {
              if (subItem._init_path_) {
                subItem._init_path_(this._path_, currentPathName);
              }
            });
          }

          return (this as any)[pathKey];
        }

        _tree_to_list_<T extends any>(baseList: Array<T>, pathName?: string): Array<T> {
          const currentPathName = pathName || DefPathName;
          const pathConfig: any = Reflect.getMetadata(ClassPathKey, this, currentPathName) || {};
          const valueList = baseList || [];
          valueList.push(this as any);

          if (pathConfig.source) {
            ((this as any)[pathConfig.source] || []).forEach((subItem: any) => {
              if (subItem._tree_to_list_) {
                subItem._tree_to_list_(valueList, currentPathName);
              }
            });
          }
          return valueList;
        }

        _copy_(deep?: boolean) {
          const temp = new (createClass() as any)({});
          Object.assign(temp, this);
          if (deep) {
            ((this as any)._baseKeys || []).forEach((propsKey: string) => {
              const config: TConfig = Reflect.getMetadata(ClassBaseModelKey, this, propsKey) || {};
              const key = config.key || propsKey;
              if (config.type === 'object') {
                temp[key] = temp[key]._copy_(true);
              } else if (config.type === 'array') {
                temp[key] = temp[key].map((item: any) => item._copy_(true));
              }
            });
          }

          return temp;
        }
      };
    };

    return createClass() as any;
  };
}
