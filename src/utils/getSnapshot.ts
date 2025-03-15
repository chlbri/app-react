import type {
  AnyMachine,
  ContextFrom,
  InterpreterFrom,
} from '@bemedev/app-ts';
import { dequal } from 'dequal';
import type { RefObject } from 'react';
import type { State } from '../types';

export function getSnapshot<const M extends AnyMachine = AnyMachine>(
  service: InterpreterFrom<M>,
  ref: RefObject<State<ContextFrom<M>>>,
) {
  const snapShot = service.getSnapshot();

  const check = dequal(snapShot, ref.current);
  if (check) return ref.current;

  ref.current = snapShot;
  return ref.current;
}
