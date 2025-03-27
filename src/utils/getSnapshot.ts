import type {
  AnyMachine,
  ContextFrom,
  InterpreterFrom,
  State,
} from '@bemedev/app-ts';
import { dequal } from 'dequal';
import type { RefObject } from 'react';

export function getSnapshot<const M extends AnyMachine = AnyMachine>(
  service: InterpreterFrom<M>,
  ref: RefObject<State<ContextFrom<M>>>,
) {
  const snapShot = service.snapshot;

  const check = dequal(snapShot, ref.current);
  if (check) return ref.current;

  ref.current = snapShot;
  return ref.current;
}
