import {
  interpret as _interpret,
  getByKey,
  type Config,
  type GetEventsFromConfig,
  type Machine,
  type MachineOptions,
  type Mode,
  type SimpleMachineOptions2,
} from '@bemedev/app-ts';
import type { EventsMap, PromiseeMap } from '@bemedev/app-ts/lib/events';
import type { PrimitiveObject } from '@bemedev/app-ts/lib/types';
import type { Decompose, KeysMatching, State } from './types';
import { useSelector } from './useSelector';
import { defaultCompare, type Compare_F } from './utils';
import { reFunction } from './utils/reFunction';

export const interpret = <
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = GetEventsFromConfig<C>,
  P extends PromiseeMap = PromiseeMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, P, Pc, Tc>,
>(
  machine: Machine<C, Pc, Tc, E, P, Mo>,
  config: { pContext: Pc; context: Tc; mode?: Mode },
) => {
  const service = _interpret<C, Pc, Tc, E, P, Mo>(machine, config);

  const start = reFunction(service, 'start');
  const stop = reFunction(service, 'stop');
  const send = reFunction(service, 'send');
  const addOptions = reFunction(service, 'addOptions');

  const selector = (key: KeysMatching<State<Tc>>) => key;

  const useState = <
    D extends Decompose<State<Tc>>,
    K extends Extract<keyof D, string>,
    R extends D[K],
  >(
    key?: K,
    compare: Compare_F = defaultCompare,
  ) => {
    const out = useSelector<
      C,
      Pc,
      Tc,
      E,
      P,
      Mo,
      Extract<keyof D, string> extends K ? State<Tc> : R
    >(
      service,
      state => {
        return !key ? state : getByKey(state, key);
      },
      compare,
    );

    return out;
  };

  return { start, stop, send, selector, useState, addOptions };
};
