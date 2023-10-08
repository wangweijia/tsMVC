interface IConfig {
    key?: string;
    enableNULL?: boolean;
    formatValue?: (value: any, baseValue: any) => any;
    formatData?: (value: any, baseValue: any) => any;
}
interface ISingleConfig extends IConfig {
    type?: 'single';
}
interface IObjectConfig extends IConfig {
    type: 'object';
    objectItem: 'Self' | (new (...p: any) => any);
}
interface IArrayConfig extends IConfig {
    type: 'array';
    arrayItem: 'Self' | (new (...p: any) => any);
}
interface IDateConfig extends IConfig {
    type: 'date';
    formatDTOKey?: string;
    formatOTDKey?: string;
}
interface IUUIDConfig extends IConfig {
    type: 'UUID';
}
type TConfig = ISingleConfig | IArrayConfig | IObjectConfig | IDateConfig | IUUIDConfig;

declare class ModelBaseClassRoot {
    _baseProse_: any;
    constructor(...args: any[]);
    _init_?(...p: any): void;
    _initUUID_?(v?: string): string;
    _OTD_?(): {};
    static InitWithList?(items: Array<any>): Array<any>;
}
declare class ModelBaseClass extends ModelBaseClassRoot {
    _OTD_(): {};
    static InitWithList<T>(items: Array<any>): Array<T>;
}
declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
declare function ModelAutoUUID(): (target: any, propertyKey: any) => void;
interface IClassOpt {
    _debugger_?: boolean;
}
declare function ModelEnter(opt?: IClassOpt): <T extends typeof ModelBaseClassRoot>(constructor: T, _?: any) => T & typeof ModelBaseClass;

export { ModelAutoUUID, ModelBaseClass, ModelCol, ModelEnter };
