import { t } from '@bemedev/types';
import { DELAY } from './constants';
import { createMachine } from '@bemedev/app-ts';

// #region machine1
export const machine1 = createMachine(
  {
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
  {
    eventsMap: {
      NEXT: {},
    },
    context: t.buildObject({ iterator: t.number }),
    pContext: t.object,
    promiseesMap: {},
  },
  { '/': 'idle' },
);

machine1.addOptions(() => ({
  actions: {
    inc: (pContext, context) => {
      context.iterator++;
      return { context, pContext };
    },
  },
  delays: {
    DELAY,
  },
}));
// #endregion
