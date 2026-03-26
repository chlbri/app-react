import {
  AnyMachine,
  InterpretArgs,
  StateFrom,
  DecomposedStateFrom,
  EventsMapFrom,
  AddOptionsFrom,
} from '@bemedev/app-ts';
import { Compare_F } from './utils';
import { EventArg } from '@bemedev/app-ts/lib/events';

type VoidFn = () => Promise<void>;

export type Return_F<M extends AnyMachine> = {
  start: VoidFn;
  stop: VoidFn;
  send: (event: EventArg<EventsMapFrom<M>>) => void;
  useState: {
    <T>(selector: (state: StateFrom<M>) => T, compare?: Compare_F<T>): T;
    byKey<
      K extends keyof DecomposedStateFrom<M> = never,
      T extends K extends never
        ? StateFrom<M>
        : DecomposedStateFrom<M>[K] = K extends never
        ? StateFrom<M>
        : DecomposedStateFrom<M>[K],
    >(
      key?: K,
      compare?: Compare_F<T>,
    ): T;
  };
  addOptions: AddOptionsFrom<M>;
};

export type Interpret_F = <const M extends AnyMachine = AnyMachine>(
  ...args: InterpretArgs<M>
) => Return_F<M>;
