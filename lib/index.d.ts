import 'reflect-metadata';
interface IConfig {
    key?: string;
    enableNULL?: boolean;
    formatValue?: (value: any, baseValue: any) => any;
}
interface ISingleConfig extends IConfig {
    type?: 'single';
}
interface IObjectConfig extends IConfig {
    type: 'object';
    objectItem: any;
}
interface IArrayConfig extends IConfig {
    type: 'array';
    arrayItem: any;
}
interface IDateConfig extends IConfig {
    type: 'date';
    formatStr: string;
}
type TConfig = ISingleConfig | IArrayConfig | IObjectConfig | IDateConfig;
export declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
export declare function ModelEnter(): (constructor: any, _?: any) => any;
export {};
