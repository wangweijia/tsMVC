import 'reflect-metadata';
import dayjs from 'dayjs';
import { getUUID } from './util/index';

import { IObjectConfig, IArrayConfig, IDateConfig, TConfig } from './types/modelConfig';

const ClassBaseModelKey = Symbol('class');

class ModelBaseClassRoot {
  _baseProse_: any = {};
  constructor(...args: any[]) {}
  _init_?(...p: any) {}

  _initUUID_?(v?: string) {
    return v || getUUID();
  }

  _OTD_?() {
    return {};
  }

  static InitWithList?(items: Array<any>): Array<any> {
    return [];
  }
}

export class ModelBaseClass extends ModelBaseClassRoot {
  _OTD_() {
    return {};
  }

  static InitWithList<T>(items: Array<any>): Array<T> {
    return [];
  }
}

type TClassBaseRoot = typeof ModelBaseClassRoot;
type TClassBase = typeof ModelBaseClass;

export function ModelCol(config: TConfig) {
  return function (target: any, propertyKey: any) {
    // if (!target.Prototype._baseKeys) {
    //   target.Prototype._baseKeys = [];
    // }

    if (!target._baseKeys) {
      target._baseKeys = [];
    }

    target._baseKeys.push(propertyKey);
    // target.Prototype._baseKeys.push(propertyKey);

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
}

export function ModelEnter(opt: IClassOpt = {}) {
  const customLog = (...info: any[]) => {
    if (opt._debugger_) {
      console.log('mvc info:', ...info);
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
                console.warn(`[key:${key}] is null`);
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
              console.warn('model init no props');
            }
          });

          if (this._init_) {
            this._init_(props, ...otherParams);
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
      };
    };

    return createClass() as any;
  };
}
