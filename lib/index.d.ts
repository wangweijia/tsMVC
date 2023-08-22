import 'reflect-metadata';
import { TConfig } from './types/modelConfig';
export declare function ModelCol(config: TConfig): (target: any, propertyKey: any) => void;
export declare function ModelAutoUUID(): (target: any, propertyKey: any) => void;
interface IClassOpt {
    _debugger_?: boolean;
}
export declare function ModelEnter(opt?: IClassOpt): (constructor: any, _?: any) => any;
export {};
