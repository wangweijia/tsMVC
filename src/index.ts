import 'reflect-metadata';
import * as dayjs from 'dayjs';
import { getUUID } from './util/index';

import {
  IConfig,
  ISingleConfig,
  IObjectConfig,
  IArrayConfig,
  IDateConfig,
  IUUIDConfig,
  TConfig,
} from './types/modelConfig';

const ClassBaseModelKey = Symbol('class');

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
}

export function ModelEnter(opt: IClassOpt = {}) {
  const customLog = (...info: any[]) => {
    if (opt._debugger_) {
      console.log('mvc info:', ...info);
    }
  };

  return function (constructor: any, _?: any) {
    class CurrentClass extends constructor {
      [k: string]: any;

      constructor(...baseProps: Array<any>) {
        const [props, ...otherParams] = baseProps || [];
        // props?: any, ...otherParams: any
        super(props, ...(otherParams || {}));

        this._baseProse_ = props;

        this._baseKeys.forEach((propsKey: string) => {
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
                this[propsKey] = value;
                return;
              }
              console.warn(`[key:${key}] is null`);
              return;
            }

            customLog(`value:`, value);

            if (value !== undefined) {
              try {
                customLog(`type`, config.type);

                if (!config.type || config.type === 'UUID') {
                  this[propsKey] = this._initUUID_();
                } else if (!config.type || config.type === 'single') {
                  this[propsKey] = value;
                  return;
                } else if (config.type === 'array') {
                  const tempConfig: IArrayConfig = config;
                  this[propsKey] = (value || []).map((arrayItem: any) => {
                    customLog('tempConfig.arrayItem:', tempConfig.arrayItem);
                    customLog(`array arrayItem:`, arrayItem);

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

      _init_(...p: any) {}

      _initUUID_() {
        return getUUID();
      }
    }

    return CurrentClass as any;
  };
}
