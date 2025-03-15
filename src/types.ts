import type { Mode, WorkingStatus } from '@bemedev/app-ts';
import type { StateValue } from '@bemedev/app-ts/lib/states';
import type { PrimitiveObject } from '@bemedev/app-ts/lib/types';
import { TrueObject, type NotSubType, type Ru } from '@bemedev/types';

export type State<Tc extends PrimitiveObject> = {
  context?: Tc;
  mode?: Mode;
  scheduleds: number;
  status: WorkingStatus;
  value?: StateValue;
};

export type KeysMatching<
  T extends TrueObject,
  AddObjectKeys extends boolean = true,
  Key extends keyof T = keyof T,
> = Key extends string
  ? Required<T[Key]> extends TrueObject
    ?
        | `${Key}.${KeysMatching<Required<T[Key]>, AddObjectKeys> & string}`
        | (AddObjectKeys extends true ? Key : never)
    : Key
  : never;

type ToPaths<
  T,
  D extends string = '.',
  P extends string = '',
> = T extends Ru
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
  T extends TrueObject,
  D extends string = '.',
> = NotSubType<FromPaths<ToPaths<T, D>>, undefined>;
