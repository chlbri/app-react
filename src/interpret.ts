import {
  interpret as _interpret,
  getByKey,
  type AnyMachine,
  type ContextFrom,
  type Mode,
  type PrivateContextFrom,
} from '@bemedev/app-ts';
import type { Decompose, KeysMatching, State } from './types';
import { useSelector } from './useSelector';
import { defaultCompare, identity, type Compare_F } from './utils';
import { reFunction } from './utils/reFunction';

export const interpret = <const M extends AnyMachine = AnyMachine>(
  machine: M,
  config: {
    pContext: PrivateContextFrom<M>;
    context: ContextFrom<M>;
    mode?: Mode;
  },
) => {
  type _State = State<ContextFrom<M>>;

  const service = _interpret(machine, config);
  const start = reFunction(service, 'start');
  const stop = reFunction(service, 'stop');
  const send = reFunction(service, 'send');
  const addOptions = reFunction(service, 'addOptions');
  const selector = identity<KeysMatching<_State>>;

  const useState = <
    D extends Decompose<_State>,
    K extends Extract<keyof D, string>,
    R extends D[K],
  >(
    key?: K,
    compare: Compare_F = defaultCompare,
  ) => {
    const out = useSelector<M, keyof D extends K ? _State : R>(
      service,
      state => (!key ? state : getByKey(state, key)),
      compare,
    );

    return out;
  };

  return { start, stop, send, selector, useState, addOptions };
};
