import {
  interpret as _interpret,
  getByKey,
  type AnyMachine,
  type ContextFrom,
  type Mode,
  type PrivateContextFrom,
  type State,
} from '@bemedev/app-ts';
import type { ExtractS, TrueO } from '@bemedev/types';
import type { Decompose } from './types';
import { useSelector } from './useSelector';
import { defaultCompare, reFunction, type Compare_F } from './utils';

export const interpret = <const M extends AnyMachine = AnyMachine>(
  machine: M,
  config: {
    pContext: PrivateContextFrom<M>;
    context: ContextFrom<M>;
    mode?: Mode;
  },
) => {
  type _State = State<ContextFrom<M>>;
  type Context = Decompose<Extract<ContextFrom<M>, TrueO>>;

  type Keys = keyof _State | `context.${ExtractS<keyof Context>}`;

  type St = {
    [K in Keys]: K extends `context.${infer R}`
      ? R extends keyof Context
        ? Context[R]
        : never
      : K extends keyof _State
        ? _State[K]
        : never;
  };

  const service = _interpret(machine, config);
  const start = reFunction(service, 'start');
  const stop = reFunction(service, 'stop');
  const send = reFunction(service, 'send');
  const addOptions = reFunction(service, 'addOptions');

  const useState = <K extends ExtractS<keyof St>, R extends St[K]>(
    key?: K,
    compare: Compare_F = defaultCompare,
  ) => {
    const out = useSelector<M, keyof St extends K ? _State : R>(
      service,
      state => (!key ? state : getByKey(state, key)),
      compare,
    );

    return out;
  };

  return { start, stop, send, useState, addOptions };
};
