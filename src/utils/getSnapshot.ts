import type {
  Config,
  GetEventsFromConfig,
  Interpreter,
  MachineOptions,
  SimpleMachineOptions2,
} from '@bemedev/app-ts';
import type { EventsMap, PromiseeMap } from '@bemedev/app-ts/lib/events';
import type { PrimitiveObject } from '@bemedev/app-ts/lib/types';
import { dequal } from 'dequal';
import type { RefObject } from 'react';
import type { State } from '../types';

export function getSnapshot<
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = GetEventsFromConfig<C>,
  P extends PromiseeMap = PromiseeMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, P, Pc, Tc>,
>(service: Interpreter<C, Pc, Tc, E, P, Mo>, ref: RefObject<State<Tc>>) {
  const snapShot = service.getSnapshot();

  const check = dequal(snapShot, ref.current);
  if (check) return ref.current;

  ref.current = snapShot;
  return ref.current;
}
