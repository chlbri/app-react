import type {
  AnyMachine,
  InterpreterFrom,
  StateFrom,
} from '@bemedev/app-ts';
import useSyncExternalStoreWithSelector from '@bemedev/react-sync';
import { dequal } from 'dequal';
import { useCallback, useRef } from 'react';
import { getSnapshot, type Compare_F } from './utils';

export const useSelector = <
  const M extends AnyMachine = AnyMachine,
  T = StateFrom<M>,
>(
  service: InterpreterFrom<M>,
  selector: (emitted: StateFrom<M>) => T,
  compare: Compare_F = dequal,
) => {
  type _State = StateFrom<M>;

  const initialStateCacheRef = useRef<_State>(undefined as any);

  type Listener = (state: _State) => void;

  const subscribe = useCallback(
    (listerner: Listener) => {
      const subscriber = service.subscribe(listerner);
      return () => subscriber.unsubscribe();
    },
    [service],
  );

  const boundGetSnapshot = useCallback(() => {
    return getSnapshot<M>(service, initialStateCacheRef as any);
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
