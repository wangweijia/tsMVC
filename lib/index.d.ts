import 'reflect-metadata';
import { TConfig } from './types/modelConfig';
declare class ModelBaseClass2 {
    [k: string]: any;
    constructor(...args: any[]);
    _init_?(...p: any): void;
    _initUUID_?(v?: string): string;
    _OTD_?(): {};
    static InitWithList?(items: Array<any>): Array<any>;
}
export declare class ModelBaseClass extends ModelBaseClass2 {
    _OTD_(): {};
    static InitWithList<T>(items: Array<any>): Array<T>;
}
type TClass = typeof ModelBaseClass;
export declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
export declare function ModelAutoUUID(): (target: any, propertyKey: any) => void;
interface IClassOpt {
    _debugger_?: boolean;
}
export declare function ModelEnter(opt?: IClassOpt): <T extends typeof ModelBaseClass2>(constructor: T, _?: any) => T & typeof ModelBaseClass;
export {};
