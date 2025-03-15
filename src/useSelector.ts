import type {
  Config,
  GetEventsFromConfig,
  Interpreter,
  MachineOptions,
  SimpleMachineOptions2,
} from '@bemedev/app-ts';
import type { EventsMap, PromiseeMap } from '@bemedev/app-ts/lib/events';
import type {
  FnMapReduced,
  PrimitiveObject,
} from '@bemedev/app-ts/lib/types';
import useSyncExternalStoreWithSelector from '@bemedev/react-sync';
import { useCallback, useRef } from 'react';
import type { State } from './types';
import {
  defaultCompare,
  defaultSelector,
  getSnapshot,
  type Compare_F,
} from './utils';

export const useSelector = <
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = GetEventsFromConfig<C>,
  P extends PromiseeMap = PromiseeMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, P, Pc, Tc>,
  T = State<Tc>,
>(
  service: Interpreter<C, Pc, Tc, E, P, Mo>,
  selector: (emitted: State<Tc>) => T = defaultSelector,
  compare: Compare_F<T> = defaultCompare,
) => {
  const initialStateCacheRef = useRef<State<Tc>>({
    status: 'idle',
    scheduleds: 0,
  });

  type Listener = FnMapReduced<E, P, Tc>;

  const subscribe = useCallback(
    (listerner: Listener) => {
      const { unsubscribe } = service.subscribe(listerner);
      return unsubscribe;
    },
    [service],
  );

  const boundGetSnapshot = useCallback(() => {
    return getSnapshot<C, Pc, Tc, E, P, Mo>(service, initialStateCacheRef);
  }, [service]);

  const selectedSnapshot = useSyncExternalStoreWithSelector(
    subscribe,
    boundGetSnapshot,
    boundGetSnapshot,
    selector,
    compare,
  );

  return selectedSnapshot;
};
