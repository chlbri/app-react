import type {
  AnyMachine,
  InterpreterFrom,
  StateFrom,
} from '@bemedev/app-ts';
import { dequal } from 'dequal';
import type { RefObject } from 'react';

export function getSnapshot<const M extends AnyMachine = AnyMachine>(
  service: InterpreterFrom<M>,
  ref: RefObject<StateFrom<M>>,
) {
  const snapShot = service.state;

  const check = dequal(snapShot, ref.current);
  if (check) return ref.current;

  ref.current = snapShot;
  return ref.current;
}
