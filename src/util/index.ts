const global = globalThis as any;

export function getUUID() {
  if (!global.__mvc_uuid__) {
    global.__mvc_uuid__ = new Date().valueOf();
  }

  return `${(global.__mvc_uuid__ += 1)}`;
}
