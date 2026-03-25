import { createMachine, typings } from '@bemedev/app-ts';
import { DELAY } from './constants';

// #region machine1
export const machine1 = createMachine(
  {
    initial: 'idle',

    states: {
      idle: {
        activities: {
          DELAY: 'inc',
        },
        on: {
          NEXT: { target: '/final', description: 'Next' },
        },
      },
      final: {},
    },
  },
  typings({
    eventsMap: { NEXT: 'primitive' },
    context: { iterator: 'number' },
  }),
);

machine1.addOptions(({ assign }) => ({
  actions: {
    inc: assign('context.iterator', ({ context }) => context.iterator + 1),
  },
  delays: {
    DELAY,
  },
}));
// #endregion
