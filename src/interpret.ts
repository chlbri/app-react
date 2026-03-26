import { expandFn } from '#bemedev/globals/utils/expandFn';
import {
  getByKey as _getByKey,
  interpret as _interpret,
} from '@bemedev/app-ts';
import { Interpret_F } from './types';
import { useSelector } from './useSelector';
import { defaultCompare } from './utils';

export const interpret: Interpret_F = (...args) => {
  const service = (_interpret as any)(...args);

  return {
    start: service.start,
    stop: service.stop,
    send: service.send,
    useState: expandFn(
      (selector, compare = defaultCompare) => {
        return useSelector(service, selector, compare);
      },
      {
        byKey: (key?: any, compare = defaultCompare) =>
          useSelector(
            service,
            state => (!key ? state : _getByKey.low(state, key)),
            compare,
          ),
      },
    ),
    addOptions: service.addOptions,
  };
};
