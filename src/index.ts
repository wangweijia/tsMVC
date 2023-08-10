import 'reflect-metadata';
import * as dayjs from 'dayjs';

const ClassBaseModelKey = Symbol('class');

interface IConfig {
  // 数据源 key，用于对应原始数据，不传默认与 对象字段相同
  key?: string;
  // 是否可以 赋值 null
  enableNULL?: boolean;
  // 格式化 数据
  formatValue?: (value: any, baseValue: any) => any;
}

// 普通类型
interface ISingleConfig extends IConfig {
  type?: 'single';
}

// 对象类型
interface IObjectConfig extends IConfig {
  type: 'object';
  objectItem: any;
}

// 数组类型
interface IArrayConfig extends IConfig {
  type: 'array';
  arrayItem: any;
}

// 时间类型
interface IDateConfig extends IConfig {
  type: 'date';
  formatStr: string;
}

type TConfig = ISingleConfig | IArrayConfig | IObjectConfig | IDateConfig;

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

interface IClassOpt {
  _debugger_?: boolean;
}

export function ModelEnter(opt: IClassOpt = {}) {
  const customLog = (info: string) => {
    if (opt._debugger_) {
      console.log('mvc info:', info);
    }
  };

  return function (constructor: any, _?: any) {
    return class extends constructor {
      constructor(props?: any, ...otherParams: any) {
        super(props, ...(otherParams || {}));

        this._baseProse_ = props;

        this._baseKeys.forEach((propsKey: string) => {
          const config: TConfig = Reflect.getMetadata(ClassBaseModelKey, this, propsKey) || {};
          const key = config.key || propsKey;

          customLog(`key: ${key}`);

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
                this[propsKey] = value;
                return;
              }
              console.warn(`[key:${key}] is null`);
              return;
            }

            customLog(`value: ${JSON.stringify(value)}`);

            if (value !== undefined) {
              try {
                if (!config.type || config.type === 'single') {
                  this[propsKey] = value;
                  return;
                } else if (config.type === 'array') {
                  customLog(`array`);

                  const tempConfig: IArrayConfig = config;
                  this[propsKey] = (value || []).map((arrayItem: any) => {
                    customLog(`array arrayItem: ${arrayItem}`);

                    return new tempConfig.arrayItem(arrayItem);
                  });
                  return;
                } else if (config.type === 'object') {
                  const tempConfig: IObjectConfig = config;
                  this[propsKey] = new tempConfig.objectItem(value);
                  return;
                } else if (config.type === 'date') {
                  const tempConfig: IDateConfig = config;
                  this[propsKey] = dayjs(value).format(tempConfig.formatStr);
                  return;
                } else {
                  this[propsKey] = value;
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
    } as any;
  };
}
