import 'reflect-metadata';
import dayjs from 'dayjs';
import { getUUID } from './util/index';
const ClassBaseModelKey = Symbol('class');
class ModelBaseClassRoot {
    _baseProse_ = {};
    constructor(...args) { }
    _init_(...p) { }
    _initUUID_(v) {
        return v || getUUID();
    }
    _OTD_() {
        return {};
    }
    static InitWithList(items) {
        return [];
    }
}
export class ModelBaseClass extends ModelBaseClassRoot {
    _OTD_() {
        return {};
    }
    static InitWithList(items) {
        return [];
    }
}
export function ModelCol(config) {
    return function (target, propertyKey) {
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
export function ModelEnter(opt = {}) {
    const customLog = (...info) => {
        if (opt._debugger_) {
            console.log('mvc info:', ...info);
        }
    };
    return function (constructor, _) {
        const createClass = () => {
            return class extends constructor {
                constructor(...baseProps) {
                    const [props, ...otherParams] = baseProps || [];
                    super(props, ...(otherParams || {}));
                    this._baseProse_ = props;
                    (this._baseKeys || []).forEach((propsKey) => {
                        const config = Reflect.getMetadata(ClassBaseModelKey, this, propsKey) || {};
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
                            if (config.type === 'UUID') {
                                const uuid = getUUID();
                                if (this._initUUID_) {
                                    this[propsKey] = this._initUUID_(uuid);
                                }
                                else {
                                    this[propsKey] = uuid;
                                }
                                return;
                            }
                            if (value !== undefined) {
                                try {
                                    customLog(`type`, config.type);
                                    if (!config.type || config.type === 'single') {
                                        this[propsKey] = value;
                                        return;
                                    }
                                    else if (config.type === 'array') {
                                        const tempConfig = config;
                                        this[propsKey] = (value || []).map((arrayItem) => {
                                            customLog('tempConfig.arrayItem:', tempConfig.arrayItem);
                                            customLog(`array arrayItem:`, arrayItem);
                                            if (tempConfig.arrayItem === 'Self') {
                                                return new (createClass())(arrayItem);
                                            }
                                            else {
                                                return new tempConfig.arrayItem(arrayItem);
                                            }
                                        });
                                        return;
                                    }
                                    else if (config.type === 'object') {
                                        const tempConfig = config;
                                        if (tempConfig.objectItem === 'Self') {
                                            this[propsKey] = new (createClass())(value);
                                        }
                                        else {
                                            this[propsKey] = new tempConfig.objectItem(value);
                                        }
                                        return;
                                    }
                                    else if (config.type === 'date') {
                                        const tempConfig = config;
                                        if (tempConfig.formatDTOKey) {
                                            this[propsKey] = dayjs(value).format(tempConfig.formatDTOKey);
                                        }
                                        else {
                                            this[propsKey] = value;
                                        }
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
                // 类方法，用于批量创建自己
                static InitWithList(dataList) {
                    return dataList.map((item) => {
                        const temp = new (createClass())(item);
                        return temp;
                    });
                }
                // 动态生成 数据对象
                _OTD_() {
                    const data = {};
                    this._baseKeys.forEach((propsKey) => {
                        const config = Reflect.getMetadata(ClassBaseModelKey, this, propsKey) || {};
                        // 反向数据格式化
                        const dataKey = config.key || propsKey;
                        // 格式化数据
                        const formatData = config.formatData;
                        // 获取原始 数据
                        let value = this[propsKey];
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
                                }
                                else if (config.type === 'array') {
                                    // 列表
                                    data[dataKey] = (value || []).map((item) => {
                                        if (item._OTD_) {
                                            return item._OTD_();
                                        }
                                        return item;
                                    });
                                    return;
                                }
                                else if (config.type === 'object') {
                                    // 对象
                                    data[dataKey] = value._OTD_ ? value._OTD_() : value;
                                    return;
                                }
                                else if (config.type === 'date') {
                                    // 日期
                                    const tempConfig = config;
                                    if (tempConfig.formatOTDKey) {
                                        data[dataKey] = dayjs(value).format(tempConfig.formatOTDKey);
                                    }
                                    else {
                                        data[dataKey] = value;
                                    }
                                    return;
                                }
                                else {
                                    this[propsKey] = value;
                                    return;
                                }
                            }
                            catch (error) {
                                console.log(`OTD [${dataKey}] error with value [${value}]`);
                                console.error(error);
                            }
                        }
                        else {
                            data[dataKey] = value;
                        }
                    });
                    return data;
                }
            };
        };
        return createClass();
    };
}
