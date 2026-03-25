import {
  interpret as _interpret,
  getByKey,
  type AnyMachine,
  type ContextFrom,
  type Mode,
  type PrivateContextFrom,
  type StateFrom,
} from '@bemedev/app-ts';
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
  type _State = StateFrom<M>;

  const service = _interpret(machine, config);
  const start = reFunction(service, 'start');
  const stop = reFunction(service, 'stop');
  const send = reFunction(service, 'send');
  const addOptions = reFunction(service, 'addOptions');

  const useState = <K extends string, R = unknown>(
    key?: K,
    compare: Compare_F = defaultCompare,
  ) => {
    const out = useSelector<M, K extends undefined ? _State : R>(
      service,
      state => (!key ? state : (getByKey as any)(state, key)),
      compare,
    );

    return out;
  };

  return { start, stop, send, useState, addOptions };
};
