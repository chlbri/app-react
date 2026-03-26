import type {
  any,
  custom,
  intersection,
  litterals,
  maybe,
  partial,
  record,
  soa,
  sora,
  sv,
  union,
  array,
  tuple,
} from './helpers';
import type { ObjectS, TransformS } from './types';

/**
 * Helpers type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Helpers = {
  any: typeof any;
  custom: typeof custom;
  intersection: typeof intersection;
  litterals: typeof litterals;
  maybe: typeof maybe;
  partial: typeof partial;
  record: typeof record;
  soa: typeof soa;
  sora: typeof sora;
  sv: typeof sv;
  union: typeof union;
  array: typeof array;
  tuple: typeof tuple;
};

/**
 * Transform_F type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Transform_F = <T extends ObjectS = ObjectS>(
  option: (helpers: Helpers) => T,
) => TransformS<T>;
