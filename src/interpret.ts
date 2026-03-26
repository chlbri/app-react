import {
  getByKey as _getByKey,
  interpret as _interpret,
  InterpretArgs,
  type AnyMachine,
  type StateFrom,
  type DecomposedStateFrom,
} from '@bemedev/app-ts';
import { useSelector } from './useSelector';
import { defaultCompare, reFunction, type Compare_F } from './utils';

export const interpret = <const M extends AnyMachine = AnyMachine>(
  ...args: InterpretArgs<M>
) => {
  type _State = StateFrom<M>;
  type D = DecomposedStateFrom<M>;

  const service = (_interpret as any)(...args);
  const start = reFunction(service, 'start');
  const stop = reFunction(service, 'stop');
  const send = reFunction(service, 'send');
  const addOptions = reFunction(service, 'addOptions');

  const useState = <T>(
    selector: (state: _State) => T,
    compare: Compare_F<T> = defaultCompare,
  ) => {
    return useSelector<M, T>(service, selector, compare);
  };

  useState.byKey = <
    K extends keyof D = never,
    T extends K extends never ? _State : D[K] = K extends never
      ? _State
      : D[K],
  >(
    key?: K,
    compare: Compare_F<T> = defaultCompare,
  ) => {
    const out = useSelector<M, T>(
      service,
      state => (!key ? state : _getByKey.low(state, key as any)),
      compare,
    );

    return out;
  };

  return { start, stop, send, useState, addOptions };
};
