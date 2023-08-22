import 'reflect-metadata';
import { TConfig } from './types/modelConfig';
declare class BaseClass {
    [k: string]: any;
    constructor(...args: any[]);
    _init_?(...p: any): void;
    _initUUID_?(): string;
}
export declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
export declare function ModelAutoUUID(): (target: any, propertyKey: any) => void;
interface IClassOpt {
    _debugger_?: boolean;
}
export declare function ModelEnter(opt?: IClassOpt): <T extends typeof BaseClass>(constructor: T, _?: any) => T;
export {};
