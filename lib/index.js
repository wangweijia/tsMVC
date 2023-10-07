var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import 'reflect-metadata';
import dayjs from 'dayjs';
import { getUUID } from './util/index';
var ClassBaseModelKey = Symbol('class');
var ModelBaseClassRoot = /** @class */ (function () {
    function ModelBaseClassRoot() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._baseProse_ = {};
    }
    ModelBaseClassRoot.prototype._init_ = function () {
        var p = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            p[_i] = arguments[_i];
        }
    };
    ModelBaseClassRoot.prototype._initUUID_ = function (v) {
        return v || getUUID();
    };
    ModelBaseClassRoot.prototype._OTD_ = function () {
        return {};
    };
    ModelBaseClassRoot.InitWithList = function (items) {
        return [];
    };
    return ModelBaseClassRoot;
}());
var ModelBaseClass = /** @class */ (function (_super) {
    __extends(ModelBaseClass, _super);
    function ModelBaseClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModelBaseClass.prototype._OTD_ = function () {
        return {};
    };
    ModelBaseClass.InitWithList = function (items) {
        return [];
    };
    return ModelBaseClass;
}(ModelBaseClassRoot));
export { ModelBaseClass };
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
        var newFun = Reflect.metadata(ClassBaseModelKey, config);
        newFun(target, propertyKey);
    };
}
export function ModelAutoUUID() {
    return ModelCol({
        type: 'UUID',
    });
}
export function ModelEnter(opt) {
    if (opt === void 0) { opt = {}; }
    var customLog = function () {
        var info = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            info[_i] = arguments[_i];
        }
        if (opt._debugger_) {
            console.log.apply(console, __spreadArray(['mvc info:'], info, false));
        }
    };
    return function (constructor, _) {
        var createClass = function () {
            return /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    var baseProps = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        baseProps[_i] = arguments[_i];
                    }
                    var _this = this;
                    var _a = baseProps || [], props = _a[0], otherParams = _a.slice(1);
                    _this = _super.apply(this, __spreadArray([props], (otherParams || {}), false)) || this;
                    _this._baseProse_ = props;
                    (_this._baseKeys || []).forEach(function (propsKey) {
                        var config = Reflect.getMetadata(ClassBaseModelKey, _this, propsKey) || {};
                        var key = config.key || propsKey;
                        customLog("key:", key);
                        if (props) {
                            var formatValue = config.formatValue;
                            // 获取原始 数据
                            var value = props[key];
                            // 如果有格式化方法，格式化数据
                            if (formatValue) {
                                value = formatValue(value, props);
                            }
                            if (value === null) {
                                if (config.enableNULL) {
                                    // 如果数据是 null，并且允许数据是 null，那么赋值 null
                                    _this[propsKey] = value;
                                    return;
                                }
                                console.warn("[key:".concat(key, "] is null"));
                                return;
                            }
                            customLog("value:", value);
                            if (config.type === 'UUID') {
                                var uuid = getUUID();
                                if (_this._initUUID_) {
                                    _this[propsKey] = _this._initUUID_(uuid);
                                }
                                else {
                                    _this[propsKey] = uuid;
                                }
                                return;
                            }
                            if (value !== undefined) {
                                try {
                                    customLog("type", config.type);
                                    if (!config.type || config.type === 'single') {
                                        _this[propsKey] = value;
                                        return;
                                    }
                                    else if (config.type === 'array') {
                                        var tempConfig_1 = config;
                                        _this[propsKey] = (value || []).map(function (arrayItem) {
                                            customLog('tempConfig.arrayItem:', tempConfig_1.arrayItem);
                                            customLog("array arrayItem:", arrayItem);
                                            if (tempConfig_1.arrayItem === 'Self') {
                                                return new (createClass())(arrayItem);
                                            }
                                            else {
                                                return new tempConfig_1.arrayItem(arrayItem);
                                            }
                                        });
                                        return;
                                    }
                                    else if (config.type === 'object') {
                                        var tempConfig = config;
                                        if (tempConfig.objectItem === 'Self') {
                                            _this[propsKey] = new (createClass())(value);
                                        }
                                        else {
                                            _this[propsKey] = new tempConfig.objectItem(value);
                                        }
                                        return;
                                    }
                                    else if (config.type === 'date') {
                                        var tempConfig = config;
                                        if (tempConfig.formatDTOKey) {
                                            _this[propsKey] = dayjs(value).format(tempConfig.formatDTOKey);
                                        }
                                        else {
                                            _this[propsKey] = value;
                                        }
                                        return;
                                    }
                                    else {
                                        _this[propsKey] = value;
                                        return;
                                    }
                                }
                                catch (error) {
                                    console.log("init [".concat(key, "] error with value [").concat(value, "]"));
                                    console.error(error);
                                }
                            }
                        }
                        else {
                            console.warn('model init no props');
                        }
                    });
                    if (_this._init_) {
                        _this._init_.apply(_this, __spreadArray([props], otherParams, false));
                    }
                    return _this;
                }
                // 类方法，用于批量创建自己
                class_1.InitWithList = function (dataList) {
                    return dataList.map(function (item) {
                        var temp = new (createClass())(item);
                        return temp;
                    });
                };
                // 动态生成 数据对象
                class_1.prototype._OTD_ = function () {
                    var _this = this;
                    var data = {};
                    this._baseKeys.forEach(function (propsKey) {
                        var config = Reflect.getMetadata(ClassBaseModelKey, _this, propsKey) || {};
                        // 反向数据格式化
                        var dataKey = config.key || propsKey;
                        // 格式化数据
                        var formatData = config.formatData;
                        // 获取原始 数据
                        var value = _this[propsKey];
                        // 如果有格式化方法，格式化数据
                        if (formatData) {
                            value = formatData(value, _this);
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
                                    data[dataKey] = (value || []).map(function (item) {
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
                                    var tempConfig = config;
                                    if (tempConfig.formatOTDKey) {
                                        data[dataKey] = dayjs(value).format(tempConfig.formatOTDKey);
                                    }
                                    else {
                                        data[dataKey] = value;
                                    }
                                    return;
                                }
                                else {
                                    _this[propsKey] = value;
                                    return;
                                }
                            }
                            catch (error) {
                                console.log("OTD [".concat(dataKey, "] error with value [").concat(value, "]"));
                                console.error(error);
                            }
                        }
                        else {
                            data[dataKey] = value;
                        }
                    });
                    return data;
                };
                return class_1;
            }(constructor));
        };
        return createClass();
    };
}
