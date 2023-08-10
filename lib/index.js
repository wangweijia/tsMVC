import 'reflect-metadata';
import * as dayjs from 'dayjs';
const ClassBaseModelKey = Symbol('class');
export function ModelCol(config) {
    return function (target, propertyKey) {
        if (!target._baseKeys) {
            target._baseKeys = [];
        }
        target._baseKeys.push(propertyKey);
        const newFun = Reflect.metadata(ClassBaseModelKey, config);
        newFun(target, propertyKey);
    };
}
export function ModelEnter(opt = {}) {
    const customLog = (info) => {
        if (opt._debugger_) {
            console.log('mvc info:', info);
        }
    };
    return function (constructor, _) {
        const currentClass = class extends constructor {
            constructor(props, ...otherParams) {
                super(props, ...(otherParams || {}));
                this._baseProse_ = props;
                this._baseKeys.forEach((propsKey) => {
                    const config = Reflect.getMetadata(ClassBaseModelKey, this, propsKey) || {};
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
                                }
                                else if (config.type === 'array') {
                                    customLog(`array`);
                                    const tempConfig = config;
                                    this[propsKey] = (value || []).map((arrayItem) => {
                                        customLog(`array arrayItem: ${JSON.stringify(arrayItem)}`);
                                        return new tempConfig.arrayItem(arrayItem);
                                    });
                                    return;
                                }
                                else if (config.type === 'object') {
                                    const tempConfig = config;
                                    this[propsKey] = new tempConfig.objectItem(value);
                                    return;
                                }
                                else if (config.type === 'date') {
                                    const tempConfig = config;
                                    this[propsKey] = dayjs(value).format(tempConfig.formatStr);
                                    return;
                                }
                                else {
                                    this[propsKey] = value;
                                    return;
                                }
                            }
                            catch (error) {
                                console.log(`init [${key}] error with value [${value}]`);
                                console.error(error);
                            }
                        }
                    }
                    else {
                        console.warn('model init no props');
                    }
                });
                if (this._init_) {
                    this._init_(props, ...otherParams);
                }
            }
        };
        return currentClass;
    };
}
