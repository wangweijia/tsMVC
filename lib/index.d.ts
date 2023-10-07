import 'reflect-metadata';
import { TConfig } from './types/modelConfig';
declare class ModelBaseClassRoot {
    constructor(...args: any[]);
    _baseProse_: any;
    _init_?(...p: any): void;
    _initUUID_?(v?: string): string;
    _OTD_?(): {};
    static InitWithList?(items: Array<any>): Array<any>;
}
export declare class ModelBaseClass extends ModelBaseClassRoot {
    _OTD_(): {};
    static InitWithList<T>(items: Array<any>): Array<T>;
}
type TClassBase = typeof ModelBaseClass;
export declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
export declare function ModelAutoUUID(): (target: any, propertyKey: any) => void;
interface IClassOpt {
    _debugger_?: boolean;
}
export declare function ModelEnter(opt?: IClassOpt): <T extends typeof ModelBaseClassRoot>(constructor: T, _?: any) => T & typeof ModelBaseClass;
export {};
