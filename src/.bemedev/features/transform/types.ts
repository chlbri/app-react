import type { AnyArray, Keys, NOmit, Ru, SoRa } from '../../globals/types';
import type {
  ARRAY,
  CUSTOM,
  MAYBE,
  PARTIAL,
  PRIMITIVES,
  PRIMITIVE_OBJECTS,
} from './constants';

/**
 * PrimitiveS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type PrimitiveS = (typeof PRIMITIVES)[number];
type TransformPrimitiveS<T extends PrimitiveS> = T extends 'string'
  ? string
  : T extends 'number'
    ? number
    : T extends 'boolean'
      ? boolean
      : T extends 'null'
        ? null
        : T extends 'undefined'
          ? undefined
          : T extends 'symbol'
            ? symbol
            : never;

/**
 * Types type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Types = PrimitiveS | (typeof PRIMITIVE_OBJECTS)[number];

/**
 * TransformTypes type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type TransformTypes<T extends Types> = T extends PrimitiveS
  ? TransformPrimitiveS<T>
  : T extends 'date'
    ? Date
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {};

/**
 * Custom type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Custom<T = any> = {
  [CUSTOM]: T;
};

/**
 * PartialCustom type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type PartialCustom = {
  [PARTIAL]: undefined;
};

/**
 * __ObjectS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type __ObjectS = Types | ObjectMapS | Custom | PartialCustom;

/**
 * Maybe type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Maybe<
  T extends __ObjectS | ArrayCustom | __ObjectS[] = __ObjectS,
> = {
  [MAYBE]: T;
};

/**
 * ArrayCustom type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type ArrayCustom<T extends __ObjectS | Maybe = __ObjectS> = {
  [ARRAY]: T;
};

/**
 * ObjectMapS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type ObjectMapS = {
  [key: Keys]: SoRa<_ObjectS>;
};

type _ObjectS = __ObjectS | Maybe | ArrayCustom;

/**
 * A type that represents a primitive object, which can be a primitive value or an object
 *
 * @remark
 */
/**
 * ObjectS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type ObjectS = _ObjectS | SoRa<_ObjectS>;
/**
 * POS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type POS = ObjectS;

type ReduceTuple2<T extends AnyArray<ObjectS>> = T extends [
  infer First,
  ...infer Rest extends AnyArray<ObjectS>,
]
  ? [TransformS<First>, ...ReduceTuple2<Rest>]
  : T extends AnyArray<infer A extends ObjectS>
    ? TransformS<A>[]
    : [];

type __TransformPrimitiveObject<T> = T extends Types
  ? TransformTypes<T>
  : T extends Custom<infer TCustom>
    ? TCustom
    : T extends AnyArray<ObjectS>
      ? ReduceTuple2<T>
      : T extends ArrayCustom<infer A>
        ? TransformS<A>[]
        : T extends PartialCustom
          ? Partial<__TransformPrimitiveObject<NOmit<T, typeof PARTIAL>>>
          : T extends Maybe<infer TMaybe>
            ? __TransformPrimitiveObject<TMaybe> | undefined
            : {
                [K in keyof T]: __TransformPrimitiveObject<T[K]>;
              };

type ReduceTupleU<T extends AnyArray> = T extends [
  infer First,
  ...infer Rest extends AnyArray,
]
  ? [Undefiny<First>, ...ReduceTupleU<Rest>]
  : T[number] extends never
    ? []
    : T['length'] extends 0
      ? []
      : number extends T['length']
        ? T
        : Undefiny<T[number]>[];
type HasUndefined<T> = undefined extends T ? true : false;
type UndefinyObject<T extends object> = {
  [K in keyof T as HasUndefined<T[K]> extends true ? never : K]: Undefiny<
    T[K]
  >;
} & {
  [K in keyof T as HasUndefined<T[K]> extends true ? K : never]?: Undefiny<
    Exclude<T[K], undefined>
  >;
} extends infer F
  ? {
      [K in keyof F]: F[K];
    }
  : never;

type Undefiny<T> = T extends AnyArray
  ? ReduceTupleU<T>
  : T extends Ru
    ? UndefinyObject<T>
    : T;
/**
 * TransformS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type TransformS<T> = Undefiny<__TransformPrimitiveObject<T>>;

/**
 * inferT type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type inferT<T extends ObjectS> = TransformS<T>;
