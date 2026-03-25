type Fn<P extends any[] = any, R = any> = (...arg: P) => R;
type KeysFn<T extends object = object> = {
  [K in keyof T]: T[K] extends Fn ? K : never;
}[keyof T];

function _reFunction<P extends any[] = any[], R = any>(
  fn: Fn<P, R>,
  bind: any,
) {
  return (...args: P) => fn.bind(bind)(...args);
}

export function reFunction<
  T extends object = object,
  FnKey extends KeysFn<T> = KeysFn<T>,
>(object: T, fn: FnKey) {
  const _fn = object[fn];
  type Pm = T[FnKey] extends (...args: infer P) => any ? P : any[];
  type Re = T[FnKey] extends (...args: any) => infer R ? R : any;
  return _reFunction<Pm, Re>(_fn as any, object);
}
