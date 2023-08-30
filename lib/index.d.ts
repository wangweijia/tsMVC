import 'reflect-metadata';
import { TConfig } from './types/modelConfig';
export declare class ModelBaseClass {
    [k: string]: any;
    constructor(...args: any[]);
    _init_?(...p: any): void;
    _initUUID_?(v?: string): string;
    static InitWithList(): never[];
}
export declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
export declare function ModelAutoUUID(): (target: any, propertyKey: any) => void;
interface IClassOpt {
    _debugger_?: boolean;
}
export declare function ModelEnter(opt?: IClassOpt): <T extends typeof ModelBaseClass>(constructor: T, _?: any) => T;
export {};
