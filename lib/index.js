(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata'), require('dayjs'), require('dayjs/plugin/customParseFormat')) :
    typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata', 'dayjs', 'dayjs/plugin/customParseFormat'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.uodule = {}, null, global.dayjs, global.customParseFormat));
})(this, (function (exports, reflectMetadata, dayjs, customParseFormat) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var global = globalThis;
    function getUUID() {
        if (!global.__mvc_uuid__) {
            global.__mvc_uuid__ = new Date().valueOf();
        }
        return "".concat((global.__mvc_uuid__ += 1));
    }

    var ClassBaseModelKey = Symbol('class');
    var ClassPathKey = Symbol('ClassPathKey');
    dayjs.extend(customParseFormat);
    var ModelBaseClassRoot = /** @class */ (function () {
        function ModelBaseClassRoot() {
            this._baseProse_ = {};
            this._path_ = [];
        }
        // 默认初始化方法
        ModelBaseClassRoot.prototype._init_ = function () {
        };
        // 自定义 初始化 uuid
        ModelBaseClassRoot.prototype._initUUID_ = function (v) {
            return v || getUUID();
        };
        return ModelBaseClassRoot;
    }());
    var ModelBaseClass = /** @class */ (function (_super) {
        __extends(ModelBaseClass, _super);
        function ModelBaseClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // object  => data
        ModelBaseClass.prototype._OTD_ = function () {
            return {};
        };
        // 树状数据 展开成 列表数据
        ModelBaseClass.prototype._tree_to_list_ = function (baseList, pathName) {
            return baseList || [];
        };
        ModelBaseClass.prototype._copy_ = function (deep) {
            return this;
        };
        ModelBaseClass.InitWithList = function (items) {
            return [];
        };
        ModelBaseClass.TreeToList = function (array, pathName) {
            var list = [];
            array.forEach(function (item) {
                item._tree_to_list_(list, pathName);
            });
            return list;
        };
        return ModelBaseClass;
    }(ModelBaseClassRoot));
    var DefPathName = '_def_path_Name_';
    function ModelPath(config) {
        return function (target, propertyKey) {
            var pathName = config.pathName || DefPathName;
            var paths = Reflect.getMetadata(ClassPathKey, target, pathName) || {};
            if (config.type === 'id') {
                paths.id = propertyKey;
            }
            else {
                paths.source = propertyKey;
            }
            var newFun = Reflect.metadata(ClassPathKey, paths);
            newFun(target, pathName);
        };
    }
    function ModelCol(config) {
        return function (target, propertyKey) {
            if (!target._baseKeys) {
                target._baseKeys = [];
            }
            target._baseKeys.push(propertyKey);
            var newFun = Reflect.metadata(ClassBaseModelKey, config);
            newFun(target, propertyKey);
        };
    }
    function ModelAutoUUID() {
        return ModelCol({
            type: 'UUID',
        });
    }
    // 判断 formatDTOKey 的类型
    function isInitDayjs(value) {
        return typeof value === 'function';
    }
    function ModelEnter(opt) {
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
        var customWarn = function () {
            var info = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                info[_i] = arguments[_i];
            }
            if (opt._debugger_) {
                customWarn.apply(void 0, __spreadArray(['mvc warn:'], info, false));
            }
        };
        return function (constructor, _) {
            var createClass = function () {
                return /** @class */ (function (_super) {
                    __extends(class_1, _super);
                    function class_1() {
                        var _this = this;
                        var baseProps = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            baseProps[_i] = arguments[_i];
                        }
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
                                    customWarn("[key:".concat(key, "] is null"));
                                    return;
                                }
                                customLog("value:", value);
                                if (config.ignoreDTO) {
                                    return;
                                }
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
                                                if (typeof tempConfig.formatDTOKey === 'string') {
                                                    _this[propsKey] = dayjs(value).format(tempConfig.formatDTOKey);
                                                    return;
                                                }
                                                else if (isInitDayjs(tempConfig.formatDTOKey)) {
                                                    var opt_1 = tempConfig.formatDTOKey(value, props);
                                                    _this[propsKey] = dayjs(opt_1.date || value, opt_1.format).format(opt_1.valueFormat);
                                                    return;
                                                }
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
                                customWarn('model init no props');
                            }
                        });
                        if (_this._init_) {
                            _this._init_.apply(_this, __spreadArray([props], otherParams, false));
                        }
                        if (_this._init_path_) {
                            _this._init_path_([]);
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
                            if (config.ignoreOTD) {
                                // 忽略掉不需要 从对象重新再 赋值为 数据源的字段
                                return;
                            }
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
                                            if (typeof tempConfig.formatOTDKey === 'string') {
                                                data[dataKey] = dayjs(value).format(tempConfig.formatOTDKey);
                                                return;
                                            }
                                            else if (isInitDayjs(tempConfig.formatOTDKey)) {
                                                var opt_2 = tempConfig.formatOTDKey(value, _this);
                                                data[dataKey] = dayjs(opt_2.date || value, opt_2.format, opt_2.strict).format(opt_2.valueFormat);
                                                return;
                                            }
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
                    class_1.prototype._init_path_ = function (basePath, pathName) {
                        var _this = this;
                        if (basePath === void 0) { basePath = []; }
                        var pathKey = opt.pathName || '_path_';
                        var currentPathName = pathName || DefPathName;
                        var pathConfig = Reflect.getMetadata(ClassPathKey, this, currentPathName) || {};
                        if (pathConfig.id) {
                            this[pathKey] = __spreadArray(__spreadArray([], basePath, true), [this[pathConfig.id]], false);
                        }
                        if (pathConfig.source) {
                            (this[pathConfig.source] || []).forEach(function (subItem) {
                                if (subItem._init_path_) {
                                    subItem._init_path_(_this._path_, currentPathName);
                                }
                            });
                        }
                        return this[pathKey];
                    };
                    class_1.prototype._tree_to_list_ = function (baseList, pathName) {
                        var currentPathName = pathName || DefPathName;
                        var pathConfig = Reflect.getMetadata(ClassPathKey, this, currentPathName) || {};
                        var valueList = baseList || [];
                        valueList.push(this);
                        if (pathConfig.source) {
                            (this[pathConfig.source] || []).forEach(function (subItem) {
                                if (subItem._tree_to_list_) {
                                    subItem._tree_to_list_(valueList, currentPathName);
                                }
                            });
                        }
                        return valueList;
                    };
                    class_1.prototype._copy_ = function (deep) {
                        var _this = this;
                        var temp = new (createClass())({});
                        Object.assign(temp, this);
                        if (deep) {
                            (this._baseKeys || []).forEach(function (propsKey) {
                                var config = Reflect.getMetadata(ClassBaseModelKey, _this, propsKey) || {};
                                var key = config.key || propsKey;
                                if (config.type === 'object') {
                                    temp[key] = temp[key]._copy_(true);
                                }
                                else if (config.type === 'array') {
                                    temp[key] = temp[key].map(function (item) { return item._copy_(true); });
                                }
                            });
                        }
                        return temp;
                    };
                    return class_1;
                }(constructor));
            };
            return createClass();
        };
    }

    exports.ModelAutoUUID = ModelAutoUUID;
    exports.ModelBaseClass = ModelBaseClass;
    exports.ModelCol = ModelCol;
    exports.ModelEnter = ModelEnter;
    exports.ModelPath = ModelPath;

}));
