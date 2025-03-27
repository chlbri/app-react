import type {
  AnyMachine,
  ContextFrom,
  InterpreterFrom,
  State,
} from '@bemedev/app-ts';
import useSyncExternalStoreWithSelector from '@bemedev/react-sync';
import { t } from '@bemedev/types';
import { dequal } from 'dequal';
import { useCallback, useRef } from 'react';
import { getSnapshot, type Compare_F } from './utils';

export const useSelector = <
  const M extends AnyMachine = AnyMachine,
  T = State<ContextFrom<M>>,
>(
  service: InterpreterFrom<M>,
  selector: (emitted: State<ContextFrom<M>>) => T,
  compare: Compare_F = dequal,
) => {
  type _State = State<ContextFrom<M>>;

  const initialStateCacheRef = useRef<_State>(t.any<_State>(undefined));

  type Listener = (state: _State) => void;

  const subscribe = useCallback(
    (listerner: Listener) => {
      const unsubscribe = service.__subscribeState(listerner);
      return unsubscribe;
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
