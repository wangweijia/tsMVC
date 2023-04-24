"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelEnter = exports.ModelCol = void 0;
require("reflect-metadata");
var dayjs = require("dayjs");
var ClassBaseModelKey = Symbol('class');
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
exports.ModelCol = ModelCol;
function ModelEnter() {
    return function (constructor, _) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1(props) {
                var _this = _super.call(this, props) || this;
                _this._baseProse_ = props;
                _this._baseKeys.forEach(function (propsKey) {
                    var config = Reflect.getMetadata(ClassBaseModelKey, _this, propsKey);
                    var key = config.key || propsKey;
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
                        if (value !== undefined) {
                            try {
                                if (!config.type || config.type === 'single') {
                                    _this[propsKey] = value;
                                    return;
                                }
                                else if (config.type === 'array') {
                                    var tempConfig_1 = config;
                                    _this[propsKey] = (value || []).map(function (arrayItem) {
                                        return new tempConfig_1.arrayItem(arrayItem);
                                    });
                                    return;
                                }
                                else if (config.type === 'object') {
                                    var tempConfig = config;
                                    _this[propsKey] = new tempConfig.objectItem(value);
                                    return;
                                }
                                else if (config.type === 'date') {
                                    var tempConfig = config;
                                    _this[propsKey] = dayjs(value).format(tempConfig.formatStr);
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
                return _this;
            }
            return class_1;
        }(constructor));
    };
}
exports.ModelEnter = ModelEnter;
