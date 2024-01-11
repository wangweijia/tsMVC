interface IConfig {
    key?: string;
    enableNULL?: boolean;
    formatValue?: (value: any, baseValue: any) => any;
    formatData?: (value: any, baseValue: any) => any;
    ignoreDTO?: boolean;
    ignoreOTD?: boolean;
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
    _path_: Array<string | number>;
    constructor(...args: any[]);
    _init_?(...p: any): void;
    _initUUID_?(v?: string): string;
}
declare class ModelBaseClass extends ModelBaseClassRoot {
    _OTD_(): {};
    _tree_to_list_<T extends any>(baseList: Array<T>, pathName?: string): Array<T>;
    _copy_<T extends ModelBaseClass>(deep?: boolean): T;
    static InitWithList<T>(items: Array<any>): Array<T>;
    static TreeToList<T extends ModelBaseClass>(array: Array<T>, pathName?: string): Array<T>;
}
declare function ModelPath(config: {
    type: 'id' | 'source';
    pathName?: string;
}): (target: any, propertyKey: any) => void;
declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
declare function ModelAutoUUID(): (target: any, propertyKey: any) => void;
interface IClassOpt {
    _debugger_?: boolean;
    pathName?: string;
}
declare function ModelEnter(opt?: IClassOpt): <T extends typeof ModelBaseClassRoot>(constructor: T, _?: any) => T & typeof ModelBaseClass;

export { ModelAutoUUID, ModelBaseClass, ModelCol, ModelEnter, ModelPath };
