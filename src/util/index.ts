const global = globalThis as any;

export function getUUID() {
  if (!global.__mvc_uuid__) {
    global.__mvc_uuid__ = new Date().valueOf();
  }

  return `${(global.__mvc_uuid__ += 1)}`;
}

type ConvertUnderlineToCamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<ConvertUnderlineToCamelCase<Rest>>}`
  : S;

export function convertUnderlineToCamelCaseFun<S extends string>(str: S): ConvertUnderlineToCamelCase<S> {
  return str.replace(/_./g, (match) => match.charAt(1).toUpperCase()) as ConvertUnderlineToCamelCase<S>;
}

export function convertCamelToUnderlineFun(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}
