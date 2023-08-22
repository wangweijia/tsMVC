export interface IConfig {
  // 数据源 key，用于对应原始数据，不传默认与 对象字段相同
  key?: string;
  // 是否可以 赋值 null
  enableNULL?: boolean;
  // 格式化 数据
  formatValue?: (value: any, baseValue: any) => any;
}

// 普通类型
export interface ISingleConfig extends IConfig {
  type?: 'single';
}

// 对象类型
export interface IObjectConfig extends IConfig {
  type: 'object';
  objectItem: any;
}

// 数组类型
export interface IArrayConfig extends IConfig {
  type: 'array';
  arrayItem: any;
}

// 时间类型
export interface IDateConfig extends IConfig {
  type: 'date';
  formatStr: string;
}

export interface IUUIDConfig extends IConfig {
  type: 'UUID';
}

export type TConfig = ISingleConfig | IArrayConfig | IObjectConfig | IDateConfig | IUUIDConfig;
