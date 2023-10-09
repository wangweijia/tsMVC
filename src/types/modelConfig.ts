export interface IConfig {
  // 数据源 key，用于对应原始数据，不传默认与 对象字段相同
  key?: string;
  // 是否可以 赋值 null
  enableNULL?: boolean;
  // 格式化 数据(DTO)
  formatValue?: (value: any, baseValue: any) => any;
  // 格式化 数据(OTD)
  formatData?: (value: any, baseValue: any) => any;
  // 忽略 数据属性 初始为 对象
  ignoreDTO?: boolean;
  // 忽略 对象属性 生成为 数据
  ignoreOTD?: boolean;
}

// 普通类型
export interface ISingleConfig extends IConfig {
  type?: 'single';
}

// 对象类型
export interface IObjectConfig extends IConfig {
  type: 'object';
  objectItem: 'Self' | (new (...p: any) => any);
}

// 数组类型
export interface IArrayConfig extends IConfig {
  type: 'array';
  arrayItem: 'Self' | (new (...p: any) => any);
}

// 时间类型
export interface IDateConfig extends IConfig {
  type: 'date';
  formatDTOKey?: string;
  formatOTDKey?: string;
}

export interface IUUIDConfig extends IConfig {
  type: 'UUID';
}

export type TConfig = ISingleConfig | IArrayConfig | IObjectConfig | IDateConfig | IUUIDConfig;
