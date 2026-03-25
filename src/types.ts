import type { types } from '@bemedev/types';

type ToPaths<
  T,
  D extends string = '.',
  P extends string = '',
> = T extends types.Ru
  ? Required<{
      [K in keyof T]: ToPaths<T[K], D, `${P}${K & string}${D}`>;
    }>[keyof T]
  : {
      path: P extends `${infer P}${D}` ? P : never;
      type: T;
    };
type FromPaths<
  T extends {
    path: string;
    type: unknown;
  },
> = {
  [P in T['path']]: Extract<
    T,
    {
      path: P;
    }
  >['type'];
};
/**
 * From "Acid Coder"
 */
export type Decompose<
  T extends types.TrueObject,
  D extends string = '.',
> = types.NotUndefined<FromPaths<ToPaths<T, D>>>;

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type Decompose2<T> = {
  [K in Path<T>]: PathValue<T, K>;
};
